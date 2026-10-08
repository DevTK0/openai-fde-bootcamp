import { RepairAdmission } from "@/lib/repairs/admission"
import { repairRequestSchema } from "@/lib/repairs/schema"
import { analyzeRepair, RepairError } from "@/lib/repairs/analyze"
import { DatabaseBusyError } from "@/lib/database"

export const runtime = "nodejs"
const admission = new RepairAdmission()
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
  const reader = request.body?.getReader()
  if (!reader)
    return Response.json({ error: "Provide a fault report." }, { status: 400 })
  const chunks: Uint8Array[] = []
  let size = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > 32_768) {
      await reader.cancel()
      return Response.json(
        { error: "The report request is too large." },
        { status: 413 }
      )
    }
    chunks.push(value)
  }
  let body: unknown
  try {
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"))
  } catch {
    body = null
  }
  const input = repairRequestSchema.safeParse(body)
  if (!input.success)
    return Response.json(
      {
        error:
          "Choose a vehicle and date, and describe the fault in 10 to 4,000 characters.",
      },
      { status: 400 }
    )
  const release = admission.acquire()
  if (!release)
    return Response.json(
      { error: "Repair analysis is busy. Please wait a minute and try again." },
      { status: 429, headers: { "Retry-After": "60" } }
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
  } finally {
    release()
  }
}
