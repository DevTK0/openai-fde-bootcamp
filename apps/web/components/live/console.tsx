"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Database,
  FileText,
  GitBranch,
  Loader2,
  MessageSquare,
  Pause,
  Play,
  Plus,
  Radio,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Users,
  Wrench,
  X,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"
import type {
  Decision,
  LiveEvent,
  LiveSnapshot,
  TraceStep,
} from "@/lib/live/contracts"
import { RepairPanel } from "./repair-panel"
import { VisualExplorer } from "./visual-explorer"

const kindLabels = {
  observation: "Unclassified report",
  analysis: "Agent assessment request",
  complaint: "Customer complaint",
  fault: "Vehicle fault",
  delay: "Delay observation",
  crowding: "Waiting passengers",
  clearance: "Engineering clearance",
}
const icons = {
  observation: FileText,
  analysis: Sparkles,
  complaint: MessageSquare,
  fault: Wrench,
  delay: Clock3,
  crowding: Users,
  clearance: ShieldCheck,
}
const phaseLabels = {
  observe: "Observation",
  detect: "Signal detection",
  retrieve: "Source retrieval",
  evaluate: "Resource checks",
  recommend: "Recommendation",
  explain: "Legacy explanation",
  agent: "Agent investigation",
  tool: "Database query",
}
function time(stamp: string) {
  return new Date(stamp).toLocaleTimeString("en-SG", {
    timeZone: "Asia/Singapore",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}
async function post(url: string, input: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  const body = await response.json()
  if (!response.ok)
    throw new Error(body.error ?? "The request could not be completed.")
  return body
}

export function LiveConsole({ embedded = false }: { embedded?: boolean }) {
  const [snapshot, setSnapshot] = useState<LiveSnapshot | null>(null)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)
  const [filter, setFilter] = useState("all")
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [traceOpen, setTraceOpen] = useState(false)
  const [aiDialog, setAiDialog] = useState(false)
  useEffect(() => {
    let stopped = false
    const load = () =>
      fetch("/api/live/events", { cache: "no-store" })
        .then((response) => {
          if (!response.ok) throw new Error()
          return response.json()
        })
        .then((data) => {
          if (!stopped) {
            setSnapshot(data)
            setError("")
          }
        })
        .catch(() => {
          if (!stopped)
            setError(
              "The operations feed is unavailable. Check the server and retry."
            )
        })
    void load()
    const stream = new EventSource("/api/live/stream")
    stream.addEventListener("open", () => setConnected(true))
    stream.addEventListener("snapshot", (event) => {
      try {
        setSnapshot(JSON.parse((event as MessageEvent).data))
        setConnected(true)
        setError("")
      } catch {
        setError("An update could not be read. Reconnecting…")
      }
    })
    stream.addEventListener("error", () => {
      setConnected(false)
    })
    const fallback = setInterval(() => {
      if (stream.readyState !== EventSource.OPEN) void load()
    }, 5000)
    return () => {
      stopped = true
      stream.close()
      clearInterval(fallback)
    }
  }, [])
  const decisions = (snapshot?.decisions ?? []).filter(
    (item) =>
      (filter === "all" || item.service === filter) &&
      (showHistory || item.status === "open")
  )
  const selected = selectedId
    ? (snapshot?.decisions.find((item) => item.id === selectedId) ?? null)
    : selectedEvent !== null
      ? (decisions.find((item) => item.eventSeq === selectedEvent) ?? null)
      : (decisions[0] ?? null)
  const activeRun = snapshot?.runs.find((run) => run.status === "processing")
  const followingActive =
    selectedId === null && selectedEvent === null && Boolean(activeRun)
  const event =
    snapshot?.events.find(
      (item) =>
        item.seq ===
        (followingActive
          ? activeRun?.eventSeq
          : (selectedEvent ?? selected?.eventSeq))
    ) ?? null
  const inspectedRun =
    selectedEvent !== null
      ? snapshot?.runs.find((run) => run.eventSeq === selectedEvent)
      : (activeRun ?? snapshot?.runs[0])
  const trace = followingActive
    ? (activeRun?.trace ?? [])
    : (selected?.trace ?? inspectedRun?.trace ?? [])
  const events = (snapshot?.events ?? []).filter(
    (item) =>
      filter === "all" ||
      item.service === filter ||
      snapshot?.decisions.some(
        (decision) =>
          decision.eventSeq === item.seq && decision.service === filter
      )
  )
  const open = (snapshot?.decisions ?? []).filter(
    (item) => item.status === "open"
  )
  async function settings(input: { paused?: boolean; llmEnabled?: boolean }) {
    setBusy(true)
    try {
      await post("/api/live/settings", input)
      setNotice(
        input.paused === true
          ? "Monitoring paused. Incoming records remain queued."
          : input.paused === false
            ? "Monitoring resumed."
            : input.llmEnabled
              ? "OpenAI agent enabled. New records trigger database-backed investigations."
              : "OpenAI agent paused. New records remain queued."
      )
    } catch (e) {
      setNotice((e as Error).message)
    } finally {
      setBusy(false)
    }
  }
  async function review(status: "acknowledged" | "dismissed") {
    if (!selected) return
    if (note.trim().length < 3) {
      setNotice("Add a short review note before recording your decision.")
      return
    }
    setBusy(true)
    try {
      await post("/api/live/review", {
        id: selected.id,
        version: selected.version,
        status,
        note,
      })
      setNotice(
        status === "acknowledged"
          ? "Recommendation acknowledged. No bus was dispatched."
          : "Recommendation dismissed with your review note."
      )
      setNote("")
    } catch (e) {
      setNotice((e as Error).message)
    } finally {
      setBusy(false)
    }
  }
  const Content = embedded ? "div" : "main"
  return (
    <div
      className={cn(
        "live-console text-foreground",
        embedded ? "live-console-embedded" : "min-h-screen bg-background"
      )}
    >
      {!embedded && (
        <header className="border-b bg-card">
          <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-4 px-5 py-4 lg:px-8">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                aria-label="Back to fleet dashboard"
                className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"
              >
                <Activity className="size-5" />
              </Link>
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-xl font-semibold tracking-tight">
                    LionLink
                  </span>
                  <span className="border-l pl-3 text-sm text-muted-foreground">
                    Operations room
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Observe. Evaluate. Decide.
                </p>
              </div>
            </div>
            <nav
              className="flex items-center gap-2"
              aria-label="Operations navigation"
            >
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/dashboard" />}
              >
                <ArrowLeft />
                Fleet reports
              </Button>
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href="/planner" />}
              >
                <GitBranch />
                Planning desk
              </Button>
            </nav>
          </div>
        </header>
      )}
      <Content
        className={cn(
          embedded ? "w-full pb-8" : "mx-auto max-w-[1800px] px-5 pb-8 lg:px-8"
        )}
      >
        <section
          className={cn(
            "flex flex-wrap items-end justify-between gap-5",
            embedded ? "pb-4" : "py-7"
          )}
        >
          {!embedded && (
            <div>
              <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                Live operations
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                New signals become recommendations with a record of every check.
                You stay in control of what happens next.
              </p>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              disabled={!snapshot || busy}
              onClick={() => settings({ paused: !snapshot?.monitor.paused })}
            >
              {snapshot?.monitor.paused ? <Play /> : <Pause />}
              {snapshot?.monitor.paused ? "Resume monitor" : "Pause monitor"}
            </Button>
            <Button
              variant="outline"
              disabled={
                busy || !snapshot?.monitor.llmEnabled || !snapshot.events.length
              }
              onClick={async () => {
                setBusy(true)
                try {
                  await post("/api/live/analyze", {
                    service:
                      filter !== "all" ? filter : (selected?.service ?? "238"),
                  })
                  setSelectedId(null)
                  setSelectedEvent(null)
                  setNotice(
                    "Agent assessment requested. Watch its database queries in the decision trace."
                  )
                } catch (error) {
                  setError(
                    error instanceof Error
                      ? error.message
                      : "Could not request analysis."
                  )
                } finally {
                  setBusy(false)
                }
              }}
            >
              <Sparkles />
              Ask agent to reassess
            </Button>
            <VisualExplorer
              service={filter !== "all" ? filter : (selected?.service ?? "238")}
              eventSeq={event?.seq}
              vehicleId={
                selected?.agent?.interpretation?.vehicleId ?? undefined
              }
              repairAreas={selected?.agent?.interpretation?.repairAreas}
              repairArea={selected?.agent?.interpretation?.repairArea}
              report={selected?.agent?.interpretation?.summary}
            />
            <EventComposer
              services={snapshot?.services ?? []}
              onRecorded={(seq) => {
                setSelectedEvent(seq)
                setNotice(
                  `Event #${seq} recorded. The monitor will evaluate it automatically.`
                )
              }}
            />
          </div>
        </section>
        <div className="mb-6 grid gap-0 overflow-hidden rounded-xl border bg-card sm:grid-cols-3 lg:grid-cols-4">
          <div className="flex items-center gap-3 border-b px-4 py-4 sm:border-r lg:border-b-0">
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-full",
                snapshot?.monitor.online && !snapshot.monitor.paused
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Radio className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">
                {snapshot?.monitor.paused
                  ? "Monitor paused"
                  : snapshot?.monitor.online
                    ? "Database monitor online"
                    : "Monitor offline"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {snapshot?.monitor.heartbeatAt
                  ? `Last scan ${time(snapshot.monitor.heartbeatAt)} SGT`
                  : "Start the database worker to evaluate events"}
              </p>
            </div>
          </div>
          <div className="border-b px-4 py-4 sm:border-r lg:border-b-0">
            <p className="text-xs text-muted-foreground">Awaiting evaluation</p>
            <p className="mt-1 flex items-baseline gap-2 text-2xl font-semibold tabular-nums">
              {snapshot?.pending ?? "—"}
              <span className="text-xs font-normal text-muted-foreground">
                committed records
              </span>
            </p>
          </div>
          <div className="border-b px-4 py-4 lg:border-r lg:border-b-0">
            <p className="text-xs text-muted-foreground">Needs your review</p>
            <p className="mt-1 flex items-baseline gap-2 text-2xl font-semibold tabular-nums">
              {open.length}
              <span className="text-xs font-normal text-muted-foreground">
                {open.filter((item) => item.priority === "urgent").length}{" "}
                urgent
              </span>
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 px-4 py-4">
            <div>
              <p className="text-xs text-muted-foreground">
                Agent recommendations
              </p>
              <p className="mt-1 text-sm font-medium">
                {snapshot?.monitor.llmEnabled
                  ? "OpenAI enabled"
                  : "OpenAI paused · records queued"}
              </p>
            </div>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Configure OpenAI agent"
              onClick={() => setAiDialog(true)}
            >
              <Sparkles />
            </Button>
          </div>
        </div>
        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm"
          >
            {error}
          </div>
        )}
        {snapshot && !snapshot.monitor.online && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border bg-card px-4 py-3 text-sm">
            <Database className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p>
              Events are stored, but the monitor is offline. Run{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                pnpm --filter web monitor
              </code>{" "}
              in a separate terminal. It continues watching when this page is
              closed.
            </p>
          </div>
        )}
        {snapshot?.monitor.lastError && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm"
          >
            <p className="font-semibold">Agent assessment could not complete</p>
            <p className="mt-1">{snapshot.monitor.lastError}</p>
            <p className="mt-2 text-xs">
              No rule-generated replacement was published. Ask the agent to
              reassess after resolving the issue.
            </p>
          </div>
        )}
        {snapshot && !snapshot.monitor.llmEnabled && (
          <p className="mb-4 text-sm text-muted-foreground">
            The OpenAI agent is paused. New records remain queued until you
            enable it.
          </p>
        )}
        {snapshot?.invalid ? (
          <p role="alert" className="mb-4 text-sm text-destructive">
            {snapshot.invalid} invalid database record(s) were quarantined.
            Inspect the evaluation runs and insert a corrected record.
          </p>
        ) : null}
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(240px,0.85fr)_minmax(350px,1.25fr)_minmax(320px,1fr)]">
          <section
            className="overflow-hidden rounded-xl border bg-card"
            aria-labelledby="signal-heading"
          >
            <div className="flex items-center justify-between border-b px-4 py-4">
              <div>
                <h2 id="signal-heading" className="font-semibold">
                  Incoming signals
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      connected ? "bg-primary" : "bg-muted-foreground"
                    )}
                  />
                  {connected ? "Live feed · SGT" : "Reconnecting"}
                </p>
              </div>
              <Select
                value={filter}
                onValueChange={(value) => {
                  setFilter(value ?? "all")
                  setSelectedId(null)
                  setSelectedEvent(null)
                }}
              >
                <SelectTrigger aria-label="Filter services" className="w-24">
                  <SelectValue>{filter === "all" ? "All" : filter}</SelectValue>
                </SelectTrigger>
                <SelectContent className="live-console">
                  <SelectItem value="all">All</SelectItem>
                  {(
                    snapshot?.services ?? [
                      ...new Set(
                        snapshot?.events.map((row) => row.service) ?? []
                      ),
                    ]
                  ).map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="max-h-[680px] overflow-y-auto">
              {!snapshot ? (
                <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
                  Connecting to the event stream…
                </div>
              ) : events.length === 0 ? (
                <div className="p-6">
                  <Radio className="mb-4 size-7 text-primary" />
                  <h3 className="font-medium">Ready for the first signal.</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Record a complaint, fault, delay, or waiting count. The
                    monitor will show its evaluation here.
                  </p>
                </div>
              ) : (
                events.map((item) => {
                  const Icon = icons[item.kind]
                  const run = snapshot.runs.find(
                    (row) => row.eventSeq === item.seq
                  )
                  const decision = snapshot.decisions.find(
                    (row) => row.eventSeq === item.seq
                  )
                  return (
                    <div
                      key={item.seq}
                      className={cn(
                        "border-b last:border-b-0",
                        event?.seq === item.seq && "bg-primary/[0.045]"
                      )}
                    >
                      <Button
                        variant="ghost"
                        className="h-auto w-full justify-start rounded-none px-4 py-4 text-left whitespace-normal"
                        onClick={() => {
                          setSelectedEvent(item.seq)
                          setSelectedId(decision?.id ?? null)
                        }}
                      >
                        <div className="flex w-full items-start gap-3">
                          <span
                            className={cn(
                              "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                              item.kind === "fault"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-muted text-primary"
                            )}
                          >
                            <Icon className="size-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-medium text-muted-foreground">
                                {item.service === "network" &&
                                !decision?.agent?.interpretation?.service
                                  ? "Service not yet identified"
                                  : `Service ${decision?.agent?.interpretation?.service ?? item.service}`}
                              </span>
                              <time className="text-xs text-muted-foreground tabular-nums">
                                {time(item.receivedAt)}
                              </time>
                            </div>
                            <p className="mt-1 text-sm leading-snug font-semibold">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {decision?.agent?.interpretation?.signalTypes
                                .map((type) =>
                                  type === "other"
                                    ? "Other observation"
                                    : kindLabels[type]
                                )
                                .join(" · ") ?? kindLabels[item.kind]}
                              {item.vehicleId ? ` · ${item.vehicleId}` : ""}
                              {item.waitingPeople !== null
                                ? ` · ${item.waitingPeople} waiting`
                                : ""}
                              {item.delaySeconds !== null
                                ? ` · ${Math.round(item.delaySeconds / 60)} min delay`
                                : ""}
                            </p>
                            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                              {run?.status === "processing" ? (
                                <Loader2 className="size-3 animate-spin motion-reduce:animate-none" />
                              ) : run?.status === "completed" ? (
                                <Check className="size-3" />
                              ) : (
                                <Clock3 className="size-3" />
                              )}
                              {run?.status === "processing"
                                ? "Evaluating"
                                : run?.status === "failed"
                                  ? "Evaluation failed"
                                  : decision
                                    ? "Recommendation generated"
                                    : run?.status === "completed"
                                      ? "Agent assessment completed"
                                      : "Queued"}
                              <span className="ml-auto">#{item.seq}</span>
                            </div>
                          </div>
                        </div>
                      </Button>
                    </div>
                  )
                })
              )}
            </div>
            <div className="border-t bg-muted/30 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              Direct inserts into <code>live_events</code> are detected too.
              These are exercise signals, separate from live public arrivals.
            </div>
          </section>
          <section aria-labelledby="decision-heading" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 id="decision-heading" className="font-semibold">
                  Recommended actions
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Latest assessment for each service
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowHistory((value) => !value)}
              >
                <Clock3 />
                {showHistory ? "Active only" : "History"}
              </Button>
            </div>
            {activeRun && (
              <div
                role="status"
                className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4"
              >
                <Loader2 className="size-4 animate-spin text-primary motion-reduce:animate-none" />
                <div>
                  <p className="text-sm font-medium">
                    Evaluating signal #{activeRun.eventSeq}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {activeRun.trace.at(-1)?.title ?? "Reading source records"}
                  </p>
                </div>
              </div>
            )}
            {decisions.length === 0 ? (
              <div className="rounded-xl border bg-card px-6 py-10">
                <GitBranch className="mb-5 size-8 text-primary" />
                <h3 className="text-xl font-semibold tracking-tight">
                  Nothing needs a decision yet.
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Record an observation or ask the agent to assess the existing
                  database. It will investigate history, resource context and
                  the planner response.
                </p>
                <div className="mt-6 border-t pt-4 text-xs leading-relaxed text-muted-foreground">
                  OpenAI generates the insights. Database queries and assignment
                  checks are visible in the decision trace.
                </div>
              </div>
            ) : (
              decisions.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "overflow-hidden rounded-xl border bg-card",
                    selected?.id === item.id && "border-primary/50"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-between gap-2 border-b px-5 py-3",
                      item.priority === "urgent"
                        ? "bg-destructive/5"
                        : "bg-primary/5"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {item.priority === "urgent" ? (
                        <TriangleAlert className="size-4 text-destructive" />
                      ) : (
                        <GitBranch className="size-4 text-primary" />
                      )}
                      <span className="text-xs font-semibold">
                        {item.priority === "urgent"
                          ? "Urgent review"
                          : item.priority === "attention"
                            ? "Controller review"
                            : "Update received"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.origin === "agent"
                        ? "OpenAI · "
                        : "Earlier rule assessment · "}
                      Service {item.service}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg leading-snug font-semibold tracking-tight">
                        {item.title}
                      </h3>
                      <Badge variant="outline" className="shrink-0 capitalize">
                        {item.status}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed">
                      {item.origin === "agent"
                        ? item.summary
                        : (item.actionPlan?.rationale ?? item.action)}
                    </p>
                    {item.agent && (
                      <div className="mt-5 space-y-5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Sparkles className="size-3 text-primary" />
                          {item.model.name} · {item.agent.confidence} confidence
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold">
                            What the agent found
                          </h4>
                          <div className="mt-3 space-y-4">
                            {item.agent.insights.map((insight, index) => (
                              <div key={`${insight.title}-${index}`}>
                                <p className="text-sm font-medium">
                                  {insight.title}
                                </p>
                                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                  {insight.finding}
                                </p>
                                <p className="mt-1 text-[10px] leading-relaxed break-all text-muted-foreground">
                                  Sources: {insight.evidenceIds.join(", ")}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                        {item.agent.recommendations.length > 0 && (
                          <div className="border-t pt-4">
                            <h4 className="text-sm font-semibold">
                              Recommended response
                            </h4>
                            <div className="mt-3 space-y-4">
                              {item.agent.recommendations.map(
                                (recommendation, index) => (
                                  <div key={`${recommendation.title}-${index}`}>
                                    <p className="text-sm font-semibold text-primary">
                                      {recommendation.title}
                                    </p>
                                    <p className="mt-1 text-sm leading-relaxed">
                                      {recommendation.action}
                                    </p>
                                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                      {recommendation.rationale}
                                    </p>
                                    <p className="mt-2 text-xs leading-relaxed">
                                      <span className="font-medium">
                                        Expected effect:{" "}
                                      </span>
                                      {recommendation.expectedEffect}
                                    </p>
                                    <p className="mt-1 text-[10px] leading-relaxed break-all text-muted-foreground">
                                      Sources:{" "}
                                      {recommendation.evidenceIds.join(", ")}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                        {item.agent.proposals.map((proposal) => (
                          <div
                            key={proposal.id}
                            className="rounded-lg border border-primary/20 bg-primary/5 p-3"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-xs font-semibold">
                                Proposed resource allocation
                              </h4>
                              <Badge variant="outline" className="capitalize">
                                {proposal.status}
                              </Badge>
                            </div>
                            <div className="mt-3 space-y-3">
                              {proposal.assignments.map((assignment) => (
                                <div key={assignment.tripId}>
                                  <p className="text-sm font-semibold">
                                    {assignment.vehicleId} · Driver{" "}
                                    {assignment.crewId}
                                  </p>
                                  <p className="mt-1 text-xs break-words">
                                    {assignment.tripId} · {assignment.routeId}
                                  </p>
                                  <p className="mt-1 text-xs">
                                    {time(assignment.departureAt)} →{" "}
                                    {time(assignment.arrivalAt)} SGT
                                  </p>
                                </div>
                              ))}
                            </div>
                            {proposal.conflicts.length > 0 && (
                              <ul className="mt-3 list-disc space-y-1 pl-4 text-xs leading-relaxed">
                                {proposal.conflicts.map((conflict) => (
                                  <li key={conflict}>{conflict}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                        {item.agent.caveats.length > 0 && (
                          <div className="border-t pt-4">
                            <h4 className="text-xs font-semibold">
                              Uncertainties and tradeoffs
                            </h4>
                            <ul className="mt-2 list-disc space-y-2 pl-4 text-xs leading-relaxed text-muted-foreground">
                              {item.agent.caveats.map((caveat) => (
                                <li key={caveat}>{caveat}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    {item.origin !== "agent" && item.actionPlan && (
                      <div className="mt-5 space-y-5">
                        {item.actionPlan.candidateId && (
                          <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs">
                            <span className="font-semibold">
                              Proposed option:{" "}
                            </span>
                            {item.alternatives.find(
                              (option) =>
                                option.id === item.actionPlan?.candidateId
                            )?.label ?? item.actionPlan.candidateId}
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-semibold">
                            What the planner should do
                          </h4>
                          <ol className="mt-3 space-y-3">
                            {item.actionPlan.steps.map((step, index) => (
                              <li
                                key={`${step.owner}-${index}`}
                                className="flex gap-3"
                              >
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                  {index + 1}
                                </span>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold">
                                    {step.owner}{" "}
                                    <span className="font-normal text-muted-foreground">
                                      · {step.when}
                                    </span>
                                  </p>
                                  <p className="mt-1 text-sm leading-relaxed">
                                    {step.task}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ol>
                        </div>
                        {item.actionPlan.prerequisites.length > 0 && (
                          <div className="border-t pt-4">
                            <h4 className="text-xs font-semibold">
                              Confirm before changing the plan
                            </h4>
                            <ul className="mt-2 list-disc space-y-2 pl-4 text-xs leading-relaxed text-muted-foreground">
                              {item.actionPlan.prerequisites.map(
                                (requirement) => (
                                  <li key={requirement}>{requirement}</li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                        <div className="rounded-lg border bg-muted/40 px-3 py-3">
                          <h4 className="text-xs font-semibold">
                            If this cannot proceed
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed">
                            {item.actionPlan.fallback}
                          </p>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {item.actionPlan.expectedEffect}
                        </p>
                      </div>
                    )}
                    <ul
                      className={cn(
                        "mt-4 space-y-2",
                        item.origin === "agent" && "hidden"
                      )}
                    >
                      {item.reasons.map((reason) => (
                        <li
                          key={reason}
                          className="flex gap-2 text-xs leading-relaxed text-muted-foreground"
                        >
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex items-center justify-between border-t pt-4">
                      <span className="text-xs text-muted-foreground">
                        {item.evidenceSeqs.length} source records
                      </span>
                      <Button
                        variant={
                          selected?.id === item.id ? "secondary" : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          setSelectedId(item.id)
                          setSelectedEvent(item.eventSeq)
                          setTraceOpen(true)
                        }}
                      >
                        <GitBranch />
                        Decision trace
                        <ArrowRight />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
            {selected && (
              <div className="rounded-xl border bg-card p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">Your decision</h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Acknowledge or dismiss the recommendation. This records your
                  review; it does not dispatch a vehicle or confirm a release.
                </p>
                {selected.status === "open" ? (
                  <>
                    <Label
                      htmlFor="decision-note"
                      className="mt-4 mb-2 block text-xs"
                    >
                      Review note
                    </Label>
                    <Textarea
                      id="decision-note"
                      value={note}
                      onChange={(event) => {
                        setNote(event.target.value)
                        if (selected) setSelectedId(selected.id)
                      }}
                      maxLength={1000}
                      placeholder="What did you decide, and why?"
                      rows={2}
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        disabled={busy || !!snapshot?.pending}
                        onClick={() => review("acknowledged")}
                      >
                        <Check />
                        Acknowledge
                      </Button>
                      <Button
                        variant="outline"
                        disabled={busy || !!snapshot?.pending}
                        onClick={() => review("dismissed")}
                      >
                        <X />
                        Dismiss
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="mt-3 text-sm">
                    {selected.reviewNote ??
                      "This assessment has been replaced by newer evidence."}
                  </p>
                )}
              </div>
            )}
          </section>
          <aside className="overflow-hidden rounded-xl border bg-card xl:sticky xl:top-5">
            <RepairPanel
              key={`${event?.seq}:${followingActive ? "pending" : selected?.id}`}
              eventSeq={event?.seq}
              vehicleId={
                (followingActive
                  ? null
                  : selected?.agent?.interpretation?.vehicleId) ??
                event?.vehicleId
              }
              repairAreas={
                followingActive
                  ? []
                  : selected?.agent?.interpretation?.repairAreas
              }
              repairArea={
                followingActive
                  ? null
                  : selected?.agent?.interpretation?.repairArea
              }
              service={selected?.service ?? event?.service ?? "network"}
              report={
                followingActive
                  ? undefined
                  : selected?.agent?.interpretation?.summary
              }
            />
            <div className="border-t p-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setTraceOpen(true)}
              >
                <GitBranch />
                Show decision trace
                <Badge variant="secondary" className="ml-auto">
                  {trace.length} steps
                </Badge>
              </Button>
            </div>
          </aside>
          <Dialog open={traceOpen} onOpenChange={setTraceOpen}>
            <DialogContent className="live-console max-h-[90vh] overflow-y-auto sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>Decision trace</DialogTitle>
                <DialogDescription>
                  Recorded evidence and checks, step by step.
                </DialogDescription>
              </DialogHeader>
              {trace.length === 0 ? (
                <div className="px-5 py-9">
                  <FileText className="mb-4 size-6 text-muted-foreground" />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Select a recommendation to inspect its trace. Every
                    evaluated event also retains its database queries, tool
                    results and model assessment.
                  </p>
                </div>
              ) : (
                <div className="max-h-[720px] overflow-y-auto px-5 py-5">
                  <div className="mb-5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Signal #
                      {followingActive
                        ? activeRun?.eventSeq
                        : (selected?.eventSeq ?? inspectedRun?.eventSeq)}
                    </span>
                    <Badge variant="outline">{trace.length} steps</Badge>
                  </div>
                  <ol className="space-y-0">
                    {trace.map((step, index) => (
                      <TraceItem
                        key={`${step.phase}-${index}`}
                        step={step}
                        index={index}
                        last={index === trace.length - 1}
                      />
                    ))}
                  </ol>
                  {!followingActive && selected?.alternatives.length ? (
                    <div className="mt-6 border-t pt-4">
                      <h3 className="mb-3 text-xs font-semibold">
                        {selected.origin === "agent"
                          ? "Plans the agent checked"
                          : "Earlier alternatives checked"}
                      </h3>
                      <div className="space-y-3">
                        {selected.alternatives.map((alternative) => (
                          <div
                            key={alternative.id}
                            className="rounded-lg border bg-muted/20 p-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs leading-relaxed font-medium">
                                {alternative.label}
                              </p>
                              <Badge
                                variant={
                                  alternative.status === "infeasible"
                                    ? "destructive"
                                    : "outline"
                                }
                                className="text-[10px] capitalize"
                              >
                                {alternative.status}
                              </Badge>
                            </div>
                            {[...new Set(alternative.conflicts)]
                              .slice(0, 3)
                              .map((conflict) => (
                                <p
                                  key={conflict}
                                  className="mt-2 text-xs leading-relaxed text-muted-foreground"
                                >
                                  {conflict}
                                </p>
                              ))}
                            {alternative.minSlackSeconds !== null && (
                              <p className="mt-2 text-xs text-muted-foreground">
                                Tightest turnaround margin:{" "}
                                {alternative.minSlackSeconds}s
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        Checks use the dated exercise baseline plus reported
                        fault holds. Current availability and future passenger
                        benefit remain unverified.
                      </p>
                    </div>
                  ) : null}
                  {selected?.origin !== "agent" && selected?.model.summary && (
                    <div className="mt-5 rounded-lg bg-primary/5 p-4">
                      <p className="mb-2 flex items-center gap-2 text-xs font-semibold">
                        <Sparkles className="size-3" />
                        {selected.model.status === "completed"
                          ? "OpenAI public summary"
                          : "Explanation status"}
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {selected.model.summary}
                      </p>
                    </div>
                  )}
                  {!followingActive && selected?.sourceHash && (
                    <p className="mt-5 text-[10px] leading-relaxed break-all text-muted-foreground">
                      Evidence snapshot: {selected.sourceHash}
                    </p>
                  )}
                </div>
              )}
              {event && (
                <div className="border-t px-5 py-4">
                  <Dialog>
                    <DialogTrigger
                      render={<Button variant="ghost" size="sm" />}
                    >
                      Source record #{event.seq}
                    </DialogTrigger>
                    <DialogContent className="live-console max-h-[85vh] overflow-y-auto sm:max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Source record #{event.seq}</DialogTitle>
                        <DialogDescription>
                          The committed event used by this evaluation.
                        </DialogDescription>
                      </DialogHeader>
                      <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-3 text-xs leading-relaxed whitespace-pre-wrap">
                        {JSON.stringify(event, null, 2)}
                      </pre>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
        {notice && (
          <div
            role="status"
            className="mt-5 flex items-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm"
          >
            <CheckCircle2 className="size-4 shrink-0 text-primary" />
            {notice}
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Dismiss notice"
              className="ml-auto"
              onClick={() => setNotice("")}
            >
              <X />
            </Button>
          </div>
        )}
        <footer className="mt-7 flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-xs text-muted-foreground">
          <span>
            Fictional bootcamp operations. Reported facts and source cutoffs
            stay visible.
          </span>
          <span className="flex items-center gap-1.5">
            <Database className="size-3" />
            Durable event log
            <ChevronRight className="size-3" />
            2-second database scan
            <ChevronRight className="size-3" />
            Live browser updates
          </span>
        </footer>
      </Content>
      <Dialog open={aiDialog} onOpenChange={setAiDialog}>
        <DialogContent className="live-console">
          <DialogHeader>
            <DialogTitle>OpenAI planning agent</DialogTitle>
            <DialogDescription>
              The agent investigates new records, queries operating history and
              fleet/driver context, and proposes the planner response. Retrieved
              database evidence is sent to OpenAI using the server API key.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Investigations are bounded to eight model requests and eighteen
            tools. New records remain queued when disabled. Code checks the
            agent's proposed assignments; it does not select a replacement
            recommendation. Nothing is dispatched automatically.
          </p>
          <Button
            onClick={async () => {
              await settings({ llmEnabled: !snapshot?.monitor.llmEnabled })
              setAiDialog(false)
            }}
            disabled={busy}
          >
            <Sparkles />
            {snapshot?.monitor.llmEnabled
              ? "Pause OpenAI agent"
              : "Enable OpenAI agent"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
function TraceItem({
  step,
  index,
  last,
}: {
  step: TraceStep
  index: number
  last: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  return (
    <li className="relative flex gap-3 pb-5">
      {!last && (
        <span className="absolute top-7 bottom-0 left-3.5 w-px bg-border" />
      )}
      <span
        className={cn(
          "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border bg-card text-xs font-semibold",
          step.outcome === "blocked"
            ? "border-destructive/30 text-destructive"
            : step.outcome === "warning"
              ? "border-chart-4/40 text-chart-4"
              : "text-primary"
        )}
      >
        {index + 1}
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted-foreground">
            {phaseLabels[step.phase]}
          </span>
          <time className="text-[10px] text-muted-foreground tabular-nums">
            {time(step.at)}
          </time>
        </div>
        <h3 className="mt-1 text-sm font-semibold">{step.title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {step.summary}
        </p>
        {(step.input !== undefined || step.output !== undefined) && (
          <>
            <Button
              variant="ghost"
              size="xs"
              className="mt-2 -ml-1"
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? <ChevronDown /> : <ChevronRight />}Inputs and results
            </Button>
            {expanded && (
              <pre className="mt-2 max-h-60 overflow-auto rounded-lg bg-muted p-3 text-[10px] leading-relaxed whitespace-pre-wrap">
                {JSON.stringify(
                  { input: step.input, output: step.output },
                  null,
                  2
                )}
              </pre>
            )}
          </>
        )}
      </div>
    </li>
  )
}

function EventComposer({
  onRecorded,
  services,
}: {
  onRecorded: (seq: number) => void
  services: string[]
}) {
  const [open, setOpen] = useState(false)
  const [service, setService] = useState("network")
  const [date, setDate] = useState("2026-10-07")
  const [at, setAt] = useState("07:20:00")
  const [details, setDetails] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    setSaving(true)
    try {
      const result = await post("/api/live/events", {
        service,
        serviceDate: date,
        details,
        occurredAt: `${date}T${at.length === 5 ? `${at}:00` : at}+08:00`,
      })
      onRecorded(result.event.seq)
      setDetails("")
      setOpen(false)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus />
        Record event
      </DialogTrigger>
      <DialogContent className="live-console max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Tell the agent what happened</DialogTitle>
          <DialogDescription>
            Your report is saved exactly as written. The agent identifies the
            signals, reads relevant records, and recommends a response.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <Label htmlFor="event-details" className="mb-2 block">
              Observation
            </Label>
            <Textarea
              id="event-details"
              required
              minLength={10}
              maxLength={4000}
              rows={6}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Service 238 has been arriving late for the last three mornings. Around 60 people were waiting at Toa Payoh at 07:15 today. Can we add capacity without disrupting other services?"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Include any service, vehicle, stop, time or counts you know. You
              can describe several issues in one report.
            </p>
          </div>
          <div>
            <Label className="mb-2 block">Service hint (optional)</Label>
            <Select
              value={service}
              onValueChange={(value) => setService(value ?? "network")}
            >
              <SelectTrigger aria-label="Event service" className="w-full">
                <SelectValue>
                  {service === "network" ? "Unspecified / network" : service}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="live-console">
                <SelectItem value="network">
                  Unspecified / network — let the agent identify it
                </SelectItem>
                {services.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-2 text-xs text-muted-foreground">
              Services come from database routes. Available operational detail
              varies by service.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="event-date" className="mb-2 block">
                Observation date
              </Label>
              <Input
                id="event-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="event-time" className="mb-2 block">
                Observed time (SGT)
              </Label>
              <Input
                id="event-time"
                type="time"
                step="1"
                required
                value={at}
                onChange={(e) => setAt(e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            The prototype uses dated bootcamp records. Observation time bounds
            the context the agent can read.
          </p>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="flex justify-end border-t pt-4">
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : <Database />}
              {saving ? "Recording…" : "Record event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
