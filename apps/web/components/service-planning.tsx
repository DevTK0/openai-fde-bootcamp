"use client"

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react"
import { PlanningTimePicker } from "./planning-time-picker"
import { ReplayPlayer } from "./service-replay/player"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"

import { Label } from "@workspace/ui/components/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { useDashboard } from "./dashboard-provider"
import { Pick } from "./report-ui"
import {
  planningReportSchema,
  planningSelectionSchema,
  planningTime,
  type PlanningReport,
  type PlanningSelection,
} from "@/lib/service-planning"

function subscribe(listener: () => void) {
  window.addEventListener("popstate", listener)
  return () => window.removeEventListener("popstate", listener)
}
function updateLocation(
  values: Record<string, string>,
  selection?: PlanningSelection
) {
  const url = new URL(window.location.href)
  url.searchParams.set("view", "service-planning")
  if (selection)
    for (const [key, value] of Object.entries(selection))
      url.searchParams.set(key, String(value))
  for (const [key, value] of Object.entries(values))
    url.searchParams.set(key, value)
  window.history.replaceState(null, "", url)
  window.dispatchEvent(new PopStateEvent("popstate"))
}
function queryFor(selection: PlanningSelection) {
  return new URLSearchParams(
    Object.entries(selection).map(([key, value]) => [key, String(value)])
  ).toString()
}
export function ServicePlanning({
  initialQuery = "",
}: {
  initialQuery?: string
}) {
  const dashboard = useDashboard()
  const manifest = dashboard.operationsManifest
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => initialQuery
  )
  const params = new URLSearchParams(search)
  const defaults = {
    date: manifest.dates.includes("2026-10-07")
      ? "2026-10-07"
      : manifest.dates[0],
    service: manifest.services.includes("132") ? "132" : manifest.services[0],
  }
  const parsed = planningSelectionSchema.safeParse({
    ...defaults,
    ...Object.fromEntries(params),
  })
  const selection = parsed.success
    ? parsed.data
    : planningSelectionSchema.parse(defaults)
  const query = queryFor(selection)
  const [attempt, setAttempt] = useState(0)
  const requestKey = `${query}/${attempt}`
  const [request, setRequest] = useState<
    | { key: string; kind: "ready"; report: PlanningReport }
    | { key: string; kind: "error"; message: string }
    | null
  >(null)
  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api/service-planning?${query}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok)
          throw new Error(
            "Planning evidence could not be loaded. Check the selection or retry."
          )
        return planningReportSchema.parse(await response.json())
      })
      .then((report) => {
        if (!controller.signal.aborted) {
          setRequest({ key: requestKey, kind: "ready", report })
        }
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setRequest({
            key: requestKey,
            kind: "error",
            message:
              reason instanceof Error
                ? reason.message
                : "Could not load planning evidence",
          })
      })
    return () => controller.abort()
  }, [query, requestKey, dashboard])
  const current = request?.key === requestKey ? request : null
  const report = current?.kind === "ready" ? current.report : null
  const error = current?.kind === "error" ? current.message : ""
  return (
    <div className="space-y-6">
      {!parsed.success && (
        <p role="alert">
          Invalid planning link. Showing the default assumptions.
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <Pick
          label="Planning date"
          value={selection.date}
          options={manifest.dates.map((d) => ({ value: d, label: d }))}
          onChange={(date) => updateLocation({ date }, selection)}
        />
      </div>
      <Assumptions key={query} selection={selection} />
      {error && (
        <p role="alert" className="text-destructive">
          {error}
          <Button
            className="ml-2"
            variant="outline"
            onClick={() => setAttempt((a) => a + 1)}
          >
            Retry
          </Button>
        </p>
      )}
      {!report ? (
        !error && <p role="status">Loading planning evidence…</p>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Service watchlist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-112 overflow-y-auto">
                <Table aria-label="Service watchlist">
                  <TableHeader>
                    <TableRow>
                      {[
                        "Service",
                        "Priority and explanation",
                        "Peak queue",
                        "Positions with queues",
                        "Observation coverage",
                      ].map((h) => (
                        <TableHead key={h}>{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.watchlist.map((s) => (
                      <TableRow
                        key={s.service}
                        data-state={
                          s.service === selection.service
                            ? "selected"
                            : undefined
                        }
                      >
                        <TableCell>
                          <Button
                            variant="link"
                            aria-label={`Investigate service ${s.service}`}
                            onClick={() =>
                              updateLocation(
                                {
                                  service: s.service,
                                },
                                selection
                              )
                            }
                          >
                            {s.service}
                          </Button>
                        </TableCell>
                        <TableCell className="max-w-96 whitespace-normal">
                          <Badge
                            variant={
                              s.priority === "Critical"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {s.priority}
                          </Badge>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {s.reasons.join(" · ") ||
                              "No trigger in supplied evidence. Unobserved conditions remain unknown."}
                          </p>
                        </TableCell>
                        <TableCell>{s.peak?.queue ?? "Unknown"}</TableCell>
                        <TableCell>
                          {s.observed
                            ? `${s.affected} / ${s.observed} (${Math.round((s.affected / s.observed) * 100)}%)`
                            : "Unknown"}
                        </TableCell>
                        <TableCell>
                          {s.observed} / {s.total} boarding positions
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Any positive queue counts once per observed route position,
                independently of the high-queue threshold. Directions and
                repeated stop positions remain separate. Final alighting-only
                stops are excluded.
              </p>
            </CardContent>
          </Card>
        </>
      )}
      <div
        className="space-y-4"
        aria-label={`Service ${selection.service} investigation`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">
            Service {selection.service} investigation
          </h2>
          <Pick
            label="Planning service"
            value={selection.service}
            options={manifest.services.map((s) => ({
              value: s,
              label: `Service ${s}`,
            }))}
            onChange={(service) => updateLocation({ service }, selection)}
          />
        </div>
        {report && <Replay key={query} report={report} />}
      </div>
    </div>
  )
}

function Assumptions({ selection }: { selection: PlanningSelection }) {
  const [error, setError] = useState("")
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const parsed = planningSelectionSchema.safeParse({
      ...selection,
      ...values,
    })
    if (!parsed.success) {
      setError(
        "Enter a valid window, delay from 0 to 120, queue from 1 to 10,000."
      )
      return
    }
    updateLocation(
      Object.fromEntries(
        Object.entries(parsed.data).map(([key, value]) => [key, String(value)])
      )
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Planning assumptions</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="flex flex-wrap items-end gap-4">
          <PlanningTimePicker
            label="Window start"
            name="start"
            defaultValue={selection.start}
            required
          />
          <PlanningTimePicker
            label="Window end"
            name="end"
            defaultValue={selection.end}
            required
          />
          <div className="w-36 space-y-1">
            <Label htmlFor="planning-delay">Delay threshold (min)</Label>
            <Input
              id="planning-delay"
              name="delay"
              type="number"
              min={0}
              max={120}
              step="0.1"
              defaultValue={selection.delay}
              required
            />
          </div>
          <div className="w-36 space-y-1">
            <Label htmlFor="planning-queue">Queue threshold</Label>
            <Input
              id="planning-queue"
              name="queue"
              type="number"
              min={1}
              max={10000}
              defaultValue={selection.queue}
              required
            />
          </div>
          <Button type="submit">Apply assumptions</Button>
        </form>
        {error && (
          <p role="alert" className="mt-2 text-destructive">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function Replay({ report }: { report: PlanningReport }) {
  const { selection, detail } = report
  const start = planningTime(selection.date, selection.start),
    end = planningTime(selection.date, selection.end)
  return (
    <div className="space-y-5">
      <ReplayPlayer
        detail={detail}
        date={selection.date}
        start={start}
        end={end}
      />
    </div>
  )
}
