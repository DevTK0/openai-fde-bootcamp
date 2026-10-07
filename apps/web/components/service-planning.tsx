"use client"

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react"
import { Play, Pause, RefreshCw } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import {
  TimePicker,
  TimePickerLabel,
  TimePickerInputGroup,
  TimePickerInput,
  TimePickerSeparator,
  TimePickerTrigger,
  TimePickerContent,
  TimePickerHour,
  TimePickerMinute,
  TimePickerSecond,
  type TimePickerProps,
} from "@workspace/ui/components/time-picker"
import { Label } from "@workspace/ui/components/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { useDashboard } from "./dashboard-provider"
import { DatasetTable } from "./dataset-table"
import { Metric, Notice, Pick } from "./report-ui"
import {
  planningReportSchema,
  planningSelectionSchema,
  planningTime,
  replayAt,
  type PlanningReport,
  type PlanningSelection,
  type ServiceWatch,
} from "@/lib/service-planning"
import type { Row } from "@/lib/fleet"

function subscribe(listener: () => void) {
  window.addEventListener("popstate", listener)
  return () => window.removeEventListener("popstate", listener)
}
function updateLocation(values: Record<string, string>) {
  const url = new URL(window.location.href)
  url.searchParams.set("view", "service-planning")
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
function timestamp(value: number | null) {
  if (value === null) return "Unknown"
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Singapore",
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(value * 1000)
}
function EvidenceTable({
  title,
  rows,
  columns,
}: {
  title: string
  rows: Row[]
  columns: string[]
}) {
  return (
    <DatasetTable
      source={{
        kind: "report",
        rows,
        table: {
          id: `planning-${title}`,
          file: "",
          title,
          columns,
        },
      }}
    />
  )
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
  const tab = params.get("planningTab") ?? "evidence"
  const [request, setRequest] = useState<{
    query: string
    report: PlanningReport
  } | null>(null)
  const [error, setError] = useState("")
  const [attempt, setAttempt] = useState(0)
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
          setRequest({ query, report })
          setError("")
        }
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setError(
            reason instanceof Error
              ? reason.message
              : "Could not load planning evidence"
          )
      })
    return () => controller.abort()
  }, [query, attempt, dashboard])
  const report = request?.query === query ? request.report : null
  const selected = report?.watchlist.find(
    (s) => s.service === selection.service
  )
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Service planning</h2>
          <p className="text-sm text-muted-foreground">
            Investigate a service, inspect its evidence, and review available
            resources.
          </p>
        </div>
        <Button variant="outline" onClick={() => setAttempt((a) => a + 1)}>
          <RefreshCw />
          Refresh evidence
        </Button>
      </div>
      <Notice>
        Synthetic exercise records · Retrospective review · All times Singapore
        UTC+08. Missing records are unknown. This view does not issue dispatch
        changes.
      </Notice>
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
          onChange={(date) => updateLocation({ date })}
        />
        <Pick
          label="Planning service"
          value={selection.service}
          options={manifest.services.map((s) => ({
            value: s,
            label: `Service ${s}`,
          }))}
          onChange={(service) => updateLocation({ service })}
        />
      </div>
      <Assumptions key={query} selection={selection} />
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      {!report ? (
        <p role="status">Loading planning evidence…</p>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Service watchlist</CardTitle>
              <CardDescription>
                {selection.date} · {selection.start} to {selection.end} SGT ·
                Two or more triggers = Critical; one = High. Proposed policy.
              </CardDescription>
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
                              updateLocation({
                                service: s.service,
                                planningTab: "evidence",
                              })
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
          {selected && (
            <div
              className="space-y-4"
              aria-label={`Service ${selected.service} investigation`}
            >
              <h2 className="text-xl font-semibold">
                Service {selected.service} investigation
              </h2>
              <Tabs
                value={tab}
                onValueChange={(value) =>
                  updateLocation({ planningTab: String(value) })
                }
              >
                <TabsList className="h-auto flex-wrap">
                  <TabsTrigger value="evidence">Dated evidence</TabsTrigger>
                  <TabsTrigger value="candidates">Candidate buses</TabsTrigger>
                  <TabsTrigger value="replay">Timeline & replay</TabsTrigger>
                </TabsList>
                <TabsContent value="evidence">
                  <Evidence report={report} selected={selected} />
                </TabsContent>
                <TabsContent value="candidates">
                  <Candidates report={report} />
                </TabsContent>
                <TabsContent value="replay">
                  <Replay key={query} report={report} />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function PlanningTimePicker({
  label,
  showSeconds = false,
  ...props
}: TimePickerProps & { label: string }) {
  return (
    <TimePicker
      {...props}
      locale="en-GB"
      showSeconds={showSeconds}
      className="space-y-1"
    >
      <TimePickerLabel>{label}</TimePickerLabel>
      <TimePickerInputGroup className="h-9 w-auto min-w-36">
        <TimePickerInput segment="hour" aria-label={`${label} hours`} />
        <TimePickerSeparator />
        <TimePickerInput segment="minute" aria-label={`${label} minutes`} />
        {showSeconds && (
          <>
            <TimePickerSeparator />
            <TimePickerInput segment="second" aria-label={`${label} seconds`} />
          </>
        )}
        <TimePickerTrigger aria-label={`Choose ${label.toLowerCase()}`} />
      </TimePickerInputGroup>
      <TimePickerContent aria-label={`${label} picker`}>
        <TimePickerHour format="2-digit" aria-label="Hours" />
        <TimePickerMinute aria-label="Minutes" />
        {showSeconds && <TimePickerSecond aria-label="Seconds" />}
      </TimePickerContent>
    </TimePicker>
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
        "Enter a valid window, delay from 0 to 120, queue from 1 to 10,000, and review horizon from 1 to 240 minutes."
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
        <CardDescription>
          Proposed defaults: delay ≥5 min, peak queue ≥30 people, 06:00–12:00
          window, 30-minute availability review. Validate against operating
          policy.
        </CardDescription>
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
            label="Window end / decision time"
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
          <div className="w-36 space-y-1">
            <Label htmlFor="planning-horizon">Review window (min)</Label>
            <Input
              id="planning-horizon"
              name="horizon"
              type="number"
              min={1}
              max={240}
              defaultValue={selection.horizon}
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

function Evidence({
  report,
  selected,
}: {
  report: PlanningReport
  selected: ServiceWatch
}) {
  const start = planningTime(report.selection.date, report.selection.start),
    end = planningTime(report.selection.date, report.selection.end)
  const calls = report.detail.calls.filter(
    (c) =>
      c.observed !== null &&
      c.observed >= start &&
      c.observed <= end &&
      report.detail.positions.some(
        (p) => p.route === c.route && p.order === c.order && p.boarding === 1
      )
  )
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <Metric
          title="Peak observed queue"
          value={
            selected.peak?.queue === null || !selected.peak
              ? "Unknown"
              : String(selected.peak.queue)
          }
          detail={
            selected.peak
              ? `${selected.peak.id} · ${timestamp(selected.peak.observed)}`
              : "No queue observations in this window"
          }
        />
        <Metric
          title="Boarding-position coverage"
          value={`${selected.observed} / ${selected.total}`}
          detail={`${selected.affected} observed positions had a positive queue`}
        />
        <Metric
          title="Departure evidence"
          value={String(selected.departuresObserved)}
          detail={`${selected.departuresTotal} departures scheduled in this window; actual departures are counted by observed time`}
        />
      </div>
      <EvidenceTable
        title="Flagged departures"
        columns={[
          "Trip",
          "Vehicle",
          "Scheduled departure",
          "Actual departure",
          "Delay minutes",
        ]}
        rows={selected.delays.map((d) => ({
          Trip: d.trip,
          Vehicle: d.vehicle,
          "Scheduled departure": timestamp(d.scheduled),
          "Actual departure": timestamp(d.departure),
          "Delay minutes": Number(d.minutes.toFixed(2)),
        }))}
      />
      <EvidenceTable
        title="Queue observations"
        columns={[
          "Call",
          "Trip",
          "Route",
          "Position",
          "Observation time",
          "Remaining queue",
        ]}
        rows={calls.map((c) => ({
          Call: c.id,
          Trip: c.trip,
          Route: c.route,
          Position: c.order,
          "Observation time": timestamp(c.observed),
          "Remaining queue": c.queue ?? "Unknown",
        }))}
      />
      <EvidenceTable
        title="Service-linked maintenance holds"
        columns={["Record", "Vehicle", "Opened", "Confirmed release", "Source"]}
        rows={selected.holds.map((h) => ({
          Record: h.id,
          Vehicle: h.vehicle,
          Opened: timestamp(h.start),
          "Confirmed release":
            h.end === null ? "No confirmed release" : timestamp(h.end),
          Source: h.source,
        }))}
      />
      <Notice>
        Holds use recorded fleet service assignments and overlap with this
        window. Separate workshop vehicles without service assignments do not
        flag this service. Maintenance history is a selected extract; no
        recorded hold is not proof of full maintenance coverage.
      </Notice>
    </div>
  )
}
function Candidates({ report }: { report: PlanningReport }) {
  const candidates = report.candidates.filter((c) => c.status === "candidate")
  return (
    <div className="space-y-5">
      <Notice>
        Retrospective candidate review at {report.selection.end} SGT on{" "}
        {report.selection.date}. Readiness and crew records must have been
        issued by this time. Recorded vehicle and crew tasks remain reserved.
        The {report.selection.horizon}-minute review window is not confirmation
        of a complete additional journey. Check route duration, positioning,
        later duties and evidence beyond the supplied exercise before dispatch.
      </Notice>
      <h3 className="font-semibold">
        {candidates.length} supported candidate windows for service{" "}
        {report.selection.service}
      </h3>
      <EvidenceTable
        title="Supported candidate windows"
        columns={[
          "Vehicle",
          "Assigned service",
          "Crew",
          "Location",
          "Free from",
          "Free until",
          "Evidence",
          "Readiness issued",
          "Readiness window",
          "Crew evidence issued",
          "Crew availability",
          "Protected break",
          "Duty limit",
          "Turnaround complete",
          "Remaining checks",
        ]}
        rows={candidates.map((c) => ({
          Vehicle: c.vehicle,
          "Assigned service": c.assignedService,
          Crew: c.crew,
          Location: c.location,
          "Free from": timestamp(
            planningTime(report.selection.date, report.selection.end)
          ),
          "Free until": timestamp(c.until),
          Evidence: c.evidence.join(", "),
          "Readiness issued": timestamp(c.readiness.issued),
          "Readiness window": `${timestamp(c.readiness.start)} to ${timestamp(c.readiness.end)}`,
          "Crew evidence issued": timestamp(c.duty.issued),
          "Crew availability": `${timestamp(c.duty.start)} to ${timestamp(c.duty.end)}`,
          "Protected break": `${timestamp(c.duty.breakStart)} to ${timestamp(c.duty.breakEnd)}`,
          "Duty limit": timestamp(c.dutyLimit),
          "Turnaround complete":
            c.turnaroundCompleteAt === null
              ? "No prior task in supplied records; release evidence used"
              : timestamp(c.turnaroundCompleteAt),
          "Remaining checks":
            "Full journey, positioning, later duties, completeness of operating evidence",
        }))}
      />
      <EvidenceTable
        title="Other vehicle reviews"
        columns={["Vehicle", "Assigned service", "Result", "Explanation"]}
        rows={report.candidates.flatMap((c) =>
          c.status === "candidate"
            ? []
            : [
                {
                  Vehicle: c.vehicle,
                  "Assigned service": c.assignedService,
                  Result:
                    c.status === "unknown"
                      ? "Insufficient evidence"
                      : "Unavailable in this window",
                  Explanation: c.reasons.join("; "),
                },
              ]
        )}
      />
      <p className="text-xs text-muted-foreground">
        Each supported window has a distinct crew member within this list.
        Reviewing another service does not reserve vehicles or crew.
      </p>
    </div>
  )
}
function Replay({ report }: { report: PlanningReport }) {
  const { selection, detail } = report
  const start = planningTime(selection.date, selection.start),
    end = planningTime(selection.date, selection.end)
  const [cursor, setCursor] = useState(start)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(
      () => setCursor((value) => Math.min(end, value + 30)),
      500
    )
    return () => window.clearInterval(timer)
  }, [playing, end])
  const replay = useMemo(() => replayAt(detail, cursor), [detail, cursor])
  return (
    <div className="space-y-5">
      <Notice>
        Replay of recorded events. Queues are last observed values, not
        continuously measured demand. Observations older than 10 minutes are
        labeled stale under a proposed display rule. Between-stop positions are
        estimates, not live GPS or street geometry.
      </Notice>
      <Card>
        <CardHeader>
          <CardTitle>Replay time</CardTitle>
          <CardDescription>
            {timestamp(cursor)} SGT · Service {selection.service} · Delay ≥
            {selection.delay} min · Queue ≥{selection.queue}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            disabled={cursor >= end}
            onClick={() => setPlaying((value) => !value)}
          >
            {playing && cursor < end ? <Pause /> : <Play />}
            {playing && cursor < end ? "Pause replay" : "Play replay"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setPlaying(false)
              setCursor(start)
            }}
          >
            Reset replay
          </Button>
          <PlanningTimePicker
            label="Inspect time"
            showSeconds
            min={`${selection.start}:00`}
            max={`${selection.end}:00`}
            value={new Date(cursor * 1000 + 8 * 3600 * 1000)
              .toISOString()
              .slice(11, 19)}
            onValueChange={(value) => {
              if (!/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(value)) return
              const next = Date.parse(`${selection.date}T${value}+08:00`) / 1000
              setPlaying(false)
              setCursor(Math.max(start, Math.min(end, next)))
            }}
          />
          <span className="text-xs text-muted-foreground">
            Playback advances 30 recorded seconds every half second.
          </span>
        </CardContent>
      </Card>
      <EvidenceTable
        title="Bus states at replay time"
        columns={["Vehicle", "Trip", "Route", "State", "Evidence"]}
        rows={replay.buses.map((b) => ({
          Vehicle: b.vehicle,
          Trip: b.trip,
          Route: b.route,
          State: b.state,
          Evidence: b.evidence,
        }))}
      />
      <EvidenceTable
        title="Queues at replay time"
        columns={[
          "Route",
          "Position",
          "Stop",
          "Queue",
          "Observed at",
          "Age minutes",
          "Status",
          "Evidence",
        ]}
        rows={replay.queues.map((q) => ({
          Route: q.route,
          Position: q.order,
          Stop: `${q.stop} · ${q.name}`,
          Queue: q.observation?.queue ?? "Unknown",
          "Observed at": timestamp(q.observation?.observed ?? null),
          "Age minutes":
            q.age === null ? "Unknown" : Number((q.age / 60).toFixed(1)),
          Status:
            !q.observation || q.observation.queue === null
              ? "Unknown"
              : q.age !== null && q.age > 600
                ? "Stale observation"
                : "Observed",
          Evidence: q.observation?.id ?? "No prior observation",
        }))}
      />
      <EvidenceTable
        title="Departure timeline"
        columns={[
          "Trip",
          "Vehicle",
          "Scheduled",
          "Actual departure",
          "Actual arrival",
        ]}
        rows={detail.trips
          .filter(
            (t) =>
              t.departure !== null && t.departure >= start && t.departure <= end
          )
          .sort((a, b) => (a.departure ?? 0) - (b.departure ?? 0))
          .map((t) => ({
            Trip: t.id,
            Vehicle: t.vehicle,
            Scheduled: timestamp(t.scheduled),
            "Actual departure": timestamp(t.departure),
            "Actual arrival": timestamp(t.arrival),
          }))}
      />
    </div>
  )
}
