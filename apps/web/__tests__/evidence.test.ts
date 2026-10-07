// @vitest-environment node
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import fixture from "../public/evidence/example-bundle.json"
import { bundleSchema, filterSchema } from "../lib/evidence/schema"
import { analyse, inspectRow } from "../lib/evidence/analysis"
import { retrieveContext } from "../lib/evidence/context"
import { saveBundle, loadBundle, listBundles } from "../lib/evidence/store"
import { seedBundle } from "../lib/evidence/seed"
import { readImport, maxImportBytes } from "../lib/evidence/http"
const filters = filterSchema.parse({})
const directories: string[] = []
afterEach(async () => {
  await Promise.all(
    directories.splice(0).map((d) => rm(d, { recursive: true, force: true }))
  )
})
describe("evidence revisions", () => {
  it("loads grounded seed with one canonical ledger and original documents", () => {
    expect(
      seedBundle.tables.filter((t) => t.kind === "maintenance")
    ).toHaveLength(1)
    expect(
      seedBundle.sources.some((s) => s.reference.includes("data-dictionary"))
    ).toBe(true)
    expect(
      analyse(seedBundle, "seed", filters).metrics.every(
        (m) => m.value !== null
      )
    ).toBe(true)
  })
  it("persists, deduplicates concurrent imports and isolates a changed revision", async () => {
    const directory = await mkdtemp(join(tmpdir(), "evidence-"))
    directories.push(directory)
    const results = await Promise.all(
      Array.from({ length: 20 }, () => saveBundle(fixture, directory))
    )
    expect(results.filter((r) => r.created)).toHaveLength(1)
    const first = results[0]
    if (!first) throw new Error("No import")
    const changed = { ...fixture, name: "Changed revision" }
    const newer = await saveBundle(changed, directory)
    expect(newer.revision.id).not.toBe(first.revision.id)
    expect((await loadBundle(first.revision.id, directory)).name).toBe(
      "Fresh service review example"
    )
    expect((await listBundles(directory)).revisions).toHaveLength(2)
    await expect(loadBundle("../escape", directory)).rejects.toThrow()
  })
  it("keeps healthy revisions visible when another revision is damaged", async () => {
    const directory = await mkdtemp(join(tmpdir(), "evidence-"))
    directories.push(directory)
    const saved = await saveBundle(fixture, directory)
    expect((await listBundles(directory)).revisions).toHaveLength(1)
    await writeFile(join(directory, `${saved.revision.id}.json`), "broken")
    const healthy = await saveBundle({ ...fixture, name: "Healthy" }, directory)
    expect((await listBundles(directory)).revisions.map((r) => r.id)).toEqual([
      healthy.revision.id,
    ])
    expect((await listBundles(directory)).unavailableRevisions).toEqual([
      saved.revision.id,
    ])
  })
  it.each(["broken", JSON.stringify({ ...fixture, name: "Tampered" })])(
    "rejects duplicate imports of a damaged revision without overwriting it",
    async (damage) => {
      const directory = await mkdtemp(join(tmpdir(), "evidence-"))
      directories.push(directory)
      const saved = await saveBundle(fixture, directory)
      const path = join(directory, `${saved.revision.id}.json`)
      await writeFile(path, damage)
      await expect(saveBundle(fixture, directory)).rejects.toThrow()
      expect(await readFile(path, "utf8")).toBe(damage)
    }
  )
  it.each(["1", "12", "012", "123456"])(
    "uses complete service identifiers %s independently of ranking terms",
    (service) => {
      const bundle = bundleSchema.parse(fixture)
      const table = bundle.tables.find((t) => t.kind === "operations")
      const row = table?.rows[0]
      if (!table || !row) throw new Error("Missing operations")
      row.values.service = service
      table.rows.push({
        id: "other",
        values: { ...row.values, service: "34", boardings: 900 },
      })
      const context = (question: string, selected = filters) =>
        retrieveContext(bundle, "rev", question, selected)
      const result = context(`passenger boardings service ${service}`)
      expect(result.filters.service).toBe(service)
      expect(result.metrics.find((m) => m.id === "boardings")?.value).toBe(200)
      expect(
        context("passenger boardings").metrics.find((m) => m.id === "boardings")
          ?.value
      ).toBe(1100)
      expect(
        context(
          `passenger boardings service ${service} on 2026-10-05`
        ).metrics.find((m) => m.id === "boardings")?.value
      ).toBe(200)
      for (const question of [
        "passenger boardings service 999999",
        "passenger boardings service:999999",
        `passenger boardings services ${service} and 999999`,
        `passenger boardings services ${service} and 34`,
        `passenger boardings service ${service} on 2026-99-01`,
        `passenger boardings service ${service} on 2026-10-05 and 2026-10-06`,
      ]) {
        const unresolved = context(question)
        expect(unresolved.metrics).toEqual([])
        expect(unresolved.status).toBe("insufficient")
      }
      expect(
        context(`passenger boardings service ${service}`, {
          ...filters,
          service: "34",
        }).metrics
      ).toEqual([])
      expect(
        context(`passenger boardings service ${service} on 2026-10-05`, {
          ...filters,
          from: "2026-11-01",
        }).metrics
      ).toEqual([])
      const longQuestion = `${Array.from({ length: 25 }, (_, i) => `term${i}`).join(" ")} service ${service}`
      expect(context(longQuestion).filters.service).toBe(service)
    }
  )
  it.each(["repair cost per 1000 km", "departures within 5 minutes"])(
    "keeps quantities out of entity scope for %s",
    (question) => {
      const bundle = bundleSchema.parse(fixture)
      const row = bundle.tables.find((t) => t.kind === "operations")?.rows[0]
      if (!row) throw new Error("Missing operations")
      row.values.service = question.includes("1000") ? "1000" : "5"
      const result = retrieveContext(bundle, "rev", question, filters)
      expect(result.filters.service).toBe("")
      expect(result.unresolvedScope).toEqual([])
      expect(result.status).toBe("evidence-found")
      expect(
        result.metrics.some((metric) => metric.status === "available")
      ).toBe(true)
    }
  )
  it("recognizes metric evidence without literal row matches", () => {
    const result = retrieveContext(
      bundleSchema.parse(fixture),
      "rev",
      "trip completion",
      filters
    )
    expect(result.status).toBe("evidence-found")
    expect(result.metrics.find((m) => m.id === "completion")?.value).toBe(80)
  })
  it.each([5, 15, 30])(
    "reports context truncation for %s supporting rows",
    (count) => {
      const bundle = bundleSchema.parse(fixture)
      const table = bundle.tables.find((t) => t.kind === "operations")
      const row = table?.rows[0]
      if (!table || !row) throw new Error("Missing operations")
      table.rows = Array.from({ length: count }, (_, i) => ({
        id: `day-${i + 1}`,
        values: {
          ...row.values,
          date: `2026-09-${String(i + 1).padStart(2, "0")}`,
        },
      }))
      const result = retrieveContext(
        bundle,
        "rev",
        "passenger boardings",
        filters
      )
      const metric = result.metrics.find((m) => m.id === "boardings")
      expect(metric?.citations).toHaveLength(3)
      expect(metric?.citationsTruncated).toBe(true)
      expect(result.truncation.truncated).toBe(true)
    }
  )
  it("preserves explanatory prose around dynamic figures in original findings", () => {
    const source = seedBundle.sources.find(
      (s) => s.id === "guide-crowding-findings"
    )
    expect(source?.text).toContain("boardings** are events, not unique people.")
    expect(source?.text).toContain(
      "It is not a count of people waiting simultaneously"
    )
  })
  it("filters supporting date aliases and early-year monthly records", () => {
    const bundle = bundleSchema.parse(fixture)
    const table = bundle.tables[0]
    if (!table || !table.rows[0]) throw new Error("Missing fixture")
    table.rows[0].values.month = "0099-01"
    expect(
      analyse(bundle, "rev", { ...filters, to: "0099-01-31" }).metrics[0]?.value
    ).toBe(500)
    bundle.tables.push({
      id: "dated-notes",
      sourceId: "demo",
      title: "Notes",
      kind: "evidence",
      caveats: [],
      columns: ["Opened at"],
      rows: [{ id: "note", values: { "Opened at": "2026-09-02 10:00:00" } }],
    })
    expect(
      analyse(bundle, "rev", { ...filters, from: "2026-09-01" }).tables.find(
        (t) => t.id === "dated-notes"
      )?.filteredRowCount
    ).toBe(1)
  })
  it("computes literal results with definitions, denominators and revision citations", () => {
    const result = analyse(bundleSchema.parse(fixture), "revision-one", filters)
    expect(result.metrics.map((m) => m.value)).toEqual([
      500, 500, 10, 80, 75, 200, 20,
    ])
    expect(result.metrics.find((m) => m.id === "on_time")).toMatchObject({
      numerator: 6,
      denominator: 8,
    })
    expect(result.metrics[0]?.citations[0]).toEqual({
      revision: "revision-one",
      sourceId: "demo",
      tableId: "maintenance",
      rowId: "row-1",
    })
  })
  it("keeps complete series and row counts while bounding citation samples", () => {
    const bundle = bundleSchema.parse(fixture)
    const table = bundle.tables.find((t) => t.kind === "operations")
    const row = table?.rows[0]
    if (!table || !row) throw new Error("Missing operations")
    table.rows = Array.from({ length: 30 }, (_, i) => ({
      id: `day-${i + 1}`,
      values: {
        ...row.values,
        date: `2026-09-${String(i + 1).padStart(2, "0")}`,
      },
    }))
    const metric = analyse(
      bundleSchema.parse(bundle),
      "rev",
      filters
    ).metrics.find((m) => m.id === "boardings")
    expect(metric?.value).toBe(6000)
    expect(metric?.rowCount).toBe(30)
    expect(metric?.citations).toHaveLength(25)
    expect(metric?.citationsTruncated).toBe(true)
    expect(metric?.series).toHaveLength(30)
    expect(metric?.series[29]).toEqual({ period: "2026-09-30", value: 200 })
  })
  it("does not turn unknown scope, partial months, missing numbers or plans into observations", () => {
    const bundle = bundleSchema.parse(fixture)
    expect(
      analyse(bundle, "x", { ...filters, vehicle: "MISSING" }).metrics.every(
        (m) => m.value === null
      )
    ).toBe(true)
    expect(
      analyse(bundle, "x", { ...filters, from: "2026-09-02" }).metrics.find(
        (m) => m.id === "repair_cost"
      )?.value
    ).toBeNull()
    const source = bundle.sources[0]
    if (source) source.kind = "planned"
    expect(
      analyse(bundle, "x", filters).metrics.every((m) => m.value === null)
    ).toBe(true)
    if (source) source.kind = "observed"
    const row = bundle.tables[0]?.rows[0]
    if (row) row.values.repair_cost_sgd = null
    expect(
      analyse(bundle, "x", filters).metrics.find((m) => m.id === "repair_cost")
        ?.value
    ).toBeNull()
  })
  it("excludes malformed dates in generic evidence rather than crashing filtered analysis", () => {
    const bundle = bundleSchema.parse(fixture)
    bundle.tables.push({
      id: "notes",
      title: "Notes",
      sourceId: "demo",
      kind: "evidence",
      columns: ["month"],
      caveats: [],
      rows: [
        { id: "bad-month", values: { month: "unknown" } },
        { id: "bad-date", values: { month: "2026-99-99" } },
      ],
    })
    const result = analyse(bundle, "rev", { ...filters, from: "2026-09-01" })
    expect(result.tables.find((t) => t.id === "notes")?.filteredRowCount).toBe(
      0
    )
  })
  it("resolves full row citations and enforces the selected scope", () => {
    const bundle = bundleSchema.parse(fixture)
    expect(
      inspectRow(bundle, "rev", "maintenance", "row-1", filters)?.row.values
        .repair_cost_sgd
    ).toBe(500)
    expect(
      inspectRow(bundle, "rev", "maintenance", "row-1", {
        ...filters,
        vehicle: "OTHER",
      })
    ).toBeNull()
  })
  it("rejects overlapping canonical tables, duplicate grains, invalid dates and nonfinite values", () => {
    const bundle = bundleSchema.parse(fixture),
      table = bundle.tables[0]
    if (!table) throw new Error("No table")
    expect(
      bundleSchema.safeParse({
        ...bundle,
        tables: [...bundle.tables, { ...table, id: "overlap" }],
      }).success
    ).toBe(false)
    table.rows.push({
      ...table.rows[0],
      id: "duplicate",
      values: { ...table.rows[0]?.values },
    })
    expect(bundleSchema.safeParse(bundle).success).toBe(false)
    table.rows.pop()
    const row = table.rows[0]
    if (!row) throw new Error("No row")
    row.values.month = "2026-13"
    expect(bundleSchema.safeParse(bundle).success).toBe(false)
    row.values.month = "2026-09"
    row.values.repair_cost_sgd = Infinity
    expect(bundleSchema.safeParse(bundle).success).toBe(false)
  })
  it("retrieves bounded cited evidence with exact entity matches and insufficient evidence", () => {
    const bundle = bundleSchema.parse(fixture)
    const result = retrieveContext(bundle, "rev", "repair DEMO-V001", filters)
    expect(result.status).toBe("evidence-found")
    expect(result.evidence.filter((e) => e.type === "row")).toHaveLength(1)
    expect(result.evidence[0]?.citation.revision).toBe("rev")
    expect(
      retrieveContext(bundle, "rev", "repair DEMO-V00", filters).status
    ).toBe("insufficient")
    expect(
      retrieveContext(bundle, "rev", "unfindablexyz", filters).status
    ).toBe("insufficient")
  })
  it("uses the questioned entity for numeric context and never silently supplies fleet totals", () => {
    const bundle = bundleSchema.parse(fixture)
    const table = bundle.tables.find((t) => t.kind === "maintenance")
    if (!table) throw new Error("No maintenance")
    table.rows.push({
      id: "row-2",
      values: {
        ...table.rows[0]?.values,
        vehicle_id: "DEMO-V002",
        repair_cost_sgd: 900,
      },
    })
    const result = retrieveContext(
      bundle,
      "rev",
      "repair cost DEMO-V001",
      filters
    )
    expect(result.filters.vehicle).toBe("DEMO-V001")
    expect(result.missingEvidence).toContain(
      "Service-date operational aggregates cannot be allocated to an individual vehicle."
    )
    expect(result.metrics.find((m) => m.id === "repair_cost")?.value).toBe(500)
    expect(
      retrieveContext(bundle, "rev", "repair cost DEMO-V999", filters).metrics
    ).toEqual([])
  })
  it("caps the entire serialized context, including adversarial caveats", () => {
    const bundle = bundleSchema.parse(fixture)
    for (const source of bundle.sources)
      source.caveats = Array.from(
        { length: 30 },
        (_, i) => `${i}${'quoted \"text\" '.repeat(1200)}`
      )
    for (const table of bundle.tables)
      table.caveats = Array.from(
        { length: 30 },
        (_, i) => `${i}${"long caveat ".repeat(1200)}`
      )
    const result = retrieveContext(
      bundle,
      "revision",
      "repair maintenance trips departures boardings queue cost",
      filters
    )
    expect(JSON.stringify(result).length).toBeLessThanOrEqual(32000)
    expect(result.truncation.truncated).toBe(true)
    expect(result.evidence.length).toBeGreaterThan(0)
  })
  it("rejects cross-origin and oversized streamed requests before parsing", async () => {
    const request = (body: string, origin = "http://localhost") =>
      new Request("http://localhost/api/workspace", {
        method: "POST",
        headers: { origin, "content-type": "application/json" },
        body,
      })
    await expect(
      readImport(request("{}", "https://attacker.example"))
    ).rejects.toMatchObject({ status: 403 })
    await expect(
      readImport(request("x".repeat(maxImportBytes + 1)))
    ).rejects.toMatchObject({ status: 413 })
    await expect(readImport(request("{broken"))).rejects.toMatchObject({
      status: 400,
    })
  })
})
