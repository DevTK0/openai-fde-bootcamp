import sourceManifest from "../data/operations/manifest.json"
import type { Row } from "./fleet"
export const operationsManifest = sourceManifest
export type OperationGroup = {
  date: string
  service: string
  trips: number
  completed: number
  km: number
  positioningKm: number
  seconds: number
  vehicles: string[]
  departureDelays: number[]
  arrivalDelays: number[]
  substitutions: number
  calls: number
  boardings: number
  alightings: number
  queuedCalls: number
  fullCalls: number
  occupancySum: number
  initialQueue: number
  arrivals: number
  remainingQueue: number
  windowBoardings: number
  controlActions: number
  resourceUpdates: number
}
export type Hotspot = {
  date: string
  service: string
  route: string
  order: number
  stop: string
  name: string
  arrivals: number
  boardings: number
  remaining: number
}
export type OperationsSnapshot = {
  groups: OperationGroup[]
  hotspots: Hotspot[]
  workshop: Row[]
}
export type OperationsMetrics = {
  trips: number
  completed: number
  vehicles: number
  km: number
  hours: number
  boardings: number
  calls: number
  queuedCalls: number
  fullCalls: number
  meanOccupancy: number
  initialQueue: number
  arrivals: number
  remainingQueue: number
  substitutions: number
  meanDeparture: number
  meanArrival: number
  p90Arrival: number
  lateDepartures: number
  earlyDepartures: number
  onTimeDepartures: number
}
export type OperationsReport = {
  metrics: OperationsMetrics
  byService: ({ name: string } & OperationsMetrics)[]
  byDate: ({ name: string } & OperationsMetrics)[]
  hotspots: Hotspot[]
  workshop: Row[]
}
export function quantile(values: number[], fraction: number) {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b),
    index = (sorted.length - 1) * fraction,
    lower = Math.floor(index)
  return (
    sorted[lower]! +
    (sorted[Math.min(lower + 1, sorted.length - 1)]! - sorted[lower]!) *
      (index - lower)
  )
}
export function operationMetrics(groups: OperationGroup[]): OperationsMetrics {
  const total = (key: keyof OperationGroup) =>
    groups.reduce(
      (s, g) => s + (typeof g[key] === "number" ? (g[key] as number) : 0),
      0
    )
  const departures = groups.flatMap((g) => g.departureDelays),
    arrivals = groups.flatMap((g) => g.arrivalDelays)
  const mean = (values: number[]) =>
    values.length ? values.reduce((a, b) => a + b, 0) / values.length / 60 : 0
  return {
    trips: total("trips"),
    completed: total("completed"),
    vehicles: new Set(groups.flatMap((g) => g.vehicles)).size,
    km: total("km") + total("positioningKm"),
    hours: total("seconds") / 3600,
    boardings: total("boardings"),
    calls: total("calls"),
    queuedCalls: total("queuedCalls"),
    fullCalls: total("fullCalls"),
    meanOccupancy: total("calls")
      ? (total("occupancySum") / total("calls")) * 100
      : 0,
    initialQueue: total("initialQueue"),
    arrivals: total("arrivals"),
    remainingQueue: total("remainingQueue"),
    substitutions: total("substitutions"),
    meanDeparture: mean(departures),
    meanArrival: mean(arrivals),
    p90Arrival: quantile(arrivals, 0.9) / 60,
    lateDepartures: departures.filter((d) => d > 300).length,
    earlyDepartures: departures.filter((d) => d < 0).length,
    onTimeDepartures: departures.filter((d) => d >= 0 && d <= 300).length,
  }
}
export function buildOperationsReport(
  snapshot: OperationsSnapshot,
  service = "all",
  date = "all"
): OperationsReport {
  const matches = (r: { service: string; date: string }) =>
    (service === "all" || r.service === service) &&
    (date === "all" || r.date === date)
  const groups = snapshot.groups.filter(matches)
  const grouped = (key: "service" | "date") =>
    [...new Set(groups.map((g) => g[key]))]
      .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
      .map((name) => ({
        name,
        ...operationMetrics(groups.filter((g) => g[key] === name)),
      }))
  const stops = new Map<string, Hotspot>()
  for (const r of snapshot.hotspots.filter(matches)) {
    const key = `${r.route}/${r.order}`,
      prev = stops.get(key)
    stops.set(
      key,
      prev
        ? {
            ...prev,
            arrivals: prev.arrivals + r.arrivals,
            boardings: prev.boardings + r.boardings,
            remaining: prev.remaining + r.remaining,
          }
        : { ...r, date: date === "all" ? "All ten dates" : date }
    )
  }
  return {
    metrics: operationMetrics(groups),
    byService: grouped("service"),
    byDate: grouped("date"),
    hotspots: [...stops.values()]
      .sort((a, b) => b.remaining - a.remaining)
      .slice(0, 20),
    workshop: snapshot.workshop,
  }
}
