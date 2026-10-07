// @vitest-environment node
import { expect, it } from "vitest"
import {
  vehiclePlanningSchema,
  vehicleRows,
  type VehiclePlanningData,
} from "@/lib/vehicle-planning"
import { GET } from "@/app/api/vehicle-planning/route"
const trip: VehiclePlanningData["trips"][number] = {
  id: "trip-a",
  service: "132",
  route: "r",
  vehicle: "bus",
  crew: "crew",
  departure: 100,
  arrival: 200,
  origin: "a",
  destination: "b",
  originName: "A",
  destinationName: "B",
}
const base: VehiclePlanningData = {
  trips: [trip],
  vehicles: [{ id: "bus", service: "132", scope: "operating" }],
  readiness: [
    {
      id: "release",
      vehicle: "bus",
      issued: 0,
      start: 0,
      end: 500,
      location: "a",
      state: "released",
    },
  ],
  holds: [],
}
it("detects overlapping assignments across services and open holds", () => {
  const rows = vehicleRows(
    {
      ...base,
      trips: [
        trip,
        { ...trip, id: "trip-b", service: "159", departure: 150, arrival: 300 },
      ],
      holds: [
        {
          id: "hold",
          vehicle: "bus",
          start: 180,
          end: null,
          source: "workshop",
        },
      ],
    },
    0,
    1000
  )
  expect(rows[0]?.assignments[0]?.conflicts).toEqual([
    "Overlaps trip trip-b",
    "Maintenance hold hold (workshop)",
  ])
  expect(rows[0]?.assignments[1]?.conflicts).toEqual([
    "Overlaps trip trip-a",
    "Maintenance hold hold (workshop)",
  ])
  expect(rows[0]?.lanes).toBe(2)
})
it("honors confirmed-release boundaries and does not infer release from missing evidence", () => {
  const holds = [
    { id: "hold", vehicle: "bus", start: 0, end: 100, source: "workshop" },
  ]
  const rows = vehicleRows(
    {
      ...base,
      holds,
      trips: [trip, { ...trip, id: "trip-b", departure: 200, arrival: 300 }],
    },
    0,
    1000
  )
  expect(rows[0]?.assignments.map((a) => a.conflicts)).toEqual([[], []])
  expect(rows[0]?.lanes).toBe(1)
  expect(
    vehicleRows({ ...base, readiness: [] }, 0, 1000)[0]?.assignments[0]
      ?.unverified
  ).toContain("No recorded release window covers this trip")
  expect(
    vehicleRows(
      {
        ...base,
        readiness: base.readiness.map((r) => ({ ...r, issued: 150 })),
      },
      0,
      1000
    )[0]?.assignments[0]?.unverified
  ).toContain("No recorded release window covers this trip")
  expect(
    vehicleRows({ ...base, holds: [{ ...holds[0]!, start: null }] }, 0, 1000)[0]
      ?.assignments[0]?.unverified
  ).toContain("Maintenance timing evidence incomplete")
  const unknown = vehicleRows(
    {
      ...base,
      vehicles: [],
      trips: [
        { ...trip, vehicle: null, departure: null },
        { ...trip, id: "trip-b", vehicle: null },
      ],
      readiness: [],
    },
    0,
    1000
  ).find((r) => r.vehicle === null)
  expect(unknown?.assignments.every((a) => a.conflicts.length === 0)).toBe(true)
  expect(
    unknown?.assignments.find((a) => a.trip.id === "trip-a")?.unverified
  ).toContain("Missing or invalid scheduled times")
})
it("loads planned trips and keeps the separate workshop cohort and open holds visible", async () => {
  const response = await GET(
    new Request("http://localhost/api/vehicle-planning?date=2026-10-07")
  )
  expect(response.status).toBe(200)
  const data = vehiclePlanningSchema.parse(await response.json())
  expect(data.trips).toHaveLength(690)
  expect(data.trips.find((t) => t.id === "NW-20261007-0001")).toMatchObject({
    vehicle: "NW-V001",
    crew: "NW-C001",
  })
  expect(data.vehicles.find((v) => v.id === "NW-W001")).toMatchObject({
    scope: "workshop",
    service: null,
  })
  expect(data.holds.find((h) => h.id === "NW-WO0001")).toMatchObject({
    vehicle: "NW-W001",
    end: null,
  })
  const day = Date.parse("2026-10-07T00:00:00+08:00") / 1000
  expect(
    vehicleRows(data, day, day + 86400)
      .find((r) => r.vehicle === "NW-W001")
      ?.holds.some((h) => h.id === "NW-WO0001")
  ).toBe(true)
  expect(data.readiness.find((r) => r.vehicle === "NW-V001")?.state).toBe(
    "released"
  )
  for (const query of ["", "date=bad", "date=2027-01-01"])
    expect(
      (await GET(new Request(`http://localhost/api/vehicle-planning?${query}`)))
        .status
    ).toBe(400)
})
