import { cookies } from "next/headers"
import { randomUUID } from "node:crypto"
import { z } from "zod"
import { FieldnotesError } from "./store"

export async function owner() {
  const jar = await cookies()
  const existing = jar.get("fieldnotes-owner")?.value
  if (existing && z.string().uuid().safeParse(existing).success) return existing
  const id = randomUUID()
  jar.set("fieldnotes-owner", id, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/api/fieldnotes",
    maxAge: 60 * 60 * 24 * 365,
  })
  return id
}
export async function readBody(request: Request): Promise<unknown> {
  const origin = request.headers.get("origin")
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host")
  if (!origin || new URL(origin).host !== host)
    throw new FieldnotesError("Unexpected request origin.", 403)
  const text = await request.text()
  if (text.length > 256_000)
    throw new FieldnotesError("Request is too large.", 413)
  try {
    return JSON.parse(text)
  } catch {
    throw new FieldnotesError("Invalid JSON.")
  }
}
export function failure(error: unknown) {
  if (error instanceof FieldnotesError)
    return Response.json({ error: error.message }, { status: error.status })
  if (error instanceof z.ZodError)
    return Response.json(
      { error: "Invalid request or service response." },
      { status: 400 }
    )
  return Response.json(
    {
      error:
        "Could not complete the request. Your saved notes are safe. Try again.",
    },
    { status: 500 }
  )
}
