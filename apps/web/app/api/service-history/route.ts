import { z } from "zod"
import { DatabaseBusyError } from "@/lib/database"
import { getOperationsManifest } from "@/lib/operations-server"
import { getServiceHistory } from "@/lib/service-planning-server"

export const runtime = "nodejs"
export async function GET(request: Request) {
  const date = z.iso
    .date()
    .safeParse(new URL(request.url).searchParams.get("date"))
  if (!date.success)
    return Response.json(
      { error: "Choose a valid service date." },
      { status: 400 }
    )
  try {
    request.signal.throwIfAborted()
    if (!getOperationsManifest().dates.includes(date.data))
      return Response.json({ error: "Unknown service date." }, { status: 400 })
    return Response.json(await getServiceHistory(date.data, request.signal))
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
