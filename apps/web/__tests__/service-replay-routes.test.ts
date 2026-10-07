// @vitest-environment node
import { expect, it } from "vitest"
import { busPositions } from "@/components/service-replay/geometry"
import { DatabaseSync } from "node:sqlite"
import { resolve } from "node:path"
import {
  planningSourcesSchema,
  planningReportSchema,
} from "@/lib/service-planning"
import {
  buildRoutes,
  project,
} from "@/components/service-replay/route-geometry"

it("builds every database route with separate ordered stop occurrences", () => {
  const db = new DatabaseSync(
    resolve("../../data/operations/lionlink-network.sqlite"),
    { readOnly: true }
  )
  try {
    const routes = planningSourcesSchema.shape.routes.parse(
      db
        .prepare(
          "SELECT route_id AS id, service_no AS service, direction, service_name AS name, origin_stop_id AS origin FROM routes"
        )
        .all()
    )
    const positions = planningSourcesSchema.shape.positions.parse(
      db
        .prepare(
          'SELECT route_id AS route, stop_order AS "order", stop_id AS stop, description AS name, 1 AS boarding, latitude, longitude FROM route_stops JOIN stops USING(stop_id)'
        )
        .all()
    )
    const result = buildRoutes({ routes, positions })
    expect(result).toHaveLength(36)
    expect(new Set(result.map((r) => r.service)).size).toBe(24)
    expect(result.reduce((n, r) => n + r.stops.length, 0)).toBe(1353)
    for (const route of result) {
      expect(route.missingStops, route.id).toBe(0)
      expect(route.legs.length, route.id).toBe(route.stops.length - 1)
      expect(
        route.legs.every((leg) => leg.kind === "road"),
        route.id
      ).toBe(true)
      expect(
        route.stops.every(
          (s, i) => i === 0 || s.distance > (route.stops[i - 1]?.distance ?? 0)
        ),
        route.id
      ).toBe(true)
      expect(route.points.flat().every(Number.isFinite), route.id).toBe(true)
    }
  } finally {
    db.close()
  }
})

const a = { longitude: 103.8, latitude: 1.3 }
const b = { longitude: 103.81, latitude: 1.3 }
const c = { longitude: 103.81, latitude: 1.31 }
const route = {
  id: "new-loop",
  service: "NEW",
  direction: 1,
  name: "New loop",
  origin: "a",
}
const positions = [a, b, c, a].map((p, i) => ({
  ...p,
  route: route.id,
  order: i + 1,
  stop: i === 3 ? "0" : String(i),
  name: String(i),
  boarding: 1,
}))
const pa = project(a.longitude, a.latitude),
  pb = project(b.longitude, b.latitude),
  pc = project(c.longitude, c.latitude)
it("joins reversed multipart geometry and keeps a repeated terminal distinct", () => {
  const [result] = buildRoutes({ routes: [route], positions }, [
    {
      service: "NEW",
      direction: 1,
      parts: [
        [pb, pa],
        [pb, pc],
        [pc, pa],
      ],
    },
  ])
  expect(result?.stops.map((s) => s.id)).toEqual(["0", "1", "2", "0"])
  expect(result?.legs.map((leg) => leg.kind)).toEqual(["road", "road", "road"])
  expect(result?.stops[3]?.distance).toBeGreaterThan(
    result?.stops[2]?.distance ?? Infinity
  )
})
it("renders new services without an allowlist and identifies missing or disconnected geometry", () => {
  const [direct] = buildRoutes({ routes: [route], positions }, [])
  expect(direct?.legs.map((leg) => leg.kind)).toEqual([
    "direct",
    "direct",
    "direct",
  ])
  const [disconnected] = buildRoutes({ routes: [route], positions }, [
    {
      service: "NEW",
      direction: 1,
      parts: [
        [pa, pb],
        [pc, project(103.82, 1.31)],
      ],
    },
  ])
  expect(disconnected?.legs.map((leg) => leg.kind)).toEqual([
    "road",
    "direct",
    "direct",
  ])
  const [missing] = buildRoutes(
    {
      routes: [route],
      positions: positions.map((p, i) =>
        i === 1 ? { ...p, latitude: null } : p
      ),
    },
    []
  )
  expect(missing?.missingStops).toBe(1)
  expect(missing?.stops.map((s) => s.order)).toEqual([1, 3, 4])
})

it("moves a bus on an unseen service and holds it at its recorded stop", () => {
  const detail = planningReportSchema.shape.detail.parse({
    routes: [route],
    positions,
    trips: [
      {
        id: "new-trip",
        service: "NEW",
        route: route.id,
        vehicle: "new-bus",
        crew: null,
        origin: "0",
        destination: "1",
        scheduled: 90,
        departure: 110,
        arrival: 210,
      },
    ],
    calls: [
      {
        id: "first",
        trip: "new-trip",
        route: route.id,
        order: 1,
        vehicle: "new-bus",
        arrival: 90,
        departure: 110,
        observed: 105,
        queue: 0,
      },
      {
        id: "second",
        trip: "new-trip",
        route: route.id,
        order: 2,
        vehicle: "new-bus",
        arrival: 210,
        departure: 230,
        observed: 220,
        queue: null,
      },
    ],
  })
  const routes = buildRoutes(detail, [])
  const [dwell] = busPositions(detail, 100, routes)
  expect(dwell).toMatchObject({
    x: pa[0],
    z: pa[1],
    estimated: false,
    vehicle: "new-bus",
  })
  const [moving] = busPositions(detail, 160, routes)
  expect(moving?.x).toBeCloseTo(((pa[0] ?? 0) + (pb[0] ?? 0)) / 2)
  expect(moving?.heading).toBeCloseTo(Math.PI / 2)
  expect(moving?.estimated).toBe(true)
})
