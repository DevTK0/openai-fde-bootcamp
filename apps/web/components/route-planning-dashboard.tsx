"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowRightLeft, BusFront, CircleAlert, Route } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Metric, Notice, Pick } from "@/components/report-ui"
import { operationsManifest, type OperationsReport } from "@/lib/operations"
import { fmt } from "@/lib/fleet"

const initialSource = "261"
const initialDestination = "238"

function queueRate(queuedCalls: number, calls: number) {
  return calls ? (queuedCalls / calls) * 100 : 0
}

function rankReviewPair(services: OperationsReport["byService"]) {
  const scored = services
    .filter((service) => service.calls > 0)
    .map((service) => ({
      service,
      queuePercent: queueRate(service.queuedCalls, service.calls),
    }))
  if (scored.length < 2) return undefined

  const byQueueRate = [...scored].sort(
    (a, b) => a.queuePercent - b.queuePercent
  )
  const destination = byQueueRate.at(-1)!
  const medianQueueRate =
    byQueueRate[Math.floor(byQueueRate.length / 2)]!.queuePercent
  const possibleSources = scored
    .filter(
      (candidate) =>
        candidate.service.name !== destination.service.name &&
        candidate.queuePercent <= medianQueueRate
    )
    .sort(
      (a, b) => a.service.meanOccupancy - b.service.meanOccupancy
    )
  const source =
    possibleSources[0] ??
    scored
      .filter((candidate) => candidate.service.name !== destination.service.name)
      .sort((a, b) => a.service.meanOccupancy - b.service.meanOccupancy)[0]
  return source
    ? { source: source.service, destination: destination.service }
    : undefined
}

function ServiceLoad({
  label,
  occupancy,
  queuePercent,
  color,
}: {
  label: string
  occupancy: number
  queuePercent: number
  color: "primary" | "destructive"
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {fmt(occupancy, 1)}% average load
        </span>
      </div>
      <div
        className="h-3 overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={`${label}: ${fmt(occupancy, 1)} percent average load`}
      >
        <div
          className={`h-full rounded-full ${color === "primary" ? "bg-primary" : "bg-destructive"}`}
          style={{ width: `${Math.min(100, Math.max(0, occupancy))}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Queues at {fmt(queuePercent, 1)}% of recorded stop calls
      </p>
    </div>
  )
}

export function RoutePlanningDashboard() {
  const [report, setReport] = useState<OperationsReport>()
  const [error, setError] = useState<string>()
  const [source, setSource] = useState(initialSource)
  const [destination, setDestination] = useState(initialDestination)
  const [briefReady, setBriefReady] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/operations?view=summary&service=all&date=all", {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("The route evidence could not be loaded.")
        return (await response.json()) as OperationsReport
      })
      .then((data) => {
        if (!controller.signal.aborted) setReport(data)
      })
      .catch((cause: Error) => {
        if (!controller.signal.aborted) setError(cause.message)
      })
    return () => controller.abort()
  }, [])

  const services = report?.byService ?? []
  const rankedPair = useMemo(() => rankReviewPair(services), [services])
  const sourceService = services.find((service) => service.name === source)
  const destinationService = services.find(
    (service) => service.name === destination
  )
  const serviceOptions = useMemo(
    () =>
      operationsManifest.services.map((service) => ({
        value: service,
        label: `Service ${service}`,
      })),
    []
  )

  if (error) {
    return (
      <Notice>
        <p role="alert">{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Notice>
    )
  }

  if (!report) {
    return (
      <div className="space-y-4" role="status" aria-label="Loading route data">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }

  const sourceQueuePercent = sourceService
    ? queueRate(sourceService.queuedCalls, sourceService.calls)
    : 0
  const destinationQueuePercent = destinationService
    ? queueRate(destinationService.queuedCalls, destinationService.calls)
    : 0

  return (
    <div className="space-y-6">
      <Notice>
        This is a planning prototype using fictional records from ten weekday
        mornings. It compares routes that may be worth reviewing; it does not
        confirm a bus is free, predict passenger savings, or change a schedule.
      </Notice>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          title="Operating sample"
          value="10 weekdays"
          detail="5–16 October 2026 · morning service only"
        />
        <Metric
          title="Trips in the sample"
          value={fmt(report.metrics.trips)}
          detail="All recorded trips completed in this exercise data"
        />
        <Metric
          title="Services to compare"
          value={fmt(services.length)}
          detail="Observed routes may have different times and constraints"
        />
        <Metric
          title="Review status"
          value="Planner-led"
          detail="A person checks every proposed capacity move"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="shadow-none">
          <CardHeader>
            <div className="flex items-center gap-2 text-xs font-medium text-primary">
              <Route className="size-4" /> ROUTE COMPARISON
            </div>
            <CardTitle>Compare a busy service with a possible source</CardTitle>
            <CardDescription>
              The sample points to Service 238 as a route to review for queues,
              and Service 261 as a possible source to investigate for spare
              capacity. Neither is a confirmed bus assignment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Pick
                label="Possible source service"
                value={source}
                options={serviceOptions.filter(
                  (option) => option.value !== destination
                )}
                onChange={(value) => {
                  setSource(value)
                  setBriefReady(false)
                }}
              />
              <Pick
                label="Service to support"
                value={destination}
                options={serviceOptions.filter(
                  (option) => option.value !== source
                )}
                onChange={(value) => {
                  setDestination(value)
                  setBriefReady(false)
                }}
              />
            </div>
            {rankedPair && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-3">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Data-ranked starting point: highest share of stop calls with a
                  queue, compared with a lower-load service.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSource(rankedPair.source.name)
                    setDestination(rankedPair.destination.name)
                    setBriefReady(false)
                  }}
                >
                  Use data-ranked pair
                </Button>
              </div>
            )}

            {sourceService && destinationService ? (
              <div className="space-y-6 rounded-lg border bg-muted/30 p-4 sm:p-5">
                <ServiceLoad
                  label={`Possible source · Service ${sourceService.name}`}
                  occupancy={sourceService.meanOccupancy}
                  queuePercent={sourceQueuePercent}
                  color="primary"
                />
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <ArrowRightLeft className="size-4" />
                  Compare demand and minimum service before moving capacity
                </div>
                <ServiceLoad
                  label={`Service to support · Service ${destinationService.name}`}
                  occupancy={destinationService.meanOccupancy}
                  queuePercent={destinationQueuePercent}
                  color="destructive"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Metric
                    title={`Service ${sourceService.name} · recorded trips`}
                    value={fmt(sourceService.trips)}
                    detail={`${fmt(sourceService.vehicles)} different buses appeared in the sample; this is not a live availability count.`}
                  />
                  <Metric
                    title={`Service ${destinationService.name} · recorded trips`}
                    value={fmt(destinationService.trips)}
                    detail={`${fmt(destinationService.vehicles)} different buses appeared in the sample; this is not a live availability count.`}
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No records are available for one of the selected services.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <div className="flex items-center gap-2 text-xs font-medium text-primary">
              <BusFront className="size-4" /> PLANNER REVIEW
            </div>
            <CardTitle>Draft a capacity review</CardTitle>
            <CardDescription>
              Use the data to decide what to check next. The prototype does not
              calculate a safe or executable bus swap.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
              <p className="flex items-center gap-2 font-medium">
                <CircleAlert className="size-4 text-amber-700" />
                Check before moving any bus
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
                <li>Keep the source service’s minimum trips and frequency.</li>
                <li>Confirm a bus and qualified driver are free at that time.</li>
                <li>Allow time to travel between routes and reach the first stop.</li>
                <li>Keep enough seats and wheelchair spaces on both services.</li>
              </ul>
            </div>
            <Button
              className="w-full"
              disabled={!sourceService || !destinationService}
              onClick={() => setBriefReady(true)}
            >
              Prepare review brief
            </Button>
            {briefReady && sourceService && destinationService && (
              <div
                className="rounded-lg border bg-card p-4 text-sm"
                role="status"
              >
                <Badge variant="outline">Needs planner review</Badge>
                <p className="mt-3 leading-relaxed">
                  Compare one possible morning bus allocation from Service{" "}
                  {sourceService.name} to Service {destinationService.name}.
                  Check its timetable, driver, capacity, accessibility, and the
                  source service&apos;s minimum coverage before deciding.
                </p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  No passenger benefit is estimated here. The current sample
                  gives route-level pressure signals, not a verified bus that
                  can be moved.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Notice>
        The average load and queue-call rate summarize all recorded stops and
        sampled trips for each service. A route average can hide a busy stop,
        direction, day, or time. Before a real pilot, compare demand by trip and
        stop, then validate the change against the full timetable and driver
        duties. This exercise snapshot is fictional and is not a live dispatch
        feed.
      </Notice>
    </div>
  )
}
