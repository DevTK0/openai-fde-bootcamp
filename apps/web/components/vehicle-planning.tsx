"use client"
import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@workspace/ui/components/sheet"
import { useDashboard } from "./dashboard-provider"
import { Pick } from "./report-ui"
import { AssignmentTimeline } from "./assignment-timeline"
import {
  vehiclePlanningSchema,
  vehicleRows,
  type VehiclePlanningData,
  type VehicleRow,
} from "@/lib/vehicle-planning"
import { crewClock, timedTrip } from "@/lib/crew-planning"
import { planningTime } from "@/lib/service-planning"

type Result =
  | { key: string; kind: "ready"; data: VehiclePlanningData }
  | { key: string; kind: "error" }
export function VehiclePlanning() {
  const { operationsManifest } = useDashboard()
  const [date, setDate] = useState(operationsManifest.dates.at(-1) ?? "")
  const [service, setService] = useState("all")
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const key = `${date}/${attempt}`
  useEffect(() => {
    if (!date) return
    const controller = new AbortController()
    fetch(`/api/vehicle-planning?${new URLSearchParams({ date })}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Load failed")
        return vehiclePlanningSchema.parse(await response.json())
      })
      .then((data) => {
        if (!controller.signal.aborted) setResult({ key, kind: "ready", data })
      })
      .catch(() => {
        if (!controller.signal.aborted) setResult({ key, kind: "error" })
      })
    return () => controller.abort()
  }, [date, key])
  const current = result?.key === key ? result : null
  return (
    <section aria-label="Vehicle planning" className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Pick
          label="Vehicle planning date"
          value={date}
          onChange={setDate}
          options={operationsManifest.dates.map((value) => ({
            value,
            label: value,
          }))}
        />
        <Pick
          label="Vehicle service"
          value={service}
          onChange={setService}
          options={[
            { value: "all", label: "All services" },
            ...operationsManifest.services.map((value) => ({
              value,
              label: `Service ${value}`,
            })),
          ]}
        />
        <Button
          variant="outline"
          size="icon"
          aria-label="Refresh vehicle planning"
          onClick={() => setAttempt((a) => a + 1)}
        >
          <RefreshCw />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Planned trips + supplied engineering records · SGT · Gaps do not confirm
        availability
      </p>
      {!date ? (
        <p>No operating dates available.</p>
      ) : current?.kind === "error" ? (
        <p role="alert">
          Vehicle planning could not be loaded. Use refresh to retry.
        </p>
      ) : current?.kind === "ready" ? (
        <VehicleTimeline
          key={`${key}/${service}`}
          data={current.data}
          date={date}
          service={service}
        />
      ) : (
        <p role="status">Loading vehicle assignments…</p>
      )}
    </section>
  )
}
function VehicleTimeline({
  data,
  date,
  service,
}: {
  data: VehiclePlanningData
  date: string
  service: string
}) {
  const day = planningTime(date, "00:00")
  const allRows = useMemo(
    () => vehicleRows(data, day, day + 86400),
    [data, day]
  )
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<{
    vehicle: string | null
    tripId: string | null
  } | null>(null)
  const rows = allRows.filter(
    (r) =>
      (service === "all" ||
        r.record?.service === service ||
        r.assignments.some((a) => a.trip.service === service)) &&
      (r.vehicle ?? "Unassigned").toLowerCase().includes(search.toLowerCase())
  )
  const times = [
    ...data.trips.flatMap((t) =>
      timedTrip(t) ? [t.departure, t.arrival] : []
    ),
    ...data.readiness.flatMap((r) => [r.start, r.end]),
    ...allRows.flatMap((r) =>
      r.holds.flatMap((h) => [
        h.start,
        h.end ?? (h.start !== null && h.start >= day ? day + 86400 : null),
      ])
    ),
  ].filter((t): t is number => t !== null && t >= day && t <= day + 86400)
  const start = times.length
    ? Math.floor(Math.min(...times) / 3600) * 3600
    : day
  const end = Math.max(
    start + 3600,
    times.length ? Math.ceil(Math.max(...times) / 3600) * 3600 : day + 86400
  )
  const row = selected
    ? allRows.find((r) => r.vehicle === selected.vehicle)
    : undefined
  const assignment = row?.assignments.find(
    (a) => a.trip.id === selected?.tripId
  )
  const conflicts = rows.reduce(
    (n, r) => n + r.assignments.filter((a) => a.conflicts.length).length,
    0
  )
  const openVehicle = (r: VehicleRow, tripId: string | null = null) =>
    setSelected({ vehicle: r.vehicle, tripId })
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          aria-label="Search vehicle"
          placeholder="Search vehicle ID"
          className="max-w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(0)
          }}
        />
        <div className="flex gap-2">
          <Badge variant="outline">{rows.length} vehicle rows</Badge>
          <Badge variant={conflicts ? "destructive" : "outline"}>
            {conflicts} conflicting assignments
          </Badge>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span>Colored: planned trips</span>
        <span>Gray: recorded readiness</span>
        <span>Red hatch: maintenance hold</span>
        <span>Red outline: timing conflict</span>
        <span>Amber dot: evidence gap</span>
      </div>
      {service !== "all" && (
        <p className="text-xs text-muted-foreground">
          Other services assigned to these buses remain visible in muted colors.
        </p>
      )}
      <AssignmentTimeline
        label="Vehicle"
        start={start}
        end={end}
        rows={rows.slice(page * 25, (page + 1) * 25).map((r) => ({
          key: r.vehicle ?? "unassigned",
          label: r.vehicle ?? "Unassigned",
          onSelect: () => openVehicle(r),
          summary: `${r.assignments.length} trips · ${r.record?.scope ?? "Unregistered"}`,
          lanes: r.lanes,
          bands: [
            ...r.readiness.map((v) => ({
              key: v.id,
              start: v.start,
              end: v.end,
              kind: "window" as const,
              label: `Readiness ${v.id}, ${v.state}, ${crewClock(v.start)} to ${crewClock(v.end)}`,
              onSelect: () => openVehicle(r),
            })),
            ...r.holds.map((h) => ({
              key: `${h.source}/${h.id}`,
              start: h.start,
              end: h.end ?? end,
              kind: "hold" as const,
              label: `Maintenance hold ${h.id}${h.end === null ? ", no confirmed release" : ""}`,
              onSelect: () => openVehicle(r),
            })),
          ],
          blocks: r.assignments.map((a) => ({
            key: a.trip.id,
            start: a.trip.departure,
            end: a.trip.arrival,
            service: a.trip.service,
            secondary: a.trip.crew ?? "Unassigned crew",
            lane: a.lane,
            conflict: a.conflicts.length > 0,
            unverified: a.unverified.length > 0,
            muted: service !== "all" && service !== a.trip.service,
            onSelect: () => openVehicle(r, a.trip.id),
          })),
        }))}
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {rows.length ? page * 25 + 1 : 0}–
          {Math.min((page + 1) * 25, rows.length)} of {rows.length} vehicles
        </span>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            aria-label="Previous vehicles"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            size="icon"
            variant="outline"
            aria-label="Next vehicles"
            disabled={(page + 1) * 25 >= rows.length}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <Sheet
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      >
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{row?.vehicle ?? "Unassigned vehicle"}</SheetTitle>
            <SheetDescription>
              {date} · Planned assignments and recorded engineering evidence
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-5 px-4 pb-6">
            {assignment && (
              <>
                <dl className="grid grid-cols-[6rem_1fr] gap-2 text-sm">
                  <dt>Service</dt>
                  <dd>{assignment.trip.service}</dd>
                  <dt>Crew</dt>
                  <dd>{assignment.trip.crew ?? "Unassigned"}</dd>
                  <dt>Scheduled</dt>
                  <dd>
                    {crewClock(assignment.trip.departure)}–
                    {crewClock(assignment.trip.arrival)}
                  </dd>
                  <dt>Route</dt>
                  <dd>{assignment.trip.route}</dd>
                  <dt>From</dt>
                  <dd>
                    {assignment.trip.originName} ({assignment.trip.origin})
                  </dd>
                  <dt>To</dt>
                  <dd>
                    {assignment.trip.destinationName} (
                    {assignment.trip.destination})
                  </dd>
                  <dt>Trip record</dt>
                  <dd className="break-all">{assignment.trip.id}</dd>
                </dl>
                {!!assignment.conflicts.length && (
                  <div className="space-y-2 rounded-lg border border-red-500 p-3">
                    <h3 className="font-medium">Timing conflicts</h3>
                    {assignment.conflicts.map((c) => (
                      <p key={c} className="text-sm">
                        {c}
                      </p>
                    ))}
                  </div>
                )}
                {!!assignment.unverified.length && (
                  <div className="space-y-2 rounded-lg border border-amber-500/60 p-3">
                    <h3 className="font-medium">Unverified evidence</h3>
                    {assignment.unverified.map((c) => (
                      <p key={c} className="text-sm">
                        {c}
                      </p>
                    ))}
                  </div>
                )}
              </>
            )}
            <p className="text-xs text-muted-foreground">
              Readiness does not confirm turnaround, positioning or crew
              feasibility. Hold coverage is incomplete; gaps are not release
              evidence.
            </p>
            <h3 className="font-medium">Readiness records</h3>
            {row?.readiness.length ? (
              row.readiness.map((r) => (
                <div
                  key={r.id}
                  className="space-y-1 rounded-lg border p-3 text-sm"
                >
                  <p className="font-medium">
                    {r.id} · {r.state}
                  </p>
                  <p>
                    {crewClock(r.start)}–{crewClock(r.end)}
                  </p>
                  <p>Location: {r.location ?? "Unknown"}</p>
                  <p>Issued: {fullTime(r.issued)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No readiness evidence supplied.
              </p>
            )}
            <h3 className="font-medium">Maintenance holds</h3>
            {row?.holds.length ? (
              row.holds.map((h) => (
                <div
                  key={`${h.source}/${h.id}`}
                  className="space-y-1 rounded-lg border p-3 text-sm"
                >
                  <p className="font-medium">{h.id}</p>
                  <p>Opened: {fullTime(h.start)}</p>
                  <p>
                    Confirmed release:{" "}
                    {h.end === null
                      ? "Not recorded; hold remains open"
                      : fullTime(h.end)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Source: {h.source}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No hold records in the supplied evidence for this date.
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
function fullTime(at: number | null) {
  return at === null
    ? "Unknown"
    : new Date(at * 1000 + 8 * 3600 * 1000)
        .toISOString()
        .slice(0, 16)
        .replace("T", " ")
}
