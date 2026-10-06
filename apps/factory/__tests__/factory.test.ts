import { afterEach, describe, expect, it } from "vitest"
import { randomUUID } from "node:crypto"
import { mkdtemp, writeFile, readFile, rm, chmod } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { DatabaseSync } from "node:sqlite"
import { Store } from "../lib/store"
import { MAGIC_PHRASE, commandSchema, snapshotSchema } from "../lib/contracts"
import { execute, runOnce } from "../lib/runner"
import type { RunnerConfig } from "../lib/config"
import { handle } from "../lib/http"

const directories: string[] = []
const stores: Store[] = []
const originalEnv = { ...process.env }
afterEach(async () => {
  for (const store of stores.splice(0)) store.close()
  for (const directory of directories.splice(0))
    await rm(directory, { recursive: true, force: true })
  process.env = { ...originalEnv }
})
async function setup(mode = "implemented") {
  const directory = await mkdtemp(join(tmpdir(), "factory-test-"))
  directories.push(directory)
  const repo = join(directory, "repo")
  const result = await execute("git", ["init", "-b", "main", repo], directory)
  expect(result.exitCode).toBe(0)
  await execute("git", ["config", "user.email", "fixture@example.test"], repo)
  await execute("git", ["config", "user.name", "Factory fixture"], repo)
  await writeFile(join(repo, "mode.txt"), mode)
  await execute("git", ["add", "."], repo)
  await execute("git", ["commit", "-m", "fixture"], repo)
  const fixture = join(directory, "agent-fixture.mjs")
  await writeFile(
    fixture,
    `#!/usr/bin/env node
import {readFile, writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const args = process.argv.slice(2);
if (args[0] === 'login') process.exit(0);
const output = args[args.indexOf('--output-last-message') + 1];
let prompt = ''; for await (const chunk of process.stdin) prompt += chunk;
const mode = (await readFile('mode.txt', 'utf8')).trim();
if (mode === 'slow') await new Promise(resolve => setTimeout(resolve, 20000));
if (mode === 'bad') process.exit(3);
const answer = prompt.includes('Use the dispatch dashboard');
if (mode === 'clarify' && !answer) {
  await writeFile(output, JSON.stringify({kind:'clarification',question:'Which dashboard should change?',summary:null}));
} else {
  await writeFile('feature.js', 'export const dispatchReady = true;\\n');
  if (mode === 'commit') { execFileSync('git', ['add', 'feature.js']); execFileSync('git', ['commit', '-m', 'Agent implementation']); }
  await writeFile(output, JSON.stringify({kind:'implemented',summary:'Added dispatch readiness.',question:null}));
}
`
  )
  await chmod(fixture, 0o755)
  const dbPath = join(directory, "data", "factory.sqlite")
  const store = new Store(dbPath)
  stores.push(store)
  const conversationId = randomUUID()
  store.apply({
    kind: "create",
    id: conversationId,
    title: "Dispatch feedback",
  })
  const config: RunnerConfig = {
    repo,
    dataDir: join(directory, "data"),
    codex: fixture,
    check: { command: process.execPath, args: ["--check", "feature.js"] },
    prepare: null,
    timeoutMs: 10000,
  }
  function submit(text: string, id = randomUUID()) {
    return store.apply({
      kind: "segment",
      id,
      conversationId,
      speaker: "Dispatcher",
      text,
    })
  }
  return { directory, repo, store, config, submit, conversationId, dbPath }
}

describe("durable factory", () => {
  it("captures context and a split phrase exactly once across duplicate deliveries and restarts", async () => {
    const { store, submit, conversationId, dbPath } = await setup()
    submit("Dispatchers cannot see the train's readiness.")
    submit("I think we can get the software")
    const segmentId = randomUUID()
    const snapshot = submit("factory to do this!", segmentId)
    expect(snapshot.requests).toHaveLength(1)
    expect(snapshot.requests[0]?.context.map((value) => value.text)).toEqual([
      "Dispatchers cannot see the train's readiness.",
      "I think we can get the software",
      "factory to do this!",
    ])
    expect(submit("factory to do this!", segmentId).requests).toHaveLength(1)
    expect(submit("Next, let's discuss lunch.").requests).toHaveLength(1)
    expect(() => submit("Different content", segmentId)).toThrow(
      "different content"
    )
    const reopened = new Store(dbPath)
    expect(reopened.snapshot(conversationId).requests).toEqual(
      store.snapshot(conversationId).requests
    )
    reopened.close()
    expect(
      submit("I think we could get the factory to do this").requests
    ).toHaveLength(1)
    expect(submit(MAGIC_PHRASE.toUpperCase()).requests).toHaveLength(2)
  })
  it("runs a real isolated git worktree and exposes actual checked code with a controlled agent fixture", async () => {
    const { store, submit, config, repo } = await setup()
    submit("Add dispatch readiness. " + MAGIC_PHRASE)
    expect(await runOnce(config, store)).toBe(true)
    const request = store.snapshot().requests[0]
    expect(request?.state.kind).toBe("ready")
    if (request?.state.kind !== "ready")
      throw new Error(JSON.stringify(request))
    expect(request.state.diff).toContain("+export const dispatchReady = true;")
    expect(request.state.checks.exitCode).toBe(0)
    expect(
      await readFile(join(request.state.worktree, "feature.js"), "utf8")
    ).toBe("export const dispatchReady = true;\n")
    await expect(readFile(join(repo, "feature.js"), "utf8")).rejects.toThrow()
    expect((await execute("git", ["status", "--porcelain"], repo)).output).toBe(
      ""
    )
    expect(await runOnce(config, store)).toBe(false)
  })
  it("includes an agent-created commit in the reviewed diff", async () => {
    const { store, submit, config } = await setup("commit")
    submit(MAGIC_PHRASE)
    await runOnce(config, store)
    const request = store.snapshot().requests[0]
    expect(request?.state.kind).toBe("ready")
    if (request?.state.kind === "ready")
      expect(request.state.diff).toContain(
        "+export const dispatchReady = true;"
      )
  })
  it("terminates a timed-out agent and keeps its request failed", async () => {
    const { store, submit, config } = await setup("slow")
    submit(MAGIC_PHRASE)
    await runOnce({ ...config, timeoutMs: 150 }, store)
    expect(store.snapshot().requests[0]?.state).toEqual({
      kind: "failed",
      reason: "Codex exited with code -1. Inspect the attempt log.",
    })
  })
  it("keeps host files and credentials outside generated-code validation", async () => {
    const { store, submit, config, directory } = await setup()
    const secret = join(directory, "operator-secret")
    await writeFile(secret, "must not be readable")
    process.env.OPENAI_API_KEY = "fixture-secret"
    process.env.CODEX_API_KEY = "fixture-secret"
    submit(MAGIC_PHRASE)
    await runOnce(
      {
        ...config,
        check: {
          command: "/usr/bin/node",
          args: [
            "-e",
            `const fs=require('node:fs'); if (fs.existsSync(${JSON.stringify(secret)}) || process.env.OPENAI_API_KEY || process.env.CODEX_API_KEY || process.env.CODEX_HOME || process.env.HOME !== '/tmp') process.exit(9);`,
          ],
        },
      },
      store
    )
    expect(store.snapshot().requests[0]?.state.kind).toBe("ready")
  })
  it("persists clarification and uses the answer in a fresh implementation attempt", async () => {
    const { store, submit, config } = await setup("clarify")
    submit(MAGIC_PHRASE)
    await runOnce(config, store)
    const request = store.snapshot().requests[0]
    if (!request) throw new Error("Missing request")
    expect(request.state).toEqual({
      kind: "clarification",
      question: "Which dashboard should change?",
    })
    store.apply({
      kind: "answer",
      requestId: request.id,
      answer: "Use the dispatch dashboard",
    })
    await runOnce(config, store)
    expect(store.getRequest(request.id).state.kind).toBe("ready")
    expect(store.getRequest(request.id).attempt).toBe(2)
  })
  it("fails honestly on check failure, then retries in a separate worktree", async () => {
    const { store, submit, config } = await setup()
    submit(MAGIC_PHRASE)
    await runOnce(
      {
        ...config,
        check: { command: process.execPath, args: ["-e", "process.exit(7)"] },
      },
      store
    )
    const request = store.snapshot().requests[0]
    if (!request) throw new Error("Missing request")
    expect(request.state).toEqual({
      kind: "failed",
      reason:
        "Validation failed with code 7. Inspect checks.log in the preserved attempt.",
    })
    store.apply({ kind: "retry", requestId: request.id })
    await runOnce(config, store)
    const final = store.getRequest(request.id)
    expect(final.attempt).toBe(2)
    expect(final.state.kind).toBe("ready")
    if (final.state.kind === "ready")
      expect(final.state.worktree).toContain("/2/worktree")
    await expect(
      readFile(join(config.dataDir, "attempts", request.id, "1", "checks.log"))
    ).resolves.toBeDefined()
  })
  it("cancels a running child and never overwrites cancellation with a late result", async () => {
    const { store, submit, config } = await setup("slow")
    const request = submit(MAGIC_PHRASE).requests[0]
    if (!request) throw new Error("Missing request")
    const running = runOnce(config, store)
    await new Promise((resolve) => setTimeout(resolve, 250))
    store.apply({ kind: "cancel", requestId: request.id })
    await running
    expect(store.getRequest(request.id).state).toEqual({ kind: "cancelled" })
    await expect(
      readFile(
        join(
          config.dataDir,
          "attempts",
          request.id,
          "1",
          "worktree",
          "feature.js"
        )
      )
    ).rejects.toThrow()
  })
  it("recovers interrupted work as failed and rejects a second live worker", async () => {
    const { store, submit, dbPath } = await setup()
    const request = submit(MAGIC_PHRASE).requests[0]
    if (!request) throw new Error("Missing request")
    store.ownWorker()
    expect(() => store.ownWorker()).toThrow("already owns")
    store.claim()
    const db = new DatabaseSync(dbPath)
    db.prepare("UPDATE worker SET pid=99999999").run()
    db.close()
    store.ownWorker()
    expect(store.getRequest(request.id).state.kind).toBe("failed")
    expect(store.snapshot().configuration.worker).toBe("ready")
    store.heartbeat("Missing credentials")
    expect(store.snapshot().configuration).toEqual({
      worker: "blocked",
      reason: "Missing credentials",
    })
    store.releaseWorker()
    expect(store.snapshot().configuration.worker).toBe("offline")
  })
  it("guards HTTP access, rejects malformed commands, and returns persisted snapshots", async () => {
    const { directory } = await setup()
    process.env.FACTORY_DATA_DIR = join(directory, "http")
    delete process.env.FACTORY_ACCESS_TOKEN
    expect(
      (await handle(new Request("http://factory/api/factory"))).status
    ).toBe(503)
    process.env.FACTORY_ACCESS_TOKEN =
      "test-access-token-at-least-24-characters"
    expect(
      (await handle(new Request("http://factory/api/factory"))).status
    ).toBe(401)
    const headers = {
      authorization: "Bearer " + process.env.FACTORY_ACCESS_TOKEN,
      "content-type": "application/json",
    }
    const command = {
      kind: "create",
      id: randomUUID(),
      title: "Live conversation",
    }
    const response = await handle(
      new Request("http://factory/api/factory", {
        method: "POST",
        headers,
        body: JSON.stringify(command),
      })
    )
    expect(response.status).toBe(200)
    expect(
      snapshotSchema.parse(await response.json()).conversation?.title
    ).toBe("Live conversation")
    expect(
      (
        await handle(
          new Request("http://factory/api/factory", {
            method: "POST",
            headers,
            body: "{}",
          })
        )
      ).status
    ).toBe(400)
    expect(
      commandSchema.safeParse({ kind: "segment", id: "bad" }).success
    ).toBe(false)
  })
})
