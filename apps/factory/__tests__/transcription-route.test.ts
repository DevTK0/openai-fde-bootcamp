import { afterEach, expect, it, vi } from "vitest"
import { POST } from "../app/api/transcription/route"

const token = "factory-route-test-token-at-least-24"
afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})
it("stops reading an oversized SDP stream without a content length", async () => {
  vi.stubEnv("FACTORY_ACCESS_TOKEN", token)
  vi.stubEnv("OPENAI_API_KEY", "test-provider-key")
  const provider = vi.fn<typeof fetch>()
  vi.stubGlobal("fetch", provider)
  let produced = 0
  let cancelled = false
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      produced += 1
      controller.enqueue(new Uint8Array(16000))
      if (produced === 10) controller.close()
    },
    cancel() {
      cancelled = true
    },
  })
  const init = {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
    duplex: "half",
  }
  const response = await POST(
    new Request("http://localhost/api/transcription", init)
  )
  expect(response.status).toBe(413)
  expect(cancelled).toBe(true)
  expect(produced).toBeLessThan(10)
  expect(provider).not.toHaveBeenCalled()
})
it("forwards a bounded SDP offer and returns the provider answer", async () => {
  vi.stubEnv("FACTORY_ACCESS_TOKEN", token)
  vi.stubEnv("OPENAI_API_KEY", "test-provider-key")
  const provider = vi.fn<typeof fetch>(
    async () => new Response("v=0\r\nanswer")
  )
  vi.stubGlobal("fetch", provider)
  const response = await POST(
    new Request("http://localhost/api/transcription", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: "v=0\r\noffer",
    })
  )
  expect(await response.text()).toBe("v=0\r\nanswer")
  const sent = provider.mock.calls[0]?.[1]?.body
  expect(sent).toBeInstanceOf(FormData)
  if (!(sent instanceof FormData)) throw new Error("Missing provider form")
  expect(sent.get("sdp")).toBe("v=0\r\noffer")
  expect(JSON.parse(String(sent.get("session")))).toEqual({
    type: "transcription",
    audio: {
      input: {
        transcription: { model: "gpt-live-transcribe" },
        turn_detection: null,
      },
    },
  })
})
