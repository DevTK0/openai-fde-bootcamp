import { createHash, randomUUID } from "node:crypto"
import { mkdirSync } from "node:fs"
import { basename, dirname, resolve } from "node:path"
import { DatabaseSync } from "node:sqlite"
import type { PlanningCandidate } from "@/lib/planning/contracts"
import type {
  ProposalRecord,
  ProposalReviewRequest,
  ProposalSaveRequest,
} from "./contracts"

const cwd = resolve(process.cwd())
const appDirectory = basename(cwd) === "web" && basename(dirname(cwd)) === "apps"
  ? cwd
  : resolve(cwd, "apps/web")
const dbPath = process.env.PLANNING_DB_PATH
  ? resolve(process.env.PLANNING_DB_PATH)
  : resolve(appDirectory, ".local/planning.sqlite")
let database: DatabaseSync | undefined

function getDatabase() {
  if (database) return database
  mkdirSync(dirname(dbPath), { recursive: true })
  const opened = new DatabaseSync(dbPath)
  opened.exec("PRAGMA busy_timeout = 2500; PRAGMA journal_mode = WAL;")
  opened.exec(`
    CREATE TABLE IF NOT EXISTS proposals (
      id TEXT PRIMARY KEY,
      scenario_id TEXT NOT NULL,
      scenario_date TEXT NOT NULL,
      mode TEXT NOT NULL,
      candidate_id TEXT NOT NULL,
      source_hash TEXT NOT NULL,
      version INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('draft','approved','rejected')),
      reason TEXT,
      candidate_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    ) STRICT;
    CREATE INDEX IF NOT EXISTS proposals_updated_idx ON proposals(updated_at DESC);
    CREATE TABLE IF NOT EXISTS audit_events (
      id TEXT PRIMARY KEY,
      proposal_id TEXT NOT NULL,
      version INTEGER NOT NULL,
      action TEXT NOT NULL,
      actor TEXT NOT NULL,
      reason TEXT,
      idempotency_key TEXT NOT NULL,
      occurred_at TEXT NOT NULL,
      FOREIGN KEY(proposal_id) REFERENCES proposals(id)
    ) STRICT;
    CREATE TABLE IF NOT EXISTS idempotency (
      key TEXT PRIMARY KEY,
      operation TEXT NOT NULL,
      resource_id TEXT NOT NULL,
      fingerprint TEXT NOT NULL,
      created_at TEXT NOT NULL
    ) STRICT;
    CREATE TRIGGER IF NOT EXISTS audit_events_no_update
      BEFORE UPDATE ON audit_events BEGIN SELECT RAISE(ABORT, 'audit is append-only'); END;
    CREATE TRIGGER IF NOT EXISTS audit_events_no_delete
      BEFORE DELETE ON audit_events BEGIN SELECT RAISE(ABORT, 'audit is append-only'); END;
  `)
  const columns = opened.prepare("PRAGMA table_info(idempotency)").all() as { name: string }[]
  if (!columns.some((column) => column.name === "fingerprint")) {
    opened.exec("ALTER TABLE idempotency ADD COLUMN fingerprint TEXT NOT NULL DEFAULT ''")
  }
  opened.exec("PRAGMA foreign_keys = ON")
  database = opened
  return database
}

function fromRow(row: Record<string, unknown>): ProposalRecord {
  return {
    id: String(row.id),
    scenarioId: String(row.scenario_id) as ProposalRecord["scenarioId"],
    date: String(row.scenario_date),
    mode: String(row.mode) as ProposalRecord["mode"],
    candidateId: String(row.candidate_id),
    sourceHash: String(row.source_hash),
    version: Number(row.version),
    status: String(row.status) as ProposalRecord["status"],
    reason: row.reason === null ? null : String(row.reason),
    candidate: JSON.parse(String(row.candidate_json)) as PlanningCandidate,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

function proposalById(id: string) {
  const row = getDatabase().prepare("SELECT * FROM proposals WHERE id = ?").get(id) as Record<string, unknown> | undefined
  return row ? fromRow(row) : null
}

function withTransaction<T>(fn: (db: DatabaseSync) => T): T {
  const db = getDatabase()
  db.exec("BEGIN IMMEDIATE")
  try {
    const result = fn(db)
    db.exec("COMMIT")
    return result
  } catch (error) {
    db.exec("ROLLBACK")
    throw error
  }
}

function idempotencyFingerprint(input: ProposalSaveRequest | ProposalReviewRequest) {
  return createHash("sha256").update(JSON.stringify(input)).digest("hex")
}

function idempotentResult(db: DatabaseSync, key: string, operation: string, fingerprint: string) {
  const record = db.prepare("SELECT operation, resource_id, fingerprint FROM idempotency WHERE key = ?").get(key) as { operation: string; resource_id: string; fingerprint: string } | undefined
  if (!record) return null
  if (record.operation !== operation || record.fingerprint !== fingerprint) throw new StoreConflictError("That idempotency key was already used for a different action.")
  const proposal = proposalById(record.resource_id)
  if (!proposal) throw new StoreConflictError("The original idempotent result is unavailable.")
  return proposal
}

export class StoreConflictError extends Error {}
export class StoreNotFoundError extends Error {}
export class StoreFeasibilityError extends Error {}

export function listProposals(): ProposalRecord[] {
  const rows = getDatabase().prepare("SELECT * FROM proposals ORDER BY updated_at DESC, id").all() as Record<string, unknown>[]
  return rows.map(fromRow)
}

export function getIdempotentSaveResult(input: ProposalSaveRequest) {
  return idempotentResult(getDatabase(), input.idempotencyKey, "save", idempotencyFingerprint(input))
}

export function getIdempotentReviewResult(input: ProposalReviewRequest) {
  return idempotentResult(getDatabase(), input.idempotencyKey, "review", idempotencyFingerprint(input))
}

export function saveProposal(input: ProposalSaveRequest, candidate: PlanningCandidate): ProposalRecord {
  return withTransaction((db) => {
    const fingerprint = idempotencyFingerprint(input)
    const previous = idempotentResult(db, input.idempotencyKey, "save", fingerprint)
    if (previous) return previous
    const id = randomUUID()
    const now = new Date().toISOString()
    db.prepare(`INSERT INTO proposals
      (id, scenario_id, scenario_date, mode, candidate_id, source_hash, version, status, reason, candidate_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, 'draft', NULL, ?, ?, ?)`)
      .run(id, input.scenarioId, input.date, input.mode, input.candidateId, input.sourceHash, JSON.stringify(candidate), now, now)
    db.prepare(`INSERT INTO audit_events (id, proposal_id, version, action, actor, reason, idempotency_key, occurred_at)
      VALUES (?, ?, 1, 'saved', 'planner', NULL, ?, ?)`)
      .run(randomUUID(), id, input.idempotencyKey, now)
    db.prepare("INSERT INTO idempotency (key, operation, resource_id, fingerprint, created_at) VALUES (?, 'save', ?, ?, ?)")
      .run(input.idempotencyKey, id, fingerprint, now)
    return proposalById(id)!
  })
}

export function reviewProposal(input: ProposalReviewRequest, candidate: PlanningCandidate | null): ProposalRecord {
  return withTransaction((db) => {
    const fingerprint = idempotencyFingerprint(input)
    const previous = idempotentResult(db, input.idempotencyKey, "review", fingerprint)
    if (previous) return previous
    const current = proposalById(input.proposalId)
    if (!current) throw new StoreNotFoundError("Proposal not found.")
    if (current.version !== input.expectedVersion) throw new StoreConflictError("Proposal changed since it was loaded. Reload before reviewing.")
    if (current.status !== "draft") throw new StoreConflictError("Only draft proposals can be reviewed.")
    if (input.decision === "approve") {
      if (!candidate || candidate.status !== "feasible" || candidate.conflicts.length > 0) {
        throw new StoreFeasibilityError("This proposal is no longer feasible under the current source snapshot.")
      }
    }
    const version = current.version + 1
    const now = new Date().toISOString()
    const status = input.decision === "approve" ? "approved" : "rejected"
    const reason = input.reason?.trim() || null
    db.prepare(`UPDATE proposals SET version = ?, status = ?, reason = ?, candidate_json = ?, updated_at = ?
      WHERE id = ? AND version = ? AND status = 'draft'`)
      .run(version, status, reason, JSON.stringify(candidate ?? current.candidate), now, current.id, current.version)
    db.prepare(`INSERT INTO audit_events (id, proposal_id, version, action, actor, reason, idempotency_key, occurred_at)
      VALUES (?, ?, ?, ?, 'planner', ?, ?, ?)`)
      .run(randomUUID(), current.id, version, status, reason, input.idempotencyKey, now)
    db.prepare("INSERT INTO idempotency (key, operation, resource_id, fingerprint, created_at) VALUES (?, 'review', ?, ?, ?)")
      .run(input.idempotencyKey, current.id, fingerprint, now)
    return proposalById(current.id)!
  })
}

export function getProposal(id: string) {
  return proposalById(id)
}
