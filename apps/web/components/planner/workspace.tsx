"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  BusFront,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Database,
  FileCheck2,
  LayoutDashboard,
  Loader2,
  RefreshCw,
  Save,
  Send,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  X,
} from "lucide-react"
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
import { Label } from "@workspace/ui/components/label"
import { Skeleton } from "@workspace/ui/components/skeleton"
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { Pick } from "@/components/report-ui"
import type {
  PlanningCandidate,
  PlanningMode,
  ScenarioKind,
  SourceReference,
} from "@/lib/planning/contracts"
import type {
  ScenarioResponse,
  ProposalRecord,
  AssistantResponse,
} from "@/lib/server/contracts"
import { cn } from "@workspace/ui/lib/utils"
import { LiveArrivals } from "./live-arrivals"

type WorkspaceData = ScenarioResponse
type SavedProposal = ProposalRecord
type AssistantResult = AssistantResponse

async function request<T>(url: string, body?: unknown): Promise<T> {
  const response = await fetch(
    url,
    body
      ? {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      : undefined
  )
  const result = await response.json().catch(() => {
    throw new Error(
      "The server could not complete this request. Reload and try again."
    )
  })
  if (!response.ok)
    throw new Error(
      result.error ?? result.message ?? "The request could not be completed."
    )
  return result as T
}

const dates = [
  "2026-10-05",
  "2026-10-06",
  "2026-10-07",
  "2026-10-08",
  "2026-10-09",
  "2026-10-12",
  "2026-10-13",
  "2026-10-14",
  "2026-10-15",
  "2026-10-16",
]
function clock(value: string) {
  return new Date(value).toLocaleTimeString("en-SG", {
    timeZone: "Asia/Singapore",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}
function day(value: string) {
  return new Date(`${value}T12:00:00+08:00`).toLocaleDateString("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Singapore",
  })
}
function number(value: number | null, digits = 0) {
  return value === null
    ? "—"
    : value.toLocaleString("en-SG", { maximumFractionDigits: digits })
}
function Status({ candidate }: { candidate: PlanningCandidate }) {
  return (
    <Badge
      variant={candidate.status === "infeasible" ? "destructive" : "outline"}
      className={cn(
        "capitalize",
        candidate.status === "feasible" &&
          "border-primary/20 bg-primary/10 text-primary"
      )}
    >
      {candidate.status === "feasible" ? <CheckCircle2 /> : <TriangleAlert />}
      {candidate.status}
    </Badge>
  )
}

export function PlannerWorkspace() {
  const [scenarioId, setScenarioId] = useState<ScenarioKind>(
    "service-235-recovery"
  )
  const [date, setDate] = useState("2026-10-07")
  const [mode, setMode] = useState<PlanningMode>("prospective")
  const [data, setData] = useState<WorkspaceData | null>(null)
  const [candidateId, setCandidateId] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [tab, setTab] = useState("compare")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState<AssistantResult | null>(null)
  const [asking, setAsking] = useState(false)
  const [assistantError, setAssistantError] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<SavedProposal[]>([])
  const [saveNotice, setSaveNotice] = useState("")
  const [reason, setReason] = useState("")
  const [evidence, setEvidence] = useState<SourceReference | null>(null)
  const [evidenceRecord, setEvidenceRecord] = useState<Record<
    string,
    unknown
  > | null>(null)
  const [evidenceMessage, setEvidenceMessage] = useState("")
  const [refresh, setRefresh] = useState(0)
  const assistantRequest = useRef(0)
  const candidateToOpen = useRef<string | null>(null)
  const candidate =
    data?.candidates.find((c) => c.id === candidateId) ?? data?.candidates[0]
  const baseline = data?.candidates[0]

  useEffect(() => {
    const controller = new AbortController()
    assistantRequest.current++
    setAsking(false)
    setLoading(true)
    setError("")
    setAnswer(null)
    setAssistantError("")
    setSaveNotice("")
    setEvidence(null)
    const params = new URLSearchParams({ scenario: scenarioId, date, mode })
    fetch(`/api/planning/scenarios?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json()
        if (!response.ok)
          throw new Error(result.error ?? "Could not load the scenario.")
        return result as WorkspaceData
      })
      .then((result) => {
        setData(result)
        const preferredCandidate = candidateToOpen.current
        candidateToOpen.current = null
        setCandidateId(
          result.candidates.find((c) => c.id === preferredCandidate)?.id ??
            result.candidates.find(
              (c) =>
                c.status === "feasible" && c.id !== result.candidates[0]?.id
            )?.id ??
            result.candidates[0]?.id ??
            ""
        )
      })
      .catch((e) => {
        if (!controller.signal.aborted) {
          setData(null)
          setError(e instanceof Error ? e.message : "Could not load scenario.")
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [scenarioId, date, mode, refresh])

  useEffect(() => {
    request<{ proposals: SavedProposal[] }>("/api/planning/proposals")
      .then((r) => setSaved(r.proposals))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!evidence) return
    const controller = new AbortController()
    setEvidenceRecord(null)
    setEvidenceMessage("Loading source record…")
    const params = new URLSearchParams({
      scenario: scenarioId,
      date,
      mode,
      table: evidence.table,
      recordId: evidence.recordId,
    })
    fetch(`/api/planning/evidence?${params}`, { signal: controller.signal })
      .then(async (r) => {
        const result = await r.json()
        if (!r.ok)
          throw new Error(result.error ?? "Source record is unavailable.")
        return result.record as Record<string, unknown>
      })
      .then((record) => {
        setEvidenceRecord(record)
        setEvidenceMessage("")
      })
      .catch((e) => {
        if (!controller.signal.aborted)
          setEvidenceMessage(
            e instanceof Error ? e.message : "Source record is unavailable."
          )
      })
    return () => controller.abort()
  }, [evidence, scenarioId, date, mode])

  async function ask(text = question) {
    if (!data || !text.trim()) return
    const currentRequest = ++assistantRequest.current
    setAsking(true)
    setAssistantError("")
    setAnswer(null)
    try {
      const response = await request<AssistantResult>(
        "/api/planning/assistant",
        { scenarioId, date, mode, question: text, candidateId: candidate?.id }
      )
      if (assistantRequest.current === currentRequest) setAnswer(response)
    } catch (e) {
      if (assistantRequest.current === currentRequest)
        setAssistantError(
          e instanceof Error
            ? e.message
            : "The assistant is unavailable. You can still compare plans."
        )
    } finally {
      if (assistantRequest.current === currentRequest) setAsking(false)
    }
  }

  async function save() {
    if (!candidate || !data) return
    setSaving(true)
    setSaveNotice("")
    try {
      await request("/api/planning/proposals", {
        scenarioId,
        date,
        mode,
        candidateId: candidate.id,
        sourceHash: data.fixture.sourceHash,
        idempotencyKey: crypto.randomUUID(),
      })
      const result = await request<{ proposals: SavedProposal[] }>(
        "/api/planning/proposals"
      )
      setSaved(result.proposals)
      setSaveNotice("Proposal saved. Review it in Saved decisions.")
    } catch (e) {
      setSaveNotice(
        e instanceof Error ? e.message : "Could not save this proposal."
      )
    } finally {
      setSaving(false)
    }
  }

  async function review(
    proposal: SavedProposal,
    status: "approved" | "rejected"
  ) {
    setSaving(true)
    setSaveNotice("")
    try {
      await request("/api/planning/review", {
        proposalId: proposal.id,
        expectedVersion: proposal.version,
        decision: status === "approved" ? "approve" : "reject",
        reason:
          reason.trim() ||
          (status === "approved"
            ? "Reviewed for the exercise; no dispatch instruction."
            : "Rejected after planner review."),
        idempotencyKey: crypto.randomUUID(),
      })
      const result = await request<{ proposals: SavedProposal[] }>(
        "/api/planning/proposals"
      )
      setSaved(result.proposals)
      setSaveNotice(
        status === "approved"
          ? "Exercise proposal approved. No operational instruction was sent."
          : "Proposal rejected."
      )
    } catch (e) {
      setSaveNotice(
        e instanceof Error ? e.message : "Could not review this proposal."
      )
    } finally {
      setSaving(false)
    }
  }

  function showEvidence(ref: SourceReference) {
    setEvidence(ref)
    setTab("evidence")
  }

  return (
    <SidebarProvider className="[--primary-foreground:oklch(0.98_0_0)] [--primary:oklch(0.38_0.08_165)] [--sidebar-width:15rem]">
      <Sidebar>
        <SidebarHeader className="px-5 py-6">
          <Link href="/planner" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <BusFront className="size-5" />
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight">
                LionLink<span className="text-primary">.</span>
              </p>
              <p className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                Operations workspace
              </p>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-3 pt-4">
          <p className="mb-2 px-3 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
            Workspace
          </p>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive
                className="h-11 gap-3 bg-primary/10 text-primary"
              >
                <CalendarClock />
                <span>Planning desk</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/dashboard" />}
                className="h-11 gap-3"
              >
                <LayoutDashboard />
                <span>Fleet dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <p className="mt-7 mb-2 px-3 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
            This session
          </p>
          <SidebarMenu>
            {(
              [
                {
                  value: "compare",
                  label: "Plan comparison",
                  icon: ShieldCheck,
                },
                {
                  value: "evidence",
                  label: "Resources & evidence",
                  icon: Database,
                },
                { value: "saved", label: "Saved decisions", icon: FileCheck2 },
              ] as const
            ).map((item) => (
              <SidebarMenuItem key={item.value}>
                <SidebarMenuButton
                  className="h-10 gap-3"
                  isActive={tab === item.value}
                  onClick={() => setTab(item.value)}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-5">
          <div className="rounded-xl border bg-card p-3 text-xs leading-relaxed">
            <div className="mb-2 flex items-center gap-2 font-medium">
              <ShieldCheck className="size-4 text-primary" />A planner makes the
              decision
            </div>
            <p className="text-muted-foreground">
              Engineering confirms release. Approved plans stay inside this
              exercise.
            </p>
          </div>
          <p className="mt-3 text-[10px] tracking-wide text-muted-foreground">
            BOOTCAMP PROTOTYPE · SINGAPORE TIME
          </p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-w-0 bg-muted/35">
        <header className="flex h-16 items-center justify-between gap-3 border-b bg-background px-4 lg:px-7">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <span className="text-xs text-muted-foreground">Operations</span>
            <ChevronRight className="size-3 text-muted-foreground" />
            <span className="text-xs font-medium">Planning desk</span>
          </div>
          <Badge variant="outline" className="gap-2">
            <span className="size-1.5 rounded-full bg-primary" />
            Exercise workspace
          </Badge>
        </header>
        <main className="mx-auto w-full max-w-400 space-y-6 p-4 lg:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-medium tracking-wide text-primary">
                PLAN WITH THE EVIDENCE
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">
                Every trip. Every constraint.
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Compare vehicle and driver assignments, understand the
                trade-offs, and keep a record of your decision.
              </p>
            </div>
            <Button
              nativeButton={false}
              variant="outline"
              render={<Link href="/dashboard" />}
            >
              <ArrowLeft />
              Fleet reports
            </Button>
          </div>
          <Card className="gap-0 py-4">
            <CardContent className="flex flex-wrap items-end gap-4">
              <div className="space-y-1.5">
                <Label>Planning scenario</Label>
                <Pick
                  label="Planning scenario"
                  value={scenarioId}
                  onChange={(v) => {
                    const id = v as ScenarioKind
                    setScenarioId(id)
                    setMode(
                      id === "service-235-recovery"
                        ? "prospective"
                        : "retrospective"
                    )
                    if (id === "service-235-recovery") setDate("2026-10-07")
                  }}
                  options={[
                    {
                      value: "service-235-recovery",
                      label: "235 · Morning recovery",
                    },
                    {
                      value: "service-238-timetable",
                      label: "238 · Timetable experiment",
                    },
                  ]}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Service date</Label>
                <Pick
                  label="Service date"
                  value={date}
                  onChange={setDate}
                  options={(scenarioId === "service-235-recovery"
                    ? ["2026-10-07", "2026-10-14"]
                    : dates
                  ).map((d) => ({ value: d, label: day(d) }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Evidence mode</Label>
                <Pick
                  label="Evidence mode"
                  value={mode}
                  onChange={(v) => setMode(v as PlanningMode)}
                  options={[
                    { value: "prospective", label: "Decision-time planning" },
                    { value: "retrospective", label: "Retrospective replay" },
                  ]}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                aria-label="Reload scenario"
                disabled={loading}
                onClick={() => setRefresh((x) => x + 1)}
              >
                <RefreshCw className={cn(loading && "animate-spin")} />
              </Button>
              {data && (
                <div className="ml-auto flex items-center gap-2 pb-1 text-xs text-muted-foreground">
                  <Clock3 className="size-4" />
                  Decision cutoff {clock(
                    data.fixture.scenario.sourceCutoffAt
                  )}{" "}
                  SGT
                </div>
              )}
            </CardContent>
          </Card>
          {error && (
            <div
              role="alert"
              className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm"
            >
              <TriangleAlert className="size-4 text-destructive" />
              {error}
              <Button
                variant="outline"
                onClick={() => setRefresh((x) => x + 1)}
              >
                Retry
              </Button>
            </div>
          )}
          {loading ? (
            <div
              aria-label="Loading planning scenario"
              className="grid gap-4 lg:grid-cols-3"
            >
              <Skeleton className="h-72 lg:col-span-2" />
              <Skeleton className="h-72" />
            </div>
          ) : (
            data &&
            candidate && (
              <>
                <div className="flex items-start gap-3 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-xs leading-relaxed">
                  <Database className="mt-0.5 size-4 shrink-0 text-primary" />
                  <p>
                    {mode === "prospective"
                      ? "Decision-time planning uses published timings and records available at the cutoff. Future observed running times and passenger counts stay hidden."
                      : "This is a bounded retrospective comparison using fictional observations. Modeled changes are not measured product results."}{" "}
                    Live public arrivals have their own clock and do not
                    establish LionLink vehicle availability.
                  </p>
                </div>
                <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
                  <Tabs
                    value={tab}
                    onValueChange={(v) => {
                      if (typeof v === "string") setTab(v)
                    }}
                    className="min-w-0 gap-5"
                  >
                    <TabsList className="max-w-full">
                      <TabsTrigger value="compare">Plan comparison</TabsTrigger>
                      <TabsTrigger value="evidence">Evidence</TabsTrigger>
                      <TabsTrigger value="saved">
                        Saved decisions{" "}
                        {saved.length > 0 && (
                          <Badge variant="secondary">{saved.length}</Badge>
                        )}
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="compare" className="space-y-5">
                      <div className="grid gap-3 md:grid-cols-3">
                        {data.candidates.map((c) => (
                          <Card
                            key={c.id}
                            className={cn(
                              "gap-3 transition-colors",
                              candidate.id === c.id &&
                                "border-primary ring-1 ring-primary/20"
                            )}
                          >
                            <CardHeader className="gap-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                                  {c.id === baseline?.id
                                    ? "Baseline"
                                    : "Alternative"}
                                </span>
                                <Status candidate={c} />
                              </div>
                              <CardTitle className="text-base">
                                {c.label}
                              </CardTitle>
                              <CardDescription className="min-h-14 text-xs leading-relaxed">
                                {c.summary}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                  Protected trips
                                </span>
                                <span className="font-medium">
                                  {c.metrics.protectedTrips} /{" "}
                                  {data.fixture.trips.length}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                  Constraint conflicts
                                </span>
                                <span
                                  className={cn(
                                    "font-medium",
                                    c.conflicts.length > 0 && "text-destructive"
                                  )}
                                >
                                  {c.conflicts.length}
                                </span>
                              </div>
                              <Button
                                className="w-full"
                                variant={
                                  candidate.id === c.id ? "default" : "outline"
                                }
                                onClick={() => {
                                  assistantRequest.current++
                                  setAsking(false)
                                  setCandidateId(c.id)
                                  setAnswer(null)
                                  setSaveNotice("")
                                }}
                              >
                                {candidate.id === c.id ? (
                                  <Check />
                                ) : (
                                  <ArrowRight />
                                )}
                                {candidate.id === c.id
                                  ? "Selected plan"
                                  : "Compare this plan"}
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <Card>
                        <CardHeader>
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <CardTitle>{candidate.label}</CardTitle>
                              <CardDescription className="mt-1">
                                {data.fixture.scenario.title} · {day(date)}
                              </CardDescription>
                            </div>
                            <Status candidate={candidate} />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-5">
                          <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted/50 p-4 md:grid-cols-4">
                            <Stat
                              label="Protected trips"
                              value={number(candidate.metrics.protectedTrips)}
                            />
                            <Stat
                              label="Minimum timing slack"
                              value={
                                candidate.minSlackSeconds === null
                                  ? "—"
                                  : `${number(candidate.minSlackSeconds)} sec`
                              }
                            />
                            <Stat
                              label="Origin waiting"
                              value={
                                candidate.metrics.originWaitingPersonSeconds ===
                                null
                                  ? "Not estimated"
                                  : `${number(candidate.metrics.originWaitingPersonSeconds / 60, 1)} person-min`
                              }
                            />
                            <Stat
                              label="Departure delay"
                              value={
                                candidate.metrics
                                  .positiveDepartureDelaySeconds === null
                                  ? "Not estimated"
                                  : `${number(candidate.metrics.positiveDepartureDelaySeconds / 60, 1)} bus-min`
                              }
                            />
                          </div>
                          {candidate.conflicts.length > 0 && (
                            <div className="space-y-2">
                              <h3 className="flex items-center gap-2 text-sm font-medium text-destructive">
                                <TriangleAlert className="size-4" />
                                Resolve {candidate.conflicts.length} constraint
                                conflicts
                              </h3>
                              {candidate.conflicts.map((c, i) => (
                                <div
                                  className="rounded-lg border border-destructive/15 bg-destructive/5 p-3 text-xs leading-relaxed"
                                  key={`${c.code}-${i}`}
                                >
                                  <p>
                                    <span className="font-medium">
                                      {c.code}
                                    </span>{" "}
                                    · {c.message}
                                  </p>
                                  <EvidenceButtons
                                    refs={c.evidence}
                                    onSelect={showEvidence}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          {candidate.warnings.length > 0 && (
                            <div className="space-y-2">
                              {candidate.warnings.map((w, i) => (
                                <div
                                  className="rounded-lg border bg-muted/35 p-3 text-xs leading-relaxed"
                                  key={`${w.code}-${i}`}
                                >
                                  <p className="flex items-start gap-2">
                                    <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                                    {w.message}
                                  </p>
                                  <EvidenceButtons
                                    refs={w.evidence}
                                    onSelect={showEvidence}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          <div>
                            <h3 className="mb-3 text-sm font-medium">
                              Departure and resource timeline
                            </h3>
                            <div className="max-h-100 overflow-auto rounded-lg border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Trip / route</TableHead>
                                    <TableHead>Departure</TableHead>
                                    <TableHead>Arrival</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Driver</TableHead>
                                    <TableHead>Change</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {candidate.assignments.map((a) => {
                                    const original = baseline?.assignments.find(
                                      (b) => b.tripId === a.tripId
                                    )
                                    const changed =
                                      original &&
                                      (original.crewId !== a.crewId ||
                                        original.vehicleId !== a.vehicleId ||
                                        original.departureAt !== a.departureAt)
                                    return (
                                      <TableRow
                                        key={a.tripId}
                                        className={cn(
                                          changed && "bg-primary/5"
                                        )}
                                      >
                                        <TableCell>
                                          <p className="font-medium">
                                            {a.serviceNo} ·{" "}
                                            {a.tripId.split("-").at(-1)}
                                          </p>
                                          <p className="text-[10px] text-muted-foreground">
                                            {a.routeId}
                                          </p>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                          {clock(a.departureAt)}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                          {clock(a.arrivalAt)}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                          {a.vehicleId}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                          {a.crewId}
                                        </TableCell>
                                        <TableCell>
                                          {changed ? (
                                            <Badge
                                              variant="outline"
                                              className="text-primary"
                                            >
                                              Changed
                                            </Badge>
                                          ) : (
                                            <span className="text-xs text-muted-foreground">
                                              Retained
                                            </span>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    )
                                  })}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">
                              Planning assumptions
                            </h3>
                            <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground">
                              {candidate.assumptions.map((a) => (
                                <li key={a}>{a}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
                              Save the proposal to review it. Only a feasible
                              plan can be approved for this exercise.
                            </p>
                            <Button disabled={saving} onClick={save}>
                              {saving ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                <Save />
                              )}
                              Save proposal
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="evidence" className="space-y-5">
                      <Card>
                        <CardHeader>
                          <CardTitle>Records behind the plan</CardTitle>
                          <CardDescription>
                            Only records admitted by the decision cutoff can
                            authorize a resource.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/40 p-4">
                            <Stat
                              label="Vehicle readiness"
                              value={String(
                                data.fixture.vehicleReadiness.length
                              )}
                            />
                            <Stat
                              label="Driver duties"
                              value={String(data.fixture.crewDuties.length)}
                            />
                            <Stat
                              label="Related trips"
                              value={String(data.fixture.relatedTrips.length)}
                            />
                          </div>
                          {data.fixture.warnings.map((w, i) => (
                            <p
                              key={i}
                              className="text-xs leading-relaxed text-muted-foreground"
                            >
                              {w.message}
                            </p>
                          ))}
                          <EvidenceButtons
                            refs={candidate.evidence}
                            onSelect={showEvidence}
                          />
                          {evidence && (
                            <div className="rounded-lg border p-4">
                              <h3 className="mb-3 text-sm font-medium">
                                {evidence.table} · {evidence.recordId}
                              </h3>
                              {evidenceRecord ? (
                                <pre className="max-h-80 overflow-auto text-xs leading-relaxed whitespace-pre-wrap">
                                  {JSON.stringify(evidenceRecord, null, 2)}
                                </pre>
                              ) : (
                                <p
                                  role="status"
                                  className="text-xs text-muted-foreground"
                                >
                                  {evidenceMessage}
                                </p>
                              )}
                            </div>
                          )}
                          <h3 className="text-sm font-medium">
                            Operating rules
                          </h3>
                          {data.fixture.planningConstraints.map((r, i) => (
                            <div
                              key={i}
                              className="rounded-lg border p-3 text-xs leading-relaxed"
                            >
                              <p className="mb-1 font-medium">
                                {String(r.constraint_id)}
                              </p>
                              <p className="text-muted-foreground">
                                {String(r.requirement)}
                              </p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="saved" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Saved decisions</CardTitle>
                          <CardDescription>
                            Proposals and review decisions persist on this
                            server. Approval never dispatches a bus.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="review-reason">Review note</Label>
                            <Input
                              id="review-reason"
                              value={reason}
                              maxLength={1000}
                              onChange={(e) => setReason(e.target.value)}
                              placeholder="Why is this proposal accepted or rejected?"
                            />
                          </div>
                          {saved.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-10 text-center">
                              <FileCheck2 className="size-8 text-muted-foreground" />
                              <h3 className="font-medium">
                                Your first decision starts here
                              </h3>
                              <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
                                Select a plan in the comparison, save it, then
                                record your review.
                              </p>
                              <Button
                                variant="outline"
                                onClick={() => setTab("compare")}
                              >
                                Compare plans
                                <ArrowRight />
                              </Button>
                            </div>
                          ) : (
                            saved.map((p) => (
                              <div key={p.id} className="rounded-xl border p-4">
                                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                  <h3 className="text-sm font-medium">
                                    {p.candidate?.label ?? p.candidateId}
                                  </h3>
                                  <Badge
                                    variant={
                                      p.status === "approved"
                                        ? "default"
                                        : "outline"
                                    }
                                    className="capitalize"
                                  >
                                    {p.status}
                                  </Badge>
                                </div>
                                <p className="mb-3 text-xs text-muted-foreground">
                                  {p.date} · {p.mode} · version {p.version}
                                </p>
                                {p.reason && (
                                  <p className="mb-3 text-xs leading-relaxed">
                                    {p.reason}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      candidateToOpen.current = p.candidateId
                                      setRefresh((value) => value + 1)
                                      setScenarioId(
                                        p.scenarioId as ScenarioKind
                                      )
                                      setDate(p.date)
                                      setMode(p.mode)
                                      setTab("compare")
                                    }}
                                  >
                                    Open scenario
                                  </Button>
                                  {p.status === "draft" && (
                                    <>
                                      <Button
                                        size="sm"
                                        disabled={
                                          saving ||
                                          p.candidate?.status !== "feasible"
                                        }
                                        onClick={() => review(p, "approved")}
                                      >
                                        <Check />
                                        Approve exercise plan
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={saving}
                                        onClick={() => review(p, "rejected")}
                                      >
                                        <X />
                                        Reject
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    {saveNotice && (
                      <div
                        role="status"
                        className="rounded-lg border bg-card p-3 text-sm"
                      >
                        {saveNotice}
                      </div>
                    )}
                  </Tabs>
                  <aside className="space-y-5">
                    <Card className="border-primary/20">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Sparkles className="size-4" />
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              Planning copilot
                            </CardTitle>
                            <CardDescription className="text-xs">
                              Ask about this scenario
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          The copilot checks planning tools and explains their
                          results. Your approval stays in your hands.
                        </p>
                        <div className="space-y-2">
                          {[
                            "Explain the selected plan and its risks",
                            "Which listed alternative is feasible?",
                            "What evidence confirms vehicle release?",
                          ].map((q) => (
                            <Button
                              key={q}
                              variant="outline"
                              className="h-auto w-full justify-start py-2 text-left text-xs whitespace-normal"
                              disabled={asking}
                              onClick={() => {
                                setQuestion(q)
                                void ask(q)
                              }}
                            >
                              <Bot className="shrink-0" />
                              {q}
                            </Button>
                          ))}
                        </div>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            void ask()
                          }}
                          className="space-y-2"
                        >
                          <Label htmlFor="planner-question" className="sr-only">
                            Question for the planning copilot
                          </Label>
                          <Input
                            id="planner-question"
                            value={question}
                            maxLength={2000}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Ask about assignments or constraints…"
                            disabled={asking}
                          />
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={asking || !question.trim()}
                          >
                            {asking ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <Send />
                            )}
                            {asking ? "Checking the evidence…" : "Ask copilot"}
                          </Button>
                        </form>
                        {assistantError && (
                          <p
                            role="alert"
                            className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs leading-relaxed"
                          >
                            {assistantError}
                          </p>
                        )}
                        {answer && (
                          <div
                            aria-live="polite"
                            className="space-y-3 rounded-lg bg-muted/40 p-3"
                          >
                            <p className="text-xs leading-relaxed whitespace-pre-wrap">
                              {answer.answer}
                            </p>
                            <EvidenceButtons
                              refs={answer.evidence ?? []}
                              onSelect={showEvidence}
                            />
                            {answer.toolCalls && (
                              <p className="text-[10px] text-muted-foreground">
                                Checks used: {answer.toolCalls.join(" · ")}
                              </p>
                            )}
                            {answer.model && (
                              <p className="text-[10px] text-muted-foreground">
                                {answer.model}
                              </p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <LiveArrivals service={data.fixture.scenario.service} />
                  </aside>
                </div>
              </>
            )
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-[11px] text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tracking-tight">{value}</p>
    </div>
  )
}
function EvidenceButtons({
  refs,
  onSelect,
}: {
  refs: SourceReference[]
  onSelect: (ref: SourceReference) => void
}) {
  const unique = [
    ...new Map(refs.map((r) => [`${r.table}:${r.recordId}`, r])).values(),
  ]
  return unique.length > 0 ? (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {unique.slice(0, 12).map((r) => (
        <Button
          variant="link"
          size="xs"
          className="h-auto px-0 text-[10px]"
          key={`${r.table}:${r.recordId}`}
          onClick={() => onSelect(r)}
        >
          <Database className="size-3" />
          {r.recordId}
        </Button>
      ))}
      {unique.length > 12 && (
        <span className="text-[10px] text-muted-foreground">
          +{unique.length - 12} source references
        </span>
      )}
    </div>
  ) : null
}
