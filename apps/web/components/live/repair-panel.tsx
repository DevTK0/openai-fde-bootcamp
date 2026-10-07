"use client"
import { useEffect, useState } from "react"
import { Wrench, Loader2 } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { BusModel } from "./bus-model"
import { assessmentRepairAreas } from "./repair-areas"
import { PARTS } from "./bus-parts"
type Row = Record<string, string | number | null>
type RepairContext = { asOf: string; repairs: Row[]; vehicles: Row[] }
export function RepairPanel({
  vehicleId,
  repairArea,
  repairAreas,
  service,
  eventSeq,
  report,
}: {
  vehicleId?: string | null
  repairArea?: string | null
  repairAreas?: string[] | null
  service: string
  eventSeq?: number
  report?: string
}) {
  const areas = assessmentRepairAreas(vehicleId, repairAreas, repairArea)
  const [context, setContext] = useState<RepairContext | null>(null)
  const [error, setError] = useState("")
  useEffect(() => {
    if (!vehicleId) return
    const controller = new AbortController()
    async function load() {
      try {
        const response = await fetch(
          `/api/live/context?service=${encodeURIComponent(service)}&eventSeq=${eventSeq ?? ""}`,
          { signal: controller.signal }
        )
        if (!response.ok)
          throw new Error("Could not read the workshop context.")
        setContext(await response.json())
      } catch (e) {
        if (!controller.signal.aborted) setError((e as Error).message)
      }
    }
    void load()
    return () => controller.abort()
  }, [vehicleId, eventSeq, service])
  const repairs = (context?.repairs ?? []).filter(
    (row) => row.vehicle_id === vehicleId
  )
  const vehicle = context?.vehicles.find((row) => row.vehicle_id === vehicleId)
  return (
    <section aria-labelledby="repair-heading">
      <div className="border-b px-5 py-4">
        <div className="flex items-center justify-between">
          <h2 id="repair-heading" className="font-semibold">
            3D repair view
          </h2>
          <Wrench className="size-4 text-primary" />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {vehicleId
            ? `${vehicleId} · ${eventSeq ? `Report #${eventSeq}` : "Selected assessment"}`
            : "Select a vehicle-related assessment to locate its repair area."}
        </p>
      </div>
      <div className="space-y-4 p-4">
        <BusModel
          className="h-64 sm:h-72"
          vehicleId={vehicleId ?? ""}
          service={
            vehicle
              ? String(vehicle.assigned_service_no ?? "network")
              : "network"
          }
          partIds={areas}
        />
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Areas identified by the agent
          </p>
          {areas.length ? (
            areas.map((id) => (
              <div
                key={id}
                className="rounded-lg border border-primary/20 bg-primary/5 p-3"
              >
                <p className="text-sm font-semibold">{PARTS[id]!.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {PARTS[id]!.note}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">
              No repair area identified for this assessment. The model remains
              unhighlighted.
            </p>
          )}
        </div>
        {report && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {report}
          </p>
        )}
        {vehicleId && !context && !error && (
          <p
            role="status"
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <Loader2 className="size-3 animate-spin" />
            Reading workshop records…
          </p>
        )}
        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
        {context &&
          repairs.map((row) => (
            <article
              key={String(row.work_order_id)}
              className="rounded-lg border p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{row.fault_summary}</h3>
                <Badge variant="outline">{row.work_status}</Badge>
              </div>
              <p className="mt-2 text-xs">
                {row.work_order_id} · Release:{" "}
                <strong>{row.release_status}</strong>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {row.workshop_note}
              </p>
            </article>
          ))}
        {context && !repairs.length && (
          <p className="text-xs text-muted-foreground">
            No admitted workshop record for this vehicle. The reported issue
            remains separate from Engineering confirmation.
          </p>
        )}
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          Double-deck demonstration model
          {vehicle?.vehicle_type === "SD"
            ? "; this selected vehicle is single-deck"
            : ""}
          . Area highlights are visual aids, not a diagnosis.
          {context
            ? ` Evidence cutoff: ${new Date(context.asOf).toLocaleString("en-SG", { timeZone: "Asia/Singapore" })} SGT.`
            : ""}
        </p>
      </div>
    </section>
  )
}
