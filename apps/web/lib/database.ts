import { DatabaseSync } from "node:sqlite"
import { resolve } from "node:path"
import { z } from "zod"

export function withDatabase<T>(read: (database: DatabaseSync) => T): T {
  const database = new DatabaseSync(
    process.env.DASHBOARD_DATABASE_PATH ??
      resolve(process.cwd(), "../../data/operations/lionlink-network.sqlite"),
    { readOnly: true }
  )
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
