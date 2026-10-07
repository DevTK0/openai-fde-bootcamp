// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { copyFileSync, mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { DatabaseSync } from "node:sqlite"
import {
  queryOperationsTable,
  getOperationsReport,
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
  it("fails explicitly when the database is missing instead of falling back to JSON", () => {
    vi.stubEnv("DASHBOARD_DATABASE_PATH", join(directory, "missing.sqlite"))
    try {
      expect(() => readDashboardData()).toThrow()
    } finally {
      vi.stubEnv("DASHBOARD_DATABASE_PATH", path)
    }
  })
})
