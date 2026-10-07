// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { LiveEvent, ObservationInterpretation } from "@/lib/live/contracts"
const state = vi.hoisted(() => ({
  proposals: new Map<string, unknown>(),
  noFuture: false,
}))
vi.mock("@/lib/server/env", () => ({
  getOpenAIConfig: () => ({ apiKey: "test-only-key", model: "test-agent" }),
}))
vi.mock("@/lib/live/store", () => ({
  agentAssessmentTime: (event: LiveEvent) => event.occurredAt,
}))
vi.mock("@/lib/live/context-db", () => ({
  ensureContextDatabase: vi.fn(async () => {}),
  withContextSnapshot: async (work: () => Promise<unknown>) => work(),
}))
vi.mock("@/lib/live/agent-tools", () => ({
  jsonSchema: () => ({ type: "object" }),
  agentToolDefinitions: [{ type: "function", name: "get_operating_history" }],
  AgentContext: class {
    interpretation?: ObservationInterpretation
    evidence = new Map([
      ["history:test", { id: "history:test", label: "Observed history" }],
      ["live_events:1", { id: "live_events:1", label: "Queue observation" }],
    ])
    proposals = state.proposals
    calls = new Set<string>()
    snapshots: unknown[] = []
    catalog() {
      return { tables: [{ table: "trips" }] }
    }
    async run(name: string, raw: string) {
      if (name === "interpret_observation")
        this.interpretation = JSON.parse(raw)
      this.calls.add(name)
      const data = { evidenceId: "history:test", observedDays: 3 }
      this.snapshots.push(
        state.noFuture && name === "get_service_schedule"
          ? { name, result: { totalUpcoming: 0 } }
          : data
      )
      return data
    }
  },
}))
import { assessWithAgent } from "@/lib/live/agent"
const event: LiveEvent = {
  id: "event1",
  seq: 1,
  kind: "crowding",
  service: "238",
  serviceDate: "2026-10-07",
  title: "Observed queue",
  details: "Exercise",
  stopCode: "52009",
  waitingPeople: 58,
  delaySeconds: null,
  vehicleId: null,
  occurredAt: "2026-10-07T07:20:00+08:00",
  receivedAt: "2026-10-07T06:00:00Z",
  source: "demo",
}
const final = {
  title: "Add targeted peak capacity",
  summary: "The agent finds a recurring origin queue.",
  priority: "attention",
  confidence: "medium",
  insights: [
    {
      title: "Recurring queue",
      finding: "Three observed days show remaining queues.",
      evidenceIds: ["history:test"],
    },
  ],
  recommendations: [
    {
      title: "Investigate one extra trip",
      action:
        "Confirm a released bus and qualified driver for an additional full-route trip.",
      rationale: "Observed demand repeatedly exceeds boarding opportunities.",
      expectedEffect:
        "An additional boarding opportunity; no numerical saving is forecast.",
      evidenceIds: ["history:test", "live_events:1"],
      proposalId: null,
    },
  ],
  caveats: ["Dated exercise resources."],
  noActionReason: null,
}
const toolRound = {
  status: "completed",
  output: [
    {
      type: "function_call",
      call_id: "schedule1",
      name: "get_service_schedule",
      arguments: '{"service":"238","horizonMinutes":120}',
    },
    { type: "reasoning", id: "reasoning1", encrypted_content: "opaque-only" },
    {
      type: "function_call",
      call_id: "call1",
      name: "get_operating_history",
      arguments: '{"service":"238","days":7,"stopCode":"52009"}',
    },
    {
      type: "function_call",
      call_id: "resource1",
      name: "find_resources",
      arguments:
        '{"service":"238","departureAt":"2026-10-07T07:30:00+08:00","arrivalAt":"2026-10-07T08:00:00+08:00","originStopId":"52009"}',
    },
    {
      type: "function_call",
      call_id: "call2",
      name: "read_recent_events",
      arguments: '{"service":null,"days":7}',
    },
  ],
  usage: { input_tokens: 100, output_tokens: 50 },
}
const answer = (value: unknown) => ({
  status: "completed",
  output: [
    {
      type: "message",
      content: [{ type: "output_text", text: JSON.stringify(value) }],
    },
  ],
  usage: { input_tokens: 200, output_tokens: 150 },
})
const response = (value: unknown) =>
  new Response(JSON.stringify(value), {
    headers: { "Content-Type": "application/json" },
  })
beforeEach(() => {
  state.proposals.clear()
  state.noFuture = false
})
afterEach(() => vi.unstubAllGlobals())
describe("OpenAI planner agent", () => {
  it("lets the model query context and generate recommendations, preserving tool outputs and opaque reasoning across turns", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(response(toolRound))
      .mockResolvedValueOnce(response(answer(final)))
    vi.stubGlobal("fetch", fetcher)
    const trace = vi.fn()
    const decision = await assessWithAgent(event, trace)
    expect(decision).toMatchObject({
      origin: "agent",
      title: final.title,
      agent: {
        insights: final.insights,
        recommendations: final.recommendations,
        usage: { inputTokens: 300, outputTokens: 200, requests: 2 },
      },
    })
    expect(decision.actionPlan).toBeUndefined()
    const first = JSON.parse(fetcher.mock.calls[0]![1].body)
    const next = JSON.parse(fetcher.mock.calls[1]![1].body)
    expect(first).toMatchObject({
      store: false,
      include: ["reasoning.encrypted_content"],
      text: { format: { type: "json_schema", strict: true } },
    })
    expect(next.input).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "reasoning",
          encrypted_content: "opaque-only",
        }),
        expect.objectContaining({
          type: "function_call_output",
          call_id: "call1",
        }),
      ])
    )
    expect(JSON.stringify(decision.trace)).not.toContain("opaque-only")
    expect(decision.trace.some((step) => step.phase === "tool")).toBe(true)
  })
  it("publishes a grounded coverage-gap assessment for raw text when the dated timetable has no future departures", async () => {
    state.noFuture = true
    const interpretation = {
      signalTypes: ["crowding"],
      service: "238",
      vehicleId: null,
      stopCode: "52009",
      delaySeconds: null,
      waitingPeople: 58,
      repairAreas: [],
      summary: "Reported morning queue.",
    }
    const tools = {
      ...toolRound,
      output: [
        ...toolRound.output.filter((item) => item.name !== "find_resources"),
        {
          type: "function_call",
          call_id: "interpret1",
          name: "interpret_observation",
          arguments: JSON.stringify(interpretation),
        },
      ],
    }
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(response(tools))
      .mockResolvedValueOnce(response(answer(final)))
    vi.stubGlobal("fetch", fetcher)
    const decision = await assessWithAgent(
      { ...event, kind: "observation", service: "network" },
      vi.fn()
    )
    expect(decision.service).toBe("238")
    expect(decision.agent?.interpretation).toEqual(interpretation)
    expect(fetcher).toHaveBeenCalledTimes(2)
  })
  it("publishes the model's checked resource assignment instead of a preset action plan", async () => {
    const allocation = {
      tripId: "EXTRA-model-authored",
      vehicleId: "NW-V002",
      crewId: "NW-C003",
      routeId: "B238_1",
      departureAt: "2026-10-07T08:00:00+08:00",
      arrivalAt: "2026-10-07T08:25:00+08:00",
    }
    state.proposals.set("proposal-1", {
      id: "proposal-1",
      status: "feasible",
      assignments: [allocation],
      conflicts: [],
      conditions: [],
      minSlackSeconds: 600,
    })
    const value = {
      ...final,
      recommendations: [
        { ...final.recommendations[0], proposalId: "proposal-1" },
      ],
    }
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(response(toolRound))
        .mockResolvedValueOnce(response(answer(value)))
    )
    const result = await assessWithAgent(event, () => {})
    expect(result.agent?.proposals).toEqual([
      {
        id: "proposal-1",
        status: "feasible",
        assignments: [allocation],
        conflicts: [],
      },
    ])
    expect(result.suggestedCandidateId).toBe("proposal-1")
    expect(result.actionPlan).toBeUndefined()
  })
  it("asks the agent to repair unsupported citations before publishing", async () => {
    const bad = {
      ...final,
      insights: [{ ...final.insights[0], evidenceIds: ["invented:source"] }],
    }
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(response(toolRound))
      .mockResolvedValueOnce(response(answer(bad)))
      .mockResolvedValueOnce(response(answer(final)))
    vi.stubGlobal("fetch", fetcher)
    const decision = await assessWithAgent(event, () => {})
    expect(
      decision.agent?.evidence.every((row) => row.id !== "invented:source")
    ).toBe(true)
    expect(
      decision.trace.some(
        (step) => step.title === "Check evidence and proposal references"
      )
    ).toBe(true)
  })
  it("does not publish a blocked model allocation", async () => {
    state.proposals.set("proposal-1", {
      id: "proposal-1",
      status: "blocked",
      assignments: [],
      conflicts: ["Vehicle held"],
      conditions: [],
    })
    const bad = {
      ...final,
      recommendations: [
        { ...final.recommendations[0], proposalId: "proposal-1" },
      ],
    }
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(response(toolRound))
        .mockImplementation(async () => response(answer(bad)))
    )
    await expect(assessWithAgent(event, () => {})).rejects.toThrow(
      /without a grounded assessment/
    )
  })
  it("fails visibly on provider failure without a coded recommendation fallback", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("unavailable", { status: 503 }))
    )
    await expect(assessWithAgent(event, () => {})).rejects.toThrow(
      /HTTP 503.*no rule-based fallback/
    )
  })
})
