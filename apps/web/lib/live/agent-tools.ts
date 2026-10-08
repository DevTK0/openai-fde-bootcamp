import { z } from "zod"
import {
  serviceDateAt,
  contextCatalog,
  contextTables,
  readContextRecords,
  allContextRecords,
  operatingHistory,
} from "./context-db"
import { agentEventHistory, agentFaultContext } from "./store"
import { assignmentSchema, validateAgentProposal } from "./proposals"
import { getBusArrivals } from "@/lib/server/datamall"
import {
  interpretationSchema,
  type ObservationInterpretation,
} from "./contracts"
import type { LiveEvent } from "./contracts"
const date = z.iso.datetime({ offset: true })
const schemas = {
  interpret_observation: interpretationSchema,
  get_service_schedule: z.strictObject({
    service: z.string(),
    horizonMinutes: z.number().int().min(30).max(180),
  }),
  get_operating_history: z.strictObject({
    service: z.string().regex(/^\d{1,3}[A-Z]?$/),
    days: z.number().int().min(1).max(14),
    stopCode: z
      .string()
      .regex(/^\d{5}$/)
      .nullable(),
  }),
  read_operational_records: z.strictObject({
    table: z.enum(contextTables as [string, ...string[]]),
    filters: z
      .array(
        z.strictObject({
          field: z.string(),
          op: z.enum(["eq", "gte", "lte"]),
          value: z.string(),
        })
      )
      .max(6),
    limit: z.number().int().min(1).max(50),
    offset: z.number().int().min(0).max(10000),
  }),
  find_resources: z.strictObject({
    service: z.string(),
    departureAt: date,
    arrivalAt: date,
    originStopId: z.string(),
  }),
  read_recent_events: z.strictObject({
    service: z.string().nullable(),
    days: z.number().int().min(1).max(14),
  }),
  validate_assignment_plan: z.strictObject({
    assignments: z.array(assignmentSchema).min(1).max(12),
  }),
  get_live_arrivals: z.strictObject({
    stopCode: z.string().regex(/^\d{5}$/),
    service: z.string().nullable(),
  }),
}
const descriptions = {
  interpret_observation:
    "Interpret the raw triggering report: identify one or more signal types, service and explicitly reported IDs/counts. Use null for facts not stated or ambiguous. This records a model interpretation, not verified telemetry or Engineering release. Call before proposing resources for a free-text observation. Set repairAreas to all mechanical areas supported by this report and relevant workshop evidence for the stated vehicle; use [] when none are supported.",
  get_service_schedule:
    "Read a focused planning view from SQLite: the next service departures, full-route patterns, their fleet/driver readiness and duties, relevant updates and all protected commitments on those resource blocks. Use this to propose exact timetable/resource changes instead of reading broad pages. This tool supplies context, not preset candidate interventions.",
  get_operating_history:
    "Investigate multi-day observed delay and passenger queue patterns for a service. Includes daily coverage and cited delayed trips. Use before drawing trend conclusions.",
  read_operational_records:
    "Read SQLite operational records by allowlisted fields, with paging. Tables include trips, vehicles, crew_duties, vehicle_readiness, resource_updates, workshop_work_orders, routes, service_patterns and planning_constraints. This is not a predetermined candidate list.",
  find_resources:
    "Read fleet and qualified driver options for a proposed time window and origin, including existing protected commitments. Availability is evidence, not a recommendation. Find actual resource IDs before proposing extra trips or reallocation.",
  read_recent_events:
    "Read complaints, fault/clearance reports, delay and queue observations across services and days. A null service returns network events. Cutoff and sequence bounded.",
  validate_assignment_plan:
    "Check YOUR proposed specific bus/driver assignment changes or additional trips against database readiness, qualification, duty/breaks, full-route running times and protected network commitments. Use an existing trip ID to replace its assignment or an EXTRA- prefix for an extra full-route trip. Returns a server-generated proposal ID. Blocked plans must be revised, never recommended as executable.",
  get_live_arrivals:
    "Read current LTA DataMall estimates/load signals. These are public NOW observations, not historical exercise evidence and do not identify local fleet vehicle/driver IDs. Do not blend them into a historical cutoff.",
}
export function jsonSchema(schema: z.ZodType) {
  const { $schema: _schema, ...result } = z.toJSONSchema(schema, {
    target: "draft-7",
  })
  return result
}
export const agentToolDefinitions = Object.entries(schemas).map(
  ([name, schema]) => ({
    type: "function",
    name,
    description: descriptions[name as keyof typeof descriptions],
    parameters: jsonSchema(schema),
    strict: true,
  })
)
export type Proposal = ReturnType<typeof validateAgentProposal> & { id: string }
export class AgentContext {
  interpretation?: ObservationInterpretation
  evidence = new Map<string, { id: string; label: string }>()
  proposals = new Map<string, Proposal>()
  calls = new Set<string>()
  snapshots: unknown[] = []
  events: LiveEvent[]
  constructor(
    readonly event: LiveEvent,
    readonly asOf: string
  ) {
    const rows = agentEventHistory(event, asOf, 14, null)
    const faults = agentFaultContext(event, asOf)
    this.events = [
      ...new Map(
        [...rows, ...faults].map((row) => [row.record.seq, row.record])
      ).values(),
    ]
    this.capture([...rows, ...faults])
  }
  capture(value: unknown) {
    if (!value || typeof value !== "object") return
    if (Array.isArray(value)) {
      for (const item of value) this.capture(item)
      return
    }
    const row = value as Record<string, unknown>
    if (typeof row.evidenceId === "string") {
      const record = row.record as Record<string, unknown> | undefined
      this.evidence.set(row.evidenceId, {
        id: row.evidenceId,
        label: record
          ? `${row.evidenceId} · ${String(record.title ?? record.description ?? record.service_date ?? record.vehicle_id ?? "")}`
          : row.evidenceId,
      })
    }
    for (const item of Object.values(row))
      if (item && typeof item === "object") this.capture(item)
  }
  async run(name: string, raw: string): Promise<unknown> {
    const schema = schemas[name as keyof typeof schemas]
    if (!schema) throw new Error("Tool is not allowlisted")
    const args = schema.parse(JSON.parse(raw))
    let result: unknown
    if (name === "interpret_observation") {
      if (this.event.kind !== "observation")
        throw new Error("Only raw observations need interpretation")
      const interpretation = interpretationSchema.parse(args)
      // A raw human report cannot authorize an Engineering clearance.
      if (
        interpretation.signalTypes.includes("clearance") &&
        this.event.source !== "engineering"
      )
        throw new Error(
          "This is an unverified clearance report. Classify as other; obtain an Engineering record before releasing a bus."
        )
      if (interpretation.repairAreas.length && !interpretation.vehicleId)
        throw new Error(
          "A repair area requires a stated vehicle ID. Use an empty repairAreas list for non-mechanical reports; a passenger queue is not a bodywork fault."
        )
      this.proposals.clear()
      this.events = this.events.filter((row) => row.seq !== this.event.seq)
      this.events.push(this.event)
      this.interpretation = interpretation
      if (
        interpretation.signalTypes.includes("fault") &&
        interpretation.vehicleId
      )
        this.events.push({
          ...this.event,
          kind: "fault",
          vehicleId: interpretation.vehicleId,
        })
      result = {
        interpretation,
        scope:
          "Model interpretation of unverified raw report; original text preserved.",
      }
    } else if (name === "get_service_schedule") {
      const a = args as z.infer<typeof schemas.get_service_schedule>
      result = this.schedule(a.service, a.horizonMinutes)
    } else if (name === "get_operating_history") {
      const a = args as z.infer<typeof schemas.get_operating_history>
      result = operatingHistory(a.service, this.asOf, a.days, a.stopCode)
    } else if (name === "read_operational_records") {
      const a = args as z.infer<typeof schemas.read_operational_records>
      result = readContextRecords(
        a.table,
        a.filters,
        this.asOf,
        a.limit,
        a.offset
      )
    } else if (name === "read_recent_events") {
      const a = args as z.infer<typeof schemas.read_recent_events>
      result = {
        recent: agentEventHistory(this.event, this.asOf, a.days, a.service),
        activeNetworkFaults: agentFaultContext(this.event, this.asOf),
      }
    } else if (name === "get_live_arrivals") {
      const a = args as z.infer<typeof schemas.get_live_arrivals>
      const data = await getBusArrivals(a.stopCode, a.service)
      result = {
        evidenceId: `lta:${a.stopCode}:${data.retrievedAt ?? "unavailable"}`,
        data,
        scope:
          "Current public arrival estimates; separate from dated exercise records. No local fleet/crew identity.",
      }
    } else if (name === "validate_assignment_plan") {
      if (this.event.kind === "observation" && !this.interpretation)
        throw new Error("Interpret the raw report before checking assignments.")
      const a = args as z.infer<typeof schemas.validate_assignment_plan>
      const id = `proposal-${this.proposals.size + 1}`
      const plan = {
        id,
        ...validateAgentProposal(
          a.assignments,
          this.planningEvent(),
          this.asOf,
          this.events
        ),
      }
      this.proposals.set(id, plan)
      result = plan
    } else {
      const a = args as z.infer<typeof schemas.find_resources>
      result = this.findResources(a)
    }
    const evidenceId = `tool-result:${this.snapshots.length + 1}:${name}`
    const returned = Array.isArray(result)
      ? { evidenceId, rows: result }
      : { ...(result as Record<string, unknown>), evidenceId }
    this.calls.add(name)
    this.capture(returned)
    this.snapshots.push({ name, args, result: returned })
    return returned
  }
  planningEvent(): LiveEvent {
    return {
      ...this.event,
      service: this.interpretation?.service ?? this.event.service,
    }
  }
  private schedule(service: string, horizonMinutes: number) {
    const dateFilter = [
      {
        field: "service_date",
        op: "eq" as const,
        value: this.event.serviceDate,
      },
    ]
    const all = allContextRecords("trips", dateFilter, this.asOf)
    const cutoff = Date.parse(this.asOf),
      until = cutoff + horizonMinutes * 60000
    const upcoming = all
      .filter(
        (row) =>
          row.record.service_no === service &&
          Date.parse(String(row.record.scheduled_departure_at)) > cutoff &&
          Date.parse(String(row.record.scheduled_departure_at)) <= until
      )
      .sort(
        (a, b) =>
          Date.parse(String(a.record.scheduled_departure_at)) -
          Date.parse(String(b.record.scheduled_departure_at))
      )
    const vehicleIds = new Set(
        upcoming.map((row) => String(row.record.planned_vehicle_id))
      ),
      crewIds = new Set(
        upcoming.map((row) => String(row.record.planned_crew_id))
      ),
      routeIds = new Set(
        all
          .filter((row) => row.record.service_no === service)
          .map((row) => String(row.record.route_id))
      )
    const relevant = all
      .filter(
        (row) =>
          vehicleIds.has(String(row.record.planned_vehicle_id)) ||
          crewIds.has(String(row.record.planned_crew_id))
      )
      .sort(
        (a, b) =>
          Date.parse(String(a.record.scheduled_departure_at)) -
          Date.parse(String(b.record.scheduled_departure_at))
      )
    const compact = (row: (typeof all)[number]) => ({
      evidenceId: row.evidenceId,
      record: Object.fromEntries(
        [
          "trip_id",
          "service_no",
          "route_id",
          "planned_vehicle_id",
          "planned_crew_id",
          "origin_stop_id",
          "destination_stop_id",
          "scheduled_departure_at",
          "scheduled_arrival_at",
          "actual_departure_at",
          "actual_arrival_at",
        ].map((key) => [key, row.record[key] ?? null])
      ),
    })
    return {
      service,
      asOf: this.asOf,
      horizonMinutes,
      upcomingDepartures: upcoming.slice(0, 16).map(compact),
      totalUpcoming: upcoming.length,
      coverage: {
        assessmentTimeSGT: new Date(this.asOf).toLocaleString("en-SG", {
          timeZone: "Asia/Singapore",
        }),
        latestPublishedDeparture:
          all
            .filter((row) => row.record.service_no === service)
            .map((row) => String(row.record.scheduled_departure_at))
            .sort()
            .at(-1) ?? null,
        note: "If the admitted timetable has no future trips, do not move departed trips. Obtain current/future timetable and duty records for an executable frequency proposal.",
      },
      resourceCommitments: relevant.map(compact),
      routes: allContextRecords("routes", [], this.asOf).filter((row) =>
        routeIds.has(String(row.record.route_id))
      ),
      servicePatterns: allContextRecords(
        "service_patterns",
        [],
        this.asOf
      ).filter((row) => routeIds.has(String(row.record.route_id))),
      fleet: allContextRecords("vehicles", [], this.asOf).filter((row) =>
        vehicleIds.has(String(row.record.vehicle_id))
      ),
      readiness: allContextRecords(
        "vehicle_readiness",
        dateFilter,
        this.asOf
      ).filter((row) => vehicleIds.has(String(row.record.vehicle_id))),
      driverDuties: allContextRecords(
        "crew_duties",
        dateFilter,
        this.asOf
      ).filter((row) => crewIds.has(String(row.record.crew_id))),
      resourceUpdates: allContextRecords(
        "resource_updates",
        dateFilter,
        this.asOf
      ).filter(
        (row) =>
          vehicleIds.has(String(row.record.resource_id)) ||
          crewIds.has(String(row.record.resource_id))
      ),
      controlActions: allContextRecords(
        "control_actions",
        dateFilter,
        this.asOf
      ).filter(
        (row) =>
          vehicleIds.has(String(row.record.vehicle_id)) ||
          crewIds.has(String(row.record.crew_id))
      ),
      constraints: allContextRecords("planning_constraints", [], this.asOf),
      activeNetworkFaults: agentFaultContext(this.event, this.asOf),
      limitations:
        "Published commitments are preserved unless your validated plan explicitly replaces an assignment. No predicted demand or savings. You may propose a retiming, cover or added full-route trip; this view does not choose a recommendation.",
    }
  }
  private findResources(args: z.infer<typeof schemas.find_resources>) {
    if (
      serviceDateAt(args.departureAt) !== this.event.serviceDate ||
      Date.parse(args.departureAt) <= Date.parse(this.asOf) ||
      Date.parse(args.arrivalAt) <= Date.parse(args.departureAt)
    )
      throw new Error(
        `Resource window must depart AFTER assessment clock ${this.asOf} (${new Date(this.asOf).toLocaleString("en-SG", { timeZone: "Asia/Singapore" })} SGT) on service date ${this.event.serviceDate}, with arrival after departure. Trigger observation time may be older; do not rewind to it.`
      )
    const dateFilter = [
      {
        field: "service_date",
        op: "eq" as const,
        value: this.event.serviceDate,
      },
    ]
    const trips = allContextRecords("trips", dateFilter, this.asOf)
    const ready = allContextRecords("vehicle_readiness", dateFilter, this.asOf)
    const duties = allContextRecords(
      "crew_duties",
      [
        ...dateFilter,
        { field: "qualified_service_no", op: "eq", value: args.service },
      ],
      this.asOf
    )
    const inventory = allContextRecords("vehicles", [], this.asOf)
    const overlap = (row: Record<string, unknown>) =>
      Date.parse(String(row.scheduled_departure_at)) <
        Date.parse(args.arrivalAt) + 465000 &&
      Date.parse(String(row.scheduled_arrival_at)) + 465000 >
        Date.parse(args.departureAt)
    const within = (row: Record<string, unknown>) =>
      Date.parse(String(row.available_from)) <= Date.parse(args.departureAt) &&
      Date.parse(String(row.available_until)) >= Date.parse(args.arrivalAt)
    const activeFaults = new Set<string>()
    for (const event of [...this.events].sort(
      (a, b) =>
        Date.parse(a.occurredAt) - Date.parse(b.occurredAt) || a.seq - b.seq
    ))
      if (event.vehicleId) {
        if (event.kind === "fault") activeFaults.add(event.vehicleId)
        else if (event.kind === "clearance")
          activeFaults.delete(event.vehicleId)
      }
    const seen = new Set<string>()
    const vehicles = ready
      .filter((row) => {
        const id = String(row.record.vehicle_id)
        if (seen.has(id)) return false
        seen.add(id)
        return (
          within(row.record) &&
          row.record.location_stop_id === args.originStopId
        )
      })
      .map((row) => ({
        readiness: row,
        inventory: inventory.find(
          (vehicle) => vehicle.record.vehicle_id === row.record.vehicle_id
        ),
        activeFault: activeFaults.has(String(row.record.vehicle_id)),
        overlappingCommitments: trips
          .filter(
            (trip) =>
              trip.record.planned_vehicle_id === row.record.vehicle_id &&
              overlap(trip.record)
          )
          .slice(0, 10),
      }))
    const crews = duties
      .filter(
        (row) =>
          within(row.record) && row.record.start_stop_id === args.originStopId
      )
      .map((row) => ({
        duty: row,
        overlappingCommitments: trips
          .filter(
            (trip) =>
              trip.record.planned_crew_id === row.record.crew_id &&
              overlap(trip.record)
          )
          .slice(0, 10),
      }))
    return {
      window: args,
      vehicles: vehicles.slice(0, 20),
      drivers: crews.slice(0, 20),
      totalVehicles: vehicles.length,
      totalDrivers: crews.length,
      limitations:
        "Origin-matched listed resources, not spare guarantees. Commitments shown are published assignments; inspect issued control actions and resource updates and run validate_assignment_plan. No positioning travel is assumed. Missing location/availability requires new evidence.",
    }
  }
  catalog() {
    return contextCatalog()
  }
}
