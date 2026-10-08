// @vitest-environment node
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { z } from "zod"
import { POST } from "@/app/api/repairs/analyze/route"
import { repairEvidenceSchema, repairResultSchema } from "@/lib/repairs/schema"

const input = {
  vehicle: "NW-W001",
  date: "2026-10-07",
  report: "The passenger door intermittently fails to close.",
}
const analysis = {
  summary: "Door fault reported; engineering checks are needed.",
  hypotheses: [
    {
      cause: "Door mechanism issue",
      rationale: "A reported symptom, not a confirmed cause.",
      evidenceIds: ["report", "order:workshop_work_orders:NW-WO0001"],
    },
  ],
  checks: [
    {
      action: "Ask engineering to inspect the door mechanism.",
      reason: "Confirm the condition behind the reported symptom.",
    },
  ],
  questions: ["Which door is affected?"],
  areas: [
    {
      id: "doors",
      reason: "The report does not identify a specific door.",
      evidenceIds: ["report"],
    },
  ],
}
function submit(body: unknown = input, headers: Record<string, string> = {}) {
  return POST(
    new Request("http://localhost/api/repairs/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "http://localhost",
        ...headers,
      },
      body: JSON.stringify(body),
    })
  )
}
function provider(output: unknown = analysis) {
  vi.stubEnv("OPENAI_API_KEY", "test-key")
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({
        status: "completed",
        output: [
          {
            type: "message",
            content: [{ type: "output_text", text: JSON.stringify(output) }],
          },
        ],
      })
    )
  )
}
let clock = Date.now()
beforeEach(() => {
  clock += 61_000
  vi.spyOn(Date, "now").mockImplementation(() => clock)
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

it("returns authoritative workshop evidence alongside cited hypotheses", async () => {
  provider()
  const response = await submit()
  expect(response.status).toBe(200)
  const result = repairResultSchema.parse(await response.json())
  expect(result.request).toEqual(input)
  expect(result.analysis).toEqual(analysis)
  expect(
    result.evidence.find((e) => e.id === "order:workshop_work_orders:NW-WO0001")
      ?.detail
  ).toContain("Reported fault: Door mechanism inspection")
  expect(
    result.evidence.find((e) => e.id === "order:workshop_work_orders:NW-WO0001")
      ?.detail
  ).toContain("Confirmed release: Unknown")
  expect(
    result.evidence.some((e) => e.detail.includes("Warm passenger saloon"))
  ).toBe(false)
  expect(result.trips).toEqual([])
})
it("supplies only the selected vehicle's records and excludes future orders", async () => {
  vi.stubEnv("OPENAI_API_KEY", "test-key")
  let evidence: z.infer<typeof repairEvidenceSchema>[] = []
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url: unknown, init: RequestInit) => {
      const body = z
        .object({ input: z.string(), store: z.literal(false) })
        .parse(JSON.parse(String(init.body)))
      evidence = z
        .object({ evidence: z.array(repairEvidenceSchema) })
        .parse(JSON.parse(body.input)).evidence
      return Response.json({
        status: "completed",
        output: [
          {
            type: "message",
            content: [
              {
                type: "output_text",
                text: JSON.stringify({
                  ...analysis,
                  hypotheses: [],
                  areas: [],
                }),
              },
            ],
          },
        ],
      })
    })
  )
  const response = await submit({ ...input, vehicle: "NW-V020" })
  const result = repairResultSchema.parse(await response.json())
  expect(
    evidence.filter((e) => e.kind === "work_order").map((e) => e.title)
  ).toEqual([
    "NW-MWO002 · 01_maintenance_and_repairs/Repairs/8",
    "NW-MWO001 · 01_maintenance_and_repairs/Repairs/8",
  ])
  expect(evidence.some((e) => e.id.includes("NW-MWO003"))).toBe(false)
  expect(result.trips.map((t) => t.id)).toContain("NW-20261007-0020")
})
it("labels missing work-order evidence without inventing a record", async () => {
  provider({ ...analysis, hypotheses: [], areas: [] })
  const result = repairResultSchema.parse(
    await (await submit({ ...input, vehicle: "NW-V001" })).json()
  )
  expect(result.evidence.filter((e) => e.kind === "work_order")).toEqual([])
  expect(result.evidence[0]).toEqual({
    id: "report",
    kind: "report",
    title: "Operator report, unverified",
    detail: input.report,
  })
  expect(result.trips.map((t) => t.id)).toContain("NW-20261007-0001")
})
it("rejects invented or cross-vehicle citations and unsupported 3D areas", async () => {
  provider({
    ...analysis,
    hypotheses: [
      { ...analysis.hypotheses[0], evidenceIds: ["order:other:invented"] },
    ],
  })
  expect((await submit()).status).toBe(502)
  provider({
    ...analysis,
    areas: [{ id: "made_up_part", reason: "Fault", evidenceIds: ["report"] }],
  })
  expect((await submit()).status).toBe(502)
})
it("rejects untrusted records in the request, unknown vehicles, dates, and cross-origin requests", async () => {
  provider()
  expect((await submit({ ...input, evidence: [] })).status).toBe(400)
  expect((await submit({ ...input, report: "   " })).status).toBe(400)
  expect((await submit({ ...input, report: "x".repeat(4001) })).status).toBe(
    400
  )
  expect((await submit({ ...input, vehicle: "NO-SUCH-BUS" })).status).toBe(404)
  expect((await submit({ ...input, date: "1999-01-01" })).status).toBe(400)
  expect(
    (await submit(input, { origin: "https://other.example" })).status
  ).toBe(403)
  expect(vi.mocked(fetch)).not.toHaveBeenCalled()
})
it("returns actionable configuration and provider failures without exposing provider data", async () => {
  vi.stubEnv("OPENAI_API_KEY", "")
  expect((await submit()).status).toBe(503)
  provider()
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({ error: "secret-provider-details" }, { status: 429 })
    )
  )
  const response = await submit()
  expect(response.status).toBe(502)
  expect(await response.json()).toEqual({
    error: "Analysis is rate limited or out of quota. Please try again later.",
  })
})
it("rejects refusals and incomplete answers", async () => {
  provider()
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({
        status: "completed",
        output: [{ type: "message", content: [{ type: "refusal" }] }],
      })
    )
  )
  expect((await submit()).status).toBe(502)
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => Response.json({ status: "incomplete", output: [] }))
  )
  expect((await submit()).status).toBe(502)
})

it("accepts the HTTPS preview origin behind the app proxy", async () => {
  provider()
  const response = await submit(input, {
    origin: "https://preview.example:8463",
    "x-forwarded-host": "preview.example:8463",
  })
  expect(response.status).toBe(200)
})

it("rejects oversized body bytes before parsing or calling the provider", async () => {
  provider()
  const response = await POST(
    new Request("http://localhost/api/repairs/analyze", {
      method: "POST",
      headers: { origin: "http://localhost" },
      body: " ".repeat(40_000),
    })
  )
  expect(response.status).toBe(413)
  expect(vi.mocked(fetch)).not.toHaveBeenCalled()
})
it("bounds the shared provider quota even when clients vary forwarded addresses", async () => {
  provider()
  for (let index = 0; index < 6; index++)
    expect(
      (await submit(input, { "x-forwarded-for": `client-${index}` })).status
    ).toBe(200)
  const rejected = await submit(input, { "x-forwarded-for": "another-client" })
  expect(rejected.status).toBe(429)
  expect(rejected.headers.get("Retry-After")).toBe("60")
  expect(vi.mocked(fetch)).toHaveBeenCalledTimes(6)
  clock += 60_000
  expect((await submit()).status).toBe(200)
})
it("admits at most two concurrent investigations and releases capacity on failure", async () => {
  provider()
  const failures: (() => void)[] = []
  vi.stubGlobal(
    "fetch",
    vi.fn(
      () =>
        new Promise<Response>((_resolve, reject) => {
          failures.push(() => reject(new Error("provider disconnected")))
        })
    )
  )
  const first = submit(),
    second = submit()
  await vi.waitFor(() => expect(failures).toHaveLength(2))
  expect((await submit()).status).toBe(429)
  for (const fail of failures) fail()
  expect((await first).status).toBe(502)
  expect((await second).status).toBe(502)
  provider()
  expect((await submit()).status).toBe(200)
})
