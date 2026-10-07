import assert from "node:assert/strict"
import { spawn, execFileSync } from "node:child_process"
import { once } from "node:events"
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises"
import { createServer } from "node:net"
import { get } from "node:http"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { setTimeout as delay } from "node:timers/promises"
import { test } from "node:test"

const launcher = fileURLToPath(new URL("./dev.mjs", import.meta.url))
const portless = fileURLToPath(
  new URL("../node_modules/portless/dist/cli.js", import.meta.url)
)

async function eventually(check) {
  const deadline = Date.now() + 30_000
  while (Date.now() < deadline) {
    if (await check()) return
    await delay(100)
  }
  assert.fail("Preview did not reach the expected state within 30 seconds")
}

test(
  "concurrent previews, duplicate refusal, isolated stop, failed command, early stop",
  { timeout: 120_000 },
  async () => {
    const directory = await mkdtemp(join(tmpdir(), "preview-test-"))
    const socket = createServer()
    socket.listen(0, "127.0.0.1")
    await once(socket, "listening")
    const proxyPort = socket.address().port
    await new Promise((resolve) => socket.close(resolve))
    const tailscale = process.env.PREVIEW_TEST_TAILSCALE === "1"
    const serveStatus = () =>
      JSON.parse(
        execFileSync("tailscale", ["serve", "status", "--json"], {
          encoding: "utf8",
        })
      )
    const serveBefore = tailscale ? serveStatus() : undefined
    const env = {
      ...process.env,
      PORTLESS_PORT: String(proxyPort),
      PORTLESS_STATE_DIR: join(directory, "state"),
      PORTLESS_TAILSCALE: tailscale ? "1" : "0",
      PORTLESS_HTTPS: "0",
      PORTLESS_SYNC_HOSTS: "0",
    }
    const children = []
    const start = (cwd, command = [process.execPath, "server.mjs"]) => {
      const child = spawn(process.execPath, [launcher, ...command], {
        cwd,
        env,
        stdio: ["ignore", "pipe", "pipe"],
      })
      const result = { child, output: "", exit: once(child, "exit") }
      child.stdout.on("data", (data) => {
        result.output += data
      })
      child.stderr.on("data", (data) => {
        result.output += data
      })
      children.push(result)
      return result
    }
    const stop = async (result) => {
      result.child.kill("SIGTERM")
      await result.exit
    }
    const url = (result) => result.output.match(/Preview: (http:\/\/\S+)/)?.[1]
    const read = async (result) => {
      if (!url(result)) return ""
      const address = new URL(url(result))
      return new Promise((resolve) => {
        const request = get(
          {
            hostname: "127.0.0.1",
            port: proxyPort,
            path: address.pathname,
            headers: { Host: address.host },
            timeout: 1000,
          },
          (response) => {
            let body = ""
            response.on("data", (data) => {
              body += data
            })
            response.on("end", () =>
              resolve(response.statusCode === 200 ? body : "")
            )
          }
        )
        request.on("timeout", () => request.destroy())
        request.on("error", () => resolve(""))
      })
    }
    try {
      const dirs = await Promise.all(
        ["one", "two", "failed", "early"].map(async (name) => {
          const cwd = join(directory, name)
          await mkdir(cwd)
          await writeFile(
            join(cwd, "package.json"),
            JSON.stringify({
              name: "same-package",
              devPreview: { path: "/docs/" },
            })
          )
          await writeFile(
            join(cwd, "server.mjs"),
            `import { createServer } from 'node:http'; createServer((req, res) => res.end(${JSON.stringify(name)} + req.url)).listen(Number(process.env.PORT), '127.0.0.1')`
          )
          return cwd
        })
      )
      const first = start(dirs[0])
      const second = start(dirs[1])
      await eventually(
        async () =>
          (await read(first)) === "one/docs/" &&
          (await read(second)) === "two/docs/"
      )
      assert.notEqual(url(first), url(second))
      if (tailscale) {
        const remote = (result) =>
          result.output.match(/Preview: (https:\/\/\S+)/)?.[1]
        assert.ok(remote(first))
        assert.ok(remote(second))
        assert.notEqual(remote(first), remote(second))
        assert.equal(
          await (
            await fetch(remote(first), { signal: AbortSignal.timeout(5000) })
          ).text(),
          "one/docs/"
        )
        assert.equal(
          await (
            await fetch(remote(second), { signal: AbortSignal.timeout(5000) })
          ).text(),
          "two/docs/"
        )
      }
      const duplicate = start(dirs[0])
      assert.notEqual((await duplicate.exit)[0], 0, duplicate.output)
      assert.equal(await read(first), "one/docs/")
      await stop(first)
      assert.equal(await read(first), "")
      assert.equal(await read(second), "two/docs/")
      const failed = start(dirs[2], ["nonexistent-preview-command"])
      assert.notEqual((await failed.exit)[0], 0)
      assert.equal(await read(failed), "")
      const early = start(dirs[3])
      await eventually(() => early.output.includes("portless"))
      await stop(early)
      assert.equal(await read(early), "")
      assert.equal(await read(second), "two/docs/")
    } finally {
      await Promise.all(children.map(stop))
      const proxy = spawn(process.execPath, [portless, "proxy", "stop"], {
        env,
        stdio: "ignore",
      })
      await once(proxy, "exit")
      await rm(directory, { recursive: true, force: true })
      if (tailscale) assert.deepEqual(serveStatus(), serveBefore)
    }
  }
)
