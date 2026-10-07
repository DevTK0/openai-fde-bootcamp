import { z } from "zod"
import { eventSchema, type NoteEvent } from "@/lib/fieldnotes/schema"

const entrySchema = z.object({
  event: eventSchema,
  queuedAt: z.number(),
  status: z.enum(["pending", "rejected"]),
})
const prefix = (id: string) => `fieldnotes:outbox:${id}:`

export function saveLocalNote(
  id: string,
  event: NoteEvent,
  status: "pending" | "rejected" = "pending"
) {
  const key = `${prefix(id)}${event.id}`
  const previous = localStorage.getItem(key)
  const queuedAt = previous
    ? entrySchema.parse(JSON.parse(previous)).queuedAt
    : performance.timeOrigin + performance.now()
  localStorage.setItem(key, JSON.stringify({ event, status, queuedAt }))
}
export function localNotes(id: string) {
  const notes: { pending: NoteEvent[]; rejected: NoteEvent[] } = {
    pending: [],
    rejected: [],
  }
  const entries: z.infer<typeof entrySchema>[] = []
  for (const key of Object.keys(localStorage)) {
    if (!key.startsWith(prefix(id))) continue
    const value = localStorage.getItem(key)
    if (!value) continue
    const entry = entrySchema.parse(JSON.parse(value))
    entries.push(entry)
  }
  for (const entry of entries.sort((a, b) => a.queuedAt - b.queuedAt))
    notes[entry.status].push(entry.event)
  return notes
}
export function removeLocalNotes(id: string, events: NoteEvent[]) {
  for (const event of events)
    localStorage.removeItem(`${prefix(id)}${event.id}`)
}
export function appendBatch(events: NoteEvent[]) {
  const batch: NoteEvent[] = []
  for (const event of events.slice(0, 100)) {
    if (JSON.stringify([...batch, event]).length > 200_000) break
    batch.push(event)
  }
  return batch
}
