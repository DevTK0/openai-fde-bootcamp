import assert from "node:assert/strict"
import process from "node:process"
import { randomUUID } from "node:crypto"
import { join } from "node:path"
import { readFile, writeFile } from "node:fs/promises"
const base = process.argv[2] || "http://localhost:3011"
const origin = process.argv[3] || new URL(base).origin
const fixture = JSON.parse(
  await readFile(
    new URL("../public/evidence/example-bundle.json", import.meta.url),
    "utf8"
  )
)
async function request(path, options) {
  const response = await fetch(base + path, options)
  const body = await response.json()
  return { status: response.status, body }
}
const post = (b) => ({
  method: "POST",
  headers: { "content-type": "application/json", origin },
  body: JSON.stringify(b),
})
const first = await request("/api/workspace", post(fixture))
assert.equal(first.status, 200)
const id = first.body.revision.id
const second = await request("/api/workspace", post(fixture))
assert.equal(second.body.revision.id, id)
assert.equal(second.body.created, false)
const analysis = await request(`/api/workspace/${id}`)
assert.equal(analysis.status, 200)
const metric = (name) => analysis.body.metrics.find((m) => m.id === name)
assert.equal(metric("repair_cost").value, 500)
assert.equal(metric("completion").value, 80)
assert.equal(metric("on_time").value, 75)
assert.equal(metric("boardings").value, 200)
assert.equal(metric("queued_calls").value, 20)
const altered = structuredClone(fixture)
altered.name += " changed"
altered.tables[1].rows[0].values.boardings = 350
const newer = await request("/api/workspace", post(altered))
assert.notEqual(newer.body.revision.id, id)
assert.equal(
  (await request(`/api/workspace/${id}`)).body.metrics.find(
    (m) => m.id === "boardings"
  ).value,
  200
)
assert.equal(
  (await request(`/api/workspace/${newer.body.revision.id}`)).body.metrics.find(
    (m) => m.id === "boardings"
  ).value,
  350
)
assert.equal((await request("/api/workspace", post({}))).status, 400)
assert.equal(
  (
    await request("/api/workspace", {
      ...post(fixture),
      headers: {
        "content-type": "application/json",
        origin: "https://other.example",
      },
    })
  ).status,
  403
)
assert.equal(
  (
    await request("/api/workspace", {
      ...post(fixture),
      headers: { "content-type": "application/json" },
    })
  ).status,
  403
)
const empty = await request(`/api/workspace/${id}?vehicle=UNKNOWN`)
assert.ok(empty.body.metrics.every((m) => m.value === null))
const rows = await request(`/api/workspace/${id}?view=table&table=maintenance`)
assert.equal(rows.body.rows[0].citation.revision, id)
const detail = await request(
  `/api/workspace/${id}?view=row&table=maintenance&row=row-1`
)
assert.equal(detail.body.row.values.repair_cost_sgd, 500)
assert.equal(detail.body.row.citation.revision, id)
assert.equal(
  (
    await request(
      `/api/workspace/${id}?view=row&table=maintenance&row=row-1&vehicle=UNKNOWN`
    )
  ).status,
  404
)
const completion = await request(
  `/api/workspace/${id}?view=context&q=trip%20completion`
)
assert.equal(completion.body.status, "evidence-found")
assert.equal(
  completion.body.metrics.find((m) => m.id === "completion").value,
  80
)
assert.ok(JSON.stringify(completion.body).length <= 32000)
const context = await request(
  `/api/workspace/${id}?view=context&q=repair%20DEMO-V001`
)
assert.equal(context.body.status, "evidence-found")
assert.ok(
  context.body.evidence.some(
    (e) => e.type === "row" && e.citation.rowId === "row-1"
  )
)
assert.equal(
  (await request(`/api/workspace/${id}?view=context&q=unfindablexyz`)).body
    .status,
  "insufficient"
)
const scoped = structuredClone(fixture)
scoped.name = "Short service scope verification"
scoped.tables[1].rows[0].values.service = "12"
scoped.tables[1].rows.push({
  id: "other-service",
  values: { ...scoped.tables[1].rows[0].values, service: "34", boardings: 900 },
})
const scopedRevision = (await request("/api/workspace", post(scoped))).body
  .revision.id
const query = async (question) =>
  (
    await request(
      `/api/workspace/${scopedRevision}?view=context&q=${encodeURIComponent(question)}`
    )
  ).body
assert.equal(
  (await query("passenger boardings service 12")).metrics.find(
    (m) => m.id === "boardings"
  ).value,
  200
)
assert.equal(
  (await query("passenger boardings")).metrics.find((m) => m.id === "boardings")
    .value,
  1100
)
for (const question of [
  "passenger boardings service 999999",
  "passenger boardings services 12 and 34",
]) {
  const unresolved = await query(question)
  assert.deepEqual(unresolved.metrics, [])
  assert.equal(unresolved.status, "insufficient")
  assert.ok(unresolved.unresolvedScope.length)
}
assert.ok(
  context.body.missingEvidence.includes(
    "Service-date operational aggregates cannot be allocated to an individual vehicle."
  )
)
const concurrentBundle = {
  ...fixture,
  name: `Concurrent verification ${randomUUID()}`,
}
const concurrent = await Promise.all(
  Array.from({ length: 20 }, () =>
    request("/api/workspace", post(concurrentBundle))
  )
)
assert.ok(concurrent.every((r) => r.status === 200))
assert.equal(concurrent.filter((r) => r.body.created).length, 1)
assert.equal(new Set(concurrent.map((r) => r.body.revision.id)).size, 1)
if (process.argv[4]) {
  const damagedId = concurrent[0].body.revision.id
  assert.match(damagedId, /^[a-f0-9]{64}$/)
  const path = join(process.argv[4], `${damagedId}.json`)
  await writeFile(path, "broken verification revision")
  const failed = await request("/api/workspace", post(concurrentBundle))
  assert.equal(failed.status, 500)
  assert.equal(failed.body.error, "Evidence workspace unavailable")
  assert.equal(await readFile(path, "utf8"), "broken verification revision")
}
const listed = await request("/api/workspace")
assert.ok(listed.body.revisions.some((r) => r.id === id))
console.log(
  JSON.stringify(
    {
      result: "PASS",
      revision: id,
      newRevision: newer.body.revision.id,
      checks:
        "import, idempotency, immutable isolation, metrics, filters, citations, insufficient evidence, malformed input, same-origin, short service scope, unknown scope, concurrent deduplication",
      corruptReimport: process.argv[4]
        ? "PASS"
        : "not run; pass the isolated server data directory as the third argument",
      persistence:
        "Run this driver again after server restart; revision ID must match.",
    },
    null,
    2
  )
)
