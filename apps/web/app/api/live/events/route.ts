import { eventSchema, reportSchema } from "@/lib/live/contracts"
import { insertLiveEvent, liveSnapshot } from "@/lib/live/store"
import { isSameOrigin, jsonError, readJson } from "@/lib/server/http"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export async function GET() {
  return Response.json(liveSnapshot(), {
    headers: { "Cache-Control": "no-store" },
  })
}
export async function POST(request: Request) {
  if (!isSameOrigin(request))
    return jsonError("Events must be recorded from this application.", 403)
  try {
    const parsed = reportSchema
      .or(eventSchema)
      .safeParse(await readJson(request))
    if (!parsed.success)
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid event.", 400)
    return Response.json(
      { event: insertLiveEvent(parsed.data) },
      { status: 201 }
    )
  } catch {
    return jsonError(
      "Could not record the event. Check the input and try again.",
      400
    )
  }
}
