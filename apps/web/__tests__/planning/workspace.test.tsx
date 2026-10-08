import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { PlannerWorkspace } from "@/components/planner/workspace"
import type { PlanningCandidate } from "@/lib/planning/contracts"

vi.mock("@/components/planner/live-arrivals", () => ({
  LiveArrivals: () => <div>Public arrivals remain separate</div>,
}))

const candidate: PlanningCandidate = {
  id: "relief",
  scenarioId: "service-235-recovery",
  mode: "prospective",
  label: "Listed relief driver",
  summary: "Use the available qualified relief driver.",
  status: "feasible",
  conflicts: [],
  warnings: [],
  minSlackSeconds: 300,
  metrics: {
    trips: 1,
    protectedTrips: 1,
    lateDeparturesOverFiveMinutes: null,
    positiveDepartureDelaySeconds: null,
    originBoardings: null,
    originWaitingPersonSeconds: null,
  },
  assignments: [
    {
      tripId: "TRIP-1",
      vehicleId: "NW-V001",
      crewId: "NW-C900",
      departureAt: "2026-10-07T06:00:00+08:00",
      arrivalAt: "2026-10-07T06:30:00+08:00",
      routeId: "B235_1",
      serviceNo: "235",
      protected: true,
    },
  ],
  assumptions: ["Published runtime is a planning allowance."],
  evidence: [],
}
const fixture = {
  scenario: {
    id: "service-235-recovery",
    title: "Service 235 recovery",
    service: "235",
    date: "2026-10-07",
    mode: "prospective",
    decisionAt: "2026-10-07T05:50:00+08:00",
    sourceCutoffAt: "2026-10-07T05:49:59+08:00",
    routeIds: ["B235_1"],
    description: "Exercise",
  },
  sourceHash: "a".repeat(64),
  admittedThrough: "2026-10-06T21:49:59Z",
  sourceCounts: { trips: 6900 },
  trips: [{ trip_id: "TRIP-1" }],
  relatedTrips: [],
  controlActions: [],
  resourceUpdates: [],
  crewDuties: [],
  vehicleReadiness: [],
  terminalMovements: [],
  planningConstraints: [],
  warnings: [],
}
function json(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}
beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  )
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe("planner workspace", () => {
  it("shows a recoverable scenario error without exposing provider details", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        url.includes("scenarios")
          ? json({ error: "Scenario data is unavailable." }, 503)
          : json({ proposals: [] })
      )
    )
    render(<PlannerWorkspace />)
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Scenario data is unavailable."
    )
    expect(screen.getByRole("button", { name: "Retry" })).toBeEnabled()
  })

  it("saves a compared plan against its exact source snapshot", async () => {
    const fetcher = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("scenarios"))
        return json({ scenarios: [], fixture, candidates: [candidate] })
      if (init?.method === "POST")
        return json({ proposal: { id: "saved" } }, 201)
      return json({ proposals: [] })
    })
    vi.stubGlobal("fetch", fetcher)
    render(<PlannerWorkspace />)
    fireEvent.click(
      await screen.findByRole("button", { name: "Save proposal" })
    )
    await screen.findByText("Proposal saved. Review it in Saved decisions.")
    const mutation = fetcher.mock.calls.find(
      ([, init]) => init?.method === "POST"
    )
    expect(mutation?.[0]).toBe("/api/planning/proposals")
    expect(JSON.parse(String(mutation?.[1]?.body))).toMatchObject({
      candidateId: "relief",
      sourceHash: fixture.sourceHash,
      mode: "prospective",
    })
  })

  it("reviews a saved proposal using its version and the review endpoint", async () => {
    const proposal = {
      id: "00000000-0000-4000-8000-000000000001",
      version: 1,
      status: "draft",
      candidateId: candidate.id,
      scenarioId: "service-235-recovery",
      date: "2026-10-07",
      mode: "prospective",
      candidate,
    }
    const fetcher = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("scenarios"))
        return json({ scenarios: [], fixture, candidates: [candidate] })
      if (init?.method === "POST")
        return json({
          proposal: { ...proposal, status: "approved", version: 2 },
        })
      return json({ proposals: [proposal] })
    })
    vi.stubGlobal("fetch", fetcher)
    render(<PlannerWorkspace />)
    await screen.findByRole("button", { name: "Save proposal" })
    fireEvent.click(screen.getByRole("tab", { name: /Saved decisions/ }))
    fireEvent.change(
      await screen.findByRole("textbox", { name: "Review note" }),
      { target: { value: "Reviewed constraints" } }
    )
    fireEvent.click(
      screen.getByRole("button", { name: "Approve exercise plan" })
    )
    await screen.findByText(
      "Exercise proposal approved. No operational instruction was sent."
    )
    const mutation = fetcher.mock.calls.find(
      ([, init]) => init?.method === "POST"
    )
    expect(mutation?.[0]).toBe("/api/planning/review")
    expect(JSON.parse(String(mutation?.[1]?.body))).toMatchObject({
      proposalId: proposal.id,
      expectedVersion: 1,
      decision: "approve",
      reason: "Reviewed constraints",
    })
  })

  it("reopens the exact saved candidate instead of the default recommendation", async () => {
    const other = { ...candidate, id: "other", label: "Saved later timetable" }
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        url.includes("scenarios")
          ? json({ scenarios: [], fixture, candidates: [candidate, other] })
          : json({
              proposals: [
                {
                  id: "saved",
                  candidateId: other.id,
                  scenarioId: "service-235-recovery",
                  date: "2026-10-07",
                  mode: "prospective",
                  version: 1,
                  status: "draft",
                  candidate: other,
                },
              ],
            })
      )
    )
    render(<PlannerWorkspace />)
    await screen.findByRole("button", { name: "Save proposal" })
    fireEvent.click(screen.getByRole("tab", { name: /Saved decisions/ }))
    fireEvent.click(
      await screen.findByRole("button", { name: "Open scenario" })
    )
    await waitFor(() =>
      expect(
        screen.getAllByRole("button", { name: "Selected plan" })
      ).toHaveLength(1)
    )
    await waitFor(() =>
      expect(
        screen
          .getByRole("button", { name: "Selected plan" })
          .closest("[data-slot=card]")
      ).toHaveTextContent("Saved later timetable")
    )
  })

  it("keeps infeasible saved proposals available for rejection but blocks approval", async () => {
    const invalid = {
      ...candidate,
      status: "infeasible",
      conflicts: [
        { code: "HELD_VEHICLE", message: "Vehicle is held.", evidence: [] },
      ],
    }
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        url.includes("scenarios")
          ? json({ scenarios: [], fixture, candidates: [candidate] })
          : json({
              proposals: [
                {
                  id: "invalid",
                  version: 1,
                  status: "draft",
                  candidateId: "relief",
                  scenarioId: "service-235-recovery",
                  date: "2026-10-07",
                  mode: "prospective",
                  candidate: invalid,
                },
              ],
            })
      )
    )
    render(<PlannerWorkspace />)
    await screen.findByRole("button", { name: "Save proposal" })
    fireEvent.click(screen.getByRole("tab", { name: /Saved decisions/ }))
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Approve exercise plan" })
      ).toBeDisabled()
    )
    expect(screen.getByRole("button", { name: "Reject" })).toBeEnabled()
  })
})
