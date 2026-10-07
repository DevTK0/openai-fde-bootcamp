import { loadScenario } from "@/lib/planning/fixture"
import type { PlanningFixture, ScenarioKind, PlanningMode, SourceReference } from "@/lib/planning/contracts"
import { buildCandidates } from "@/lib/planning/engine"

const fixtureTables: Record<string, keyof PlanningFixture> = {
  trips: "trips",
  control_actions: "controlActions",
  resource_updates: "resourceUpdates",
  crew_duties: "crewDuties",
  vehicle_readiness: "vehicleReadiness",
  terminal_movements: "terminalMovements",
  service_patterns: "servicePatterns",
  planning_constraints: "planningConstraints",
  workshop_vehicles: "workshopVehicles",
  workshop_work_orders: "workshopWorkOrders",
  route_stops: "routeStops",
  routes: "routes",
  stops: "stops",
  stop_calls: "stopCalls",
  origin_arrivals: "originArrivals",
}

function recordIds(row: Record<string, unknown>, table: string) {
  const values: unknown[] = []
  const idFields: Record<string, string[]> = {
    trips: ["trip_id"], control_actions: ["action_id"], resource_updates: ["update_id"],
    crew_duties: ["duty_id"], vehicle_readiness: ["readiness_id"], terminal_movements: ["movement_id"],
    service_patterns: ["route_id"], planning_constraints: ["constraint_id"], workshop_vehicles: ["vehicle_id"],
    workshop_work_orders: ["work_order_id"], routes: ["route_id"], stops: ["stop_id"],
    stop_calls: ["call_id"], origin_arrivals: ["arrival_record_id"],
  }
  for (const field of idFields[table] ?? []) values.push(row[field])
  if (table === "route_stops") values.push(`${row.route_id}:${row.stop_order}`)
  return values.map(String)
}

export async function getPlanningBundle(scenarioId: ScenarioKind, date: string, mode: PlanningMode) {
  const fixture = await loadScenario(scenarioId, date, mode)
  return { fixture, candidates: buildCandidates(fixture) }
}

export function getEvidenceRecordFromFixture(
  fixture: PlanningFixture,
  mode: PlanningMode,
  ref: SourceReference,
) {
  const field = fixtureTables[ref.table]
  if (!field) return null
  const records = field === "trips"
    ? [...fixture.trips, ...fixture.relatedTrips]
    : fixture[field] as Record<string, unknown>[]
  const found = records.find((row) => recordIds(row, ref.table).includes(ref.recordId))
  if (!found) return null
  if (mode !== "retrospective" && ref.table === "trips") {
    const { actual_vehicle_id, actual_crew_id, actual_departure_at, actual_arrival_at, completion_state, ...known } = found
    return known
  }
  if (mode === "prospective" && ["stop_calls", "origin_arrivals"].includes(ref.table)) return null
  return found
}

export async function getEvidenceRecord(
  scenarioId: ScenarioKind,
  date: string,
  mode: PlanningMode,
  ref: SourceReference,
) {
  const fixture = await loadScenario(scenarioId, date, mode)
  return getEvidenceRecordFromFixture(fixture, mode, ref)
}
