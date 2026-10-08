"use client"
import { useEffect, useRef } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@workspace/ui/components/tooltip"
import { crewClock } from "@/lib/crew-planning"
import { serviceColor } from "./service-replay/service-color"

type Band = {
  key: string
  start: number | null
  end: number | null
  kind: "window" | "break" | "hold"
  label: string
  onSelect?: () => void
}
type Block = {
  key: string
  start: number | null
  end: number | null
  service: string
  secondary: string
  lane: number
  conflict: boolean
  unverified: boolean
  muted: boolean
  preparationStart?: number | null
  selected?: boolean
  annotation?: string
  planStatus?: "recommended" | "existing"
  onSelect: () => void
}
export type AssignmentTimelineRow = {
  key: string
  label: string
  onSelect?: () => void
  summary: string
  lanes: number
  bands: Band[]
  blocks: Block[]
}

export function AssignmentTimeline({
  rows,
  start,
  end,
  label,
  marker,
  focusTime,
}: {
  rows: AssignmentTimelineRow[]
  start: number
  end: number
  label: "Crew" | "Vehicle" | "Plan"
  marker?: { time: number; label: string }
  focusTime?: number
}) {
  const ticks = Array.from(
    { length: Math.round((end - start) / 3600) + 1 },
    (_, i) => start + i * 3600
  )
  const position = (a: number, b: number) => ({
    left: `${(100 * (Math.max(start, a) - start)) / (end - start)}%`,
    width: `${(100 * (Math.min(end, b) - Math.max(start, a))) / (end - start)}%`,
  })
  const width = Math.max(1600, ((end - start) / 3600) * 120 + 160)
  const viewport = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (focusTime === undefined) return
    const focus = () => {
      const element = viewport.current
      if (!element) return
      const point = 160 + ((focusTime - start) / (end - start)) * (width - 180)
      element.scrollLeft = Math.max(0, point - (element.clientWidth + 160) / 2)
    }
    focus()
    window.addEventListener("resize", focus)
    return () => window.removeEventListener("resize", focus)
  }, [focusTime, start, end, width])
  return (
    <Card className="overflow-hidden py-0">
      <CardContent className="p-0">
        <div
          ref={viewport}
          className="max-h-160 overflow-auto"
          role="region"
          aria-label={`${label} assignment timeline`}
          tabIndex={0}
        >
          <div style={{ minWidth: width }}>
            <div className="sticky top-0 z-20 grid grid-cols-[10rem_1fr] border-b bg-card">
              <div className="sticky left-0 z-30 bg-card px-4 py-3 text-xs font-medium">
                {label}
              </div>
              <div className="relative mr-5 h-10">
                {ticks.map((t) => (
                  <span
                    key={t}
                    className="absolute top-3 -translate-x-1/2 text-[10px] text-muted-foreground tabular-nums first:translate-x-0 last:-translate-x-full"
                    style={{ left: `${(100 * (t - start)) / (end - start)}%` }}
                  >
                    {t === end && end - start === 86400
                      ? "24:00"
                      : crewClock(t)}
                  </span>
                ))}
              </div>
            </div>
            {rows.map((row) => (
              <div
                key={row.key}
                role="group"
                aria-label={`${label} ${row.label}`}
                className="grid grid-cols-[10rem_1fr] border-b last:border-0"
              >
                <div className="sticky left-0 z-10 bg-card px-4 py-3">
                  {row.onSelect ? (
                    <Button
                      variant="ghost"
                      className="h-auto p-0 text-sm font-medium"
                      onClick={row.onSelect}
                      aria-label={`Inspect ${label.toLowerCase()} ${row.label}`}
                    >
                      {row.label}
                    </Button>
                  ) : (
                    <p className="text-sm font-medium">{row.label}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{row.summary}</p>
                </div>
                <div className="mr-5">
                  <div
                    className="relative"
                    style={{ height: row.lanes * 36 + 36 }}
                  >
                    {ticks.map((t) => (
                      <div
                        key={t}
                        className="pointer-events-none absolute inset-y-0 border-l border-border/50"
                        style={{
                          left: `${(100 * (t - start)) / (end - start)}%`,
                        }}
                      />
                    ))}
                    {row.bands.map((b) => {
                      if (
                        b.start === null ||
                        b.end === null ||
                        b.end <= b.start ||
                        b.start >= end ||
                        b.end <= start
                      )
                        return null
                      const className = `absolute top-1 flex h-5 min-w-0 items-center justify-center overflow-hidden rounded-sm border p-0 text-[10px] ${b.kind === "window" ? "border-transparent bg-muted" : b.kind === "hold" ? "border-red-400 bg-red-950 bg-[repeating-linear-gradient(135deg,transparent,transparent_4px,#7f1d1d_4px,#7f1d1d_7px)] text-red-100" : "border-muted-foreground/50 bg-[repeating-linear-gradient(135deg,transparent,transparent_4px,var(--border)_4px,var(--border)_7px)]"}`
                      const text =
                        b.kind === "break"
                          ? "Break"
                          : b.kind === "hold"
                            ? "Hold"
                            : ""
                      return b.onSelect ? (
                        <Button
                          key={b.key}
                          variant="outline"
                          className={className}
                          style={position(b.start, b.end)}
                          aria-label={b.label}
                          title={b.label}
                          onClick={b.onSelect}
                        >
                          {text}
                        </Button>
                      ) : (
                        <Tooltip key={b.key}>
                          <TooltipTrigger
                            render={<span role="img" tabIndex={0} />}
                            className={
                              className +
                              " focus-visible:outline-2 focus-visible:outline-ring"
                            }
                            style={position(b.start, b.end)}
                            aria-label={b.label}
                          >
                            {text}
                          </TooltipTrigger>
                          <TooltipContent>{b.label}</TooltipContent>
                        </Tooltip>
                      )
                    })}
                    {row.blocks.map((b) =>
                      b.preparationStart != null &&
                      b.start !== null &&
                      b.preparationStart < b.start &&
                      b.start > start &&
                      b.preparationStart < end ? (
                        <Button
                          key={`prep:${b.key}`}
                          variant="outline"
                          className="absolute h-8 min-w-0 rounded-sm border-dashed border-foreground/60 bg-muted/40 p-0"
                          style={{
                            ...position(b.preparationStart, b.start),
                            top: 28 + b.lane * 36,
                          }}
                          aria-label={`Preparation for trip ${b.key}, ${crewClock(b.preparationStart)} to ${crewClock(b.start)}`}
                          title={`Preparation ${crewClock(b.preparationStart)} to ${crewClock(b.start)}`}
                          onClick={b.onSelect}
                        />
                      ) : null
                    )}
                    {row.blocks.map(
                      (b) =>
                        b.start !== null &&
                        b.end !== null &&
                        b.end > b.start &&
                        b.start < end &&
                        b.end > start && (
                          <Button
                            key={b.key}
                            variant="outline"
                            className={`absolute h-8 min-w-0 flex-col items-start justify-center gap-0 overflow-hidden rounded-md px-1 text-[10px] leading-tight ${b.planStatus === "recommended" ? "border-violet-700 bg-violet-600 text-white hover:bg-violet-700 hover:text-white dark:border-violet-500 dark:bg-violet-600 dark:hover:bg-violet-700" : b.planStatus === "existing" ? "border-border bg-muted text-muted-foreground hover:bg-muted dark:bg-muted dark:hover:bg-muted" : "text-slate-950"} ${b.conflict ? "ring-2 ring-red-500 ring-offset-1 ring-offset-background" : b.selected ? "ring-2 ring-foreground ring-offset-1 ring-offset-background" : ""}`}
                            style={{
                              ...position(b.start, b.end),
                              top: 28 + b.lane * 36,
                              backgroundColor: b.planStatus
                                ? undefined
                                : serviceColor(b.service),
                              opacity: b.planStatus ? 1 : b.muted ? 0.4 : 1,
                            }}
                            aria-label={`Trip ${b.key}, service ${b.service}, ${crewClock(b.start)} to ${crewClock(b.end)}${b.conflict ? ", timing conflict" : ""}${b.annotation ? `, ${b.annotation}` : ""}`}
                            aria-pressed={b.selected}
                            title={`${b.service} · ${b.secondary} · ${crewClock(b.start)}–${crewClock(b.end)}`}
                            onClick={b.onSelect}
                          >
                            <span className="flex items-center gap-1 font-semibold">
                              {b.unverified && (
                                <span className="size-1.5 shrink-0 rounded-full bg-amber-800" />
                              )}
                              {b.conflict && (
                                <AlertTriangle className="size-3 shrink-0" />
                              )}
                              {b.service}
                            </span>
                            <span className="max-w-full truncate text-[9px]">
                              {b.secondary}
                            </span>
                          </Button>
                        )
                    )}
                    {marker && marker.time >= start && marker.time <= end && (
                      <div
                        className="pointer-events-none absolute inset-y-0 z-10 border-l border-dashed border-foreground"
                        style={{
                          left: `${(100 * (marker.time - start)) / (end - start)}%`,
                        }}
                      >
                        <span className="absolute -top-1 left-1 rounded bg-card px-1 text-[10px] whitespace-nowrap text-foreground">
                          {marker.label}
                        </span>
                      </div>
                    )}
                  </div>
                  {row.blocks
                    .filter(
                      (b) =>
                        b.start === null || b.end === null || b.end <= b.start
                    )
                    .map((b) => (
                      <Button
                        key={b.key}
                        size="sm"
                        variant="outline"
                        className={`my-2 mr-2 ${b.planStatus === "recommended" ? "bg-violet-600 text-white hover:bg-violet-700 hover:text-white dark:bg-violet-600 dark:hover:bg-violet-700" : ""}`}
                        aria-label={`Trip ${b.key}, service ${b.service}, time unverified${b.annotation ? `, ${b.annotation}` : ""}`}
                        aria-pressed={b.selected}
                        onClick={b.onSelect}
                      >
                        {b.service} · Time unverified
                      </Button>
                    ))}
                </div>
              </div>
            ))}
            {!rows.length && (
              <p className="p-6 text-sm text-muted-foreground">
                No matching assignments.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
