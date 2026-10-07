import { createHash } from "node:crypto"
import { statSync } from "node:fs"
import { DatabaseSync } from "node:sqlite"
import { databasePath, withDatabase } from "@/lib/database"
import { readOperationsManifest } from "@/lib/operations-server"
import { liveDatabasePath } from "./store"

function sourceManifest() {
  return withDatabase(readOperationsManifest)
}
export const contextTables = sourceManifest()
  .tables.filter((table) => !table.id.startsWith("rail_"))
  .map((table) => table.id)
let conn: DatabaseSync | undefined
let importing: Promise<void> | undefined
let importedSourceSignature: string | undefined
function sourceSignature() {
  const path = databasePath()
  const fingerprint = (file: string) => {
    const stat = statSync(file, { bigint: true, throwIfNoEntry: false })
    return stat
      ? `${stat.dev}:${stat.ino}:${stat.size}:${stat.mtimeNs}:${stat.ctimeNs}`
      : "missing"
  }
  return `${path}:${fingerprint(path)}:${fingerprint(`${path}-wal`)}`
}
function db() {
  if (conn) return conn
  conn = new DatabaseSync(liveDatabasePath)
  conn.exec(`PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS ops_records(table_name TEXT NOT NULL,record_id TEXT NOT NULL,service_date TEXT,service_no TEXT,known_at TEXT,payload TEXT NOT NULL,PRIMARY KEY(table_name,record_id)) STRICT;
    CREATE INDEX IF NOT EXISTS ops_records_date ON ops_records(table_name,service_date,service_no);
    CREATE TABLE IF NOT EXISTS ops_imports(table_name TEXT PRIMARY KEY,fingerprint TEXT NOT NULL,row_count INTEGER NOT NULL,imported_at TEXT NOT NULL) STRICT;
    CREATE TABLE IF NOT EXISTS ops_import_state(id INTEGER PRIMARY KEY CHECK(id=1),active INTEGER NOT NULL DEFAULT 0) STRICT;
    INSERT OR IGNORE INTO ops_import_state(id) VALUES(1);
    CREATE TABLE IF NOT EXISTS ops_changes(id INTEGER PRIMARY KEY AUTOINCREMENT,table_name TEXT NOT NULL,record_id TEXT NOT NULL,service TEXT,service_date TEXT,known_at TEXT,at TEXT NOT NULL,processed INTEGER NOT NULL DEFAULT 0) STRICT;
    CREATE TRIGGER IF NOT EXISTS ops_records_notify_insert AFTER INSERT ON ops_records WHEN (SELECT active FROM ops_import_state WHERE id=1)=0 BEGIN
      INSERT INTO ops_changes(table_name,record_id,service,service_date,known_at,at) VALUES(NEW.table_name,NEW.record_id,COALESCE(NEW.service_no,CAST(json_extract(NEW.payload,'$.service_no') AS TEXT),CAST(json_extract(NEW.payload,'$.assigned_service_no') AS TEXT),CAST(json_extract(NEW.payload,'$.qualified_service_no') AS TEXT)),COALESCE(NEW.service_date,json_extract(NEW.payload,'$.service_date')),NEW.known_at,strftime('%Y-%m-%dT%H:%M:%fZ','now'));
    END;
    CREATE TRIGGER IF NOT EXISTS ops_records_notify_update AFTER UPDATE ON ops_records WHEN (SELECT active FROM ops_import_state WHERE id=1)=0 AND NEW.payload<>OLD.payload BEGIN
      INSERT INTO ops_changes(table_name,record_id,service,service_date,known_at,at) VALUES(NEW.table_name,NEW.record_id,COALESCE(NEW.service_no,CAST(json_extract(NEW.payload,'$.service_no') AS TEXT),CAST(json_extract(NEW.payload,'$.assigned_service_no') AS TEXT),CAST(json_extract(NEW.payload,'$.qualified_service_no') AS TEXT)),COALESCE(NEW.service_date,json_extract(NEW.payload,'$.service_date')),NEW.known_at,strftime('%Y-%m-%dT%H:%M:%fZ','now'));
    END;`)
  return conn
}

function recordId(table: string, row: Record<string, unknown>) {
  if (table === "route_stops") return `${row.route_id}:${row.stop_order}`
  const keys: Record<string, string> = {
    control_actions: "action_id",
    crew_duties: "duty_id",
    origin_arrivals: "arrival_record_id",
    planning_constraints: "constraint_id",
    queue_windows: "queue_window_id",
    resource_updates: "update_id",
    routes: "route_id",
    stops: "stop_id",
    service_patterns: "route_id",
    service_calendar: "service_date",
    stop_calls: "call_id",
    terminal_movements: "movement_id",
    timetable_records: "version_id",
    trips: "trip_id",
    vehicle_readiness: "readiness_id",
    vehicles: "vehicle_id",
    workshop_vehicles: "vehicle_id",
    workshop_work_orders: "work_order_id",
  }
  return String(
    row[keys[table]!] ??
      createHash("sha256")
        .update(JSON.stringify(row))
        .digest("hex")
        .slice(0, 20)
  )
}
function knownAt(table: string, row: Record<string, unknown>) {
  if (table === "stop_calls")
    return String(row.actual_departure_at ?? row.actual_arrival_at)
  if (table === "origin_arrivals") return String(row.arrived_at)
  if (table === "queue_windows") return String(row.observation_end_at)
  if (table === "terminal_movements") return String(row.actual_end_at)
  return (row.record_issued_at ??
    row.issued_at ??
    row.updated_at ??
    row.opened_at ??
    null) as string | null
}
export async function ensureContextDatabase() {
  if (importing) return importing
  const before = sourceSignature()
  if (before === importedSourceSignature) return
  importing = (async () => {
    const connection = db()
    connection.prepare("UPDATE ops_import_state SET active=1 WHERE id=1").run()
    try {
      const insert = connection.prepare(
        "INSERT OR REPLACE INTO ops_records VALUES(?,?,?,?,?,?)"
      )
      connection.exec(`CREATE TEMP TABLE IF NOT EXISTS ops_before (
        record_id TEXT PRIMARY KEY, payload TEXT NOT NULL,
        service_date TEXT, service_no TEXT, known_at TEXT
      )`)
      withDatabase((source) => {
        for (const table of contextTables) {
          const rows = source
            .prepare(`SELECT * FROM "${table}" ORDER BY rowid`)
            .all() as Record<string, unknown>[]
          const fingerprint = `sqlite-v1:${createHash("sha256").update(JSON.stringify(rows)).digest("hex")}`
          const prior = connection
            .prepare("SELECT fingerprint FROM ops_imports WHERE table_name=?")
            .get(table) as { fingerprint: string } | undefined
          if (prior?.fingerprint === fingerprint) continue
          connection.exec("BEGIN IMMEDIATE")
          try {
            connection.exec("DELETE FROM ops_before")
            if (prior)
              connection
                .prepare(
                  `INSERT INTO ops_before
              SELECT record_id,payload,service_date,service_no,known_at
              FROM ops_records WHERE table_name=?`
                )
                .run(table)
            connection
              .prepare("DELETE FROM ops_records WHERE table_name=?")
              .run(table)
            for (const row of rows)
              insert.run(
                table,
                recordId(table, row),
                (row.service_date ?? null) as string | null,
                (row.service_no ??
                  row.assigned_service_no ??
                  row.qualified_service_no ??
                  null) as string | null,
                knownAt(table, row),
                JSON.stringify(row)
              )
            if (prior) {
              connection
                .prepare(
                  `INSERT INTO ops_changes
                (table_name,record_id,service,service_date,known_at,at)
                SELECT n.table_name,n.record_id,
                  COALESCE(n.service_no,CAST(json_extract(n.payload,'$.assigned_service_no') AS TEXT),CAST(json_extract(n.payload,'$.qualified_service_no') AS TEXT)),
                  n.service_date,n.known_at,strftime('%Y-%m-%dT%H:%M:%fZ','now')
                FROM ops_records n LEFT JOIN ops_before b ON b.record_id=n.record_id
                WHERE n.table_name=? AND (b.record_id IS NULL OR b.payload<>n.payload)`
                )
                .run(table)
              connection
                .prepare(
                  `INSERT INTO ops_changes
                (table_name,record_id,service,service_date,known_at,at)
                SELECT ?,b.record_id,
                  COALESCE(b.service_no,CAST(json_extract(b.payload,'$.assigned_service_no') AS TEXT),CAST(json_extract(b.payload,'$.qualified_service_no') AS TEXT)),
                  b.service_date,b.known_at,strftime('%Y-%m-%dT%H:%M:%fZ','now')
                FROM ops_before b LEFT JOIN ops_records n
                  ON n.table_name=? AND n.record_id=b.record_id
                WHERE n.record_id IS NULL`
                )
                .run(table, table)
            }
            connection
              .prepare("INSERT OR REPLACE INTO ops_imports VALUES(?,?,?,?)")
              .run(table, fingerprint, rows.length, new Date().toISOString())
            connection.exec("COMMIT")
          } catch (error) {
            connection.exec("ROLLBACK")
            throw error
          }
        }
      })
      // An edit during import must trigger another refresh on the next request.
      if (before === sourceSignature()) importedSourceSignature = before
    } finally {
      connection
        .prepare("UPDATE ops_import_state SET active=0 WHERE id=1")
        .run()
    }
  })().finally(() => {
    importing = undefined
  })
  return importing
}
export function serviceDateAt(stamp: string) {
  return new Date(stamp).toLocaleDateString("en-CA", {
    timeZone: "Asia/Singapore",
  })
}
export type ContextFilter = {
  field: string
  value: string
  op: "eq" | "gte" | "lte"
}
export function readContextRecords(
  table: string,
  filters: ContextFilter[],
  asOf: string,
  limit = 50,
  offset = 0
) {
  if (!contextTables.includes(table))
    throw new Error("Unknown operational table")
  const metadata = sourceManifest().tables.find((item) => item.id === table)!
  const where = [
    "table_name=?",
    "(service_date IS NULL OR service_date<=?)",
    "(known_at IS NULL OR julianday(known_at)<=julianday(?))",
  ]
  const args: (string | number)[] = [table, serviceDateAt(asOf), asOf]
  for (const filter of filters) {
    if (
      !metadata.columns.includes(filter.field) ||
      !["eq", "gte", "lte"].includes(filter.op)
    )
      throw new Error("Unknown field or comparison")
    const numeric = filter.op !== "eq" && /^-?\d+(\.\d+)?$/.test(filter.value)
    where.push(
      `CAST(json_extract(payload, ?) AS ${numeric ? "REAL" : "TEXT"}) ${filter.op === "eq" ? "=" : filter.op === "gte" ? ">=" : "<="} ?`
    )
    args.push(
      `$.${filter.field}`,
      numeric ? Number(filter.value) : filter.value
    )
  }
  const condition = where.join(" AND ")
  const total = Number(
    (
      db()
        .prepare(`SELECT count(*) n FROM ops_records WHERE ${condition}`)
        .get(...args) as { n: number }
    ).n
  )
  const rows = db()
    .prepare(
      `SELECT record_id,payload FROM ops_records WHERE ${condition} ORDER BY service_date DESC,known_at DESC,record_id LIMIT ? OFFSET ?`
    )
    .all(...args, Math.min(100, Math.max(1, limit)), offset) as {
    record_id: string
    payload: string
  }[]
  return {
    table,
    total,
    offset,
    truncated: total > offset + rows.length,
    rows: rows.map((row) => ({
      evidenceId: `${table}:${row.record_id}`,
      record: sanitizeRecord(table, JSON.parse(row.payload), asOf),
    })),
  }
}
function sanitizeRecord(
  table: string,
  record: Record<string, unknown>,
  asOf: string
) {
  if (table !== "trips") return record
  const safe = { ...record }
  if (
    !record.actual_departure_at ||
    Date.parse(String(record.actual_departure_at)) > Date.parse(asOf)
  ) {
    for (const key of [
      "actual_departure_at",
      "actual_vehicle_id",
      "actual_crew_id",
    ])
      safe[key] = null
  }
  if (
    !record.actual_arrival_at ||
    Date.parse(String(record.actual_arrival_at)) > Date.parse(asOf)
  ) {
    safe.actual_arrival_at = null
    safe.completion_state = "not_observed_as_of"
  }
  return safe
}
export function allContextRecords(
  table: string,
  filters: ContextFilter[],
  asOf: string
) {
  const first = readContextRecords(table, filters, asOf, 100)
  const rows = [...first.rows]
  for (let offset = 100; offset < first.total; offset += 100)
    rows.push(...readContextRecords(table, filters, asOf, 100, offset).rows)
  return rows
}
export function contextCatalog() {
  return {
    tables: sourceManifest()
      .tables.filter((table) => contextTables.includes(table.id))
      .map((table) => ({
        table: table.id,
        columns: table.columns,
        sourceRows: table.count,
      })),
    source:
      "Fictional LionLink operations exercise; public route topology. Live events are local input. Imported source snapshots do not establish current real fleet readiness.",
  }
}
export function operatingHistory(
  service: string,
  asOf: string,
  days: number,
  stopCode: string | null
) {
  const from = serviceDateAt(
    new Date(Date.parse(asOf) - days * 86400000).toISOString()
  )
  const trips = allContextRecords(
    "trips",
    [
      { field: "service_no", op: "eq", value: service },
      { field: "service_date", op: "gte", value: from },
    ],
    asOf
  )
  const routes = readContextRecords(
    "routes",
    [{ field: "service_no", op: "eq", value: service }],
    asOf
  ).rows.map((row) => String(row.record.route_id))
  const observed = trips.filter((row) => row.record.actual_departure_at)
  const daily = [
    ...new Set(trips.map((row) => String(row.record.service_date))),
  ]
    .sort()
    .map((date) => {
      const rows = observed.filter((row) => row.record.service_date === date)
      const delays = rows.map(
        (row) =>
          (Date.parse(String(row.record.actual_departure_at)) -
            Date.parse(String(row.record.scheduled_departure_at))) /
          1000
      )
      return {
        date,
        publishedTrips: trips.filter((row) => row.record.service_date === date)
          .length,
        observedDepartures: rows.length,
        delayOver5Minutes: delays.filter((delay) => delay >= 300).length,
        meanDelaySeconds: delays.length
          ? Math.round(delays.reduce((a, b) => a + b, 0) / delays.length)
          : null,
        maxDelaySeconds: delays.length ? Math.max(...delays) : null,
        coverage:
          date === serviceDateAt(asOf)
            ? "Partial day as of observation time"
            : "Historical observed departures",
      }
    })
  const queueRows = routes.length
    ? db()
        .prepare(
          `SELECT service_date date,json_extract(payload,'$.stop_id') stopCode,count(*) observations,round(avg(json_extract(payload,'$.queue_after_people')),1) meanRemainingQueue,max(json_extract(payload,'$.queue_after_people')) maxRemainingQueue,max(json_extract(payload,'$.queue_before_people')) maxQueueBefore,sum(CASE WHEN json_extract(payload,'$.queue_after_people')>0 THEN 1 ELSE 0 END) callsWithQueue FROM ops_records WHERE table_name='stop_calls' AND service_date>=? AND service_date<=? AND julianday(known_at)<=julianday(?) AND json_extract(payload,'$.route_id') IN (${routes.map(() => "?").join(",")}) ${stopCode ? "AND json_extract(payload,'$.stop_id')=?" : ""} GROUP BY service_date,json_extract(payload,'$.stop_id') ORDER BY maxRemainingQueue DESC LIMIT 20`
        )
        .all(
          from,
          serviceDateAt(asOf),
          asOf,
          ...routes,
          ...(stopCode ? [stopCode] : [])
        )
    : []
  return {
    evidenceId: `history:${service}:${from}:${asOf}`,
    service,
    from,
    asOf,
    daily,
    queueHotspots: queueRows,
    delayedTripExamples: observed
      .filter(
        (row) =>
          Date.parse(String(row.record.actual_departure_at)) -
            Date.parse(String(row.record.scheduled_departure_at)) >=
          300000
      )
      .slice(0, 12),
    limitations:
      "Counts are observed records, not a forecast or proof of causes. Queue snapshots are never summed into unique passengers. Today's data is a partial day; source exercise dates bound the available history.",
  }
}

/** A read snapshot keeps one model investigation internally consistent while WAL writers continue. */
export async function withContextSnapshot<T>(
  work: () => Promise<T>
): Promise<T> {
  const connection = db()
  connection.exec("BEGIN")
  // Establish the SQLite snapshot now, before any asynchronous model request.
  connection.prepare("SELECT count(*) n FROM ops_records").get()
  try {
    return await work()
  } finally {
    connection.exec("ROLLBACK")
  }
}
