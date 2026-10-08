import type {
  PlanningCandidate,
  PlanningMode,
  PlanningWarning,
  ScenarioDescriptor,
  ScenarioKind,
  SourceReference,
} from "@/lib/planning/contracts"

/** Bounded fixture projection safe to return to the planner client. */
export type PlanningFixtureDTO = {
  scenario: ScenarioDescriptor
  sourceHash: string
  admittedThrough: string
  sourceCounts: Record<string, number>
  trips: Record<string, unknown>[]
  relatedTrips: Record<string, unknown>[]
  controlActions: Record<string, unknown>[]
  resourceUpdates: Record<string, unknown>[]
  crewDuties: Record<string, unknown>[]
  vehicleReadiness: Record<string, unknown>[]
  terminalMovements: Record<string, unknown>[]
  planningConstraints: Record<string, unknown>[]
  warnings: PlanningWarning[]
}

export type ScenarioResponse = {
  scenarios: ScenarioDescriptor[]
  fixture: PlanningFixtureDTO
  candidates: PlanningCandidate[]
}

export type ScenarioQuery = {
  scenario: ScenarioKind
  date: string
  mode: PlanningMode
}

export type AssistantRequest = {
  scenarioId: ScenarioKind
  date: string
  mode: PlanningMode
  question: string
  candidateId?: string
}

export type AssistantResponse = {
  answer: string
  model?: string
  evidence: SourceReference[]
  toolCalls: string[]
  available: boolean
  error?: string
}

export type ProposalStatus = "draft" | "approved" | "rejected"

export type ProposalRecord = {
  id: string
  scenarioId: ScenarioKind
  date: string
  mode: PlanningMode
  candidateId: string
  sourceHash: string
  version: number
  status: ProposalStatus
  reason: string | null
  candidate: PlanningCandidate
  createdAt: string
  updatedAt: string
}

export type ProposalSaveRequest = {
  scenarioId: ScenarioKind
  date: string
  mode: PlanningMode
  candidateId: string
  sourceHash: string
  idempotencyKey: string
}

export type ProposalReviewRequest = {
  proposalId: string
  expectedVersion: number
  decision: "approve" | "reject"
  reason?: string
  idempotencyKey: string
}

export type ProposalListResponse = { proposals: ProposalRecord[] }
export type ProposalSaveResponse = { proposal: ProposalRecord }
export type ProposalReviewResponse = { proposal: ProposalRecord }
