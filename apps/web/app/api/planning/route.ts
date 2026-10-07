import { z } from "zod"
import { planningRequestSchema } from "@/lib/planning-schema"
import {
  planningAudit,
  planningCatalog,
  planningStream,
} from "@/lib/planning-server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("run")
  try {
    if (id) {
      if (!z.string().uuid().safeParse(id).success)
        return Response.json(
          { error: "Invalid planning run." },
          { status: 400 }
        )
      return Response.json(await planningAudit(id), {
        headers: {
          "Content-Disposition": `attachment; filename="planning-${id}.json"`,
          "Cache-Control": "no-store",
        },
      })
    }
    return Response.json(await planningCatalog(), {
      headers: { "Cache-Control": "no-store" },
    })
  } catch {
    return Response.json(
      {
        error: id
          ? "This planning run is unavailable."
          : "Planning data could not be loaded. Check the database path and Python 3 runtime.",
      },
      { status: id ? 404 : 503 }
    )
  }
}

export async function POST(request: Request) {
  let input: unknown
  try {
    input = await request.json()
  } catch {
    return Response.json(
      { error: "Provide a JSON planning request." },
      { status: 400 }
    )
  }
  const parsed = planningRequestSchema.safeParse(input)
  if (!parsed.success)
    return Response.json(
      { error: parsed.error.issues.map((issue) => issue.message).join(" ") },
      { status: 400 }
    )
  return new Response(planningStream(parsed.data, request.signal), {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
