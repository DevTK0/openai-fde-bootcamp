// @vitest-environment node
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { DatabaseSync } from "node:sqlite"
import { copyFileSync, mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { z } from "zod"
import { mutateDataset, readDatasetDefinition } from "@/lib/dataset-records"
import { readDashboardData } from "@/lib/dashboard-server"
import { rowSchema } from "@/lib/dashboard-data"

let directory: string
let database: DatabaseSync
beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), "dataset-records-"))
  const path = join(directory, "data.sqlite")
  copyFileSync(resolve("../../data/operations/lionlink-network.sqlite"), path)
  vi.stubEnv("DASHBOARD_DATABASE_PATH", path)
  database = new DatabaseSync(path)
})
afterEach(() => {
  database.close()
  vi.unstubAllEnvs()
  rmSync(directory, { recursive: true, force: true })
})
const quote = (s: string) => `"${s.replaceAll('"', '""')}"`
it("adds and removes individual records in every dataset without changing existing records", () => {
  const dashboard = readDashboardData()
  const tables = [
    ...dashboard.fleet.tables,
    ...dashboard.operationsManifest.tables,
  ]
  expect(tables).toHaveLength(61)
  for (const table of tables) {
    const definition = readDatasetDefinition(table.id)
    const readRows = () =>
      definition.storage === "handout"
        ? database
            .prepare(
              "SELECT position, data FROM handout_rows WHERE table_id = ? ORDER BY position"
            )
            .all(table.id)
        : database
            .prepare(
              `SELECT rowid AS __id, * FROM ${quote(table.id)} ORDER BY rowid`
            )
            .all()
    const original = readRows()
    const first = original[0]
    if (!first) throw new Error(`Empty test fixture ${table.id}`)
    const row =
      definition.storage === "handout"
        ? rowSchema.parse(JSON.parse(z.string().parse(first.data)))
        : rowSchema.parse(
            Object.fromEntries(
              Object.entries(first).filter(([key]) => key !== "__id")
            )
          )
    const key = definition.keys[0]
    if (!key) throw new Error("Missing record key")
    row[key] =
      key.toLowerCase() === "month"
        ? "2099-01"
        : key === "service_date"
          ? "2099-01-01"
          : `${row[key]}-TEST`
    const result = mutateDataset({ action: "add", table: table.id, row })
    expect(result.count, table.id).toBe(1)
    const added = readRows()
    expect(added, table.id).toHaveLength(original.length + 1)
    const last = added.at(-1)
    if (!last) throw new Error("Record was not added")
    const recordId = z
      .number()
      .parse(definition.storage === "handout" ? last.position : last.__id)
    const expected = result.sample[0]
    if (!expected) throw new Error("No added record")
    expect(
      () => mutateDataset({ action: "add", table: table.id, row }),
      table.id
    ).toThrow("already exists")
    mutateDataset({ action: "remove", table: table.id, recordId, expected })
    expect(readRows(), table.id).toEqual(original)
  }
}, 30000)

it("rejects a stale removal and preserves numeric fields after removing the last row", () => {
  const table = readDashboardData().fleet.tables.find(
    (t) => t.title === "Bay and staffing capacity"
  )
  if (!table?.rows[0] || table.recordIds?.[0] === undefined)
    throw new Error("Missing capacity fixture")
  expect(table.rows).toHaveLength(1)
  expect(() =>
    mutateDataset({
      action: "remove",
      table: table.id,
      recordId: table.recordIds![0]!,
      expected: { ...table.rows[0], "Available bays": 999 },
    })
  ).toThrow("changed")
  mutateDataset({
    action: "remove",
    table: table.id,
    recordId: table.recordIds[0],
    expected: table.rows[0],
  })
  expect(
    readDatasetDefinition(table.id).fields.find(
      (f) => f.name === "Available bays"
    )?.type
  ).toBe("REAL")
  expect(() =>
    mutateDataset({
      action: "add",
      table: table.id,
      row: { ...table.rows[0], "Available bays": "invalid" },
    })
  ).toThrow("must be a number")
  mutateDataset({ action: "add", table: table.id, row: table.rows[0] })
  expect(
    readDashboardData().fleet.tables.find((t) => t.id === table.id)?.rows
  ).toEqual(table.rows)
})

it("keeps passenger reports readable when linked origin evidence is removed", () => {
  const match = database
    .prepare(
      "SELECT c.rowid AS __id, c.* FROM stop_calls c JOIN passenger_links p USING (trip_id) WHERE c.stop_order = 1 LIMIT 1"
    )
    .get()
  if (!match) throw new Error("Missing passenger evidence fixture")
  const { __id, ...row } = match
  mutateDataset({
    action: "remove",
    table: "stop_calls",
    recordId: z.number().parse(__id),
    expected: rowSchema.parse(row),
  })
  expect(
    readDashboardData().fleet.tables.find(
      (t) => t.sheet === "Passenger reports"
    )?.rows
  ).toHaveLength(6)
})
