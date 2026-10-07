import { join } from "node:path"
import { setTimeout } from "node:timers/promises"
import { dataDirectory, readRunnerConfig } from "../lib/config"
import { preflight, runOnce } from "../lib/runner"
import { Store } from "../lib/store"

const store = new Store(join(dataDirectory(), "factory.sqlite"))
const shutdown = new AbortController()
process.on("SIGINT", () => shutdown.abort())
process.on("SIGTERM", () => shutdown.abort())
try {
  store.ownWorker()
  let reason: string | null = "Checking worker configuration."
  const heartbeat = setInterval(() => store.heartbeat(reason), 2000)
  try {
    while (!shutdown.signal.aborted) {
      try {
        const config = readRunnerConfig()
        await preflight(config, {
          signal: shutdown.signal,
          childChanged: (pid) => store.childChanged(pid),
        })
        reason = null
        store.heartbeat(reason)
        while (!shutdown.signal.aborted) {
          if (!(await runOnce(config, store, shutdown.signal)))
            await setTimeout(500)
        }
      } catch (error) {
        reason =
          error instanceof Error
            ? error.message
            : "Worker configuration is invalid."
        store.heartbeat(reason)
        process.stderr.write(
          JSON.stringify({ event: "worker_blocked", reason }) + "\n"
        )
        if (!shutdown.signal.aborted)
          await setTimeout(5000, undefined, { signal: shutdown.signal }).catch(
            () => {}
          )
      }
    }
  } finally {
    clearInterval(heartbeat)
    store.releaseWorker()
  }
} finally {
  store.close()
}
