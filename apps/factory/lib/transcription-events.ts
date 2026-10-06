import { z } from "zod"

const eventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("input_audio_buffer.committed"), item_id: z.string(), previous_item_id: z.string().nullable().optional() }),
  z.object({ type: z.literal("conversation.item.input_audio_transcription.completed"), item_id: z.string(), transcript: z.string() }),
  z.object({ type: z.literal("conversation.item.input_audio_transcription.delta"), item_id: z.string(), delta: z.string() }),
  z.object({ type: z.literal("conversation.item.input_audio_transcription.failed"), error: z.object({ message: z.string() }) }),
  z.object({ type: z.literal("error"), error: z.object({ message: z.string() }) }),
])

export type FinalTranscript = { id: string; text: string }

export function orderedTranscripts(callbacks: {
  final: (turn: FinalTranscript) => void
  partial: (text: string) => void
  error: (message: string) => void
}) {
  const committed = new Map<string, string | null>()
  const finals = new Map<string, string>()
  const partials = new Map<string, string>()
  const delivered = new Set<string>()
  let previous: string | null = null
  return {
    get pending() { return committed.size },
    receive(value: unknown) {
      const parsed = eventSchema.safeParse(value)
      if (!parsed.success) return
      const event = parsed.data
      if (event.type === "error" || event.type === "conversation.item.input_audio_transcription.failed") {
        callbacks.error(event.error.message)
        return
      }
      if (delivered.has(event.item_id)) return
      if (event.type === "input_audio_buffer.committed") committed.set(event.item_id, event.previous_item_id ?? null)
      if (event.type === "conversation.item.input_audio_transcription.delta") {
        partials.set(event.item_id, (partials.get(event.item_id) ?? "") + event.delta)
        callbacks.partial([...partials.values()].join(" "))
      }
      if (event.type === "conversation.item.input_audio_transcription.completed") finals.set(event.item_id, event.transcript)
      for (;;) {
        const next = [...committed].find(([, predecessor]) => predecessor === previous)
        if (!next) break
        const [id] = next
        const text = finals.get(id)
        if (text === undefined) break
        previous = id
        delivered.add(id)
        committed.delete(id)
        finals.delete(id)
        partials.delete(id)
        callbacks.partial([...partials.values()].join(" "))
        callbacks.final({ id, text })
      }
    },
  }
}
