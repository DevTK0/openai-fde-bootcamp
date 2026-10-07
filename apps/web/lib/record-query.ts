import { z } from "zod"
import { rowSchema } from "./dashboard-data"
import type { Row } from "./fleet"

export const RECORD_PAGE_SIZE = 25
export const recordQuerySchema = z.object({
  q: z.string().max(120).default(""),
  column: z.string().default(""),
  match: z.enum(["contains", "equals", "empty"]).default("contains"),
  value: z.string().max(120).default(""),
  sort: z.string().default(""),
  direction: z.enum(["asc", "desc"]).default("asc"),
  page: z.coerce.number().int().min(0).max(100000).default(0),
})
export type RecordQuery = z.infer<typeof recordQuerySchema>
export const emptyRecordQuery: RecordQuery = recordQuerySchema.parse({})
export const recordsResultSchema = z.object({
  rows: z.array(rowSchema),
  recordIds: z.array(z.number()),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
})
export const searchText = (value: Row[string] | undefined) =>
  String(value ?? "").toLowerCase()
export function filterRecords(rows: Row[], query: RecordQuery) {
  const filtered = rows.filter((row) => {
    if (
      !Object.values(row).some((v) =>
        searchText(v).includes(query.q.toLowerCase())
      )
    )
      return false
    if (!query.column) return true
    const value = searchText(row[query.column])
    if (query.match === "empty") return value === ""
    if (!query.value) return true
    return query.match === "equals"
      ? value === query.value.toLowerCase()
      : value.includes(query.value.toLowerCase())
  })
  if (query.sort)
    filtered.sort((a, b) => {
      const av = a[query.sort],
        bv = b[query.sort]
      const aEmpty = av === null || av === undefined || av === ""
      const bEmpty = bv === null || bv === undefined || bv === ""
      if (aEmpty || bEmpty) return aEmpty === bEmpty ? 0 : aEmpty ? 1 : -1
      const left = typeof av === "number" ? av : searchText(av)
      const right = typeof bv === "number" ? bv : searchText(bv)
      return (
        (left < right ? -1 : left > right ? 1 : 0) *
        (query.direction === "desc" ? -1 : 1)
      )
    })
  return filtered
}
