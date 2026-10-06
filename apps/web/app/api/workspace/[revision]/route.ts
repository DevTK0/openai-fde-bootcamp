import { z } from "zod"
import { loadBundle } from "@/lib/evidence/store"
import { seedBundle, seedId } from "@/lib/evidence/seed"
import { analyse, inspectTable } from "@/lib/evidence/analysis"
import { retrieveContext } from "@/lib/evidence/context"
import { filterSchema, revisionIdSchema } from "@/lib/evidence/schema"
import { HttpError, respond } from "@/lib/evidence/http"
export const runtime = "nodejs"
export async function GET(
  request: Request,
  context: { params: Promise<{ revision: string }> }
) {
  return respond(async () => {
    const { revision } = await context.params
    revisionIdSchema.parse(revision)
    const params = new URL(request.url).searchParams
    const filters = filterSchema.parse(
      Object.fromEntries(
        ["vehicle", "service", "from", "to"].map((k) => [
          k,
          params.get(k) ?? "",
        ])
      )
    )
    const view = z
      .enum(["analysis", "table", "context"])
      .parse(params.get("view") ?? "analysis")
    const q = z
      .string()
      .max(500)
      .parse(params.get("q") ?? "")
    const bundle = revision === seedId ? seedBundle : await loadBundle(revision)
    if (view === "analysis") return analyse(bundle, revision, filters)
    if (view === "context") return retrieveContext(bundle, revision, q, filters)
    const page = z.coerce
      .number()
      .int()
      .min(0)
      .max(100000)
      .parse(params.get("page") ?? 0)
    const result = inspectTable(
      bundle,
      revision,
      params.get("table") ?? "",
      filters,
      q,
      page
    )
    if (!result) throw new HttpError(404, "Table not found")
    return result
  })
}
