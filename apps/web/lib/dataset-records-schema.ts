import { z } from "zod"
import { rowSchema } from "./dashboard-data"

export const definitionSchema = z.object({
  id: z.string(),
  title: z.string(),
  storage: z.enum(["handout", "operations"]),
  fields: z.array(
    z.object({
      name: z.string(),
      type: z.enum(["TEXT", "REAL", "INTEGER"]),
      required: z.boolean(),
    })
  ),
  keys: z.array(z.string()),
})
export type DatasetDefinition = z.infer<typeof definitionSchema>
export const mutationSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("upload"),
    table: z.string(),
    csv: z.string().min(1).max(2_000_000),
    commit: z.boolean(),
  }),
  z.object({ action: z.literal("add"), table: z.string(), row: rowSchema }),
  z.object({
    action: z.literal("remove"),
    table: z.string(),
    recordId: z.number().int().nonnegative(),
    expected: rowSchema,
  }),
])
export type DatasetMutation = z.infer<typeof mutationSchema>

export const importResultSchema = z.object({
  table: z.string(),
  count: z.number(),
  columns: z.array(z.string()),
  sample: z.array(rowSchema),
  committed: z.boolean(),
})
export type ImportResult = z.infer<typeof importResultSchema>
