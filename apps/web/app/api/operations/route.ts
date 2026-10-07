import {
  getOperationsReport,
  getOperationsManifest,
  queryOperationsTable,
  readOperationsDownload,
  sourceTable,
} from "@/lib/operations-server"
export const runtime = "nodejs"
export async function GET(request: Request) {
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
    return Response.json(await getOperationsReport(service, date))
  }
  const table = params.get("table") ?? "trips"
  if (!sourceTable(table))
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
  if (view !== "records")
    return Response.json({ error: "Unknown view" }, { status: 400 })
  const rawPage = params.get("page") ?? "0",
    page = Number(rawPage),
    query = params.get("q") ?? ""
  if (
    !/^\d+$/.test(rawPage) ||
    !Number.isSafeInteger(page) ||
    page > 100000 ||
    query.length > 120
  )
    return Response.json(
      { error: "Invalid page or search (maximum 120 characters)" },
      { status: 400 }
    )
  return Response.json(await queryOperationsTable(table, query, page))
}
