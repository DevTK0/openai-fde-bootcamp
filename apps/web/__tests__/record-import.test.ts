// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { DatabaseSync } from "node:sqlite"
import { copyFileSync, mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { resolve, join } from "node:path"
import { mutateDataset } from "@/lib/dataset-records"
function importRecords(input: { table: string; csv: string; commit: boolean }) {
  return mutateDataset({
    action: "upload",
    table: input.table,
    csv: input.csv,
    commit: input.commit,
  })
}
import {
  queryOperationsTable,
  getOperationsManifest,
  getOperationsReport,
} from "@/lib/operations-server"
import { csvExport } from "@/lib/fleet"
import { rowSchema } from "@/lib/dashboard-data"
import { readDashboardData } from "@/lib/dashboard-server"
import { datasetRules } from "@/lib/dataset-rules"
import { POST } from "@/app/api/datasets/route"

let directory: string
let path: string
const header =
  "vehicle_id,assigned_service_no,vehicle_type,capacity_people,wheelchair_spaces,capacity_basis"
const csv = `${header}\nTEST-IMPORT-001,007,Double deck,100,2,01009\n`

beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), "record-import-"))
  path = join(directory, "database.sqlite")
  copyFileSync(resolve("../../data/operations/lionlink-network.sqlite"), path)
  vi.stubEnv("DASHBOARD_DATABASE_PATH", path)
})
afterEach(() => {
  vi.unstubAllEnvs()
  rmSync(directory, { recursive: true, force: true })
})
function count() {
  const database = new DatabaseSync(path)
  try {
    return database.prepare("SELECT count(*) AS count FROM vehicles").get()
      ?.count
  } finally {
    database.close()
  }
}

describe("Operations CSV ingestion", () => {
  it("previews without writing, then exposes committed records through dashboard queries", async () => {
    const preview = importRecords({
      table: "vehicles",
      csv,
      commit: false,
    })
    expect(preview.sample).toEqual([
      {
        vehicle_id: "TEST-IMPORT-001",
        assigned_service_no: "007",
        vehicle_type: "Double deck",
        capacity_people: 100,
        wheelchair_spaces: 2,
        capacity_basis: "01009",
      },
    ])
    expect(count()).toBe(172)
    expect(
      importRecords({
        table: "vehicles",
        csv,
        commit: true,
      }).count
    ).toBe(1)
    expect(count()).toBe(173)
    const records = await queryOperationsTable("vehicles", "TEST-IMPORT-001", 0)
    expect(records.rows[0]?.assigned_service_no).toBe("007")
    expect(records.total).toBe(1)
    expect(
      getOperationsManifest().tables.find((table) => table.id === "vehicles")
        ?.count
    ).toBe(173)
  })
  it("includes imported trips in the operations summary", async () => {
    const database = new DatabaseSync(path)
    const row = rowSchema.parse(
      database.prepare("SELECT * FROM trips LIMIT 1").get()
    )
    database.close()
    row.trip_id = "TEST-IMPORTED-TRIP"
    importRecords({
      table: "trips",
      csv: csvExport(Object.keys(row), [row]),
      commit: true,
    })
    const report = await getOperationsReport("all", "all")
    expect(report.metrics.trips).toBe(6901)
    expect(report.metrics.completed).toBe(6901)
  })
  it("rejects more than 1,000 rows before writing", () => {
    const manyRows = Array.from(
      { length: 1001 },
      (_, i) => `TEST-${i},7,SD,85,1,Demo`
    ).join("\n")
    expect(() =>
      importRecords({
        table: "vehicles",
        csv: `${header}\n${manyRows}`,
        commit: true,
      })
    ).toThrow("1,000 records")
    expect(count()).toBe(172)
  })
  it("rolls back the whole batch when a later row is invalid", () => {
    expect(() =>
      importRecords({
        table: "vehicles",
        csv: `${csv}TEST-IMPORT-002,7,Bus,no,0,01009\n`,
        commit: true,
      })
    ).toThrow("Row 3: capacity_people")
    expect(count()).toBe(172)
  })
  it("rejects duplicates within an upload and on retry without replacing records", () => {
    expect(() =>
      importRecords({
        table: "vehicles",
        csv: `${csv}TEST-IMPORT-001,7,Bus,50,0,01009\n`,
        commit: true,
      })
    ).toThrow("already exists")
    expect(count()).toBe(172)
    importRecords({ table: "vehicles", csv, commit: true })
    expect(() =>
      importRecords({
        table: "vehicles",
        csv,
        commit: true,
      })
    ).toThrow("already exists")
    expect(count()).toBe(173)
  })
  it.each([
    ["unknown table", "handout_rows", csv],
    ["wrong columns", "vehicles", "vehicle_id,capacity\nX,50"],
    ["header only", "vehicles", header],
    ["malformed quote", "vehicles", `${header}\n\"unclosed`],
    ["fractional integer", "vehicles", `${header}\nX,7,Bus,50.5,0,01009`],
  ])("rejects %s without writing", (_, table, csv) => {
    expect(() => importRecords({ table, csv, commit: true })).toThrow()
    expect(count()).toBe(172)
  })
  it("accepts quoted multiline text and reordered columns", () => {
    const result = importRecords({
      table: "planning_constraints",
      csv: 'requirement,scope,constraint_id\r\n"A, B\nand ""C""",prototype,TEST-CONSTRAINT\r\n',
      commit: true,
    })
    expect(result.sample).toEqual([
      {
        constraint_id: "TEST-CONSTRAINT",
        scope: "prototype",
        requirement: 'A, B\nand "C"',
      },
    ])
  })
  it("persists passenger uploads in their selected dataset", () => {
    const table = readDashboardData().fleet.tables.find(
      (table) => table.sheet === "Passenger reports"
    )!
    const row = {
      ...table.rows[0],
      "Case ID": "TEST-PASSENGER-NEW",
      "Passenger report": "Domain-specific test report",
    }
    const upload = csvExport(table.columns, [row])
    importRecords({
      table: table.id,
      csv: upload,
      commit: false,
    })
    expect(
      readDashboardData().fleet.tables.find(
        (table) => table.sheet === "Passenger reports"
      )!.rows
    ).toHaveLength(6)
    importRecords({
      table: table.id,
      csv: upload,
      commit: true,
    })
    const reports = readDashboardData().fleet.tables.find(
      (table) => table.sheet === "Passenger reports"
    )!
    expect(reports.rows).toHaveLength(7)
    expect(reports.rows[6]?.["Passenger report"]).toBe(
      "Domain-specific test report"
    )
    expect(reports.sourceRows).toHaveLength(7)
    expect(() =>
      importRecords({
        table: table.id,
        csv: upload,
        commit: true,
      })
    ).toThrow("already exists")
  })
  it("validates required passenger details without writing a partial batch", () => {
    const table = readDashboardData().fleet.tables.find(
      (table) => table.sheet === "Passenger reports"
    )!
    const row = {
      ...table.rows[0],
      "Case ID": "TEST-MISSING-REPORT",
      "Passenger report": "",
    }
    expect(() =>
      importRecords({
        table: table.id,
        csv: csvExport(table.columns, [row]),
        commit: true,
      })
    ).toThrow("Passenger report is required")
    expect(
      readDashboardData().fleet.tables.find(
        (candidate) => candidate.id === table.id
      )!.rows
    ).toHaveLength(6)
  })
  it("has usable metadata and templates for every dataset with explicit field rules", () => {
    const data = readDashboardData()
    for (const [id, rules] of Object.entries(datasetRules)) {
      const table = [
        ...data.fleet.tables,
        ...data.operationsManifest.tables,
      ].find((t) => t.id === id)
      expect(table, id).toBeDefined()
      for (const field of [...rules.keys, ...(rules.required ?? [])])
        expect(table!.columns, id).toContain(field)
    }
  })
  it("keeps HTTP writes opt-in and checks request origin", async () => {
    const request = () =>
      new Request("http://localhost/api/datasets", {
        method: "POST",
        headers: { Origin: "http://localhost" },
        body: JSON.stringify({
          action: "upload",
          table: "vehicles",
          csv,
          commit: true,
        }),
      })
    expect((await POST(request())).status).toBe(403)
    vi.stubEnv("RECORD_IMPORTS_ENABLED", "1")
    expect(
      (
        await POST(
          new Request("http://localhost/api/datasets", {
            method: "POST",
            headers: { Origin: "http://elsewhere" },
            body: "{}",
          })
        )
      ).status
    ).toBe(403)
    expect((await POST(request())).status).toBe(200)
    expect(count()).toBe(173)
  })
})
