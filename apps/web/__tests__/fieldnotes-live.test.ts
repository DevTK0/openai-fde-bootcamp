import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { LiveCapture } from "@/components/fieldnotes/live"

class Channel extends EventTarget {
  readyState = "open"
  sent: unknown[] = []
  send(value: string) {
    this.sent.push(JSON.parse(value))
  }
  receive(value: unknown) {
    this.dispatchEvent(
      new MessageEvent("message", { data: JSON.stringify(value) })
    )
  }
  close() {
    this.readyState = "closed"
    this.dispatchEvent(new Event("close"))
  }
}
class Peer extends EventTarget {
  static latest: Peer
  channel = new Channel()
  iceGatheringState = "complete"
  connectionState = "connected"
  localDescription = { sdp: "test-offer" }
  constructor() {
    super()
    Peer.latest = this
  }
  createDataChannel() {
    return this.channel
  }
  level = 0
  replacement = vi.fn(async () => {})
  addTrack() {
    return { replaceTrack: this.replacement }
  }
  async getStats() {
    return new Map([
      [
        "source",
        { type: "media-source", kind: "audio", audioLevel: this.level },
      ],
    ])
  }
  async createOffer() {
    return this.localDescription
  }
  async setLocalDescription() {}
  async setRemoteDescription() {
    this.channel.receive({ type: "session.started" })
  }
  close() {
    this.connectionState = "closed"
  }
}
const track = {
  enabled: true,
  muted: false,
  label: "Test microphone",
  getSettings: () => ({ sampleRate: 48000, channelCount: 1 }),
  addEventListener: vi.fn(),
  stop: vi.fn(),
}
const microphone = { getTracks: () => [track], getAudioTracks: () => [track] }
beforeEach(() => {
  track.enabled = true
  track.stop.mockClear()
  vi.stubGlobal("RTCPeerConnection", Peer)
  vi.stubGlobal("navigator", {
    mediaDevices: { getUserMedia: vi.fn(async () => microphone) },
  })
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({
        session: { id: "live_test" },
        transport: { sdp: "test-answer" },
      })
    )
  )
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})
function capture() {
  return new LiveCapture({
    audio: document.createElement("audio"),
    event: vi.fn(),
    error: vi.fn(),
  })
}

it("mutes the actual track and drains final transcript before releasing audio resources", async () => {
  const received: string[] = []
  const live = new LiveCapture({
    audio: document.createElement("audio"),
    event: (event) => received.push(event.text),
    error: vi.fn(),
  })
  await live.start("chat")
  live.mute(true)
  expect(track.enabled).toBe(false)
  live.mute(false)
  expect(track.enabled).toBe(true)
  const closing = live.close()
  expect(Peer.latest.channel.sent).toEqual([{ type: "session.close" }])
  expect(track.stop).not.toHaveBeenCalled()
  Peer.latest.channel.receive({
    type: "session.input_transcript.delta",
    event_id: "final",
    delta: "Last requirement.",
    start_ms: 100,
    end_ms: 200,
  })
  Peer.latest.channel.receive({ type: "session.closed" })
  expect(await closing).toBe(true)
  expect(received).toEqual(["Last requirement."])
  expect(track.stop).toHaveBeenCalledOnce()
  expect(Peer.latest.connectionState).toBe("closed")
  expect(live.connected).toBe(false)
})

it("releases the microphone when session creation fails", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({ error: "No model access" }, { status: 502 })
    )
  )
  const live = capture()
  await expect(live.start("chat")).rejects.toThrow("No model access")
  expect(track.stop).toHaveBeenCalledOnce()
  expect(Peer.latest.channel.readyState).toBe("closed")
})

it("stops a microphone granted after cancellation", async () => {
  let grant: ((value: typeof microphone) => void) | undefined
  vi.stubGlobal("navigator", {
    mediaDevices: {
      getUserMedia: () =>
        new Promise((resolve) => {
          grant = resolve
        }),
    },
  })
  const live = capture()
  const started = live.start("chat")
  live.dispose()
  grant?.(microphone)
  await expect(started).rejects.toThrow("Capture was cancelled")
  expect(track.stop).toHaveBeenCalledOnce()
})

it("reports unconfirmed finalization on timeout but still stops capture", async () => {
  vi.useFakeTimers()
  const live = capture()
  await live.start("chat")
  const closing = live.close()
  await vi.advanceTimersByTimeAsync(15000)
  expect(await closing).toBe(false)
  expect(track.stop).toHaveBeenCalledOnce()
  expect(Peer.latest.connectionState).toBe("closed")
})

it("reports silent input separately from audio and confirmed transcription", async () => {
  vi.useFakeTimers()
  const input = vi.fn()
  const live = new LiveCapture({
    audio: document.createElement("audio"),
    event: vi.fn(),
    error: vi.fn(),
    input,
  })
  await live.start("chat", "chosen-device")
  expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
    audio: { deviceId: { exact: "chosen-device" } },
  })
  await vi.advanceTimersByTimeAsync(8500)
  expect(input).toHaveBeenLastCalledWith({
    device: "Test microphone",
    level: 0,
    status: "silent",
  })
  Peer.latest.level = 0.2
  await vi.advanceTimersByTimeAsync(500)
  expect(input).toHaveBeenLastCalledWith({
    device: "Test microphone",
    level: 0.2,
    status: "sending",
  })
  Peer.latest.channel.receive({
    type: "session.input_transcript.delta",
    event_id: "speech",
    delta: "Hello",
    start_ms: 0,
    end_ms: 100,
  })
  await vi.advanceTimersByTimeAsync(500)
  expect(input).toHaveBeenLastCalledWith({
    device: "Test microphone",
    level: 0.2,
    status: "transcribing",
  })
  live.mute(true)
  await vi.advanceTimersByTimeAsync(500)
  expect(input.mock.lastCall?.[0].status).toBe("muted")
  live.dispose()
})

it("switches the transmitted microphone and releases the previous one", async () => {
  const live = capture()
  await live.start("chat")
  live.mute(true)
  const replacement = { ...track, enabled: true, stop: vi.fn() }
  vi.stubGlobal("navigator", {
    mediaDevices: {
      getUserMedia: vi.fn(async () => ({
        getTracks: () => [replacement],
        getAudioTracks: () => [replacement],
      })),
    },
  })
  await live.changeMicrophone("second")
  expect(Peer.latest.replacement).toHaveBeenCalledWith(replacement)
  expect(replacement.enabled).toBe(false)
  expect(track.stop).toHaveBeenCalledOnce()
  live.dispose()
  expect(replacement.stop).toHaveBeenCalledOnce()
})

it("records transport diagnostics without recording raw audio", async () => {
  vi.useFakeTimers()
  const diagnostics = vi.fn()
  const live = new LiveCapture({
    audio: document.createElement("audio"),
    event: vi.fn(),
    error: vi.fn(),
    input: vi.fn(),
    diagnostics,
  })
  await live.start("chat")
  Peer.latest.level = 0.15
  await vi.advanceTimersByTimeAsync(5500)
  expect(diagnostics).toHaveBeenLastCalledWith({
    sessionId: "live_test",
    capturedAt: expect.any(String),
    connection: "connected",
    channel: "open",
    level: 0.15,
    peak: 0.15,
    device: "Test microphone",
    bytesSent: null,
    packetsSent: null,
    packetsLost: null,
    codec: null,
    sampleRate: 48000,
    channelCount: 1,
    events: [{ type: "session.started", count: 1 }],
    parseErrors: 0,
    lastError: null,
  })
  live.dispose()
})

it("reports a persistent disconnection and releases the microphone", async () => {
  vi.useFakeTimers()
  const error = vi.fn()
  const live = new LiveCapture({
    audio: document.createElement("audio"),
    event: vi.fn(),
    error,
  })
  await live.start("chat")
  Peer.latest.connectionState = "disconnected"
  Peer.latest.dispatchEvent(new Event("connectionstatechange"))
  await vi.advanceTimersByTimeAsync(10000)
  expect(error).toHaveBeenCalledWith(
    "Audio disconnected. Press Play to reconnect before continuing your presentation."
  )
  expect(track.stop).toHaveBeenCalledOnce()
  expect(live.connected).toBe(false)
})
