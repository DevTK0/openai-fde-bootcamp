import { z } from "zod"
import type { NoteEvent } from "@/lib/fieldnotes/schema"

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

  constructor(
    private callbacks: {
      audio: HTMLAudioElement
      event: (event: NoteEvent) => void
      error: (message: string) => void
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
        if (transcript) callbacks.event(transcript)
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
      if (this.peer.connectionState === "failed") {
        this.dispose()
        callbacks.error("The audio connection failed. Press Play to reconnect.")
      }
    })
  }
  get connected() {
    return this.started && !this.disposed
  }
  async start(id: string) {
    try {
      const microphone = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
      if (this.disposed) {
        microphone.getTracks().forEach((track) => track.stop())
        throw new Error("Capture was cancelled.")
      }
      this.microphone = microphone
      microphone
        .getAudioTracks()
        .forEach((track) => this.peer.addTrack(track, microphone))
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
    } catch (error) {
      this.dispose()
      throw error
    }
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
    this.abort.abort()
    this.microphone?.getTracks().forEach((track) => track.stop())
    if (this.channel.readyState === "open" && !this.closing && !this.finalized)
      this.channel.send(JSON.stringify({ type: "session.close" }))
    this.channel.close()
    this.peer.close()
    this.callbacks.audio.srcObject = null
  }
}
