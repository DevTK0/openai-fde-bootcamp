// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { copyFileSync, mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { DatabaseSync } from "node:sqlite"
import {
  queryOperationsTable,
  getOperationsReport,
  getOperationsManifest,
} from "@/lib/operations-server"
import { readDashboardData } from "@/lib/dashboard-server"
import { GET } from "@/app/api/operations/route"

const directory = mkdtempSync(join(tmpdir(), "dashboard-sqlite-"))
const path = join(directory, "dashboard.sqlite")
beforeAll(() => {
  copyFileSync(resolve("../../data/operations/lionlink-network.sqlite"), path)
  vi.stubEnv("DASHBOARD_DATABASE_PATH", path)
})
afterAll(() => {
  vi.unstubAllEnvs()
  rmSync(directory, { recursive: true, force: true })
})

describe("SQLite dashboard queries", () => {
  it("returns stable pages and handles out-of-range pages", async () => {
    const page = await queryOperationsTable("trips", "", 1)
    expect(page.total).toBe(6900)
    expect(page.rows).toHaveLength(25)
    expect(page.rows[0]?.trip_id).toBe("NW-20261005-0026")
    expect((await queryOperationsTable("stop_calls", "", 99999)).rows).toEqual(
      []
    )
  })
  it("searches literal text case-insensitively without treating SQL or wildcards as commands", async () => {
    expect(
      (await queryOperationsTable("trips", "nw-20261006-0136", 0)).rows[0]
        ?.actual_vehicle_id
    ).toBe("NW-V050")
    for (const query of ["%' OR 1=1 --", "%", "_"]) {
      expect((await queryOperationsTable("vehicles", query, 0)).total).toBe(0)
    }
    expect(
      (await queryOperationsTable("stops", "01013", 0)).rows[0]?.stop_id
    ).toBe("01013")
    expect(
      (
        await GET(
          new Request(
            "http://localhost/api/operations?view=records&table=trips%22%3BDELETE"
          )
        )
      ).status
    ).toBe(400)
  })
  it("uses current database values for records, summaries, handouts and passenger evidence", async () => {
    const before = await getOperationsReport("238", "2026-10-06")
    const database = new DatabaseSync(path)
    try {
      database.exec(`UPDATE stop_calls SET boarded_people = boarded_people + 1 WHERE call_id = 'NW-20261006-0136-01';
        UPDATE trips SET actual_vehicle_id = 'SQLITE-VEHICLE' WHERE trip_id = 'NW-20261006-0136';
        UPDATE handout_rows SET data = json_set(data, '$."Repair cost SGD"', 12345)
          WHERE table_id = (SELECT id FROM handout_tables WHERE json_extract(metadata, '$.sheet') = 'Monthly costs') AND position = 0;`)
      const after = await getOperationsReport("238", "2026-10-06")
      expect(after.metrics.boardings).toBe(before.metrics.boardings + 1)
      expect(
        (await queryOperationsTable("trips", "SQLITE-VEHICLE", 0)).total
      ).toBe(1)
      const dashboard = readDashboardData()
      expect(dashboard.boardingHistory.rows[1]?.boarded).toBe(86)
      expect(
        dashboard.operationsPassengers.find((row) => row.caseId === "PC07")
          ?.matches[0]?.actual_vehicle_id
      ).toBe("SQLITE-VEHICLE")
      expect(
        dashboard.fleet.tables.find((table) => table.sheet === "Monthly costs")
          ?.rows[0]?.["Repair cost SGD"]
      ).toBe(12345)
    } finally {
      database.close()
    }
  })
  it("lets unrelated event-loop work run while a large absent search scans", async () => {
    let yielded = false
    const heartbeat = new Promise<void>((resolve) =>
      setImmediate(() => {
        yielded = true
        resolve()
      })
    )
    try {
      const result = await queryOperationsTable(
        "stop_calls",
        "absent-sqlite-search-proof",
        0
      )
      expect(result.total).toBe(0)
      expect(yielded).toBe(true)
    } finally {
      await heartbeat
    }
  }, 20000)

  it("derives report filters and coverage from edited database records", async () => {
    const before = getOperationsManifest()
    const database = new DatabaseSync(path)
    try {
      database.exec(`CREATE TEMP TABLE extra_trip AS SELECT * FROM trips LIMIT 1;
        UPDATE extra_trip SET trip_id = 'SQLITE-NEW-TRIP', service_no = '999', service_date = '2026-10-19', actual_vehicle_id = 'SQLITE-NEW-BUS';
        INSERT INTO trips SELECT * FROM extra_trip;`)
      const manifest = getOperationsManifest()
      expect(manifest.services).toContain("999")
      expect(manifest.dates).toContain("2026-10-19")
      expect(manifest.coverage.trips).toBe(6901)
      expect(manifest.coverage.services).toBe(25)
      expect(manifest.coverage.vehicles).toBe(before.coverage.vehicles + 1)
      const response = await GET(
        new Request(
          "http://localhost/api/operations?service=999&date=2026-10-19"
        )
      )
      expect(response.status).toBe(200)
      expect(await response.json()).toMatchObject({
        metrics: { trips: 1, vehicles: 1 },
      })
      database.exec("DELETE FROM trips WHERE trip_id = 'SQLITE-NEW-TRIP'")
      const after = readDashboardData().operationsManifest
      expect(after.services).not.toContain("999")
      expect(after.dates).not.toContain("2026-10-19")
      expect(after.coverage.trips).toBe(6900)
      expect(after.coverage.services).toBe(24)
      expect(after.coverage.vehicles).toBe(before.coverage.vehicles)
    } finally {
      database.exec("DELETE FROM trips WHERE trip_id = 'SQLITE-NEW-TRIP'")
      database.close()
    }
  })

  it("bounds admitted reads and recovers after workers finish", async () => {
    const requests = Array.from({ length: 5 }, () =>
      GET(
        new Request("http://localhost/api/operations?view=records&table=trips")
      )
    )
    const responses = await Promise.all(requests)
    expect(responses.map((response) => response.status)).toEqual([
      200, 200, 200, 200, 503,
    ])
    expect(responses[4]?.headers.get("Retry-After")).toBe("1")
    expect(await responses[4]?.json()).toEqual({
      error: "Operations records are busy. Please retry shortly.",
    })
    const after = await GET(
      new Request("http://localhost/api/operations?view=records&table=trips")
    )
    expect(after.status).toBe(200)
    expect(await after.json()).toMatchObject({ total: 6900, pageSize: 25 })
  })

  it("cancels abandoned API reads and admits replacement requests", async () => {
    const controllers = Array.from({ length: 4 }, () => new AbortController())
    const pending = controllers.map((controller) =>
      GET(
        new Request(
          "http://localhost/api/operations?view=records&table=stop_calls&q=absent-cancellation-proof",
          { signal: controller.signal }
        )
      )
    )
    await new Promise((resolve) => setTimeout(resolve, 100))
    controllers.forEach((controller) => controller.abort())
    const responses = await Promise.all(pending)
    expect(responses.map((response) => response.status)).toEqual([
      499, 499, 499, 499,
    ])
    const replacements = await Promise.all(
      Array.from({ length: 4 }, () =>
        GET(
          new Request(
            "http://localhost/api/operations?view=records&table=trips"
          )
        )
      )
    )
    expect(replacements.map((response) => response.status)).toEqual([
      200, 200, 200, 200,
    ])
    const cancelled = new AbortController()
    cancelled.abort()
    expect(
      (
        await GET(
          new Request("http://localhost/api/operations", {
            signal: cancelled.signal,
          })
        )
      ).status
    ).toBe(499)
  }, 20000)

  it("releases failed workers so later reads can succeed", async () => {
    const database = new DatabaseSync(path)
    try {
      database.exec("ALTER TABLE trips RENAME TO unavailable_trips")
      const responses = await Promise.allSettled(
        Array.from({ length: 4 }, () => queryOperationsTable("trips", "", 0))
      )
      expect(responses.map((response) => response.status)).toEqual([
        "rejected",
        "rejected",
        "rejected",
        "rejected",
      ])
      database.exec("ALTER TABLE unavailable_trips RENAME TO trips")
      expect((await queryOperationsTable("trips", "", 0)).total).toBe(6900)
    } finally {
      database.close()
    }
  })

  it("fails explicitly when the database is missing instead of falling back to JSON", () => {
    vi.stubEnv("DASHBOARD_DATABASE_PATH", join(directory, "missing.sqlite"))
    try {
      expect(() => readDashboardData()).toThrow()
    } finally {
      vi.stubEnv("DASHBOARD_DATABASE_PATH", path)
    }
  })
})
