import { createReadStream } from "node:fs"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { createInterface } from "node:readline"
import { createGunzip, gunzipSync } from "node:zlib"
import {
  operationsManifest,
  buildOperationsReport,
  type OperationsSnapshot,
} from "./operations"
import type { Row } from "./fleet"
const directory = join(process.cwd(), "data", "operations")
let snapshot: Promise<OperationsSnapshot> | undefined
export async function getOperationsReport(service: string, date: string) {
  if (!snapshot)
    snapshot = readFile(join(directory, "summary.json.gz"))
      .then(
        (buffer) =>
          JSON.parse(gunzipSync(buffer).toString()) as OperationsSnapshot
      )
      .catch((error) => {
        snapshot = undefined
        throw error
      })
  return buildOperationsReport(await snapshot, service, date)
}
export function sourceTable(id: string) {
  return operationsManifest.tables.find((table) => table.id === id)
}
export class OperationsQueryBusyError extends Error {
  constructor() {
    super("Operations records are busy. Please retry shortly.")
  }
}
type QueryResult = {
  table: string
  columns: string[]
  rows: Row[]
  total: number
  page: number
  pageSize: number
}
// The snapshot is immutable for the lifetime of this process. Cache only pages,
// not entire parsed tables: stop_calls alone contains over 250,000 wide rows.
const queryCache = new Map<string, QueryResult>()
const pendingQueries = new Map<string, Promise<QueryResult>>()
const cacheLimit = 32
const scanLimit = 4

export async function queryOperationsTable(
  id: string,
  query: string,
  page: number
): Promise<QueryResult> {
  const table = sourceTable(id)
  if (!table) throw new Error("Unknown table")
  const search = query.toLowerCase()
  const key = JSON.stringify([id, search, page])
  const cached = queryCache.get(key)
  if (cached) {
    queryCache.delete(key)
    queryCache.set(key, cached)
    return cached
  }
  const pending = pendingQueries.get(key)
  if (pending) return pending
  // No search result can have more rows than the source table. Unfiltered
  // out-of-range requests therefore need no file access at all.
  if (!search && page * 25 >= table.count) {
    return {
      table: id,
      columns: table.columns,
      rows: [],
      total: table.count,
      page,
      pageSize: 25,
    }
  }
  if (pendingQueries.size >= scanLimit) throw new OperationsQueryBusyError()
  const request = scanOperationsTable(id, search, page)
    .then((result) => {
      queryCache.set(key, result)
      if (queryCache.size > cacheLimit) {
        queryCache.delete(queryCache.keys().next().value!)
      }
      return result
    })
    .finally(() => pendingQueries.delete(key))
  pendingQueries.set(key, request)
  return request
}

async function scanOperationsTable(id: string, query: string, page: number) {
  const table = sourceTable(id)
  if (!table) throw new Error("Unknown table")
  const input = createReadStream(join(directory, `${table.id}.jsonl.gz`)),
    unzip = createGunzip()
  input.on("error", (error) => unzip.destroy(error))
  const lines = createInterface({
    input: input.pipe(unzip),
    crlfDelay: Infinity,
  })
  const rows: Row[] = [],
    search = query.toLowerCase(),
    size = 25
  let total = 0
  try {
    for await (const line of lines) {
      if (!search) {
        // Skip earlier lines without parsing, and close the stream as soon
        // as this page is complete. The manifest supplies the exact total.
        if (total++ < page * size) continue
        rows.push(JSON.parse(line) as Row)
        if (rows.length === size) break
        continue
      }
      const row = JSON.parse(line) as Row
      if (
        !Object.values(row).some((v) =>
          String(v ?? "")
            .toLowerCase()
            .includes(search)
        )
      )
        continue
      if (total >= page * size && rows.length < size) rows.push(row)
      total++
    }
  } finally {
    lines.close()
    input.destroy()
    unzip.destroy()
  }
  return {
    table: table.id,
    columns: table.columns,
    rows,
    total: search ? total : table.count,
    page,
    pageSize: size,
  }
}
export async function readOperationsDownload(id: string) {
  const table = sourceTable(id)
  if (!table) throw new Error("Unknown table")
  return readFile(join(directory, `${table.id}.csv.gz`))
}
