import { z } from "zod"
import { scheduledServiceSchema } from "./scheduled-service"
import { planningSourcesSchema } from "./service-planning"

export const crewPlanningSchema = z.object({
  trips: scheduledServiceSchema.shape.plannedTrips.element
    .extend({
      origin: z.string(),
      destination: z.string(),
      originName: z.string(),
      destinationName: z.string(),
    })
    .array(),
  duties: planningSourcesSchema.shape.duties.element
    .extend({
      basis: z.string().nullable(),
      locationName: z.string().nullable(),
    })
    .array(),
})
export type CrewPlanningData = z.infer<typeof crewPlanningSchema>
export type CrewAssignment = CrewPlanningData["trips"][number]
export function timedTrip(
  trip: CrewAssignment
): trip is CrewAssignment & { departure: number; arrival: number } {
  return (
    trip.departure !== null &&
    trip.arrival !== null &&
    trip.arrival > trip.departure
  )
}
const overlaps = (a: number, b: number, c: number, d: number) => a < d && c < b

export function crewRows(data: CrewPlanningData) {
  const ids = new Set([
    ...data.trips.map((t) => t.crew),
    ...data.duties.map((d) => d.crew),
  ])
  return [...ids]
    .sort((a, b) => (a ?? "~").localeCompare(b ?? "~"))
    .map((crew) => {
      const duties = data.duties.filter((d) => d.crew === crew)
      const trips = data.trips
        .filter((t) => t.crew === crew)
        .sort((a, b) => (a.departure ?? Infinity) - (b.departure ?? Infinity))
      const laneEnds: number[] = []
      const assignments = trips.map((trip) => {
        const conflicts: string[] = []
        const unverified: string[] = []
        let lane = 0
        if (!crew) unverified.push("Crew unassigned")
        if (!trip.vehicle) unverified.push("Bus unassigned")
        if (!timedTrip(trip))
          unverified.push("Missing or invalid scheduled times")
        else {
          lane = laneEnds.findIndex((end) => end <= trip.departure)
          if (lane < 0) lane = laneEnds.length
          laneEnds[lane] = trip.arrival
          if (crew) {
            for (const other of trips) {
              if (
                other.id !== trip.id &&
                timedTrip(other) &&
                overlaps(
                  trip.departure,
                  trip.arrival,
                  other.departure,
                  other.arrival
                )
              )
                conflicts.push(`Overlaps trip ${other.id}`)
            }
            for (const duty of duties) {
              if (
                duty.breakStart !== null &&
                duty.breakEnd !== null &&
                duty.breakEnd > duty.breakStart &&
                overlaps(
                  trip.departure,
                  trip.arrival,
                  duty.breakStart,
                  duty.breakEnd
                )
              )
                conflicts.push(`Overlaps protected break ${duty.id}`)
            }
          }
          const covering = duties.filter(
            (d) =>
              d.start !== null &&
              d.end !== null &&
              d.start <= trip.departure &&
              d.end >= trip.arrival
          )
          if (!covering.length)
            unverified.push("No recorded duty window covers this trip")
          if (!covering.some((d) => d.location !== null))
            unverified.push("Start location unverified")
          if (!covering.some((d) => d.service === trip.service))
            unverified.push("Service qualification unverified for this window")
        }
        if (
          !duties.length ||
          duties.some(
            (d) =>
              d.breakStart === null ||
              d.breakEnd === null ||
              d.breakEnd <= d.breakStart
          )
        )
          unverified.push("Break evidence incomplete")
        return { trip, conflicts, unverified, lane }
      })
      return { crew, duties, assignments, lanes: Math.max(1, laneEnds.length) }
    })
}
export type CrewRow = ReturnType<typeof crewRows>[number]
export const crewClock = (at: number | null) =>
  at === null
    ? "Unknown"
    : new Date(at * 1000 + 8 * 3600 * 1000).toISOString().slice(11, 16)
