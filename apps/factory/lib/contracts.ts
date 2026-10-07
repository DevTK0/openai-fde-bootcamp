import { z } from "zod"

export const MAGIC_PHRASE = "I think we can get the software factory to do this"
const id = z.string().uuid()
export const segmentSchema = z.object({
  id,
  conversationId: id,
  speaker: z.string().trim().min(1).max(100),
  text: z.string().trim().min(1).max(12000),
  createdAt: z.string(),
})
export type Segment = z.infer<typeof segmentSchema>
export const conversationSchema = z.object({
  id,
  title: z.string().trim().min(1).max(160),
  createdAt: z.string(),
})
export const stateSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("queued") }),
  z.object({ kind: z.literal("running"), startedAt: z.string() }),
  z.object({ kind: z.literal("clarification"), question: z.string() }),
  z.object({
    kind: z.literal("ready"),
    summary: z.string(),
    diff: z.string(),
    checks: z.object({ exitCode: z.number(), output: z.string() }),
    branch: z.string(),
    worktree: z.string(),
  }),
  z.object({ kind: z.literal("failed"), reason: z.string() }),
  z.object({ kind: z.literal("cancelled") }),
])
export const requestSchema = z.object({
  id,
  conversationId: id,
  triggerSegmentId: id,
  context: z.array(segmentSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  attempt: z.number().int(),
  answers: z.array(z.object({ question: z.string(), answer: z.string() })),
  state: stateSchema,
})
export type FactoryRequest = z.infer<typeof requestSchema>
export type RequestState = z.infer<typeof stateSchema>
export const commandSchema = z.discriminatedUnion("kind", [
  conversationSchema
    .omit({ createdAt: true })
    .extend({ kind: z.literal("create") }),
  segmentSchema
    .omit({ createdAt: true })
    .extend({ kind: z.literal("segment") }),
  z.object({
    kind: z.literal("answer"),
    requestId: id,
    answer: z.string().trim().min(1).max(12000),
  }),
  z.object({ kind: z.literal("retry"), requestId: id }),
  z.object({ kind: z.literal("cancel"), requestId: id }),
])
export type Command = z.infer<typeof commandSchema>
export const snapshotSchema = z.object({
  conversations: z.array(conversationSchema),
  conversation: conversationSchema.nullable(),
  segments: z.array(segmentSchema),
  requests: z.array(requestSchema),
  configuration: z.object({
    worker: z.enum(["ready", "offline", "blocked"]),
    reason: z.string().nullable(),
  }),
})
export type Snapshot = z.infer<typeof snapshotSchema>
export function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}
export function completesTrigger(previous: string[], current: string) {
  const before = normalize(previous.join(" "))
  const combined = normalize([...previous, current].join(" "))
  const phrase = normalize(MAGIC_PHRASE)
  const offset = ` ${combined} `.lastIndexOf(` ${phrase} `)
  return offset >= 0 && offset + phrase.length > before.length
}
