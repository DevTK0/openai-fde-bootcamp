// @vitest-environment node
import { expect, it } from "vitest"
import {
  crewRows,
  crewPlanningSchema,
  type CrewPlanningData,
} from "@/lib/crew-planning"
import { GET } from "@/app/api/crew-planning/route"
const trip: CrewPlanningData["trips"][number] = {
  id: "trip-a",
  service: "132",
  route: "r",
  crew: "crew-a",
  vehicle: "bus-a",
  departure: 100,
  arrival: 200,
  origin: "a",
  destination: "b",
  originName: "A",
  destinationName: "B",
}
const duty: CrewPlanningData["duties"][number] = {
  id: "duty-a",
  crew: "crew-a",
  service: "132",
  issued: 0,
  start: 0,
  end: 500,
  breakStart: 300,
  breakEnd: 400,
  location: "a",
  locationName: "A",
  maximum: 300,
  takeover: 0,
  basis: "Fixture",
}
it("detects cross-service overlaps and protects exact break boundaries", () => {
  const rows = crewRows({
    trips: [
      trip,
      { ...trip, id: "trip-b", service: "159", departure: 150, arrival: 350 },
    ],
    duties: [duty],
  })
  expect(rows[0]?.assignments[0]?.conflicts).toEqual(["Overlaps trip trip-b"])
  expect(rows[0]?.assignments[1]?.conflicts).toEqual([
    "Overlaps trip trip-a",
    "Overlaps protected break duty-a",
  ])
  expect(rows[0]?.assignments[1]?.unverified).toContain(
    "Service qualification unverified for this window"
  )
  expect(rows[0]?.lanes).toBe(2)
  const touching = crewRows({
    trips: [
      trip,
      { ...trip, id: "trip-b", departure: 200, arrival: 300 },
      { ...trip, id: "trip-c", departure: 400, arrival: 450 },
    ],
    duties: [duty],
  })
  expect(touching[0]?.assignments.map((a) => a.conflicts)).toEqual([[], [], []])
  expect(touching[0]?.lanes).toBe(1)
})
it("keeps missing evidence unverified and unassigned crews distinct from conflicts", () => {
  const rows = crewRows({
    trips: [
      { ...trip, crew: null },
      { ...trip, id: "trip-b", crew: null, departure: null },
    ],
    duties: [],
  })
  expect(rows[0]?.crew).toBeNull()
  expect(rows[0]?.assignments[0]?.conflicts).toEqual([])
  expect(rows[0]?.assignments[0]?.unverified).toContain("Crew unassigned")
  expect(rows[0]?.assignments[0]?.unverified).toContain(
    "No recorded duty window covers this trip"
  )
  expect(rows[0]?.assignments[1]?.unverified).toContain(
    "Missing or invalid scheduled times"
  )
  expect(crewRows({ trips: [], duties: [duty] })[0]?.assignments).toEqual([])
})
it("loads dated planned assignments with their supplied duty records", async () => {
  const response = await GET(
    new Request("http://localhost/api/crew-planning?date=2026-10-05")
  )
  expect(response.status).toBe(200)
  const data = crewPlanningSchema.parse(await response.json())
  expect(data.trips).toHaveLength(690)
  expect(data.trips.find((t) => t.id === "NW-20261005-0001")).toMatchObject({
    crew: "NW-C001",
    vehicle: "NW-V001",
    service: "235",
  })
  expect(data.duties.find((d) => d.crew === "NW-C001")).toMatchObject({
    id: "NW-D00001",
    service: "235",
    location: "52009",
  })
  const next = crewPlanningSchema.parse(
    await (
      await GET(
        new Request("http://localhost/api/crew-planning?date=2026-10-06")
      )
    ).json()
  )
  const ids = new Set(data.trips.map((t) => t.id))
  expect(next.trips.every((t) => !ids.has(t.id))).toBe(true)
  for (const query of ["", "date=bad", "date=2027-01-01"])
    expect(
      (await GET(new Request(`http://localhost/api/crew-planning?${query}`)))
        .status
    ).toBe(400)
})
