// @vitest-environment node
import { afterAll, beforeAll, expect, it, vi } from "vitest"
import { copyFileSync, mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { DatabaseSync } from "node:sqlite"
import { GET } from "@/app/api/scheduled-service/route"
import { getScheduledService } from "@/lib/service-planning-server"
import {
  scheduledServiceSchema,
  serviceEventTimes,
  type ScheduledService,
} from "@/lib/scheduled-service"
import { scheduledBusPositions } from "@/components/service-replay/geometry"
import type { Route } from "@/components/service-replay/route-geometry"
const directory = mkdtempSync(join(tmpdir(), "scheduled-sqlite-"))
const path = join(directory, "database.sqlite")
beforeAll(() => {
  copyFileSync(resolve("../../data/operations/lionlink-network.sqlite"), path)
  vi.stubEnv("DASHBOARD_DATABASE_PATH", path)
})
afterAll(() => {
  vi.unstubAllEnvs()
  rmSync(directory, { recursive: true, force: true })
})
it("uses planned times and assignments independently of actual outcomes", async () => {
  const before = await getScheduledService("2026-10-05")
  expect(before.routes).toHaveLength(36)
  expect(new Set(before.plannedTrips.map((t) => t.service)).size).toBe(24)
  expect(
    before.plannedTrips.find((t) => t.id === "NW-20261005-0001")
  ).toMatchObject({
    vehicle: "NW-V001",
    crew: "NW-C001",
    departure: Date.parse("2026-10-05T06:00:00+08:00") / 1000,
    arrival: Date.parse("2026-10-05T06:32:15+08:00") / 1000,
  })
  const db = new DatabaseSync(path)
  try {
    db.exec(
      "UPDATE trips SET actual_departure_at = NULL, actual_arrival_at = NULL, actual_vehicle_id = 'different'; DELETE FROM stop_calls;"
    )
  } finally {
    db.close()
  }
  expect(await getScheduledService("2026-10-05")).toEqual(before)
  const response = await GET(
    new Request("http://localhost/api/scheduled-service?date=2026-10-06")
  )
  expect(response.status).toBe(200)
  const next = scheduledServiceSchema.parse(await response.json())
  const ids = new Set(before.plannedTrips.map((t) => t.id))
  expect(next.plannedTrips.every((t) => !ids.has(t.id))).toBe(true)
  expect(next).not.toHaveProperty("calls")
  for (const query of ["", "date=bad", "date=2027-01-01"]) {
    expect(
      (
        await GET(
          new Request(`http://localhost/api/scheduled-service?${query}`)
        )
      ).status
    ).toBe(400)
  }
})
const route: Route = {
  id: "route",
  service: "1",
  direction: 1,
  origin: "A",
  destination: "B",
  points: [
    [0, 0],
    [100, 0],
  ],
  distances: [0, 100],
  legs: [],
  missingStops: 0,
  stops: [
    {
      order: 1,
      id: "a",
      name: "A",
      point: [0, 0],
      distance: 0,
      offsetMetres: 0,
    },
    {
      order: 2,
      id: "b",
      name: "B",
      point: [100, 0],
      distance: 100,
      offsetMetres: 0,
    },
  ],
}
const detail: ScheduledService = {
  routes: [],
  positions: [],
  plannedTrips: [
    {
      id: "trip",
      service: "1",
      route: "route",
      vehicle: "planned-bus",
      crew: null,
      departure: 100,
      arrival: 200,
    },
  ],
}
it("interpolates scheduled movement, respects boundaries, and withholds incomplete journeys", () => {
  expect(scheduledBusPositions(detail, [route], 99)).toEqual([])
  expect(scheduledBusPositions(detail, [route], 100)[0]).toMatchObject({
    x: 0,
    z: 0,
    vehicle: "planned-bus",
    estimated: true,
  })
  expect(scheduledBusPositions(detail, [route], 150)[0]).toMatchObject({
    x: 50,
    z: 0,
    state: "Estimated scheduled position",
  })
  expect(scheduledBusPositions(detail, [route], 200)).toEqual([])
  for (const arrival of [null, 100, 50]) {
    expect(
      scheduledBusPositions(
        {
          ...detail,
          plannedTrips: detail.plannedTrips.map((t) => ({ ...t, arrival })),
        },
        [route],
        100
      )
    ).toEqual([])
  }
  expect(
    scheduledBusPositions(detail, [{ ...route, missingStops: 1 }], 150)
  ).toEqual([])
  expect(serviceEventTimes(detail, 0, 300)).toEqual([0, 100, 200, 300])
})
