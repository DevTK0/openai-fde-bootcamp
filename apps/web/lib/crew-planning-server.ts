import { queryDatabase } from "./database"
import { crewPlanningSchema } from "./crew-planning"

export async function getCrewPlanning(date: string, signal?: AbortSignal) {
  const [trips, duties] = await queryDatabase(
    [
      {
        sql: `SELECT t.trip_id AS id, t.service_no AS service, t.route_id AS route,
      t.planned_vehicle_id AS vehicle, t.planned_crew_id AS crew,
      unixepoch(t.scheduled_departure_at) AS departure, unixepoch(t.scheduled_arrival_at) AS arrival,
      t.origin_stop_id AS origin, t.destination_stop_id AS destination,
      COALESCE(o.description, t.origin_stop_id) AS originName, COALESCE(d.description, t.destination_stop_id) AS destinationName
      FROM trips t LEFT JOIN stops o ON o.stop_id = t.origin_stop_id LEFT JOIN stops d ON d.stop_id = t.destination_stop_id
      WHERE t.service_date = ? ORDER BY t.scheduled_departure_at, t.trip_id`,
        parameters: [date],
      },
      {
        sql: `SELECT d.duty_id AS id, d.crew_id AS crew, d.qualified_service_no AS service,
      unixepoch(d.record_issued_at) AS issued, unixepoch(d.available_from) AS start, unixepoch(d.available_until) AS end,
      d.start_stop_id AS location, s.description AS locationName, unixepoch(d.protected_break_start) AS breakStart,
      unixepoch(d.protected_break_end) AS breakEnd, d.maximum_continuous_duty_minutes AS maximum,
      d.takeover_seconds AS takeover, d.basis FROM crew_duties d LEFT JOIN stops s ON s.stop_id = d.start_stop_id
      WHERE d.service_date = ? ORDER BY d.crew_id, d.available_from`,
        parameters: [date],
      },
    ],
    signal
  )
  return crewPlanningSchema.parse({ trips, duties })
}
