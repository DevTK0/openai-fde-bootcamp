import { DatabaseSync } from "node:sqlite"
import { parse } from "csv-parse/sync"
import { z } from "zod"
import { databasePath, readMetadata, withDatabase } from "./database"
import { datasetSchema, manifestSchema, rowSchema } from "./dashboard-data"
import { datasetRules } from "./dataset-rules"
import {
  definitionSchema,
  type DatasetMutation,
} from "./dataset-records-schema"

export class RecordValidationError extends Error {}
const quote = (value: string) => `"${value.replaceAll('"', '""')}"`
const metadataSchema = datasetSchema.omit({ rows: true }).extend({
  fieldTypes: z
    .record(z.string(), z.enum(["TEXT", "REAL", "INTEGER"]))
    .optional(),
})
function describe(database: DatabaseSync, id: string) {
  const stored = database
    .prepare("SELECT metadata FROM handout_tables WHERE id = ?")
    .get(id)
  const metadata = stored
    ? metadataSchema.parse(
        JSON.parse(z.object({ metadata: z.string() }).parse(stored).metadata)
      )
    : undefined
  const table =
    metadata ??
    readMetadata(database, "operations", manifestSchema).tables.find(
      (t) => t.id === id
    )
  if (!table) throw new RecordValidationError("Unknown dataset.")
  const rows = metadata
    ? z
        .array(z.object({ data: z.string() }))
        .parse(
          database
            .prepare(
              "SELECT data FROM handout_rows WHERE table_id = ? ORDER BY position"
            )
            .all(id)
        )
        .map((r) => rowSchema.parse(JSON.parse(r.data)))
    : []
  const rules = datasetRules[id]
  const first = table.columns[0]
  if (!first) throw new RecordValidationError("This dataset has no columns.")
  const keys =
    rules?.keys ??
    (["Month", "Week start", "Period start", "month", "period_start"].includes(
      first
    )
      ? [
          first,
          table.columns.includes("Vehicle ID") ? "Vehicle ID" : "vehicle_id",
        ]
      : [first])
  const fields = metadata
    ? table.columns.map((name) => ({
        name,
        type:
          metadata.fieldTypes?.[name] ??
          (rows.some((r) => typeof r[name] === "number") ? "REAL" : "TEXT"),
      }))
    : z
        .array(z.object({ name: z.string(), type: z.string() }))
        .parse(database.prepare(`PRAGMA table_info(${quote(id)})`).all())
  const definition = definitionSchema.parse({
    id,
    title: metadata?.title ?? id.replaceAll("_", " "),
    storage: metadata ? "handout" : "operations",
    keys,
    fields: fields.map((f) => ({
      ...f,
      required:
        keys.includes(f.name) ||
        rules?.required?.includes(f.name) ||
        (f.type !== "TEXT" &&
          (!metadata || rows.every((row) => row[f.name] !== null))),
    })),
  })
  return { definition, metadata, rows, columns: table.columns }
}
export function readDatasetDefinition(id: string) {
  return withDatabase((db) => describe(db, id).definition)
}
export function mutateDataset(input: DatasetMutation) {
  const database = new DatabaseSync(databasePath())
  try {
    database.exec("PRAGMA busy_timeout = 3000; BEGIN IMMEDIATE")
    const { definition, metadata, rows, columns } = describe(
      database,
      input.table
    )
    const id = definition.id
    const fieldTypes = Object.fromEntries(
      definition.fields.map((f) => [f.name, f.type])
    )
    if (input.action === "remove") {
      const stored = metadata
        ? database
            .prepare(
              "SELECT data FROM handout_rows WHERE table_id = ? AND position = ?"
            )
            .get(id, input.recordId)
        : database
            .prepare(`SELECT * FROM ${quote(id)} WHERE rowid = ?`)
            .get(input.recordId)
      const row = stored
        ? metadata
          ? rowSchema.parse(
              JSON.parse(z.object({ data: z.string() }).parse(stored).data)
            )
          : rowSchema.parse(stored)
        : undefined
      if (
        !row ||
        columns.some((c) => (row[c] ?? "") !== (input.expected[c] ?? ""))
      )
        throw new RecordValidationError(
          "This record has changed or was already removed. Refresh the dashboard before trying again."
        )
      if (metadata) {
        const positions = z
          .array(z.object({ position: z.number() }))
          .parse(
            database
              .prepare(
                "SELECT position FROM handout_rows WHERE table_id = ? ORDER BY position"
              )
              .all(id)
          )
        const index = positions.findIndex((r) => r.position === input.recordId)
        database
          .prepare(
            "DELETE FROM handout_rows WHERE table_id = ? AND position = ?"
          )
          .run(id, input.recordId)
        database
          .prepare("UPDATE handout_tables SET metadata = ? WHERE id = ?")
          .run(
            JSON.stringify({
              ...metadata,
              fieldTypes,
              sourceRows: metadata.sourceRows.filter((_, i) => i !== index),
            }),
            id
          )
      } else
        database
          .prepare(`DELETE FROM ${quote(id)} WHERE rowid = ?`)
          .run(input.recordId)
      database.exec("COMMIT")
      return { table: id, count: 1, columns, sample: [], committed: true }
    }
    let values: z.infer<typeof rowSchema>[]
    if (input.action === "add") {
      if (
        Object.keys(input.row).length !== columns.length ||
        columns.some((c) => !(c in input.row))
      )
        throw new RecordValidationError("Supply every field in this dataset.")
      values = [input.row]
    } else {
      let raw: unknown
      try {
        raw = parse(input.csv, {
          bom: true,
          skip_empty_lines: true,
          max_record_size: 100_000,
        })
      } catch {
        throw new RecordValidationError(
          "The CSV could not be read. Check quotes and the number of fields in each row."
        )
      }
      const [headers, ...cells] = z.array(z.array(z.string())).parse(raw)
      if (
        !headers ||
        headers.length !== columns.length ||
        new Set(headers).size !== headers.length ||
        columns.some((c) => !headers.includes(c))
      )
        throw new RecordValidationError(
          `Use the ${definition.title.toLowerCase()} template with its exact column names, including every column.`
        )
      values = cells.map((row) =>
        Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ""]))
      )
    }
    if (!values.length || values.length > 1000)
      throw new RecordValidationError(
        "Upload between 1 and 1,000 records at a time."
      )
    const existingKeys = new Set(
      rows.map((r) => JSON.stringify(definition.keys.map((k) => r[k])))
    )
    const duplicate = metadata
      ? undefined
      : database.prepare(
          `SELECT 1 FROM ${quote(id)} WHERE ${definition.keys.map((k) => `${quote(k)} IS ?`).join(" AND ")} LIMIT 1`
        )
    const insert = metadata
      ? database.prepare(
          "INSERT INTO handout_rows (table_id, position, data) VALUES (?, ?, ?)"
        )
      : database.prepare(
          `INSERT INTO ${quote(id)} (${columns.map(quote).join(",")}) VALUES (${columns.map(() => "?").join(",")})`
        )
    const position = metadata
      ? z
          .object({ position: z.number() })
          .parse(
            database
              .prepare(
                "SELECT coalesce(max(position), -1) + 1 AS position FROM handout_rows WHERE table_id = ?"
              )
              .get(id)
          ).position
      : 0
    const timestamp = database.prepare("SELECT unixepoch(?) AS value")
    const sample: z.infer<typeof rowSchema>[] = []
    for (const [index, valueRow] of values.entries()) {
      const row: z.infer<typeof rowSchema> = {}
      for (const field of definition.fields) {
        const value = String(valueRow[field.name] ?? "")
        const prefix = `Row ${index + (input.action === "upload" ? 2 : 1)}: ${field.name}`
        if (field.required && !value.trim())
          throw new RecordValidationError(`${prefix} is required.`)
        if (!value.trim() && !field.required) {
          row[field.name] = field.type === "TEXT" ? value : null
          continue
        }
        if (field.type !== "TEXT") {
          const number = Number(value)
          if (
            !value.trim() ||
            !Number.isFinite(number) ||
            (field.type === "INTEGER" && !Number.isSafeInteger(number))
          )
            throw new RecordValidationError(
              `${prefix} must be ${field.type === "INTEGER" ? "a whole number" : "a number"}.`
            )
          row[field.name] = number
        } else {
          const name = field.name.toLowerCase().replaceAll("_", " ")
          if (
            value &&
            (name === "service date" ||
              name.endsWith(" at") ||
              name.endsWith(" on") ||
              [
                "journey window start",
                "journey window end",
                "proposed start",
                "proposed end",
              ].includes(name)) &&
            (!Number.isFinite(Date.parse(value)) ||
              timestamp.get(value)?.value === null)
          )
            throw new RecordValidationError(
              `${prefix} must contain a valid date or timestamp.`
            )
          if (name === "month" && !/^\d{4}-(0[1-9]|1[0-2])$/.test(value))
            throw new RecordValidationError(`${prefix} must use YYYY-MM.`)
          row[field.name] = value
        }
      }
      const keys = definition.keys.map((k) => row[k] ?? null),
        key = JSON.stringify(keys)
      if (existingKeys.has(key) || duplicate?.get(...keys))
        throw new RecordValidationError(
          `Record ${keys.join(" / ")} already exists in this dataset or upload. Use a new ID; existing records are never replaced.`
        )
      if (metadata) insert.run(id, position + index, JSON.stringify(row))
      else insert.run(...columns.map((c) => row[c] ?? null))
      existingKeys.add(key)
      if (sample.length < 5) sample.push(row)
    }
    if (metadata)
      database
        .prepare("UPDATE handout_tables SET metadata = ? WHERE id = ?")
        .run(
          JSON.stringify({
            ...metadata,
            fieldTypes,
            sourceRows: [
              ...metadata.sourceRows,
              ...values.map((_, i) => i + 2),
            ],
          }),
          id
        )
    const committed = input.action === "add" || input.commit
    database.exec(committed ? "COMMIT" : "ROLLBACK")
    return { table: id, count: values.length, columns, sample, committed }
  } finally {
    database.close()
  }
}
