import { liveRevision, liveSnapshot } from "@/lib/live/store"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export async function GET(request: Request) {
  const encoder = new TextEncoder()
  let timer: ReturnType<typeof setInterval> | undefined
  let closed = false
  let last = ""
  const cleanup = () => {
    closed = true
    if (timer) clearInterval(timer)
  }
  const stream = new ReadableStream({
    start(controller) {
      const send = () => {
        if (closed) return
        try {
          const revision = liveRevision()
          if (revision !== last) {
            last = revision
            controller.enqueue(
              encoder.encode(
                `event: snapshot\ndata: ${JSON.stringify(liveSnapshot())}\n\n`
              )
            )
          } else controller.enqueue(encoder.encode(": heartbeat\n\n"))
        } catch {
          cleanup()
          controller.error(new Error("Live stream unavailable."))
        }
      }
      send()
      timer = setInterval(send, 1000)
      request.signal.addEventListener(
        "abort",
        () => {
          cleanup()
          try {
            controller.close()
          } catch {}
        },
        { once: true }
      )
      if (request.signal.aborted) {
        cleanup()
        controller.close()
      }
    },
    cancel() {
      cleanup()
    },
  })
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
