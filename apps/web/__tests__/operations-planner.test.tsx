import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { OperationsPlanner } from "@/components/operations-planner"
import type { PlanningReport } from "@/lib/planning-schema"

const report: PlanningReport = {
  runId: "cece77e8-8a5d-4dc0-8cde-35551de32bcb",
  title: "Recovery",
  decisionAt: "2026-10-05T09:25:00+08:00",
  message: "No qualified relief crew is available.",
  recommendations: [],
  assessments: [],
  physicalExclusions: [],
  rounds: [],
  search: {
    candidateCount: 0,
    resourcesConsidered: { buses: 2, crews: 2 },
    searchNodes: 0,
    searchLimited: true,
    scope: "Selected services",
  },
  policies: [],
  sources: [],
  affectedTrips: [],
}

beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }))
})
afterEach(() => vi.unstubAllGlobals())

it("shows the no-plan reason and bounded shortlist without experiment panels", async () => {
  vi.stubGlobal(
    "fetch",
    async () => new Response(JSON.stringify({ type: "result", report }) + "\n")
  )
  const user = userEvent.setup()
  render(<OperationsPlanner enabled />)
  await user.click(screen.getByRole("button", { name: "Compare plans" }))
  expect(
    await screen.findByText("No qualified relief crew is available.")
  ).toBeInTheDocument()
  expect(
    screen.getByText(
      "This is a shortlist of evaluated options. Other workable plans may exist."
    )
  ).toBeInTheDocument()
  expect(
    screen.queryByRole("tab", { name: "Comparison rounds" })
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole("link", { name: "Download run evidence" })
  ).not.toBeInTheDocument()
})
