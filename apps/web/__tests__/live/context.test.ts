// @vitest-environment node
import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { DatabaseSync } from "node:sqlite"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import type { LiveEvent } from "@/lib/live/contracts"
import { operationsManifest } from "@/lib/operations"
let context: typeof import("@/lib/live/context-db")
let proposals: typeof import("@/lib/live/proposals")
let path: string
beforeAll(async () => {
  vi.resetModules()
  path = join(mkdtempSync(join(tmpdir(), "lionlink-context-")), "test.sqlite")
  vi.stubEnv("PLANNING_DB_PATH", path)
  const store = await import("@/lib/live/store")
  store.monitorSettings()
  context = await import("@/lib/live/context-db")
  await context.ensureContextDatabase()
  proposals = await import("@/lib/live/proposals")
}, 30000)
afterAll(() => vi.unstubAllEnvs())
const asOf = "2026-10-06T23:20:00.000Z"
const event: LiveEvent = {
  seq: 1,
  id: "event1",
  kind: "crowding",
  service: "238",
  serviceDate: "2026-10-07",
  title: "Exercise queue",
  details: "",
  vehicleId: null,
  stopCode: "52009",
  waitingPeople: 58,
  delaySeconds: null,
  occurredAt: asOf,
  receivedAt: asOf,
  source: "demo",
}
describe("agent operational database", () => {
  it("keeps raw reports untyped and lets the agent interpret multiple signals before checking allocations", async () => {
    const { reportSchema } = await import("@/lib/live/contracts")
    const report = reportSchema.parse({
      details:
        "Service 238: NW-V002 reports a brake fault; about 58 people are waiting at stop 52009.",
      serviceDate: "2026-10-07",
      occurredAt: asOf,
    })
    expect(report).toMatchObject({
      kind: "observation",
      service: "network",
      vehicleId: null,
      waitingPeople: null,
    })
    const store = await import("@/lib/live/store")
    const raw = store.insertLiveEvent(report)
    expect(store.availableServices()).toContain("410G")
    expect(store.availableServices()).toHaveLength(24)
    const { AgentContext } = await import("@/lib/live/agent-tools")
    const session = new AgentContext(raw, asOf)
    const assignment = {
      tripId: "NW-20261007-0178",
      vehicleId: "NW-V002",
      crewId: "NW-C003",
      routeId: "B238_1",
      departureAt: "2026-10-07T07:25:00+08:00",
      arrivalAt: "2026-10-07T07:49:10+08:00",
    }
    await expect(
      session.run(
        "validate_assignment_plan",
        JSON.stringify({ assignments: [assignment] })
      )
    ).rejects.toThrow("Interpret the raw report")
    await session.run(
      "interpret_observation",
      JSON.stringify({
        signalTypes: ["fault", "crowding"],
        service: "238",
        vehicleId: "NW-V002",
        stopCode: "52009",
        delaySeconds: null,
        waitingPeople: 58,
        repairAreas: ["brakes", "air_system"],
        summary: "Reported brake fault and queue; not verified telemetry.",
      })
    )
    const result = (await session.run(
      "validate_assignment_plan",
      JSON.stringify({ assignments: [assignment] })
    )) as { status: string; conflicts: string[] }
    expect(result.status).toBe("blocked")
    expect(result.conflicts).toContain(
      "NW-V002 has an active reported fault and cannot be assigned."
    )
    expect(
      store.liveSnapshot().events.find((row) => row.seq === raw.seq)?.kind
    ).toBe("observation")
    await expect(
      session.run(
        "interpret_observation",
        JSON.stringify({
          signalTypes: ["clearance"],
          service: "238",
          vehicleId: "NW-V002",
          stopCode: null,
          delaySeconds: null,
          waitingPeople: null,
          repairAreas: [],
          summary: "Passenger says repaired.",
        })
      )
    ).rejects.toThrow("Engineering record")
  })
  it("preserves every source row including fleet inventory, route versions and repeated stop occurrences", () => {
    const db = new DatabaseSync(path)
    for (const table of operationsManifest.tables.filter(
      (table) => !table.id.startsWith("rail_")
    )) {
      const count = (
        db
          .prepare("SELECT count(*) n FROM ops_records WHERE table_name=?")
          .get(table.id) as { n: number }
      ).n
      expect(count, table.id).toBe(table.count)
    }
    db.close()
  })
  it("uses Singapore service dates across UTC midnight and withholds unobserved actual outcomes", () => {
    const rows = context.readContextRecords(
      "trips",
      [
        { field: "service_date", op: "eq", value: "2026-10-07" },
        { field: "service_no", op: "eq", value: "238" },
      ],
      asOf,
      50
    ).rows
    expect(rows.length).toBeGreaterThan(0)
    const trip = rows.find((row) => row.record.trip_id === "NW-20261007-0178")
    expect(trip?.record).toMatchObject({
      scheduled_departure_at: "2026-10-07T07:30:00+08:00",
      actual_departure_at: null,
      actual_arrival_at: null,
    })
    const data = context.operatingHistory("238", asOf, 7, "52009")
    expect(
      data.daily.some(
        (row) => row.date === "2026-10-07" && row.coverage.startsWith("Partial")
      )
    ).toBe(true)
    expect(
      context.readContextRecords(
        "trips",
        [{ field: "service_date", op: "eq", value: "2026-10-08" }],
        asOf
      ).rows
    ).toEqual([])
  })
  it("validates a model-authored retiming independently of preset candidates, and rejects faulty or nonexistent allocations", () => {
    const assignment = {
      tripId: "NW-20261007-0178",
      vehicleId: "NW-V002",
      crewId: "NW-C003",
      routeId: "B238_1",
      departureAt: "2026-10-07T07:25:00+08:00",
      arrivalAt: "2026-10-07T07:49:10+08:00",
    }
    const result = proposals.validateAgentProposal(
      [assignment],
      event,
      asOf,
      []
    )
    expect(result.status, JSON.stringify(result)).toBe("feasible")
    const fault = { ...event, kind: "fault" as const, vehicleId: "NW-V002" }
    expect(
      proposals.validateAgentProposal([assignment], event, asOf, [fault])
        .conflicts
    ).toContain("NW-V002 has an active reported fault and cannot be assigned.")
    expect(
      proposals.validateAgentProposal(
        [{ ...assignment, vehicleId: "NW-V999" }],
        event,
        asOf,
        []
      ).status
    ).toBe("blocked")
  })
  it("prevents arbitrary SQL/table access and bridges new context records into agent requests without restarting", async () => {
    expect(() => context.readContextRecords("sqlite_master", [], asOf)).toThrow(
      /Unknown/
    )
    expect(() =>
      context.readContextRecords(
        "trips",
        [
          {
            field: "trip_id');DROP TABLE ops_records;--",
            op: "eq",
            value: "x",
          },
        ],
        asOf
      )
    ).toThrow(/Unknown/)
    const db = new DatabaseSync(path)
    const row = {
      vehicle_id: "NW-V999",
      assigned_service_no: "238",
      vehicle_type: "Exercise extra vehicle",
      capacity_people: 80,
    }
    db.prepare(
      "INSERT INTO ops_records(table_name,record_id,payload) VALUES(?,?,?)"
    ).run("vehicles", "NW-V999", JSON.stringify(row))
    db.close()
    expect(
      context.readContextRecords(
        "vehicles",
        [{ field: "vehicle_id", op: "eq", value: "NW-V999" }],
        asOf
      ).rows[0]?.record
    ).toEqual(row)
    await context.withContextSnapshot(async () => {
      const first = context.readContextRecords(
        "vehicles",
        [{ field: "vehicle_id", op: "eq", value: "NW-V999" }],
        asOf
      ).rows[0]?.record
      const writer = new DatabaseSync(path)
      writer
        .prepare(
          "UPDATE ops_records SET payload=? WHERE table_name='vehicles' AND record_id='NW-V999'"
        )
        .run(JSON.stringify({ ...row, capacity_people: 90 }))
      writer.close()
      expect(
        context.readContextRecords(
          "vehicles",
          [{ field: "vehicle_id", op: "eq", value: "NW-V999" }],
          asOf
        ).rows[0]?.record
      ).toEqual(first)
    })
    expect(
      context.readContextRecords(
        "vehicles",
        [{ field: "vehicle_id", op: "eq", value: "NW-V999" }],
        asOf
      ).rows[0]?.record.capacity_people
    ).toBe(90)
    const store = await import("@/lib/live/store")
    store.bridgeContextChanges()
    expect(store.liveSnapshot().events[0]).toMatchObject({
      kind: "analysis",
      service: "238",
      source: "database",
    })
    expect(store.liveSnapshot().events[0]?.details).toContain(
      "vehicles:NW-V999"
    )
  })
})
