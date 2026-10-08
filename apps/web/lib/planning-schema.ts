import { z } from "zod"

export const networkScenarioSchema = z.enum([
  "new_bus",
  "new_crew",
  "sick_crew",
  "faulty_depot",
  "faulty_service",
])
export const coordinatedScenarioSchema = z.enum([
  "toa_bus",
  "amk_bus",
  "toa_crew",
])
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)
const resourceBase = {
  id: z.string().trim().min(1).max(80),
  confirmed: z.boolean(),
  availableFrom: time,
  availableUntil: time,
}
export const resourceSchema = z.discriminatedUnion("kind", [
  z.object({
    ...resourceBase,
    kind: z.literal("bus"),
    capacity: z.number().int().min(1).max(1000),
    wheelchairSpaces: z.number().int().min(0).max(64),
  }),
  z.object({
    ...resourceBase,
    kind: z.literal("crew"),
    qualification: z.string().trim().min(1).max(30),
  }),
])
const policyFields = {
  requirements: z.string().max(8000).default(""),
  objective: z.string().max(2000).default(""),
}
export const planningRequestSchema = z.discriminatedUnion("kind", [
  z.object({
    ...policyFields,
    kind: z.literal("coordinated"),
    scenario: coordinatedScenarioSchema,
  }),
  z
    .object({
      ...policyFields,
      kind: z.literal("network"),
      scenario: networkScenarioSchema,
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      route: z.string().min(1).max(40),
      vehicle: z.string().max(80).default(""),
      resources: z.array(resourceSchema).max(8).default([]),
    })
    .superRefine((value, context) => {
      for (const resource of value.resources) {
        if (
          (value.scenario === "new_bus" && resource.kind === "bus") ||
          (value.scenario === "new_crew" && resource.kind === "crew")
        )
          continue
        context.addIssue({
          code: "custom",
          message: "Added resources must match an onboarding scenario.",
        })
      }
      if (
        new Set(value.resources.map((resource) => resource.id)).size !==
        value.resources.length
      )
        context.addIssue({
          code: "custom",
          message: "Resource identifiers must be unique.",
        })
    }),
  z.object({
    ...policyFields,
    kind: z.literal("handout"),
    scenario: z.string().min(1).max(100),
  }),
])
const policySchema = z.object({
  id: z.string(),
  scope: z.string(),
  requirement: z.string(),
})
export const planningCatalogSchema = z.object({
  dates: z.array(z.string()),
  routes: z.array(
    z.object({
      id: z.string(),
      service: z.string(),
      origin: z.string(),
      destination: z.string(),
    })
  ),
  vehicles: z.array(z.object({ id: z.string(), routes: z.array(z.string()) })),
  policies: z.array(policySchema),
  keyConfigured: z.boolean(),
  coverage: z.object({
    tables: z.number(),
    rows: z.number(),
    trips: z.number(),
    vehicles: z.number(),
    crewRecords: z.number(),
    handoutDatasets: z.number(),
  }),
  importedScenarios: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      decisionAt: z.string(),
      objective: z.string(),
    })
  ),
})
const assignmentSchema = z.object({
  trip: z.string(),
  route: z.string(),
  bus: z.string(),
  crew: z.string(),
  departure: z.string().nullable(),
  arrival: z.string().nullable(),
})
const calendarSchema = z.object({
  kind: z.enum(["bus", "crew"]),
  resourceId: z.string(),
  availableFrom: z.string(),
  availableUntil: z.string(),
  details: z.string(),
  break: z.object({ start: z.string(), end: z.string() }).nullable(),
  tasks: z.array(
    z.object({
      trip: z.string(),
      bus: z.string(),
      crew: z.string(),
      route: z.string(),
      preparation: z.string().nullable(),
      alightingUntil: z.string().nullable(),
      departure: z.string().nullable(),
      arrival: z.string().nullable(),
      origin: z.string(),
      destination: z.string(),
    })
  ),
})
export const planningReportSchema = z.object({
  runId: z.string().uuid(),
  title: z.string(),
  decisionAt: z.string(),
  message: z.string(),
  recommendations: z.array(
    z.object({
      id: z.string(),
      status: z.enum(["eligible", "conditional"]),
      title: z.string(),
      summary: z.string(),
      assignments: z.array(assignmentSchema),
      calendars: z.array(calendarSchema),
    })
  ),
  assessments: z.array(
    z.object({
      id: z.string(),
      status: z.enum(["eligible", "conditional", "blocked", "unresolved"]),
      reason: z.string().optional(),
    })
  ),
  policyEvaluation: z
    .object({ apiCalls: z.number(), reusedChecks: z.number() })
    .optional(),
  physicalExclusions: z.array(
    z.object({
      id: z.string(),
      reasons: z.array(
        z.object({
          resourceId: z.string(),
          message: z.string(),
          tripIds: z.array(z.string()),
        })
      ),
    })
  ),
  rounds: z.array(
    z.object({
      phase: z.string(),
      inputIds: z.array(z.string()).min(2),
      selectedId: z.string(),
    })
  ),
  search: z.object({
    candidateCount: z.number(),
    resourcesConsidered: z.object({ buses: z.number(), crews: z.number() }),
    searchNodes: z.number(),
    searchLimited: z.boolean(),
    scope: z.string(),
  }),
  policies: z.array(policySchema),
  sources: z.array(
    z.object({ id: z.string(), title: z.string(), rowCount: z.number() })
  ),
  affectedTrips: z.array(assignmentSchema),
})
export const planningEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("progress"),
    runId: z.string().uuid(),
    phase: z.string(),
    message: z.string(),
  }),
  z.object({ type: z.literal("result"), report: planningReportSchema }),
  z.object({
    type: z.literal("error"),
    runId: z.string().uuid(),
    message: z.string(),
  }),
])
export type PlanningRequest = z.infer<typeof planningRequestSchema>
export type PlanningCatalog = z.infer<typeof planningCatalogSchema>
export type PlanningReport = z.infer<typeof planningReportSchema>
export type PlanningEvent = z.infer<typeof planningEventSchema>
export type NetworkScenario = z.infer<typeof networkScenarioSchema>
