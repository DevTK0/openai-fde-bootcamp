// @vitest-environment node
import { DatabaseSync } from "node:sqlite"
import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { Decision, LiveEvent } from "@/lib/live/contracts"
const draft = (event: LiveEvent): Decision => ({
  id: "00000000-0000-4000-8000-000000000001",
  eventSeq: event.seq,
  service: event.service,
  serviceDate: event.serviceDate,
  createdAt: new Date().toISOString(),
  title: "Agent-proposed recovery",
  summary: "Model decision",
  priority: "urgent",
  status: "open",
  action: "Confirm replacement cover",
  origin: "agent",
  evidenceSeqs: [event.seq],
  reasons: [],
  alternatives: [],
  trace: [],
  sourceHash: null,
  suggestedCandidateId: null,
  model: { status: "completed", name: "mock-model", summary: "Model decision" },
  reviewedAt: null,
  reviewNote: null,
  version: 1,
})
const agent = vi.hoisted(() => vi.fn())
vi.mock("@/lib/live/agent", () => ({ assessWithAgent: agent }))
beforeEach(() => {
  vi.resetModules()
  vi.stubEnv(
    "PLANNING_DB_PATH",
    join(mkdtempSync(join(tmpdir(), "lionlink-monitor-")), "test.sqlite")
  )
  agent.mockReset()
  agent.mockImplementation(async (event: LiveEvent) => draft(event))
})
afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})
const insert = (db: DatabaseSync) =>
  db
    .prepare(
      "INSERT INTO live_events(kind,service,service_date,title,vehicle_id,occurred_at) VALUES('fault','235','2026-10-07','Brake warning','NW-V001','2026-10-07T05:49:00+08:00')"
    )
    .run()
describe("agent database monitor", () => {
  it("persists the inferred service and fault separately from the original free text, retaining the hold for future assessments", async () => {
    const store = await import("@/lib/live/store"),
      worker = await import("@/lib/live/worker"),
      { reportSchema } = await import("@/lib/live/contracts")
    const raw = store.insertLiveEvent(
      reportSchema.parse({
        details: "NW-V002 on service 238 has a brake warning.",
        serviceDate: "2026-10-07",
        occurredAt: "2026-10-07T07:20:00+08:00",
      })
    )
    agent.mockImplementation(async (event: LiveEvent) => ({
      ...draft(event),
      service: "238",
      agent: {
        interpretation: {
          signalTypes: ["fault"],
          service: "238",
          vehicleId: "NW-V002",
          stopCode: null,
          delaySeconds: null,
          waitingPeople: null,
          repairArea: "brakes",
          summary: "Reported brake fault.",
        },
        confidence: "medium",
        insights: [],
        recommendations: [],
        evidence: [],
        proposals: [],
        caveats: [],
        usage: { inputTokens: 0, outputTokens: 0, requests: 1 },
      },
    }))
    store.heartbeat("worker-a")
    store.updateMonitorSettings({ llmEnabled: true })
    await worker.processLiveEvent("worker-a")
    expect(store.liveSnapshot().events[0]).toMatchObject({
      kind: "observation",
      service: "network",
      vehicleId: null,
      details: raw.details,
    })
    expect(store.liveSnapshot().decisions[0]?.service).toBe("238")
    expect(
      store.agentFaultContext(raw, raw.occurredAt)[0]?.record.vehicleId
    ).toBe("NW-V002")
    expect(
      store.agentEventHistory(raw, raw.occurredAt, 14, "238")
    ).toHaveLength(1)
    expect(store.requestAgentAssessment("238").service).toBe("238")
  })
  it("discovers direct inserts exactly once and persists only the model assessment and versioned human review", async () => {
    const store = await import("@/lib/live/store"),
      worker = await import("@/lib/live/worker")
    expect(store.heartbeat("worker-a")).toBe(true)
    expect(store.heartbeat("worker-b")).toBe(false)
    store.updateMonitorSettings({ llmEnabled: true })
    const db = new DatabaseSync(store.liveDatabasePath)
    insert(db)
    db.close()
    expect(await worker.processLiveEvent("worker-a")).toBe(true)
    expect(await worker.processLiveEvent("worker-a")).toBe(false)
    expect(agent).toHaveBeenCalledTimes(1)
    const snapshot = store.liveSnapshot()
    expect(snapshot.decisions[0]).toMatchObject({
      origin: "agent",
      title: "Agent-proposed recovery",
    })
    store.reviewLiveDecision(
      snapshot.decisions[0]!.id,
      1,
      "acknowledged",
      "Requested replacement cover"
    )
    expect(() =>
      store.reviewLiveDecision(
        snapshot.decisions[0]!.id,
        1,
        "dismissed",
        "Stale review"
      )
    ).toThrow(/changed/)
    store.releaseMonitor("worker-a")
  })
  it("leaves events queued when OpenAI is disabled or monitoring is paused", async () => {
    const store = await import("@/lib/live/store"),
      worker = await import("@/lib/live/worker")
    store.heartbeat("worker")
    const db = new DatabaseSync(store.liveDatabasePath)
    insert(db)
    db.close()
    expect(await worker.processLiveEvent("worker")).toBe(false)
    store.updateMonitorSettings({ llmEnabled: true, paused: true })
    expect(await worker.processLiveEvent("worker")).toBe(false)
    store.updateMonitorSettings({ paused: false })
    expect(await worker.processLiveEvent("worker")).toBe(true)
    expect(agent).toHaveBeenCalledTimes(1)
    store.releaseMonitor("worker")
  })
  it("records an API failure and never substitutes a rule-generated decision", async () => {
    agent.mockRejectedValueOnce(new Error("OpenAI unavailable"))
    const store = await import("@/lib/live/store"),
      worker = await import("@/lib/live/worker")
    store.heartbeat("worker")
    store.updateMonitorSettings({ llmEnabled: true })
    const db = new DatabaseSync(store.liveDatabasePath)
    insert(db)
    db.close()
    await worker.processLiveEvent("worker")
    expect(store.liveSnapshot()).toMatchObject({
      decisions: [],
      runs: [{ status: "failed", error: "OpenAI unavailable" }],
    })
    store.releaseMonitor("worker")
  })
  it("quarantines malformed inserts and makes reassessment requests without fabricating another observation", async () => {
    const store = await import("@/lib/live/store")
    store.heartbeat("worker")
    const db = new DatabaseSync(store.liveDatabasePath)
    db.prepare(
      "INSERT INTO live_events(kind,service,service_date,title,occurred_at) VALUES('fault','235','2026-10-07','Invalid fault','bad-time')"
    ).run()
    insert(db)
    db.close()
    expect(store.claimLiveEvent("worker")).toBeNull()
    expect(store.liveSnapshot().invalid).toBe(1)
    expect(store.requestAgentAssessment("235")).toMatchObject({
      kind: "analysis",
      delaySeconds: null,
      waitingPeople: null,
      vehicleId: null,
    })
    store.releaseMonitor("worker")
  })
})
