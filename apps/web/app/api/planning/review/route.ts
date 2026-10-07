import { z } from "zod"
import { buildCandidates } from "@/lib/planning/engine"
import { loadScenario } from "@/lib/planning/fixture"
import { isSameOrigin, jsonError, readJson } from "@/lib/server/http"
import type { ProposalReviewRequest } from "@/lib/server/contracts"
import { getIdempotentReviewResult, getProposal, reviewProposal, StoreConflictError, StoreFeasibilityError, StoreNotFoundError } from "@/lib/server/store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const reviewSchema = z.strictObject({
  proposalId: z.string().uuid(),
  expectedVersion: z.number().int().positive(),
  decision: z.enum(["approve", "reject"]),
  reason: z.string().max(1000).optional(),
  idempotencyKey: z.string().min(8).max(100),
})

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError("Mutation requests must come from this application.", 403)
  let input: ProposalReviewRequest
  try {
    const parsed = reviewSchema.safeParse(await readJson(request))
    if (!parsed.success) return jsonError("Invalid proposal review request.", 400)
    input = parsed.data
  } catch (error) {
    return jsonError(error instanceof Error && error.message === "BODY_TOO_LARGE" ? "Request body is too large." : "Invalid JSON request.", 400)
  }
  try {
    const prior = getIdempotentReviewResult(input)
    if (prior) return Response.json({ proposal: prior }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    if (error instanceof StoreConflictError) return jsonError(error.message, 409)
    return jsonError("The proposal review could not be recorded.", 503)
  }
  const proposal = getProposal(input.proposalId)
  if (!proposal) return jsonError("Proposal not found.", 404)
  let candidate = null
  if (input.decision === "approve") {
    try {
      const fixture = await loadScenario(proposal.scenarioId, proposal.date, proposal.mode)
      if (fixture.sourceHash !== proposal.sourceHash) return jsonError("Source snapshot changed. Save a new proposal before approval.", 409)
      candidate = buildCandidates(fixture).find((item) => item.id === proposal.candidateId) ?? null
    } catch {
      return jsonError("Current scenario validation is unavailable; approval was not recorded.", 503)
    }
  }
  try {
    return Response.json({ proposal: reviewProposal(input, candidate) }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    if (error instanceof StoreNotFoundError) return jsonError(error.message, 404)
    if (error instanceof StoreConflictError) return jsonError(error.message, 409)
    if (error instanceof StoreFeasibilityError) return jsonError(error.message, 422)
    return jsonError("The proposal review could not be recorded.", 503)
  }
}
