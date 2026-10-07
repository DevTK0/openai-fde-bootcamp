import { queryDatabase } from "./database"
import {
  buildPlanningReport,
  planningSourcesSchema,
  type PlanningSelection,
} from "./service-planning"

export async function getPlanningReport(
  selection: PlanningSelection,
  signal?: AbortSignal
) {
  const [
    routes,
    positions,
    vehicles,
    trips,
    calls,
    releases,
    duties,
    movements,
    holds,
  ] = await queryDatabase(
    [
      {
        sql: `SELECT route_id AS id, service_no AS service, direction, service_name AS name, origin_stop_id AS origin FROM routes ORDER BY route_id`,
      },
      {
        sql: `SELECT p.route_id AS route, p.stop_order AS "order", p.stop_id AS stop, COALESCE(s.description, p.stop_id) AS name,
      p.stop_order < (SELECT max(last.stop_order) FROM route_stops last WHERE last.route_id = p.route_id) AS boarding
      FROM route_stops p LEFT JOIN stops s USING(stop_id) ORDER BY p.route_id, p.stop_order`,
      },
      {
        sql: `SELECT vehicle_id AS id, assigned_service_no AS service FROM vehicles ORDER BY vehicle_id`,
      },
      {
        sql: `SELECT trip_id AS id, service_no AS service, route_id AS route, actual_vehicle_id AS vehicle, actual_crew_id AS crew,
      origin_stop_id AS origin, destination_stop_id AS destination, unixepoch(scheduled_departure_at) AS scheduled,
      unixepoch(actual_departure_at) AS departure, unixepoch(actual_arrival_at) AS arrival FROM trips WHERE service_date = ?`,
        parameters: [selection.date],
      },
      {
        sql: `SELECT call_id AS id, trip_id AS trip, route_id AS route, stop_order AS "order", actual_vehicle_id AS vehicle,
      unixepoch(actual_arrival_at) AS arrival, unixepoch(actual_departure_at) AS departure,
      unixepoch(boarding_cutoff_at) AS observed, queue_after_people AS queue, boarded_people AS boarded, alighted_people AS alighted FROM stop_calls WHERE service_date = ?`,
        parameters: [selection.date],
      },
      {
        sql: `SELECT readiness_id AS id, vehicle_id AS vehicle, unixepoch(issued_at) AS issued, unixepoch(available_from) AS start,
      unixepoch(available_until) AS end, location_stop_id AS location, release_state AS state FROM vehicle_readiness WHERE service_date = ?`,
        parameters: [selection.date],
      },
      {
        sql: `SELECT duty_id AS id, crew_id AS crew, qualified_service_no AS service, unixepoch(record_issued_at) AS issued,
      unixepoch(available_from) AS start, unixepoch(available_until) AS end, start_stop_id AS location,
      unixepoch(protected_break_start) AS breakStart, unixepoch(protected_break_end) AS breakEnd,
      maximum_continuous_duty_minutes AS maximum, takeover_seconds AS takeover FROM crew_duties WHERE service_date = ? ORDER BY duty_id`,
        parameters: [selection.date],
      },
      {
        sql: `SELECT movement_id AS id, vehicle_id AS vehicle, crew_id AS crew, unixepoch(actual_start_at) AS start,
      unixepoch(actual_end_at) AS end, from_stop_id AS "from", to_stop_id AS "to" FROM terminal_movements WHERE service_date = ?`,
        parameters: [selection.date],
      },
      {
        sql: `SELECT work_order_id AS id, vehicle_id AS vehicle, unixepoch(opened_at) AS start,
      unixepoch(confirmed_release_at) AS end, 'workshop_work_orders' AS source FROM workshop_work_orders
      UNION ALL
      SELECT json_extract(r.data, '$."Work order ID"'), json_extract(r.data, '$."Vehicle ID"'),
        unixepoch(replace(json_extract(r.data, '$."Opened at"'), ' ', 'T') || '+08:00'),
        unixepoch(replace(json_extract(r.data, '$."Confirmed release at"'), ' ', 'T') || '+08:00'), t.id
      FROM handout_rows r JOIN handout_tables t ON t.id = r.table_id WHERE json_extract(t.metadata, '$.title') = 'Selected work orders'
      UNION ALL
      SELECT json_extract(r.data, '$."Service ID"'), json_extract(r.data, '$."Vehicle ID"'),
        unixepoch(replace(json_extract(r.data, '$."Started at"'), ' ', 'T') || '+08:00'),
        unixepoch(replace(json_extract(r.data, '$."Completed at"'), ' ', 'T') || '+08:00'), t.id
      FROM handout_rows r JOIN handout_tables t ON t.id = r.table_id WHERE json_extract(t.metadata, '$.title') = 'Service records'`,
      },
    ],
    signal
  )
  return buildPlanningReport(
    planningSourcesSchema.parse({
      routes,
      positions,
      vehicles,
      trips,
      calls,
      releases,
      duties,
      movements,
      holds,
    }),
    selection
  )
}
