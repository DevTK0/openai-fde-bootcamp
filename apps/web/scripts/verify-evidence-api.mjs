import assert from "node:assert/strict"
import process from "node:process"
import { readFile } from "node:fs/promises"
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
const listed = await request("/api/workspace")
assert.ok(listed.body.revisions.some((r) => r.id === id))
console.log(
  JSON.stringify(
    {
      result: "PASS",
      revision: id,
      newRevision: newer.body.revision.id,
      checks:
        "import, idempotency, immutable isolation, metrics, filters, citations, insufficient evidence, malformed input, same-origin",
      persistence:
        "Run this driver again after server restart; revision ID must match.",
    },
    null,
    2
  )
)
