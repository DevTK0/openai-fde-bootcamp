"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Pick } from "./report-ui"
import { useDashboard } from "./dashboard-provider"
import { ReplayPlayer } from "./service-replay/player"
import {
  planningDetailSchema,
  planningTime,
  replayEventTimes,
  type PlanningDetail,
} from "@/lib/service-planning"

type Result =
  | { key: string; kind: "ready"; detail: PlanningDetail }
  | { key: string; kind: "error"; message: string }

export function FleetServiceHistory() {
  const { operationsManifest } = useDashboard()
  const [date, setDate] = useState(operationsManifest.dates.at(-1) ?? "")
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const key = `${date}/${attempt}`
  useEffect(() => {
    if (!date) return
    const controller = new AbortController()
    fetch(`/api/service-history?${new URLSearchParams({ date })}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok)
          throw new Error(
            "Service history could not be loaded. Retry or choose another date."
          )
        return planningDetailSchema.parse(await response.json())
      })
      .then((detail) => {
        if (!controller.signal.aborted)
          setResult({ key, kind: "ready", detail })
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setResult({
            key,
            kind: "error",
            message:
              error instanceof Error
                ? error.message
                : "Service history could not be loaded.",
          })
      })
    return () => controller.abort()
  }, [date, key])
  const current = result?.key === key ? result : null
  const start = date ? planningTime(date, "00:00") : 0
  const end = start + 24 * 3600 - 1
  const events =
    current?.kind === "ready"
      ? replayEventTimes(current.detail, start, end)
      : []
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>Service history</CardTitle>
            <CardDescription>
              All bus services on one map. Choose an operating date
              independently of the maintenance filters above.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Pick
              label="Service history date"
              value={date}
              onChange={setDate}
              options={operationsManifest.dates.map((value) => ({
                value,
                label: value,
              }))}
            />
            <Button
              size="icon"
              variant="outline"
              aria-label="Refresh service history"
              onClick={() => setAttempt((value) => value + 1)}
            >
              <RefreshCw />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Historical exercise records · All times Singapore UTC+08 · Movement
          between stops is estimated. Passenger icons show dated departures, not
          live queues.
        </p>
        {!date ? (
          <p>No operating dates are available.</p>
        ) : current?.kind === "error" ? (
          <p role="alert" className="text-sm text-destructive">
            {current.message}
          </p>
        ) : current?.kind === "ready" ? (
          current.detail.trips.length ? (
            <ReplayPlayer
              key={key}
              detail={current.detail}
              date={date}
              start={start}
              end={end}
              initialAt={events[1] ?? start}
            />
          ) : (
            <p>No journeys were recorded on this date.</p>
          )
        ) : (
          <p role="status">Loading service history…</p>
        )}
      </CardContent>
    </Card>
  )
}
