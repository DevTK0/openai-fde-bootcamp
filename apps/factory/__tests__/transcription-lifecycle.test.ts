import { afterEach, expect, it, vi } from "vitest"
import { startTranscription } from "../lib/transcription"

class Channel extends EventTarget {
  readyState = "connecting"
  close = vi.fn(() => {
    this.readyState = "closed"
  })
  send = vi.fn()
}
class Peer extends EventTarget {
  static instances: Peer[] = []
  channel = new Channel()
  localDescription = { sdp: "v=0" }
  connectionState = "new"
  close = vi.fn()
  addTrack = vi.fn()
  constructor() {
    super()
    Peer.instances.push(this)
  }
  createDataChannel() {
    return this.channel
  }
  async createOffer() {
    return { type: "offer", sdp: "v=0" }
  }
  async setLocalDescription() {}
  async setRemoteDescription() {
    this.channel.readyState = "open"
    this.channel.dispatchEvent(new Event("open"))
  }
}
function setup() {
  Peer.instances = []
  const stop = vi.fn()
  vi.stubGlobal("RTCPeerConnection", Peer)
  vi.stubGlobal("navigator", {
    mediaDevices: {
      getUserMedia: async () => ({
        getTracks: () => [{ stop, addEventListener: () => undefined }],
      }),
    },
  })
  return stop
}
function options(signal: AbortSignal) {
  return {
    token: "test-token",
    signal,
    onFinal: vi.fn(),
    onPartial: vi.fn(),
    onError: vi.fn(),
  }
}
afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

it("releases the microphone and peer when the server reports missing provider configuration", async () => {
  const stop = setup()
  vi.stubGlobal(
    "fetch",
    async () =>
      new Response("Live transcription is not configured", { status: 503 })
  )
  await expect(
    startTranscription(options(new AbortController().signal))
  ).rejects.toThrow("Live transcription is not configured")
  expect(stop).toHaveBeenCalledOnce()
  expect(Peer.instances[0]?.channel.readyState).toBe("closed")
  expect(Peer.instances[0]?.close).toHaveBeenCalledOnce()
})

it("cancels setup while permission is pending and stops tracks when permission resolves late", async () => {
  setup()
  let release: (() => void) | undefined
  const stop = vi.fn()
  vi.stubGlobal("navigator", {
    mediaDevices: {
      getUserMedia: () =>
        new Promise((resolve) => {
          release = () =>
            resolve({
              getTracks: () => [{ stop, addEventListener: () => undefined }],
            })
        }),
    },
  })
  const abort = new AbortController()
  const started = startTranscription(options(abort.signal))
  abort.abort()
  release?.()
  await expect(started).rejects.toThrow("Microphone setup cancelled")
  expect(stop).toHaveBeenCalledOnce()
  expect(Peer.instances[0]?.channel.readyState).toBe("closed")
})

it("stops every audio resource when a connected session stops", async () => {
  const stop = setup()
  const closeAudio = vi.fn()
  vi.stubGlobal("fetch", async () => new Response("answer"))
  vi.stubGlobal(
    "AudioContext",
    class {
      close = closeAudio
      async resume() {}
      createAnalyser() {
        return { fftSize: 1024, getFloatTimeDomainData: () => undefined }
      }
      createMediaStreamSource() {
        return { connect: () => undefined }
      }
    }
  )
  const session = await startTranscription(
    options(new AbortController().signal)
  )
  await session.stop()
  expect(stop).toHaveBeenCalled()
  expect(closeAudio).toHaveBeenCalledOnce()
  expect(Peer.instances[0]?.channel.readyState).toBe("closed")
})

it("does not resume listening or install an audio analyser after setup is cancelled during audio activation", async () => {
  const stop = setup()
  let resume: (() => void) | undefined
  const analyser = vi.fn()
  vi.stubGlobal("fetch", async () => new Response("answer"))
  vi.stubGlobal(
    "AudioContext",
    class {
      async close() {}
      resume() {
        return new Promise<void>((resolve) => {
          resume = resolve
        })
      }
      createAnalyser = analyser
    }
  )
  const abort = new AbortController()
  const started = startTranscription(options(abort.signal))
  await vi.waitFor(() => expect(resume).toBeTypeOf("function"))
  abort.abort()
  resume?.()
  await expect(started).rejects.toThrow()
  expect(analyser).not.toHaveBeenCalled()
  expect(stop).toHaveBeenCalledOnce()
  expect(Peer.instances[0]?.channel.readyState).toBe("closed")
})
