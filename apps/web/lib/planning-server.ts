import { execFile, spawn } from "node:child_process"
import { promisify } from "node:util"
import { resolve, join } from "node:path"
import { readdir, readFile } from "node:fs/promises"
import { z } from "zod"
import { databasePath } from "./database"
import {
  planningCatalogSchema,
  planningEventSchema,
  type PlanningRequest,
} from "./planning-schema"

const execute = promisify(execFile)
const worker = () => resolve(process.cwd(), "planner/cli.py")
const runs = () =>
  process.env.OPS_PLANNING_RUNS_DIR ?? resolve(process.cwd(), ".ops-planning")
const environment = () => ({
  ...process.env,
  DASHBOARD_DATABASE_PATH: databasePath(),
  OPS_PLANNING_RUNS_DIR: runs(),
  PYTHONUNBUFFERED: "1",
})

export async function planningCatalog() {
  const { stdout } = await execute(
    process.env.PYTHON_BIN ?? "python3",
    [worker(), "catalog"],
    { env: environment(), maxBuffer: 2 * 1024 * 1024 }
  )
  const value: unknown = JSON.parse(stdout)
  return planningCatalogSchema.parse(value)
}

export function planningStream(request: PlanningRequest, signal: AbortSignal) {
  const child = spawn(process.env.PYTHON_BIN ?? "python3", [worker()], {
    env: environment(),
    stdio: ["pipe", "pipe", "pipe"],
  })
  const timeout = setTimeout(() => child.kill(), 10 * 60 * 1000)
  child.once("close", () => clearTimeout(timeout))
  const encoder = new TextEncoder()
  let stopped = false
  let cleanup = () => {}
  return new ReadableStream<Uint8Array>({
    start(controller) {
      let pending = ""
      let terminalEvent = false
      const fail = (error: Error) => {
        if (stopped) return
        stopped = true
        cleanup()
        child.kill()
        controller.error(error)
      }
      const abort = () => fail(new Error("Planning request was cancelled."))
      cleanup = () => signal.removeEventListener("abort", abort)
      signal.addEventListener("abort", abort, { once: true })
      child.stdout.setEncoding("utf8")
      child.stdout.on("data", (chunk: string) => {
        if (stopped) return
        pending += chunk
        let end = pending.indexOf("\n")
        while (end !== -1) {
          const line = pending.slice(0, end)
          pending = pending.slice(end + 1)
          try {
            const value: unknown = JSON.parse(line)
            const event = planningEventSchema.parse(value)
            terminalEvent ||= event.type === "result" || event.type === "error"
            controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"))
          } catch {
            return fail(
              new Error(
                "The planner returned an invalid event. The run is incomplete."
              )
            )
          }
          end = pending.indexOf("\n")
        }
      })
      child.stderr.resume()
      child.on("error", () =>
        fail(
          new Error(
            "The planner could not start. Verify the server's Python 3 configuration."
          )
        )
      )
      child.on("close", () => {
        if (stopped) return
        if (!terminalEvent)
          return fail(
            new Error("The planner stopped before returning a complete result.")
          )
        stopped = true
        cleanup()
        controller.close()
      })
      child.stdin.on("error", () =>
        fail(new Error("The planning request could not reach the worker."))
      )
      if (signal.aborted) return abort()
      child.stdin.end(JSON.stringify(request))
    },
    cancel() {
      stopped = true
      cleanup()
      child.kill()
    },
  })
}

export async function planningAudit(id: string) {
  const directory = join(runs(), z.string().uuid().parse(id))
  const files: { path: string; data: unknown }[] = []
  async function visit(path: string, prefix: string) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      if (entry.isDirectory())
        await visit(join(path, entry.name), prefix + entry.name + "/")
      else if (entry.isFile() && entry.name.endsWith(".json")) {
        const raw = await readFile(join(path, entry.name), "utf8")
        let data: unknown
        try {
          data = JSON.parse(raw)
        } catch {
          data = { incomplete: true, raw }
        }
        files.push({ path: prefix + entry.name, data })
      }
    }
  }
  await visit(directory, "")
  return { runId: id, files }
}
