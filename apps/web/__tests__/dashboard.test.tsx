import {
  beforeAll,
  beforeEach,
  afterAll,
  describe,
  expect,
  it,
  vi,
} from "vitest"
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

beforeEach(() => window.history.replaceState(null, "", "/dashboard"))

beforeAll(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
    new DOMRect(0, 0, 1024, 400)
  )
  vi.spyOn(window, "scrollTo").mockImplementation(() => {})
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
  it("opens nested workspace pages and their source records", async () => {
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
      screen.getByRole("link", { name: "Fleet overview" })
    ).toHaveAttribute("aria-current", "page")
    expect(
      screen.queryByRole("button", { name: "Upload new records" })
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole("link", { name: "Resource overview" })
    ).not.toBeInTheDocument()

    const groups = [
      { workspace: "Fleet", pages: ["Vehicle register", "Fleet overview"] },
      {
        workspace: "Operations",
        pages: [
          "Day schedule",
          "Usage & service",
          "Passenger queues",
          "Service reliability",
        ],
      },
      {
        workspace: "Maintenance",
        pages: ["Maintenance history"],
      },
      {
        workspace: "Planning",
        pages: [],
      },
      {
        workspace: "Data",
        pages: [
          "Operations data",
          "Supplied datasets",
          "Control log",
          "Network records",
          "Workshop register",
          "Passenger reports",
        ],
      },
      { workspace: "Finance", pages: ["Cost options"] },
    ]
    for (const group of groups) {
      const trigger = screen.getByRole("button", {
        name: group.workspace,
      })
      if (trigger.getAttribute("aria-expanded") !== "true")
        await user.click(trigger)
      for (const removed of [
        "Resource overview",
        "Incident response",
        "Festival allocation",
        "Workshop planning",
        "Service planning",
      ]) {
        expect(
          screen.queryByRole("link", { name: removed })
        ).not.toBeInTheDocument()
      }
      for (const name of group.pages) {
        const link = screen.getByRole("link", { name })
        await user.click(link)
        expect(screen.getByRole("heading", { name })).toBeInTheDocument()
        expect(link).toHaveAttribute("aria-current", "page")
        expect(screen.getAllByRole("link", { current: "page" })).toHaveLength(1)
        if (
          group.workspace === "Data" ||
          ["Passenger queues", "Service reliability"].includes(name)
        ) {
          expect(await screen.findAllByRole("table")).toHaveLength(1)
          expect(
            screen.getByRole("textbox", { name: "Search records" })
          ).toBeInTheDocument()
        } else {
          expect(
            screen.queryByRole("textbox", { name: "Search records" })
          ).not.toBeInTheDocument()
        }
        expect(
          screen.queryByRole("tab", { name: "Workshop" })
        ).not.toBeInTheDocument()
        if (group.workspace === "Data") {
          expect(
            screen.getByRole("button", { name: "Upload new records" })
          ).toBeInTheDocument()
        }
        if (name === "Workshop register") {
          expect(
            screen.queryByRole("combobox", { name: "Historical period" })
          ).not.toBeInTheDocument()
          await user.click(screen.getByRole("combobox", { name: "Dataset" }))
          await user.click(
            screen.getByRole("option", { name: "workshop vehicles" })
          )
          expect(
            await screen.findByLabelText("workshop vehicles records")
          ).toBeInTheDocument()
        }
        if (name === "Service reliability") {
          expect(
            await screen.findByText("6,900 completed · 172 actual vehicles")
          ).toBeInTheDocument()
        }
        if (name === "Passenger reports") {
          await user.type(
            screen.getByRole("textbox", { name: "Search records" }),
            "NO-SUCH-RECORD"
          )
          expect(screen.getByText("No matching records.")).toBeInTheDocument()
          await user.click(screen.getByRole("button", { name: "Reset" }))
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
      }
    }
  }, 30000)

  it("restores a linked page, follows browser history, and keeps planning assumptions", async () => {
    const user = userEvent.setup()
    window.history.replaceState(
      null,
      "",
      "/dashboard?view=workshop-register&date=2026-10-07&service=132&queue=44"
    )
    render(
      <DashboardProvider data={readDashboardData()}>
        <FleetDashboard />
      </DashboardProvider>
    )
    expect(
      screen.getByRole("heading", { name: "Workshop register" })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Data" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    await user.click(screen.getByRole("button", { name: "Data" }))
    await user.click(screen.getByRole("button", { name: "Planning" }))
    await user.click(screen.getByRole("link", { name: "Service optimisation" }))
    expect(
      screen.getByRole("spinbutton", { name: "Queue threshold" })
    ).toHaveValue(44)
    expect(new URLSearchParams(window.location.search).get("service")).toBe(
      "132"
    )
    window.history.back()
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Workshop register" })
      ).toBeInTheDocument()
    )
    expect(screen.getByRole("button", { name: "Data" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    expect(
      screen.getByRole("link", { name: "Workshop register" })
    ).toHaveAttribute("aria-current", "page")
  })
})

it("investigates SQLite service evidence, changes assumptions, and replays recorded bus states", async () => {
  const user = userEvent.setup()
  render(
    <DashboardProvider data={readDashboardData()}>
      <FleetDashboard />
    </DashboardProvider>
  )
  await user.click(screen.getByRole("button", { name: "Planning" }))
  await user.click(screen.getByRole("link", { name: "Service optimisation" }))
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
  expect(
    screen.getByRole("spinbutton", { name: "Queue threshold" })
  ).toHaveValue(44)
  const reportCard = (title: string) => {
    const card = screen.getByText(title).closest('[data-slot="card"]')
    if (!(card instanceof HTMLElement))
      throw new Error(`Missing report card: ${title}`)
    return card
  }
  expect(screen.queryByText("Queues at replay time")).not.toBeInTheDocument()
  expect(screen.getByText("Departure timeline")).toBeInTheDocument()
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
