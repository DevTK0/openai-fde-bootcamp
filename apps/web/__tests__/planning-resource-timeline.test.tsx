import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { PlanningResourceTimeline } from "@/components/planning-resource-timeline"
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

describe("resource timelines", () => {
  it("starts on the reassigned duty and preserves earlier work, breaks and later preparation", async () => {
    const user = userEvent.setup()
    render(
      <PlanningResourceTimeline
        calendars={[calendar]}
        original={original}
        decisionAt={at("09:25:00")}
      />
    )
    expect(
      screen.getByRole("region", { name: "Crew assignment timeline" })
    ).toHaveAccessibleName("Crew assignment timeline")
    expect(
      screen.getByRole("button", {
        name: /Trip CHANGED, service 232, 10:00 to 10:30, Reassigned trip/,
      })
    ).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByText(/Crew SICK-CREW → CREW-2/)).toBeInTheDocument()
    expect(
      screen.getByText(/Preparation 09:58 · Alighting complete 10:30/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Gap until next preparation: 147m 15s/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Protected break 12:00 to 12:30\./)
    ).toBeInTheDocument()
    await user.click(
      screen.getByRole("button", { name: /Trip EARLIER, service 232/ })
    )
    expect(screen.getByText("EARLIER")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /Trip EARLIER, service 232/ })
    ).toHaveAttribute("aria-pressed", "true")
  })
  it("does not invent missing preparation or departure times", () => {
    render(
      <PlanningResourceTimeline
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
