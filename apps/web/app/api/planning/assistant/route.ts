import { z } from "zod"
import { askPlanningAssistant } from "@/lib/server/assistant"
import { dateSchema, isSameOrigin, jsonError, planningModeSchema, readJson, scenarioIdSchema } from "@/lib/server/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const assistantSchema = z.strictObject({
  scenarioId: scenarioIdSchema,
  date: dateSchema,
  mode: planningModeSchema,
  question: z.string().trim().min(1).max(2000),
  candidateId: z.string().max(120).optional(),
})

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError("Requests must come from this application.", 403)
  let input: z.infer<typeof assistantSchema>
  try {
    const parsed = assistantSchema.safeParse(await readJson(request, 8_192))
    if (!parsed.success) return jsonError("Ask a question about a valid planning scenario.", 400)
    input = parsed.data
  } catch (error) {
    return jsonError(error instanceof Error && error.message === "BODY_TOO_LARGE" ? "Request body is too large." : "Invalid JSON request.", 400)
  }
  const result = await askPlanningAssistant(input)
  return Response.json(result, { headers: { "Cache-Control": "no-store" } })
}
