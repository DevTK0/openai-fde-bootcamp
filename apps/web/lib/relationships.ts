import operationsPassengers from "./operations-passengers.json"
import {
  data,
  dataset,
  filterHistory,
  monthly,
  num,
  sum,
  vehicles,
  type Row,
} from "./fleet"

export function pearson(points: { x: number; y: number }[]): number | null {
  if (points.length < 2) return null
  const mx = points.reduce((s, p) => s + p.x, 0) / points.length
  const my = points.reduce((s, p) => s + p.y, 0) / points.length
  let xy = 0,
    xx = 0,
    yy = 0
  for (const p of points) {
    xy += (p.x - mx) * (p.y - my)
    xx += (p.x - mx) ** 2
    yy += (p.y - my) ** 2
  }
  return xx && yy ? xy / Math.sqrt(xx * yy) : null
}
export function totals(rows: Row[]) {
  const km = sum(rows, "recorded_km"),
    repair = sum(rows, "repair_cost_sgd")
  return {
    km,
    repair,
    jobs: sum(rows, "repair_count"),
    holds: sum(rows, "repair_unavailable_hours"),
    rate: km ? (repair / km) * 1000 : 0,
    preventive: sum(rows, "additional_preventive_cost_sgd"),
    visits: sum(rows, "additional_preventive_visits"),
  }
}
export const annualVehicles = vehicles.map((vehicle) => ({
  vehicle,
  earlier: totals(filterHistory(vehicle, "earlier")),
  latest: totals(filterHistory(vehicle, "latest")),
  year: num(
    dataset("Fleet").rows.find((r) => r["Vehicle ID"] === vehicle)!,
    "Fictional in service year"
  ),
}))
export const annualTotals = {
  earlier: totals(filterHistory("all", "earlier")),
  latest: totals(filterHistory("all", "latest")),
}
export const componentObservations = data.tables.find(
  (t) => t.id === "selected_component_observations"
)!.rows
export function matchPassengerReports() {
  return dataset("Passenger reports").rows.map((report) => ({
    report,
    matches: (
      operationsPassengers.find((c) => c.caseId === report["Case ID"])
        ?.matches ?? []
    ).map((trip): Row => ({
      "Service observation ID":
        dataset("Service observations").rows.find(
          (r) => r["Trip ID"] === trip.trip_id
        )?.["Service observation ID"] ?? null,
      "Trip ID": trip.trip_id,
      "Actual vehicle ID": trip.actual_vehicle_id,
      "Service no": trip.service_no,
      "Departure delay seconds":
        (Date.parse(trip.actual_departure_at) -
          Date.parse(trip.scheduled_departure_at)) /
        1000,
      "Arrival delay seconds":
        (Date.parse(trip.actual_arrival_at) -
          Date.parse(trip.scheduled_arrival_at)) /
        1000,
      "Origin queue before people": trip.origin.queue_before_people,
      "Origin boarded people": trip.origin.boarded_people,
      "Origin queue after people": trip.origin.queue_after_people,
    })),
  }))
}
export function monthlyPoints(vehicle: string, measure: string) {
  return monthly
    .filter((r) => vehicle === "all" || r.vehicle_id === vehicle)
    .map((r) => ({
      x: num(r, "recorded_km"),
      y: num(r, measure),
      label: `${r.vehicle_id} · ${r.month}`,
    }))
}
