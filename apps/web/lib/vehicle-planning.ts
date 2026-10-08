import { z } from "zod"
import { crewPlanningSchema, timedTrip } from "./crew-planning"
import { planningSourcesSchema } from "./service-planning"

export const vehiclePlanningSchema = z.object({
  trips: crewPlanningSchema.shape.trips,
  vehicles: z
    .object({
      id: z.string(),
      service: z.string().nullable(),
      scope: z.enum(["operating", "workshop"]),
    })
    .array(),
  readiness: planningSourcesSchema.shape.releases,
  holds: planningSourcesSchema.shape.holds,
  workOrders: z.array(
    z.object({
      id: z.string(),
      vehicle: z.string(),
      source: z.string(),
      opened: z.number().nullable(),
      updated: z.number().nullable(),
      expected: z.number().nullable(),
      released: z.number().nullable(),
      fault: z.string().nullable(),
      finding: z.string().nullable(),
      action: z.string().nullable(),
      status: z.string().nullable(),
      releaseStatus: z.string().nullable(),
      note: z.string().nullable(),
      facility: z.string().nullable(),
    })
  ),
})
export type VehiclePlanningData = z.infer<typeof vehiclePlanningSchema>
export function vehicleRows(
  data: VehiclePlanningData,
  start: number,
  end: number
) {
  const relevantHolds = data.holds.filter(
    (h) =>
      h.start === null || ((h.end === null || h.end > start) && h.start < end)
  )
  const ids = new Set([
    ...data.vehicles.map((v) => v.id),
    ...data.trips.map((t) => t.vehicle),
    ...data.readiness.map((r) => r.vehicle),
    ...relevantHolds.map((h) => h.vehicle),
  ])
  return [...ids]
    .sort((a, b) => (a ?? "~").localeCompare(b ?? "~"))
    .map((vehicle) => {
      const record = data.vehicles.find((v) => v.id === vehicle)
      const holds = relevantHolds.filter((h) => h.vehicle === vehicle)
      const readiness = data.readiness.filter((r) => r.vehicle === vehicle)
      const workOrders = data.workOrders
        .filter(
          (o) => o.vehicle === vehicle && (o.opened === null || o.opened < end)
        )
        .sort(
          (a, b) =>
            (b.opened ?? -Infinity) - (a.opened ?? -Infinity) ||
            a.id.localeCompare(b.id)
        )
      const trips = data.trips
        .filter((t) => t.vehicle === vehicle)
        .sort((a, b) => (a.departure ?? Infinity) - (b.departure ?? Infinity))
      const lanes: number[] = []
      const assignments = trips.map((trip) => {
        const maintenanceHolds =
          timedTrip(trip) && vehicle
            ? holds.filter(
                (h) =>
                  h.start !== null &&
                  (h.end === null || h.end > h.start) &&
                  h.start < trip.arrival &&
                  (h.end === null || h.end > trip.departure)
              )
            : []
        const conflicts: string[] = [],
          unverified: string[] = []
        let lane = 0
        if (!vehicle) unverified.push("Bus unassigned")
        if (!trip.crew) unverified.push("Crew unassigned")
        if (!timedTrip(trip))
          unverified.push("Missing or invalid scheduled times")
        else {
          lane = lanes.findIndex((e) => e <= trip.departure)
          if (lane < 0) lane = lanes.length
          lanes[lane] = trip.arrival
          if (vehicle) {
            for (const other of trips)
              if (
                other.id !== trip.id &&
                timedTrip(other) &&
                trip.departure < other.arrival &&
                other.departure < trip.arrival
              )
                conflicts.push(`Overlaps trip ${other.id}`)
            for (const h of maintenanceHolds)
              conflicts.push(`Maintenance hold ${h.id} (${h.source})`)
          }
          const covering = readiness.filter(
            (r) =>
              r.state === "released" &&
              r.issued !== null &&
              r.issued <= trip.departure &&
              r.start !== null &&
              r.end !== null &&
              r.start <= trip.departure &&
              r.end >= trip.arrival
          )
          if (!covering.length)
            unverified.push("No recorded release window covers this trip")
          if (!covering.some((r) => r.location !== null))
            unverified.push("Release location unverified")
        }
        if (
          holds.some(
            (h) =>
              h.start === null ||
              (h.end !== null && h.end <= (h.start ?? Infinity))
          )
        )
          unverified.push("Maintenance timing evidence incomplete")
        return { trip, conflicts, unverified, maintenanceHolds, lane }
      })
      return {
        vehicle,
        record,
        holds,
        readiness,
        workOrders,
        assignments,
        lanes: Math.max(1, lanes.length),
      }
    })
}
export type VehicleRow = ReturnType<typeof vehicleRows>[number]

export function vehicleRecordTime(at: number | null) {
  return at === null
    ? "Unknown"
    : new Date(at * 1000 + 8 * 3600 * 1000)
        .toISOString()
        .slice(0, 16)
        .replace("T", " ")
}
