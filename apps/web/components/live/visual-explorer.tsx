"use client"
import { useEffect, useState } from "react"
import { MapPin, Route, Wrench, Loader2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Label } from "@workspace/ui/components/label"
import { BusModel } from "./bus-model"
import { assessmentRepairAreas } from "./repair-areas"
import { PARTS } from "./bus-parts"
type RecordRow = Record<string, string | number | null>
type Context = {
  asOf: string
  services: string[]
  routes: RecordRow[]
  routeStops: RecordRow[]
  repairs: RecordRow[]
  vehicles: RecordRow[]
}
export function VisualExplorer({
  service,
  eventSeq,
  vehicleId,
  repairArea,
  repairAreas,
  report,
}: {
  service: string
  eventSeq?: number
  vehicleId?: string
  report?: string
  repairArea?: string | null
  repairAreas?: string[] | null
}) {
  const [open, setOpen] = useState(false),
    [mode, setMode] = useState("route")
  const [selectedService, setService] = useState(service),
    [data, setData] = useState<Context | null>(null)
  const [routeId, setRouteId] = useState(""),
    [stopId, setStopId] = useState("")
  const vehicle = vehicleId ?? ""
  const areas =
    vehicle === vehicleId
      ? assessmentRepairAreas(vehicleId, repairAreas, repairArea)
      : []
  const [error, setError] = useState(""),
    [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!open) return
    const controller = new AbortController()
    async function load() {
      setLoading(true)
      setError("")
      try {
        const response = await fetch(
          `/api/live/context?service=${encodeURIComponent(selectedService)}&eventSeq=${eventSeq ?? ""}`,
          { signal: controller.signal }
        )
        if (!response.ok) throw new Error("Could not load visual context.")
        const result = (await response.json()) as Context
        setData(result)
        setRouteId(String(result.routes[0]?.route_id ?? ""))
        setStopId("")
      } catch (e) {
        if (!controller.signal.aborted) setError((e as Error).message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void load()
    return () => controller.abort()
  }, [open, selectedService, eventSeq])
  const stops = (data?.routeStops ?? [])
    .filter((row) => row.route_id === routeId)
    .sort((a, b) => Number(a.stop_order) - Number(b.stop_order))
  const positions = stops.filter(
    (row) =>
      Number.isFinite(Number(row.latitude)) &&
      Number.isFinite(Number(row.longitude))
  )
  const lat = positions.map((row) => Number(row.latitude)),
    lon = positions.map((row) => Number(row.longitude))
  const minLat = Math.min(...lat),
    minLon = Math.min(...lon)
  const scale = Math.min(
    580 / Math.max(0.001, Math.max(...lon) - minLon),
    280 / Math.max(0.001, Math.max(...lat) - minLat)
  )
  const point = (row: RecordRow) => [
    40 + (Number(row.longitude) - minLon) * scale,
    320 - (Number(row.latitude) - minLat) * scale,
  ]
  const repairs = (data?.repairs ?? []).filter(
    (row) => row.vehicle_id === vehicle
  )
  const fleet = data?.vehicles.find((row) => row.vehicle_id === vehicle)
  const selectedStop = stops.find((row) => row.stop_id === stopId)
  const route = data?.routes.find((row) => row.route_id === routeId)
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        if (value) {
          setService(service)
        }
      }}
    >
      <DialogTrigger render={<Button variant="outline" />}>
        <Route />
        Explore operations
      </DialogTrigger>
      <DialogContent className="live-console max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>See the operating context</DialogTitle>
          <DialogDescription>
            Trace the route and inspect workshop records on the LionLink model.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={mode === "route" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("route")}
          >
            <Route />
            Route view
          </Button>
          <Button
            variant={mode === "repair" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("repair")}
          >
            <Wrench />
            Repairs in 3D
          </Button>
          <Badge variant="outline" className="ml-auto">
            Dated database context
          </Badge>
        </div>
        {loading && (
          <p role="status" className="flex items-center gap-2 text-sm">
            <Loader2 className="size-4 animate-spin" />
            Reading database…
          </p>
        )}
        {error && (
          <p role="alert" className="text-destructive">
            {error}
          </p>
        )}
        {data && (
          <>
            {mode === "route" ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="mb-2 block">Service</Label>
                    <Select
                      value={selectedService}
                      onValueChange={(v) => setService(v ?? "network")}
                    >
                      <SelectTrigger
                        aria-label="Visualized service"
                        className="w-full"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="live-console">
                        {data.services.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">Route direction</Label>
                    <Select
                      value={routeId}
                      onValueChange={(v) => {
                        setRouteId(v ?? "")
                        setStopId("")
                      }}
                    >
                      <SelectTrigger
                        aria-label="Route direction"
                        className="w-full"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="live-console">
                        {data.routes.map((row) => (
                          <SelectItem
                            key={String(row.route_id)}
                            value={String(row.route_id)}
                          >
                            Direction {row.direction} · {row.service_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
                  <div className="rounded-xl border bg-muted/30 p-3">
                    {positions.length ? (
                      <svg
                        viewBox="0 0 680 360"
                        role="img"
                        aria-label={`Stop coordinate plot for service ${selectedService}, direction ${route?.direction}`}
                        className="w-full"
                      >
                        <path
                          d={positions
                            .map(
                              (row, i) =>
                                `${i ? "L" : "M"}${point(row).join(",")}`
                            )
                            .join(" ")}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="text-primary/40"
                        />
                        {positions.map((row) => (
                          <circle
                            key={String(row.stop_order)}
                            cx={point(row)[0]}
                            cy={point(row)[1]}
                            r={row.stop_id === stopId ? 8 : 4}
                            fill="currentColor"
                            className={
                              row.stop_id === stopId
                                ? "text-destructive"
                                : "text-primary"
                            }
                          >
                            <title>
                              {row.stop_order}. {row.description} ({row.stop_id}
                              )
                            </title>
                          </circle>
                        ))}
                        <text x="625" y="28" fontSize="12" fill="currentColor">
                          N ↑
                        </text>
                      </svg>
                    ) : (
                      <p className="p-8 text-sm text-muted-foreground">
                        Select a service with route records to view its stops.
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Connected stop coordinates · No road geometry or live bus
                      positions inferred.
                    </p>
                    {selectedStop && (
                      <div className="mt-3 border-t pt-3 text-sm">
                        <p className="font-semibold">
                          {selectedStop.description}
                        </p>
                        <p className="text-muted-foreground">
                          {selectedStop.stop_id} · {selectedStop.road_name} ·{" "}
                          {selectedStop.distance_km} km from origin
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto rounded-xl border">
                    {stops.map((row) => (
                      <Button
                        key={String(row.stop_order)}
                        variant={row.stop_id === stopId ? "secondary" : "ghost"}
                        onClick={() => setStopId(String(row.stop_id))}
                        className="h-auto w-full justify-start rounded-none border-b px-3 py-3 text-left whitespace-normal"
                      >
                        <MapPin className="shrink-0" />
                        <span>
                          <span className="block text-sm">
                            {row.stop_order}. {row.description}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {row.stop_id} · {row.distance_km} km
                          </span>
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-medium">
                  {vehicle
                    ? `Assessment vehicle · ${vehicle}`
                    : "No vehicle identified in this assessment"}
                </p>
                <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
                  <div>
                    <BusModel
                      partIds={areas}
                      vehicleId={vehicle}
                      service={String(fleet?.assigned_service_no ?? "network")}
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      LionLink double-deck model ·{" "}
                      {fleet?.vehicle_type === "SD"
                        ? "Schematic differs from this single-deck vehicle."
                        : "Illustrative component locations."}{" "}
                      Agent highlights are visual aids, not a diagnosis.
                    </p>
                    {areas.length ? (
                      areas.map((id) => (
                        <p key={id} className="mt-2 text-sm">
                          <strong>{PARTS[id]!.label}</strong> ·{" "}
                          {PARTS[id]!.note}
                        </p>
                      ))
                    ) : (
                      <p className="mt-2 text-sm text-muted-foreground">
                        No agent-identified repair area for this vehicle in the
                        selected assessment.
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold">
                      Workshop records · {vehicle}
                    </h3>
                    {!repairs.length && (
                      <p className="rounded-lg border p-4 text-sm text-muted-foreground">
                        No admitted workshop record for this vehicle. This does
                        not establish that it is defect-free.
                      </p>
                    )}
                    {repairs.map((row) => (
                      <article
                        key={String(row.work_order_id)}
                        className="rounded-xl border p-4"
                      >
                        <Badge variant="outline">{row.work_status}</Badge>
                        <h4 className="mt-3 font-semibold">
                          {row.fault_summary}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {row.work_order_id} · {row.facility_id}
                        </p>
                        <p className="mt-3 text-sm">
                          Release: <strong>{row.release_status}</strong>
                        </p>
                        <p className="mt-1 text-xs">
                          Expected completion:{" "}
                          {row.expected_completion_at ?? "Unknown"}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {row.workshop_note}
                        </p>
                        <p className="mt-3 font-mono text-[10px] text-muted-foreground">
                          {row.evidenceId}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              </>
            )}
            <p className="border-t pt-3 text-xs text-muted-foreground">
              Evidence cutoff:{" "}
              {new Date(data.asOf).toLocaleString("en-SG", {
                timeZone: "Asia/Singapore",
              })}{" "}
              SGT · Estimates never release a held vehicle.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
