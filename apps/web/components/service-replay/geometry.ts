import data from "./map-data.json"
import type { PlanningDetail } from "@/lib/service-planning"

export const mapData = data
import type { Route } from "./route-geometry"
export type Point = { x: number; z: number }
export function point(values: number[]): Point {
  return { x: values[0] ?? 0, z: values[1] ?? 0 }
}
export function along(
  route: Pick<Route, "points" | "distances">,
  distance: number
): Point {
  for (let i = 1; i < route.points.length; i++) {
    const end = route.distances[i],
      start = route.distances[i - 1]
    const a = route.points[i - 1],
      b = route.points[i]
    if (end === undefined || start === undefined || !a || !b || end < distance)
      continue
    const t =
      end === start ? 0 : Math.max(0, (distance - start) / (end - start))
    return {
      x: point(a).x + (point(b).x - point(a).x) * t,
      z: point(a).z + (point(b).z - point(a).z) * t,
    }
  }
  return point(route.points.at(-1) ?? [])
}
export function headingBetween(from: Point, to: Point) {
  return Math.atan2(to.x - from.x, to.z - from.z)
}
export function routeHeading(
  route: Pick<Route, "points" | "distances">,
  distance: number
) {
  const length = route.distances.at(-1) ?? 0
  return headingBetween(
    along(route, Math.max(0, distance - 0.25)),
    along(route, Math.min(length, distance + 0.25))
  )
}
export function prepareBusTrips(detail: PlanningDetail, routes: Route[]) {
  const byTrip = new Map<string, PlanningDetail["calls"]>()
  for (const call of detail.calls) {
    const calls = byTrip.get(call.trip) ?? []
    calls.push(call)
    byTrip.set(call.trip, calls)
  }
  for (const calls of byTrip.values()) calls.sort((a, b) => a.order - b.order)
  const byRoute = new Map(routes.map((route) => [route.id, route]))
  return detail.trips.flatMap((trip) => {
    const route = byRoute.get(trip.route)
    return route ? [{ trip, route, calls: byTrip.get(trip.id) ?? [] }] : []
  })
}
export function busPositions(
  trips: ReturnType<typeof prepareBusTrips>,
  at: number
) {
  return trips.flatMap(({ trip, route, calls }) => {
    const dwell = calls.find(
      (c) =>
        c.arrival !== null &&
        c.departure !== null &&
        c.arrival <= at &&
        at <= c.departure
    )
    if (dwell) {
      const stop = route.stops.find((s) => s.order === dwell.order)
      return stop
        ? [
            {
              ...point(stop.point),
              heading: routeHeading(route, stop.distance),
              service: trip.service,
              trip: trip.id,
              vehicle: trip.vehicle,
              state: `Recorded dwell · ${stop.name}`,
              evidence: dwell.id,
              estimated: false,
            },
          ]
        : []
    }
    for (let i = 1; i < calls.length; i++) {
      const a = calls[i - 1],
        b = calls[i]
      if (
        !a ||
        !b ||
        a.departure === null ||
        b.arrival === null ||
        at <= a.departure ||
        at >= b.arrival
      )
        continue
      const start = route.stops.find((s) => s.order === a.order),
        end = route.stops.find((s) => s.order === b.order)
      if (!start || !end) return []
      const t = (at - a.departure) / (b.arrival - a.departure)
      const distance = start.distance + t * (end.distance - start.distance)
      return [
        {
          ...along(route, distance),
          heading: routeHeading(route, distance),
          service: trip.service,
          trip: trip.id,
          vehicle: trip.vehicle,
          state: `Estimated travel · ${start.name} → ${end.name}`,
          evidence: `${a.id}, ${b.id}`,
          estimated: true,
        },
      ]
    }
    return []
  })
}

export function scheduledBusPositions(
  detail: import("@/lib/scheduled-service").ScheduledService,
  routes: Route[],
  at: number
) {
  const byRoute = new Map(routes.map((route) => [route.id, route]))
  return detail.plannedTrips.flatMap((trip) => {
    const route = byRoute.get(trip.route)
    if (
      !route ||
      trip.departure === null ||
      trip.arrival === null ||
      trip.arrival <= trip.departure ||
      at < trip.departure ||
      at >= trip.arrival
    )
      return []
    const first = route.stops[0]
    const last = route.stops.at(-1)
    if (!first || !last || route.missingStops > 0) return []
    const distance =
      first.distance +
      ((last.distance - first.distance) * (at - trip.departure)) /
        (trip.arrival - trip.departure)
    return [
      {
        ...along(route, distance),
        heading: routeHeading(route, distance),
        service: trip.service,
        trip: trip.id,
        vehicle: trip.vehicle,
        state: "Estimated scheduled position",
        evidence: trip.id,
        estimated: true,
      },
    ]
  })
}
