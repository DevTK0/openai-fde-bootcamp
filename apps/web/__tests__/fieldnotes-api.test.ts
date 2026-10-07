// @vitest-environment node
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { randomUUID } from "node:crypto"
import { GET, POST } from "@/app/api/fieldnotes/route"
import { POST as LIVE } from "@/app/api/fieldnotes/live/route"
import { chatSchema } from "@/lib/fieldnotes/schema"

const identity = vi.hoisted(() => ({ value: "" }))
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => ({ value: identity.value }),
    set: () => undefined,
  }),
}))
let directory: string
beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), "fieldnotes-api-"))
  vi.stubEnv("FIELDNOTES_DATABASE_PATH", join(directory, "notes.sqlite"))
  vi.stubEnv("OPENAI_API_KEY", "test-only-key")
  identity.value = randomUUID()
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  rmSync(directory, { recursive: true, force: true })
})
function command(body: unknown, origin = "https://fieldnotes.test") {
  return new Request("https://fieldnotes.test/api/fieldnotes", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin,
      host: "fieldnotes.test",
    },
    body: JSON.stringify(body),
  })
}
async function create() {
  return chatSchema.parse(
    await (await POST(command({ kind: "create" }))).json()
  )
}

it("saves a clarification, generates a grounded draft, and serves it after the conversation ends", async () => {
  const chat = await create()
  await POST(
    command({
      kind: "append",
      id: chat.id,
      events: [
        { id: "one", kind: "clarification", text: "CSV export is deferred." },
      ],
    })
  )
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url: string, init: RequestInit) => {
      const payload = JSON.parse(String(init.body))
      expect(payload.input).toContain("CSV export is deferred.")
      return Response.json({
        status: "completed",
        output: [
          {
            type: "message",
            content: [
              {
                type: "output_text",
                text: "# Feature specification\n\nCSV export is deferred.",
              },
            ],
          },
        ],
      })
    })
  )
  const generated = chatSchema.parse(
    await (await POST(command({ kind: "generate", id: chat.id }))).json()
  )
  expect(generated.specification).toBe(
    "# Feature specification\n\nCSV export is deferred."
  )
  expect(generated.specRevision).toBe(1)
  expect((await POST(command({ kind: "end", id: chat.id }))).status).toBe(200)
  expect(
    (
      await POST(
        command({
          kind: "append",
          id: chat.id,
          events: [
            { id: "two", kind: "clarification", text: "Another detail" },
          ],
        })
      )
    ).status
  ).toBe(409)
  const saved = chatSchema.parse(
    await (
      await GET(
        new Request(`https://fieldnotes.test/api/fieldnotes?id=${chat.id}`)
      )
    ).json()
  )
  expect(saved.specification).toBe(generated.specification)
})

it("preserves saved inputs when OpenAI fails, then supports retry", async () => {
  const chat = await create()
  await POST(
    command({
      kind: "append",
      id: chat.id,
      events: [
        { id: "one", kind: "clarification", text: "An uncertain detail" },
      ],
    })
  )
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("rate limit", { status: 429 }))
  )
  const failed = await POST(command({ kind: "generate", id: chat.id }))
  expect(failed.status).toBe(502)
  expect(await failed.json()).toEqual({
    error:
      "OpenAI is rate limited or out of quota. Your notes are saved. Try again shortly.",
  })
  const saved = chatSchema.parse(
    await (
      await GET(
        new Request(`https://fieldnotes.test/api/fieldnotes?id=${chat.id}`)
      )
    ).json()
  )
  expect(saved.events).toEqual([
    { id: "one", kind: "clarification", text: "An uncertain detail" },
  ])
  expect(saved.specRevision).toBe(0)
})

it("rejects foreign origins, malformed commands, and another browser's presentation", async () => {
  expect(
    (await POST(command({ kind: "create" }, "https://attacker.test"))).status
  ).toBe(403)
  expect(
    (await POST(command({ kind: "rename", id: "bad", name: "" }))).status
  ).toBe(400)
  const chat = await create()
  identity.value = randomUUID()
  expect(
    (
      await GET(
        new Request(`https://fieldnotes.test/api/fieldnotes?id=${chat.id}`)
      )
    ).status
  ).toBe(404)
})

it("creates GPT-Live WebRTC sessions with a server-owned configuration and never returns the key", async () => {
  const chat = await create()
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: RequestInit) => {
      expect(url).toBe("https://api.openai.com/v1/live/sessions")
      const payload = JSON.parse(String(init.body))
      expect(payload.session.model).toBe("gpt-live-1")
      expect(payload.transport).toEqual({ type: "webrtc", sdp: "test-offer" })
      return Response.json({
        session: { id: "live_test" },
        transport: { type: "webrtc", sdp: "test-answer" },
      })
    })
  )
  const response = await LIVE(command({ id: chat.id, sdp: "test-offer" }))
  expect(response.status).toBe(201)
  expect(await response.json()).toEqual({
    session: { id: "live_test" },
    transport: { type: "webrtc", sdp: "test-answer" },
  })
  await POST(command({ kind: "end", id: chat.id }))
  expect((await LIVE(command({ id: chat.id, sdp: "test-offer" }))).status).toBe(
    409
  )
})

it("stores bounded capture diagnostics with the session and deletes them only for the owner", async () => {
  const chat = await create()
  const diagnostics = {
    sessionId: "live_test",
    capturedAt: new Date().toISOString(),
    connection: "connected",
    channel: "open",
    level: 0.2,
    peak: 0.3,
    device: "Test microphone",
    bytesSent: 1024,
    packetsSent: 40,
    packetsLost: 0,
    codec: "audio/opus",
    sampleRate: 48000,
    channelCount: 1,
    events: [{ type: "session.started", count: 1 }],
    parseErrors: 0,
    lastError: null,
  }
  expect(
    (await POST(command({ kind: "diagnostics", id: chat.id, diagnostics })))
      .status
  ).toBe(200)
  const saved = chatSchema.parse(
    await (
      await GET(
        new Request(`https://fieldnotes.test/api/fieldnotes?id=${chat.id}`)
      )
    ).json()
  )
  expect(saved.captureDiagnostics).toEqual(diagnostics)
  expect(saved.revision).toBe(0)
  const original = identity.value
  identity.value = randomUUID()
  expect((await POST(command({ kind: "delete", id: chat.id }))).status).toBe(
    404
  )
  identity.value = original
  expect((await POST(command({ kind: "delete", id: chat.id }))).status).toBe(
    200
  )
  expect(
    (
      await GET(
        new Request(`https://fieldnotes.test/api/fieldnotes?id=${chat.id}`)
      )
    ).status
  ).toBe(404)
})
