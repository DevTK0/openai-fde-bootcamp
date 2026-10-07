// @vitest-environment node
import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it, vi } from "vitest"
import type { PlanningCandidate } from "@/lib/planning/contracts"

function candidate(status: PlanningCandidate["status"]): PlanningCandidate {
  return {
    id: `candidate-${status}`,
    scenarioId: "service-235-recovery",
    mode: "prospective",
    label: "Test candidate",
    summary: "A test plan",
    status,
    assignments: [],
    conflicts: status === "infeasible" ? [{ code: "held", message: "Held resource", evidence: [] }] : [],
    warnings: [],
    minSlackSeconds: 120,
    metrics: { trips: 1, protectedTrips: 1, lateDeparturesOverFiveMinutes: null, positiveDepartureDelaySeconds: null, originBoardings: null, originWaitingPersonSeconds: null },
    assumptions: [],
    evidence: [],
  }
}

describe("planning proposal store", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it("persists versions, enforces idempotency fingerprints, and blocks stale or infeasible approval", async () => {
    const directory = mkdtempSync(join(tmpdir(), "lionlink-plan-store-"))
    vi.stubEnv("PLANNING_DB_PATH", join(directory, "plans.sqlite"))
    vi.resetModules()
    const store = await import("@/lib/server/store")
    const save = {
      scenarioId: "service-235-recovery" as const,
      date: "2026-10-07",
      mode: "prospective" as const,
      candidateId: "candidate-feasible",
      sourceHash: "source-hash-1234567890",
      idempotencyKey: "save-key-0001",
    }
    const draft = store.saveProposal(save, candidate("feasible"))
    expect(draft).toMatchObject({ status: "draft", version: 1, sourceHash: save.sourceHash })
    expect(store.saveProposal(save, candidate("feasible")).id).toBe(draft.id)
    expect(() => store.saveProposal({ ...save, candidateId: "another" }, candidate("feasible"))).toThrow(store.StoreConflictError)

    const approved = store.reviewProposal({
      proposalId: draft.id, expectedVersion: 1, decision: "approve", reason: "Reviewed for exercise.", idempotencyKey: "review-key-0001",
    }, candidate("feasible"))
    expect(approved).toMatchObject({ status: "approved", version: 2 })
    expect(() => store.reviewProposal({
      proposalId: draft.id, expectedVersion: 1, decision: "reject", idempotencyKey: "review-key-0002",
    }, null)).toThrow(store.StoreConflictError)

    const conditionalSave = { ...save, candidateId: "candidate-conditional", idempotencyKey: "save-key-0002" }
    const conditional = store.saveProposal(conditionalSave, candidate("conditional"))
    expect(() => store.reviewProposal({
      proposalId: conditional.id, expectedVersion: 1, decision: "approve", idempotencyKey: "review-key-0003",
    }, candidate("conditional"))).toThrow(store.StoreFeasibilityError)
    expect(store.reviewProposal({
      proposalId: conditional.id, expectedVersion: 1, decision: "reject", reason: "Needs confirmation.", idempotencyKey: "review-key-0004",
    }, null).status).toBe("rejected")
    expect(store.listProposals()).toHaveLength(2)
    rmSync(directory, { recursive: true, force: true })
  })
})
