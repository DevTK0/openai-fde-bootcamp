import { queryDatabase } from "./database"
import { plannedAssignmentQuery } from "./crew-planning-server"
import { maintenanceHoldQuery } from "./service-planning-server"
import { vehiclePlanningSchema } from "./vehicle-planning"

export async function getVehiclePlanning(date: string, signal?: AbortSignal) {
  const [trips, vehicles, readiness, holds] = await queryDatabase(
    [
      plannedAssignmentQuery(date),
      {
        sql: `SELECT vehicle_id AS id, assigned_service_no AS service, 'operating' AS scope FROM vehicles
      UNION ALL SELECT vehicle_id AS id, NULL AS service, 'workshop' AS scope FROM workshop_vehicles`,
      },
      {
        sql: `SELECT readiness_id AS id, vehicle_id AS vehicle, unixepoch(issued_at) AS issued,
      unixepoch(available_from) AS start, unixepoch(available_until) AS end, location_stop_id AS location,
      release_state AS state FROM vehicle_readiness WHERE service_date = ?`,
        parameters: [date],
      },
      maintenanceHoldQuery,
    ],
    signal
  )
  return vehiclePlanningSchema.parse({ trips, vehicles, readiness, holds })
}
