import { z } from "zod"

export const serviceSchema = z
  .string()
  .trim()
  .regex(/^(?:[0-9]{1,3}[A-Z]{0,2}|network)$/)

export const interpretationSchema = z.strictObject({
  repairAreas: z
    .array(
      z.enum([
        "front_door",
        "centre_door",
        "doors",
        "wipers",
        "windshield",
        "mirrors",
        "front_lights",
        "rear_lights",
        "roof_ac",
        "cooling",
        "electrical",
        "air_system",
        "suspension",
        "brakes",
        "windows",
        "body",
      ])
    )
    .max(6),
  signalTypes: z
    .array(
      z.enum(["complaint", "fault", "delay", "crowding", "clearance", "other"])
    )
    .min(1)
    .max(6),
  service: serviceSchema.nullable(),
  vehicleId: z
    .string()
    .regex(/^NW-[VW]\d{3}$/)
    .nullable(),
  stopCode: z
    .string()
    .regex(/^\d{5}$/)
    .nullable(),
  delaySeconds: z.number().int().min(0).max(7200).nullable(),
  waitingPeople: z.number().int().min(0).max(2000).nullable(),
  summary: z.string().min(1).max(1000),
})
// Older stored assessments used a single repairArea; new model output uses a list.
export type ObservationInterpretation = Omit<
  z.infer<typeof interpretationSchema>,
  "repairAreas"
> & {
  repairAreas?: z.infer<typeof interpretationSchema>["repairAreas"]
  repairArea?: string | null
}

export const eventSchema = z
  .strictObject({
    kind: z.enum([
      "complaint",
      "fault",
      "delay",
      "crowding",
      "clearance",
      "analysis",
      "observation",
    ]),
    service: serviceSchema,
    serviceDate: z.iso.date(),
    title: z.string().trim().min(3).max(160),
    details: z.string().trim().max(4000).default(""),
    vehicleId: z
      .string()
      .regex(/^NW-[VW]\d{3}$/)
      .nullable()
      .default(null),
    stopCode: z
      .string()
      .regex(/^\d{5}$/)
      .nullable()
      .default(null),
    delaySeconds: z.number().int().min(0).max(7200).nullable().default(null),
    waitingPeople: z.number().int().min(0).max(2000).nullable().default(null),
    occurredAt: z.iso.datetime({ offset: true }),
    source: z
      .enum([
        "operator",
        "customer",
        "telemetry",
        "engineering",
        "demo",
        "database",
      ])
      .default("operator"),
  })
  .superRefine((event, ctx) => {
    if (["fault", "clearance"].includes(event.kind) && !event.vehicleId)
      ctx.addIssue({
        code: "custom",
        message: "A vehicle is required for fault and clearance records.",
        path: ["vehicleId"],
      })
    if (event.kind === "clearance" && event.source !== "engineering")
      ctx.addIssue({
        code: "custom",
        message: "Only an Engineering record can confirm clearance.",
        path: ["source"],
      })
    if (event.kind === "delay" && event.delaySeconds === null)
      ctx.addIssue({
        code: "custom",
        message: "Enter the observed delay.",
        path: ["delaySeconds"],
      })
    if (event.kind === "crowding" && event.waitingPeople === null)
      ctx.addIssue({
        code: "custom",
        message: "Enter the observed waiting count.",
        path: ["waitingPeople"],
      })
    if (
      new Date(event.occurredAt).toLocaleDateString("en-CA", {
        timeZone: "Asia/Singapore",
      }) !== event.serviceDate
    )
      ctx.addIssue({
        code: "custom",
        message: "Event time must be on the selected Singapore service date.",
        path: ["occurredAt"],
      })
  })
/** Human reports contain raw text; signal semantics are assigned by the model later. */
export const reportSchema = z
  .strictObject({
    details: z.string().trim().min(10).max(4000),
    service: serviceSchema.default("network"),
    serviceDate: z.iso.date(),
    occurredAt: z.iso.datetime({ offset: true }),
  })
  .transform((report): z.input<typeof eventSchema> => ({
    ...report,
    kind: "observation" as const,
    title: report.details.split("\n")[0]!.slice(0, 150),
    source: "operator" as const,
    vehicleId: null,
    stopCode: null,
    delaySeconds: null,
    waitingPeople: null,
  }))
  .pipe(eventSchema)
export type LiveEventInput = z.infer<typeof eventSchema>
export type LiveEvent = LiveEventInput & {
  seq: number
  id: string
  receivedAt: string
}
export type TraceStep = {
  phase:
    | "observe"
    | "detect"
    | "retrieve"
    | "evaluate"
    | "recommend"
    | "explain"
    | "agent"
    | "tool"
  title: string
  summary: string
  at: string
  outcome: "pass" | "warning" | "blocked" | "info"
  input?: unknown
  output?: unknown
}
export type Alternative = {
  id: string
  label: string
  status: string
  conflicts: string[]
  minSlackSeconds: number | null
}
export type Decision = {
  id: string
  eventSeq: number
  service: string
  serviceDate: string
  createdAt: string
  title: string
  summary: string
  priority: "urgent" | "attention" | "routine"
  status: "open" | "acknowledged" | "dismissed" | "superseded"
  action: string
  origin?: "agent" | "rules"
  agent?: {
    interpretation?: ObservationInterpretation
    confidence: "high" | "medium" | "low"
    insights: { title: string; finding: string; evidenceIds: string[] }[]
    recommendations: {
      title: string
      action: string
      rationale: string
      expectedEffect: string
      evidenceIds: string[]
      proposalId: string | null
    }[]
    evidence: { id: string; label: string }[]
    proposals: {
      id: string
      status: string
      assignments: {
        tripId: string
        vehicleId: string
        crewId: string
        routeId: string
        departureAt: string
        arrivalAt: string
      }[]
      conflicts: string[]
    }[]
    caveats: string[]
    usage: { inputTokens: number; outputTokens: number; requests: number }
  }
  actionPlan?: {
    headline: string
    rationale: string
    candidateId: string | null
    changes: {
      tripId: string
      vehicleId: string
      crewId: string
      beforeCrewId: string
      beforeDeparture: string
      afterDeparture: string
    }[]
    steps: { owner: string; when: string; task: string }[]
    prerequisites: string[]
    fallback: string
    expectedEffect: string
    asOf: string
  }
  evidenceSeqs: number[]
  reasons: string[]
  alternatives: Alternative[]
  trace: TraceStep[]
  sourceHash: string | null
  suggestedCandidateId: string | null
  model: {
    status: "disabled" | "pending" | "completed" | "unavailable" | "budget"
    name: string | null
    summary: string | null
  }
  reviewedAt: string | null
  reviewNote: string | null
  version: number
}
export type LiveRun = {
  id: string
  eventSeq: number
  status: "processing" | "completed" | "failed"
  startedAt: string
  finishedAt: string | null
  trace: TraceStep[]
  error: string | null
}
export type LiveSnapshot = {
  revision: number
  services?: string[]
  events: LiveEvent[]
  decisions: Decision[]
  runs: LiveRun[]
  pending: number
  invalid: number
  monitor: {
    online: boolean
    paused: boolean
    llmEnabled: boolean
    heartbeatAt: string | null
    lastError: string | null
    lastModelAt: string | null
  }
  serverTime: string
}
