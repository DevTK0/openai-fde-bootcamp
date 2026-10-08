import { z } from "zod"
import { validateResources } from "@/lib/planning/engine"
import type { PlanningFixture, TripAssignment } from "@/lib/planning/contracts"
import { allContextRecords, serviceDateAt } from "./context-db"
import type { LiveEvent } from "./contracts"

export const assignmentSchema = z.strictObject({
  tripId: z.string().min(1).max(120),
  vehicleId: z.string().min(1).max(120),
  crewId: z.string().min(1).max(120),
  routeId: z.string().min(1).max(120),
  departureAt: z.iso.datetime({ offset: true }),
  arrivalAt: z.iso.datetime({ offset: true }),
})
export type AgentAssignment = z.infer<typeof assignmentSchema>
export function validateAgentProposal(
  assignments: AgentAssignment[],
  event: LiveEvent,
  asOf: string,
  events: LiveEvent[]
) {
  const dateFilters = [
    { field: "service_date", op: "eq" as const, value: event.serviceDate },
  ]
  const trips = allContextRecords("trips", dateFilters, asOf).map(
    (row) => row.record
  )
  const vehicles = [
    ...allContextRecords("vehicles", [], asOf),
    ...allContextRecords("workshop_vehicles", [], asOf),
  ]
  const routes = allContextRecords("routes", [], asOf).map((row) => row.record)
  const readiness = allContextRecords(
    "vehicle_readiness",
    dateFilters,
    asOf
  ).map((row) => row.record)
  const duties = allContextRecords("crew_duties", dateFilters, asOf).map(
    (row) => row.record
  )
  const updates = allContextRecords("resource_updates", dateFilters, asOf).map(
    (row) => row.record
  )
  const patterns = allContextRecords("service_patterns", [], asOf).map(
    (row) => row.record
  )
  const conflicts: string[] = [],
    conditional: string[] = []
  const latest = (rows: Record<string, unknown>[], key: string) => [
    ...new Map(
      [...rows].reverse().map((row) => [String(row[key]), row])
    ).values(),
  ]
  const latestFault = new Map<string, LiveEvent>()
  for (const row of [...events].sort(
    (a, b) =>
      Date.parse(a.occurredAt) - Date.parse(b.occurredAt) || a.seq - b.seq
  ))
    if (row.vehicleId && (row.kind === "fault" || row.kind === "clearance"))
      latestFault.set(row.vehicleId, row)
  const checked: TripAssignment[] = assignments.map((row) => {
    const route = routes.find((route) => route.route_id === row.routeId)
    const trip = trips.find((trip) => trip.trip_id === row.tripId)
    if (
      !vehicles.some((vehicle) => vehicle.record.vehicle_id === row.vehicleId)
    )
      conflicts.push(`Unknown vehicle ${row.vehicleId}.`)
    if (!duties.some((duty) => duty.crew_id === row.crewId))
      conflicts.push(`No admitted duty record for driver ${row.crewId}.`)
    if (!route) conflicts.push(`Unknown route ${row.routeId}.`)
    if (trip && trip.route_id !== row.routeId)
      conflicts.push(
        `${row.tripId} must retain its full published route ${trip.route_id}.`
      )
    if (trip?.actual_departure_at)
      conflicts.push(
        `${row.tripId} has already departed as of this assessment.`
      )
    if (!trip && !row.tripId.startsWith("EXTRA-"))
      conflicts.push(
        `New service trips must have an EXTRA- ID; ${row.tripId} is not a published trip.`
      )
    if (
      serviceDateAt(row.departureAt) !== event.serviceDate ||
      Date.parse(row.departureAt) <= Date.parse(asOf)
    )
      conflicts.push(
        `${row.tripId} must depart after the assessment time on the same service date.`
      )
    const duration =
      (Date.parse(row.arrivalAt) - Date.parse(row.departureAt)) / 1000
    const pattern = patterns.find((pattern) => pattern.route_id === row.routeId)
    const minDuration = trip
      ? (Date.parse(String(trip.scheduled_arrival_at)) -
          Date.parse(String(trip.scheduled_departure_at))) /
        1000
      : Number(pattern?.planned_running_seconds)
    if (!Number.isFinite(minDuration) || duration < minDuration)
      conflicts.push(
        `${row.tripId} does not allow the supplied full route running time.`
      )
    if (latestFault.get(row.vehicleId)?.kind === "fault")
      conflicts.push(
        `${row.vehicleId} has an active reported fault and cannot be assigned.`
      )
    return {
      ...row,
      serviceNo: String(route?.service_no ?? event.service),
      originStopId: String(route?.origin_stop_id ?? ""),
      destinationStopId: String(route?.destination_stop_id ?? ""),
      protected: true,
    }
  })
  if (new Set(assignments.map((row) => row.tripId)).size !== assignments.length)
    conflicts.push("A trip can have only one proposed assignment.")
  const ids = new Set(assignments.map((row) => row.tripId))
  const fixture = {
    scenario: { date: event.serviceDate, mode: "prospective" },
    trips: [],
    relatedTrips: trips.filter((trip) => !ids.has(String(trip.trip_id))),
    controlActions: allContextRecords("control_actions", dateFilters, asOf).map(
      (row) => row.record
    ),
    vehicleReadiness: latest(readiness, "vehicle_id"),
    crewDuties: latest(
      duties.filter((duty) =>
        checked.some(
          (row) =>
            row.crewId === duty.crew_id &&
            row.serviceNo === duty.qualified_service_no
        )
      ),
      "crew_id"
    ),
    terminalMovements: allContextRecords(
      "terminal_movements",
      dateFilters,
      asOf
    ).map((row) => row.record),
    workshopVehicles: allContextRecords("workshop_vehicles", [], asOf).map(
      (row) => row.record
    ),
    workshopWorkOrders: allContextRecords("workshop_work_orders", [], asOf).map(
      (row) => row.record
    ),
  } as unknown as PlanningFixture
  // Latest resource updates carry availability/location but do not fabricate an Engineering release.
  for (const update of updates) {
    const duty = fixture.crewDuties.find(
      (row) => row.crew_id === update.resource_id
    )
    if (duty && update.resource_type === "crew")
      duty.start_stop_id = update.location_stop_id ?? duty.start_stop_id
  }
  const result = validateResources(fixture, checked)
  for (const conflict of result.conflicts)
    (conflict.conditional ? conditional : conflicts).push(conflict.message)
  return {
    status: conflicts.length
      ? "blocked"
      : conditional.length
        ? "conditional"
        : "feasible",
    assignments,
    conflicts: [...new Set(conflicts)],
    conditions: [...new Set(conditional)],
    minSlackSeconds: result.minSlackSeconds,
    scope:
      "Checks include admitted fleet readiness, qualification, duty/break limits, live fault holds and protected network commitments. No dispatch. Source is a dated fictional exercise.",
  }
}
