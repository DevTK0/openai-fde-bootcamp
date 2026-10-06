import { z } from "zod"

const id = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,99}$/)
const text = z.string().max(20000)
const cell = z.union([
  z.string().max(4000),
  z.number().finite().min(-1e12).max(1e12),
  z.null(),
])
export const sourceSchema = z
  .object({
    id,
    title: z.string().min(1).max(200),
    kind: z.enum(["observed", "reported", "planned", "synthetic"]),
    reference: z.string().min(1).max(500),
    caveats: z.array(text).max(30),
    text,
  })
  .strict()
export const tableSchema = z
  .object({
    id,
    title: z.string().min(1).max(200),
    sourceId: id,
    kind: z.enum(["maintenance", "operations", "evidence"]),
    columns: z.array(z.string().min(1).max(100)).min(1).max(100),
    rows: z
      .array(z.object({ id, values: z.record(z.string(), cell) }).strict())
      .max(10000),
    caveats: z.array(text).max(30),
  })
  .strict()
export const maintenanceFields = [
  "recorded_km",
  "repair_count",
  "repair_cost_sgd",
  "repair_unavailable_hours",
]
export const operationsFields = [
  "trips",
  "completed",
  "boardings",
  "calls",
  "queued_calls",
  "on_time_departures",
  "departure_samples",
]
function validDate(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  )
}
export const bundleSchema = z
  .object({
    schemaVersion: z.literal(1),
    name: z.string().min(1).max(120),
    description: text,
    sources: z.array(sourceSchema).min(1).max(150),
    tables: z.array(tableSchema).min(1).max(100),
  })
  .strict()
  .superRefine((bundle, ctx) => {
    const fail = (message: string) => ctx.addIssue({ code: "custom", message })
    const unique = (values: string[]) => new Set(values).size === values.length
    if (
      !unique(bundle.sources.map((s) => s.id)) ||
      !unique(bundle.tables.map((t) => t.id))
    )
      fail("Source and table IDs must be unique")
    for (const kind of ["maintenance", "operations"])
      if (bundle.tables.filter((t) => t.kind === kind).length > 1)
        fail(
          `Only one canonical ${kind} table is allowed; put overlapping views in evidence tables`
        )
    if (bundle.tables.reduce((n, t) => n + t.rows.length, 0) > 20000)
      fail("Maximum 20000 rows per bundle")
    for (const table of bundle.tables) {
      if (!bundle.sources.some((s) => s.id === table.sourceId))
        fail(`Unknown source for ${table.id}`)
      if (!unique(table.columns) || !unique(table.rows.map((r) => r.id)))
        fail(`Duplicate column or row ID in ${table.id}`)
      const keys = new Set<string>()
      for (const row of table.rows) {
        if (Object.keys(row.values).some((k) => !table.columns.includes(k)))
          fail(`Undeclared column in ${table.id}/${row.id}`)
        if (table.kind === "evidence") continue
        const date = row.values[table.kind === "maintenance" ? "month" : "date"]
        const entity =
          row.values[table.kind === "maintenance" ? "vehicle_id" : "service"]
        if (
          typeof date !== "string" ||
          !(table.kind === "maintenance"
            ? /^\d{4}-\d{2}$/.test(date) && validDate(`${date}-01`)
            : validDate(date))
        )
          fail(`Invalid date in ${table.id}/${row.id}`)
        if (typeof entity !== "string" || !entity.trim())
          fail(`Missing entity in ${table.id}/${row.id}`)
        const key = JSON.stringify([date, entity])
        if (keys.has(key)) fail(`Duplicate canonical grain in ${table.id}`)
        keys.add(key)
        for (const field of table.kind === "maintenance"
          ? maintenanceFields
          : operationsFields) {
          const value = row.values[field]
          if (value !== null && (typeof value !== "number" || value < 0))
            fail(
              `Supply ${field} as a nonnegative number or null in ${table.id}/${row.id}`
            )
          if (
            typeof value === "number" &&
            field !== "recorded_km" &&
            field !== "repair_cost_sgd" &&
            field !== "repair_unavailable_hours" &&
            !Number.isInteger(value)
          )
            fail(`${field} must be an integer`)
        }
        for (const [part, total] of [
          ["completed", "trips"],
          ["queued_calls", "calls"],
          ["on_time_departures", "departure_samples"],
          ["departure_samples", "trips"],
        ] as const) {
          const a = row.values[part],
            b = row.values[total]
          if (
            table.kind === "operations" &&
            typeof a === "number" &&
            typeof b === "number" &&
            a > b
          )
            fail(`${part} exceeds ${total}`)
        }
      }
    }
  })
export type DatasetBundle = z.infer<typeof bundleSchema>
export type EvidenceTable = z.infer<typeof tableSchema>
export type EvidenceRow = EvidenceTable["rows"][number]
export const revisionIdSchema = z.string().regex(/^[a-f0-9]{64}$/)
export const filterSchema = z
  .object({
    vehicle: z.string().max(100).default(""),
    service: z.string().max(100).default(""),
    from: z
      .string()
      .refine((v) => !v || validDate(v), "Invalid start date")
      .default(""),
    to: z
      .string()
      .refine((v) => !v || validDate(v), "Invalid end date")
      .default(""),
  })
  .refine((v) => !v.from || !v.to || v.from <= v.to, "Start must precede end")
export type EvidenceFilters = z.infer<typeof filterSchema>
