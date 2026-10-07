import { describe, expect, it } from "vitest"
import {
  buildPlanningReport,
  planningSelectionSchema,
  planningTime,
  replayAt,
  type PlanningSources,
} from "@/lib/service-planning"

const selection = planningSelectionSchema.parse({
  date: "2026-10-07",
  service: "132",
})
const at = (time: string) => planningTime(selection.date, time)
function source(): PlanningSources {
  return {
    routes: [
      {
        id: "R1",
        service: "132",
        direction: 1,
        name: "Service 132",
        origin: "A",
      },
      {
        id: "R2",
        service: "132",
        direction: 2,
        name: "Service 132",
        origin: "B",
      },
    ],
    positions: [
      { route: "R1", order: 1, stop: "A", name: "A", boarding: 1 },
      { route: "R1", order: 2, stop: "A", name: "A again", boarding: 1 },
      { route: "R1", order: 3, stop: "B", name: "B", boarding: 0 },
      { route: "R2", order: 1, stop: "A", name: "A reverse", boarding: 1 },
    ],
    vehicles: [{ id: "V1", service: "132" }],
    trips: [
      {
        id: "T1",
        service: "132",
        route: "R1",
        vehicle: "V1",
        crew: "C1",
        origin: "B",
        destination: "A",
        scheduled: at("09:55"),
        departure: at("10:00"),
        arrival: at("11:00"),
      },
    ],
    calls: [
      {
        id: "Q1",
        trip: "T1",
        route: "R1",
        order: 1,
        vehicle: "V1",
        arrival: at("09:59"),
        departure: at("10:00"),
        observed: at("10:00"),
        queue: 30,
      },
      {
        id: "Q2",
        trip: "T1",
        route: "R1",
        order: 2,
        vehicle: "V1",
        arrival: at("10:10"),
        departure: at("10:12"),
        observed: at("10:11"),
        queue: 0,
      },
    ],
    releases: [
      {
        id: "REL1",
        vehicle: "V1",
        issued: at("05:00"),
        start: at("05:00"),
        end: at("16:00"),
        location: "B",
        state: "released",
      },
    ],
    duties: [
      {
        id: "D1",
        crew: "C1",
        service: "132",
        issued: at("05:00"),
        start: at("09:00"),
        end: at("16:00"),
        location: "B",
        breakStart: at("13:00"),
        breakEnd: at("13:30"),
        maximum: 300,
        takeover: 300,
      },
    ],
    movements: [],
    holds: [],
  }
}

describe("service planning", () => {
  it("uses inclusive thresholds and returns the evidence behind the priority", () => {
    const data = source()
    expect(buildPlanningReport(data, selection).watchlist[0]).toMatchObject({
      priority: "Critical",
      affected: 1,
      observed: 2,
      total: 3,
      peak: { id: "Q1", queue: 30 },
      delays: [{ trip: "T1", minutes: 5 }],
    })
    const raised = buildPlanningReport(data, {
      ...selection,
      delay: 5.01,
      queue: 31,
    }).watchlist[0]
    expect(raised).toMatchObject({
      priority: "No observed trigger",
      reasons: [],
      delays: [],
      affected: 1,
    })
  })
  it("deduplicates route positions and preserves direction, repeated stops and unknown evidence", () => {
    const data = source()
    const first = data.calls[0]!
    data.calls.push({ ...first, id: "Q3", observed: at("11:00"), queue: 50 })
    expect(buildPlanningReport(data, selection).watchlist[0]).toMatchObject({
      affected: 1,
      observed: 2,
      total: 3,
    })
    data.calls.push({ ...first, id: "Q4", route: "R2", queue: null })
    expect(buildPlanningReport(data, selection).watchlist[0]).toMatchObject({
      observed: 2,
    })
    data.calls.push({
      ...first,
      id: "Q5",
      route: "R2",
      observed: at("11:30"),
      queue: 0,
    })
    expect(buildPlanningReport(data, selection).watchlist[0]).toMatchObject({
      affected: 1,
      observed: 3,
      total: 3,
    })
    data.calls = []
    expect(buildPlanningReport(data, selection).watchlist[0]).toMatchObject({
      observed: 0,
      peak: null,
    })
  })
  it("bounds observations and separates linked maintenance from unassigned workshop holds", () => {
    const data = source()
    data.holds = [
      {
        id: "H1",
        vehicle: "WORKSHOP",
        start: at("08:00"),
        end: null,
        source: "workshop",
      },
      {
        id: "H2",
        vehicle: "V1",
        start: at("16:00"),
        end: null,
        source: "repairs",
      },
    ]
    expect(
      buildPlanningReport(data, { ...selection, start: "10:01" }).watchlist[0]
    ).toMatchObject({ holds: [], delays: [], peak: { queue: 0 } })
    data.holds.push({
      id: "H3",
      vehicle: "V1",
      start: at("11:00"),
      end: at("11:30"),
      source: "repairs",
    })
    expect(
      buildPlanningReport(data, selection).watchlist[0]?.holds.map((h) => h.id)
    ).toEqual(["H3"])
  })
  it("returns a bounded candidate with dated release, completed task and distinct crew evidence", () => {
    expect(
      buildPlanningReport(source(), selection).candidates[0]
    ).toMatchObject({
      vehicle: "V1",
      assignedService: "132",
      status: "candidate",
      crew: "C1",
      location: "A",
      until: at("13:00"),
      evidence: ["REL1", "D1", "T1", "T1"],
    })
  })
  it("does not qualify a vehicle with missing or future readiness or missing crew", () => {
    const data = source()
    data.releases = []
    expect(buildPlanningReport(data, selection).candidates[0]?.status).toBe(
      "unknown"
    )
    data.releases = source().releases.map((r) => ({
      ...r,
      issued: at("12:01"),
    }))
    expect(buildPlanningReport(data, selection).candidates[0]?.status).toBe(
      "unknown"
    )
    data.releases = source().releases
    data.duties = []
    expect(buildPlanningReport(data, selection).candidates[0]?.status).toBe(
      "unknown"
    )
  })
  it("reserves crew once across candidate buses", () => {
    const data = source()
    data.vehicles.push({ id: "V2", service: "159" })
    data.trips.push({
      ...data.trips[0]!,
      id: "T2",
      vehicle: "V2",
      crew: "OTHER",
    })
    data.releases.push({
      ...data.releases[0]!,
      id: "REL2",
      vehicle: "V2",
      location: "A",
    })
    expect(
      buildPlanningReport(data, selection).candidates.map((c) => c.status)
    ).toEqual(["candidate", "unknown"])
  })
  it("rejects conflicting vehicle tasks, crew tasks, breaks, incomplete timing and turnaround", () => {
    const data = source()
    data.movements = [
      {
        id: "M1",
        vehicle: "V1",
        crew: "C1",
        from: "A",
        to: "B",
        start: at("12:20"),
        end: at("12:25"),
      },
    ]
    expect(buildPlanningReport(data, selection).candidates[0]).toMatchObject({
      status: "unavailable",
      reasons: ["Task or turnaround M1 overlaps the window"],
    })
    data.movements[0]!.vehicle = "OTHER"
    expect(buildPlanningReport(data, selection).candidates[0]?.status).toBe(
      "unknown"
    )
    data.movements = []
    data.duties[0]!.breakStart = at("12:20")
    expect(buildPlanningReport(data, selection).candidates[0]?.status).toBe(
      "unknown"
    )
    data.duties = source().duties
    data.trips[0]!.arrival = at("11:55")
    expect(buildPlanningReport(data, selection).candidates[0]?.status).toBe(
      "unavailable"
    )
    data.trips[0]!.arrival = null
    expect(buildPlanningReport(data, selection).candidates[0]?.status).toBe(
      "unknown"
    )
  })
  it("keeps dwell recorded and queue zero distinct from unknown, without looking into the future", () => {
    const detail = buildPlanningReport(source(), selection).detail
    const before = replayAt(detail, at("09:59"))
    expect(before.queues[0]?.observation).toBeNull()
    expect(before.buses[0]?.state).toBe("Recorded dwell at position 1")
    const between = replayAt(detail, at("10:05"))
    expect(between.buses[0]?.state).toBe("Estimated between positions 1 and 2")
    expect(between.queues[0]).toMatchObject({
      observation: { id: "Q1", queue: 30 },
      age: 300,
    })
    expect(between.queues[1]?.observation).toBeNull()
    const dwell = replayAt(detail, at("10:11"))
    expect(dwell.buses[0]?.state).toBe("Recorded dwell at position 2")
    expect(dwell.queues[1]).toMatchObject({ observation: { queue: 0 }, age: 0 })
    expect(dwell.queues[2]?.observation).toBeNull()
  })
  it("rejects invalid windows and non-finite assumptions", () => {
    expect(
      planningSelectionSchema.safeParse({
        ...selection,
        start: "12:00",
        end: "06:00",
      }).success
    ).toBe(false)
    expect(
      planningSelectionSchema.safeParse({ ...selection, queue: "NaN" }).success
    ).toBe(false)
  })
})

it("starts a fresh continuous duty segment after a completed protected break", () => {
  const data = source()
  data.duties = [
    {
      id: "D2",
      crew: "C1",
      service: "132",
      issued: at("05:00"),
      start: at("09:00"),
      end: at("16:00"),
      location: "A",
      breakStart: at("11:05"),
      breakEnd: at("11:35"),
      maximum: 120,
      takeover: 300,
    },
  ]
  data.releases = data.releases.map((r) => ({ ...r, location: "A" }))
  expect(buildPlanningReport(data, selection).candidates[0]).toMatchObject({
    status: "candidate",
    dutyLimit: at("13:35"),
  })
})
