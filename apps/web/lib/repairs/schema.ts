import { z } from "zod"

export const repairAreaSchema = z.enum([
  "front_door",
  "centre_door",
  "doors",
  "brakes",
  "cooling",
  "electrical",
  "air_system",
  "suspension",
  "roof_ac",
  "wipers",
  "lights",
  "body",
])
export type RepairArea = z.infer<typeof repairAreaSchema>
export const repairAreas: Record<
  RepairArea,
  { label: string; nodes: string[]; note: string }
> = {
  front_door: {
    label: "Front passenger door",
    nodes: ["front_door"],
    note: "Illustrative door location.",
  },
  centre_door: {
    label: "Centre passenger door",
    nodes: ["centre_door"],
    note: "Illustrative door location.",
  },
  doors: {
    label: "Passenger doors",
    nodes: ["front_door", "centre_door"],
    note: "Both doors are shown when the report does not identify one.",
  },
  brakes: {
    label: "Brake and wheel areas",
    nodes: [
      "wheel_1_l",
      "wheel_1_r",
      "wheel_2_l",
      "wheel_2_r",
      "wheel_3_l",
      "wheel_3_r",
    ],
    note: "Wheel areas only. Brake internals and the affected wheel are not located by this schematic.",
  },
  cooling: {
    label: "Cooling system",
    nodes: ["engine_bay"],
    note: "Approximate rear service area. Internal cooling components are not modeled.",
  },
  electrical: {
    label: "Electrical system",
    nodes: ["engine_bay"],
    note: "Approximate service area. Battery and wiring locations need confirmation.",
  },
  air_system: {
    label: "Pneumatic system",
    nodes: ["underbody"],
    note: "Approximate underbody area. This does not locate an air leak.",
  },
  suspension: {
    label: "Suspension",
    nodes: [
      "wheel_1_l",
      "wheel_1_r",
      "wheel_2_l",
      "wheel_2_r",
      "wheel_3_l",
      "wheel_3_r",
    ],
    note: "Axle areas only. Suspension internals are not modeled.",
  },
  roof_ac: {
    label: "Air conditioning",
    nodes: ["roof_ac"],
    note: "Illustrative roof unit.",
  },
  wipers: {
    label: "Wipers",
    nodes: ["wipers"],
    note: "Illustrative wiper location.",
  },
  lights: {
    label: "Vehicle lights",
    nodes: ["front_lights", "rear_lights"],
    note: "Front and rear lights are shown; confirm the affected lamp.",
  },
  body: {
    label: "Bodywork",
    nodes: ["body"],
    note: "General bodywork area, not a precise damage location.",
  },
}

export const repairRequestSchema = z
  .object({
    vehicle: z.string().trim().min(1).max(80),
    date: z.iso.date(),
    report: z
      .string()
      .trim()
      .min(10, "Describe the fault in at least 10 characters.")
      .max(4000),
  })
  .strict()
export type RepairRequest = z.infer<typeof repairRequestSchema>
const text = z.string().min(1).max(2000)
const citations = z.array(z.string().min(1)).min(1).max(12)
export const repairAnalysisSchema = z.object({
  summary: text,
  hypotheses: z
    .array(z.object({ cause: text, rationale: text, evidenceIds: citations }))
    .max(5),
  checks: z.array(z.object({ action: text, reason: text })).max(8),
  questions: z.array(text).max(6),
  areas: z
    .array(
      z.object({ id: repairAreaSchema, reason: text, evidenceIds: citations })
    )
    .max(6),
})
export const repairEvidenceSchema = z.object({
  id: z.string(),
  kind: z.enum(["report", "work_order", "hold", "readiness"]),
  title: z.string(),
  detail: z.string(),
})
export type RepairEvidence = z.infer<typeof repairEvidenceSchema>
export const repairResultSchema = z.object({
  request: repairRequestSchema,
  generatedAt: z.iso.datetime(),
  model: z.string(),
  analysis: repairAnalysisSchema,
  evidence: z.array(repairEvidenceSchema),
  trips: z.array(
    z.object({
      id: z.string(),
      service: z.string(),
      departure: z.number().nullable(),
      arrival: z.number().nullable(),
      holdIds: z.array(z.string()),
    })
  ),
})
export type RepairResult = z.infer<typeof repairResultSchema>
