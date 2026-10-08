import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { LiveConsole } from "@/components/live/console"
import type { Decision, LiveSnapshot } from "@/lib/live/contracts"
vi.mock("@/components/live/bus-model", () => ({
  BusModel: ({
    partIds,
    vehicleId,
  }: {
    partIds: string[]
    vehicleId: string
  }) => (
    <div
      data-testid="bus-model"
      data-part={partIds.join(",")}
      data-vehicle={vehicleId}
    >
      Interactive bus model
    </div>
  ),
}))
let stream: MockStream | undefined
class MockStream {
  static OPEN = 1
  readyState = 1
  listeners = new Map<string, (event: MessageEvent) => void>()
  close = vi.fn()
  constructor() {
    stream = this
  }
  addEventListener(name: string, callback: (event: MessageEvent) => void) {
    this.listeners.set(name, callback)
  }
  emit(snapshot: LiveSnapshot) {
    this.listeners.get("snapshot")?.(
      new MessageEvent("snapshot", { data: JSON.stringify(snapshot) })
    )
  }
}
const empty: LiveSnapshot = {
  revision: 0,
  events: [],
  decisions: [],
  runs: [],
  pending: 0,
  invalid: 0,
  monitor: {
    online: true,
    paused: false,
    llmEnabled: false,
    heartbeatAt: "2026-10-07T06:00:00Z",
    lastError: null,
    lastModelAt: null,
  },
  serverTime: "2026-10-07T06:00:00Z",
}
const decision: Decision = {
  id: "00000000-0000-4000-8000-000000000001",
  eventSeq: 1,
  service: "235",
  serviceDate: "2026-10-07",
  createdAt: "2026-10-07T06:00:00Z",
  title: "Protect service 235",
  summary: "Reported fault",
  priority: "urgent",
  status: "open",
  action: "Request Engineering inspection",
  actionPlan: {
    headline: "Hold the bus and secure cover",
    rationale: "No listed cover is feasible.",
    candidateId: null,
    changes: [],
    steps: [
      {
        owner: "Duty controller",
        when: "Before the next departure",
        task: "Obtain a confirmed replacement bus and qualified driver.",
      },
    ],
    prerequisites: ["Verify replacement release and location."],
    fallback: "Communicate the affected departure to passengers.",
    expectedEffect: "Protect following departures.",
    asOf: "2026-10-07T05:49:00+08:00",
  },
  evidenceSeqs: [1],
  reasons: ["Active fault report"],
  alternatives: [],
  trace: [
    {
      phase: "evaluate",
      title: "Vehicle hold checked",
      summary: "Faulted vehicle cannot be assigned",
      at: "2026-10-07T06:00:00Z",
      outcome: "blocked",
      output: { vehicle: "NW-V001", usable: false },
    },
  ],
  sourceHash: null,
  suggestedCandidateId: null,
  model: { status: "disabled", name: null, summary: null },
  reviewedAt: null,
  reviewNote: null,
  version: 1,
}
const update: LiveSnapshot = {
  ...empty,
  revision: 1,
  events: [
    {
      seq: 1,
      id: "e1",
      kind: "fault",
      service: "235",
      serviceDate: "2026-10-07",
      title: "Brake fault report",
      details: "Reported warning",
      vehicleId: "NW-V001",
      stopCode: "52009",
      delaySeconds: null,
      waitingPeople: null,
      occurredAt: "2026-10-07T05:49:00+08:00",
      source: "operator",
      receivedAt: "2026-10-07T06:00:00Z",
    },
  ],
  decisions: [decision],
}
let fetcher: ReturnType<typeof vi.fn>
beforeEach(() => {
  vi.stubGlobal("EventSource", MockStream)
  fetcher = vi.fn(
    async (url: string) =>
      new Response(
        JSON.stringify(
          url.startsWith("/api/live/context")
            ? { asOf: empty.serverTime, repairs: [], vehicles: [] }
            : empty
        ),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
  )
  vi.stubGlobal("fetch", fetcher)
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
describe("live operations console", () => {
  it("records free text without asking the user to choose a signal type", async () => {
    render(<LiveConsole />)
    await screen.findByText("Incoming signals")
    act(() =>
      stream!.emit({ ...empty, services: ["22", "235", "238", "410G"] })
    )
    fireEvent.click(screen.getByRole("button", { name: "Record event" }))
    expect(
      await screen.findByRole("heading", {
        name: "Tell the agent what happened",
      })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("combobox", { name: "Signal type" })
    ).not.toBeInTheDocument()
    fireEvent.change(screen.getByLabelText("Observation"), {
      target: {
        value:
          "Service 410G has repeated late arrivals. Check the last few days.",
      },
    })
    fireEvent.click(
      screen.getAllByRole("button", { name: "Record event" }).at(-1)!
    )
    await waitFor(() =>
      expect(
        fetcher.mock.calls.some(
          (call: unknown[]) =>
            call[0] === "/api/live/events" &&
            (call[1] as RequestInit)?.method === "POST"
        )
      ).toBe(true)
    )
    const mutation = fetcher.mock.calls.find(
      (call: unknown[]) =>
        call[0] === "/api/live/events" &&
        (call[1] as RequestInit)?.method === "POST"
    )
    const body = JSON.parse(String((mutation?.[1] as RequestInit)?.body))
    expect(body.details).toContain("410G")
    expect(body.service).toBe("network")
    expect(body).not.toHaveProperty("kind")
  })
  it("shows model-generated insights and allocations while following active database queries", async () => {
    render(<LiveConsole />)
    await screen.findByText("Ready for the first signal.")
    const ai: Decision = {
      ...decision,
      origin: "agent",
      actionPlan: undefined,
      title: "Agent recommends targeted capacity",
      summary: "Recurring queues merit a targeted response.",
      model: {
        status: "completed",
        name: "test-agent",
        summary: "Recurring queues merit a targeted response.",
      },
      agent: {
        confidence: "medium",
        insights: [
          {
            title: "Three-day queue pattern",
            finding: "Origin queues recur across three observed days.",
            evidenceIds: ["history:238"],
          },
        ],
        recommendations: [
          {
            title: "Add a checked full-route trip",
            action: "Allocate NW-V002 and NW-C003 to the extra trip.",
            rationale: "The proposal passes the available resource checks.",
            expectedEffect: "An additional boarding opportunity.",
            evidenceIds: ["history:238"],
            proposalId: "proposal-1",
          },
        ],
        evidence: [{ id: "history:238", label: "Observed historical queues" }],
        proposals: [
          {
            id: "proposal-1",
            status: "feasible",
            assignments: [
              {
                tripId: "EXTRA-test",
                vehicleId: "NW-V002",
                crewId: "NW-C003",
                routeId: "B238_1",
                departureAt: "2026-10-07T08:00:00+08:00",
                arrivalAt: "2026-10-07T08:25:00+08:00",
              },
            ],
            conflicts: [],
          },
        ],
        caveats: ["Fictional dated resources."],
        usage: { inputTokens: 100, outputTokens: 200, requests: 2 },
      },
    }
    act(() =>
      stream!.emit({
        ...update,
        decisions: [ai],
        monitor: { ...empty.monitor, llmEnabled: true },
      })
    )
    expect(
      await screen.findByRole("heading", { name: "What the agent found" })
    ).toBeInTheDocument()
    expect(
      screen.getByText("Origin queues recur across three observed days.")
    ).toBeInTheDocument()
    expect(screen.getByText("NW-V002 · Driver NW-C003")).toBeInTheDocument()
    expect(
      screen.queryByRole("heading", { name: "What the planner should do" })
    ).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: /Show decision trace/ }))
    act(() =>
      stream!.emit({
        ...update,
        decisions: [ai],
        runs: [
          {
            id: "run2",
            eventSeq: 2,
            status: "processing",
            startedAt: new Date().toISOString(),
            finishedAt: null,
            error: null,
            trace: [
              {
                phase: "tool",
                title: "Read latest driver duties",
                summary: "Agent-selected database query.",
                outcome: "info",
                at: new Date().toISOString(),
              },
            ],
          },
        ],
      })
    )
    expect(
      await screen.findByRole("heading", { name: "Read latest driver duties" })
    ).toBeInTheDocument()
  })

  it("shows a streamed recommendation and expands its recorded tool result without reloading", async () => {
    render(<LiveConsole />)
    await screen.findByText("Ready for the first signal.")
    act(() => stream!.emit(update))
    expect(
      await screen.findByRole("heading", { name: "Protect service 235" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "What the planner should do" })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        "Obtain a confirmed replacement bus and qualified driver."
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText("Communicate the affected departure to passengers.")
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("heading", { name: "Vehicle hold checked" })
    ).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Decision trace" }))
    fireEvent.click(screen.getByRole("button", { name: "Inputs and results" }))
    expect(await screen.findByText(/"usable": false/)).toBeInTheDocument()
    expect(
      fetcher.mock.calls.filter((call) => call[0] === "/api/live/events")
    ).toHaveLength(1)
  })
  it("uses the closed trace's space for the agent-inferred vehicle and repair part", async () => {
    render(<LiveConsole />)
    await screen.findByText("Ready for the first signal.")
    const ai: Decision = {
      ...decision,
      origin: "agent",
      actionPlan: undefined,
      agent: {
        interpretation: {
          signalTypes: ["fault"],
          service: "238",
          vehicleId: "NW-W002",
          repairAreas: ["cooling", "electrical"],
          stopCode: null,
          delaySeconds: null,
          waitingPeople: null,
          summary: "Cooling-system leak reported.",
        },
        confidence: "medium",
        insights: [],
        recommendations: [],
        evidence: [],
        proposals: [],
        caveats: [],
        usage: { inputTokens: 0, outputTokens: 0, requests: 1 },
      },
    }
    act(() => stream!.emit({ ...update, decisions: [ai] }))
    expect(
      await screen.findByRole("heading", { name: "3D repair view" })
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.getByTestId("bus-model")).toHaveAttribute(
        "data-vehicle",
        "NW-W002"
      )
    )
    expect(screen.getByTestId("bus-model")).toHaveAttribute(
      "data-part",
      "cooling,electrical"
    )
    expect(
      screen.queryByRole("combobox", { name: "Inline repair area" })
    ).not.toBeInTheDocument()
    expect(
      screen.getByText("Areas identified by the agent")
    ).toBeInTheDocument()
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(
      screen.queryByRole("heading", { name: "Vehicle hold checked" })
    ).not.toBeInTheDocument()
    // Switching to an assessment without a mechanical finding clears every highlight.
    act(() =>
      stream!.emit({
        ...update,
        decisions: [
          {
            ...ai,
            agent: {
              ...ai.agent!,
              interpretation: {
                ...ai.agent!.interpretation!,
                repairAreas: [],
                repairArea: "cooling",
              },
            },
          },
        ],
      })
    )
    await waitFor(() =>
      expect(screen.getByTestId("bus-model")).toHaveAttribute("data-part", "")
    )
    expect(
      screen.getByText(/No repair area identified for this assessment/)
    ).toBeInTheDocument()
    // Existing saved single-area assessments remain supported.
    act(() =>
      stream!.emit({
        ...update,
        decisions: [
          {
            ...ai,
            agent: {
              ...ai.agent!,
              interpretation: {
                ...ai.agent!.interpretation!,
                repairAreas: undefined,
                repairArea: "brakes",
              },
            },
          },
        ],
      })
    )
    await waitFor(() =>
      expect(screen.getByTestId("bus-model")).toHaveAttribute(
        "data-part",
        "brakes"
      )
    )
    fireEvent.click(screen.getByRole("button", { name: /Show decision trace/ }))
    expect(await screen.findByRole("dialog")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Vehicle hold checked" })
    ).toBeInTheDocument()
  })
  it("records a versioned review and keeps an edited review tied to the selected assessment", async () => {
    render(<LiveConsole />)
    await screen.findByText("Ready for the first signal.")
    act(() => stream!.emit(update))
    fireEvent.change(
      await screen.findByRole("textbox", { name: "Review note" }),
      { target: { value: "Engineering inspection requested" } }
    )
    fireEvent.click(screen.getByRole("button", { name: "Acknowledge" }))
    await screen.findByText(
      "Recommendation acknowledged. No bus was dispatched."
    )
    const mutation = fetcher.mock.calls.find(
      (call: unknown[]) => call[0] === "/api/live/review"
    )
    expect(
      JSON.parse(String((mutation?.[1] as RequestInit)?.body))
    ).toMatchObject({
      id: decision.id,
      version: 1,
      status: "acknowledged",
      note: "Engineering inspection requested",
    })
    act(() =>
      stream!.emit({
        ...update,
        revision: 2,
        decisions: [{ ...decision, status: "superseded", version: 2 }],
      })
    )
    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: "Acknowledge" })
      ).not.toBeInTheDocument()
    )
  })
})
