import { resolve } from "node:path"
import { z } from "zod"

export function dataDirectory() {
  return resolve(
    /* turbopackIgnore: true */ process.env.FACTORY_DATA_DIR || ".factory"
  )
}
export const runnerConfigSchema = z.object({
  repo: z.string().min(1),
  dataDir: z.string().min(1),
  codex: z.string().min(1),
  check: z.object({ command: z.string().min(1), args: z.array(z.string()) }),
  prepare: z
    .object({ command: z.string().min(1), args: z.array(z.string()) })
    .nullable(),
  timeoutMs: z.number().int().min(100).max(3600000),
})
export type RunnerConfig = z.infer<typeof runnerConfigSchema>
export function readRunnerConfig(): RunnerConfig {
  if (process.env.FACTORY_CODEX_ENABLED !== "1")
    throw new Error(
      "Set FACTORY_CODEX_ENABLED=1 after configuring Codex authentication and a dedicated worker environment."
    )
  if (!process.env.FACTORY_REPO)
    throw new Error("Set FACTORY_REPO to the trusted repository path.")
  return runnerConfigSchema.parse({
    repo: resolve(process.env.FACTORY_REPO),
    dataDir: dataDirectory(),
    codex: process.env.FACTORY_CODEX_BIN || "codex",
    check: JSON.parse(
      process.env.FACTORY_CHECK_COMMAND || '{"command":"pnpm","args":["check"]}'
    ),
    prepare: JSON.parse(
      process.env.FACTORY_PREPARE_COMMAND ||
        '{"command":"pnpm","args":["install","--frozen-lockfile","--prod=false"]}'
    ),
    timeoutMs: Number(process.env.FACTORY_TIMEOUT_MS || 1200000),
  })
}
