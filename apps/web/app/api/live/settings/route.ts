import { z } from "zod"
import { updateMonitorSettings } from "@/lib/live/store"
import { isSameOrigin, jsonError, readJson } from "@/lib/server/http"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
const schema = z.strictObject({
  paused: z.boolean().optional(),
  llmEnabled: z.boolean().optional(),
})
export async function POST(request: Request) {
  if (!isSameOrigin(request))
    return jsonError("Settings must be changed from this application.", 403)
  try {
    const parsed = schema.parse(await readJson(request))
    updateMonitorSettings(parsed)
    return Response.json({ ok: true })
  } catch {
    return jsonError("Could not change monitor settings.", 400)
  }
}
