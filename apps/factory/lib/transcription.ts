import { responseError } from "./response-error"
import {
  orderedTranscripts,
  type FinalTranscript,
} from "./transcription-events"

export async function startTranscription(options: {
  token: string
  signal: AbortSignal
  onFinal: (turn: FinalTranscript) => void
  onPartial: (text: string) => void
  onError: (message: string) => void
}): Promise<{ stop: () => Promise<void> }> {
  const peer = new RTCPeerConnection()
  const channel = peer.createDataChannel("oai-events")
  let stream: MediaStream | undefined
  let audio: AudioContext | undefined
  let timer: ReturnType<typeof setInterval> | undefined
  let cancelHandshake: (() => void) | undefined
  let closed = false
  let speaking = false
  let lastVoice = 0
  let turnStarted = 0
  let outstanding = 0
  const committedPartials = new Set<string>()
  const cleanup = () => {
    if (closed) return
    closed = true
    clearInterval(timer)
    cancelHandshake?.()
    stream?.getTracks().forEach((track) => track.stop())
    void audio?.close()
    channel.close()
    peer.close()
    options.signal.removeEventListener("abort", cleanup)
  }
  const fail = (message: string) => {
    cleanup()
    options.onError(message)
  }
  const transcript = orderedTranscripts({
    final: (turn) => {
      committedPartials.delete(turn.id)
      outstanding = Math.max(0, outstanding - 1)
      options.onFinal(turn)
    },
    partial: (text) => {
      if (
        text.trim() &&
        transcript.uncommittedIds.some((id) => !committedPartials.has(id))
      ) {
        if (!speaking) turnStarted = Date.now()
        speaking = true
        lastVoice = Date.now()
      }
      options.onPartial(text)
    },
    error: fail,
  })
  const commit = () => {
    if (!speaking || channel.readyState !== "open") return
    speaking = false
    transcript.uncommittedIds.forEach((id) => committedPartials.add(id))
    outstanding += 1
    channel.send(JSON.stringify({ type: "input_audio_buffer.commit" }))
  }
  options.signal.addEventListener("abort", cleanup, { once: true })
  try {
    options.signal.throwIfAborted()
    const acquired = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream = acquired
    if (closed || options.signal.aborted) {
      stream.getTracks().forEach((track) => track.stop())
      throw new DOMException("Microphone setup cancelled", "AbortError")
    }
    stream.getTracks().forEach((track) => {
      peer.addTrack(track, acquired)
      track.addEventListener(
        "ended",
        () => {
          if (!closed) fail("The microphone stopped. Reconnect to continue.")
        },
        { once: true }
      )
    })
    channel.addEventListener("message", (event: MessageEvent<unknown>) => {
      if (closed || typeof event.data !== "string") return
      try {
        transcript.receive(JSON.parse(event.data))
      } catch {
        fail(
          "The transcription service sent an invalid event. Please reconnect."
        )
      }
    })
    channel.addEventListener("close", () => {
      if (!closed)
        fail("The microphone connection closed. Reconnect to continue.")
    })
    peer.addEventListener("connectionstatechange", () => {
      if (!closed && ["failed", "disconnected"].includes(peer.connectionState))
        fail("The microphone connection was lost. Reconnect to continue.")
    })
    const opened = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error("Microphone connection timed out.")),
        20_000
      )
      const finish = () => {
        clearTimeout(timeout)
        resolve()
      }
      channel.addEventListener("open", finish, { once: true })
      cancelHandshake = () => {
        clearTimeout(timeout)
        reject(new DOMException("Cancelled", "AbortError"))
      }
    })
    // Attach rejection handling while the SDP exchange is pending.
    void opened.catch(() => undefined)
    await peer.setLocalDescription(await peer.createOffer())
    const response = await fetch("/api/transcription", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${options.token}`,
        "Content-Type": "application/sdp",
      },
      body: peer.localDescription?.sdp,
      signal: options.signal,
    })
    if (!response.ok) throw new Error(await responseError(response))
    options.signal.throwIfAborted()
    await peer.setRemoteDescription({
      type: "answer",
      sdp: await response.text(),
    })
    await opened
    options.signal.throwIfAborted()
    if (closed) throw new Error("Microphone connection closed during setup.")
    audio = new AudioContext()
    await audio.resume()
    options.signal.throwIfAborted()
    if (closed) throw new Error("Microphone connection closed during setup.")
    const analyser = audio.createAnalyser()
    analyser.fftSize = 1024
    audio.createMediaStreamSource(stream).connect(analyser)
    const samples = new Float32Array(analyser.fftSize)
    timer = setInterval(() => {
      analyser.getFloatTimeDomainData(samples)
      const energy = Math.sqrt(
        samples.reduce((sum, value) => sum + value * value, 0) / samples.length
      )
      const now = Date.now()
      if (energy > 0.015) {
        if (!speaking) turnStarted = now
        speaking = true
        lastVoice = now
      }
      if (speaking && (now - lastVoice > 800 || now - turnStarted > 20_000))
        commit()
    }, 100)
    return {
      async stop() {
        clearInterval(timer)
        commit()
        stream?.getTracks().forEach((track) => track.stop())
        const deadline = Date.now() + 8_000
        while (!closed && outstanding > 0 && Date.now() < deadline)
          await new Promise((resolve) => setTimeout(resolve, 100))
        if (outstanding > 0)
          options.onError(
            "Some speech was not finalized before disconnecting. Add the missing words with the typed transcript."
          )
        cleanup()
      },
    }
  } catch (error) {
    cleanup()
    throw error
  }
}
