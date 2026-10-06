import { describe, expect, it } from "vitest"
import {
  csvExport,
  data,
  dataset,
  filterHistory,
  groupSum,
  monthly,
  num,
  sum,
} from "@/lib/fleet"

describe("Fleet data and dashboard calculations", () => {
  it("imports all workbook tables and CSVs, preserving missing values", () => {
    expect(data.tables).toHaveLength(40)
    expect(new Set(data.tables.map((t) => t.file)).size).toBe(8)
    expect(dataset("Passenger reports").rows).toHaveLength(6)
    expect(
      dataset("Passenger reports").rows[0]!["Reported vehicle ID"]
    ).toBeNull()
    expect(dataset("Repairs").rows[0]!["Opened at"]).toBe("2026-09-28 16:10:00")
  })
  it("has exactly one canonical row per vehicle and month", () => {
    expect(monthly).toHaveLength(192)
    expect(new Set(monthly.map((r) => `${r.month}/${r.vehicle_id}`)).size).toBe(
      192
    )
    expect(filterHistory("all", "latest")).toHaveLength(96)
    expect(filterHistory("NW-V020", "earlier")).toHaveLength(12)
  })
  it("reconciles each annual repair summary to the monthly ledger", () => {
    const annual = data.tables.find((t) => t.id === "repair_spend_by_vehicle")!
    for (const row of annual.rows) {
      const period = String(row.period_start).startsWith("2024")
        ? "earlier"
        : "latest"
      const ledger = filterHistory(String(row.vehicle_id), period)
      expect(sum(ledger, "repair_cost_sgd")).toBe(num(row, "repair_cost_sgd"))
      expect(sum(ledger, "repair_count")).toBe(num(row, "repair_count"))
    }
  })
  it("reconciles duplicated workbook monthly costs without adding them twice", () => {
    for (const row of dataset("Monthly costs").rows) {
      const match = monthly.find(
        (r) =>
          r.vehicle_id === row["Vehicle ID"] &&
          r.month === String(row.Month).slice(0, 7)
      )!
      expect(match).toBeDefined()
      expect(match.repair_cost_sgd).toBe(row["Repair cost SGD"])
      expect(match.scheduled_service_cost_sgd).toBe(
        row["Scheduled service cost SGD"]
      )
    }
    expect(
      sum(
        groupSum(monthly, "vehicle_id", ["repair_cost_sgd"]),
        "repair_cost_sgd"
      )
    ).toBe(sum(monthly, "repair_cost_sgd"))
  })
  it("uses daily usage once and reconciles weekly summaries", () => {
    expect(sum(dataset("Daily usage").rows, "Recorded total km")).toBeCloseTo(
      sum(dataset("Weekly usage").rows, "Recorded total km")
    )
    expect(sum(dataset("Daily usage").rows, "Completed trips")).toBe(
      sum(dataset("Weekly usage").rows, "Completed trips")
    )
  })
  it("escapes CSV quoting, missing values, and spreadsheet formula text", () => {
    expect(
      csvExport(
        ["a", "b"],
        [
          { a: 'line,"quote"', b: null },
          { a: "=1+1", b: 0 },
        ]
      )
    ).toBe('"a","b"\r\n"line,""quote""",""\r\n"\'=1+1","0"')
  })
})
