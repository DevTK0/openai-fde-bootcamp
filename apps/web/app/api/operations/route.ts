import { recordQuerySchema } from "@/lib/record-query"
import {
  getOperationsReport,
  getOperationsManifest,
  queryOperationsTable,
  readOperationsDownload,
  exportOperationsCsv,
  sourceTable,
} from "@/lib/operations-server"
import { DatabaseBusyError } from "@/lib/database"

export const runtime = "nodejs"
export async function GET(request: Request) {
  try {
    request.signal.throwIfAborted()
    return await operationsResponse(request)
  } catch (error) {
    if (request.signal.aborted) return new Response(null, { status: 499 })
    if (error instanceof DatabaseBusyError) {
      return Response.json(
        { error: error.message },
        { status: 503, headers: { "Retry-After": "1" } }
      )
    }
    throw error
  }
}

async function operationsResponse(request: Request) {
  const params = new URL(request.url).searchParams
  const view = params.get("view") ?? "summary"
  if (view === "summary") {
    const operationsManifest = getOperationsManifest()
    const service = params.get("service") ?? "all",
      date = params.get("date") ?? "all"
    if (
      (service !== "all" && !operationsManifest.services.includes(service)) ||
      (date !== "all" && !operationsManifest.dates.includes(date))
    )
      return Response.json(
        { error: "Unknown service or date" },
        { status: 400 }
      )
    return Response.json(
      await getOperationsReport(service, date, request.signal)
    )
  }
  const table = params.get("table") ?? "trips"
  const source = sourceTable(table)
  if (!source)
    return Response.json({ error: "Unknown source table" }, { status: 400 })
  if (view === "download") {
    const buffer = await readOperationsDownload(table)
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": `attachment; filename="${table}.csv.gz"`,
      },
    })
  }
  if (view !== "records" && view !== "export")
    return Response.json({ error: "Unknown view" }, { status: 400 })
  const parsed = recordQuerySchema.safeParse(Object.fromEntries(params))
  if (!parsed.success || !/^\d+$/.test(params.get("page") ?? "0"))
    return Response.json(
      { error: "Invalid search or filter." },
      { status: 400 }
    )
  const query = parsed.data
  if (
    [query.column, query.sort].some(
      (column) => column && !source.columns.includes(column)
    )
  )
    return Response.json(
      { error: "Unknown filter or sort column." },
      { status: 400 }
    )
  if (view === "export") {
    return new Response(
      await exportOperationsCsv(table, request.signal, query),
      {
        headers: {
          "Content-Type": "text/csv;charset=utf-8",
          "Content-Disposition": `attachment; filename="${table}.csv"`,
        },
      }
    )
  }
  return Response.json(
    await queryOperationsTable(
      table,
      query.q,
      query.page,
      request.signal,
      query
    )
  )
}
