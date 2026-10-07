// @vitest-environment node
import { afterAll, beforeAll, expect, it, vi } from "vitest"
import { copyFileSync, mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { DatabaseSync } from "node:sqlite"
import { GET } from "@/app/api/service-planning/route"
import { getPlanningReport } from "@/lib/service-planning-server"
import { planningSelectionSchema } from "@/lib/service-planning"
const directory = mkdtempSync(join(tmpdir(), "planning-sqlite-"))
const path = join(directory, "database.sqlite")
beforeAll(() => {
  copyFileSync(resolve("../../data/operations/lionlink-network.sqlite"), path)
  vi.stubEnv("DASHBOARD_DATABASE_PATH", path)
})
afterAll(() => {
  vi.unstubAllEnvs()
  rmSync(directory, { recursive: true, force: true })
})
it("investigates current SQLite evidence and refreshes after a record change", async () => {
  const selection = planningSelectionSchema.parse({
    date: "2026-10-07",
    service: "132",
  })
  const before = await getPlanningReport(selection)
  expect(before.watchlist).toHaveLength(24)
  const watch = before.watchlist.find((r) => r.service === "132")!
  expect(watch.priority).toBe("Critical")
  expect(watch.holds).toEqual([])
  const id = watch.peak!.id
  const database = new DatabaseSync(path)
  try {
    database
      .prepare(
        "UPDATE stop_calls SET queue_after_people = 999 WHERE call_id = ?"
      )
      .run(id)
  } finally {
    database.close()
  }
  const after = await getPlanningReport(selection)
  expect(after.watchlist.find((r) => r.service === "132")?.peak).toMatchObject({
    id,
    queue: 999,
  })
  expect(after.detail.calls.find((c) => c.id === id)?.queue).toBe(999)
  expect(
    (
      await GET(
        new Request(
          "http://localhost/api/service-planning?date=2026-10-07&service=132"
        )
      )
    ).status
  ).toBe(200)
})
it("rejects unknown services, dates and malformed assumptions", async () => {
  for (const query of [
    "date=2026-10-07&service=unknown",
    "date=2020-01-01&service=132",
    "date=2026-10-07&service=132&delay=NaN",
    "date=2026-10-07&service=132&start=13:00&end=12:00",
  ]) {
    expect(
      (await GET(new Request(`http://localhost/api/service-planning?${query}`)))
        .status
    ).toBe(400)
  }
})

it("withholds candidates when crew evidence is missing from the database", async () => {
  const selection = planningSelectionSchema.parse({
    date: "2026-10-07",
    service: "132",
  })
  const before = await getPlanningReport(selection)
  expect(before.candidates.find((c) => c.vehicle === "NW-V009")).toMatchObject({
    status: "candidate",
    crew: "NW-C135",
  })
  const database = new DatabaseSync(path)
  try {
    database
      .prepare(
        "DELETE FROM crew_duties WHERE service_date = ? AND qualified_service_no = ?"
      )
      .run(selection.date, selection.service)
  } finally {
    database.close()
  }
  const after = await getPlanningReport(selection)
  expect(after.candidates.filter((c) => c.status === "candidate")).toEqual([])
  expect(after.candidates.find((c) => c.vehicle === "NW-V009")).toMatchObject({
    status: "unknown",
  })
})
