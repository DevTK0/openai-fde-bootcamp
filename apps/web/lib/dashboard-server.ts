import { z } from "zod"
import { withDatabase, readMetadata } from "./database"
import { readOperationsManifest } from "./operations-server"
import {
  boardingSchema,
  fleetSchema,
  passengerTripSchema,
  type DashboardData,
} from "./dashboard-data"

export function readDashboardData(): DashboardData {
  return withDatabase((database) => {
    const tables = database
      .prepare("SELECT id, metadata FROM handout_tables ORDER BY position")
      .all()
      .map((value) => {
        const table = z
          .object({ id: z.string(), metadata: z.string() })
          .parse(value)
        const metadata: unknown = JSON.parse(table.metadata)
        return {
          ...z.record(z.string(), z.unknown()).parse(metadata),
          rows: database
            .prepare(
              "SELECT data FROM handout_rows WHERE table_id = ? ORDER BY position"
            )
            .all(table.id)
            .map((row) =>
              JSON.parse(z.object({ data: z.string() }).parse(row).data)
            ),
        }
      })
    const fleet = fleetSchema.parse({
      tables,
      documents: readMetadata(
        database,
        "documents",
        fleetSchema.shape.documents
      ),
    })
    const operationsPassengers = fleet.tables
      .find((table) => table.sheet === "Passenger reports")!
      .rows.map((report) => {
        const caseId = z.string().parse(report["Case ID"])
        const matches = database
          .prepare(
            "SELECT trips.* FROM passenger_links JOIN trips USING (trip_id) WHERE case_id = ? ORDER BY passenger_links.rowid"
          )
          .all(caseId)
          .map((trip) => {
            const tripId = z.string().parse(trip.trip_id)
            const origin = database
              .prepare(
                "SELECT * FROM stop_calls WHERE trip_id = ? AND stop_order = 1"
              )
              .get(tripId)
            return passengerTripSchema.parse({ ...trip, origin })
          })
        return { caseId, matches }
      })
    const rows = database
      .prepare(
        `SELECT t.service_date AS date, t.trip_id AS tripId, c.call_id AS callId,
      t.actual_vehicle_id AS vehicle, c.queue_before_people AS waiting, c.boarded_people AS boarded,
      c.queue_after_people AS remaining, c.capacity_people AS capacity, c.onboard_departing AS onboard, b.reported
      FROM boarding_cohort b JOIN trips t USING (trip_id)
      JOIN stop_calls c ON c.trip_id = t.trip_id AND c.stop_order = 1 ORDER BY b.position`
      )
      .all()
    return {
      fleet,
      operationsManifest: readOperationsManifest(database),
      operationsPassengers,
      boardingHistory: boardingSchema.parse({
        ...readMetadata(
          database,
          "boarding",
          boardingSchema.omit({ rows: true })
        ),
        rows: rows.map((row) => ({ ...row, reported: row.reported === 1 })),
      }),
    }
  })
}
