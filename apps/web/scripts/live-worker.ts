import { randomUUID } from "node:crypto"
import { setTimeout as delay } from "node:timers/promises"
import {
  heartbeat,
  bridgeContextChanges,
  liveDatabasePath,
  releaseMonitor,
} from "../lib/live/store"
import { ensureContextDatabase } from "../lib/live/context-db"
import { processLiveEvent } from "../lib/live/worker"
const owner = randomUUID()
let stopped = false
for (const signal of ["SIGINT", "SIGTERM"] as const)
  process.on(signal, () => {
    stopped = true
  })
if (!heartbeat(owner)) {
  console.error("Another live monitor owns the database lease.")
  process.exit(1)
}
console.log(
  `Live monitor watching ${liveDatabasePath}; scans every 2 seconds. OpenAI agent evaluates enabled records; no rule-based recommendations.`
)
const beat = setInterval(() => {
  if (!heartbeat(owner)) {
    console.error("Monitor lease lost; stopping.")
    stopped = true
  } else bridgeContextChanges()
}, 2000)
try {
  await ensureContextDatabase()
  while (!stopped) {
    await ensureContextDatabase()
    await processLiveEvent(owner)
    await delay(2000)
  }
} finally {
  clearInterval(beat)
  releaseMonitor(owner)
}
