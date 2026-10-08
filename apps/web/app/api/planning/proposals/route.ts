import { z } from "zod"
import { buildCandidates } from "@/lib/planning/engine"
import { loadScenario } from "@/lib/planning/fixture"
import { dateSchema, isSameOrigin, jsonError, planningModeSchema, readJson, scenarioIdSchema } from "@/lib/server/http"
import type { ProposalSaveRequest } from "@/lib/server/contracts"
import { getIdempotentSaveResult, listProposals, saveProposal, StoreConflictError } from "@/lib/server/store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const saveSchema = z.strictObject({
  scenarioId: scenarioIdSchema,
  date: dateSchema,
  mode: planningModeSchema,
  candidateId: z.string().min(1).max(120),
  sourceHash: z.string().min(16).max(128),
  idempotencyKey: z.string().min(8).max(100),
})

export async function GET() {
  return Response.json({ proposals: listProposals() }, { headers: { "Cache-Control": "no-store" } })
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError("Mutation requests must come from this application.", 403)
  let input: ProposalSaveRequest
  try {
    const parsed = saveSchema.safeParse(await readJson(request))
    if (!parsed.success) return jsonError("Invalid proposal request.", 400)
    input = parsed.data
  } catch (error) {
    return jsonError(error instanceof Error && error.message === "BODY_TOO_LARGE" ? "Request body is too large." : "Invalid JSON request.", 400)
  }
  try {
    const prior = getIdempotentSaveResult(input)
    if (prior) return Response.json({ proposal: prior }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    if (error instanceof StoreConflictError) return jsonError(error.message, 409)
    return jsonError("The proposal could not be saved.", 503)
  }
  try {
    const fixture = await loadScenario(input.scenarioId, input.date, input.mode)
    if (fixture.sourceHash !== input.sourceHash) return jsonError("Scenario source changed. Reload and compare the candidate again.", 409)
    const candidate = buildCandidates(fixture).find((item) => item.id === input.candidateId)
    if (!candidate) return jsonError("Candidate is no longer available for this scenario.", 409)
    return Response.json({ proposal: saveProposal(input, candidate) }, { status: 201, headers: { "Cache-Control": "no-store" } })
  } catch {
    return jsonError("The proposal could not be saved.", 503)
  }
}
