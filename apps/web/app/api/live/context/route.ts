import { ensureContextDatabase, allContextRecords } from "@/lib/live/context-db"
import { agentAssessmentTime, liveSnapshot } from "@/lib/live/store"
import { serviceSchema } from "@/lib/live/contracts"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export async function GET(request: Request) {
  const url = new URL(request.url)
  const service = serviceSchema.safeParse(
    url.searchParams.get("service") ?? "network"
  )
  if (!service.success)
    return Response.json({ error: "Invalid service." }, { status: 400 })
  await ensureContextDatabase()
  const snapshot = liveSnapshot()
  const event =
    snapshot.events.find(
      (row) => row.seq === Number(url.searchParams.get("eventSeq"))
    ) ?? snapshot.events[0]
  const asOf = event ? agentAssessmentTime(event) : new Date().toISOString()
  const routeRows = allContextRecords("routes", [], asOf)
  const routes =
    service.data === "network"
      ? []
      : routeRows.filter(
          (row) => String(row.record.service_no) === service.data
        )
  const ids = new Set(routes.map((row) => row.record.route_id))
  const stops = new Map(
    allContextRecords("stops", [], asOf).map((row) => [
      row.record.stop_id,
      row.record,
    ])
  )
  const routeStops = allContextRecords("route_stops", [], asOf)
    .filter((row) => ids.has(row.record.route_id))
    .map((row) => ({
      ...row.record,
      ...stops.get(row.record.stop_id),
      evidenceId: row.evidenceId,
    }))
  const repairs = allContextRecords("workshop_work_orders", [], asOf).map(
    (row) => ({ ...row.record, evidenceId: row.evidenceId })
  )
  const vehicles = [
    ...allContextRecords("vehicles", [], asOf),
    ...allContextRecords("workshop_vehicles", [], asOf),
  ].map((row) => row.record)
  return Response.json(
    {
      asOf,
      services: snapshot.services,
      routes: routes.map((row) => row.record),
      routeStops,
      repairs,
      vehicles,
    },
    { headers: { "Cache-Control": "no-store" } }
  )
}
