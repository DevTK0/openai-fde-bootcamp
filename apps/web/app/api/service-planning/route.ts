import { DatabaseBusyError } from "@/lib/database"
import { getOperationsManifest } from "@/lib/operations-server"
import { planningSelectionSchema } from "@/lib/service-planning"
import { getPlanningReport } from "@/lib/service-planning-server"

export const runtime = "nodejs"
export async function GET(request: Request) {
  const parsed = planningSelectionSchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams)
  )
  if (!parsed.success)
    return Response.json(
      { error: "Choose a valid date, service, time window and thresholds." },
      { status: 400 }
    )
  try {
    request.signal.throwIfAborted()
    const manifest = getOperationsManifest()
    if (
      !manifest.dates.includes(parsed.data.date) ||
      !manifest.services.includes(parsed.data.service)
    ) {
      return Response.json(
        { error: "Unknown service or date." },
        { status: 400 }
      )
    }
    return Response.json(await getPlanningReport(parsed.data, request.signal))
  } catch (error) {
    if (request.signal.aborted) return new Response(null, { status: 499 })
    if (error instanceof DatabaseBusyError)
      return Response.json(
        { error: error.message },
        { status: 503, headers: { "Retry-After": "1" } }
      )
    throw error
  }
}
