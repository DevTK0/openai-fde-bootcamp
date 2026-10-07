import { spawn, spawnSync } from "node:child_process"
import { createHash } from "node:crypto"
import { once } from "node:events"
import {
  closeSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { homedir, tmpdir } from "node:os"
import { createConnection } from "node:net"
import { basename, join } from "node:path"
import { fileURLToPath } from "node:url"
import { setTimeout as delay } from "node:timers/promises"

const self = fileURLToPath(import.meta.url)
const portless = fileURLToPath(
  new URL("../node_modules/portless/dist/cli.js", import.meta.url)
)
const env = {
  ...process.env,
  PORTLESS_PORT: process.env.PORTLESS_PORT ?? "1355",
  PORTLESS_HTTPS: "0",
  PORTLESS_SYNC_HOSTS: "0",
  PORTLESS_TAILSCALE: process.env.PORTLESS_TAILSCALE ?? "1",
  PORTLESS_FUNNEL: "0",
  PORTLESS_NGROK: "0",
}

function forwardSignals(child) {
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => child.kill(signal))
  }
}

async function run() {
  const args = process.argv.slice(2)
  if (args[0] === "list") {
    const child = spawn(process.execPath, [portless, "list"], {
      env,
      stdio: "inherit",
    })
    forwardSignals(child)
    const [code] = await once(child, "exit")
    process.exitCode = code ?? 1
    return
  }

  if (args[0] === "--registered") {
    const [, marker, command, ...commandArgs] = args
    // Portless has registered both routes before invoking this command.
    writeFileSync(marker, process.env.PORT)
    const metadata = JSON.parse(readFileSync("package.json", "utf8"))
    const path = metadata.devPreview?.path ?? "/"
    for (const origin of [
      process.env.PORTLESS_URL,
      process.env.PORTLESS_TAILSCALE_URL,
    ]) {
      if (origin) console.log(`Preview: ${new URL(path, origin).href}`)
    }
    if (["next", "astro", "open-slide", "vite"].includes(command)) {
      commandArgs.push("--port", process.env.PORT)
    }
    const child = spawn(command, commandArgs, { stdio: "inherit" })
    forwardSignals(child)
    const [code] = await once(child, "exit")
    process.exitCode = code ?? 1
    return
  }

  if (!args.length)
    throw new Error(
      "Run this launcher through an app's dev, start, or preview script."
    )
  const appDir = realpathSync(process.cwd())
  const metadata = JSON.parse(
    readFileSync(join(appDir, "package.json"), "utf8")
  )
  const worktree =
    basename(fileURLToPath(new URL("../", import.meta.url)))
      .replace(/[^a-z0-9-]+/gi, "-")
      .toLowerCase()
      .slice(0, 24)
      .replace(/^-+|-+$/g, "") || "worktree"
  const label = metadata.name
    .replace(/^@/, "")
    .replace(/[^a-z0-9-]+/gi, "-")
    .toLowerCase()
    .slice(0, 20)
  const identity = createHash("sha256")
    .update(appDir)
    .digest("hex")
    .slice(0, 12)
  const name = `${worktree}-${label}-${identity}`
  // All worktrees share one Tailscale node, even with different Portless state dirs.
  const lockDir = join(homedir(), ".portless")
  mkdirSync(lockDir, { recursive: true })
  let lock = openSync(join(lockDir, "monorepo-launch.lock"), "a", 0o600)
  const temporary = mkdtempSync(join(tmpdir(), "portless-launch-"))
  const marker = join(temporary, "registered")
  let child
  let pendingSignal
  let registered = false
  const stop = (signal) => {
    pendingSignal = signal
    if (registered) child?.kill(signal)
  }
  process.on("SIGINT", () => stop("SIGINT"))
  process.on("SIGTERM", () => stop("SIGTERM"))
  try {
    const acquired = spawnSync("flock", ["--exclusive", "--wait", "60", "3"], {
      stdio: ["ignore", "inherit", "inherit", lock],
    })
    if (acquired.error) throw acquired.error
    if (acquired.status !== 0)
      throw new Error(
        "Timed out waiting for another preview to finish registering."
      )
    child = spawn(
      process.execPath,
      [portless, name, process.execPath, self, "--registered", marker, ...args],
      {
        env,
        stdio: "inherit",
        detached: true,
      }
    )
    const exited = once(child, "exit")
    const deadline = Date.now() + 60_000
    while (
      !existsSync(marker) &&
      child.exitCode === null &&
      child.signalCode === null
    ) {
      if (Date.now() > deadline) {
        child.kill("SIGTERM")
        throw new Error(
          "Portless did not register the preview within 60 seconds."
        )
      }
      await delay(50)
    }
    registered = existsSync(marker)
    if (pendingSignal && registered) child.kill(pendingSignal)
    while (
      registered &&
      !pendingSignal &&
      child.exitCode === null &&
      child.signalCode === null
    ) {
      const listening = await new Promise((resolve) => {
        const socket = createConnection({
          host: "127.0.0.1",
          port: Number(readFileSync(marker, "utf8")),
        })
        const finish = (value) => {
          socket.destroy()
          resolve(value)
        }
        socket.once("connect", () => finish(true))
        socket.once("error", () => finish(false))
        socket.setTimeout(200, () => finish(false))
      })
      if (listening) break
      if (Date.now() > deadline) {
        child.kill("SIGTERM")
        throw new Error(
          "Preview did not listen on its assigned port within 60 seconds."
        )
      }
      await delay(50)
    }
    // Closing our last copy of the descriptor releases the advisory lock.
    closeSync(lock)
    lock = undefined
    rmSync(temporary, { recursive: true, force: true })
    const [code] = await exited
    process.exitCode = code ?? 1
  } catch (error) {
    if (child) child.kill("SIGTERM")
    if (lock !== undefined) closeSync(lock)
    rmSync(temporary, { recursive: true, force: true })
    throw error
  }
}

run().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
