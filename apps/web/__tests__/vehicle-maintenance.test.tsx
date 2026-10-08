import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, it, vi } from "vitest"
import { VehicleMaintenance } from "@/components/vehicle-maintenance"
import { vehicleRows, type VehiclePlanningData } from "@/lib/vehicle-planning"

const data: VehiclePlanningData = {
  vehicles: [{ id: "bus", service: "235", scope: "operating" }],
  readiness: [],
  holds: [
    { id: "WO-1", vehicle: "bus", source: "workshop", start: 100, end: null },
  ],
  workOrders: [
    {
      id: "WO-1",
      vehicle: "bus",
      source: "workshop",
      opened: 100,
      updated: 150,
      expected: 200,
      released: null,
      fault: "Door will not close",
      finding: "Worn actuator",
      action: "Replacement pending",
      status: "Awaiting parts",
      releaseStatus: "held",
      note: "Engineering release required",
      facility: "Depot A",
    },
  ],
  trips: [
    {
      id: "trip-1",
      service: "238",
      route: "route",
      vehicle: "bus",
      crew: "crew",
      departure: 300,
      arrival: 400,
      origin: "a",
      destination: "b",
      originName: "A",
      destinationName: "B",
    },
  ],
}

function row(input = data) {
  const value = vehicleRows(input, 0, 1000).find((r) => r.vehicle === "bus")
  if (!value) throw new Error("Expected bus row")
  return value
}

it("shows source-backed maintenance and keeps a trip affected after estimated completion", async () => {
  const onSelectTrip = vi.fn()
  render(
    <VehicleMaintenance
      row={row()}
      date="2026-10-07"
      onSelectTrip={onSelectTrip}
    />
  )
  const order = within(screen.getByRole("article", { name: "Work order WO-1" }))
  expect(order.getByText("Door will not close")).toBeVisible()
  expect(order.getByText("Worn actuator")).toBeVisible()
  expect(order.getByText("Replacement pending")).toBeVisible()
  expect(order.getByText(/estimate only/)).toBeVisible()
  expect(order.getByText("Not recorded; release unconfirmed")).toBeVisible()
  expect(order.getByText(/Source: workshop/)).toBeVisible()
  expect(
    screen.getByRole("heading", { name: "Latest supplied workshop update" })
  ).toBeVisible()
  await userEvent.click(screen.getByRole("button", { name: /Service 238/ }))
  expect(onSelectTrip).toHaveBeenCalledWith("trip-1")
})

it("does not report a trip at confirmed release as affected and labels undated updates", () => {
  render(
    <VehicleMaintenance
      row={row({
        ...data,
        holds: data.holds.map((h) => ({ ...h, end: 300 })),
        workOrders: data.workOrders.map((o) => ({
          ...o,
          released: 300,
          releaseStatus: "released",
          status: "Closed",
          updated: null,
        })),
      })}
      date="2026-10-07"
      onSelectTrip={vi.fn()}
    />
  )
  expect(screen.getByText("Closed")).toBeVisible()
  expect(screen.getByText(/No dated workshop update supplied/)).toBeVisible()
  expect(screen.getByText(/Update time not supplied/)).toBeVisible()
  expect(
    screen.getByText(/No scheduled trip overlaps a timed hold/)
  ).toBeVisible()
  expect(
    screen.queryByRole("button", { name: /Service 238/ })
  ).not.toBeInTheDocument()
})

it("keeps missing records and incomplete impact evidence explicit", () => {
  const { rerender } = render(
    <VehicleMaintenance
      row={row({ ...data, workOrders: [], holds: [], trips: [] })}
      date="2026-10-07"
      onSelectTrip={vi.fn()}
    />
  )
  expect(
    screen.getByText(/Missing records do not confirm release/)
  ).toBeVisible()
  expect(screen.getByText(/No planned trips supplied/)).toBeVisible()
  rerender(
    <VehicleMaintenance
      row={row({
        ...data,
        holds: data.holds.map((h) => ({ ...h, start: null })),
      })}
      date="2026-10-07"
      onSelectTrip={vi.fn()}
    />
  )
  expect(
    screen.getByText(/Incomplete timing evidence prevents a full impact check/)
  ).toBeVisible()
})
