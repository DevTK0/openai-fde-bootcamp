// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest"
import { planningAuthorized } from "@/lib/planning-access"

afterEach(() => vi.unstubAllEnvs())
describe("planner operator access", () => {
  it("fails closed without a server key or with incorrect credentials", () => {
    vi.stubEnv("OPS_PLANNING_ACCESS_KEY", "")
    expect(planningAuthorized(new Request("https://example.test"))).toBe(false)
    vi.stubEnv("OPS_PLANNING_ACCESS_KEY", "test-operator")
    expect(
      planningAuthorized(
        new Request("https://example.test", {
          headers: { authorization: "Bearer wrong" },
        })
      )
    ).toBe(false)
  })
  it("accepts the configured operator but not a raw key in a cookie", () => {
    vi.stubEnv("OPS_PLANNING_ACCESS_KEY", "test-operator")
    expect(
      planningAuthorized(
        new Request("https://example.test", {
          headers: { authorization: "Bearer test-operator" },
        })
      )
    ).toBe(true)
    expect(
      planningAuthorized(
        new Request("https://example.test", {
          headers: { cookie: "ops-planning-access=test-operator" },
        })
      )
    ).toBe(false)
  })
})
