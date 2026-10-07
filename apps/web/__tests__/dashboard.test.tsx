import { beforeAll, afterAll, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DashboardProvider } from "@/components/dashboard-provider"
import { FleetDashboard } from "@/components/fleet-dashboard"
import { readDashboardData } from "@/lib/dashboard-server"
import { GET } from "@/app/api/operations/route"

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
    for (const name of [
      "Relationships",
      "Maintenance",
      "Operations",
      "Workshop & planning",
      "Passenger reports",
      "Cost options",
      "Data explorer",
    ]) {
      await user.click(screen.getByRole("button", { name }))
      expect(screen.getByRole("heading", { name })).toBeInTheDocument()
      if (name === "Relationships") {
        for (const tab of [
          "Component care",
          "Passenger evidence",
          "Planning constraints",
          "Costs & use",
        ]) {
          await user.click(screen.getByRole("tab", { name: tab }))
          expect(screen.getByRole("tab", { name: tab })).toHaveAttribute(
            "aria-selected",
            "true"
          )
        }
      }
      if (name === "Operations") {
        expect(
          await screen.findByText("6,900 completed · 172 actual vehicles")
        ).toBeInTheDocument()
        for (const tab of ["Crowding", "Resources", "Reliability"]) {
          await user.click(screen.getByRole("tab", { name: tab }))
          expect(screen.getByRole("tab", { name: tab })).toHaveAttribute(
            "aria-selected",
            "true"
          )
        }
      }
      if (name === "Workshop & planning") {
        for (const tab of ["Festival", "Incident", "Workshop"]) {
          await user.click(screen.getByRole("tab", { name: tab }))
          expect(screen.getByRole("tab", { name: tab })).toHaveAttribute(
            "aria-selected",
            "true"
          )
        }
      }
      if (name === "Data explorer") {
        await user.click(
          screen.getByRole("tab", { name: "Operations (21 tables)" })
        )
        expect(await screen.findByText("NW-20261005-0001")).toBeInTheDocument()
      }
    }
  }, 20000)
})
