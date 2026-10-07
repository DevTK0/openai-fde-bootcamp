// @vitest-environment node
import { describe, expect, it } from "vitest"
import fixture from "../public/evidence/example-bundle.json"
import { bundleSchema, filterSchema } from "../lib/evidence/schema"
import { retrieveContext } from "../lib/evidence/context"

const cases = [
  {
    q: "passenger boardings service 1 and departures within 5 minutes",
    service: "1",
  },
  { q: "passenger boardings service 1 and 5 minutes late", unresolved: true },
  { q: "which services had more than 1 passenger boardings" },
  { q: "completion over the last 5 weeks" },
  { q: "passenger boardings services 1, 012", unresolved: true },
  { q: "passenger boardings service 1.5", unresolved: true },
  { q: "passenger boardings service 1-5", unresolved: true },
  { q: "passenger boardings vehicle UNKNOWN", unresolved: true },
  { q: 'passenger boardings vehicle id "2026-10-05"', unresolved: true },
  { q: "passenger boardings service 2026-10-05", unresolved: true },
  { q: "passenger boardings vehicle no '2026-10-05'", unresolved: true },
  { q: "passenger boardings vehicle BUS-A", unresolved: true },
  { q: "passenger boardings vehicle BUS_A", unresolved: true },
  { q: 'passenger boardings vehicle "unknown"', unresolved: true },
  { q: "passenger boardings service id missing", unresolved: true },
  { q: "passenger boardings service 1", service: "1" },
  { q: "passenger boardings route 012", unresolved: true },
  { q: "passenger boardings service DEMO-1", service: "DEMO-1" },
  { q: "passenger boardings DEMO-1", service: "DEMO-1" },
  { q: "passenger boardings vehicle DEMO-1", unresolved: true },
  { q: "passenger boardings service 999999", unresolved: true },
  { q: "passenger boardings services 1 and 012", unresolved: true },
  { q: "passenger boardings service SHARED", service: "SHARED" },
  { q: "repair cost vehicle SHARED", vehicle: "SHARED" },
  { q: "passenger boardings SHARED", unresolved: true },
  {
    q: "passenger boardings service 1",
    selected: { service: "012" },
    unresolved: true,
  },
  { q: "passenger boardings on 2026-99-01", unresolved: true },
  {
    q: "passenger boardings on 2026-10-05",
    selected: { from: "2026-11-01" },
    unresolved: true,
  },
  { q: "repair cost per 1,000 km" },
  { q: "repair cost per 1000 km" },
  { q: "repair cost per 1.5 km" },
  { q: "passenger boardings increased 1%" },
  { q: "passenger boardings between 1 and 5" },
  { q: "departures within 5 minutes" },
  { q: "passenger boardings" },
  { q: "service reliability and passenger boardings" },
] satisfies {
  q: string
  service?: string
  vehicle?: string
  unresolved?: boolean
  selected?: Record<string, string>
}[]

describe("scope census", () => {
  it.each(cases)("$q ($selected)", (c) => {
    const bundle = bundleSchema.parse(fixture)
    const operations = bundle.tables.find((t) => t.kind === "operations")
    const base = operations?.rows[0]
    const maintenance = bundle.tables.find((t) => t.kind === "maintenance")
    if (!operations || !base || !maintenance?.rows[0])
      throw new Error("Missing fixture")
    operations.rows = ["1", "012", "DEMO-1", "SHARED", "5", "1000"].map(
      (service, i) => ({
        id: `row-${i}`,
        values: { ...base.values, service, boardings: 200 },
      })
    )
    maintenance.rows[0].values.vehicle_id = "SHARED"
    const selected = filterSchema.parse("selected" in c ? c.selected : {})
    const result = retrieveContext(bundle, "rev", c.q, selected)
    if ("unresolved" in c && c.unresolved) {
      expect(result.unresolvedScope.length).toBeGreaterThan(0)
      expect(result.metrics).toEqual([])
      expect(result.evidence.filter((e) => e.type === "row")).toEqual([])
    } else {
      expect(result.unresolvedScope).toEqual([])
      expect(result.filters.service).toBe("service" in c ? c.service : "")
      expect(result.filters.vehicle).toBe("vehicle" in c ? c.vehicle : "")
      if (c.q.includes("passenger boardings"))
        expect(result.metrics.find((m) => m.id === "boardings")?.value).toBe(
          "service" in c ? 200 : 1200
        )
    }
  })
  it.each(["2026-10-05", '"2026-10-05"', "'2026-10-05'"])(
    "keeps date %s separate from entity coordination",
    (date) => {
      const bundle = bundleSchema.parse(fixture)
      const operations = bundle.tables.find((t) => t.kind === "operations")
      const row = operations?.rows[0]
      if (!operations || !row) throw new Error("Missing fixture")
      row.values.service = "1"
      operations.rows.push({
        id: "next-day",
        values: { ...row.values, date: "2026-10-06", boardings: 900 },
      })
      for (const connector of ["on", "and"]) {
        const result = retrieveContext(
          bundle,
          "rev",
          `passenger boardings service 1 ${connector} ${date}`,
          filterSchema.parse({})
        )
        expect(result.unresolvedScope).toEqual([])
        expect(result.filters).toEqual({
          service: "1",
          vehicle: "",
          from: "2026-10-05",
          to: "2026-10-05",
        })
        expect(result.metrics.find((m) => m.id === "boardings")?.value).toBe(
          200
        )
      }
      for (const suffix of ['"2026-02-30"', "'2026-02-30'", '"2026-10-06"']) {
        const result = retrieveContext(
          bundle,
          "rev",
          `passenger boardings service 1 and ${date} and ${suffix}`,
          filterSchema.parse({})
        )
        expect(result.unresolvedScope.length).toBeGreaterThan(0)
        expect(result.metrics).toEqual([])
        expect(result.evidence.filter((e) => e.type === "row")).toEqual([])
      }
    }
  )
  it.each(["rows", "paragraphs", "documents"])(
    "reports omitted matching %s",
    (kind) => {
      const bundle = bundleSchema.parse(fixture)
      bundle.tables =
        kind === "rows"
          ? [
              {
                id: "faults",
                title: "Faults",
                sourceId: "demo",
                kind: "evidence",
                columns: ["issue"],
                caveats: [],
                rows: Array.from({ length: 9 }, (_, i) => ({
                  id: `r${i}`,
                  values: { issue: "fault" },
                })),
              },
            ]
          : []
      const source = bundle.sources[0]
      if (!source) throw new Error("Missing source")
      source.text =
        kind === "paragraphs"
          ? "fault one\n\nfault two\n\nfault three"
          : "fault"
      if (kind === "documents")
        bundle.sources = Array.from({ length: 5 }, (_, i) => ({
          ...source,
          id: `s${i}`,
        }))
      const result = retrieveContext(
        bundle,
        "rev",
        "fault",
        filterSchema.parse({})
      )
      expect(result.truncation.truncated).toBe(true)
      expect(JSON.stringify(result).length).toBeLessThanOrEqual(32000)
    }
  )
})
