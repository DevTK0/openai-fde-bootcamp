import { z } from "zod"
import { LiveReviewConflict, reviewLiveDecision } from "@/lib/live/store"
import { isSameOrigin, jsonError, readJson } from "@/lib/server/http"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
const schema = z.strictObject({
  id: z.string().uuid(),
  version: z.number().int().positive(),
  status: z.enum(["acknowledged", "dismissed"]),
  note: z.string().trim().min(3).max(1000),
})
export async function POST(request: Request) {
  if (!isSameOrigin(request))
    return jsonError("Reviews must come from this application.", 403)
  try {
    const input = schema.parse(await readJson(request))
    reviewLiveDecision(input.id, input.version, input.status, input.note)
    return Response.json({ ok: true })
  } catch (error) {
    return jsonError(
      error instanceof LiveReviewConflict
        ? error.message
        : "Enter a review note and retry.",
      error instanceof LiveReviewConflict ? 409 : 400
    )
  }
}
