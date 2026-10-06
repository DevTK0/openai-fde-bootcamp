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
export async function queryOperationsTable(
  id: string,
  query: string,
  page: number
) {
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
      const row = JSON.parse(line) as Row
      if (
        search &&
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
    total,
    page,
    pageSize: size,
  }
}
export async function readOperationsDownload(id: string) {
  const table = sourceTable(id)
  if (!table) throw new Error("Unknown table")
  return readFile(join(directory, `${table.id}.csv.gz`))
}
