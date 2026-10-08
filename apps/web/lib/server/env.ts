import { readFileSync } from "node:fs"
import { basename, dirname, resolve } from "node:path"
import { parseEnv } from "node:util"

if (typeof window !== "undefined") {
  throw new Error("Planning provider configuration is server-only.")
}

const cwd = resolve(process.cwd())
const appDirectory = basename(cwd) === "web" && basename(dirname(cwd)) === "apps"
  ? cwd
  : resolve(cwd, "apps/web")
const localEnvPath = resolve(dirname(appDirectory), ".env")
let fileEnv: Record<string, string | undefined> | undefined

function getFileEnv() {
  if (fileEnv) return fileEnv
  try {
    fileEnv = parseEnv(readFileSync(localEnvPath, "utf8"))
  } catch {
    fileEnv = {}
  }
  return fileEnv
}

function value(name: string) {
  return process.env[name]?.trim() || getFileEnv()[name]?.trim() || undefined
}

export function getOpenAIConfig() {
  return {
    apiKey: value("OPENAI_API_KEY"),
    model: value("OPENAI_MODEL") || "gpt-6-luna",
  }
}

export function getDataMallConfig() {
  return {
    apiKey:
      value("LTA_API_KEY") ||
      value("LTA_DATAMALL_API_KEY") ||
      value("LTA_ACCOUNT_KEY") ||
      value("DATAMALL_API_KEY"),
  }
}

export function getProviderStatus() {
  return {
    openai: { configured: Boolean(getOpenAIConfig().apiKey) },
    dataMall: { configured: Boolean(getDataMallConfig().apiKey) },
  }
}
