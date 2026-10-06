import { authenticate } from "@/lib/http"

export const runtime = "nodejs"
export async function POST(request: Request) {
  const denied = authenticate(request)
  if (denied) return denied
  if (!process.env.OPENAI_API_KEY)
    return new Response(
      "Live transcription is not configured. Ask the operator to set OPENAI_API_KEY. You can use the typed transcript now.",
      { status: 503 }
    )
  if (Number(request.headers.get("content-length") || 0) > 64000)
    return new Response("SDP offer is too large.", { status: 413 })
  const sdp = await request.text()
  if (Buffer.byteLength(sdp) > 64000 || !sdp.startsWith("v=0"))
    return new Response("A valid SDP offer is required.", { status: 400 })
  const body = new FormData()
  body.set("sdp", sdp)
  body.set(
    "session",
    JSON.stringify({
      type: "transcription",
      audio: {
        input: {
          transcription: { model: "gpt-live-transcribe" },
          turn_detection: null,
        },
      },
    })
  )
  try {
    const response = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body,
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(20_000)]),
    })
    if (!response.ok)
      return new Response(
        "The transcription provider could not start a session. Check the server's OpenAI access and try again.",
        { status: 502 }
      )
    return new Response(await response.text(), {
      headers: {
        "Content-Type": "application/sdp",
        "Cache-Control": "no-store",
      },
    })
  } catch {
    return new Response(
      "The transcription service did not respond. You can continue with the typed transcript.",
      { status: 502 }
    )
  }
}
