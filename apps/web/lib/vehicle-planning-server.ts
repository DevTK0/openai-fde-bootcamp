import { queryDatabase } from "./database"
import { plannedAssignmentQuery } from "./crew-planning-server"
import { maintenanceHoldQuery } from "./service-planning-server"
import { vehiclePlanningSchema } from "./vehicle-planning"

export async function getVehiclePlanning(date: string, signal?: AbortSignal) {
  const [trips, vehicles, readiness, holds, workOrders] = await queryDatabase(
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
      {
        sql: `SELECT work_order_id AS id, vehicle_id AS vehicle, 'workshop_work_orders' AS source,
          unixepoch(opened_at) AS opened, unixepoch(updated_at) AS updated,
          unixepoch(expected_completion_at) AS expected, unixepoch(confirmed_release_at) AS released,
          fault_summary AS fault, NULL AS finding, NULL AS action, work_status AS status,
          release_status AS releaseStatus, workshop_note AS note, facility_id AS facility
          FROM workshop_work_orders
          UNION ALL
          SELECT json_extract(r.data, '$."Work order ID"'), json_extract(r.data, '$."Vehicle ID"'), t.id,
            unixepoch(replace(json_extract(r.data, '$."Opened at"'), ' ', 'T') || '+08:00'), NULL, NULL,
            unixepoch(replace(json_extract(r.data, '$."Confirmed release at"'), ' ', 'T') || '+08:00'),
            json_extract(r.data, '$."Reported symptom"'), json_extract(r.data, '$."Inspection finding"'),
            json_extract(r.data, '$."Repair action"'), json_extract(r.data, '$."Work status"'),
            json_extract(r.data, '$."Release status"'), json_extract(r.data, '$."Notes"'), NULL
          FROM handout_rows r JOIN handout_tables t ON t.id = r.table_id
          WHERE json_extract(t.metadata, '$.title') = 'Selected work orders'`,
      },
    ],
    signal
  )
  return vehiclePlanningSchema.parse({
    trips,
    vehicles,
    readiness,
    holds,
    workOrders,
  })
}
