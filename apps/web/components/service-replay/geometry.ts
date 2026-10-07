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
export function busPositions(
  detail: PlanningDetail,
  at: number,
  roads: boolean,
  routes: Route[]
) {
  return detail.trips.flatMap((trip) => {
    const route = routes.find((r) => r.id === trip.route)
    if (!route) return []
    const calls = detail.calls
      .filter((c) => c.trip === trip.id)
      .sort((a, b) => a.order - b.order)
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
              heading: roads
                ? routeHeading(route, stop.distance)
                : headingBetween(
                    point(
                      route.stops.find((s) => s.order === stop.order - 1)
                        ?.point ?? stop.point
                    ),
                    point(
                      route.stops.find((s) => s.order === stop.order + 1)
                        ?.point ?? stop.point
                    )
                  ),
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
      // Include short terminal connectors so a bus does not jump when dwell ends.
      const startPath = along(route, start.distance),
        endPath = along(route, end.distance)
      const s = point(start.point),
        e = point(end.point)
      const lead = Math.hypot(s.x - startPath.x, s.z - startPath.z),
        tail = Math.hypot(e.x - endPath.x, e.z - endPath.z)
      const pathLength = end.distance - start.distance
      const d = t * (lead + pathLength + tail)
      const lerp = (a: Point, b: Point, t: number) => ({
        x: a.x + (b.x - a.x) * t,
        z: a.z + (b.z - a.z) * t,
      })
      const position = !roads
        ? lerp(s, e, t)
        : d < lead
          ? lerp(s, startPath, d / lead)
          : d <= lead + pathLength
            ? along(route, start.distance + d - lead)
            : lerp(endPath, e, (d - lead - pathLength) / tail)
      return [
        {
          ...position,
          heading: !roads
            ? headingBetween(s, e)
            : d < lead
              ? headingBetween(s, startPath)
              : d <= lead + pathLength
                ? routeHeading(route, start.distance + d - lead)
                : headingBetween(endPath, e),
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
