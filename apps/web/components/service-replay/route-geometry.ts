import type { PlanningDetail } from "@/lib/service-planning"
import backdrop from "./map-data.json"
import shapes from "./road-shapes.json"

type Coordinate = number[]
export type RoadShape = {
  service: string
  direction: number
  parts: Coordinate[][]
}
const metresPerUnit = 111195 / backdrop.projection.scale
const distance = (a: Coordinate, b: Coordinate) =>
  Math.hypot((a[0] ?? 0) - (b[0] ?? 0), (a[1] ?? 0) - (b[1] ?? 0))
export function project(longitude: number, latitude: number): Coordinate {
  const p = backdrop.projection
  return [
    (longitude - p.lon0) * p.cos * p.scale,
    -(latitude - p.lat0) * p.scale,
  ]
}
export type Route = {
  id: string
  service: string
  direction: number
  origin: string
  destination: string
  points: Coordinate[]
  distances: number[]
  stops: {
    order: number
    id: string
    name: string
    point: Coordinate
    distance: number
    offsetMetres: number
  }[]
  legs: {
    points: Coordinate[]
    kind: "road" | "direct"
    from: number
    to: number
  }[]
  missingStops: number
}
type Node = { point: Coordinate; edges: Map<number, number> }

// A graph joins multipart KML at shared vertices; it never joins disconnected pieces silently.
function roadGraph(parts: Coordinate[][], stops: Coordinate[]) {
  const nodes: Node[] = []
  const ids = new Map<string, number>()
  const vertex = (point: Coordinate) => {
    const key = point.map((v) => v.toFixed(5)).join(",")
    const existing = ids.get(key)
    if (existing !== undefined) return existing
    const id = nodes.length
    ids.set(key, id)
    nodes.push({ point, edges: new Map() })
    return id
  }
  const connect = (a: number, b: number) => {
    const from = nodes[a],
      to = nodes[b]
    if (!from || !to || a === b) return
    const length = distance(from.point, to.point)
    from.edges.set(b, length)
    to.edges.set(a, length)
  }
  const segments: {
    a: number
    b: number
    cuts: { t: number; id: number }[]
  }[] = []
  for (const part of parts) {
    for (let i = 1; i < part.length; i++) {
      const a = part[i - 1],
        b = part[i]
      if (!a || !b || distance(a, b) === 0) continue
      const first = vertex(a),
        last = vertex(b)
      segments.push({
        a: first,
        b: last,
        cuts: [
          { t: 0, id: first },
          { t: 1, id: last },
        ],
      })
    }
  }
  const anchors = stops.map((stop) => {
    let best:
      | {
          segment: (typeof segments)[number]
          t: number
          point: Coordinate
          error: number
        }
      | undefined
    for (const segment of segments) {
      const a = nodes[segment.a]?.point,
        b = nodes[segment.b]?.point
      if (!a || !b) continue
      const dx = (b[0] ?? 0) - (a[0] ?? 0),
        dz = (b[1] ?? 0) - (a[1] ?? 0)
      const t = Math.max(
        0,
        Math.min(
          1,
          (((stop[0] ?? 0) - (a[0] ?? 0)) * dx +
            ((stop[1] ?? 0) - (a[1] ?? 0)) * dz) /
            (dx * dx + dz * dz)
        )
      )
      const point = [(a[0] ?? 0) + t * dx, (a[1] ?? 0) + t * dz]
      const error = distance(stop, point)
      if (!best || error < best.error) best = { segment, t, point, error }
    }
    // Beyond this display tolerance, retain a direct estimate instead of a misleading road snap.
    if (!best || best.error * metresPerUnit > 250) return null
    const id = vertex(best.point)
    best.segment.cuts.push({ t: best.t, id })
    return { id, offsetMetres: best.error * metresPerUnit }
  })
  for (const segment of segments) {
    segment.cuts.sort((a, b) => a.t - b.t)
    for (let i = 1; i < segment.cuts.length; i++) {
      const a = segment.cuts[i - 1],
        b = segment.cuts[i]
      if (a && b) connect(a.id, b.id)
    }
  }
  return { nodes, anchors }
}
function shortestPath(
  nodes: Node[],
  from: number,
  to: number
): Coordinate[] | null {
  const frontier = new Map([[from, 0]])
  const costs = new Map([[from, 0]])
  const previous = new Map<number, number>()
  while (frontier.size) {
    let current = from,
      minimum = Infinity
    for (const [id, cost] of frontier)
      if (cost < minimum) {
        current = id
        minimum = cost
      }
    frontier.delete(current)
    if (current === to) {
      const path: Coordinate[] = []
      let id: number | undefined = to
      while (id !== undefined) {
        const node = nodes[id]
        if (!node) return null
        path.unshift(node.point)
        id = previous.get(id)
      }
      return path
    }
    const node = nodes[current]
    if (!node) continue
    for (const [next, length] of node.edges) {
      const cost = minimum + length
      if (cost >= (costs.get(next) ?? Infinity)) continue
      costs.set(next, cost)
      previous.set(next, current)
      frontier.set(next, cost)
    }
  }
  return null
}

export function buildRoutes(
  detail: Pick<PlanningDetail, "routes" | "positions">,
  sources: readonly RoadShape[] = shapes
): Route[] {
  return detail.routes.map((route) => {
    const positions = detail.positions
      .filter((p) => p.route === route.id)
      .sort((a, b) => a.order - b.order)
    const stops = positions.flatMap((p) =>
      p.longitude == null || p.latitude == null
        ? []
        : [
            {
              order: p.order,
              id: p.stop,
              name: p.name,
              point: project(p.longitude, p.latitude),
              distance: 0,
              offsetMetres: 0,
            },
          ]
    )
    const source = sources.find(
      (s) => s.service === route.service && s.direction === route.direction
    )
    const { nodes, anchors } = roadGraph(
      source?.parts ?? [],
      stops.map((s) => s.point)
    )
    const points: Coordinate[] = [],
      distances: number[] = [],
      legs: Route["legs"] = []
    const append = (point: Coordinate) => {
      const last = points.at(-1)
      if (last && distance(last, point) < 0.000001) return
      distances.push(
        (distances.at(-1) ?? 0) + (last ? distance(last, point) : 0)
      )
      points.push(point)
    }
    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i],
        previous = stops[i - 1]
      if (!stop) continue
      const anchor = anchors[i],
        before = anchors[i - 1]
      stop.offsetMetres = anchor?.offsetMetres ?? 0
      if (previous) {
        const path =
          anchor && before && stop.order === previous.order + 1
            ? shortestPath(nodes, before.id, anchor.id)
            : null
        const leg = {
          points: [previous.point, ...(path ?? []), stop.point],
          kind: path ? ("road" as const) : ("direct" as const),
          from: previous.order,
          to: stop.order,
        }
        legs.push(leg)
        leg.points.forEach(append)
      } else append(stop.point)
      stop.distance = distances.at(-1) ?? 0
    }
    return {
      ...route,
      origin: stops[0]?.name ?? route.origin,
      destination: stops.at(-1)?.name ?? "Unknown",
      points,
      distances,
      stops,
      legs,
      missingStops: positions.length - stops.length,
    }
  })
}
