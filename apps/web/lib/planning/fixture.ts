import { createHash } from "node:crypto"
import { createReadStream, stat } from "node:fs"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { promisify } from "node:util"
import { createGunzip, gunzipSync } from "node:zlib"
import { createInterface } from "node:readline"
import { operationsManifest } from "../operations"
import type {
  PlanningFixture,
  PlanningMode,
  PlanningWarning,
  ScenarioDescriptor,
  ScenarioKind,
} from "./contracts"

const operationsDirectory = join(process.cwd(), "data", "operations")
const dates235 = ["2026-10-07", "2026-10-14"]
const tablesNeeded = [
  "trips",
  "control_actions",
  "resource_updates",
  "crew_duties",
  "vehicle_readiness",
  "terminal_movements",
  "service_patterns",
  "route_stops",
  "routes",
  "stops",
  "stop_calls",
  "origin_arrivals",
  "planning_constraints",
  "vehicles",
  "workshop_vehicles",
  "workshop_work_orders",
] as const

type DataRow = Record<string, unknown>
type ReadResult = { rows: DataRow[]; jsonlHash: string; count: number }

const statAsync = promisify(stat)
const verifiedSourceHashes = new Map<
  string,
  { fingerprint: string; hash: string }
>()

function byId(id: string) {
  const table = operationsManifest.tables.find(
    (candidate) => candidate.id === id
  )
  if (!table) throw new Error(`Missing planning source table: ${id}`)
  return table
}

function isoAt(date: string, time: string) {
  return `${date}T${time}+08:00`
}

function descriptor(
  id: ScenarioKind,
  date: string,
  mode: PlanningMode,
  sourceCutoffAt?: string
): ScenarioDescriptor {
  const isRecovery = id === "service-235-recovery"
  const decisionAt = isoAt(date, isRecovery ? "05:50:00" : "07:20:00")
  const defaultCutoff = isRecovery
    ? mode === "prospective"
      ? isoAt(date, "05:49:59")
      : decisionAt
    : mode === "prospective"
      ? decisionAt
      : isoAt(date, "23:59:59")
  return {
    id,
    title: isRecovery
      ? `Service 235 recovery · ${date}`
      : `Service 238 timetable experiment · ${date}`,
    service: isRecovery ? "235" : "238",
    date,
    mode,
    decisionAt,
    sourceCutoffAt: sourceCutoffAt ?? defaultCutoff,
    routeIds: [isRecovery ? "B235_1" : "B238_1"],
    description: isRecovery
      ? "Review the 05:50 control decision using the resources and later commitments supplied for this date."
      : mode === "retrospective"
        ? "Reproduce a date-specific origin FIFO replay using the supplied eventual observations."
        : "Evaluate a 07:30 departure offset using information available by 07:20; future demand and outcomes are hidden.",
  }
}

export async function listScenarios(): Promise<ScenarioDescriptor[]> {
  const dates238 = operationsManifest.dates
  return [
    ...dates235.map((date) =>
      descriptor("service-235-recovery", date, "retrospective")
    ),
    ...dates238.map((date) =>
      descriptor("service-238-timetable", date, "retrospective")
    ),
  ]
}

async function fileFingerprint(path: string) {
  const info = await statAsync(path, { bigint: true })
  return `${info.dev}:${info.ino}:${info.size}:${info.mtimeNs}:${info.ctimeNs}`
}

async function verifySource(id: string) {
  const table = byId(id)
  const csvPath = join(operationsDirectory, `${id}.csv.gz`)
  const jsonlPath = join(operationsDirectory, `${id}.jsonl.gz`)
  const [csvFingerprint, jsonlFingerprint] = await Promise.all([
    fileFingerprint(csvPath),
    fileFingerprint(jsonlPath),
  ])
  const fingerprint = `${csvFingerprint}|${jsonlFingerprint}`
  const cached = verifiedSourceHashes.get(id)
  if (cached?.fingerprint === fingerprint) {
    return { jsonlHash: cached.hash, fingerprint: jsonlFingerprint }
  }
  const [csvGzip, jsonlGzip] = await Promise.all([
    readFile(csvPath),
    readFile(jsonlPath),
  ])
  const csvHash = createHash("sha256").update(gunzipSync(csvGzip)).digest("hex")
  if (csvHash !== table.sha256) {
    throw new Error(`Planning fixture checksum mismatch for ${id}.csv.gz`)
  }
  const jsonlHash = createHash("sha256").update(jsonlGzip).digest("hex")
  const [csvFingerprintAfter, jsonlFingerprintAfter] = await Promise.all([
    fileFingerprint(csvPath),
    fileFingerprint(jsonlPath),
  ])
  if (`${csvFingerprintAfter}|${jsonlFingerprintAfter}` !== fingerprint) {
    throw new Error(`Planning fixture changed while loading ${id}`)
  }
  verifiedSourceHashes.set(id, { fingerprint, hash: jsonlHash })
  return { jsonlHash, fingerprint: jsonlFingerprint }
}

async function readJsonl(
  id: string,
  select: (row: DataRow) => boolean
): Promise<ReadResult> {
  const expectedCount = byId(id).count
  const { jsonlHash, fingerprint } = await verifySource(id)
  const stream = createReadStream(join(operationsDirectory, `${id}.jsonl.gz`))
  const unzip = createGunzip()
  stream.on("error", (error) => unzip.destroy(error))
  const lines = createInterface({
    input: stream.pipe(unzip),
    crlfDelay: Infinity,
  })
  const rows: DataRow[] = []
  let count = 0
  try {
    for await (const line of lines) {
      if (!line) continue
      count++
      const row = JSON.parse(line) as DataRow
      if (select(row)) rows.push(row)
    }
  } finally {
    lines.close()
    stream.destroy()
    unzip.destroy()
  }
  if (count !== expectedCount) {
    throw new Error(`Planning fixture row count mismatch for ${id}: ${count}`)
  }
  if (
    (await fileFingerprint(join(operationsDirectory, `${id}.jsonl.gz`))) !==
    fingerprint
  ) {
    verifiedSourceHashes.delete(id)
    throw new Error(`Planning fixture changed while reading ${id}`)
  }
  return { rows, jsonlHash, count }
}

function stamp(row: DataRow, field: string) {
  const value = row[field]
  return typeof value === "string" ? Date.parse(value) : Number.NaN
}

function projectTrip(row: DataRow, mode: PlanningMode): DataRow {
  if (mode === "retrospective") return row
  const projected = { ...row }
  delete projected.actual_vehicle_id
  delete projected.actual_crew_id
  delete projected.actual_departure_at
  delete projected.actual_arrival_at
  delete projected.completion_state
  return projected
}

function resourceIds(rows: DataRow[], fieldNames: string[]) {
  const ids = new Set<string>()
  for (const row of rows) {
    for (const field of fieldNames) {
      const value = row[field]
      if (typeof value === "string" && value) ids.add(value)
    }
  }
  return ids
}

function visibleRecords(
  id: string,
  rows: DataRow[],
  mode: PlanningMode,
  cutoff: number
) {
  switch (id) {
    case "control_actions":
      return rows.filter((row) => stamp(row, "issued_at") <= cutoff)
    case "resource_updates":
      return rows.filter((row) => stamp(row, "issued_at") <= cutoff)
    case "crew_duties":
      return rows.filter((row) => stamp(row, "record_issued_at") <= cutoff)
    case "vehicle_readiness":
      return rows.filter((row) => stamp(row, "issued_at") <= cutoff)
    case "terminal_movements":
      return mode === "retrospective"
        ? rows
        : rows.filter(
            (row) =>
              stamp(row, "actual_start_at") <= cutoff &&
              stamp(row, "actual_end_at") <= cutoff
          )
    case "stop_calls":
      return mode === "retrospective"
        ? rows
        : rows.filter(
            (row) =>
              stamp(row, "actual_arrival_at") <= cutoff &&
              stamp(row, "actual_departure_at") <= cutoff &&
              stamp(row, "boarding_cutoff_at") <= cutoff
          )
    case "origin_arrivals":
      return mode === "retrospective"
        ? rows
        : rows.filter((row) => stamp(row, "arrived_at") <= cutoff)
    case "workshop_work_orders":
      return rows.filter((row) => stamp(row, "updated_at") <= cutoff)
    case "workshop_vehicles":
      return rows.filter((row) => stamp(row, "record_issued_at") <= cutoff)
    default:
      return rows
  }
}

export async function loadScenario(
  id: ScenarioKind,
  date: string,
  mode: PlanningMode = "retrospective",
  sourceCutoffAt?: string
): Promise<PlanningFixture> {
  if (!operationsManifest.dates.includes(date)) {
    throw new Error(`Unknown planning date: ${date}`)
  }
  if (id === "service-235-recovery" && !dates235.includes(date)) {
    throw new Error(`Service 235 recovery is unavailable on ${date}`)
  }
  const scenario = descriptor(id, date, mode, sourceCutoffAt)
  const cutoff = Date.parse(scenario.sourceCutoffAt)
  if (
    !Number.isFinite(cutoff) ||
    !/(Z|[+-]\d{2}:\d{2})$/.test(scenario.sourceCutoffAt)
  ) {
    throw new Error(
      "Planning source cutoff must be a valid offset-aware timestamp"
    )
  }
  if (!scenario.sourceCutoffAt.startsWith(date)) {
    throw new Error("Planning source cutoff must use the selected service date")
  }
  if (mode === "prospective" && cutoff > Date.parse(scenario.decisionAt)) {
    throw new Error(
      "Prospective source cutoff cannot be later than the decision time"
    )
  }
  const relevant = (tableId: (typeof tablesNeeded)[number], row: DataRow) => {
    if (tableId === "trips") return row.service_date === date
    if (["control_actions", "resource_updates"].includes(tableId)) {
      return row.service_date === date && stamp(row, "issued_at") <= cutoff
    }
    if (tableId === "crew_duties")
      return (
        row.service_date === date && stamp(row, "record_issued_at") <= cutoff
      )
    if (tableId === "vehicle_readiness")
      return row.service_date === date && stamp(row, "issued_at") <= cutoff
    if (tableId === "terminal_movements") {
      return (
        row.service_date === date &&
        (mode === "retrospective" ||
          (stamp(row, "actual_start_at") <= cutoff &&
            stamp(row, "actual_end_at") <= cutoff))
      )
    }
    if (
      tableId === "service_patterns" ||
      tableId === "route_stops" ||
      tableId === "routes"
    ) {
      return scenario.routeIds.includes(String(row.route_id))
    }
    if (tableId === "stop_calls") {
      return (
        row.service_date === date &&
        scenario.routeIds.includes(String(row.route_id)) &&
        (mode === "retrospective" ||
          (stamp(row, "actual_arrival_at") <= cutoff &&
            stamp(row, "actual_departure_at") <= cutoff &&
            stamp(row, "boarding_cutoff_at") <= cutoff))
      )
    }
    if (tableId === "origin_arrivals") {
      return (
        row.service_date === date &&
        scenario.routeIds.includes(String(row.route_id)) &&
        (mode === "retrospective" || stamp(row, "arrived_at") <= cutoff)
      )
    }
    if (tableId === "workshop_work_orders")
      return stamp(row, "updated_at") <= cutoff
    if (tableId === "workshop_vehicles")
      return stamp(row, "record_issued_at") <= cutoff
    return true
  }
  const loaded = await Promise.all(
    tablesNeeded.map(
      async (tableId) =>
        [
          tableId,
          await readJsonl(tableId, (row) => relevant(tableId, row)),
        ] as const
    )
  )
  const all = new Map(loaded.map(([tableId, result]) => [tableId, result.rows]))
  const sourceHashes = Object.fromEntries(
    loaded.map(([tableId, result]) => [tableId, result.jsonlHash])
  )
  const dateTrips = all.get("trips")!
  const selectedRaw = dateTrips.filter(
    (row) => row.service_no === scenario.service
  )
  if (!selectedRaw.length)
    throw new Error(`No ${scenario.service} trips on ${date}`)
  const selectedIds = new Set(selectedRaw.map((row) => String(row.trip_id)))
  const candidateResources = resourceIds(selectedRaw, [
    "planned_vehicle_id",
    "planned_crew_id",
  ])
  if (id === "service-235-recovery") {
    candidateResources.add("NW-V001")
    candidateResources.add("NW-C900")
    candidateResources.add("NW-V039")
    candidateResources.add("NW-C080")
  }
  const visibleActions = all.get("control_actions")!
  for (const row of visibleActions) {
    for (const field of ["vehicle_id", "crew_id"]) {
      const value = row[field]
      if (typeof value === "string" && value) candidateResources.add(value)
    }
  }
  const relatedRaw = dateTrips.filter((row) => {
    if (selectedIds.has(String(row.trip_id))) return false
    return ["planned_vehicle_id", "planned_crew_id"].some((field) => {
      const value = row[field]
      return typeof value === "string" && candidateResources.has(value)
    })
  })
  const warnings: PlanningWarning[] = []
  if (mode === "prospective") {
    warnings.push({
      code: "OUTCOMES_WITHHELD",
      message:
        "Actual assignments, arrivals and outcomes after the source cutoff are hidden in prospective mode.",
      severity: "info",
      evidence: [],
    })
  } else {
    warnings.push({
      code: "RETROSPECTIVE_OUTCOMES_SEPARATE",
      message:
        "Later observed trips, stop calls and arrival batches are included only to evaluate a retrospective replay; feasibility assignments still use the decision-time timetable and issued resource records.",
      severity: "info",
      evidence: [],
    })
  }
  const admittedThrough = new Date(cutoff).toISOString()
  const manifestHash = createHash("sha256")
    .update(JSON.stringify(operationsManifest))
    .digest("hex")
  const sourceHash = createHash("sha256")
    .update(JSON.stringify({ manifestHash, sourceHashes, scenario }))
    .digest("hex")
  const byTable = (id: (typeof tablesNeeded)[number]) =>
    visibleRecords(id, all.get(id)!, mode, cutoff)
  return {
    scenario,
    trips: selectedRaw.map((row) => projectTrip(row, mode)),
    relatedTrips: relatedRaw.map((row) => projectTrip(row, mode)),
    controlActions: visibleActions,
    resourceUpdates: byTable("resource_updates").filter(
      (row) => row.service_date === date
    ),
    crewDuties: byTable("crew_duties").filter(
      (row) => row.service_date === date
    ),
    vehicleReadiness: byTable("vehicle_readiness").filter(
      (row) => row.service_date === date
    ),
    terminalMovements: byTable("terminal_movements").filter(
      (row) => row.service_date === date
    ),
    servicePatterns: all.get("service_patterns")!,
    routeStops: all.get("route_stops")!,
    routes: all.get("routes")!,
    stops: all.get("stops")!,
    stopCalls: byTable("stop_calls"),
    originArrivals: byTable("origin_arrivals"),
    planningConstraints: all.get("planning_constraints")!,
    workshopVehicles: byTable("workshop_vehicles"),
    workshopWorkOrders: byTable("workshop_work_orders"),
    sourceCounts: Object.fromEntries(
      tablesNeeded.map((tableId) => [tableId, byId(tableId).count])
    ),
    sourceHash,
    admittedThrough,
    warnings,
  }
}
