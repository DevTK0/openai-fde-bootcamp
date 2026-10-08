import { createHash, randomUUID } from "node:crypto"
import { mkdirSync } from "node:fs"
import { basename, dirname, resolve } from "node:path"
import { DatabaseSync } from "node:sqlite"
import { eventSchema } from "./contracts"
import type {
  Decision,
  LiveEvent,
  LiveEventInput,
  LiveRun,
  LiveSnapshot,
  TraceStep,
} from "./contracts"

export const liveDatabasePath = process.env.PLANNING_DB_PATH
  ? resolve(process.env.PLANNING_DB_PATH)
  : resolve(
      basename(process.cwd()) === "web"
        ? process.cwd()
        : resolve(process.cwd(), "apps/web"),
      ".local/planning.sqlite"
    )
let db: DatabaseSync | undefined
function database() {
  if (db) return db
  mkdirSync(dirname(liveDatabasePath), { recursive: true })
  db = new DatabaseSync(liveDatabasePath)
  db.exec(`PRAGMA busy_timeout=2500; PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS live_events (
      seq INTEGER PRIMARY KEY AUTOINCREMENT,
      id TEXT NOT NULL UNIQUE DEFAULT (lower(hex(randomblob(16)))),
      kind TEXT NOT NULL CHECK(kind IN ('complaint','fault','delay','crowding','clearance','analysis','observation')),
      service TEXT NOT NULL,
      service_date TEXT NOT NULL, title TEXT NOT NULL, details TEXT NOT NULL DEFAULT '',
      vehicle_id TEXT, stop_code TEXT, delay_seconds INTEGER, waiting_people INTEGER,
      occurred_at TEXT NOT NULL, source TEXT NOT NULL DEFAULT 'database',
      received_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    ) STRICT;
    CREATE TABLE IF NOT EXISTS live_runs (
      id TEXT PRIMARY KEY, event_seq INTEGER UNIQUE NOT NULL,
      status TEXT NOT NULL, owner TEXT NOT NULL, started_at TEXT NOT NULL,
      finished_at TEXT, trace_json TEXT NOT NULL DEFAULT '[]', error TEXT
    ) STRICT;
    CREATE TABLE IF NOT EXISTS live_decisions (
      id TEXT PRIMARY KEY, event_seq INTEGER UNIQUE NOT NULL, service TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open', version INTEGER NOT NULL DEFAULT 1,
      payload_json TEXT NOT NULL, created_at TEXT NOT NULL, reviewed_at TEXT, review_note TEXT
    ) STRICT;
    CREATE TABLE IF NOT EXISTS live_monitor (
      id INTEGER PRIMARY KEY CHECK(id=1), paused INTEGER NOT NULL DEFAULT 0,
      llm_enabled INTEGER NOT NULL DEFAULT 0, heartbeat_at TEXT, last_error TEXT,
      revision INTEGER NOT NULL DEFAULT 0, lease_owner TEXT, lease_until TEXT, last_model_at TEXT
    ) STRICT;
    INSERT OR IGNORE INTO live_monitor(id) VALUES(1);
    CREATE TABLE IF NOT EXISTS live_reviews (
      id TEXT PRIMARY KEY, decision_id TEXT NOT NULL, action TEXT NOT NULL,
      note TEXT NOT NULL, at TEXT NOT NULL, version INTEGER NOT NULL
    ) STRICT;
    CREATE TRIGGER IF NOT EXISTS live_events_immutable_update BEFORE UPDATE ON live_events BEGIN SELECT RAISE(ABORT, 'Events are append-only; insert a correction.'); END;
    CREATE TRIGGER IF NOT EXISTS live_events_immutable_delete BEFORE DELETE ON live_events BEGIN SELECT RAISE(ABORT, 'Events are append-only.'); END;
    CREATE TRIGGER IF NOT EXISTS live_events_revision AFTER INSERT ON live_events BEGIN UPDATE live_monitor SET revision=revision+1 WHERE id=1; END;
    CREATE TRIGGER IF NOT EXISTS live_reviews_no_update BEFORE UPDATE ON live_reviews BEGIN SELECT RAISE(ABORT, 'Review log is append-only.'); END;
    CREATE TRIGGER IF NOT EXISTS live_reviews_no_delete BEFORE DELETE ON live_reviews BEGIN SELECT RAISE(ABORT, 'Review log is append-only.'); END;
  `)
  const eventDefinition = (
    db
      .prepare("SELECT sql FROM sqlite_master WHERE name='live_events'")
      .get() as { sql: string }
  ).sql
  if (
    !eventDefinition.includes("'observation'") ||
    eventDefinition.includes("CHECK(service IN")
  ) {
    db.exec("BEGIN IMMEDIATE")
    try {
      db.exec(
        eventDefinition
          .replace("live_events", "live_events_migrating")
          .replace("'complaint'", "'observation','complaint'")
          .replace("CHECK(service IN ('235','238'))", "")
      )
      db.exec(
        "INSERT INTO live_events_migrating SELECT * FROM live_events; DROP TABLE live_events; ALTER TABLE live_events_migrating RENAME TO live_events;"
      )
      db.exec(`CREATE TRIGGER live_events_immutable_update BEFORE UPDATE ON live_events BEGIN SELECT RAISE(ABORT, 'Events are append-only; insert a correction.'); END;
        CREATE TRIGGER live_events_immutable_delete BEFORE DELETE ON live_events BEGIN SELECT RAISE(ABORT, 'Events are append-only.'); END;
        CREATE TRIGGER live_events_revision AFTER INSERT ON live_events BEGIN UPDATE live_monitor SET revision=revision+1 WHERE id=1; END;`)
      db.exec("COMMIT")
    } catch (error) {
      db.exec("ROLLBACK")
      throw error
    }
  }
  return db
}
function transaction<T>(work: (conn: DatabaseSync) => T): T {
  const conn = database()
  conn.exec("BEGIN IMMEDIATE")
  try {
    const value = work(conn)
    conn.exec("COMMIT")
    return value
  } catch (error) {
    conn.exec("ROLLBACK")
    throw error
  }
}
function eventFromRow(row: Record<string, unknown>): LiveEvent {
  const input = eventSchema.parse({
    kind: row.kind,
    service: row.service,
    serviceDate: row.service_date,
    title: row.title,
    details: row.details,
    vehicleId: row.vehicle_id,
    stopCode: row.stop_code,
    delaySeconds: row.delay_seconds,
    waitingPeople: row.waiting_people,
    occurredAt: row.occurred_at,
    source: row.source,
  })
  return {
    ...input,
    seq: Number(row.seq),
    id: String(row.id),
    receivedAt: String(row.received_at),
  }
}
function runFromRow(row: Record<string, unknown>): LiveRun {
  return {
    id: String(row.id),
    eventSeq: Number(row.event_seq),
    status: row.status as LiveRun["status"],
    startedAt: String(row.started_at),
    finishedAt: row.finished_at as string | null,
    trace: JSON.parse(String(row.trace_json)),
    error: row.error as string | null,
  }
}
function decisionFromRow(row: Record<string, unknown>): Decision {
  return {
    ...JSON.parse(String(row.payload_json)),
    status: row.status,
    version: Number(row.version),
    reviewedAt: row.reviewed_at,
    reviewNote: row.review_note,
  } as Decision
}
export function insertLiveEvent(input: LiveEventInput): LiveEvent {
  const parsed = eventSchema.parse(input)
  const conn = database()
  const result = conn
    .prepare(
      `INSERT INTO live_events(id,kind,service,service_date,title,details,vehicle_id,stop_code,delay_seconds,waiting_people,occurred_at,source) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`
    )
    .run(
      randomUUID(),
      parsed.kind,
      parsed.service,
      parsed.serviceDate,
      parsed.title,
      parsed.details,
      parsed.vehicleId,
      parsed.stopCode,
      parsed.delaySeconds,
      parsed.waitingPeople,
      parsed.occurredAt,
      parsed.source
    )
  return eventFromRow(
    conn
      .prepare("SELECT * FROM live_events WHERE seq=?")
      .get(result.lastInsertRowid)! as Record<string, unknown>
  )
}
export function getLiveContext(event: LiveEvent): LiveEvent[] {
  return (
    database()
      .prepare(
        "SELECT * FROM live_events WHERE service=? AND service_date=? AND seq<=? ORDER BY seq DESC"
      )
      .all(event.service, event.serviceDate, event.seq) as Record<
      string,
      unknown
    >[]
  ).flatMap((row) => {
    try {
      return [eventFromRow(row)]
    } catch {
      return []
    }
  })
}
export function monitorSettings() {
  return database().prepare("SELECT * FROM live_monitor WHERE id=1").get() as {
    paused: number
    llm_enabled: number
    heartbeat_at: string | null
    last_error: string | null
    revision: number
    lease_owner: string | null
    lease_until: string | null
    last_model_at: string | null
  }
}
export function updateMonitorSettings(input: {
  paused?: boolean
  llmEnabled?: boolean
}) {
  const current = monitorSettings()
  database()
    .prepare(
      "UPDATE live_monitor SET paused=?,llm_enabled=?,revision=revision+1 WHERE id=1"
    )
    .run(
      input.paused === undefined ? current.paused : Number(input.paused),
      input.llmEnabled === undefined
        ? current.llm_enabled
        : Number(input.llmEnabled)
    )
}
export function heartbeat(owner: string, now = Date.now()): boolean {
  return transaction((conn) => {
    const state = monitorSettings()
    if (
      state.lease_owner &&
      state.lease_owner !== owner &&
      Date.parse(state.lease_until ?? "") > now
    )
      return false
    conn
      .prepare(
        "UPDATE live_monitor SET lease_owner=?,lease_until=?,heartbeat_at=? WHERE id=1"
      )
      .run(
        owner,
        new Date(now + 60_000).toISOString(),
        new Date(now).toISOString()
      )
    return true
  })
}
export function releaseMonitor(owner: string) {
  database()
    .prepare(
      "UPDATE live_monitor SET lease_owner=NULL,lease_until=NULL,heartbeat_at=NULL WHERE id=1 AND lease_owner=?"
    )
    .run(owner)
}
export function claimLiveEvent(
  owner: string
): { event: LiveEvent; run: LiveRun } | null {
  return transaction((conn) => {
    const state = monitorSettings()
    if (
      state.paused ||
      state.lease_owner !== owner ||
      Date.parse(state.lease_until ?? "") < Date.now()
    )
      return null
    const stale = new Date(Date.now() - 60_000).toISOString()
    const raw = conn
      .prepare(
        `SELECT e.* FROM live_events e LEFT JOIN live_runs r ON e.seq=r.event_seq WHERE r.id IS NULL OR (r.status='processing' AND r.started_at<?) ORDER BY e.seq LIMIT 1`
      )
      .get(stale) as Record<string, unknown> | undefined
    if (!raw) return null
    const id = randomUUID(),
      at = new Date().toISOString()
    conn
      .prepare(
        `INSERT INTO live_runs(id,event_seq,status,owner,started_at) VALUES(?,?,'processing',?,?) ON CONFLICT(event_seq) DO UPDATE SET status='processing',owner=excluded.owner,started_at=excluded.started_at,trace_json='[]',error=NULL`
      )
      .run(id, raw.seq as number, owner, at)
    try {
      const event = eventFromRow(raw)
      const run = runFromRow(
        conn
          .prepare("SELECT * FROM live_runs WHERE event_seq=?")
          .get(event.seq)! as Record<string, unknown>
      )
      return { event, run }
    } catch {
      conn
        .prepare(
          "UPDATE live_runs SET status='failed',finished_at=?,error=? WHERE event_seq=?"
        )
        .run(
          at,
          "Invalid event schema. Insert a corrected event; this row was quarantined.",
          raw.seq as number
        )
      conn
        .prepare("UPDATE live_monitor SET revision=revision+1 WHERE id=1")
        .run()
      return null
    }
  })
}
export function saveRunTrace(
  eventSeq: number,
  owner: string,
  trace: TraceStep[]
) {
  database()
    .prepare(
      "UPDATE live_runs SET trace_json=? WHERE event_seq=? AND owner=? AND status='processing'"
    )
    .run(JSON.stringify(trace), eventSeq, owner)
  database()
    .prepare("UPDATE live_monitor SET revision=revision+1 WHERE id=1")
    .run()
}
function writeDecision(
  conn: DatabaseSync,
  event: LiveEvent,
  decision: Decision
) {
  const previous = conn
    .prepare("SELECT * FROM live_decisions WHERE service=? AND status='open'")
    .all(decision.service) as Record<string, unknown>[]
  for (const row of previous) {
    const old = decisionFromRow(row)
    if (old.id !== decision.id && old.serviceDate === event.serviceDate)
      conn
        .prepare(
          "UPDATE live_decisions SET status='superseded',version=version+1 WHERE id=?"
        )
        .run(old.id)
  }
  conn
    .prepare(
      "INSERT INTO live_decisions(id,event_seq,service,payload_json,created_at) VALUES(?,?,?,?,?) ON CONFLICT(event_seq) DO UPDATE SET payload_json=excluded.payload_json"
    )
    .run(
      decision.id,
      event.seq,
      decision.service,
      JSON.stringify(decision),
      decision.createdAt
    )
}
export function publishLiveAssessment(
  event: LiveEvent,
  owner: string,
  decision: Decision
) {
  transaction((conn) => {
    const run = conn
      .prepare(
        "SELECT id FROM live_runs WHERE event_seq=? AND owner=? AND status='processing'"
      )
      .get(event.seq, owner)
    if (!run || monitorSettings().lease_owner !== owner)
      throw new Error("Worker lease changed")
    writeDecision(conn, event, decision)
    conn.prepare("UPDATE live_monitor SET revision=revision+1 WHERE id=1").run()
  })
}
export function completeLiveRun(
  event: LiveEvent,
  owner: string,
  decision: Decision | null,
  trace: TraceStep[],
  error?: string
) {
  transaction((conn) => {
    const run = conn
      .prepare(
        "SELECT * FROM live_runs WHERE event_seq=? AND owner=? AND status='processing'"
      )
      .get(event.seq, owner)
    if (!run)
      throw new Error("Worker lease changed; evaluation was not published.")
    if (!decision && !error) {
      const existing = conn
        .prepare(
          "SELECT * FROM live_decisions WHERE service=? AND status='open'"
        )
        .all(event.service) as Record<string, unknown>[]
      for (const row of existing)
        if (decisionFromRow(row).serviceDate === event.serviceDate)
          conn
            .prepare(
              "UPDATE live_decisions SET status='superseded',version=version+1 WHERE id=?"
            )
            .run(String(row.id))
    }
    if (decision) writeDecision(conn, event, decision)
    conn
      .prepare(
        "UPDATE live_runs SET status=?,finished_at=?,trace_json=?,error=? WHERE event_seq=? AND owner=?"
      )
      .run(
        error ? "failed" : "completed",
        new Date().toISOString(),
        JSON.stringify(trace),
        error ?? null,
        event.seq,
        owner
      )
    conn
      .prepare(
        "UPDATE live_monitor SET revision=revision+1,last_error=? WHERE id=1"
      )
      .run(error ?? null)
  })
}
export function reserveModelBudget(intervalMs = 5000): boolean {
  return transaction((conn) => {
    const state = monitorSettings()
    if (
      !state.llm_enabled ||
      (state.last_model_at &&
        Date.now() - Date.parse(state.last_model_at) < intervalMs)
    )
      return false
    conn
      .prepare("UPDATE live_monitor SET last_model_at=? WHERE id=1")
      .run(new Date().toISOString())
    return true
  })
}
export class LiveReviewConflict extends Error {}
export function reviewLiveDecision(
  id: string,
  version: number,
  status: "acknowledged" | "dismissed",
  note: string
) {
  transaction((conn) => {
    const row = conn
      .prepare("SELECT * FROM live_decisions WHERE id=?")
      .get(id) as Record<string, unknown> | undefined
    if (!row || Number(row.version) !== version || row.status !== "open")
      throw new LiveReviewConflict(
        "This recommendation changed. Reload before reviewing it."
      )
    if (
      conn
        .prepare("SELECT name FROM sqlite_master WHERE name='ops_changes'")
        .get()
    ) {
      const changed = conn
        .prepare(
          "SELECT id FROM ops_changes WHERE processed=0 AND (service IS NULL OR service=?) LIMIT 1"
        )
        .get(String(row.service))
      if (changed)
        throw new LiveReviewConflict(
          "Operational records changed. Wait for the agent to reassess before reviewing this recommendation."
        )
    }
    const pending = Number(
      (
        conn
          .prepare(
            "SELECT count(*) AS n FROM live_events e LEFT JOIN live_runs r ON e.seq=r.event_seq WHERE (e.service=? OR e.service='network') AND e.service_date=? AND e.seq>? AND (r.id IS NULL OR r.status='processing')"
          )
          .get(
            String(row.service),
            decisionFromRow(row).serviceDate,
            Number(row.event_seq)
          ) as { n: number }
      ).n
    )
    if (pending)
      throw new LiveReviewConflict(
        "New signals are being evaluated. Wait for the updated recommendation."
      )
    const at = new Date().toISOString()
    conn
      .prepare(
        "UPDATE live_decisions SET status=?,version=version+1,reviewed_at=?,review_note=? WHERE id=?"
      )
      .run(status, at, note, id)
    conn
      .prepare(
        "INSERT INTO live_reviews(id,decision_id,action,note,at,version) VALUES(?,?,?,?,?,?)"
      )
      .run(randomUUID(), id, status, note, at, version + 1)
    conn.prepare("UPDATE live_monitor SET revision=revision+1 WHERE id=1").run()
  })
}
export function liveSnapshot(): LiveSnapshot {
  const conn = database(),
    state = monitorSettings()
  const raw = conn
    .prepare("SELECT * FROM live_events ORDER BY seq DESC LIMIT 80")
    .all() as Record<string, unknown>[]
  let invalid = 0
  const events = raw.flatMap((row) => {
    try {
      return [eventFromRow(row)]
    } catch {
      invalid++
      return []
    }
  })
  const pending = Number(
    (
      conn
        .prepare(
          "SELECT count(*) AS n FROM live_events e LEFT JOIN live_runs r ON e.seq=r.event_seq WHERE r.id IS NULL OR r.status='processing'"
        )
        .get() as { n: number }
    ).n
  )
  return {
    revision: state.revision,
    services: availableServices(),
    events,
    decisions: (
      conn
        .prepare(
          "SELECT * FROM live_decisions ORDER BY created_at DESC LIMIT 60"
        )
        .all() as Record<string, unknown>[]
    ).map(decisionFromRow),
    runs: (
      conn
        .prepare("SELECT * FROM live_runs ORDER BY started_at DESC LIMIT 80")
        .all() as Record<string, unknown>[]
    ).map(runFromRow),
    pending,
    invalid,
    monitor: {
      online:
        !!state.heartbeat_at &&
        Date.now() - Date.parse(state.heartbeat_at) < 10_000,
      paused: !!state.paused,
      llmEnabled: !!state.llm_enabled,
      heartbeatAt: state.heartbeat_at,
      lastError: state.last_error,
      lastModelAt: state.last_model_at,
    },
    serverTime: new Date().toISOString(),
  }
}
export function liveRevision() {
  const state = monitorSettings()
  return createHash("sha256")
    .update(
      JSON.stringify([
        state.revision,
        state.heartbeat_at,
        state.paused,
        state.llm_enabled,
      ])
    )
    .digest("hex")
}

/** Read-only agent access; no future delivery sequence or observation time is admitted. */
export function agentEventHistory(
  event: LiveEvent,
  asOf: string,
  days: number,
  service: string | null
) {
  const from = new Date(Date.parse(asOf) - days * 86400000).toISOString()
  const rows = database()
    .prepare(
      "SELECT e.*,d.payload_json AS interpretation_payload FROM live_events e LEFT JOIN live_decisions d ON d.event_seq=e.seq WHERE e.seq<=? AND julianday(e.occurred_at)<=julianday(?) AND julianday(e.occurred_at)>=julianday(?) AND (? IS NULL OR e.service=? OR d.service=?) ORDER BY e.occurred_at DESC,e.seq DESC LIMIT 100"
    )
    .all(event.seq, asOf, from, service, service, service) as Record<
    string,
    unknown
  >[]
  return rows.flatMap((row) => {
    try {
      return [
        {
          evidenceId: `live_events:${row.seq}`,
          record: {
            ...eventFromRow(row),
            ...(row.interpretation_payload
              ? {
                  interpretation: (
                    JSON.parse(String(row.interpretation_payload)) as Decision
                  ).agent?.interpretation,
                }
              : {}),
          },
        },
      ]
    } catch {
      return []
    }
  })
}

export function agentAssessmentTime(event: LiveEvent) {
  const rows = database()
    .prepare("SELECT * FROM live_events WHERE seq<=? AND service_date=?")
    .all(event.seq, event.serviceDate) as Record<string, unknown>[]
  return new Date(
    rows.reduce((latest, row) => {
      try {
        return Math.max(latest, Date.parse(eventFromRow(row).occurredAt))
      } catch {
        return latest
      }
    }, Date.parse(event.occurredAt))
  ).toISOString()
}
export function requestAgentAssessment(service: string) {
  const raw = database()
    .prepare(
      "SELECT e.* FROM live_events e LEFT JOIN live_decisions d ON d.event_seq=e.seq WHERE e.service=? OR d.service=? ORDER BY e.seq DESC LIMIT 1"
    )
    .get(service, service) as Record<string, unknown> | undefined
  if (!raw) throw new Error("Record an observation for this service first.")
  const prior = eventFromRow(raw)
  return insertLiveEvent({
    kind: "analysis",
    service,
    serviceDate: prior.serviceDate,
    title: `Planner requested a fresh agent assessment for service ${service}`,
    details:
      "Reassess the existing operating history and recent observations. This request is not an additional complaint, fault, delay measurement or queue snapshot.",
    vehicleId: null,
    stopCode: null,
    delaySeconds: null,
    waitingPeople: null,
    occurredAt: agentAssessmentTime(prior),
    source: "operator",
  })
}

/** Bridge operational record changes into assessment requests; bootstrap imports are suppressed by the importer. */
export function bridgeContextChanges() {
  if (
    !database()
      .prepare("SELECT name FROM sqlite_master WHERE name='ops_changes'")
      .get()
  )
    return
  transaction((conn) => {
    const changes = conn
      .prepare(
        "SELECT * FROM ops_changes WHERE processed=0 ORDER BY id LIMIT 25"
      )
      .all() as Record<string, unknown>[]
    // Coalesce a burst into one assessment per service/date; every source change is retained in the inbox.
    const grouped = new Map<
      string,
      {
        service: string
        date: string
        asOf: string
        references: string[]
      }
    >()
    for (const change of changes) {
      const services =
        change.service !== null
          ? [String(change.service)]
          : (
              conn
                .prepare(
                  "SELECT DISTINCT service FROM live_events WHERE service<>'network'"
                )
                .all() as { service: string }[]
            ).map((row) => row.service)
      for (const service of services) {
        const last = conn
          .prepare(
            "SELECT * FROM live_events WHERE service=? ORDER BY seq DESC LIMIT 1"
          )
          .get(service) as Record<string, unknown> | undefined
        const prior = last ? eventFromRow(last) : null
        const stamp =
          typeof change.known_at === "string" &&
          Number.isFinite(Date.parse(change.known_at))
            ? change.known_at
            : prior
              ? agentAssessmentTime(prior)
              : String(change.at)
        const date = new Date(stamp).toLocaleDateString("en-CA", {
          timeZone: "Asia/Singapore",
        })
        const key = `${service}:${date}`
        const group = grouped.get(key) ?? {
          service,
          date,
          asOf: stamp,
          references: [],
        }
        if (Date.parse(stamp) > Date.parse(group.asOf)) group.asOf = stamp
        group.references.push(`${change.table_name}:${change.record_id}`)
        grouped.set(key, group)
      }
      conn
        .prepare("UPDATE ops_changes SET processed=1 WHERE id=?")
        .run(Number(change.id))
    }
    for (const group of grouped.values())
      insertLiveEvent({
        kind: "analysis",
        service: group.service,
        serviceDate: group.date,
        title: `Operational database changed: reassess service ${group.service}`,
        details: `Updated SQLite records: ${group.references.join(", ")}. Investigate their impact and available resource options. This is a context-change notification, not a new independent complaint or queue observation.`,
        vehicleId: null,
        stopCode: null,
        delaySeconds: null,
        waitingPeople: null,
        occurredAt: group.asOf,
        source: "database",
      })
  })
}

export function agentFaultContext(event: LiveEvent, asOf: string) {
  const rows = database()
    .prepare(
      "SELECT * FROM live_events WHERE seq<=? AND kind IN ('fault','clearance') AND julianday(occurred_at)<=julianday(?) ORDER BY julianday(occurred_at),seq"
    )
    .all(event.seq, asOf) as Record<string, unknown>[]
  const latest = new Map<string, LiveEvent>()
  for (const row of rows) {
    try {
      const parsed = eventFromRow(row)
      if (parsed.vehicleId) latest.set(parsed.vehicleId, parsed)
    } catch {}
  }
  const interpreted = database()
    .prepare(
      "SELECT e.*, d.payload_json FROM live_events e JOIN live_decisions d ON d.event_seq=e.seq WHERE e.kind='observation' AND e.seq<=? AND julianday(e.occurred_at)<=julianday(?)"
    )
    .all(event.seq, asOf) as Record<string, unknown>[]
  for (const row of interpreted) {
    const interpretation = (JSON.parse(String(row.payload_json)) as Decision)
      .agent?.interpretation
    if (
      !interpretation?.vehicleId ||
      !interpretation.signalTypes.includes("fault")
    )
      continue
    const raw = eventFromRow(row),
      prior = latest.get(interpretation.vehicleId)
    if (
      !prior ||
      Date.parse(raw.occurredAt) > Date.parse(prior.occurredAt) ||
      (Date.parse(raw.occurredAt) === Date.parse(prior.occurredAt) &&
        raw.seq > prior.seq)
    )
      latest.set(interpretation.vehicleId, {
        ...raw,
        kind: "fault",
        vehicleId: interpretation.vehicleId,
      })
  }
  return [...latest.values()]
    .filter((row) => row.kind === "fault")
    .map((record) => ({ evidenceId: `live_events:${record.seq}`, record }))
}

/** Service catalogue comes from source routes and committed reports, not exercise scenario IDs. */
export function availableServices() {
  const conn = database()
  const values = new Set(
    (
      conn
        .prepare(
          "SELECT DISTINCT service FROM live_events WHERE service<>'network'"
        )
        .all() as { service: string }[]
    ).map((row) => row.service)
  )
  if (
    conn
      .prepare("SELECT name FROM sqlite_master WHERE name='ops_records'")
      .get()
  )
    for (const row of conn
      .prepare(
        "SELECT DISTINCT json_extract(payload,'$.service_no') AS service FROM ops_records WHERE table_name='routes'"
      )
      .all() as { service: string }[])
      if (row.service) values.add(String(row.service))
  return [...values].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  )
}
