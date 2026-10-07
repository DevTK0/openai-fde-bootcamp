/** Contracts shared by the deterministic planner, fixture adapter, and API. */

export type PlanningMode = "prospective" | "retrospective"

export type ScenarioKind = "service-235-recovery" | "service-238-timetable"

export type ScenarioDescriptor = {
  id: ScenarioKind
  title: string
  service: "235" | "238"
  date: string
  mode: PlanningMode
  decisionAt: string
  sourceCutoffAt: string
  routeIds: string[]
  description: string
}

export type SourceReference = {
  table: string
  recordId: string
}

export type PlanningWarning = {
  code: string
  message: string
  severity: "info" | "warning" | "conditional"
  evidence: SourceReference[]
}

export type PlanningConflict = {
  code: string
  message: string
  conditional?: boolean
  evidence: SourceReference[]
  resourceId?: string
  tripIds?: string[]
}

export type TripAssignment = {
  tripId: string
  vehicleId: string
  crewId: string
  departureAt: string
  arrivalAt: string
  routeId: string
  serviceNo: string
  originStopId?: string
  destinationStopId?: string
  protected: boolean
}

export type PlanningMetrics = {
  trips: number
  protectedTrips: number
  lateDeparturesOverFiveMinutes: number | null
  positiveDepartureDelaySeconds: number | null
  originBoardings: number | null
  originWaitingPersonSeconds: number | null
}

export type CandidateStatus =
  "feasible" | "conditional" | "infeasible" | "unevaluated"

export type PlanningCandidate = {
  id: string
  scenarioId: ScenarioKind
  mode: PlanningMode
  label: string
  summary: string
  status: CandidateStatus
  assignments: TripAssignment[]
  conflicts: PlanningConflict[]
  warnings: PlanningWarning[]
  minSlackSeconds: number | null
  metrics: PlanningMetrics
  assumptions: string[]
  evidence: SourceReference[]
}

/** Records needed to decide using fixture data admitted at the scenario cutoff. */
export type PlanningFixture = {
  scenario: ScenarioDescriptor
  trips: Record<string, unknown>[]
  relatedTrips: Record<string, unknown>[]
  controlActions: Record<string, unknown>[]
  resourceUpdates: Record<string, unknown>[]
  crewDuties: Record<string, unknown>[]
  vehicleReadiness: Record<string, unknown>[]
  terminalMovements: Record<string, unknown>[]
  servicePatterns: Record<string, unknown>[]
  routeStops: Record<string, unknown>[]
  routes: Record<string, unknown>[]
  stops: Record<string, unknown>[]
  stopCalls: Record<string, unknown>[]
  originArrivals: Record<string, unknown>[]
  planningConstraints: Record<string, unknown>[]
  workshopVehicles: Record<string, unknown>[]
  workshopWorkOrders: Record<string, unknown>[]
  sourceCounts: Record<string, number>
  sourceHash: string
  admittedThrough: string
  warnings: PlanningWarning[]
}
