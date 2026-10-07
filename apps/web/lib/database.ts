import { DatabaseSync, type SQLInputValue } from "node:sqlite"
import { Worker } from "node:worker_threads"
import { resolve } from "node:path"
import { z } from "zod"

export function withDatabase<T>(read: (database: DatabaseSync) => T): T {
  const database = new DatabaseSync(databasePath(), { readOnly: true })
  try {
    database.exec("BEGIN")
    return read(database)
  } finally {
    database.close()
  }
}

export function readMetadata<T>(
  database: DatabaseSync,
  name: string,
  schema: z.ZodType<T>
): T {
  const row = database
    .prepare("SELECT value FROM dashboard_metadata WHERE name = ?")
    .get(name)
  return schema.parse(
    JSON.parse(z.object({ value: z.string() }).parse(row).value)
  )
}

export function databasePath() {
  return (
    process.env.DASHBOARD_DATABASE_PATH ??
    resolve(process.cwd(), "../../data/operations/lionlink-network.sqlite")
  )
}

export class DatabaseBusyError extends Error {
  constructor() {
    super("Operations records are busy. Please retry shortly.")
  }
}

let activeReads = 0

export async function queryDatabase(
  queries: { sql: string; parameters?: SQLInputValue[] }[],
  signal?: AbortSignal
): Promise<unknown[]> {
  signal?.throwIfAborted()
  if (activeReads >= 4) throw new DatabaseBusyError()
  const worker = new Worker(resolve(process.cwd(), "lib/database-worker.mjs"), {
    workerData: { path: databasePath(), queries },
  })
  activeReads++
  let abort: (() => void) | undefined
  try {
    return await new Promise<unknown[]>((resolve, reject) => {
      abort = () => reject(signal?.reason)
      signal?.addEventListener("abort", abort, { once: true })
      if (signal?.aborted) abort()
      worker.once("message", (message: unknown) => {
        const parsed = z.array(z.unknown()).safeParse(message)
        if (parsed.success) resolve(parsed.data)
        else reject(parsed.error)
      })
      worker.once("error", reject)
      worker.once("exit", (code) =>
        reject(
          new Error(
            `Database worker exited before returning a result (${code})`
          )
        )
      )
    })
  } finally {
    if (abort) signal?.removeEventListener("abort", abort)
    try {
      await worker.terminate()
    } finally {
      activeReads--
    }
  }
}
