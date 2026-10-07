// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest"
import { clearDataMallCacheForTests, getBusArrivals } from "@/lib/server/datamall"

describe("LTA DataMall adapter", () => {
  afterEach(() => {
    clearDataMallCacheForTests()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("normalizes the three estimates and caches for the shared 20-second interval", async () => {
    vi.stubEnv("LTA_API_KEY", "test-only")
    const fetchMock = vi.fn(async (_input: RequestInfo | URL) => new Response(JSON.stringify({
      Services: [{ ServiceNo: "235", Operator: "SBST", NextBus: {
        EstimatedArrival: new Date(Date.now() + 2 * 60_000).toISOString(), Monitored: 1, Load: "SDA", Feature: "WAB", Type: "SD",
      } }],
    }), { status: 200, headers: { "Content-Type": "application/json" } }))
    vi.stubGlobal("fetch", fetchMock)
    const first = await getBusArrivals("52009", "235")
    const second = await getBusArrivals("52009", "235")
    expect(first.state).toBe("live")
    expect(first.services[0]?.buses[0]).toMatchObject({ monitored: true, load: "SDA", feature: "WAB", vehicleType: "SD" })
    expect(second.cacheAgeSeconds).toBe(0)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("/v3/BusArrival?")
  })

  it("returns an explicit empty state when estimates are absent", async () => {
    vi.stubEnv("LTA_API_KEY", "test-only")
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ Services: [{ ServiceNo: "235" }] }), { status: 200 })))
    const result = await getBusArrivals("52009", "235")
    expect(result.state).toBe("empty")
    expect(result.message).toContain("No arrival estimates")
  })

  it("reports offline without exposing upstream details", async () => {
    vi.stubEnv("LTA_API_KEY", "test-only")
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("secret upstream diagnostic") }))
    const result = await getBusArrivals("52009", "235")
    expect(result.state).toBe("offline")
    expect(result.message).not.toContain("secret")
  })
})
