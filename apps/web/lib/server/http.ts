import { z } from "zod"

export const scenarioIdSchema = z.enum(["service-235-recovery", "service-238-timetable"])
export const planningModeSchema = z.enum(["prospective", "retrospective"])
export const dateSchema = z.iso.date()

export function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } })
}

export async function readJson(request: Request, maxBytes = 16_384): Promise<unknown> {
  const declared = Number(request.headers.get("content-length") ?? 0)
  if (Number.isFinite(declared) && declared > maxBytes) throw new Error("BODY_TOO_LARGE")
  const text = await request.text()
  if (new TextEncoder().encode(text).byteLength > maxBytes) throw new Error("BODY_TOO_LARGE")
  try {
    return JSON.parse(text) as unknown
  } catch {
    throw new Error("INVALID_JSON")
  }
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin")
  if (!origin) return false
  try {
    const parsedOrigin = new URL(origin)
    const requestUrl = new URL(request.url)
    const host = request.headers.get("host")?.toLowerCase() ?? requestUrl.host.toLowerCase()
    const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",", 1)[0]?.trim()
    const protocol = forwardedProtocol || requestUrl.protocol.slice(0, -1)
    return parsedOrigin.host.toLowerCase() === host && parsedOrigin.protocol === `${protocol}:`
  } catch {
    return false
  }
}
