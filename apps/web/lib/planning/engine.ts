import type {
  PlanningCandidate,
  PlanningConflict,
  PlanningFixture,
  PlanningMetrics,
  PlanningWarning,
  SourceReference,
  TripAssignment,
} from "./contracts"

type Row = Record<string, unknown>
const readString = (row: Row, key: string) =>
  typeof row[key] === "string" ? (row[key] as string) : ""
const readNumber = (row: Row, key: string) =>
  typeof row[key] === "number" ? (row[key] as number) : 0
const seconds = (later: string, earlier: string) =>
  (Date.parse(later) - Date.parse(earlier)) / 1000
const ref = (table: string, recordId: string): SourceReference => ({
  table,
  recordId,
})
const parseOffset = (stamp: string, offsetSeconds: number) =>
  new Date(Date.parse(stamp) + offsetSeconds * 1000).toISOString()

function tripAssignment(
  row: Row,
  useActualTimes: boolean,
  overrides?: { vehicleId?: string; crewId?: string; offsetSeconds?: number }
): TripAssignment {
  const scheduledDeparture = readString(row, "scheduled_departure_at")
  const actualDeparture = readString(row, "actual_departure_at")
  const scheduledArrival = readString(row, "scheduled_arrival_at")
  const actualArrival = readString(row, "actual_arrival_at")
  const departure =
    useActualTimes && actualDeparture ? actualDeparture : scheduledDeparture
  const arrival =
    useActualTimes && actualArrival ? actualArrival : scheduledArrival
  const offset = overrides?.offsetSeconds ?? 0
  return {
    tripId: readString(row, "trip_id"),
    vehicleId: overrides?.vehicleId ?? readString(row, "planned_vehicle_id"),
    crewId: overrides?.crewId ?? readString(row, "planned_crew_id"),
    departureAt: offset ? parseOffset(departure, offset) : departure,
    arrivalAt: offset ? parseOffset(arrival, offset) : arrival,
    routeId: readString(row, "route_id"),
    serviceNo: readString(row, "service_no"),
    originStopId: readString(row, "origin_stop_id") || undefined,
    destinationStopId: readString(row, "destination_stop_id") || undefined,
    protected: true,
  }
}

function sourceAssignments(
  fixture: PlanningFixture,
  candidateAssignments: TripAssignment[]
) {
  const overridden = new Map<string, { vehicleId?: string; crewId?: string }>()
  for (const row of fixture.controlActions) {
    const tripId = readString(row, "trip_id")
    if (!tripId) continue
    overridden.set(tripId, {
      vehicleId: readString(row, "vehicle_id") || undefined,
      crewId: readString(row, "crew_id") || undefined,
    })
  }
  const selected = new Set(
    candidateAssignments.map((assignment) => assignment.tripId)
  )
  const external = fixture.relatedTrips.map((row) => {
    const override = overridden.get(readString(row, "trip_id"))
    const scheduled = tripAssignment(row, false, override)
    // Retrospective outcomes are useful for replay metrics, but future actual assignments
    // are not commitments at the decision cutoff. External commitments stay timetable based.
    return scheduled
  })
  return [
    ...candidateAssignments,
    ...external.filter((item) => !selected.has(item.tripId)),
  ]
}

export function validateResources(
  fixture: PlanningFixture,
  candidateAssignments: TripAssignment[]
): { conflicts: PlanningConflict[]; minSlackSeconds: number | null } {
  const assignments = sourceAssignments(fixture, candidateAssignments)
  const conflicts: PlanningConflict[] = []
  const vehicleIds = new Set(candidateAssignments.map((item) => item.vehicleId))
  const crewIds = new Set(candidateAssignments.map((item) => item.crewId))
  const readiness = new Map(
    fixture.vehicleReadiness.map((row) => [readString(row, "vehicle_id"), row])
  )
  const duties = new Map(
    fixture.crewDuties.map((row) => [readString(row, "crew_id"), row])
  )
  const minimumGapSeconds = 45 + 420
  let minSlackSeconds: number | null = null

  for (const assignment of candidateAssignments) {
    const vehicle = readiness.get(assignment.vehicleId)
    if (!vehicle || readString(vehicle, "release_state") !== "released") {
      const workshopVehicle = fixture.workshopVehicles.find(
        (row) => readString(row, "vehicle_id") === assignment.vehicleId
      )
      const workOrder = fixture.workshopWorkOrders.find(
        (row) => readString(row, "vehicle_id") === assignment.vehicleId
      )
      const workshopEvidence = [
        ...(workshopVehicle
          ? [ref("workshop_vehicles", assignment.vehicleId)]
          : []),
        ...(workOrder
          ? [
              ref(
                "workshop_work_orders",
                readString(workOrder, "work_order_id")
              ),
            ]
          : []),
      ]
      conflicts.push({
        code: workshopVehicle
          ? "HELD_VEHICLE_NO_RELEASE"
          : "VEHICLE_RELEASE_UNCONFIRMED",
        message: workshopVehicle
          ? `${assignment.vehicleId} is in the held workshop cohort and has no confirmed release; this candidate is conditional and cannot be approved.`
          : `${assignment.vehicleId} has no confirmed released readiness record; availability is unverified.`,
        conditional: true,
        resourceId: assignment.vehicleId,
        tripIds: [assignment.tripId],
        evidence: [
          ...(vehicle
            ? [ref("vehicle_readiness", readString(vehicle, "readiness_id"))]
            : []),
          ...workshopEvidence,
        ],
      })
    } else if (
      Date.parse(assignment.departureAt) <
        Date.parse(readString(vehicle, "available_from")) ||
      Date.parse(assignment.arrivalAt) >
        Date.parse(readString(vehicle, "available_until"))
    ) {
      conflicts.push({
        code: "VEHICLE_OUTSIDE_READINESS_WINDOW",
        message: `${assignment.vehicleId} is outside its released availability window for ${assignment.tripId}.`,
        resourceId: assignment.vehicleId,
        tripIds: [assignment.tripId],
        evidence: [
          ref("vehicle_readiness", readString(vehicle, "readiness_id")),
        ],
      })
    }
    if (
      vehicle &&
      assignment.originStopId &&
      !readString(vehicle, "location_stop_id")
    ) {
      conflicts.push({
        code: "VEHICLE_LOCATION_UNVERIFIED",
        message: `${assignment.vehicleId} has no supplied current location for ${assignment.tripId}.`,
        conditional: true,
        resourceId: assignment.vehicleId,
        tripIds: [assignment.tripId],
        evidence: [
          ref("vehicle_readiness", readString(vehicle, "readiness_id")),
        ],
      })
    } else if (
      vehicle &&
      assignment.originStopId &&
      readString(vehicle, "location_stop_id") !== assignment.originStopId
    ) {
      conflicts.push({
        code: "VEHICLE_LOCATION_MISMATCH",
        message: `${assignment.vehicleId} is listed at ${readString(vehicle, "location_stop_id")}, not the origin ${assignment.originStopId} for ${assignment.tripId}.`,
        resourceId: assignment.vehicleId,
        tripIds: [assignment.tripId],
        evidence: [
          ref("vehicle_readiness", readString(vehicle, "readiness_id")),
          ref("trips", assignment.tripId),
        ],
      })
    }
    const duty = duties.get(assignment.crewId)
    if (!duty) {
      conflicts.push({
        code: "CREW_DUTY_MISSING",
        message: `${assignment.crewId} has no supplied duty for ${fixture.scenario.date}; availability is unverified.`,
        conditional: true,
        resourceId: assignment.crewId,
        tripIds: [assignment.tripId],
        evidence: [],
      })
    } else if (
      readString(duty, "qualified_service_no") !== assignment.serviceNo
    ) {
      conflicts.push({
        code: "CREW_NOT_QUALIFIED",
        message: `${assignment.crewId} is not listed as qualified for Service ${assignment.serviceNo}.`,
        resourceId: assignment.crewId,
        tripIds: [assignment.tripId],
        evidence: [ref("crew_duties", readString(duty, "duty_id"))],
      })
    }
    if (duty && assignment.originStopId && !readString(duty, "start_stop_id")) {
      conflicts.push({
        code: "CREW_START_LOCATION_UNVERIFIED",
        message: `${assignment.crewId} has no supplied start location for ${assignment.tripId}.`,
        conditional: true,
        resourceId: assignment.crewId,
        tripIds: [assignment.tripId],
        evidence: [ref("crew_duties", readString(duty, "duty_id"))],
      })
    } else if (
      duty &&
      assignment.originStopId &&
      readString(duty, "start_stop_id") !== assignment.originStopId
    ) {
      conflicts.push({
        code: "CREW_START_LOCATION_MISMATCH",
        message: `${assignment.crewId} is listed to start at ${readString(duty, "start_stop_id")}, not the origin ${assignment.originStopId} for ${assignment.tripId}.`,
        resourceId: assignment.crewId,
        tripIds: [assignment.tripId],
        evidence: [
          ref("crew_duties", readString(duty, "duty_id")),
          ref("trips", assignment.tripId),
        ],
      })
    }
  }

  const tasksFor = (resource: string, field: "vehicleId" | "crewId") =>
    assignments
      .filter((item) => item[field] === resource)
      .sort((a, b) => Date.parse(a.departureAt) - Date.parse(b.departureAt))

  for (const vehicleId of vehicleIds) {
    const tasks = tasksFor(vehicleId, "vehicleId")
    for (let index = 1; index < tasks.length; index++) {
      const previous = tasks[index - 1]!
      const next = tasks[index]!
      let requiredGap = minimumGapSeconds
      const differentTerminals =
        previous.destinationStopId &&
        next.originStopId &&
        previous.destinationStopId !== next.originStopId
      const movement = differentTerminals
        ? fixture.terminalMovements.find(
            (row) =>
              readString(row, "vehicle_id") === vehicleId &&
              readString(row, "from_trip_id") === previous.tripId &&
              readString(row, "to_trip_id") === next.tripId
          )
        : undefined
      if (differentTerminals && !movement) {
        conflicts.push({
          code: "TERMINAL_MOVEMENT_UNVERIFIED",
          message: `${vehicleId} must move from ${previous.destinationStopId} to ${next.originStopId}, but no listed movement confirms that connection.`,
          conditional: true,
          resourceId: vehicleId,
          tripIds: [previous.tripId, next.tripId],
          evidence: [ref("trips", previous.tripId), ref("trips", next.tripId)],
        })
      } else if (movement) {
        requiredGap += readNumber(movement, "planning_seconds") + 120
      }
      const slack = seconds(next.departureAt, previous.arrivalAt) - requiredGap
      minSlackSeconds =
        minSlackSeconds === null ? slack : Math.min(minSlackSeconds, slack)
      if (slack < 0) {
        conflicts.push({
          code: "VEHICLE_TURNAROUND_CONFLICT",
          message: `${vehicleId} cannot complete ${previous.tripId}, alight, turn around, and depart ${next.tripId} on time (${Math.ceil(-slack)} seconds short).`,
          resourceId: vehicleId,
          tripIds: [previous.tripId, next.tripId],
          evidence: [ref("trips", previous.tripId), ref("trips", next.tripId)],
        })
      }
    }
  }

  for (const crewId of crewIds) {
    const tasks = tasksFor(crewId, "crewId")
    const duty = duties.get(crewId)
    if (!duty || !tasks.length) continue
    const dutyStart = Date.parse(readString(duty, "available_from"))
    const dutyEnd = Date.parse(readString(duty, "available_until"))
    const breakStart = Date.parse(readString(duty, "protected_break_start"))
    const breakEnd = Date.parse(readString(duty, "protected_break_end"))
    const first = tasks[0]!
    const takeover = readNumber(duty, "takeover_seconds")
    const firstTaskStart = Date.parse(first.departureAt) - takeover * 1000
    const final = tasks[tasks.length - 1]!
    const finalTaskEnd = Date.parse(final.arrivalAt) + 45_000
    if (firstTaskStart < dutyStart || finalTaskEnd > dutyEnd) {
      conflicts.push({
        code: "CREW_OUTSIDE_DUTY_WINDOW",
        message: `${crewId} cannot cover the listed duty window for this assignment set.`,
        resourceId: crewId,
        tripIds: tasks.map((item) => item.tripId),
        evidence: [ref("crew_duties", readString(duty, "duty_id"))],
      })
    }
    const breakOverlapsTask = tasks.some((task, index) => {
      const taskStart =
        Date.parse(task.departureAt) - (index === 0 ? takeover * 1000 : 0)
      const taskEnd = Date.parse(task.arrivalAt) + 45_000
      return taskStart < breakEnd && taskEnd > breakStart
    })
    if (breakOverlapsTask) {
      conflicts.push({
        code: "CREW_PROTECTED_BREAK_CONFLICT",
        message: `${crewId} has a protected break overlapping assigned service tasks.`,
        resourceId: crewId,
        tripIds: tasks.map((item) => item.tripId),
        evidence: [ref("crew_duties", readString(duty, "duty_id"))],
      })
    }
    const maxMinutes = readNumber(duty, "maximum_continuous_duty_minutes")
    const continuousSpans = [
      tasks.filter((task) => Date.parse(task.arrivalAt) + 45_000 <= breakStart),
      tasks.filter((task) => Date.parse(task.departureAt) >= breakEnd),
    ].filter((span) => span.length)
    if (
      continuousSpans.some((span) => {
        const firstInSpan = span[0]!
        const lastInSpan = span[span.length - 1]!
        const firstIndex = tasks.indexOf(firstInSpan)
        const spanStart =
          Date.parse(firstInSpan.departureAt) -
          (firstIndex === 0 ? takeover * 1000 : 0)
        const spanEnd = Date.parse(lastInSpan.arrivalAt) + 45_000
        return spanEnd - spanStart > maxMinutes * 60_000
      })
    ) {
      conflicts.push({
        code: "CREW_CONTINUOUS_DUTY_LIMIT",
        message: `${crewId} exceeds the listed ${maxMinutes}-minute continuous-duty span.`,
        resourceId: crewId,
        tripIds: tasks.map((item) => item.tripId),
        evidence: [ref("crew_duties", readString(duty, "duty_id"))],
      })
    }
    for (let index = 1; index < tasks.length; index++) {
      const previous = tasks[index - 1]!
      const next = tasks[index]!
      if (Date.parse(previous.arrivalAt) > Date.parse(next.departureAt)) {
        conflicts.push({
          code: "CREW_TASK_OVERLAP",
          message: `${crewId} is assigned to overlapping trips ${previous.tripId} and ${next.tripId}.`,
          resourceId: crewId,
          tripIds: [previous.tripId, next.tripId],
          evidence: [ref("trips", previous.tripId), ref("trips", next.tripId)],
        })
      }
    }
  }

  return { conflicts, minSlackSeconds }
}

function emptyMetrics(trips: number): PlanningMetrics {
  return {
    trips,
    protectedTrips: trips,
    lateDeparturesOverFiveMinutes: null,
    positiveDepartureDelaySeconds: null,
    originBoardings: null,
    originWaitingPersonSeconds: null,
  }
}

function candidateStatus(conflicts: PlanningConflict[]) {
  if (!conflicts.length) return "feasible" as const
  return conflicts.every((conflict) => conflict.conditional)
    ? ("conditional" as const)
    : ("infeasible" as const)
}

function validationWarnings(
  conflicts: PlanningConflict[],
  minSlackSeconds: number | null
): PlanningWarning[] {
  const warnings: PlanningWarning[] = conflicts
    .filter((conflict) => conflict.conditional)
    .map((conflict) => ({
      code: conflict.code,
      message: conflict.message,
      severity: "conditional" as const,
      evidence: conflict.evidence,
    }))
  if (minSlackSeconds !== null && minSlackSeconds <= 120) {
    warnings.push({
      code: "NARROW_TURNAROUND_SLACK",
      message: `The tightest listed vehicle turnaround margin is ${Math.ceil(minSlackSeconds)} seconds.`,
      severity: "warning",
      evidence: [],
    })
  }
  return warnings
}

function validateCoverage(
  fixture: PlanningFixture,
  assignments: TripAssignment[],
  offsetMinutes = 0,
  targetTripId?: string
) {
  const conflicts: PlanningConflict[] = []
  if (
    assignments.length !== fixture.trips.length ||
    assignments.some((item) => !item.protected)
  ) {
    conflicts.push({
      code: "PROTECTED_TRIP_COVERAGE",
      message:
        "Every supplied trip must remain assigned and protected in the candidate.",
      evidence: fixture.trips.map((row) =>
        ref("trips", readString(row, "trip_id"))
      ),
    })
  }
  const routeCounts = new Map<string, number>()
  for (const row of fixture.routeStops) {
    const routeId = readString(row, "route_id")
    routeCounts.set(routeId, (routeCounts.get(routeId) ?? 0) + 1)
  }
  for (const route of fixture.routes) {
    const routeId = readString(route, "route_id")
    if (routeCounts.get(routeId) !== readNumber(route, "stop_count")) {
      conflicts.push({
        code: "ROUTE_SEQUENCE_INCOMPLETE",
        message: `The full published route-stop sequence for ${routeId} is not present.`,
        evidence: [
          ref("routes", routeId),
          ...fixture.routeStops
            .filter((row) => readString(row, "route_id") === routeId)
            .map((row) =>
              ref("route_stops", `${routeId}:${String(row.stop_order)}`)
            ),
        ],
      })
    }
  }
  if (fixture.scenario.mode === "retrospective") {
    const callsByTrip = new Map<string, number>()
    for (const call of fixture.stopCalls) {
      const tripId = readString(call, "trip_id")
      callsByTrip.set(tripId, (callsByTrip.get(tripId) ?? 0) + 1)
    }
    for (const trip of fixture.trips) {
      const routeId = readString(trip, "route_id")
      const count = routeCounts.get(routeId) ?? 0
      if ((callsByTrip.get(readString(trip, "trip_id")) ?? 0) !== count) {
        conflicts.push({
          code: "TRIP_ROUTE_CALLS_INCOMPLETE",
          message: `The supplied retrospective calls do not cover every stop occurrence for ${readString(trip, "trip_id")}.`,
          tripIds: [readString(trip, "trip_id")],
          evidence: [
            ref("trips", readString(trip, "trip_id")),
            ref("routes", routeId),
          ],
        })
      }
    }
  }
  if (fixture.scenario.id === "service-238-timetable") {
    const scheduled = fixture.trips
      .map((row) => ({
        id: readString(row, "trip_id"),
        routeId: readString(row, "route_id"),
        departure:
          Date.parse(readString(row, "scheduled_departure_at")) +
          (readString(row, "trip_id") === targetTripId
            ? offsetMinutes * 60_000
            : 0),
      }))
      .sort((a, b) => a.departure - b.departure)
    const firstOriginal = Math.min(
      ...fixture.trips.map((row) =>
        Date.parse(readString(row, "scheduled_departure_at"))
      )
    )
    if (scheduled[0]?.departure !== firstOriginal) {
      conflicts.push({
        code: "FIRST_DEPARTURE_CHANGED",
        message:
          "The first departure for the route direction must remain fixed.",
        evidence: [ref("planning_constraints", "NW-PC01")],
      })
    }
    if (Math.abs(offsetMinutes) > 10) {
      conflicts.push({
        code: "TIMETABLE_OFFSET_LIMIT",
        message:
          "The supplied planning rule limits timetable offsets to ten minutes.",
        evidence: [ref("planning_constraints", "NW-PC01")],
      })
    }
    for (let index = 1; index < scheduled.length; index++) {
      const gap =
        (scheduled[index]!.departure - scheduled[index - 1]!.departure) / 1000
      if (gap > 30 * 60) {
        conflicts.push({
          code: "ORIGIN_GAP_LIMIT",
          message: `The proposed origin gap for ${scheduled[index]!.routeId} exceeds thirty minutes.`,
          tripIds: [scheduled[index - 1]!.id, scheduled[index]!.id],
          evidence: [ref("planning_constraints", "NW-PC01")],
        })
      }
    }
  }
  return conflicts
}

function recoveryCandidates(fixture: PlanningFixture): PlanningCandidate[] {
  const actual = fixture.scenario.mode === "retrospective"
  const actionByTrip = new Map(
    fixture.controlActions.map((row) => [readString(row, "trip_id"), row])
  )
  const baseline = fixture.trips.map((row) => {
    const action = actionByTrip.get(readString(row, "trip_id"))
    return tripAssignment(
      row,
      false,
      action
        ? {
            vehicleId: readString(action, "vehicle_id"),
            crewId: readString(action, "crew_id"),
          }
        : undefined
    )
  })
  const baselineUsesControlAction = fixture.controlActions.some((row) =>
    fixture.trips.some(
      (trip) => readString(trip, "trip_id") === readString(row, "trip_id")
    )
  )
  const relief = fixture.trips.map((row) => {
    const plannedDeparture = readString(row, "scheduled_departure_at")
    const isV001ReliefPeriod =
      readString(row, "planned_vehicle_id") === "NW-V001" &&
      plannedDeparture <= `${fixture.scenario.date}T09:00:00+08:00`
    return tripAssignment(
      row,
      false,
      isV001ReliefPeriod ? { crewId: "NW-C900" } : undefined
    )
  })
  const candidates: PlanningCandidate[] = []
  for (const entry of [
    {
      id: "235-control-baseline",
      label: baselineUsesControlAction
        ? "Recorded 05:50 control instruction"
        : "Published assignment before the 05:50 instruction",
      summary: baselineUsesControlAction
        ? "Use the vehicle and driver stated in the issued control action, then retain the published later assignments."
        : "Evaluate the published first-trip assignment using only resources known before the 05:50 instruction.",
      assignments: baseline,
      assumptions: [
        "Timetable times and published trips are held fixed for the feasibility check.",
      ],
      evidence: fixture.controlActions.map((row) =>
        ref("control_actions", readString(row, "action_id"))
      ),
    },
    {
      id: "235-relief-c900",
      label: "Listed relief driver on NW-V001 through 09:00",
      summary:
        "Keep the 06:00–09:00 NW-V001 trips and published departures; assign checked-in qualified relief driver NW-C900.",
      assignments: relief,
      assumptions: [
        "The listed relief driver reports at 05:45 and is assigned after a five-minute takeover before the 06:00 trip.",
        "Published trip times and the full route remain unchanged; no passenger or delay benefit is projected.",
      ],
      evidence: [
        ...fixture.resourceUpdates
          .filter((row) => readString(row, "resource_id") === "NW-C900")
          .map((row) => ref("resource_updates", readString(row, "update_id"))),
        ...fixture.crewDuties
          .filter((row) => readString(row, "crew_id") === "NW-C900")
          .map((row) => ref("crew_duties", readString(row, "duty_id"))),
      ],
    },
  ]) {
    const validation = validateResources(fixture, entry.assignments)
    const conflicts = [
      ...validateCoverage(fixture, entry.assignments),
      ...validation.conflicts,
    ]
    const outcome =
      actual && entry.id === "235-control-baseline"
        ? recoveryOutcome(fixture)
        : null
    candidates.push({
      id: entry.id,
      scenarioId: fixture.scenario.id,
      mode: fixture.scenario.mode,
      label: entry.label,
      summary: entry.summary,
      status: candidateStatus(conflicts),
      assignments: entry.assignments,
      conflicts,
      warnings: [
        ...fixture.warnings,
        ...validationWarnings(conflicts, validation.minSlackSeconds),
      ],
      minSlackSeconds: validation.minSlackSeconds,
      metrics: outcome ?? emptyMetrics(entry.assignments.length),
      assumptions: entry.assumptions,
      evidence: entry.evidence,
    })
  }
  if (actual) {
    const candidate = candidates.find((item) => item.id === "235-relief-c900")!
    candidate.warnings.push({
      code: "RETROSPECTIVE_NO_CAUSAL_BENEFIT",
      message:
        "The supplied outcomes do not establish how this alternate crew assignment would have changed delays or passenger waiting.",
      severity: "warning",
      evidence: [],
    })
  }
  return candidates
}

function recoveryOutcome(fixture: PlanningFixture): PlanningMetrics {
  const observed = fixture.trips.filter((row) =>
    readString(row, "actual_departure_at")
  )
  const delays = observed.map((row) =>
    seconds(
      readString(row, "actual_departure_at"),
      readString(row, "scheduled_departure_at")
    )
  )
  return {
    ...emptyMetrics(fixture.trips.length),
    lateDeparturesOverFiveMinutes: delays.filter((delay) => delay > 300).length,
    positiveDepartureDelaySeconds: delays
      .filter((delay) => delay > 0)
      .reduce((sum, delay) => sum + delay, 0),
  }
}

type Passenger = { arrivedAt: number; arrivalId: string }

function replayOrigin(
  fixture: PlanningFixture,
  offsetMinutes: number,
  targetTripId: string
) {
  const calls = fixture.stopCalls
    .filter((row) => Number(row.stop_order) === 1)
    .sort(
      (a, b) =>
        Date.parse(readString(a, "scheduled_arrival_at")) -
        Date.parse(readString(b, "scheduled_arrival_at"))
    )
  const arrivals = [...fixture.originArrivals].sort(
    (a, b) =>
      Date.parse(readString(a, "arrived_at")) -
      Date.parse(readString(b, "arrived_at"))
  )
  const tripById = new Map(
    fixture.trips.map((row) => [readString(row, "trip_id"), row])
  )
  const queue: Passenger[] = []
  let arrivalIndex = 0
  let totalBoarded = 0
  let waitingSeconds = 0
  const byCall = new Map(
    calls.map((call) => [readString(call, "trip_id"), call])
  )
  const baselineMismatch: string[] = []
  for (const call of calls) {
    const trip = tripById.get(readString(call, "trip_id"))
    if (!trip) continue
    const scheduled = Date.parse(readString(trip, "scheduled_departure_at"))
    const observed = Date.parse(readString(trip, "actual_departure_at"))
    const observedDeviation =
      fixture.scenario.mode === "retrospective" && Number.isFinite(observed)
        ? observed - scheduled
        : 0
    const offset =
      readString(trip, "trip_id") === targetTripId ? offsetMinutes * 60_000 : 0
    const departure = scheduled + observedDeviation + offset
    const doorsOpen = departure - 120_000
    const cutoff = departure - 5_000
    while (
      arrivalIndex < arrivals.length &&
      Date.parse(readString(arrivals[arrivalIndex]!, "arrived_at")) <= cutoff
    ) {
      const row = arrivals[arrivalIndex++]!
      const timestamp = Date.parse(readString(row, "arrived_at"))
      const count = Math.max(0, Math.floor(readNumber(row, "arrivals_people")))
      for (let i = 0; i < count; i++)
        queue.push({
          arrivedAt: timestamp,
          arrivalId: readString(row, "arrival_record_id"),
        })
    }
    const queuedBefore = queue.length
    const capacity = Math.max(
      0,
      Math.floor(readNumber(call, "capacity_people"))
    )
    let boarded = 0
    let nextBoardStart = doorsOpen
    while (boarded < capacity && queue.length) {
      const passenger = queue[0]!
      const start = Math.max(passenger.arrivedAt, nextBoardStart)
      // The source cutoff already reserves the five-second door-clearance period.
      if (start + 1_200 > cutoff) break
      queue.shift()
      waitingSeconds += (start - passenger.arrivedAt) / 1000
      nextBoardStart = start + 1_200
      boarded++
    }
    totalBoarded += boarded
    if (offsetMinutes === 0 && fixture.scenario.mode === "retrospective") {
      if (
        queuedBefore !== readNumber(call, "queue_before_people") ||
        boarded !== readNumber(call, "boarded_people") ||
        queue.length !== readNumber(call, "queue_after_people")
      ) {
        baselineMismatch.push(readString(call, "call_id"))
      }
    }
  }
  return { totalBoarded, waitingSeconds, baselineMismatch, calls, byCall }
}

function timetableCandidates(fixture: PlanningFixture): PlanningCandidate[] {
  const mode = fixture.scenario.mode
  const target = fixture.trips.find(
    (row) => readString(row, "scheduled_departure_at").slice(11, 16) === "07:30"
  )
  if (!target) return []
  const retrospective = mode === "retrospective"
  const targetId = readString(target, "trip_id")
  const baselineReplay = retrospective
    ? replayOrigin(fixture, 0, targetId)
    : undefined
  return [0, -5, 5].map((offsetMinutes) => {
    const assignments = fixture.trips.map((row) => {
      const override =
        row === target ? { offsetSeconds: offsetMinutes * 60 } : undefined
      const assignment = tripAssignment(row, retrospective, override)
      return assignment
    })
    const validation = validateResources(fixture, assignments)
    const coverageConflicts = validateCoverage(
      fixture,
      assignments,
      offsetMinutes,
      targetId
    )
    const conflicts = [...coverageConflicts, ...validation.conflicts]
    const replay = retrospective
      ? offsetMinutes === 0
        ? baselineReplay!
        : replayOrigin(fixture, offsetMinutes, targetId)
      : undefined
    const warnings = [...fixture.warnings]
    if (retrospective && baselineReplay!.baselineMismatch.length) {
      warnings.push({
        code: "FIFO_BASELINE_RECONCILIATION_FAILED",
        message: `The baseline FIFO replay did not reproduce ${baselineReplay!.baselineMismatch.length} supplied origin stop-call rows; all candidate waiting outcomes are withheld.`,
        severity: "warning",
        evidence: baselineReplay!.baselineMismatch
          .slice(0, 20)
          .map((id) => ref("stop_calls", id)),
      })
    }
    if (!retrospective) {
      warnings.push({
        code: "PROSPECTIVE_DEMAND_UNAVAILABLE",
        message:
          "The fixture has no forecast for arrivals after the 07:20 decision cutoff; candidate waiting metrics are not estimated.",
        severity: "warning",
        evidence: [],
      })
    }
    const metrics = emptyMetrics(assignments.length)
    if (
      retrospective &&
      baselineReplay!.baselineMismatch.length === 0 &&
      replay!.baselineMismatch.length === 0
    ) {
      metrics.originBoardings = replay!.totalBoarded
      metrics.originWaitingPersonSeconds = replay!.waitingSeconds
    }
    const offsetLabel =
      offsetMinutes === 0
        ? "Published 07:30 departure"
        : `07:30 departure ${offsetMinutes > 0 ? "+" : ""}${offsetMinutes} minutes`
    return {
      id: `238-${mode}-${offsetMinutes >= 0 ? "plus-" : "minus-"}${Math.abs(offsetMinutes)}`,
      scenarioId: fixture.scenario.id,
      mode,
      label: offsetLabel,
      summary:
        offsetMinutes === 0
          ? "Retain the supplied timetable for every listed trip."
          : `Move only ${targetId} by ${offsetMinutes} minutes; retain all other published departures and complete route calls.`,
      status: candidateStatus(conflicts),
      assignments,
      conflicts,
      warnings: [
        ...warnings,
        ...validationWarnings(conflicts, validation.minSlackSeconds),
      ],
      minSlackSeconds: validation.minSlackSeconds,
      metrics,
      assumptions: retrospective
        ? [
            "Retain each trip's observed departure deviation and running duration; shift the target trip by the selected offset.",
            "Replay FIFO origin arrivals with 120-second boarding window, 1.2 seconds per passenger, 5-second cutoff, and vehicle capacity.",
            "No passenger redistribution or changed downstream dwell is modeled.",
            "People left waiting after the last supplied departure have no modeled boarding time and are excluded from waiting person-seconds.",
          ]
        : [
            "Evaluate published schedule times and planned resource assignments only.",
            "The first route departure and every other trip remain fixed.",
            "No future demand or delay benefit is projected.",
          ],
      evidence: [
        ref("trips", targetId),
        ...fixture.servicePatterns.map((row) =>
          ref("service_patterns", readString(row, "route_id"))
        ),
        ...fixture.planningConstraints.map((row) =>
          ref("planning_constraints", readString(row, "constraint_id"))
        ),
      ],
    }
  })
}

export function buildCandidates(fixture: PlanningFixture): PlanningCandidate[] {
  const candidates =
    fixture.scenario.id === "service-235-recovery"
      ? recoveryCandidates(fixture)
      : timetableCandidates(fixture)
  return candidates.map((candidate) => {
    const vehicles = new Set(
      candidate.assignments.map((assignment) => assignment.vehicleId)
    )
    const crews = new Set(
      candidate.assignments.map((assignment) => assignment.crewId)
    )
    const references = [
      ...candidate.evidence,
      ...fixture.vehicleReadiness
        .filter((row) => vehicles.has(readString(row, "vehicle_id")))
        .map((row) =>
          ref("vehicle_readiness", readString(row, "readiness_id"))
        ),
      ...fixture.crewDuties
        .filter((row) => crews.has(readString(row, "crew_id")))
        .map((row) => ref("crew_duties", readString(row, "duty_id"))),
    ]
    return {
      ...candidate,
      evidence: [
        ...new Map(
          references.map((item) => [`${item.table}:${item.recordId}`, item])
        ).values(),
      ],
    }
  })
}
