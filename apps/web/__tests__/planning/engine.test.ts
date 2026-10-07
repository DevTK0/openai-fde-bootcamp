// @vitest-environment node
import { describe, expect, it } from "vitest"
import { buildCandidates } from "@/lib/planning/engine"
import { listScenarios, loadScenario } from "@/lib/planning/fixture"

describe("bounded LionLink planning scenarios", () => {
  it("lists the two 235 recovery dates and each supplied 238 date", async () => {
    const scenarios = await listScenarios()
    expect(
      scenarios
        .filter((scenario) => scenario.id === "service-235-recovery")
        .map((s) => s.date)
    ).toEqual(["2026-10-07", "2026-10-14"])
    expect(
      scenarios.filter((scenario) => scenario.id === "service-238-timetable")
    ).toHaveLength(10)
    expect(scenarios.every((scenario) => scenario.sourceCutoffAt)).toBe(true)
  })

  it("uses the listed 235 relief resource and catches the recorded cover conflict", async () => {
    const fixture = await loadScenario(
      "service-235-recovery",
      "2026-10-07",
      "retrospective"
    )
    const candidates = buildCandidates(fixture)
    const baseline = candidates.find(
      (candidate) => candidate.id === "235-control-baseline"
    )!
    const relief = candidates.find(
      (candidate) => candidate.id === "235-relief-c900"
    )!

    expect(fixture.controlActions.map((row) => row.action_id)).toContain(
      "NW-A0017"
    )
    expect(fixture.sourceCounts.trips).toBe(6900)
    expect(fixture.sourceHash).toMatch(/^[a-f0-9]{64}$/)
    expect(baseline.status).toBe("infeasible")
    expect(
      baseline.conflicts.some(
        (conflict) => conflict.code === "VEHICLE_TURNAROUND_CONFLICT"
      )
    ).toBe(true)
    expect(relief.status).toBe("feasible")
    expect(relief.minSlackSeconds).toBe(0)
    expect(relief.evidence).toContainEqual({
      table: "vehicle_readiness",
      recordId: String(
        fixture.vehicleReadiness.find((row) => row.vehicle_id === "NW-V001")!
          .readiness_id
      ),
    })
    expect(relief.assignments).toHaveLength(22)
    expect(
      relief.assignments
        .filter(
          (assignment) =>
            assignment.vehicleId === "NW-V001" &&
            assignment.departureAt <= "2026-10-07T09:00:00+08:00"
        )
        .every((assignment) => assignment.crewId === "NW-C900")
    ).toBe(true)
    expect(relief.metrics.positiveDepartureDelaySeconds).toBeNull()
    expect(
      relief.warnings.some(
        (warning) => warning.code === "RETROSPECTIVE_NO_CAUSAL_BENEFIT"
      )
    ).toBe(true)
  })

  it("withholds the 05:50 control action and later actuals in a pre-decision view", async () => {
    const fixture = await loadScenario(
      "service-235-recovery",
      "2026-10-14",
      "prospective"
    )
    const candidates = buildCandidates(fixture)
    const baseline = candidates.find(
      (candidate) => candidate.id === "235-control-baseline"
    )!
    const relief = candidates.find(
      (candidate) => candidate.id === "235-relief-c900"
    )!

    expect(fixture.scenario.sourceCutoffAt).toBe("2026-10-14T05:49:59+08:00")
    expect(
      fixture.controlActions.some((row) => row.action_id === "NW-A0058")
    ).toBe(false)
    expect(
      fixture.trips.every((trip) => !("actual_departure_at" in trip))
    ).toBe(true)
    expect(baseline.status).toBe("infeasible")
    expect(
      baseline.conflicts.some(
        (conflict) => conflict.code === "CREW_OUTSIDE_DUTY_WINDOW"
      )
    ).toBe(true)
    expect(baseline.label).toContain("before")
    expect(relief.status).toBe("feasible")
  })

  it("keeps a held vehicle conditional when its estimate has passed without release", async () => {
    const fixture = await loadScenario(
      "service-235-recovery",
      "2026-10-07",
      "retrospective"
    )
    fixture.vehicleReadiness.find(
      (row) => row.vehicle_id === "NW-V001"
    )!.release_state = "held"
    fixture.workshopVehicles = [{ vehicle_id: "NW-V001" }]
    fixture.workshopWorkOrders = [
      {
        work_order_id: "NW-WO-TEST",
        vehicle_id: "NW-V001",
        release_status: "held",
        expected_completion_at: "2026-10-06T12:00:00+08:00",
        confirmed_release_at: null,
      },
    ]

    const relief = buildCandidates(fixture).find(
      (candidate) => candidate.id === "235-relief-c900"
    )!
    expect(relief.status).toBe("conditional")
    expect(
      relief.conflicts.some(
        (conflict) =>
          conflict.code === "HELD_VEHICLE_NO_RELEASE" && conflict.conditional
      )
    ).toBe(true)
    expect(
      relief.warnings.some((warning) => warning.severity === "conditional")
    ).toBe(true)
  })

  it("replays 238 origin arrivals FIFO per date and keeps prospective demand unevaluated", async () => {
    const retrospective = await loadScenario(
      "service-238-timetable",
      "2026-10-07",
      "retrospective"
    )
    const [published, earlier, later] = buildCandidates(retrospective)
    const suppliedOriginCalls = retrospective.stopCalls.filter(
      (row) => Number(row.stop_order) === 1
    )
    expect(suppliedOriginCalls.length).toBeGreaterThan(0)
    expect(
      published?.warnings.some(
        (warning) => warning.code === "FIFO_BASELINE_RECONCILIATION_FAILED"
      )
    ).toBe(false)
    expect(published?.metrics.originBoardings).toBe(
      suppliedOriginCalls.reduce(
        (sum, call) => sum + Number(call.boarded_people),
        0
      )
    )
    expect(earlier?.metrics.originWaitingPersonSeconds).not.toBeNull()
    expect(later?.metrics.originWaitingPersonSeconds).not.toBeNull()
    expect(earlier?.metrics.originWaitingPersonSeconds).toBeLessThan(
      published!.metrics.originWaitingPersonSeconds!
    )
    expect(published?.assignments).toHaveLength(retrospective.trips.length)
    expect(
      earlier?.assignments.find((assignment) =>
        assignment.tripId.endsWith("0178")
      )?.departureAt
    ).toBe("2026-10-06T23:25:12.000Z")

    const prospective = await loadScenario(
      "service-238-timetable",
      "2026-10-07",
      "prospective"
    )
    const prospectiveCandidates = buildCandidates(prospective)
    expect(prospective.admittedThrough).toBe("2026-10-06T23:20:00.000Z")
    expect(
      prospective.trips.every((trip) => !("actual_departure_at" in trip))
    ).toBe(true)
    expect(
      prospective.stopCalls.every(
        (call) =>
          Date.parse(String(call.actual_departure_at)) <=
          Date.parse(prospective.scenario.sourceCutoffAt)
      )
    ).toBe(true)
    expect(
      prospective.originArrivals.every(
        (arrival) =>
          Date.parse(String(arrival.arrived_at)) <=
          Date.parse(prospective.scenario.sourceCutoffAt)
      )
    ).toBe(true)
    expect(
      prospectiveCandidates.every(
        (candidate) => candidate.metrics.originWaitingPersonSeconds === null
      )
    ).toBe(true)
    expect(
      prospectiveCandidates.every((candidate) =>
        candidate.warnings.some(
          (warning) => warning.code === "PROSPECTIVE_DEMAND_UNAVAILABLE"
        )
      )
    ).toBe(true)
  })
})
