import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, expect, it, vi } from "vitest"
import { RepairInvestigation } from "@/components/repairs/repair-investigation"
import type { RepairResult } from "@/lib/repairs/schema"
vi.mock("@/components/repairs/repair-model", () => ({
  RepairModel: () => <div>3D schematic</div>,
}))
const report = "Centre door intermittently fails to close"
const result: RepairResult = {
  request: { vehicle: "NW-W001", date: "2026-10-07", report },
  generatedAt: "2026-10-08T00:00:00Z",
  model: "test-provider",
  analysis: {
    summary: "Door symptom needs investigation",
    hypotheses: [
      {
        cause: "Possible actuator fault",
        rationale: "Reported symptom alone cannot confirm this",
        evidenceIds: ["report"],
      },
    ],
    checks: [
      {
        action: "Engineering inspection",
        reason: "Confirm mechanism condition",
      },
    ],
    questions: ["Does the warning persist?"],
    areas: [
      {
        id: "centre_door",
        reason: "Centre door reported",
        evidenceIds: ["report"],
      },
    ],
  },
  evidence: [
    {
      id: "report",
      kind: "report",
      title: "Operator report, unverified",
      detail: report,
    },
  ],
  trips: [
    {
      id: "trip-1",
      service: "238",
      departure: 1791331200,
      arrival: 1791334800,
      holdIds: [],
    },
  ],
}
afterEach(() => vi.unstubAllGlobals())
async function open() {
  await userEvent.click(
    screen.getByRole("button", { name: "Analyze a reported fault" })
  )
  await userEvent.type(
    screen.getByRole("textbox", { name: "Your fault report" }),
    report
  )
}
it("runs only on submission, shows provenance and checks, and opens the selected trip", async () => {
  const fetcher = vi.fn(async () => Response.json(result))
  vi.stubGlobal("fetch", fetcher)
  const select = vi.fn()
  render(
    <RepairInvestigation
      vehicle="NW-W001"
      date="2026-10-07"
      onSelectTrip={select}
    />
  )
  await open()
  expect(fetcher).not.toHaveBeenCalled()
  await userEvent.click(screen.getByRole("button", { name: "Analyze fault" }))
  expect(
    await screen.findByText("Possible actuator fault", { exact: false })
  ).toBeVisible()
  expect(screen.getByText("Engineering inspection")).toBeVisible()
  expect(screen.getByText("Operator report · unverified")).toBeVisible()
  await userEvent.click(
    within(screen.getByRole("region", { name: "Possible causes" })).getByRole(
      "link",
      { name: "Operator report" }
    )
  )
  expect(
    screen.getByRole("heading", { name: "Operator report, unverified" })
      .parentElement
  ).toHaveFocus()
  await userEvent.click(screen.getByRole("button", { name: /Service 238/ }))
  expect(select).toHaveBeenCalledWith("trip-1")
})
it("preserves the report on failure and retries manually", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json({ error: "Provider unavailable" }, { status: 502 })
    )
    .mockResolvedValueOnce(Response.json(result))
  vi.stubGlobal("fetch", fetcher)
  render(
    <RepairInvestigation
      vehicle="NW-W001"
      date="2026-10-07"
      onSelectTrip={() => {}}
    />
  )
  await open()
  await userEvent.click(screen.getByRole("button", { name: "Analyze fault" }))
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Provider unavailable"
  )
  expect(screen.getByRole("textbox")).toHaveValue(report)
  await userEvent.click(screen.getByRole("button", { name: "Analyze fault" }))
  expect(
    await screen.findByText("Door symptom needs investigation")
  ).toBeVisible()
  await userEvent.type(screen.getByRole("textbox"), " again")
  expect(
    screen.queryByText("Door symptom needs investigation")
  ).not.toBeInTheDocument()
})
it("cancels in-flight analysis and ignores a late result", async () => {
  let resolve: (response: Response) => void = () => {
    throw new Error("Request not started")
  }
  vi.stubGlobal(
    "fetch",
    vi.fn(
      () =>
        new Promise<Response>((r) => {
          resolve = r
        })
    )
  )
  render(
    <RepairInvestigation
      vehicle="NW-W001"
      date="2026-10-07"
      onSelectTrip={() => {}}
    />
  )
  await open()
  await userEvent.click(screen.getByRole("button", { name: "Analyze fault" }))
  await userEvent.click(screen.getByRole("button", { name: "Cancel analysis" }))
  resolve(Response.json(result))
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Analyze fault" })).toBeEnabled()
  )
  expect(
    screen.queryByText("Door symptom needs investigation")
  ).not.toBeInTheDocument()
})
it("resets analysis and report when the vehicle or date changes", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => Response.json(result))
  )
  const { rerender } = render(
    <RepairInvestigation
      vehicle="NW-W001"
      date="2026-10-07"
      onSelectTrip={() => {}}
    />
  )
  await open()
  await userEvent.click(screen.getByRole("button", { name: "Analyze fault" }))
  expect(
    await screen.findByText("Door symptom needs investigation")
  ).toBeVisible()
  rerender(
    <RepairInvestigation
      vehicle="NW-V020"
      date="2026-10-08"
      onSelectTrip={() => {}}
    />
  )
  expect(screen.getByRole("textbox")).toHaveValue("")
  expect(
    screen.queryByText("Door symptom needs investigation")
  ).not.toBeInTheDocument()
})
