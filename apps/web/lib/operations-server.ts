import {
  emptyRecordQuery,
  RECORD_PAGE_SIZE,
  recordQuerySchema,
  type RecordQuery,
} from "./record-query"
import { csvExport } from "./fleet"
import type { DatabaseSync } from "node:sqlite"
import { z } from "zod"
import { withDatabase, readMetadata, queryDatabase } from "./database"
import { manifestSchema, rowSchema } from "./dashboard-data"
import { buildOperationsReport, type OperationGroup } from "./operations"

const rowsSchema = z.array(rowSchema)
const quote = (name: string) => `"${name.replaceAll('"', '""')}"`

export function readOperationsManifest(database: DatabaseSync) {
  const manifest = readMetadata(database, "operations", manifestSchema)
  const tables = manifest.tables.map((table) => ({
    ...table,
    count: z
      .object({ count: z.number() })
      .parse(
        database
          .prepare(`SELECT COUNT(*) AS count FROM ${quote(table.id)}`)
          .get()
      ).count,
  }))
  const count = (id: string) => tables.find((table) => table.id === id)!.count
  const services = z
    .object({ service_no: z.string() })
    .array()
    .parse(database.prepare("SELECT DISTINCT service_no FROM trips").all())
    .map((row) => row.service_no)
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
  const dates = z
    .object({ service_date: z.string() })
    .array()
    .parse(
      database
        .prepare(
          "SELECT DISTINCT service_date FROM trips ORDER BY service_date"
        )
        .all()
    )
    .map((row) => row.service_date)
  return {
    ...manifest,
    tables,
    services,
    dates,
    coverage: {
      vehicles: count("vehicles"),
      workshopVehicles: count("workshop_vehicles"),
      trips: count("trips"),
      stopCalls: count("stop_calls"),
      services: services.length,
      routes: count("routes"),
      stops: count("stops"),
    },
  }
}
export function getOperationsManifest() {
  return withDatabase(readOperationsManifest)
}
export function sourceTable(id: string) {
  return withDatabase((database) => {
    const table = readMetadata(
      database,
      "operations",
      manifestSchema
    ).tables.find((table) => table.id === id)
    return table && { id: table.id, columns: table.columns }
  })
}

export async function getOperationsReport(
  service: string,
  date: string,
  signal?: AbortSignal
) {
  const groups = new Map<string, OperationGroup>()
  const tripSchema = z.object({
    date: z.string(),
    service: z.string(),
    vehicle: z.string(),
    planned: z.string(),
    state: z.string(),
    km: z.number(),
    seconds: z.number(),
    departure: z.number(),
    arrival: z.number(),
  })
  const filter =
    "(? = 'all' OR t.service_no = ?) AND (? = 'all' OR t.service_date = ?)"
  const params = [service, service, date, date]
  const [tripRows, callRows, movementRows, hotspotRows, workshopRows] =
    await queryDatabase(
      [
        {
          sql: `SELECT t.service_date AS date, t.service_no AS service,
      t.actual_vehicle_id AS vehicle, t.planned_vehicle_id AS planned, t.completion_state AS state,
      t.published_distance_km AS km,
      unixepoch(t.actual_arrival_at) - unixepoch(t.actual_departure_at) AS seconds,
      unixepoch(t.actual_departure_at) - unixepoch(t.scheduled_departure_at) AS departure,
      unixepoch(t.actual_arrival_at) - unixepoch(t.scheduled_arrival_at) AS arrival
      FROM trips t WHERE ${filter} ORDER BY t.rowid`,
          parameters: params,
        },
        {
          sql: `
      SELECT t.service_date AS date, t.service_no AS service, count(*) AS calls,
        sum(c.boarded_people) AS boardings, sum(c.alighted_people) AS alightings,
        sum(c.queue_after_people > 0) AS queuedCalls, sum(c.onboard_departing >= c.capacity_people) AS fullCalls,
        sum(1.0 * c.onboard_departing / c.capacity_people) AS occupancySum
      FROM trips t JOIN stop_calls c USING (trip_id) WHERE ${filter} GROUP BY t.service_date, t.service_no`,
          parameters: params,
        },
        {
          sql: `
      SELECT t.service_date AS date, t.service_no AS service, sum(m.planning_distance_km) AS km,
        sum(unixepoch(m.actual_end_at) - unixepoch(m.actual_start_at)) AS seconds
      FROM terminal_movements m JOIN trips t ON t.trip_id = m.to_trip_id WHERE ${filter}
      GROUP BY t.service_date, t.service_no`,
          parameters: params,
        },
        {
          sql: `
      SELECT q.service_date AS date, r.service_no AS service, q.route_id AS route, q.stop_order AS "order",
        q.stop_id AS stop, s.description AS name, q.total_arrivals_people AS arrivals,
        q.total_boarded_people AS boardings, q.remaining_queue_people AS remaining, q.initial_queue_people AS initial
      FROM queue_windows q JOIN routes r USING (route_id) JOIN stops s USING (stop_id)
      WHERE (? = 'all' OR r.service_no = ?) AND (? = 'all' OR q.service_date = ?) ORDER BY q.rowid`,
          parameters: params,
        },
        { sql: "SELECT * FROM workshop_work_orders ORDER BY rowid" },
      ],
      signal
    )
  const trips = tripSchema.array().parse(tripRows)
  function groupFor(date: string, service: string) {
    const key = `${date}/${service}`
    let group = groups.get(key)
    if (!group) {
      group = {
        date,
        service,
        trips: 0,
        completed: 0,
        km: 0,
        positioningKm: 0,
        seconds: 0,
        vehicles: [],
        departureDelays: [],
        arrivalDelays: [],
        substitutions: 0,
        calls: 0,
        boardings: 0,
        alightings: 0,
        queuedCalls: 0,
        fullCalls: 0,
        occupancySum: 0,
        initialQueue: 0,
        arrivals: 0,
        remainingQueue: 0,
        windowBoardings: 0,
        controlActions: 0,
        resourceUpdates: 0,
      }
      groups.set(key, group)
    }
    return group
  }
  for (const trip of trips) {
    const group = groupFor(trip.date, trip.service)
    group.trips++
    group.completed += Number(trip.state === "completed")
    group.km += trip.km
    group.seconds += trip.seconds
    group.vehicles.push(trip.vehicle)
    group.departureDelays.push(trip.departure)
    group.arrivalDelays.push(trip.arrival)
    group.substitutions += Number(trip.vehicle !== trip.planned)
  }
  const calls = z
    .object({
      date: z.string(),
      service: z.string(),
      calls: z.number(),
      boardings: z.number(),
      alightings: z.number(),
      queuedCalls: z.number(),
      fullCalls: z.number(),
      occupancySum: z.number(),
    })
    .array()
    .parse(callRows)
  for (const call of calls)
    Object.assign(groups.get(`${call.date}/${call.service}`)!, call)
  const movements = z
    .object({
      date: z.string(),
      service: z.string(),
      km: z.number(),
      seconds: z.number(),
    })
    .array()
    .parse(movementRows)
  for (const movement of movements) {
    const group = groups.get(`${movement.date}/${movement.service}`)!
    group.positioningKm += movement.km
    group.seconds += movement.seconds
  }
  const hotspots = z
    .object({
      date: z.string(),
      service: z.string(),
      route: z.string(),
      order: z.number(),
      stop: z.string(),
      name: z.string(),
      arrivals: z.number(),
      boardings: z.number(),
      remaining: z.number(),
      initial: z.number(),
    })
    .array()
    .parse(hotspotRows)
  for (const hotspot of hotspots) {
    const group = groupFor(hotspot.date, hotspot.service)
    group.initialQueue += hotspot.initial
    group.arrivals += hotspot.arrivals
    group.remainingQueue += hotspot.remaining
    group.windowBoardings += hotspot.boardings
  }
  return buildOperationsReport(
    {
      groups: [...groups.values()].sort((a, b) =>
        `${a.date}/${a.service}`.localeCompare(`${b.date}/${b.service}`)
      ),
      hotspots: hotspots.map(({ initial: _initial, ...hotspot }) => hotspot),
      workshop: rowsSchema.parse(workshopRows),
    },
    service,
    date
  )
}

function recordSelection(id: string, query: RecordQuery) {
  const table = sourceTable(id)
  if (!table) throw new Error("Unknown table")
  if (
    [query.column, query.sort].some(
      (column) => column && !table.columns.includes(column)
    )
  )
    throw new Error("Unknown column")
  const conditions: string[] = []
  const parameters: string[] = []
  if (query.q) {
    conditions.push(
      `(${table.columns.map((column) => `instr(search_text(${quote(column)}), ?) > 0`).join(" OR ")})`
    )
    parameters.push(...table.columns.map(() => query.q.toLowerCase()))
  }
  if (query.column) {
    const column = `search_text(${quote(query.column)})`
    if (query.match === "empty") conditions.push(`${column} = ''`)
    else if (query.value) {
      conditions.push(
        query.match === "equals" ? `${column} = ?` : `instr(${column}, ?) > 0`
      )
      parameters.push(query.value.toLowerCase())
    }
  }
  const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ""
  const column = quote(query.sort)
  const order = query.sort
    ? `(${column} IS NULL OR ${column} = '') ASC, CASE WHEN typeof(${column}) = 'text' THEN search_text(${column}) ELSE ${column} END ${query.direction === "asc" ? "ASC" : "DESC"}, rowid`
    : "rowid"
  return { table, where, parameters, order }
}
export async function queryOperationsTable(
  id: string,
  query: string,
  page: number,
  signal?: AbortSignal,
  options: Partial<RecordQuery> = {}
) {
  const { table, where, parameters, order } = recordSelection(
    id,
    recordQuerySchema.parse({ ...options, q: query, page })
  )
  const [counts, records] = await queryDatabase(
    [
      { sql: `SELECT count(*) AS count FROM ${quote(id)}${where}`, parameters },
      {
        sql: `SELECT rowid AS __record_id, * FROM ${quote(id)}${where} ORDER BY ${order} LIMIT ${RECORD_PAGE_SIZE} OFFSET ?`,
        parameters: [...parameters, page * RECORD_PAGE_SIZE],
      },
    ],
    signal
  )
  const total = z.array(z.object({ count: z.number() })).parse(counts)[0]!.count
  const rows = rowsSchema.parse(records)
  return {
    table: id,
    columns: table.columns,
    recordIds: rows.map((row) => z.number().parse(row.__record_id)),
    rows: rows.map(({ __record_id: _id, ...row }) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          value === "" ? null : value,
        ])
      )
    ),
    total,
    page,
    pageSize: RECORD_PAGE_SIZE,
  }
}

export async function readOperationsDownload(id: string) {
  return withDatabase((database) => {
    const row = database
      .prepare("SELECT content FROM source_downloads WHERE table_id = ?")
      .get(id)
    if (!row || !(row.content instanceof Uint8Array))
      throw new Error("Unknown table")
    return Buffer.from(row.content)
  })
}

export async function exportOperationsCsv(
  id: string,
  signal?: AbortSignal,
  query: RecordQuery = emptyRecordQuery
) {
  const { table, where, parameters, order } = recordSelection(id, query)
  const [records] = await queryDatabase(
    [
      {
        sql: `SELECT * FROM ${quote(id)}${where} ORDER BY ${order}`,
        parameters,
      },
    ],
    signal
  )
  return csvExport(table.columns, rowsSchema.parse(records))
}
