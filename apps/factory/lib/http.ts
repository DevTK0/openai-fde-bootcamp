import { timingSafeEqual } from "node:crypto"
import { join } from "node:path"
import { z } from "zod"
import { commandSchema } from "./contracts"
import { dataDirectory } from "./config"
import { Conflict, Store } from "./store"

export function authenticate(request: Request): Response | null {
  const token = process.env.FACTORY_ACCESS_TOKEN
  if (!token || token.length < 24)
    return Response.json(
      {
        error:
          "Factory access is not configured. Set FACTORY_ACCESS_TOKEN to at least 24 characters.",
      },
      { status: 503 }
    )
  const received = Buffer.from(request.headers.get("authorization") || "")
  const expected = Buffer.from(`Bearer ${token}`)
  if (
    received.length !== expected.length ||
    !timingSafeEqual(received, expected)
  )
    return Response.json(
      { error: "Enter a valid factory access token." },
      { status: 401 }
    )
  return null
}
export async function handle(request: Request): Promise<Response> {
  const denied = authenticate(request)
  if (denied) return denied
  let store: Store | undefined
  try {
    store = new Store(join(dataDirectory(), "factory.sqlite"))
    if (request.method === "GET") {
      const value = new URL(request.url).searchParams.get("conversationId")
      const id = value ? z.string().uuid().parse(value) : undefined
      return Response.json(store.snapshot(id), {
        headers: { "Cache-Control": "no-store" },
      })
    }
    if (Number(request.headers.get("content-length") || 0) > 20000)
      return Response.json({ error: "Request is too large." }, { status: 413 })
    const text = await request.text()
    if (Buffer.byteLength(text) > 20000)
      return Response.json({ error: "Request is too large." }, { status: 413 })
    const command = commandSchema.parse(JSON.parse(text))
    return Response.json(store.apply(command), {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError)
      return Response.json(
        { error: "Invalid factory request." },
        { status: 400 }
      )
    if (error instanceof Conflict)
      return Response.json({ error: error.message }, { status: 409 })
    return Response.json(
      { error: "Factory storage is unavailable." },
      { status: 503 }
    )
  } finally {
    store?.close()
  }
}
