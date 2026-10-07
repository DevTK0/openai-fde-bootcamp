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
  addTrack() {}
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
const track = { enabled: true, stop: vi.fn() }
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
