import { mutationSchema } from "@/lib/dataset-records-schema"
import {
  mutateDataset,
  readDatasetDefinition,
  RecordValidationError,
} from "@/lib/dataset-records"

export const runtime = "nodejs"

export async function POST(request: Request) {
  if (process.env.RECORD_IMPORTS_ENABLED !== "1") {
    return Response.json(
      { error: "Record changes are disabled for this dashboard." },
      { status: 403 }
    )
  }
  const origin = request.headers.get("origin")
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    new URL(request.url).host
  let sameOrigin = false
  try {
    sameOrigin = origin !== null && new URL(origin).host === host
  } catch {
    sameOrigin = false
  }
  if (!sameOrigin) {
    return Response.json(
      { error: "Open this dashboard to change records." },
      { status: 403 }
    )
  }
  const reader = request.body?.getReader()
  if (!reader)
    return Response.json({ error: "Choose a CSV file." }, { status: 400 })
  const chunks: Uint8Array[] = []
  let size = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > 2_100_000) {
      await reader.cancel()
      return Response.json(
        { error: "The upload is too large. Maximum file size is 2 MB." },
        { status: 413 }
      )
    }
    chunks.push(value)
  }
  let body: unknown
  try {
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"))
  } catch {
    return Response.json(
      { error: "The upload request could not be read." },
      { status: 400 }
    )
  }
  const parsed = mutationSchema.safeParse(body)
  if (!parsed.success)
    return Response.json(
      { error: "Choose a dataset and supply valid record data." },
      { status: 400 }
    )
  try {
    return Response.json(mutateDataset(parsed.data))
  } catch (error) {
    if (error instanceof RecordValidationError) {
      return Response.json({ error: error.message }, { status: 422 })
    }
    return Response.json(
      {
        error:
          "The database could not complete this change. No records were changed. Please retry.",
      },
      { status: 503 }
    )
  }
}

export function GET(request: Request) {
  try {
    return Response.json(
      readDatasetDefinition(
        new URL(request.url).searchParams.get("table") ?? ""
      )
    )
  } catch {
    return Response.json({ error: "Unknown dataset." }, { status: 404 })
  }
}
