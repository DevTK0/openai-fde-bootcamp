"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { Pick } from "./report-ui"
import {
  planningTime,
  type PlanningDetail,
  type PlanningSelection,
} from "@/lib/service-planning"

const clock = (at: number) =>
  new Date(at * 1000).toLocaleTimeString("en-GB", {
    timeZone: "Asia/Singapore",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
const count = (value: number | null | undefined) =>
  value == null ? "Unknown" : String(value)

export function QueueObservations({
  detail,
  selection,
  initialService,
}: {
  initialService?: string
  detail: PlanningDetail
  selection: Pick<PlanningSelection, "date" | "start" | "end" | "queue">
}) {
  const [serviceId, setServiceId] = useState(
    initialService ?? detail.routes[0]?.service ?? ""
  )
  const services = [...new Set(detail.routes.map((r) => r.service))]
  const service = services.includes(serviceId) ? serviceId : services[0]
  const routes = detail.routes.filter((r) => r.service === service)
  const [routeId, setRouteId] = useState(detail.routes[0]?.id ?? "")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const route = routes.find((r) => r.id === routeId) ?? routes[0]
  const start = planningTime(selection.date, selection.start)
  const end = planningTime(selection.date, selection.end)
  const positions = detail.positions
    .filter((p) => p.route === route?.id && p.boarding === 1)
    .sort((a, b) => a.order - b.order)
  const calls = detail.calls
    .filter(
      (c) =>
        c.route === route?.id &&
        c.observed !== null &&
        c.observed >= start &&
        c.observed <= end &&
        positions.some((p) => p.order === c.order)
    )
    .sort((a, b) => (a.observed ?? 0) - (b.observed ?? 0))
  const selected = calls.find((c) => c.id === selectedId)
  const stop = positions.find((p) => p.order === selected?.order)
  const maximum = Math.max(1, ...calls.map((c) => c.queue ?? 0))
  const ticks = Array.from(
    { length: 7 },
    (_, i) => start + ((end - start) * i) / 6
  )
  const left = (at: number) => `${(100 * (at - start)) / (end - start)}%`
  return (
    <Card>
      <CardHeader>
        <CardTitle>Queue observations</CardTitle>
        <CardDescription>
          Recorded points only · {selection.date} · SGT. Select a dot for
          passenger and trip details.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Pick
              label="Queue service"
              value={service ?? ""}
              onChange={(value) => {
                setServiceId(value)
                setRouteId("")
                setSelectedId(null)
              }}
              options={services.map((s) => ({
                value: s,
                label: `Service ${s}`,
              }))}
            />
            <Pick
              label="Queue direction"
              value={route?.id ?? ""}
              onChange={(value) => {
                setRouteId(value)
                setSelectedId(null)
              }}
              options={routes.map((r) => ({
                value: r.id,
                label: `Direction ${r.direction}`,
              }))}
            />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span className="text-red-700 dark:text-red-300">
              ● ≥{selection.queue} left behind
            </span>
            <span className="text-teal-700 dark:text-teal-300">
              ● Below threshold · ○ Zero
            </span>
            <span className="text-muted-foreground">
              ? Unknown · No mark: unobserved
            </span>
          </div>
        </div>
        {positions.length ? (
          <div
            role="region"
            aria-label="Queue observations by route position and time"
            tabIndex={0}
            className="max-h-140 overflow-auto rounded-lg border"
          >
            <div className="min-w-240">
              <div className="sticky top-0 z-20 grid grid-cols-[14rem_1fr] border-b bg-card">
                <div className="sticky left-0 z-30 bg-card px-3 py-3 text-xs font-medium">
                  Stop / route position
                </div>
                <div className="relative mx-4 h-10">
                  {ticks.map((t) => (
                    <span
                      key={t}
                      className="absolute top-3 -translate-x-1/2 text-[11px] text-muted-foreground tabular-nums first:translate-x-0 last:-translate-x-full"
                      style={{ left: left(t) }}
                    >
                      {t === end && selection.end === "24:00"
                        ? "24:00"
                        : clock(t).slice(0, 5)}
                    </span>
                  ))}
                </div>
              </div>
              {positions.map((p) => {
                const records = calls.filter((c) => c.order === p.order)
                // The chart's minimum time-axis width is 704px. Keep 28px targets apart.
                const separation = ((end - start) * 28) / 704
                const laneEnds: number[] = []
                const lanes = records.map((c) => {
                  const time = c.observed ?? start
                  const available = laneEnds.findIndex(
                    (last) => time - last >= separation
                  )
                  const lane = available === -1 ? laneEnds.length : available
                  laneEnds[lane] = time
                  return lane
                })
                const height = Math.max(40, laneEnds.length * 28 + 12)
                return (
                  <div
                    key={p.order}
                    role="group"
                    aria-label={`Position ${p.order}: ${p.name}`}
                    className="grid grid-cols-[14rem_1fr] border-b last:border-0"
                  >
                    <div
                      className="sticky left-0 z-10 flex items-center gap-2 bg-card px-3 text-xs"
                      style={{ height }}
                      title={`${p.order}. ${p.name} (${p.stop})`}
                    >
                      <span className="w-5 shrink-0 text-muted-foreground tabular-nums">
                        {p.order}
                      </span>
                      <span className="truncate">{p.name}</span>
                    </div>
                    <div className="relative mx-4" style={{ height }}>
                      {ticks.map((t) => (
                        <span
                          key={t}
                          className="pointer-events-none absolute inset-y-0 border-l border-dashed border-border"
                          style={{ left: left(t) }}
                        />
                      ))}
                      {!records.length && (
                        <span className="absolute inset-y-0 left-3 flex items-center text-xs text-muted-foreground">
                          No observation
                        </span>
                      )}
                      {records.map((c, index) => {
                        if (c.observed === null) return null
                        const label = `${p.name}, position ${p.order}, ${clock(c.observed)}, ${count(c.queue)} left behind${c.queue !== null && c.queue >= selection.queue ? ", threshold met" : ""}, ${c.id}`
                        const diameter =
                          c.queue === null
                            ? 16
                            : c.queue === 0
                              ? 10
                              : Math.sqrt(64 + (420 * c.queue) / maximum)
                        return (
                          <Button
                            key={c.id}
                            variant="ghost"
                            size="icon"
                            aria-label={label}
                            title={label}
                            onClick={() => setSelectedId(c.id)}
                            className="absolute size-7 -translate-x-1/2 -translate-y-1/2 rounded-full p-0 hover:bg-muted/60 focus-visible:z-10"
                            style={{
                              left: left(c.observed),
                              top: 20 + (lanes[index] ?? 0) * 28,
                            }}
                          >
                            <span
                              aria-hidden="true"
                              className={`flex shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-semibold ${c.queue === null ? "border-muted-foreground bg-card text-foreground" : c.queue >= selection.queue ? "border-red-700 bg-red-600 dark:border-red-300 dark:bg-red-400" : c.queue === 0 ? "border-teal-700 bg-card dark:border-teal-300" : "border-teal-700 bg-teal-600 dark:border-teal-300 dark:bg-teal-400"}`}
                              style={{ width: diameter, height: diameter }}
                            >
                              {c.queue === null ? "?" : ""}
                            </span>
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No boarding positions supplied for this route.
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {calls.length} observations ·{" "}
          {new Set(calls.map((c) => c.order)).size}/{positions.length} boarding
          positions observed · Larger dots mean larger queues.
        </p>
      </CardContent>
      <Sheet
        open={selected !== undefined}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null)
        }}
      >
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{stop?.name ?? "Queue observation"}</SheetTitle>
            <SheetDescription>
              {selection.date} · SGT · stop_calls
            </SheetDescription>
          </SheetHeader>
          {selected && (
            <dl className="grid grid-cols-[7rem_1fr] gap-x-4 gap-y-5 px-4 pb-6 text-sm">
              {[
                ["Record", selected.id],
                ["Route", `${selected.route} · Position ${selected.order}`],
                ["Stop code", stop?.stop ?? "Unknown"],
                ["Vehicle", selected.vehicle ?? "Unknown"],
                ["Trip", selected.trip],
                [
                  "Observed",
                  selected.observed === null
                    ? "Unknown"
                    : clock(selected.observed),
                ],
                ["Left behind", count(selected.queue)],
                ["Boarded", count(selected.boarded)],
                ["Alighted", count(selected.alighted)],
              ].map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="break-words">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </SheetContent>
      </Sheet>
    </Card>
  )
}
