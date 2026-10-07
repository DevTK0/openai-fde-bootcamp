import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, it } from "vitest"
import { QueueObservations } from "@/components/queue-observations"
import {
  planningTime,
  type PlanningReport,
  type PlanningCall,
} from "@/lib/service-planning"

const selection = {
  date: "2026-10-07",
  service: "132",
  start: "06:00",
  end: "07:00",
  queue: 30,
  delay: 5,
  horizon: 30,
}
const at = (time: string) => planningTime(selection.date, time)
const call = (
  id: string,
  order: number,
  queue: number | null,
  observed: number | null
): PlanningCall => ({
  id,
  order,
  queue,
  observed,
  route: "R1",
  trip: "T1",
  vehicle: "V1",
  arrival: observed,
  departure: observed,
  boarded: 12,
  alighted: 3,
})
const detail: PlanningReport["detail"] = {
  routes: [
    { id: "R1", service: "132", direction: 1, name: "Outbound", origin: "S1" },
    { id: "R2", service: "132", direction: 2, name: "Inbound", origin: "S2" },
  ],
  positions: [
    { route: "R1", order: 1, stop: "S1", name: "Interchange", boarding: 1 },
    { route: "R1", order: 2, stop: "S2", name: "Market", boarding: 1 },
    { route: "R1", order: 3, stop: "S1", name: "Interchange", boarding: 1 },
    { route: "R1", order: 4, stop: "S3", name: "Library", boarding: 1 },
    { route: "R1", order: 5, stop: "S4", name: "Terminal", boarding: 0 },
    { route: "R2", order: 1, stop: "S2", name: "Market inbound", boarding: 1 },
  ],
  calls: [
    call("zero", 1, 0, at("06:00")),
    call("unknown", 2, null, at("06:15")),
    call("threshold", 3, 30, at("07:00")),
    call("too-early", 1, 90, at("05:59")),
    call("too-late", 1, 90, at("07:01")),
    call("undated", 4, 90, null),
    call("terminal", 5, 90, at("06:15")),
    { ...call("reverse", 1, 8, at("06:20")), route: "R2" },
  ],
  trips: [],
}

it("distinguishes zero, unknown and unobserved positions, with inclusive time and queue boundaries", () => {
  const { rerender } = render(
    <QueueObservations detail={detail} selection={selection} />
  )
  const plot = screen.getByRole("region", {
    name: "Queue observations by route position and time",
  })
  expect(within(plot).getAllByRole("button")).toHaveLength(3)
  expect(
    within(plot).getByRole("button", { name: /06:00:00, 0 left behind/ })
  ).toBeInTheDocument()
  expect(
    within(plot).getByRole("button", { name: /06:15:00, Unknown left behind/ })
  ).toHaveTextContent("?")
  expect(
    within(plot).getByRole("button", {
      name: /07:00:00, 30 left behind, threshold met/,
    })
  ).toBeInTheDocument()
  expect(
    within(
      screen.getByRole("group", { name: "Position 4: Library" })
    ).getByText("No observation")
  ).toBeInTheDocument()
  expect(
    screen.queryByRole("group", { name: "Position 5: Terminal" })
  ).not.toBeInTheDocument()
  expect(
    screen.getByText(/3 observations · 3\/4 boarding positions/)
  ).toBeInTheDocument()
  rerender(
    <QueueObservations
      detail={detail}
      selection={{ ...selection, queue: 31 }}
    />
  )
  expect(
    within(plot).queryByRole("button", { name: /threshold met/ })
  ).not.toBeInTheDocument()
  expect(
    within(plot).getByRole("button", { name: /30 left behind, threshold/ })
  ).toBeInTheDocument()
})

it("opens dated passenger evidence by keyboard and switches route directions without mixing positions", async () => {
  const user = userEvent.setup()
  render(<QueueObservations detail={detail} selection={selection} />)
  const zero = screen.getByRole("button", { name: /06:00:00, 0 left behind/ })
  zero.focus()
  await user.keyboard("{Enter}")
  const sheet = screen.getByRole("dialog")
  expect(within(sheet).getByText("zero")).toBeInTheDocument()
  expect(within(sheet).getByText("V1")).toBeInTheDocument()
  expect(within(sheet).getByText("12")).toBeInTheDocument()
  expect(within(sheet).getByText("0")).toBeInTheDocument()
  expect(
    within(sheet).getByText(/2026-10-07 · SGT · stop_calls/)
  ).toBeInTheDocument()
  await user.keyboard("{Escape}")
  await user.click(screen.getByRole("combobox", { name: "Queue direction" }))
  await user.click(screen.getByRole("option", { name: "Direction 2" }))
  expect(
    screen.queryByRole("button", { name: /06:00:00, 0 left behind/ })
  ).not.toBeInTheDocument()
  expect(
    screen.getByRole("button", {
      name: /Market inbound, position 1, 06:20:00, 8 left behind/,
    })
  ).toBeInTheDocument()
  expect(
    screen.getByText(/1 observations · 1\/1 boarding positions/)
  ).toBeInTheDocument()
})

it("closes removed evidence on refresh and falls back to the new service's route", async () => {
  const user = userEvent.setup()
  const { rerender } = render(
    <QueueObservations detail={detail} selection={selection} />
  )
  await user.click(
    screen.getByRole("button", { name: /06:15:00, Unknown left behind/ })
  )
  expect(screen.getByRole("dialog")).toBeInTheDocument()
  rerender(
    <QueueObservations
      detail={{ ...detail, calls: [] }}
      selection={selection}
    />
  )
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  rerender(
    <QueueObservations
      detail={{
        trips: [],
        calls: [],
        positions: [],
        routes: [
          {
            id: "NEW",
            service: "261",
            direction: 1,
            name: "New service",
            origin: "S1",
          },
        ],
      }}
      selection={selection}
    />
  )
  expect(
    screen.getByRole("combobox", { name: "Queue direction" })
  ).toHaveTextContent("Direction 1")
  expect(
    screen.getByText("No boarding positions supplied for this route.")
  ).toBeInTheDocument()
})

it("selects a service independently and limits directions and evidence to it", async () => {
  const user = userEvent.setup()
  render(
    <QueueObservations
      selection={selection}
      detail={{
        ...detail,
        routes: [
          ...detail.routes,
          {
            id: "R3",
            service: "261",
            direction: 1,
            name: "Loop",
            origin: "S3",
          },
        ],
        positions: [
          ...detail.positions,
          { route: "R3", order: 1, stop: "S3", name: "Loop stop", boarding: 1 },
        ],
        calls: [
          ...detail.calls,
          { ...call("loop-call", 1, 19, at("06:30")), route: "R3" },
        ],
      }}
    />
  )
  expect(
    screen.getByRole("combobox", { name: "Queue service" })
  ).toHaveTextContent("Service 132")
  await user.click(screen.getByRole("combobox", { name: "Queue direction" }))
  await user.click(await screen.findByRole("option", { name: "Direction 2" }))
  await user.click(screen.getByRole("combobox", { name: "Queue service" }))
  expect(screen.queryByRole("option", { name: /All/ })).not.toBeInTheDocument()
  await user.click(await screen.findByRole("option", { name: "Service 261" }))
  expect(
    screen.getByRole("combobox", { name: "Queue direction" })
  ).toHaveTextContent("Direction 1")
  expect(
    screen.getByRole("button", { name: /Loop stop.*19 left behind/ })
  ).toBeInTheDocument()
  expect(
    screen.queryByRole("button", { name: /Market inbound/ })
  ).not.toBeInTheDocument()
  await user.click(screen.getByRole("combobox", { name: "Queue direction" }))
  expect(
    await screen.findByRole("option", { name: "Direction 1" })
  ).toBeInTheDocument()
  expect(
    screen.queryByRole("option", { name: "Direction 2" })
  ).not.toBeInTheDocument()
})
