import { repairRequestSchema } from "@/lib/repairs/schema"
import { analyzeRepair, RepairError } from "@/lib/repairs/analyze"
import { DatabaseBusyError } from "@/lib/database"

export const runtime = "nodejs"
export async function POST(request: Request) {
  const origin = request.headers.get("origin")
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    new URL(request.url).host
  let sameOrigin = false
  try {
    sameOrigin = origin !== null && new URL(origin).host === host
  } catch {
    sameOrigin = false
  }
  if (!sameOrigin)
    return Response.json(
      { error: "Submit analysis from this app." },
      { status: 403 }
    )
  const input = repairRequestSchema.safeParse(
    await request.json().catch(() => null)
  )
  if (!input.success)
    return Response.json(
      {
        error:
          "Choose a vehicle and date, and describe the fault in 10 to 4,000 characters.",
      },
      { status: 400 }
    )
  try {
    return Response.json(await analyzeRepair(input.data, request.signal), {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error) {
    if (request.signal.aborted) return new Response(null, { status: 499 })
    if (error instanceof RepairError || error instanceof DatabaseBusyError)
      return Response.json(
        { error: error.message },
        { status: error instanceof RepairError ? error.status : 503 }
      )
    return Response.json(
      { error: "Could not read the maintenance evidence. Please try again." },
      { status: 500 }
    )
  }
}
