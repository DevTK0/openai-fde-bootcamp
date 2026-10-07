"use client"

import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@workspace/ui/components/sheet"
import { Pick } from "./report-ui"
import { useDashboard } from "./dashboard-provider"
import { serviceColor } from "./service-replay/service-color"
import {
  crewPlanningSchema,
  crewRows,
  crewClock,
  timedTrip,
  type CrewPlanningData,
  type CrewRow,
} from "@/lib/crew-planning"
import { planningTime } from "@/lib/service-planning"

type Result =
  | { key: string; kind: "ready"; data: CrewPlanningData }
  | { key: string; kind: "error" }
type Selection =
  { kind: "trip"; id: string } | { kind: "duty"; id: string } | null

export function CrewPlanning() {
  const { operationsManifest } = useDashboard()
  const [date, setDate] = useState(operationsManifest.dates.at(-1) ?? "")
  const [service, setService] = useState("all")
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const key = `${date}/${attempt}`
  useEffect(() => {
    if (!date) return
    const controller = new AbortController()
    fetch(`/api/crew-planning?${new URLSearchParams({ date })}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to load crew planning")
        return crewPlanningSchema.parse(await response.json())
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Pick
          label="Crew planning date"
          value={date}
          onChange={setDate}
          options={operationsManifest.dates.map((value) => ({
            value,
            label: value,
          }))}
        />
        <Pick
          label="Crew service"
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
          size="icon"
          variant="outline"
          aria-label="Refresh crew planning"
          onClick={() => setAttempt((a) => a + 1)}
        >
          <RefreshCw />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Supplied exercise assignments · SGT · Gaps do not confirm availability
      </p>
      {!date ? (
        <p>No operating dates are available.</p>
      ) : current?.kind === "error" ? (
        <p role="alert">
          Crew planning could not be loaded. Use refresh to retry.
        </p>
      ) : current?.kind === "ready" ? (
        <CrewTimeline
          key={`${key}/${service}`}
          data={current.data}
          date={date}
          service={service}
        />
      ) : (
        <p role="status">Loading crew assignments…</p>
      )}
    </div>
  )
}

function CrewTimeline({
  data,
  date,
  service,
}: {
  data: CrewPlanningData
  date: string
  service: string
}) {
  const allRows = useMemo(() => crewRows(data), [data])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)
  const [selection, setSelection] = useState<Selection>(null)
  const rows = allRows.filter(
    (row) =>
      (service === "all" ||
        row.assignments.some((a) => a.trip.service === service) ||
        row.duties.some((d) => d.service === service)) &&
      (row.crew ?? "Unassigned").toLowerCase().includes(search.toLowerCase())
  )
  const visible = rows.slice(page * 25, (page + 1) * 25)
  const times = [
    ...data.trips.flatMap((t) =>
      timedTrip(t) ? [t.departure, t.arrival] : []
    ),
    ...data.duties.flatMap((d) =>
      [d.start, d.end, d.breakStart, d.breakEnd].filter(
        (t): t is number => t !== null
      )
    ),
  ]
  const start =
    Math.floor(
      (times.length ? Math.min(...times) : planningTime(date, "06:00")) / 3600
    ) * 3600
  const end = Math.max(
    start + 3600,
    Math.ceil((times.length ? Math.max(...times) : start + 6 * 3600) / 3600) *
      3600
  )
  const ticks = Array.from(
    { length: Math.round((end - start) / 3600) + 1 },
    (_, i) => start + i * 3600
  )
  const position = (from: number, to: number) => ({
    left: `${(100 * (from - start)) / (end - start)}%`,
    width: `${(100 * (to - from)) / (end - start)}%`,
  })
  const selectedTrip =
    selection?.kind === "trip"
      ? allRows
          .flatMap((r) => r.assignments)
          .find((a) => a.trip.id === selection.id)
      : undefined
  const selectedDuty =
    selection?.kind === "duty"
      ? data.duties.find((d) => d.id === selection.id)
      : undefined
  const selectedRow = selectedTrip
    ? allRows.find((r) => r.crew === selectedTrip.trip.crew)
    : undefined
  const conflicts = rows.reduce(
    (n, row) => n + row.assignments.filter((a) => a.conflicts.length).length,
    0
  )
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          aria-label="Search crew"
          placeholder="Search crew ID"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(0)
          }}
          className="max-w-64"
        />
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="outline">{rows.length} crew rows</Badge>
          <Badge variant={conflicts ? "destructive" : "outline"}>
            {conflicts} conflicting assignments
          </Badge>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span>Colored blocks: planned trips</span>
        <span>Gray: duty window</span>
        <span>Hatched: protected breaks</span>
        <span>Red outline: timing conflict</span>
        <span>Amber dot: evidence gap</span>
      </div>
      {service !== "all" && (
        <p className="text-xs text-muted-foreground">
          Other services for these crews remain visible in muted colors.
        </p>
      )}
      <Card className="overflow-hidden py-0">
        <CardContent className="p-0">
          <div
            className="max-h-160 overflow-auto"
            role="region"
            aria-label="Crew assignment timeline"
            tabIndex={0}
          >
            <div className="min-w-400">
              <div className="sticky top-0 z-20 grid grid-cols-[10rem_1fr] border-b bg-card">
                <div className="sticky left-0 z-30 bg-card px-4 py-3 text-xs font-medium">
                  Crew
                </div>
                <div className="relative mr-5 h-10">
                  {ticks.map((t) => (
                    <span
                      key={t}
                      className="absolute top-3 -translate-x-1/2 text-[10px] text-muted-foreground tabular-nums first:translate-x-0 last:-translate-x-full"
                      style={{
                        left: `${(100 * (t - start)) / (end - start)}%`,
                      }}
                    >
                      {crewClock(t)}
                    </span>
                  ))}
                </div>
              </div>
              {visible.map((row) => {
                const height = 36 * row.lanes + 36
                const incomplete = row.assignments.filter(
                  (a) => !timedTrip(a.trip)
                )
                return (
                  <div
                    key={row.crew ?? "unassigned"}
                    className="grid grid-cols-[10rem_1fr] border-b last:border-0"
                    role="group"
                    aria-label={`Crew ${row.crew ?? "unassigned"}`}
                  >
                    <div className="sticky left-0 z-10 bg-card px-4 py-3">
                      <p className="text-sm font-medium">
                        {row.crew ?? "Unassigned"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {row.assignments.length}{" "}
                        {row.assignments.length === 1 ? "trip" : "trips"} ·{" "}
                        {row.duties.length}{" "}
                        {row.duties.length === 1 ? "duty" : "duties"}
                      </p>
                    </div>
                    <div className="mr-5">
                      <div className="relative" style={{ height }}>
                        {ticks.map((t) => (
                          <div
                            key={t}
                            className="pointer-events-none absolute inset-y-0 border-l border-border/50"
                            style={{
                              left: `${(100 * (t - start)) / (end - start)}%`,
                            }}
                          />
                        ))}
                        {row.duties.map(
                          (d) =>
                            d.start !== null &&
                            d.end !== null &&
                            d.end > d.start && (
                              <Button
                                key={d.id}
                                variant="ghost"
                                className="absolute top-1 h-5 min-w-0 rounded-sm bg-muted p-0 hover:bg-muted-foreground/30"
                                style={position(d.start, d.end)}
                                aria-label={`Duty ${d.id}, ${crewClock(d.start)} to ${crewClock(d.end)}`}
                                title={`Duty ${d.id}`}
                                onClick={() =>
                                  setSelection({ kind: "duty", id: d.id })
                                }
                              />
                            )
                        )}
                        {row.assignments.map(
                          (a) =>
                            timedTrip(a.trip) && (
                              <Button
                                key={a.trip.id}
                                variant="outline"
                                className={`absolute h-8 min-w-0 flex-col items-start justify-center gap-0 overflow-hidden rounded-md px-1 text-[10px] leading-tight text-slate-950 ${a.conflicts.length ? "ring-2 ring-red-500 ring-offset-1 ring-offset-background" : ""}`}
                                style={{
                                  ...position(a.trip.departure, a.trip.arrival),
                                  top: 28 + 36 * a.lane,
                                  backgroundColor: serviceColor(a.trip.service),
                                  opacity:
                                    service === "all" ||
                                    a.trip.service === service
                                      ? 1
                                      : 0.4,
                                }}
                                aria-label={`Trip ${a.trip.id}, service ${a.trip.service}, ${crewClock(a.trip.departure)} to ${crewClock(a.trip.arrival)}${a.conflicts.length ? ", timing conflict" : ""}`}
                                title={`${a.trip.service} · ${a.trip.vehicle ?? "Unassigned bus"} · ${crewClock(a.trip.departure)}–${crewClock(a.trip.arrival)}`}
                                onClick={() =>
                                  setSelection({ kind: "trip", id: a.trip.id })
                                }
                              >
                                <span className="flex items-center gap-1 font-semibold">
                                  {a.unverified.length > 0 && (
                                    <span className="size-1.5 shrink-0 rounded-full bg-amber-800" />
                                  )}
                                  {a.conflicts.length > 0 && (
                                    <AlertTriangle className="size-3 shrink-0" />
                                  )}
                                  {a.trip.service}
                                </span>
                                <span className="max-w-full truncate text-[9px]">
                                  {a.trip.vehicle ?? "Unassigned"}
                                </span>
                              </Button>
                            )
                        )}
                        {row.duties.map(
                          (d) =>
                            d.breakStart !== null &&
                            d.breakEnd !== null &&
                            d.breakEnd > d.breakStart && (
                              <Button
                                key={`break:${d.id}`}
                                variant="outline"
                                className="absolute top-1 h-5 min-w-0 overflow-hidden rounded-sm border-muted-foreground/50 bg-[repeating-linear-gradient(135deg,transparent,transparent_4px,var(--border)_4px,var(--border)_7px)] p-0 text-[10px]"
                                style={position(d.breakStart, d.breakEnd)}
                                aria-label={`Protected break ${d.id}, ${crewClock(d.breakStart)} to ${crewClock(d.breakEnd)}`}
                                onClick={() =>
                                  setSelection({ kind: "duty", id: d.id })
                                }
                              >
                                Break
                              </Button>
                            )
                        )}
                      </div>
                      {incomplete.length > 0 && (
                        <div className="flex flex-wrap gap-2 py-2">
                          {incomplete.map((a) => (
                            <Button
                              key={a.trip.id}
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setSelection({ kind: "trip", id: a.trip.id })
                              }
                            >
                              {a.trip.service} · Time unverified
                            </Button>
                          ))}
                        </div>
                      )}
                      {!row.assignments.length && !row.duties.length && (
                        <p className="text-xs text-muted-foreground">
                          No supplied assignments
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
              {!rows.length && (
                <p className="p-6 text-sm text-muted-foreground">
                  No matching crew assignments.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {rows.length ? page * 25 + 1 : 0}–
          {Math.min((page + 1) * 25, rows.length)} of {rows.length} crews
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous crews"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next crews"
            disabled={(page + 1) * 25 >= rows.length}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <Sheet
        open={selection !== null}
        onOpenChange={(open) => {
          if (!open) setSelection(null)
        }}
      >
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              {selectedTrip
                ? `Service ${selectedTrip.trip.service} assignment`
                : "Duty and break"}
            </SheetTitle>
            <SheetDescription>
              {date} · Singapore time · Supplied records
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-5 px-4 pb-6">
            {selectedTrip && (
              <>
                <dl className="grid grid-cols-[7rem_1fr] gap-2 text-sm">
                  <dt className="text-muted-foreground">Crew</dt>
                  <dd>{selectedTrip.trip.crew ?? "Unassigned"}</dd>
                  <dt className="text-muted-foreground">Bus</dt>
                  <dd>{selectedTrip.trip.vehicle ?? "Unassigned"}</dd>
                  <dt className="text-muted-foreground">Scheduled</dt>
                  <dd>
                    {crewClock(selectedTrip.trip.departure)}–
                    {crewClock(selectedTrip.trip.arrival)}
                  </dd>
                  <dt className="text-muted-foreground">Route</dt>
                  <dd>{selectedTrip.trip.route}</dd>
                  <dt className="text-muted-foreground">From</dt>
                  <dd>
                    {selectedTrip.trip.originName} ({selectedTrip.trip.origin})
                  </dd>
                  <dt className="text-muted-foreground">To</dt>
                  <dd>
                    {selectedTrip.trip.destinationName} (
                    {selectedTrip.trip.destination})
                  </dd>
                  <dt className="text-muted-foreground">Trip record</dt>
                  <dd className="break-all">{selectedTrip.trip.id}</dd>
                </dl>
                {selectedTrip.conflicts.length > 0 && (
                  <div className="space-y-2 rounded-lg border border-red-500 p-3">
                    <p className="font-medium">Timing conflicts</p>
                    {selectedTrip.conflicts.map((issue) => (
                      <p className="text-sm" key={issue}>
                        {issue}
                      </p>
                    ))}
                  </div>
                )}
                {selectedTrip.unverified.length > 0 && (
                  <div className="space-y-2 rounded-lg border border-amber-500/60 p-3">
                    <p className="font-medium">Unverified evidence</p>
                    {selectedTrip.unverified.map((issue) => (
                      <p className="text-sm" key={issue}>
                        {issue}
                      </p>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Location transfers and continuous-duty limits require review.
                  No availability or assignment approval is implied.
                </p>
                <h3 className="font-medium">Supplied duty records</h3>
                {selectedRow?.duties.length ? (
                  selectedRow.duties.map((d) => (
                    <DutyDetails key={d.id} duty={d} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No crew duty evidence supplied.
                  </p>
                )}
              </>
            )}
            {selectedDuty && <DutyDetails duty={selectedDuty} />}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

function DutyDetails({ duty }: { duty: CrewRow["duties"][number] }) {
  return (
    <div className="space-y-2 rounded-lg border p-3 text-sm">
      <p className="font-medium">
        {duty.id} · {duty.crew}
      </p>
      <p>
        Duty window: {crewClock(duty.start)}–{crewClock(duty.end)}
      </p>
      <p>
        Protected break: {crewClock(duty.breakStart)}–{crewClock(duty.breakEnd)}
      </p>
      <p>Qualified service: {duty.service}</p>
      <p>Start location: {duty.locationName ?? duty.location ?? "Unknown"}</p>
      <p>
        Continuous duty limit:{" "}
        {duty.maximum === null ? "Unknown" : `${duty.maximum} min`}
      </p>
      <p className="text-xs text-muted-foreground">
        {duty.basis ?? "No supporting basis supplied"}
      </p>
    </div>
  )
}
