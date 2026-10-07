import { z } from "zod"

export const eventSchema = z.discriminatedUnion("kind", [
  z.object({
    id: z.string().min(1).max(200),
    kind: z.literal("clarification"),
    text: z.string().trim().min(1).max(8000),
  }),
  z.object({
    id: z.string().min(1).max(200),
    kind: z.literal("transcript"),
    speaker: z.enum(["user", "assistant"]),
    text: z.string().min(1).max(16000),
    startMs: z.number().nonnegative(),
    endMs: z.number().nonnegative(),
    sessionId: z.string().min(1).max(200),
  }),
])
export type NoteEvent = z.infer<typeof eventSchema>
export const captureDiagnosticsSchema = z.object({
  sessionId: z.string().max(200),
  capturedAt: z.string().max(100),
  connection: z.string().max(40),
  channel: z.string().max(40),
  level: z.number().nullable(),
  peak: z.number(),
  device: z.string().max(300),
  bytesSent: z.number().nullable(),
  packetsSent: z.number().nullable(),
  packetsLost: z.number().nullable(),
  codec: z.string().max(200).nullable(),
  sampleRate: z.number().nullable(),
  channelCount: z.number().nullable(),
  events: z
    .array(z.object({ type: z.string().max(100), count: z.number() }))
    .max(30),
  parseErrors: z.number(),
  lastError: z.string().max(2000).nullable(),
})
export type CaptureDiagnostics = z.infer<typeof captureDiagnosticsSchema>
export const chatSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  endedAt: z.string().nullable(),
  createdAt: z.string(),
  revision: z.number().int(),
  specRevision: z.number().int(),
  specification: z.string(),
  events: z.array(eventSchema),
  captureDiagnostics: captureDiagnosticsSchema.optional(),
})
export type Chat = z.infer<typeof chatSchema>
export const commandSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("create") }),
  z.object({
    kind: z.literal("diagnostics"),
    id: z.string().uuid(),
    diagnostics: captureDiagnosticsSchema,
  }),
  z.object({
    kind: z.literal("rename"),
    id: z.string().uuid(),
    name: z.string().trim().min(1).max(100),
  }),
  z.object({
    kind: z.literal("append"),
    id: z.string().uuid(),
    events: z.array(eventSchema).min(1).max(500),
  }),
  z.object({ kind: z.literal("generate"), id: z.string().uuid() }),
  z.object({ kind: z.literal("delete"), id: z.string().uuid() }),
  z.object({ kind: z.literal("end"), id: z.string().uuid() }),
])
export type Command = z.infer<typeof commandSchema>
export const initialSpecification =
  "# Feature specification\n\nWaiting for the presentation.\n\n## Features\n\nNo features captured yet.\n\n## Clarifications\n\nNo clarifications yet.\n\n## Open questions\n\nNo questions captured yet.\n"

export function mergeChat(previous: Chat | null, incoming: Chat): Chat {
  if (!previous || previous.id !== incoming.id) return incoming
  const content = previous.revision > incoming.revision ? previous : incoming
  const draft =
    previous.specRevision > incoming.specRevision ? previous : incoming
  return {
    ...content,
    specification: draft.specification,
    specRevision: draft.specRevision,
    endedAt: previous.endedAt ?? incoming.endedAt,
  }
}
