// @vitest-environment node
import { describe, expect, it } from "vitest"
import { createRelationships, pearson } from "@/lib/relationships"
import { createFleet, num } from "@/lib/fleet"

import { readDashboardData } from "@/lib/dashboard-server"
const source = readDashboardData()
const {
  annualTotals,
  annualVehicles,
  matchPassengerReports,
  monthlyPoints,
  componentObservations,
} = createRelationships(createFleet(source.fleet), source.operationsPassengers)

describe("Relationship analysis", () => {
  it("handles perfect, inverse, and undefined correlations", () => {
    expect(
      pearson([
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
      ])
    ).toBeCloseTo(1)
    expect(
      pearson([
        { x: 1, y: 6 },
        { x: 2, y: 4 },
        { x: 3, y: 2 },
      ])
    ).toBeCloseTo(-1)
    expect(
      pearson([
        { x: 1, y: 2 },
        { x: 1, y: 3 },
      ])
    ).toBeNull()
    expect(pearson([])).toBeNull()
  })
  it("normalizes costs against the same period and reconciles contributions", () => {
    expect(annualTotals.earlier.repair).toBe(13625)
    expect(annualTotals.latest.repair).toBe(24880)
    expect(annualTotals.latest.rate).toBeCloseTo(169.74824)
    const delta = annualVehicles.reduce(
      (s, v) => s + v.latest.repair - v.earlier.repair,
      0
    )
    expect(delta).toBe(11255)
    expect(
      annualVehicles
        .filter((v) => ["NW-V020", "NW-V005"].includes(v.vehicle))
        .reduce((s, v) => s + v.latest.repair - v.earlier.repair, 0) / delta
    ).toBeCloseTo(0.8969347)
  })
  it("filters the scatter population and preserves observation labels", () => {
    expect(monthlyPoints("all", "repair_cost_sgd")).toHaveLength(192)
    const points = monthlyPoints("NW-V020", "repair_cost_sgd")
    expect(points).toHaveLength(24)
    expect(points.every((p) => p.label.startsWith("NW-V020"))).toBe(true)
    expect(pearson(monthlyPoints("all", "repair_cost_sgd"))).toBeCloseTo(
      0.218,
      3
    )
  })
  it("excludes missing condenser estimates rather than treating them as zero", () => {
    const hvac = componentObservations.filter(
      (r) => typeof r.condenser_obstruction_before_pct === "number"
    )
    expect(hvac).toHaveLength(9)
    expect(
      pearson(
        hvac.map((r) => ({
          x: num(r, "km_since_component_attention"),
          y: num(r, "condenser_obstruction_before_pct"),
        }))
      )
    ).toBeCloseTo(0.966, 3)
  })
  it("matches expected journeys to scheduled time and observed journeys to actual time", () => {
    const links = matchPassengerReports()
    expect(links).toHaveLength(6)
    expect(links.every((l) => l.matches.length === 1)).toBe(true)
    expect(
      links.map((l) => [
        l.report["Case ID"],
        l.matches[0]!["Service observation ID"],
      ])
    ).toEqual([
      ["PC01", "NW-SO001"],
      ["PC02", "NW-SO002"],
      ["PC03", "NW-SO003"],
      ["PC04", "NW-SO004"],
      ["PC05", "NW-SO005"],
      ["PC07", "NW-SO006"],
    ])
  })
})
