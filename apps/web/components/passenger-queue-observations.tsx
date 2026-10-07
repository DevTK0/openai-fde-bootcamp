"use client"

import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { useDashboard } from "./dashboard-provider"
import { QueueObservations } from "./queue-observations"
import {
  planningDetailSchema,
  planningTime,
  type PlanningDetail,
} from "@/lib/service-planning"

type Result =
  | { key: string; kind: "ready"; detail: PlanningDetail }
  | { key: string; kind: "error" }

export function PassengerQueueObservations({
  date,
  service,
}: {
  date: string
  service: string
}) {
  const dashboard = useDashboard()
  const [result, setResult] = useState<Result | null>(null)
  const [attempt, setAttempt] = useState(0)
  const key = `${date}/${attempt}`
  useEffect(() => {
    if (!date) return
    const controller = new AbortController()
    fetch(`/api/service-history?${new URLSearchParams({ date })}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok)
          throw new Error("Queue observations could not be loaded")
        return planningDetailSchema.parse(await response.json())
      })
      .then((detail) => {
        if (!controller.signal.aborted)
          setResult({ key, kind: "ready", detail })
      })
      .catch(() => {
        if (!controller.signal.aborted) setResult({ key, kind: "error" })
      })
    return () => controller.abort()
  }, [date, key, dashboard])
  const current = result?.key === key ? result : null
  if (!date) return <p>No operating dates available.</p>
  if (current?.kind === "error")
    return (
      <div className="space-y-2">
        <p role="alert">Queue observations could not be loaded.</p>
        <Button variant="outline" onClick={() => setAttempt((n) => n + 1)}>
          Retry queue observations
        </Button>
      </div>
    )
  if (!current) return <p role="status">Loading queue observations…</p>
  const routes = current.detail.routes.filter(
    (r) => service === "all" || r.service === service
  )
  const routeIds = new Set(routes.map((r) => r.id))
  const calls = current.detail.calls.filter((c) => routeIds.has(c.route))
  const day = planningTime(date, "00:00")
  const observed = calls.flatMap((c) =>
    c.observed !== null && c.observed >= day && c.observed < day + 86400
      ? [c.observed]
      : []
  )
  const firstHour = observed.length
    ? Math.floor(
        (observed.reduce(
          (earliest, time) => Math.min(earliest, time),
          Infinity
        ) -
          day) /
          3600
      )
    : 0
  const lastHour = observed.length
    ? Math.max(
        firstHour + 1,
        Math.ceil(
          (observed.reduce(
            (latest, time) => Math.max(latest, time),
            -Infinity
          ) -
            day) /
            3600
        )
      )
    : 24
  const hour = (n: number) => `${String(n).padStart(2, "0")}:00`
  return (
    <QueueObservations
      key={`${date}/${service}`}
      detail={{ ...current.detail, routes, calls }}
      selection={{
        date,
        start: hour(firstHour),
        end: hour(lastHour),
        queue: 30,
      }}
    />
  )
}
