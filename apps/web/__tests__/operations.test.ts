// @vitest-environment node
import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import boardingHistory from "@/lib/boarding-history.json"
import { createHash } from "node:crypto"
import { gunzipSync } from "node:zlib"
import {
  getOperationsReport,
  queryOperationsTable,
  readOperationsDownload,
} from "@/lib/operations-server"
import {
  operationsManifest,
  operationMetrics,
  quantile,
} from "@/lib/operations"
import { GET } from "@/app/api/operations/route"
import passengerMatches from "@/lib/operations-passengers.json"

describe("Broader operations reporting", () => {
  it("keeps the boarding comparison complete and reconciled to source calls", () => {
    expect(boardingHistory.rows.map((r) => r.date)).toEqual(
      operationsManifest.dates
    )
    const calls = new Map(
      gunzipSync(readFileSync("data/operations/stop_calls.jsonl.gz"))
        .toString()
        .trim()
        .split("\n")
        .filter((line) => line.includes(`"route_id":"${boardingHistory.route}"`))
        .map((line) => JSON.parse(line))
        .filter(
          (r) => r.route_id === boardingHistory.route && r.stop_order === 1
        )
        .map((r) => [r.call_id, r])
    )
    for (const row of boardingHistory.rows) {
      const source = calls.get(row.callId)
      expect(source.trip_id).toBe(row.tripId)
      expect(source.queue_before_people).toBe(row.waiting)
      expect(source.boarded_people).toBe(row.boarded)
      expect(source.queue_after_people).toBe(row.remaining)
      expect(source.capacity_people).toBe(row.capacity)
      expect(row.waiting).toBe(row.boarded + row.remaining)
    }
    expect(
      boardingHistory.rows.filter(
        (r) => r.remaining > 0 && r.onboard === r.capacity
      )
    ).toHaveLength(8)
    expect(boardingHistory.rows.filter((r) => r.remaining === 0)).toHaveLength(
      2
    )
    expect(
      boardingHistory.rows.filter((r) => r.reported).map((r) => r.date)
    ).toEqual(["2026-10-06"])
  })
  it("reconciles full coverage, passenger accounting, and delay categories", async () => {
    const { metrics: m } = await getOperationsReport("all", "all")
    expect(m.trips).toBe(6900)
    expect(m.vehicles).toBe(172)
    expect(m.calls).toBe(252380)
    expect(m.boardings).toBe(2048591)
    expect(m.initialQueue + m.arrivals).toBe(m.boardings + m.remainingQueue)
    expect(m.earlyDepartures + m.onTimeDepartures + m.lateDepartures).toBe(
      m.trips
    )
    expect(m.lateDepartures).toBe(48)
    expect(m.km).toBeCloseTo(100943.27)
    expect(operationsManifest.tables).toHaveLength(21)
  })
  it("filters both date and service without leaking full-network metrics", async () => {
    const report = await getOperationsReport("238", "2026-10-06")
    expect(report.metrics.trips).toBe(18)
    expect(report.metrics.vehicles).toBe(3)
    expect(report.metrics.boardings).toBe(3054)
    expect(report.byService.map((r) => r.name)).toEqual(["238"])
    expect(report.byDate.map((r) => r.name)).toEqual(["2026-10-06"])
    expect(
      report.hotspots.every(
        (r) => r.service === "238" && r.date === "2026-10-06"
      )
    ).toBe(true)
  })
  it("does not extrapolate held workshop vehicles into operating availability", async () => {
    const { workshop } = await getOperationsReport("all", "all")
    expect(workshop).toHaveLength(8)
    expect(
      workshop.every(
        (r) => r.release_status === "held" && r.confirmed_release_at === null
      )
    ).toBe(true)
  })
  it("paginates and searches complete tables, preserving identifier strings", async () => {
    const first = await queryOperationsTable("trips", "", 0),
      second = await queryOperationsTable("trips", "", 1)
    expect(first.total).toBe(6900)
    expect(first.rows).toHaveLength(25)
    expect(first.rows[0]?.trip_id).not.toBe(second.rows[0]?.trip_id)
    const stop = await queryOperationsTable("stops", "01013", 0)
    expect(stop.rows.some((r) => r.stop_id === "01013")).toBe(true)
    const trip = await queryOperationsTable("trips", "NW-20261006-0136", 0)
    expect(trip.total).toBe(1)
    expect(trip.rows[0]?.actual_vehicle_id).toBe("NW-V050")
    expect(
      (await queryOperationsTable("trips", "no-such-record", 0)).total
    ).toBe(0)
  })
  it("retains exact original CSV bytes in downloads", async () => {
    const csv = gunzipSync(await readOperationsDownload("vehicles"))
    expect(createHash("sha256").update(csv).digest("hex")).toBe(
      operationsManifest.tables.find((t) => t.id === "vehicles")!.sha256
    )
  })
  it("validates untrusted table names, filters and page inputs", async () => {
    for (const query of [
      "view=records&table=../../README",
      "service=invalid",
      "date=2020-01-01",
      "view=records&page=-1",
      "view=records&page=NaN",
      "view=records&q=" + "a".repeat(121),
    ]) {
      const response = await GET(
        new Request(`http://localhost/api/operations?${query}`)
      )
      expect(response.status).toBe(400)
    }
  })
  it("matches six accounts against full trips while preserving actual assignments", () => {
    expect(passengerMatches).toHaveLength(6)
    expect(passengerMatches.every((r) => r.matches.length === 1)).toBe(true)
    const pc05 = passengerMatches.find((r) => r.caseId === "PC05")!.matches[0]!
    expect(pc05.planned_vehicle_id).toBe("NW-V001")
    expect(pc05.actual_vehicle_id).toBe("NW-V039")
  })
  it("calculates interpolated percentiles and empty metrics safely", () => {
    expect(quantile([0, 10, 20, 30], 0.9)).toBeCloseTo(27)
    expect(quantile([], 0.9)).toBe(0)
    expect(operationMetrics([]).meanArrival).toBe(0)
  })
})
