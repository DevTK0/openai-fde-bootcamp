import { z } from "zod"
import type { PlanningCall } from "@/lib/service-planning"

export const passengerRecordsSchema = z.array(
  z.object({
    id: z.string(),
    boarded: z.number().int().nonnegative().nullable(),
    alighted: z.number().int().nonnegative().nullable(),
    left: z.number().int().nonnegative().nullable(),
  })
)
export type PassengerRecord = z.infer<typeof passengerRecordsSchema>[number]
export type Exchange = PassengerRecord & { age: number }
export function exchangesAt(
  calls: readonly Pick<
    PlanningCall,
    "id" | "route" | "order" | "departure" | "observed"
  >[],
  records: readonly PassengerRecord[],
  at: number
) {
  const counts = new Map(records.map((r) => [r.id, r]))
  const latest = new Map<string, { departure: number; exchange: Exchange }>()
  for (const call of calls) {
    if (
      call.departure === null ||
      call.observed === null ||
      call.observed > call.departure ||
      at < call.departure ||
      at - call.departure >= 180
    )
      continue
    const record = counts.get(call.id)
    if (!record) continue
    const key = `${call.route}/${call.order}`
    if ((latest.get(key)?.departure ?? -Infinity) > call.departure) continue
    latest.set(key, {
      departure: call.departure,
      exchange: { ...record, age: at - call.departure },
    })
  }
  return new Map([...latest].map(([key, event]) => [key, event.exchange]))
}
