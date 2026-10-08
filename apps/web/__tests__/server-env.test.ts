// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest"
import { getOpenAIConfig } from "@/lib/server/env"

describe("OpenAI model configuration", () => {
  afterEach(() => vi.unstubAllEnvs())

  it("defaults to gpt-6-luna when OPENAI_MODEL is unset", () => {
    vi.stubEnv("OPENAI_MODEL", "")
    expect(getOpenAIConfig().model).toBe("gpt-6-luna")
  })

  it("allows an explicit model override", () => {
    vi.stubEnv("OPENAI_MODEL", "test-override-model")
    expect(getOpenAIConfig().model).toBe("test-override-model")
  })
})
