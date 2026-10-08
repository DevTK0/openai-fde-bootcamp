"use client"

import { useState } from "react"
import {
  AssignmentTimeline,
  type AssignmentTimelineRow,
} from "@/components/assignment-timeline"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import type { PlanningReport } from "@/lib/planning-schema"

type Calendar = PlanningReport["recommendations"][number]["calendars"][number]
type Task = Calendar["tasks"][number]
const time = (value: string) => new Date(value).getTime() / 1000
const clock = (value: string, precise = false) =>
  new Date(value).toLocaleTimeString("en-SG", {
    timeZone: "Asia/Singapore",
    hour: "2-digit",
    minute: "2-digit",
    second: precise ? "2-digit" : undefined,
    hour12: false,
  })
const sortTasks = (tasks: Task[]) =>
  [...tasks].sort(
    (a, b) =>
      (a.departure ?? "").localeCompare(b.departure ?? "") ||
      a.trip.localeCompare(b.trip)
  )

export function PlanningPlanTimeline({
  calendars,
  original,
  decisionAt,
}: {
  calendars: Calendar[]
  original: PlanningReport["affectedTrips"]
  decisionAt: string
}) {
  const originals = new Map(original.map((row) => [row.trip, row]))
  const changed = (task: Task) => {
    const before = originals.get(task.trip)
    return !!before && (before.bus !== task.bus || before.crew !== task.crew)
  }
  const allTasks = sortTasks([
    ...new Map(
      calendars.flatMap((c) => c.tasks).map((t) => [t.trip, t])
    ).values(),
  ])
  const changes = allTasks.filter(changed)
  const [selected, setSelected] = useState(
    changes[0]?.trip ?? allTasks[0]?.trip
  )
  const [showAll, setShowAll] = useState(false)
  if (!calendars.length) return null
  const task = allTasks.find((t) => t.trip === selected)
  const before = task ? originals.get(task.trip) : undefined
  const visible = calendars.filter(
    (c) =>
      showAll ||
      !changes.length ||
      c.tasks.some(changed) ||
      (c.kind === "bus"
        ? c.resourceId === task?.bus
        : c.resourceId === task?.crew)
  )
  const visibleTasks = sortTasks([
    ...new Map(
      visible.flatMap((c) => c.tasks).map((t) => [t.trip, t])
    ).values(),
  ])
  const routes = [...new Set(visibleTasks.map((t) => t.route))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  )
  const timings = [
    decisionAt,
    ...visible.flatMap((c) => [
      c.availableFrom,
      c.availableUntil,
      c.break?.start,
      c.break?.end,
    ]),
    ...visibleTasks.flatMap((t) => [
      t.preparation,
      t.departure,
      t.alightingUntil,
      t.arrival,
    ]),
  ]
    .filter((v): v is string => !!v)
    .map(time)
    .filter(Number.isFinite)
  const start = Math.floor(Math.min(...timings) / 3600) * 3600
  const end = Math.max(
    start + 3600,
    Math.ceil(Math.max(...timings) / 3600) * 3600
  )
  const makeRow = (
    key: string,
    label: string,
    tasks: Task[],
    calendar?: Calendar
  ): AssignmentTimelineRow => {
    const laneEnds: number[] = []
    const blocks = sortTasks(tasks).map((t) => {
      const departure = t.departure ? time(t.departure) : null
      const finish = t.arrival ? time(t.alightingUntil ?? t.arrival) : null
      const preparation = calendar && t.preparation ? time(t.preparation) : null
      const beginning = preparation ?? departure
      let lane = 0
      if (beginning !== null && finish !== null) {
        lane = laneEnds.findIndex((v) => v <= beginning)
        if (lane < 0) lane = laneEnds.length
        laneEnds[lane] = finish
      }
      return {
        key: t.trip,
        start: departure,
        end: finish,
        preparationStart: preparation,
        service: t.route,
        lane,
        secondary: `${changed(t) ? "Reassigned" : "Existing"} · ${calendar?.kind === "crew" ? t.bus : t.crew}`,
        planStatus: changed(t)
          ? ("recommended" as const)
          : ("existing" as const),
        annotation: changed(t) ? "Reassigned trip" : "Existing duty",
        selected: t.trip === selected,
        muted: !changed(t) && t.trip !== selected,
        conflict: false,
        unverified: !t.preparation || !t.alightingUntil,
        onSelect: () => setSelected(t.trip),
      }
    })
    return {
      key,
      label,
      lanes: Math.max(1, laneEnds.length),
      blocks,
      summary: calendar
        ? `${tasks.length} duties · ${tasks.filter(changed).length} changed`
        : `${tasks.length} shown trips`,
      bands: calendar
        ? [
            {
              key: "availability",
              kind: "window",
              start: time(calendar.availableFrom),
              end: time(calendar.availableUntil),
              label: `${label} available ${clock(calendar.availableFrom)} to ${clock(calendar.availableUntil)}`,
            },
            ...(calendar.break
              ? [
                  {
                    key: "break",
                    kind: "break" as const,
                    start: time(calendar.break.start),
                    end: time(calendar.break.end),
                    label: `${label} protected break ${clock(calendar.break.start)} to ${clock(calendar.break.end)}`,
                  },
                ]
              : []),
          ]
        : [],
    }
  }
  const rows = [
    ...routes.map((route) =>
      makeRow(
        `route:${route}`,
        `Route ${route}`,
        visibleTasks.filter((t) => t.route === route)
      )
    ),
    ...[...visible]
      .sort(
        (a, b) =>
          Number(a.kind === "crew") - Number(b.kind === "crew") ||
          a.resourceId.localeCompare(b.resourceId)
      )
      .map((c) =>
        makeRow(
          `${c.kind}:${c.resourceId}`,
          `${c.kind === "crew" ? "Crew" : "Bus"} ${c.resourceId}`,
          c.tasks,
          c
        )
      ),
  ]
  const visibleAffected = visibleTasks.filter((t) =>
    originals.has(t.trip)
  ).length
  const missingTimes = visibleTasks.filter(
    (t) => !t.departure || !t.arrival || !t.preparation || !t.alightingUntil
  ).length
  return (
    <section
      aria-label="Coordinated plan timeline"
      className="space-y-4 rounded-lg border p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">How this plan fits together</h3>
          <p className="text-sm text-muted-foreground">
            Select a trip to highlight its route, bus and crew together. All
            times are Singapore time.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          aria-pressed={showAll}
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? "Focus on changed assignments" : "Show full plan"}
        </Button>
      </div>
      <p className="text-sm">
        {showAll || !changes.length
          ? "All supplied resource schedules."
          : "Schedules involved in changed assignments, with their earlier and later duties."}{" "}
        {visibleAffected} of {original.length} affected trips visible ·{" "}
        {visible.filter((c) => c.kind === "bus").length} buses ·{" "}
        {visible.filter((c) => c.kind === "crew").length} crew.
      </p>
      <p className="text-xs text-muted-foreground">
        Dashed outlines show preparation; hatched bands show protected breaks.
        Concurrent trips on one route occupy lanes under the same route label.
      </p>
      <div
        aria-label="Timeline legend"
        className="flex flex-wrap gap-4 text-xs"
      >
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-sm bg-violet-600" />
          Recommended reassignment
        </span>
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-sm border bg-muted" />
          Existing duty
        </span>
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-sm border-2 border-foreground" />
          Selected trip across all rows
        </span>
      </div>
      <AssignmentTimeline
        label="Plan"
        rows={rows}
        start={start}
        end={end}
        focusTime={task?.departure ? time(task.departure) : undefined}
        marker={{
          time: time(decisionAt),
          label: `Decision ${clock(decisionAt)}`,
        }}
      />
      <p className="text-xs text-muted-foreground">
        Route rows contain the trips of the displayed resources, not the entire
        service timetable. Trip bars include final alighting. Empty space is a
        timetable gap, not confirmation that another job can fit.
      </p>
      {missingTimes > 0 && (
        <p className="text-sm text-destructive">
          Timing is not established for {missingTimes} duties. Missing intervals
          cannot be shown fully.
        </p>
      )}
      {task && (
        <div
          aria-label="Selected trip details"
          className="space-y-3 rounded-md bg-muted/40 p-3 text-sm"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              {changed(task) ? "Reassigned trip" : "Existing duty"}
            </Badge>
            <strong>Route {task.route}</strong>
            <span className="text-xs text-muted-foreground">{task.trip}</span>
          </div>
          <p>
            {task.departure && task.arrival
              ? `${clock(task.departure)} to ${clock(task.arrival)}`
              : "Departure and arrival are not established"}{" "}
            · {task.origin} to {task.destination}
          </p>
          <p>
            Crew{" "}
            {before && before.crew !== task.crew
              ? `${before.crew} → ${task.crew}`
              : task.crew}{" "}
            · Bus{" "}
            {before && before.bus !== task.bus
              ? `${before.bus} → ${task.bus}`
              : task.bus}
          </p>
          <p>
            Preparation{" "}
            {task.preparation ? clock(task.preparation) : "not established"} ·
            Alighting complete{" "}
            {task.alightingUntil
              ? clock(task.alightingUntil, true)
              : "not established"}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["bus", "crew"] as const).map((kind) => {
              const c = calendars.find(
                (c) => c.kind === kind && c.resourceId === task[kind]
              )
              if (!c)
                return (
                  <p key={kind} className="text-destructive">
                    No complete {kind} calendar is supplied for {task[kind]}.
                    Its other commitments cannot be checked here.
                  </p>
                )
              const sorted = sortTasks(c.tasks)
              const next =
                sorted[sorted.findIndex((t) => t.trip === task.trip) + 1]
              const gap =
                task.alightingUntil && next?.preparation
                  ? time(next.preparation) - time(task.alightingUntil)
                  : null
              return (
                <div key={kind} className="space-y-1 rounded border p-3">
                  <strong>
                    {kind === "bus" ? "Bus" : "Crew"} {c.resourceId}
                  </strong>
                  <p>
                    Available {clock(c.availableFrom)} to{" "}
                    {clock(c.availableUntil)}.
                  </p>
                  <p className="text-muted-foreground">{c.details}</p>
                  {c.break && (
                    <p>
                      Protected break {clock(c.break.start)} to{" "}
                      {clock(c.break.end)}.
                    </p>
                  )}
                  {gap !== null ? (
                    <p
                      className={
                        gap < 0 ? "text-destructive" : "text-muted-foreground"
                      }
                    >
                      {gap < 0 ? "Overlap" : "Gap until next preparation"}:{" "}
                      {Math.floor(Math.abs(gap) / 60)}m{" "}
                      {Math.round(Math.abs(gap) % 60)}s. Check protected breaks
                      within this interval.
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      {next
                        ? "The next duty’s preparation time is not established."
                        : "No later duty is listed in this calendar."}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
