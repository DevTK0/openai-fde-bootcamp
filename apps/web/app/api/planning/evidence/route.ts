import { z } from "zod"
import { getEvidenceRecord } from "@/lib/server/planning-data"
import { dateSchema, jsonError, planningModeSchema, scenarioIdSchema } from "@/lib/server/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const tableSchema = z.enum([
  "trips", "control_actions", "resource_updates", "crew_duties", "vehicle_readiness",
  "terminal_movements", "service_patterns", "planning_constraints", "workshop_vehicles",
  "workshop_work_orders", "route_stops", "routes", "stops", "stop_calls", "origin_arrivals",
])
const querySchema = z.object({
  scenario: scenarioIdSchema, date: dateSchema, mode: planningModeSchema,
  table: tableSchema, recordId: z.string().min(1).max(160),
})

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const parsed = querySchema.safeParse({
    scenario: params.get("scenario"), date: params.get("date"), mode: params.get("mode") ?? "prospective",
    table: params.get("table"), recordId: params.get("recordId"),
  })
  if (!parsed.success) return jsonError("Invalid evidence reference.", 400)
  try {
    const record = await getEvidenceRecord(parsed.data.scenario, parsed.data.date, parsed.data.mode, {
      table: parsed.data.table, recordId: parsed.data.recordId,
    })
    if (!record) return jsonError("Evidence record is unavailable in this scenario view.", 404)
    return Response.json({ reference: { table: parsed.data.table, recordId: parsed.data.recordId }, record }, {
      headers: { "Cache-Control": "no-store" },
    })
  } catch {
    return jsonError("Evidence could not be loaded.", 404)
  }
}
