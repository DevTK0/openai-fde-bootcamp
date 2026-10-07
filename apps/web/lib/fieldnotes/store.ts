import { DatabaseSync } from "node:sqlite"
import { mkdirSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { randomUUID } from "node:crypto"
import { z } from "zod"
import {
  chatSchema,
  initialSpecification,
  type Chat,
  type CaptureDiagnostics,
  type NoteEvent,
} from "./schema"

export class FieldnotesError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message)
  }
}

export function withStore<T>(run: (store: FieldnotesStore) => T): T {
  const path =
    process.env.FIELDNOTES_DATABASE_PATH ??
    resolve(process.cwd(), ".fieldnotes/notes.sqlite")
  mkdirSync(dirname(path), { recursive: true })
  const store = new FieldnotesStore(path)
  try {
    return run(store)
  } finally {
    store.close()
  }
}

export class FieldnotesStore {
  private db: DatabaseSync
  constructor(path: string) {
    this.db = new DatabaseSync(path)
    this.db.exec(`PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS chats (id TEXT PRIMARY KEY, owner TEXT NOT NULL, data TEXT NOT NULL);
      CREATE INDEX IF NOT EXISTS chats_owner ON chats(owner);
      CREATE TABLE IF NOT EXISTS counters (owner TEXT PRIMARY KEY, n INTEGER NOT NULL);
      INSERT OR IGNORE INTO counters SELECT owner, count(*) FROM chats GROUP BY owner;`)
  }
  close() {
    this.db.close()
  }
  list(owner: string): Chat[] {
    return this.db
      .prepare("SELECT data FROM chats WHERE owner = ? ORDER BY rowid DESC")
      .all(owner)
      .map((row) => chatSchema.parse(JSON.parse(z.string().parse(row.data))))
      .map((chat) => ({ ...chat, events: [] }))
  }
  get(owner: string, id: string): Chat {
    const row = this.db
      .prepare("SELECT data FROM chats WHERE owner = ? AND id = ?")
      .get(owner, id)
    if (!row) throw new FieldnotesError("Presentation not found.", 404)
    return chatSchema.parse(JSON.parse(z.string().parse(row.data)))
  }
  create(owner: string): Chat {
    this.db.exec("BEGIN IMMEDIATE")
    try {
      const count = this.db
        .prepare(
          "INSERT INTO counters VALUES (?, 1) ON CONFLICT(owner) DO UPDATE SET n = n + 1 RETURNING n"
        )
        .get(owner)
      const chat: Chat = {
        id: randomUUID(),
        name: `Presentation ${z.number().parse(count?.n)}`,
        createdAt: new Date().toISOString(),
        endedAt: null,
        revision: 0,
        specRevision: 0,
        specification: initialSpecification,
        events: [],
      }
      this.db
        .prepare("INSERT INTO chats VALUES (?, ?, ?)")
        .run(chat.id, owner, JSON.stringify(chat))
      this.db.exec("COMMIT")
      return chat
    } catch (error) {
      this.db.exec("ROLLBACK")
      throw error
    }
  }
  private change(
    owner: string,
    id: string,
    mutate: (chat: Chat) => void
  ): Chat {
    this.db.exec("BEGIN IMMEDIATE")
    try {
      const chat = this.get(owner, id)
      mutate(chat)
      this.db
        .prepare("UPDATE chats SET data = ? WHERE id = ? AND owner = ?")
        .run(JSON.stringify(chat), id, owner)
      this.db.exec("COMMIT")
      return chat
    } catch (error) {
      this.db.exec("ROLLBACK")
      throw error
    }
  }
  diagnostics(owner: string, id: string, diagnostics: CaptureDiagnostics) {
    this.change(owner, id, (chat) => {
      chat.captureDiagnostics = diagnostics
    })
    return { id }
  }
  delete(owner: string, id: string) {
    const result = this.db
      .prepare("DELETE FROM chats WHERE owner = ? AND id = ?")
      .run(owner, id)
    if (!result.changes)
      throw new FieldnotesError("Presentation not found.", 404)
    return { id }
  }
  rename(owner: string, id: string, name: string) {
    return this.change(owner, id, (chat) => {
      chat.name = name
    })
  }
  append(owner: string, id: string, events: NoteEvent[]) {
    return this.change(owner, id, (chat) => {
      if (chat.endedAt)
        throw new FieldnotesError(
          "This conversation has ended. Start a new chat.",
          409
        )
      const ids = new Set(chat.events.map((event) => event.id))
      const incoming = events.filter((event) => {
        if (ids.has(event.id)) return false
        ids.add(event.id)
        return true
      })
      if (
        JSON.stringify(chat.events).length + JSON.stringify(incoming).length >
        1_000_000
      )
        throw new FieldnotesError(
          "This presentation is full. End it and start a new chat.",
          413
        )
      chat.events.push(...incoming)
      if (incoming.length) chat.revision++
    })
  }
  saveSpecification(
    owner: string,
    id: string,
    revision: number,
    specification: string
  ) {
    return this.change(owner, id, (chat) => {
      if (revision > chat.specRevision && revision <= chat.revision) {
        chat.specification = specification
        chat.specRevision = revision
      }
    })
  }
  end(owner: string, id: string) {
    return this.change(owner, id, (chat) => {
      chat.endedAt ??= new Date().toISOString()
    })
  }
}
