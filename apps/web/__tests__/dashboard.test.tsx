import { beforeAll, afterAll, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DashboardProvider } from "@/components/dashboard-provider"
import { FleetDashboard } from "@/components/fleet-dashboard"
import { readDashboardData } from "@/lib/dashboard-server"
import { GET } from "@/app/api/operations/route"

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
    GET(new Request(new URL(input, "http://localhost")))
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
      "Workshop & planning",
      "Passenger reports",
      "Cost options",
    ]) {
      await user.click(screen.getByRole("button", { name }))
      expect(screen.getByRole("heading", { name })).toBeInTheDocument()
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
      if (name === "Workshop & planning") {
        for (const tab of ["Festival", "Incident", "Workshop"]) {
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
