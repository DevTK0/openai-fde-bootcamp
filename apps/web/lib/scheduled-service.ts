import { z } from "zod"
import {
  planningDetailSchema,
  replayEventTimes,
  type PlanningDetail,
} from "./service-planning"

export const scheduledServiceSchema = planningDetailSchema
  .pick({ routes: true, positions: true })
  .extend({
    plannedTrips: z.array(
      z.object({
        id: z.string(),
        service: z.string(),
        route: z.string(),
        vehicle: z.string().nullable(),
        crew: z.string().nullable(),
        departure: z.number().finite().nullable(),
        arrival: z.number().finite().nullable(),
      })
    ),
  })
export type ScheduledService = z.infer<typeof scheduledServiceSchema>
export type ServiceMapDetail = PlanningDetail | ScheduledService

export function serviceEventTimes(
  detail: ServiceMapDetail,
  start: number,
  end: number
) {
  if (!("plannedTrips" in detail)) return replayEventTimes(detail, start, end)
  return [
    ...new Set(
      [
        start,
        end,
        ...detail.plannedTrips.flatMap((t) => [t.departure, t.arrival]),
      ].filter((at): at is number => at !== null && at >= start && at <= end)
    ),
  ].sort((a, b) => a - b)
}
