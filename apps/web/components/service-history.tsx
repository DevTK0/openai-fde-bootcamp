"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Pick } from "./report-ui"
import { useDashboard } from "./dashboard-provider"
import { ReplayPlayer } from "./service-replay/player"
import { planningDetailSchema, planningTime } from "@/lib/service-planning"

import {
  scheduledServiceSchema,
  serviceEventTimes,
  type ServiceMapDetail,
} from "@/lib/scheduled-service"

type Result =
  | { key: string; kind: "ready"; detail: ServiceMapDetail }
  | { key: string; kind: "error"; message: string }

export function ServiceHistory({
  mode = "history",
}: {
  mode?: "history" | "scheduled"
}) {
  const title = mode === "scheduled" ? "Scheduled service" : "Service history"
  const endpoint =
    mode === "scheduled" ? "scheduled-service" : "service-history"
  const { operationsManifest } = useDashboard()
  const [date, setDate] = useState(operationsManifest.dates.at(-1) ?? "")
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const key = `${mode}/${date}/${attempt}`
  useEffect(() => {
    if (!date) return
    const controller = new AbortController()
    fetch(`/api/${endpoint}?${new URLSearchParams({ date })}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok)
          throw new Error(
            `${title} could not be loaded. Retry or choose another date.`
          )
        return (
          mode === "scheduled" ? scheduledServiceSchema : planningDetailSchema
        ).parse(await response.json())
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
                : `${title} could not be loaded.`,
          })
      })
    return () => controller.abort()
  }, [date, key, endpoint, mode, title])
  const current = result?.key === key ? result : null
  const start = date ? planningTime(date, "00:00") : 0
  const end = start + 24 * 3600 - 1
  const events =
    current?.kind === "ready"
      ? serviceEventTimes(current.detail, start, end)
      : []
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>{title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Pick
              label={`${title} date`}
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
              aria-label={`Refresh ${title.toLowerCase()}`}
              onClick={() => setAttempt((value) => value + 1)}
            >
              <RefreshCw />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === "scheduled" && (
          <p className="text-xs text-muted-foreground">
            Synthetic schedule · Estimated positions · SGT
          </p>
        )}
        {!date ? (
          <p>No operating dates are available.</p>
        ) : current?.kind === "error" ? (
          <p role="alert" className="text-sm text-destructive">
            {current.message}
          </p>
        ) : current?.kind === "ready" ? (
          ("plannedTrips" in current.detail
            ? current.detail.plannedTrips
            : current.detail.trips
          ).length ? (
            <ReplayPlayer
              key={key}
              detail={current.detail}
              date={date}
              start={start}
              end={end}
              initialAt={events.find((at) => at > start && at < end) ?? start}
            />
          ) : (
            <p>No journeys are available on this date.</p>
          )
        ) : (
          <p role="status">Loading {title.toLowerCase()}…</p>
        )}
      </CardContent>
    </Card>
  )
}
