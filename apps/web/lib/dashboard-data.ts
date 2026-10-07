import { z } from "zod"

export const rowSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.null()])
)
export const datasetSchema = z.object({
  id: z.string(),
  file: z.string(),
  sheet: z.string(),
  title: z.string(),
  columns: z.array(z.string()),
  rows: z.array(rowSchema),
  sourceRows: z.array(z.number()),
  notes: z.array(z.string()),
})
const documentsSchema = z.array(
  z.object({ file: z.string(), text: z.string() })
)
export const fleetSchema = z.object({
  tables: z.array(datasetSchema),
  documents: documentsSchema,
})
export const manifestSchema = z.object({
  tables: z.array(
    z.object({
      id: z.string(),
      file: z.string(),
      columns: z.array(z.string()),
      count: z.number(),
      sha256: z.string(),
    })
  ),
  documents: documentsSchema,
  source: z.string(),
  scope: z.string(),
  dates: z.array(z.string()),
  services: z.array(z.string()),
  coverage: z.object({
    vehicles: z.number(),
    workshopVehicles: z.number(),
    trips: z.number(),
    stopCalls: z.number(),
    services: z.number(),
    routes: z.number(),
    stops: z.number(),
  }),
})
export const passengerTripSchema = z.object({
  trip_id: z.string(),
  service_date: z.string(),
  route_id: z.string(),
  service_no: z.string(),
  planned_vehicle_id: z.string(),
  actual_vehicle_id: z.string(),
  scheduled_departure_at: z.string(),
  scheduled_arrival_at: z.string(),
  actual_departure_at: z.string(),
  actual_arrival_at: z.string(),
  origin: z.object({
    queue_before_people: z.number(),
    boarded_people: z.number(),
    queue_after_people: z.number(),
  }),
})
export const boardingSchema = z.object({
  service: z.string(),
  route: z.string(),
  stop: z.string(),
  departure: z.string(),
  rows: z.array(
    z.object({
      date: z.string(),
      tripId: z.string(),
      callId: z.string(),
      vehicle: z.string(),
      waiting: z.number(),
      boarded: z.number(),
      remaining: z.number(),
      capacity: z.number(),
      onboard: z.number(),
      reported: z.boolean(),
    })
  ),
})
export type FleetData = z.infer<typeof fleetSchema>
export type OperationsManifest = z.infer<typeof manifestSchema>
export type PassengerMatches = {
  caseId: string
  matches: z.infer<typeof passengerTripSchema>[]
}[]
export type DashboardData = {
  fleet: FleetData
  operationsManifest: OperationsManifest
  operationsPassengers: PassengerMatches
  boardingHistory: z.infer<typeof boardingSchema>
}
