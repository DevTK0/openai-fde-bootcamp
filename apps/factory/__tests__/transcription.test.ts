import { describe, expect, it, vi } from "vitest"
import { orderedTranscripts } from "../lib/transcription-events"
import { transcriptOutbox } from "../lib/transcription-outbox"

describe("final transcript ordering", () => {
  it("delivers preceding context before an early trigger completion and ignores duplicate events", () => {
    const final = vi.fn()
    const partial = vi.fn()
    const buffer = orderedTranscripts({ final, partial, error: vi.fn() })
    buffer.receive({
      type: "input_audio_buffer.committed",
      item_id: "context",
      previous_item_id: null,
    })
    buffer.receive({
      type: "input_audio_buffer.committed",
      item_id: "trigger",
      previous_item_id: "context",
    })
    buffer.receive({
      type: "conversation.item.input_audio_transcription.completed",
      item_id: "trigger",
      transcript: "I think we can get the software factory to do this",
    })
    expect(final.mock.calls).toEqual([])
    buffer.receive({
      type: "conversation.item.input_audio_transcription.delta",
      item_id: "context",
      delta: "Please add",
    })
    expect(partial).toHaveBeenLastCalledWith("Please add")
    buffer.receive({
      type: "conversation.item.input_audio_transcription.completed",
      item_id: "context",
      transcript: "Please add a download button.",
    })
    buffer.receive({
      type: "conversation.item.input_audio_transcription.completed",
      item_id: "trigger",
      transcript: "duplicate",
    })
    expect(final.mock.calls).toEqual([
      [{ id: "context", text: "Please add a download button." }],
      [
        {
          id: "trigger",
          text: "I think we can get the software factory to do this",
        },
      ],
    ])
    expect(partial).toHaveBeenLastCalledWith("")
    expect(buffer.pending).toBe(0)
  })
  it("handles a final arriving before its committed event", () => {
    const final = vi.fn()
    const buffer = orderedTranscripts({
      final,
      partial: vi.fn(),
      error: vi.fn(),
    })
    buffer.receive({
      type: "conversation.item.input_audio_transcription.completed",
      item_id: "first",
      transcript: "A complete turn",
    })
    buffer.receive({
      type: "input_audio_buffer.committed",
      item_id: "first",
      previous_item_id: null,
    })
    expect(final.mock.calls).toEqual([
      [{ id: "first", text: "A complete turn" }],
    ])
  })
})

it("retains failed speech and retries the same IDs before sending later trigger text", async () => {
  let fail = true
  const saved: string[] = []
  const changed = vi.fn()
  const outbox = transcriptOutbox({
    changed,
    failed: vi.fn(),
    save: async (item) => {
      saved.push(item.id)
      if (fail) throw new Error("offline")
    },
  })
  const context = {
    kind: "segment",
    id: "context",
    conversationId: "room",
    speaker: "Employee",
    text: "Add a download button",
  } satisfies Parameters<typeof outbox.add>[0]
  const trigger = {
    ...context,
    id: "trigger",
    text: "I think we can get the software factory to do this",
  }
  outbox.add(context)
  outbox.add(trigger)
  await vi.waitFor(() => expect(saved).toEqual(["context"]))
  expect(changed).toHaveBeenLastCalledWith([context, trigger])
  fail = false
  outbox.retry()
  await vi.waitFor(() => expect(changed).toHaveBeenLastCalledWith([]))
  expect(saved).toEqual(["context", "context", "trigger"])
})
