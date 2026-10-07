import { beforeAll, afterAll, describe, expect, it, vi } from "vitest"
import {
  render,
  screen,
  within,
  waitFor,
  fireEvent,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DashboardProvider } from "@/components/dashboard-provider"
import { FleetDashboard } from "@/components/fleet-dashboard"
import { readDashboardData } from "@/lib/dashboard-server"
import { GET } from "@/app/api/operations/route"
import { GET as planningGET } from "@/app/api/service-planning/route"

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }))

beforeAll(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
    new DOMRect(0, 0, 1024, 400)
  )
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  )
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }))
  vi.stubGlobal("fetch", (input: string) =>
    (input.startsWith("/api/service-planning") ? planningGET : GET)(
      new Request(new URL(input, "http://localhost"))
    )
  )
})
afterAll(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("SQLite dashboard interactions", () => {
  it("renders each dashboard and its report tabs with database data", async () => {
    const user = userEvent.setup()
    render(
      <DashboardProvider data={readDashboardData()}>
        <FleetDashboard />
      </DashboardProvider>
    )
    expect(
      screen.getByRole("heading", { name: "Fleet overview" })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Relationships" })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Data explorer" })
    ).not.toBeInTheDocument()
    expect(
      screen.getAllByRole("button", { name: "Upload new records" })
    ).toHaveLength(1)
    await user.click(screen.getByRole("tab", { name: "vehicles" }))
    expect(await screen.findAllByRole("table")).toHaveLength(1)
    expect(
      screen.getByRole("button", { name: "Add record" })
    ).toBeInTheDocument()
    for (const name of [
      "Maintenance",
      "Operations",
      "Planning",
      "Passenger reports",
      "Cost options",
    ]) {
      await user.click(screen.getByRole("button", { name }))
      expect(screen.getByRole("heading", { name })).toBeInTheDocument()
      if (name === "Planning") {
        expect(
          screen.getByRole("tab", { name: "Service planning" })
        ).toHaveAttribute("aria-selected", "true")
        expect(
          screen.queryByRole("tab", { name: "Workshop" })
        ).not.toBeInTheDocument()
        await user.click(screen.getByRole("tab", { name: "Festival" }))
      }
      expect(
        screen.queryByText("Source notes & coverage")
      ).not.toBeInTheDocument()
      expect(
        (await screen.findAllByRole("textbox", { name: "Search records" }))
          .length
      ).toBeGreaterThan(0)
      expect(
        screen.getAllByRole("combobox", { name: "Filter by" }).length
      ).toBeGreaterThan(0)
      expect(await screen.findAllByRole("table")).toHaveLength(1)
      if (name === "Passenger reports") {
        expect(screen.queryByText("PC01 · Service 132")).not.toBeInTheDocument()
        await user.type(
          screen.getByRole("textbox", { name: "Search records" }),
          "NO-SUCH-RECORD"
        )
        expect(screen.getByText("No matching records.")).toBeInTheDocument()
        await user.click(screen.getByRole("button", { name: "Reset" }))
        expect(
          screen.queryByText("No matching records.")
        ).not.toBeInTheDocument()
        await user.click(screen.getByRole("combobox", { name: "Filter by" }))
        await user.click(screen.getByRole("option", { name: "Channel" }))
        await user.type(
          screen.getByRole("textbox", { name: "Filter value" }),
          "call"
        )
        expect(
          screen.getByText("2 records · Page 1 of 1 · 25 per page")
        ).toBeInTheDocument()
      }
      if (name === "Maintenance") {
        await user.click(screen.getByRole("tab", { name: "Workshop" }))
        expect(await screen.findAllByRole("table")).toHaveLength(1)
        expect(
          screen.queryByRole("tab", { name: "Service planning" })
        ).not.toBeInTheDocument()
      }
      if (name === "Operations") {
        expect(
          await screen.findByText("6,900 completed · 172 actual vehicles")
        ).toBeInTheDocument()
        for (const tab of ["Crowding", "Resources", "Records", "Reliability"]) {
          await user.click(screen.getByRole("tab", { name: tab }))
          expect(await screen.findAllByRole("table")).toHaveLength(1)
          expect(screen.getByRole("tab", { name: tab })).toHaveAttribute(
            "aria-selected",
            "true"
          )
        }
      }
      if (name === "Planning") {
        for (const tab of ["Festival", "Incident"]) {
          await user.click(screen.getByRole("tab", { name: tab }))
          expect(await screen.findAllByRole("table")).toHaveLength(1)
          expect(screen.getByRole("tab", { name: tab })).toHaveAttribute(
            "aria-selected",
            "true"
          )
        }
      }
    }
  }, 20000)
})

it("investigates SQLite service evidence, changes assumptions, and replays recorded zero versus unknown", async () => {
  const user = userEvent.setup()
  render(
    <DashboardProvider data={readDashboardData()}>
      <FleetDashboard />
    </DashboardProvider>
  )
  await user.click(screen.getByRole("button", { name: "Planning" }))
  expect(
    screen.getByRole("tab", { name: "Service planning" })
  ).toBeInTheDocument()
  await user.click(screen.getByRole("tab", { name: "Service planning" }))
  const watchlist = await screen.findByRole("table", {
    name: "Service watchlist",
  })
  const serviceRow = within(watchlist)
    .getByRole("button", { name: "Investigate service 132" })
    .closest("tr")!
  expect(within(serviceRow).getByText("Critical")).toBeInTheDocument()
  expect(
    screen.queryByRole("button", { name: "Add record" })
  ).not.toBeInTheDocument()
  await user.clear(screen.getByRole("spinbutton", { name: "Queue threshold" }))
  await user.type(
    screen.getByRole("spinbutton", { name: "Queue threshold" }),
    "44"
  )
  await user.click(screen.getByRole("button", { name: "Apply assumptions" }))
  await waitFor(() => {
    const row = screen
      .getByRole("button", { name: "Investigate service 132" })
      .closest("tr")!
    expect(within(row).getByText("High")).toBeInTheDocument()
    expect(
      within(row).queryByText(/Peak remaining queue 43 meets/)
    ).not.toBeInTheDocument()
  })
  expect(window.location.search).toContain("queue=44")
  await user.click(screen.getByRole("tab", { name: "Candidate buses" }))
  expect(
    await screen.findByText("3 supported candidate windows for service 132")
  ).toBeInTheDocument()
  await user.click(screen.getByRole("tab", { name: "Timeline & replay" }))
  expect(screen.getByText(/Queue ≥44/)).toBeInTheDocument()
  const reportCard = (title: string) => {
    const card = screen.getByText(title).closest('[data-slot="card"]')
    if (!(card instanceof HTMLElement))
      throw new Error(`Missing report card: ${title}`)
    return card
  }
  const queues = () => reportCard("Queues at replay time")
  expect(within(queues()).getAllByText("No prior observation")).toHaveLength(25)
  fireEvent.change(
    screen.getByRole("textbox", { name: "Inspect time minutes" }),
    { target: { value: "03" } }
  )
  fireEvent.change(
    screen.getByRole("textbox", { name: "Inspect time seconds" }),
    { target: { value: "36" } }
  )
  const busStates = () => reportCard("Bus states at replay time")
  const busRow = () => within(busStates()).getByText("NW-V009").closest("tr")!
  expect(
    within(busRow()).getByText("Recorded dwell at position 1")
  ).toBeInTheDocument()
  expect(within(queues()).getByText("NW-20261007-0009-01")).toBeInTheDocument()
  const observedRow = within(queues())
    .getByText("NW-20261007-0009-01")
    .closest("tr")!
  expect(within(observedRow).getAllByText("0")).toHaveLength(2)
  expect(within(queues()).getAllByText("No prior observation")).toHaveLength(24)
  fireEvent.change(
    screen.getByRole("textbox", { name: "Inspect time minutes" }),
    { target: { value: "04" } }
  )
  fireEvent.change(
    screen.getByRole("textbox", { name: "Inspect time seconds" }),
    { target: { value: "00" } }
  )
  expect(
    within(busRow()).getByText("Estimated between positions 1 and 2")
  ).toBeInTheDocument()
  window.history.replaceState(null, "", "/")
})
