import { DatabaseSync } from "node:sqlite"
import { randomUUID } from "node:crypto"
import { mkdirSync } from "node:fs"
import { dirname } from "node:path"
import { z } from "zod"
import {
  completesTrigger,
  conversationSchema,
  requestSchema,
  segmentSchema,
  type Command,
  type FactoryRequest,
  type RequestState,
  type Snapshot,
} from "./contracts"

const rowSchema = z.object({ data: z.string() })
const workerSchema = z.object({
  pid: z.number(),
  heartbeat: z.number(),
  reason: z.string().nullable(),
})
function alive(pid: number) {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}
export class Conflict extends Error {}
export class Store {
  private db: DatabaseSync
  constructor(path: string) {
    mkdirSync(dirname(path), { recursive: true, mode: 0o700 })
    this.db = new DatabaseSync(path)
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS conversations (id TEXT PRIMARY KEY, data TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS segments (id TEXT PRIMARY KEY, conversation_id TEXT NOT NULL, data TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS requests (id TEXT PRIMARY KEY, conversation_id TEXT NOT NULL, data TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS worker (id INTEGER PRIMARY KEY CHECK(id=1), pid INTEGER NOT NULL, heartbeat INTEGER NOT NULL, reason TEXT, child_pid INTEGER);
      CREATE INDEX IF NOT EXISTS segment_conversation ON segments(conversation_id);
      CREATE INDEX IF NOT EXISTS request_conversation ON requests(conversation_id);
      CREATE INDEX IF NOT EXISTS request_state ON requests(json_extract(data, '$.state.kind'));`)
  }
  close() {
    this.db.close()
  }
  private transaction<T>(fn: () => T): T {
    this.db.exec("BEGIN IMMEDIATE")
    try {
      const result = fn()
      this.db.exec("COMMIT")
      return result
    } catch (error) {
      this.db.exec("ROLLBACK")
      throw error
    }
  }
  private allRequests() {
    return this.db
      .prepare("SELECT data FROM requests ORDER BY rowid")
      .all()
      .map((row) => requestSchema.parse(JSON.parse(rowSchema.parse(row).data)))
  }
  getRequest(id: string) {
    const row = this.db.prepare("SELECT data FROM requests WHERE id=?").get(id)
    if (!row) throw new Conflict("Request not found")
    return requestSchema.parse(JSON.parse(rowSchema.parse(row).data))
  }
  private save(request: FactoryRequest) {
    this.db
      .prepare(
        "INSERT INTO requests(id,conversation_id,data) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data"
      )
      .run(request.id, request.conversationId, JSON.stringify(request))
  }
  snapshot(conversationId?: string): Snapshot {
    const conversations = this.db
      .prepare("SELECT data FROM conversations ORDER BY rowid DESC")
      .all()
      .map((row) =>
        conversationSchema.parse(JSON.parse(rowSchema.parse(row).data))
      )
    const conversation =
      (conversationId
        ? conversations.find((value) => value.id === conversationId)
        : conversations[0]) ?? null
    const segments = conversation
      ? this.db
          .prepare(
            "SELECT data FROM segments WHERE conversation_id=? ORDER BY rowid"
          )
          .all(conversation.id)
          .map((row) =>
            segmentSchema.parse(JSON.parse(rowSchema.parse(row).data))
          )
      : []
    const rawWorker = this.db
      .prepare("SELECT pid,heartbeat,reason FROM worker WHERE id=1")
      .get()
    const worker = rawWorker ? workerSchema.parse(rawWorker) : null
    const live =
      worker && alive(worker.pid) && Date.now() - worker.heartbeat < 15000
    return {
      conversations,
      conversation,
      segments,
      requests: conversation
        ? this.db
            .prepare(
              "SELECT data FROM requests WHERE conversation_id=? ORDER BY rowid"
            )
            .all(conversation.id)
            .map((row) =>
              requestSchema.parse(JSON.parse(rowSchema.parse(row).data))
            )
        : [],
      configuration: live
        ? { worker: worker.reason ? "blocked" : "ready", reason: worker.reason }
        : {
            worker: "offline",
            reason: "Start the factory worker to implement queued requests.",
          },
    }
  }
  apply(command: Command): Snapshot {
    const conversationId = this.transaction(() => {
      const now = new Date().toISOString()
      if (command.kind === "create") {
        const existing = this.db
          .prepare("SELECT data FROM conversations WHERE id=?")
          .get(command.id)
        if (
          existing &&
          conversationSchema.parse(JSON.parse(rowSchema.parse(existing).data))
            .title !== command.title
        )
          throw new Conflict("Conversation ID already has different content")
        this.db
          .prepare("INSERT OR IGNORE INTO conversations(id,data) VALUES(?,?)")
          .run(
            command.id,
            JSON.stringify({
              id: command.id,
              title: command.title,
              createdAt: now,
            })
          )
        return command.id
      }
      if (command.kind === "segment") {
        if (
          !this.db
            .prepare("SELECT id FROM conversations WHERE id=?")
            .get(command.conversationId)
        )
          throw new Conflict("Conversation not found")
        const existing = this.db
          .prepare("SELECT data FROM segments WHERE id=?")
          .get(command.id)
        if (existing) {
          const value = segmentSchema.parse(
            JSON.parse(rowSchema.parse(existing).data)
          )
          if (
            value.text !== command.text ||
            value.speaker !== command.speaker ||
            value.conversationId !== command.conversationId
          )
            throw new Conflict("Segment ID already has different content")
          return command.conversationId
        }
        const previous = this.snapshot(command.conversationId).segments
        const segment = {
          id: command.id,
          conversationId: command.conversationId,
          text: command.text,
          speaker: command.speaker,
          createdAt: now,
        }
        this.db
          .prepare(
            "INSERT INTO segments(id,conversation_id,data) VALUES(?,?,?)"
          )
          .run(segment.id, segment.conversationId, JSON.stringify(segment))
        if (
          completesTrigger(
            previous.slice(-20).map((value) => value.text),
            segment.text
          )
        ) {
          this.save({
            id: randomUUID(),
            conversationId: segment.conversationId,
            triggerSegmentId: segment.id,
            context: [...previous.slice(-20), segment],
            createdAt: now,
            updatedAt: now,
            attempt: 0,
            answers: [],
            state: { kind: "queued" },
          })
        }
        return segment.conversationId
      }
      const request = this.getRequest(command.requestId)
      if (command.kind === "cancel") {
        if (request.state.kind !== "ready")
          this.save({
            ...request,
            updatedAt: now,
            state: { kind: "cancelled" },
          })
      } else if (command.kind === "retry") {
        if (request.state.kind !== "failed")
          throw new Conflict("Only failed requests can be retried")
        this.save({ ...request, updatedAt: now, state: { kind: "queued" } })
      } else {
        if (request.state.kind !== "clarification")
          throw new Conflict("This request is not waiting for clarification")
        this.save({
          ...request,
          updatedAt: now,
          answers: [
            ...request.answers,
            { question: request.state.question, answer: command.answer },
          ],
          state: { kind: "queued" },
        })
      }
      return request.conversationId
    })
    return this.snapshot(conversationId)
  }
  ownWorker() {
    this.transaction(() => {
      const row = this.db
        .prepare("SELECT pid,heartbeat,reason FROM worker WHERE id=1")
        .get()
      if (row && alive(workerSchema.parse(row).pid))
        throw new Conflict("A factory worker already owns this database")
      const orphan = this.db
        .prepare("SELECT child_pid FROM worker WHERE id=1")
        .get()
      if (orphan && typeof orphan.child_pid === "number") {
        try {
          process.kill(-orphan.child_pid, "SIGKILL")
        } catch {
          /* A completed child needs no cleanup. */
        }
      }
      for (const request of this.allRequests())
        if (request.state.kind === "running")
          this.save({
            ...request,
            updatedAt: new Date().toISOString(),
            state: {
              kind: "failed",
              reason:
                "Worker interrupted. Inspect its preserved worktree, then retry.",
            },
          })
      this.db
        .prepare(
          "INSERT OR REPLACE INTO worker(id,pid,heartbeat,reason) VALUES(1,?,?,NULL)"
        )
        .run(process.pid, Date.now())
    })
  }
  childChanged(pid: number | null) {
    this.db
      .prepare("UPDATE worker SET child_pid=? WHERE id=1 AND pid=?")
      .run(pid, process.pid)
  }
  heartbeat(reason: string | null) {
    this.db
      .prepare("UPDATE worker SET heartbeat=?,reason=? WHERE id=1 AND pid=?")
      .run(Date.now(), reason, process.pid)
  }
  releaseWorker() {
    this.db.prepare("DELETE FROM worker WHERE id=1 AND pid=?").run(process.pid)
  }
  claim(): FactoryRequest | null {
    return this.transaction(() => {
      const row = this.db
        .prepare(
          "SELECT data FROM requests WHERE json_extract(data, '$.state.kind')='queued' ORDER BY rowid LIMIT 1"
        )
        .get()
      if (!row) return null
      const request = requestSchema.parse(JSON.parse(rowSchema.parse(row).data))
      const now = new Date().toISOString()
      const claimed: FactoryRequest = {
        ...request,
        attempt: request.attempt + 1,
        updatedAt: now,
        state: { kind: "running", startedAt: now },
      }
      this.save(claimed)
      return claimed
    })
  }
  finish(id: string, attempt: number, state: RequestState) {
    this.transaction(() => {
      const request = this.getRequest(id)
      if (request.state.kind === "running" && request.attempt === attempt)
        this.save({ ...request, updatedAt: new Date().toISOString(), state })
    })
  }
}
