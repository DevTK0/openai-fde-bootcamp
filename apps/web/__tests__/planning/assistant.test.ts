import { afterEach, describe, expect, it, vi } from "vitest"
import type { PlanningCandidate, PlanningFixture } from "@/lib/planning/contracts"

const candidate: PlanningCandidate = {
  id: "235-relief-c900", scenarioId: "service-235-recovery", mode: "prospective", label: "Relief driver",
  summary: "Use the listed relief driver for the selected trips.", status: "feasible", assignments: [], conflicts: [], warnings: [],
  minSlackSeconds: 18, metrics: { trips: 22, protectedTrips: 22, lateDeparturesOverFiveMinutes: null, positiveDepartureDelaySeconds: null, originBoardings: null, originWaitingPersonSeconds: null },
  assumptions: ["No passenger benefit is projected."], evidence: [{ table: "crew_duties", recordId: "NW-D00982" }],
}
const fixture = {
  scenario: { id: "service-235-recovery", title: "235 recovery", service: "235", date: "2026-10-07", mode: "prospective", decisionAt: "2026-10-07T05:50:00+08:00", sourceCutoffAt: "2026-10-07T05:49:59+08:00", routeIds: ["B235_1"], description: "Test" },
  sourceHash: "test-source-hash", admittedThrough: "2026-10-06T21:49:59.000Z", sourceCounts: {}, warnings: [],
  trips: [], relatedTrips: [], controlActions: [], resourceUpdates: [], crewDuties: [], vehicleReadiness: [], terminalMovements: [],
  servicePatterns: [], routeStops: [], routes: [], stops: [], stopCalls: [], originArrivals: [], planningConstraints: [], workshopVehicles: [], workshopWorkOrders: [],
} as unknown as PlanningFixture

vi.mock("@/lib/server/env", () => ({ getOpenAIConfig: () => ({ apiKey: "unit-test-key", model: "test-model" }) }))
vi.mock("@/lib/server/planning-data", () => ({
  getPlanningBundle: async () => ({ fixture, candidates: [candidate] }),
  getEvidenceRecordFromFixture: () => ({ constraint_id: "NW-PC01", requirement: "Retain listed trips." }),
}))

function response(output: unknown[]) {
  return new Response(JSON.stringify({ output }), { status: 200, headers: { "Content-Type": "application/json" } })
}

describe("OpenAI Responses assistant adapter", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it("keeps tool calls within the selected scenario and preserves stateless call history", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response([{ type: "function_call", call_id: "call-1", name: "get_scenario", arguments: JSON.stringify({ scenarioId: "service-235-recovery", date: "2026-10-07", mode: "prospective" }) }]))
      .mockResolvedValueOnce(response([{ type: "function_call", call_id: "call-2", name: "get_source_evidence", arguments: JSON.stringify({ scenarioId: "service-238-timetable", date: "2026-10-07", mode: "prospective", table: "planning_constraints", recordId: "NW-PC01" }) }]))
      .mockResolvedValueOnce(response([{ type: "message", content: [{ type: "output_text", text: "The selected relief candidate is feasible under the current exercise rules." }] }]))
    vi.stubGlobal("fetch", fetchMock)
    const { askPlanningAssistant } = await import("@/lib/server/assistant")
    const result = await askPlanningAssistant({ scenarioId: "service-235-recovery", date: "2026-10-07", mode: "prospective", question: "Can this plan work?", candidateId: candidate.id })
    expect(result.available).toBe(true)
    expect(result.answer).toContain("feasible")
    expect(result.evidence).toContainEqual({ table: "crew_duties", recordId: "NW-D00982" })
    expect(result.evidence).not.toContainEqual({ table: "planning_constraints", recordId: "NW-PC01" })
    const secondBody = JSON.parse(String(fetchMock.mock.calls[1]?.[1]?.body)) as { input: unknown[] }
    expect(secondBody.input).toHaveLength(3)
    expect(JSON.stringify(secondBody.input)).toContain("Can this plan work?")
    const thirdBody = JSON.parse(String(fetchMock.mock.calls[2]?.[1]?.body)) as { input: unknown[] }
    expect(thirdBody.input).toHaveLength(5)
    expect(JSON.stringify(thirdBody.input)).toContain("Tool arguments must match")
    expect(JSON.stringify(thirdBody.input)).toContain("NW-PC01")
  })
})
