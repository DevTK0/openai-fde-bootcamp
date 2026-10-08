import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { PlanningPlanTimeline } from "@/components/planning-plan-timeline"
import type { PlanningReport } from "@/lib/planning-schema"

type Calendar = PlanningReport["recommendations"][number]["calendars"][number]
const at = (clock: string) => `2026-10-05T${clock}+08:00`
const calendar: Calendar = {
  kind: "crew",
  resourceId: "CREW-2",
  availableFrom: at("06:00:00"),
  availableUntil: at("18:00:00"),
  break: { start: at("12:00:00"), end: at("12:30:00") },
  details: "Qualified for 232",
  tasks: [
    {
      trip: "EARLIER",
      route: "232",
      crew: "CREW-2",
      bus: "BUS-1",
      departure: at("08:00:00"),
      arrival: at("08:30:00"),
      preparation: at("07:58:00"),
      alightingUntil: at("08:30:45"),
      origin: "Terminal",
      destination: "Terminal",
    },
    {
      trip: "CHANGED",
      route: "232",
      crew: "CREW-2",
      bus: "BUS-1",
      departure: at("10:00:00"),
      arrival: at("10:30:00"),
      preparation: at("09:58:00"),
      alightingUntil: at("10:30:45"),
      origin: "Terminal",
      destination: "Terminal",
    },
    {
      trip: "LATER",
      route: "232",
      crew: "CREW-2",
      bus: "BUS-1",
      departure: at("13:00:00"),
      arrival: at("13:30:00"),
      preparation: at("12:58:00"),
      alightingUntil: at("13:30:45"),
      origin: "Terminal",
      destination: "Terminal",
    },
  ],
}
const original = [
  {
    trip: "CHANGED",
    route: "232",
    crew: "SICK-CREW",
    bus: "BUS-1",
    departure: at("10:00:00"),
    arrival: at("10:30:00"),
  },
]

describe("coordinated plan timelines", () => {
  it("starts on the reassigned duty and preserves earlier work, breaks and later preparation", async () => {
    const user = userEvent.setup()
    render(
      <PlanningPlanTimeline
        calendars={[
          calendar,
          { ...calendar, kind: "bus", resourceId: "BUS-1", break: null },
        ]}
        original={original}
        decisionAt={at("09:25:00")}
      />
    )
    expect(
      screen.getByRole("region", { name: "Plan assignment timeline" })
    ).toHaveAccessibleName("Plan assignment timeline")
    expect(
      within(screen.getByRole("group", { name: "Plan Crew CREW-2" })).getByRole(
        "button",
        {
          name: /Trip CHANGED, service 232, 10:00 to 10:30, Reassigned trip/,
        }
      )
    ).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByText(/Crew SICK-CREW → CREW-2/)).toBeInTheDocument()
    expect(
      screen.getByText(/Preparation 09:58 · Alighting complete 10:30/)
    ).toBeInTheDocument()
    expect(
      screen.getAllByText(/Gap until next preparation: 147m 15s/)[0]
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Protected break 12:00 to 12:30\./)
    ).toBeInTheDocument()
    for (const block of screen.getAllByRole("button", {
      name: /Trip CHANGED,/,
    })) {
      expect(block).toHaveAttribute("aria-pressed", "true")
      expect(block).toHaveClass("bg-violet-600")
    }
    expect(
      screen.getAllByRole("button", { name: /Trip CHANGED,/ })
    ).toHaveLength(3)
    for (const block of screen.getAllByRole("button", {
      name: /Trip EARLIER,/,
    })) {
      expect(block).toHaveClass("bg-muted")
    }
    await user.click(
      within(screen.getByRole("group", { name: "Plan Crew CREW-2" })).getByRole(
        "button",
        { name: /Trip EARLIER, service 232/ }
      )
    )
    for (const block of screen.getAllByRole("button", {
      name: /Trip EARLIER,/,
    })) {
      expect(block).toHaveAttribute("aria-pressed", "true")
    }
    for (const block of screen.getAllByRole("button", {
      name: /Trip CHANGED,/,
    })) {
      expect(block).toHaveAttribute("aria-pressed", "false")
      expect(block).toHaveClass("bg-violet-600")
    }
    expect(screen.getByText("EARLIER")).toBeInTheDocument()
    expect(
      within(screen.getByRole("group", { name: "Plan Crew CREW-2" })).getByRole(
        "button",
        { name: /Trip EARLIER, service 232/ }
      )
    ).toHaveAttribute("aria-pressed", "true")
  })
  it("reveals retained resources and keeps concurrent route trips in separate lanes", async () => {
    const user = userEvent.setup()
    const extra: Calendar = {
      ...calendar,
      resourceId: "CREW-3",
      tasks: calendar.tasks.map((t) => ({
        ...t,
        trip: "OTHER-" + t.trip,
        crew: "CREW-3",
      })),
    }
    render(
      <PlanningPlanTimeline
        calendars={[calendar, extra]}
        original={original}
        decisionAt={at("09:25:00")}
      />
    )
    expect(
      screen.queryByRole("group", { name: "Plan Crew CREW-3" })
    ).not.toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Show full plan" }))
    expect(
      screen.getByRole("group", { name: "Plan Crew CREW-3" })
    ).toBeInTheDocument()
    const route = within(screen.getByRole("group", { name: "Plan Route 232" }))
    const one = route.getByRole("button", { name: /Trip CHANGED,/ })
    const two = route.getByRole("button", { name: /Trip OTHER-CHANGED,/ })
    expect(one.style.top).not.toBe(two.style.top)
    await user.click(two)
    expect(two).toHaveAttribute("aria-pressed", "true")
    expect(
      screen.getByText(/No complete bus calendar is supplied for BUS-1/)
    ).toBeInTheDocument()
  })
  it("does not invent missing preparation or departure times", () => {
    render(
      <PlanningPlanTimeline
        calendars={[
          {
            ...calendar,
            tasks: [
              {
                trip: "UNKNOWN",
                route: "232",
                crew: "CREW-2",
                bus: "BUS-1",
                origin: "Terminal",
                destination: "Terminal",
                departure: null,
                arrival: null,
                preparation: null,
                alightingUntil: null,
              },
            ],
          },
        ]}
        original={[]}
        decisionAt={at("09:25:00")}
      />
    )
    expect(
      screen.getByText(/Timing is not established for 1 duties/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Departure and arrival are not established/)
    ).toBeInTheDocument()
  })
})
