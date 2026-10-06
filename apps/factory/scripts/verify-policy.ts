import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"
import assert from "node:assert/strict"
import { agentPolicyArgs } from "../lib/agent-policy"

const directory = await mkdtemp(join(tmpdir(), "factory-policy-"))
const workspace = join(directory, "workspace")
const secret = join(directory, "host-secret")
try {
  const { mkdir } = await import("node:fs/promises")
  await mkdir(workspace)
  await writeFile(secret, "fixture secret, not a credential")
  const program = `const fs=require('node:fs');const assert=require('node:assert/strict');assert.throws(()=>fs.readFileSync(${JSON.stringify(secret)}));fs.writeFileSync('allowed.txt','workspace write succeeded');process.stdout.write('PASS host read denied and workspace write allowed\\n')`
  const result = spawnSync(
    process.env.FACTORY_CODEX_BIN || "codex",
    [
      "sandbox",
      ...agentPolicyArgs(),
      "-P",
      "factory",
      "-C",
      workspace,
      "--",
      "/usr/bin/node",
      "-e",
      program,
    ],
    { encoding: "utf8" }
  )
  assert.equal(result.status, 0, result.stderr || result.error?.message)
  assert.equal(
    await readFile(join(workspace, "allowed.txt"), "utf8"),
    "workspace write succeeded"
  )
  process.stdout.write(
    result.stdout || "PASS host read denied and workspace write allowed\n"
  )
} finally {
  await rm(directory, { recursive: true, force: true })
}
