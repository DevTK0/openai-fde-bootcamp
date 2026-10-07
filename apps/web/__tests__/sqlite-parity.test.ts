// @vitest-environment node
import { describe, expect, it } from "vitest"
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { gunzipSync } from "node:zlib"
import { z } from "zod"
import { readDashboardData } from "@/lib/dashboard-server"
import {
  getOperationsManifest,
  getOperationsReport,
  queryOperationsTable,
  readOperationsDownload,
} from "@/lib/operations-server"
import { buildOperationsReport } from "@/lib/operations"
import {
  fleetSchema,
  passengerTripSchema,
  boardingSchema,
  rowSchema,
} from "@/lib/dashboard-data"

const number = z.number()
const snapshotSchema = z.object({
  groups: z.array(
    z.object({
      date: z.string(),
      service: z.string(),
      trips: number,
      completed: number,
      km: number,
      positioningKm: number,
      seconds: number,
      vehicles: z.array(z.string()),
      departureDelays: z.array(number),
      arrivalDelays: z.array(number),
      substitutions: number,
      calls: number,
      boardings: number,
      alightings: number,
      queuedCalls: number,
      fullCalls: number,
      occupancySum: number,
      initialQueue: number,
      arrivals: number,
      remainingQueue: number,
      windowBoardings: number,
      controlActions: number,
      resourceUpdates: number,
    })
  ),
  hotspots: z.array(
    z.object({
      date: z.string(),
      service: z.string(),
      route: z.string(),
      order: number,
      stop: z.string(),
      name: z.string(),
      arrivals: number,
      boardings: number,
      remaining: number,
    })
  ),
  workshop: z.array(rowSchema),
})
const baseline = snapshotSchema.parse(
  JSON.parse(
    gunzipSync(readFileSync("data/operations/summary.json.gz")).toString()
  )
)
const manifest = getOperationsManifest()

function compare(actual: unknown, expected: unknown) {
  if (typeof expected === "number") {
    expect(actual).toBeTypeOf("number")
    expect(actual).toBeCloseTo(expected, 7)
  } else if (Array.isArray(expected)) {
    const values = z.array(z.unknown()).parse(actual)
    expect(values).toHaveLength(expected.length)
    expected.forEach((value, index) => compare(values[index], value))
  } else if (expected !== null && typeof expected === "object") {
    const values = z.record(z.string(), z.unknown()).parse(actual)
    expect(Object.keys(values).sort()).toEqual(Object.keys(expected).sort())
    for (const [key, value] of Object.entries(expected))
      compare(values[key], value)
  } else expect(actual).toEqual(expected)
}

describe("SQLite migration parity", () => {
  it("preserves all handout data and passenger evidence", () => {
    const actual = readDashboardData()
    expect(actual.fleet).toEqual(
      fleetSchema.parse(JSON.parse(readFileSync("lib/fleet-data.json", "utf8")))
    )
    expect(actual.operationsPassengers).toEqual(
      z
        .array(
          z.object({
            caseId: z.string(),
            matches: z.array(passengerTripSchema),
          })
        )
        .parse(
          JSON.parse(readFileSync("lib/operations-passengers.json", "utf8"))
        )
    )
    expect(actual.boardingHistory).toEqual(
      boardingSchema.parse(
        JSON.parse(readFileSync("lib/boarding-history.json", "utf8"))
      )
    )
  })
  it.each(manifest.tables)(
    "preserves $id rows, nulls, ordering and original download bytes",
    async (table) => {
      const original = gunzipSync(
        readFileSync(`data/operations/${table.id}.jsonl.gz`)
      )
        .toString()
        .trim()
        .split("\n")
      for (const page of new Set([
        0,
        1,
        Math.floor((original.length - 1) / 25),
      ])) {
        const actual = await queryOperationsTable(table.id, "", page)
        expect(actual.total).toBe(original.length)
        expect(actual.rows).toEqual(
          original
            .slice(page * 25, page * 25 + 25)
            .map((line) => rowSchema.parse(JSON.parse(line)))
        )
      }
      expect(
        createHash("sha256")
          .update(await readOperationsDownload(table.id))
          .digest("hex")
      ).toBe(
        createHash("sha256")
          .update(readFileSync(`data/operations/${table.id}.csv.gz`))
          .digest("hex")
      )
    }
  )
  it.each([
    ["all", "all"],
    ...manifest.services.map((service) => [service, "all"]),
    ...manifest.dates.map((date) => ["all", date]),
    ["238", "2026-10-06"],
    ["132", "2026-10-12"],
  ])(
    "preserves reports for service %s and date %s",
    async (service = "all", date = "all") => {
      compare(
        await getOperationsReport(service, date),
        buildOperationsReport(baseline, service, date)
      )
    }
  )
})
