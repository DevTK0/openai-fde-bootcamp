import { serviceSchema } from "@/lib/live/contracts"
import { z } from "zod"
import { requestAgentAssessment } from "@/lib/live/store"
import { isSameOrigin, jsonError, readJson } from "@/lib/server/http"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export async function POST(request: Request) {
  if (!isSameOrigin(request))
    return jsonError("Analysis must be requested from this application.", 403)
  try {
    const { service } = z
      .strictObject({ service: serviceSchema })
      .parse(await readJson(request))
    return Response.json(
      { event: requestAgentAssessment(service) },
      { status: 201 }
    )
  } catch {
    return jsonError(
      "Record an observation for this service before requesting an assessment.",
      400
    )
  }
}
