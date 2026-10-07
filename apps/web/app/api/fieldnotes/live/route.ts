import { z } from "zod"
import { owner, readBody, failure } from "@/lib/fieldnotes/http"
import { withStore } from "@/lib/fieldnotes/store"
import { createLiveSession } from "@/lib/fieldnotes/openai"

export const runtime = "nodejs"
export async function POST(request: Request) {
  try {
    const body = z
      .object({ id: z.string().uuid(), sdp: z.string().min(1).max(64000) })
      .parse(await readBody(request))
    const who = await owner()
    const chat = withStore((store) => store.get(who, body.id))
    return Response.json(await createLiveSession(chat, body.sdp), {
      status: 201,
    })
  } catch (error) {
    return failure(error)
  }
}
