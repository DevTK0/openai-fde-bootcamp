import { z } from "zod"
export const maxImportBytes = 5 * 1024 * 1024
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
  }
}
export async function readImport(request: Request) {
  const origin = request.headers.get("origin")
  const requestOrigin = new URL(request.url)
  requestOrigin.host = request.headers.get("host") || requestOrigin.host
  const expectedOrigin =
    process.env.EVIDENCE_PUBLIC_ORIGIN || requestOrigin.origin
  if (!origin || origin !== expectedOrigin)
    throw new HttpError(403, "Import requires the configured same origin")
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new HttpError(415, "Import requires application/json")
  if (Number(request.headers.get("content-length")) > maxImportBytes)
    throw new HttpError(413, "Import exceeds 5 MiB")
  if (!request.body) throw new HttpError(400, "Empty import")
  const reader = request.body.getReader(),
    chunks: Uint8Array[] = []
  let size = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > maxImportBytes) {
        await reader.cancel()
        throw new HttpError(413, "Import exceeds 5 MiB")
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown
  } catch {
    throw new HttpError(400, "Invalid JSON")
  }
}
export async function respond(operation: () => Promise<unknown>) {
  try {
    return Response.json(await operation(), {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error) {
    if (error instanceof HttpError)
      return Response.json({ error: error.message }, { status: error.status })
    if (error instanceof z.ZodError)
      return Response.json(
        {
          error: "Invalid evidence request",
          issues: error.issues.slice(0, 12).map((i) => i.message),
        },
        { status: 400 }
      )
    if (error instanceof Error && "code" in error && error.code === "ENOENT")
      return Response.json({ error: "Revision not found" }, { status: 404 })
    console.error("Evidence workspace request failed", error)
    return Response.json(
      { error: "Evidence workspace unavailable" },
      { status: 500 }
    )
  }
}
