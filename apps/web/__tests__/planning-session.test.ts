// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest"
import { GET, POST } from "@/app/api/planning/route"

vi.mock("@/lib/planning-server", () => ({
  planningStream: () => new ReadableStream({ start: (c) => c.close() }),
  planningAudit: () => ({ files: [] }),
}))
afterEach(() => {
  vi.unstubAllEnvs()
  vi.useRealTimers()
})

it("uses a cookie-safe session that cannot reveal or replace the operator key", async () => {
  vi.stubEnv("OPS_PLANNING_ACCESS_KEY", "alpha;beta")
  const first = await POST(
    new Request("https://example.test/api/planning", {
      method: "POST",
      headers: { authorization: "Bearer alpha;beta" },
      body: JSON.stringify({ kind: "coordinated", scenario: "toa_bus" }),
    })
  )
  expect(first.status).toBe(200)
  const cookie = first.headers.get("set-cookie")?.split(";")[0] ?? ""
  expect(cookie).not.toContain("alpha")
  const next = await POST(
    new Request("https://example.test/api/planning", {
      method: "POST",
      headers: { cookie },
      body: JSON.stringify({ kind: "coordinated", scenario: "toa_bus" }),
    })
  )
  expect(next.status).toBe(200)
  const url =
    "https://example.test/api/planning?run=00000000-0000-4000-8000-000000000000"
  expect((await GET(new Request(url, { headers: { cookie } }))).status).toBe(
    200
  )
  expect(
    (await GET(new Request(url, { headers: { cookie: cookie + "x" } }))).status
  ).toBe(401)
  expect(
    (
      await GET(
        new Request(url, {
          headers: {
            authorization: "Bearer " + cookie.split("=")[1],
          },
        })
      )
    ).status
  ).toBe(401)
  vi.useFakeTimers()
  vi.setSystemTime(Date.now() + 8 * 60 * 60 * 1000 + 1000)
  expect((await GET(new Request(url, { headers: { cookie } }))).status).toBe(
    401
  )
})
