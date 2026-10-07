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
  expect(
    before.detail.calls.find((call) => call.id === "NW-20261007-0108-03")
  ).toMatchObject({ boarded: 10, alighted: 9, queue: 10 })
  const id = watch.peak!.id
  const database = new DatabaseSync(path)
  try {
    database
      .prepare(
        "UPDATE stop_calls SET queue_after_people = 999, boarded_people = 0, alighted_people = NULL WHERE call_id = ?"
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
  expect(after.detail.calls.find((c) => c.id === id)).toMatchObject({
    queue: 999,
    boarded: 0,
    alighted: null,
  })
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

it("replays every service for one operating date without losing missing or zero counts", async () => {
  const { GET: history } = await import("@/app/api/service-history/route")
  const { planningDetailSchema, planningTime } =
    await import("@/lib/service-planning")
  const database = new DatabaseSync(path)
  try {
    database
      .prepare(
        "UPDATE stop_calls SET boarded_people = 0, alighted_people = NULL WHERE call_id = ?"
      )
      .run("NW-20261007-0108-03")
  } finally {
    database.close()
  }
  const details = []
  for (const date of ["2026-10-07", "2026-10-08"]) {
    const response = await history(
      new Request(`http://localhost/api/service-history?date=${date}`)
    )
    expect(response.status).toBe(200)
    const detail = planningDetailSchema.parse(await response.json())
    expect(new Set(detail.routes.map((route) => route.service)).size).toBe(24)
    expect(detail.routes).toHaveLength(36)
    expect(new Set(detail.trips.map((trip) => trip.service)).size).toBe(24)
    const start = planningTime(date, "00:00")
    expect(
      detail.trips.every(
        (trip) =>
          trip.scheduled !== null &&
          trip.scheduled >= start &&
          trip.scheduled < start + 86400
      )
    ).toBe(true)
    const trips = new Set(detail.trips.map((trip) => trip.id))
    expect(detail.calls.every((call) => trips.has(call.trip))).toBe(true)
    details.push(detail)
  }
  const first = details[0]!
  expect(
    first.calls.some((call) => call.boarded === 0 && call.alighted === null)
  ).toBe(true)
  const firstIds = new Set(first.trips.map((trip) => trip.id))
  expect(details[1]!.trips.every((trip) => !firstIds.has(trip.id))).toBe(true)
  for (const query of ["", "date=no", "date=2020-01-01"]) {
    expect(
      (
        await history(
          new Request(`http://localhost/api/service-history?${query}`)
        )
      ).status
    ).toBe(400)
  }
})
