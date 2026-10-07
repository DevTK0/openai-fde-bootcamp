// @vitest-environment node
import { afterEach, describe, expect, it } from "vitest"
import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { FieldnotesStore } from "@/lib/fieldnotes/store"
import { mergeChat } from "@/lib/fieldnotes/schema"
import { transcriptEvent } from "@/components/fieldnotes/live"

const paths: string[] = []
afterEach(() => {
  paths
    .splice(0)
    .forEach((path) => rmSync(path, { recursive: true, force: true }))
})
function database() {
  const path = mkdtempSync(join(tmpdir(), "fieldnotes-"))
  paths.push(path)
  return join(path, "notes.sqlite")
}
const correction = {
  kind: "clarification",
  id: "correction-1",
  text: "Export is for a later release.",
} as const

describe("saved presentation workflow", () => {
  it("keeps renamed chats, exact transcripts, and specifications across reopen, isolated by owner", () => {
    const path = database()
    let store = new FieldnotesStore(path)
    const chat = store.create("alice")
    expect(chat.name).toBe("Presentation 1")
    expect(store.create("alice").name).toBe("Presentation 2")
    store.rename("alice", chat.id, "Planning demo")
    store.append("alice", chat.id, [correction])
    store.saveSpecification(
      "alice",
      chat.id,
      1,
      "# Feature specification\n\nExport is out of scope."
    )
    store.close()
    store = new FieldnotesStore(path)
    expect(store.get("alice", chat.id)).toMatchObject({
      name: "Planning demo",
      revision: 1,
      specRevision: 1,
      events: [correction],
      specification: "# Feature specification\n\nExport is out of scope.",
    })
    expect(store.list("bob")).toEqual([])
    expect(() => store.get("bob", chat.id)).toThrow("Presentation not found")
    store.close()
  })
  it("deduplicates retried input and cannot reopen an ended conversation", () => {
    const store = new FieldnotesStore(database())
    const chat = store.create("alice")
    store.append("alice", chat.id, [correction, correction])
    expect(store.append("alice", chat.id, [correction]).revision).toBe(1)
    const ended = store.end("alice", chat.id)
    expect(store.end("alice", chat.id).endedAt).toBe(ended.endedAt)
    expect(() =>
      store.append("alice", chat.id, [{ ...correction, id: "new" }])
    ).toThrow("has ended")
    expect(store.get("alice", chat.id).events).toEqual([correction])
    store.close()
  })
  it("does not let slow generation overwrite a newer draft and retains unsummarized input", () => {
    const store = new FieldnotesStore(database())
    const chat = store.create("alice")
    store.append("alice", chat.id, [correction])
    store.append("alice", chat.id, [
      { ...correction, id: "second", text: "Include CSV import." },
    ])
    store.saveSpecification("alice", chat.id, 2, "Newer specification")
    expect(
      store.saveSpecification("alice", chat.id, 1, "Stale specification")
        .specification
    ).toBe("Newer specification")
    store.append("alice", chat.id, [
      { ...correction, id: "third", text: "Import accepts UTF-8." },
    ])
    expect(store.get("alice", chat.id)).toMatchObject({
      revision: 3,
      specRevision: 2,
    })
    store.close()
  })
  it("preserves GPT-Live transcript spacing, speakers, and timing without treating other events as text", () => {
    expect(
      transcriptEvent(
        {
          type: "session.input_transcript.delta",
          event_id: "e1",
          delta: " to import",
          start_ms: 100,
          end_ms: 300,
        },
        "live_1"
      )
    ).toEqual({
      kind: "transcript",
      id: "live_1:e1",
      sessionId: "live_1",
      speaker: "user",
      text: " to import",
      startMs: 100,
      endMs: 300,
    })
    expect(transcriptEvent({ type: "session.started" }, "live_1")).toBeNull()
  })
})

it("retains a newer draft when a concurrent save response arrives late", () => {
  const store = new FieldnotesStore(database())
  const chat = store.create("alice")
  const saving = store.append("alice", chat.id, [correction])
  const generated = store.saveSpecification(
    "alice",
    chat.id,
    1,
    "# Confirmed draft"
  )
  const ended = store.end("alice", chat.id)
  expect(mergeChat(generated, saving)).toMatchObject({
    specification: "# Confirmed draft",
    specRevision: 1,
    events: [correction],
  })
  expect(mergeChat(ended, generated).endedAt).toBe(ended.endedAt)
  store.close()
})
