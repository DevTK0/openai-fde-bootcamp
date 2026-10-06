import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { loadEvidence } from "./generate-evidence.mjs"

const evidence = loadEvidence()
describe("stakeholder evidence", () => {
  it("matches the canonical ledger without double counting summary workbooks", () => {
    expect(evidence.history.rows).toBe(192)
    expect(evidence.history.vehicles).toHaveLength(8)
    expect(evidence.history.earlier.repair).toBe(13625)
    expect(evidence.history.latest.repair).toBe(24880)
    expect(evidence.history.latest.km).toBe(146570)
  })
  it("uses the full operating extract and reconciles service-level counts", () => {
    expect(evidence.operations.trips).toBe(6900)
    expect(evidence.operations.calls).toBe(252380)
    expect(evidence.operations.late).toBe(48)
    expect(evidence.operations.byService.reduce((n, s) => n + s.late, 0)).toBe(
      evidence.operations.late
    )
    expect(
      evidence.operations.byService.reduce((n, s) => n + s.remaining, 0)
    ).toBe(evidence.operations.remaining)
  })
  it("uses all ten dates and reconciles waiting, boarding and remaining people", () => {
    expect(evidence.boarding).toHaveLength(10)
    expect(evidence.boarding.filter((r) => r.remaining > 0)).toHaveLength(8)
    expect(
      evidence.boarding.filter((r) => r.remaining === 0).map((r) => r.boarded)
    ).toEqual([18, 26])
    for (const row of evidence.boarding) {
      expect(row.waiting - row.boarded).toBe(row.remaining)
      expect(row.boarded).toBeLessThanOrEqual(row.capacity)
    }
  })
  it("keeps distinct maintenance costs and recorded holds correctly grounded", () => {
    expect(evidence.history.earlier.jobs).toBe(31)
    expect(evidence.history.latest.jobs).toBe(55)
    const latest = evidence.history.latest
    expect(latest.repair + latest.servicing + latest.preventive).toBe(81835)
    expect(latest.holds).toBeCloseTo(265.26)
    expect(evidence.coolingJobs.reduce((n, r) => n + r.cost, 0)).toBe(1120)
    expect(evidence.coolingJobs.reduce((n, r) => n + r.hours, 0)).toBeCloseTo(
      9 + 2 / 3
    )
  })
  it("counts places per departure without adding separate festival legs as people", () => {
    expect(evidence.festival.capacityByRoute.map((r) => r.spaces)).toEqual([
      255, 596,
    ])
    expect(evidence.festival.capacityByRoute[0].departures.at(-1)).toBe("22:30")
    expect(evidence.festival.capacityByRoute[1].departures.at(-1)).toBe("22:45")
    expect(evidence.festival.routes[0]["Outward ride minutes"]).toBe(35)
    expect(evidence.operations.arrivalLate).toBe(100)
    expect(evidence.operations.completed).toBe(6900)
  })
  it("keeps estimated workshop completions separate from confirmed releases", () => {
    expect(evidence.workshop).toHaveLength(8)
    expect(
      evidence.workshop.every((w) => w.confirmed_release_at === null)
    ).toBe(true)
  })
  it("does not publish stale evidence after a source change", () => {
    const published = JSON.parse(
      readFileSync(new URL("../content/evidence.json", import.meta.url))
    )
    expect(published).toEqual(evidence)
  })
  it("reconciles the bounded incident baseline", () => {
    expect(
      evidence.incident.requirements["Initial waiting people"] +
        evidence.incident.arrivals -
        evidence.incident.baselineCapacity
    ).toBe(122)
  })
})
