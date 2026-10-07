import {
  beforeAll,
  beforeEach,
  afterAll,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import { render, screen, within, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DashboardProvider } from "@/components/dashboard-provider"
import { FleetDashboard } from "@/components/fleet-dashboard"
import { readDashboardData } from "@/lib/dashboard-server"
import { GET } from "@/app/api/operations/route"
import { GET as historyGET } from "@/app/api/service-history/route"
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
    (input.startsWith("/api/service-planning")
      ? planningGET
      : input.startsWith("/api/service-history")
        ? historyGET
        : GET)(new Request(new URL(input, "http://localhost")))
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
        if (group.workspace === "Data" || name === "Service reliability") {
          expect(
            await screen.findAllByRole("table", {}, { timeout: 5000 })
          ).toHaveLength(1)
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
        if (name === "Passenger queues") {
          expect(
            await screen.findByRole(
              "region",
              { name: "Queue observations by route position and time" },
              { timeout: 5000 }
            )
          ).toBeInTheDocument()
          expect(
            screen.getByRole("combobox", { name: "Operating date" })
          ).toHaveTextContent("2026-10-16")
          expect(
            screen.getByRole("combobox", { name: "Queue direction" })
          ).toBeInTheDocument()
          expect(
            screen.queryByText("Where queues remain at observation end")
          ).not.toBeInTheDocument()
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

it("shows the service watchlist and replay without removed investigation sections", async () => {
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
  for (const name of [
    "Dated evidence",
    "Candidate buses",
    "Departure timeline",
    "Bus states at replay time",
  ]) {
    expect(screen.queryByText(name)).not.toBeInTheDocument()
  }
  expect(screen.getAllByRole("table")).toHaveLength(1)
  expect(
    screen.getByRole("textbox", { name: "Inspect time minutes" })
  ).toBeInTheDocument()
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
  expect(
    screen.getByRole("textbox", { name: "Inspect time minutes" })
  ).toBeInTheDocument()
  expect(screen.getAllByRole("table")).toHaveLength(1)
  window.history.replaceState(null, "", "/")
}, 15000)

it("opens passenger queues with the linked service, date and planning assumptions", async () => {
  window.history.replaceState(
    null,
    "",
    "/dashboard?view=crowding&date=2026-10-07&service=132&start=06:00&end=07:00&queue=44"
  )
  render(
    <DashboardProvider data={readDashboardData()}>
      <FleetDashboard />
    </DashboardProvider>
  )
  expect(
    await screen.findByRole("combobox", { name: "Queue service" })
  ).toHaveTextContent("Service 132")
  expect(
    screen.getByRole("combobox", { name: "Operating date" })
  ).toHaveTextContent("2026-10-07")
  expect(screen.getByText(/≥44 left behind/)).toBeInTheDocument()
  const plot = screen.getByRole("region", {
    name: "Queue observations by route position and time",
  })
  expect(within(plot).getByText("07:00")).toBeInTheDocument()
  expect(
    within(plot).getByRole("button", { name: /NW-20261007-0009-01/ })
  ).toBeInTheDocument()
  expect(
    within(plot).queryByRole("button", { name: /NW-20261007-0108-01/ })
  ).not.toBeInTheDocument()
})

it("recovers from an invalid link without reopening a collapsed workspace", async () => {
  window.history.replaceState(
    null,
    "",
    "/dashboard?view=service-planning&queue=bad"
  )
  const user = userEvent.setup()
  render(
    <DashboardProvider data={readDashboardData()}>
      <FleetDashboard />
    </DashboardProvider>
  )
  await screen.findByRole("table", { name: "Service watchlist" })
  await user.click(screen.getByRole("button", { name: "Planning" }))
  expect(screen.getByRole("button", { name: "Planning" })).toHaveAttribute(
    "aria-expanded",
    "false"
  )
  await user.click(screen.getByRole("combobox", { name: "Planning date" }))
  await user.click(await screen.findByRole("option", { name: "2026-10-08" }))
  expect(
    screen.getByRole("combobox", { name: "Planning date" })
  ).toHaveTextContent("2026-10-08")
  expect(screen.queryByText(/Invalid planning link/)).not.toBeInTheDocument()
  expect(screen.getByRole("button", { name: "Planning" })).toHaveAttribute(
    "aria-expanded",
    "false"
  )
})

it("retries failed planning loads without leaving a loading status", async () => {
  const realFetch = globalThis.fetch
  let failed = false
  vi.stubGlobal("fetch", (input: string) => {
    if (input.startsWith("/api/service-planning") && !failed) {
      failed = true
      return Promise.resolve(new Response("Busy", { status: 503 }))
    }
    return realFetch(input)
  })
  try {
    window.history.replaceState(null, "", "/dashboard?view=service-planning")
    const user = userEvent.setup()
    render(
      <DashboardProvider data={readDashboardData()}>
        <FleetDashboard />
      </DashboardProvider>
    )
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "could not be loaded"
    )
    expect(
      screen.queryByText("Loading planning evidence…")
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole("combobox", { name: "Planning service" })
    ).toHaveTextContent("Service 132")
    await user.click(screen.getByRole("button", { name: "Retry" }))
    expect(
      await screen.findByRole("table", { name: "Service watchlist" })
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/Planning evidence could not be loaded/)
    ).not.toBeInTheDocument()
  } finally {
    vi.stubGlobal("fetch", realFetch)
  }
})
