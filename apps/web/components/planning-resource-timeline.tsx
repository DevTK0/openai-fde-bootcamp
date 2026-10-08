"use client"

import { useState } from "react"
import { AssignmentTimeline } from "@/components/assignment-timeline"
import { Badge } from "@workspace/ui/components/badge"
import { Pick } from "@/components/report-ui"
import type { PlanningReport } from "@/lib/planning-schema"

type Plan = PlanningReport["recommendations"][number]
type Calendar = Plan["calendars"][number]
type Task = Calendar["tasks"][number]
const time = (value: string) => new Date(value).getTime()
const clock = (value: string | number, precise = false) =>
  new Date(value).toLocaleTimeString("en-SG", {
    timeZone: "Asia/Singapore",
    hour: "2-digit",
    minute: "2-digit",
    second: precise ? "2-digit" : undefined,
    hour12: false,
  })

export function PlanningResourceTimeline({
  calendars,
  original,
  decisionAt,
}: {
  calendars: Plan["calendars"]
  original: PlanningReport["affectedTrips"]
  decisionAt: string
}) {
  const originals = new Map(original.map((row) => [row.trip, row]))
  const changed = (task: Task) => {
    const before = originals.get(task.trip)
    return !!before && (before.bus !== task.bus || before.crew !== task.crew)
  }
  const ordered = [...calendars].sort(
    (a, b) =>
      Number(b.tasks.some(changed)) - Number(a.tasks.some(changed)) ||
      Number(b.kind === "crew") - Number(a.kind === "crew") ||
      a.resourceId.localeCompare(b.resourceId)
  )
  const [selected, setSelected] = useState(ordered[0]?.resourceId ?? "")
  const calendar =
    ordered.find((row) => row.resourceId === selected) ?? ordered[0]
  if (!calendar) return null
  return (
    <section
      aria-label="Resource timeline"
      className="space-y-4 rounded-lg border p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">Resource timeline</h3>
          <p className="text-sm text-muted-foreground">
            See how the proposed work fits around the full day’s commitments.
            All times are Singapore time.
          </p>
        </div>
        <Pick
          label="Timeline resource"
          value={calendar.resourceId}
          onChange={setSelected}
          options={ordered.map((row) => ({
            value: row.resourceId,
            label: `${row.kind === "crew" ? "Crew" : "Bus"} ${row.resourceId}${row.tasks.some(changed) ? " · changed duties" : ""}`,
          }))}
        />
      </div>
      <ResourceDay
        key={calendar.resourceId}
        calendar={calendar}
        original={original}
        decisionAt={decisionAt}
      />
    </section>
  )
}

function ResourceDay({
  calendar,
  original,
  decisionAt,
}: {
  calendar: Calendar
  original: PlanningReport["affectedTrips"]
  decisionAt: string
}) {
  const originals = new Map(original.map((row) => [row.trip, row]))
  const changed = (task: Task) => {
    const before = originals.get(task.trip)
    return !!before && (before.bus !== task.bus || before.crew !== task.crew)
  }
  const tasks = [...calendar.tasks].sort((a, b) =>
    (a.departure ?? "").localeCompare(b.departure ?? "")
  )
  const [selected, setSelected] = useState(
    tasks.find(changed)?.trip ?? tasks[0]?.trip
  )
  const task = tasks.find((row) => row.trip === selected)
  const before = task ? originals.get(task.trip) : undefined
  const next = task ? tasks[tasks.indexOf(task) + 1] : undefined
  const gap =
    task?.alightingUntil && next?.preparation
      ? (time(next.preparation) - time(task.alightingUntil)) / 1000
      : null
  const timestamps = [
    calendar.availableFrom,
    calendar.availableUntil,
    decisionAt,
    calendar.break?.start,
    calendar.break?.end,
    ...tasks.flatMap((row) => [
      row.preparation,
      row.departure,
      row.alightingUntil,
      row.arrival,
    ]),
  ]
    .filter((value): value is string => !!value)
    .map(time)
    .filter(Number.isFinite)
  const start = Math.floor(Math.min(...timestamps) / 3600000) * 3600000
  const end = Math.ceil(Math.max(...timestamps) / 3600000) * 3600000
  const span = Math.max(end - start, 3600000)
  const unavailable = tasks.filter(
    (row) =>
      !row.departure || !row.arrival || !row.preparation || !row.alightingUntil
  )
  return (
    <>
      <p className="text-sm">
        Available{" "}
        <strong>
          {clock(calendar.availableFrom)} to {clock(calendar.availableUntil)}
        </strong>{" "}
        · {calendar.resourceId}
      </p>
      <p className="text-xs text-muted-foreground">
        Route colours match crew and vehicle planning. Faded blocks are existing
        duties. Reassigned trips are labelled. Dashed outlines show preparation;
        hatching marks protected breaks.
      </p>
      <AssignmentTimeline
        label={calendar.kind === "crew" ? "Crew" : "Vehicle"}
        start={start / 1000}
        end={(start + span) / 1000}
        focusTime={task?.departure ? time(task.departure) / 1000 : undefined}
        marker={{
          time: time(decisionAt) / 1000,
          label: `Decision ${clock(decisionAt)}`,
        }}
        rows={[
          {
            key: calendar.resourceId,
            label: calendar.resourceId,
            summary: `${tasks.length} duties · ${tasks.filter(changed).length} changed`,
            lanes: 1,
            bands: [
              {
                key: "availability",
                kind: "window",
                start: time(calendar.availableFrom) / 1000,
                end: time(calendar.availableUntil) / 1000,
                label: `Available ${clock(calendar.availableFrom)} to ${clock(calendar.availableUntil)}`,
                onSelect: () => setSelected(undefined),
              },
              ...(calendar.break
                ? [
                    {
                      key: "break",
                      kind: "break" as const,
                      start: time(calendar.break.start) / 1000,
                      end: time(calendar.break.end) / 1000,
                      label: `Protected break ${clock(calendar.break.start)} to ${clock(calendar.break.end)}`,
                      onSelect: () => setSelected(undefined),
                    },
                  ]
                : []),
            ],
            blocks: tasks.map((row) => ({
              key: row.trip,
              start: row.departure ? time(row.departure) / 1000 : null,
              end: row.arrival
                ? time(row.alightingUntil ?? row.arrival) / 1000
                : null,
              preparationStart: row.preparation
                ? time(row.preparation) / 1000
                : null,
              service: row.route,
              secondary: `${changed(row) ? "Reassigned" : "Existing"} · ${calendar.kind === "crew" ? row.bus : row.crew}`,
              annotation: changed(row) ? "Reassigned trip" : "Existing duty",
              selected: row.trip === selected,
              lane: 0,
              conflict: false,
              unverified: !row.preparation || !row.alightingUntil,
              muted: !changed(row),
              onSelect: () => setSelected(row.trip),
            })),
          },
        ]}
      />
      <p className="text-xs text-muted-foreground">{calendar.details}</p>
      <p className="text-xs text-muted-foreground">
        Trip bars include final alighting. Empty space is a timetable gap, not
        confirmation that another job can fit.{" "}
        {calendar.break
          ? `Protected break ${clock(calendar.break.start)} to ${clock(calendar.break.end)}.`
          : "No protected break is specified for this bus."}
      </p>
      {unavailable.length > 0 && (
        <p className="text-sm text-destructive">
          Timing is not established for {unavailable.length} duties. Missing
          intervals cannot be shown fully.
        </p>
      )}
      {task && (
        <div
          className="space-y-2 rounded-md bg-muted/40 p-3 text-sm"
          aria-label="Selected trip details"
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
          {gap !== null ? (
            <p
              className={gap < 0 ? "text-destructive" : "text-muted-foreground"}
            >
              {gap < 0 ? "Overlap" : "Gap until next preparation"}:{" "}
              {Math.floor(Math.abs(gap) / 60)}m {Math.round(Math.abs(gap) % 60)}
              s. Check protected breaks within this interval.
            </p>
          ) : (
            <p className="text-muted-foreground">
              {next
                ? "The next duty’s preparation time is not established."
                : "No later duty is listed in this calendar."}
            </p>
          )}
        </div>
      )}
    </>
  )
}
