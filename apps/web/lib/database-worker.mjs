import { DatabaseSync } from "node:sqlite"
import { parentPort, workerData } from "node:worker_threads"

const database = new DatabaseSync(workerData.path, { readOnly: true })
try {
  database.exec("BEGIN")
  database.function("search_text", (value) => String(value ?? "").toLowerCase())
  const results = workerData.queries.map(({ sql, parameters }) =>
    database.prepare(sql).all(...(parameters ?? []))
  )
  database.close()
  parentPort.postMessage(results)
} finally {
  if (database.isOpen) database.close()
}
