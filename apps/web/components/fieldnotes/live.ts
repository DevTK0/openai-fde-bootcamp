import { z } from "zod"
import type { NoteEvent, CaptureDiagnostics } from "@/lib/fieldnotes/schema"

const answerSchema = z.object({
  session: z.object({ id: z.string() }),
  transport: z.object({ sdp: z.string().min(1) }),
})
const transcriptSchema = z.object({
  type: z.enum([
    "session.input_transcript.delta",
    "session.output_transcript.delta",
  ]),
  event_id: z.string(),
  delta: z.string(),
  start_ms: z.number().nonnegative(),
  end_ms: z.number().nonnegative(),
})
const envelopeSchema = z.object({
  type: z.string(),
  error: z.object({ message: z.string() }).optional(),
})

export function transcriptEvent(
  value: unknown,
  sessionId: string
): NoteEvent | null {
  const result = transcriptSchema.safeParse(value)
  if (!result.success || !result.data.delta) return null
  const event = result.data
  return {
    kind: "transcript",
    id: `${sessionId}:${event.event_id}`,
    sessionId,
    speaker:
      event.type === "session.input_transcript.delta" ? "user" : "assistant",
    text: event.delta,
    startMs: event.start_ms,
    endMs: event.end_ms,
  }
}

export type InputHealth = {
  device: string
  level: number | null
  status:
    | "waiting"
    | "silent"
    | "sending"
    | "transcribing"
    | "muted"
    | "interrupted"
    | "unknown"
}
const sourceStatsSchema = z.object({
  type: z.literal("media-source"),
  kind: z.literal("audio"),
  audioLevel: z.number().optional(),
})

const transportStatsSchema = z.object({
  type: z.string(),
  kind: z.string().optional(),
  bytesSent: z.number().optional(),
  packetsSent: z.number().optional(),
  packetsLost: z.number().optional(),
  mimeType: z.string().optional(),
  codecId: z.string().optional(),
})

export class LiveCapture {
  private peer = new RTCPeerConnection()
  private channel = this.peer.createDataChannel("oai-events")
  private microphone: MediaStream | null = null
  private sessionId = ""
  private disposed = false
  private started = false
  private finalized = false
  private closing = false
  private onClosed: (() => void) | null = null
  private abort = new AbortController()
  private inputTimer: ReturnType<typeof setInterval> | undefined
  private disconnectedTimer: ReturnType<typeof setTimeout> | undefined
  private lastSignalAt = 0
  private receivedSpeech = false
  private lastDiagnosticsAt = 0
  private inputPeak = 0
  private eventCounts = new Map<string, number>()
  private parseErrors = 0
  private lastError: string | null = null
  private inspecting = false
  private sender: RTCRtpSender | null = null

  constructor(
    private callbacks: {
      audio: HTMLAudioElement
      event: (event: NoteEvent) => void
      error: (message: string) => void
      input?: (health: InputHealth) => void
      diagnostics?: (diagnostics: CaptureDiagnostics) => void
    }
  ) {
    this.peer.addEventListener("track", (event) => {
      callbacks.audio.srcObject = new MediaStream([event.track])
      void callbacks.audio
        .play()
        .catch(() =>
          callbacks.error("Use the audio player to hear the assistant.")
        )
    })
    this.channel.addEventListener("message", (event) => {
      try {
        const value: unknown = JSON.parse(event.data)
        const envelope = envelopeSchema.parse(value)
        this.eventCounts.set(
          envelope.type,
          (this.eventCounts.get(envelope.type) ?? 0) + 1
        )
        if (envelope.error) this.lastError = envelope.error.message
        if (
          envelope.type === "session.input_transcript.delta" &&
          !transcriptSchema.safeParse(value).success
        )
          this.parseErrors++
        if (envelope.type === "session.started") this.started = true
        if (envelope.type === "session.closed") {
          this.finalized = true
          this.onClosed?.()
          this.dispose()
          if (!this.closing)
            callbacks.error(
              "The live session ended. Your captured notes are available. Press Play to reconnect."
            )
        }
        const transcript = transcriptEvent(value, this.sessionId)
        if (transcript) {
          if (transcript.kind === "transcript" && transcript.speaker === "user")
            this.receivedSpeech = true
          callbacks.event(transcript)
        }
        if (envelope.type === "error")
          callbacks.error(
            this.closing
              ? "A voice update did not finish before audio stopped. Your saved clarifications remain available for the specification."
              : (envelope.error?.message ??
                  "The live session rejected a command.")
          )
      } catch {
        callbacks.error(
          "An unreadable live event was received. Check the captured transcript."
        )
      }
    })
    this.channel.addEventListener("close", () => {
      if (!this.disposed && !this.finalized) {
        this.dispose()
        callbacks.error(
          "Audio disconnected. Final session usage is unconfirmed. Your saved notes are safe; reconnect with Play."
        )
      }
    })
    this.peer.addEventListener("connectionstatechange", () => {
      clearTimeout(this.disconnectedTimer)
      if (this.peer.connectionState === "disconnected") {
        this.disconnectedTimer = setTimeout(() => {
          if (this.peer.connectionState !== "disconnected" || this.disposed)
            return
          this.dispose()
          callbacks.error(
            "Audio disconnected. Press Play to reconnect before continuing your presentation."
          )
        }, 10000)
      }
      if (this.peer.connectionState === "failed") {
        this.dispose()
        callbacks.error("The audio connection failed. Press Play to reconnect.")
      }
    })
  }
  get connected() {
    return this.started && !this.disposed
  }
  async start(id: string, deviceId = "default") {
    try {
      const microphone = await navigator.mediaDevices.getUserMedia({
        audio:
          deviceId === "default" ? true : { deviceId: { exact: deviceId } },
      })
      if (this.disposed) {
        microphone.getTracks().forEach((track) => track.stop())
        throw new Error("Capture was cancelled.")
      }
      const track = microphone.getAudioTracks()[0]
      if (!track) {
        microphone.getTracks().forEach((track) => track.stop())
        throw new Error("The selected microphone has no audio track.")
      }
      this.setMicrophone(microphone)
      this.sender = this.peer.addTrack(track, microphone)
      await this.peer.setLocalDescription(await this.peer.createOffer())
      await this.waitFor(
        () => this.peer.iceGatheringState === "complete",
        10_000
      )
      const response = await fetch("/api/fieldnotes/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, sdp: this.peer.localDescription?.sdp }),
        signal: this.abort.signal,
      })
      const body: unknown = await response.json()
      if (!response.ok)
        throw new Error(z.object({ error: z.string() }).parse(body).error)
      const answer = answerSchema.parse(body)
      this.sessionId = answer.session.id
      await this.peer.setRemoteDescription({
        type: "answer",
        sdp: answer.transport.sdp,
      })
      await this.waitFor(() => this.started, 20_000)
      this.lastSignalAt = Date.now()
      if (this.callbacks.input) {
        void this.inspectInput()
        this.inputTimer = setInterval(() => void this.inspectInput(), 500)
      }
    } catch (error) {
      this.dispose()
      throw error
    }
  }
  private setMicrophone(stream: MediaStream) {
    this.microphone = stream
    for (const track of stream.getAudioTracks()) {
      track.addEventListener("ended", () => {
        if (this.disposed || this.microphone !== stream) return
        this.dispose()
        this.callbacks.error(
          "The microphone stopped. Reconnect it and press Play before continuing."
        )
      })
    }
  }
  async changeMicrophone(deviceId: string) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: deviceId === "default" ? true : { deviceId: { exact: deviceId } },
    })
    const track = stream.getAudioTracks()[0]
    if (!track || this.disposed || !this.sender) {
      stream.getTracks().forEach((track) => track.stop())
      throw new Error(
        "The audio session is no longer connected. Press Play to reconnect."
      )
    }
    const previous = this.microphone
    track.enabled = previous?.getAudioTracks()[0]?.enabled ?? true
    try {
      await this.sender.replaceTrack(track)
    } catch (error) {
      stream.getTracks().forEach((track) => track.stop())
      throw error
    }
    if (this.disposed) {
      stream.getTracks().forEach((track) => track.stop())
      return
    }
    this.setMicrophone(stream)
    previous?.getTracks().forEach((track) => track.stop())
    this.lastSignalAt = Date.now()
    this.receivedSpeech = false
    void this.inspectInput()
  }
  private async inspectInput() {
    if (this.disposed || this.inspecting) return
    const track = this.microphone?.getAudioTracks()[0]
    if (!track) return
    this.inspecting = true
    let level: number | null = null
    let bytesSent: number | null = null
    let packetsSent: number | null = null
    let packetsLost: number | null = null
    let codec: string | null = null
    let codecId: string | undefined
    try {
      const stats = await this.peer.getStats(track)
      stats.forEach((value) => {
        const transport = transportStatsSchema.safeParse(value)
        if (transport.success) {
          const data = transport.data
          if (data.type === "outbound-rtp" && data.kind === "audio") {
            codecId = data.codecId
            bytesSent = data.bytesSent ?? null
            packetsSent = data.packetsSent ?? null
          }
          if (data.type === "remote-inbound-rtp" && data.kind === "audio")
            packetsLost = data.packetsLost ?? null
        }
        const source = sourceStatsSchema.safeParse(value)
        if (source.success && source.data.audioLevel !== undefined)
          level = source.data.audioLevel
      })
      if (codecId) {
        const selectedCodec = transportStatsSchema.safeParse(stats.get(codecId))
        if (selectedCodec.success) codec = selectedCodec.data.mimeType ?? null
      }
    } catch {
      /* Some browsers do not expose microphone levels in WebRTC statistics. */
    } finally {
      this.inspecting = false
    }
    if (this.disposed) return
    this.inputPeak = Math.max(this.inputPeak, level ?? 0)
    if (
      this.callbacks.diagnostics &&
      Date.now() - this.lastDiagnosticsAt >= 5000
    ) {
      this.lastDiagnosticsAt = Date.now()
      const settings = track.getSettings()
      this.callbacks.diagnostics({
        sessionId: this.sessionId,
        capturedAt: new Date().toISOString(),
        connection: this.peer.connectionState,
        channel: this.channel.readyState,
        level,
        peak: this.inputPeak,
        device: track.label,
        bytesSent,
        packetsSent,
        packetsLost,
        codec,
        sampleRate: settings.sampleRate ?? null,
        channelCount: settings.channelCount ?? null,
        events: [...this.eventCounts]
          .slice(0, 30)
          .map(([type, count]) => ({ type, count })),
        parseErrors: this.parseErrors,
        lastError: this.lastError,
      })
      this.inputPeak = 0
    }
    if (level !== null && level > 0.005) this.lastSignalAt = Date.now()
    const status: InputHealth["status"] = !track.enabled
      ? "muted"
      : track.muted || this.peer.connectionState === "disconnected"
        ? "interrupted"
        : level === null
          ? "unknown"
          : Date.now() - this.lastSignalAt > 8000
            ? "silent"
            : this.receivedSpeech
              ? "transcribing"
              : level > 0.005
                ? "sending"
                : "waiting"
    this.callbacks.input?.({
      device: track.label || "Selected microphone",
      level,
      status,
    })
  }
  private async waitFor(ready: () => boolean, timeout: number) {
    const deadline = Date.now() + timeout
    while (!ready()) {
      if (this.disposed) throw new Error("Audio connection closed.")
      if (Date.now() > deadline)
        throw new Error(
          "Audio connection timed out. Check your network and try again."
        )
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
  mute(muted: boolean) {
    this.microphone?.getAudioTracks().forEach((track) => {
      track.enabled = !muted
    })
  }
  clarify(text: string) {
    if (!this.connected || this.channel.readyState !== "open") return
    // Context appends are limited to 500 tokens; the full correction is saved for specification generation.
    this.channel.send(
      JSON.stringify({
        type: "session.thinking.append",
        delegation_id: null,
        content: `Written user clarification: ${text.slice(0, 800)}`,
        event_id: crypto.randomUUID(),
      })
    )
  }
  async close(): Promise<boolean> {
    this.closing = true
    this.mute(true)
    if (!this.connected || this.channel.readyState !== "open") {
      this.dispose()
      return this.finalized
    }
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(resolve, 15_000)
      this.onClosed = () => {
        clearTimeout(timeout)
        resolve()
      }
      this.channel.send(JSON.stringify({ type: "session.close" }))
    })
    this.dispose()
    return this.finalized
  }
  dispose() {
    if (this.disposed) return
    this.disposed = true
    clearInterval(this.inputTimer)
    clearTimeout(this.disconnectedTimer)
    this.abort.abort()
    this.microphone?.getTracks().forEach((track) => track.stop())
    if (this.channel.readyState === "open" && !this.closing && !this.finalized)
      this.channel.send(JSON.stringify({ type: "session.close" }))
    this.channel.close()
    this.peer.close()
    this.callbacks.audio.srcObject = null
  }
}
