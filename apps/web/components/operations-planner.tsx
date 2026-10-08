"use client"

import Link from "next/link"
import { PlanningResourceTimeline } from "@/components/planning-resource-timeline"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@workspace/ui/components/collapsible"
import { useEffect, useRef, useState } from "react"
import { z } from "zod"
import {
  ArrowLeft,
  Download,
  Loader2,
  Play,
  Square,
  BusFront,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
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
import { Pick, Metric, Notice } from "@/components/report-ui"
import {
  planningEventSchema,
  planningRequestSchema,
  type PlanningCatalog,
  type PlanningReport,
} from "@/lib/planning-schema"

type RunState =
  | { kind: "idle" }
  | { kind: "running"; message: string }
  | { kind: "complete"; report: PlanningReport }
  | { kind: "error"; message: string }
  | { kind: "cancelled" }
const scenarios = [
  { value: "toa_bus", label: "Toa Payoh bus withdrawal" },
  { value: "amk_bus", label: "Ang Mo Kio bus withdrawal" },
  { value: "toa_crew", label: "Toa Payoh relief crew sickness" },
]
const descriptions: Record<string, string> = {
  toa_bus:
    "5 October 2026, 09:25. Withdraw NW-V001 after its current trip. Reallocate later trips across routes 231, 232, 235 and 238 using listed buses and qualified crews.",
  amk_bus:
    "5 October 2026, 09:25. Withdraw NW-V031 after its current trip. Reallocate later trips across routes 261, 262 and 269 using listed buses and qualified crews.",
  toa_crew:
    "5 October 2026, 09:25. NW-C062 is sick before relief duty. Reallocate later trips across routes 231, 232, 235 and 238, including the uncovered route 232 duty.",
}

function clock(value: string | null) {
  if (!value) return "Not established"
  const date = new Date(value)
  return Number.isNaN(date.valueOf())
    ? value
    : date.toLocaleTimeString("en-SG", {
        timeZone: "Asia/Singapore",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
}

function Assignments({ rows }: { rows: PlanningReport["affectedTrips"] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Trip / route</TableHead>
          <TableHead>Bus</TableHead>
          <TableHead>Crew</TableHead>
          <TableHead>Departure</TableHead>
          <TableHead>Arrival</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.trip}>
            <TableCell>
              <span className="block text-xs text-muted-foreground">
                {row.trip}
              </span>
              {row.route}
            </TableCell>
            <TableCell>{row.bus}</TableCell>
            <TableCell>{row.crew}</TableCell>
            <TableCell>{clock(row.departure)}</TableCell>
            <TableCell>{clock(row.arrival)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function Result({ report }: { report: PlanningReport }) {
  return (
    <section className="space-y-5" aria-label="Planning results">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">{report.title}</h2>
          <p className="text-sm text-muted-foreground">
            Decision at {report.decisionAt.replace("T", " ")} · Draft proposals
          </p>
        </div>
        <Button
          variant="outline"
          nativeButton={false}
          render={<a href={`/api/planning?run=${report.runId}`} />}
        >
          <Download />
          Download run evidence
        </Button>
      </div>
      <Notice>
        {report.message}
        {report.search.searchLimited && (
          <p className="mt-2 font-medium">
            The combination search reached its limit. This shortlist is not
            exhaustive.
          </p>
        )}
      </Notice>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          title="Proposals considered"
          value={report.search.candidateCount.toLocaleString()}
          detail="Generated from the supplied resources"
        />
        <Metric
          title="Availability exclusions"
          value={report.physicalExclusions.length.toLocaleString()}
          detail="Deterministic checks before model calls"
        />
        <Metric
          title="Plans screened"
          value={report.assessments.length.toLocaleString()}
          detail={
            report.policyEvaluation
              ? `${report.policyEvaluation.apiCalls} policy calls; ${report.policyEvaluation.reusedChecks} identical checks reused`
              : "Written requirements assessed by Decisions"
          }
        />
        <Metric
          title="Tournament entrants"
          value={report.assessments
            .filter((a) => a.status === "eligible")
            .length.toLocaleString()}
          detail="Distinct complete plans approved for comparison"
        />
        <Metric
          title="Comparison calls"
          value={report.rounds.length.toLocaleString()}
          detail="Lone survivors need no comparison"
        />
      </div>
      <Tabs defaultValue="recommendations">
        <TabsList className="flex-wrap group-data-horizontal/tabs:h-auto [&>[data-slot=tabs-trigger]]:h-7">
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="affected">Affected timetable</TabsTrigger>
          <TabsTrigger value="checks">Availability & policies</TabsTrigger>
          <TabsTrigger value="rounds">Comparison rounds</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>
        <TabsContent value="recommendations" className="space-y-4">
          {report.recommendations.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>No supported complete plan</CardTitle>
                <CardDescription>
                  Use the availability checks and source evidence to identify
                  the next information or confirmed resource needed.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
          {report.recommendations.map((plan, index) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{index + 1}</Badge>
                  <CardTitle>{plan.title}</CardTitle>
                  <Badge
                    variant={
                      plan.status === "conditional" ? "secondary" : "default"
                    }
                  >
                    {plan.status === "conditional"
                      ? "Conditional"
                      : "Supported"}
                  </Badge>
                </div>
                <CardDescription>{plan.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <PlanningResourceTimeline
                  calendars={plan.calendars}
                  original={report.affectedTrips}
                  decisionAt={report.decisionAt}
                />
                {plan.assignments.length > 0 && (
                  <Collapsible>
                    <CollapsibleTrigger render={<Button variant="outline" />}>
                      View complete assignment table
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-3">
                      <Assignments rows={plan.assignments} />
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="affected">
          {report.affectedTrips.length ? (
            <Assignments rows={report.affectedTrips} />
          ) : (
            <Notice>
              The imported scenario's protected commitments are included in the
              source evidence download.
            </Notice>
          )}
        </TabsContent>
        <TabsContent value="checks" className="space-y-4">
          <Notice>
            {report.search.scope} This run considered{" "}
            {report.search.resourcesConsidered.buses} bus profiles and{" "}
            {report.search.resourcesConsidered.crews} crew profiles.
          </Notice>
          {report.policies.map((policy) => (
            <Card key={policy.id}>
              <CardHeader>
                <CardTitle className="text-sm">{policy.id}</CardTitle>
                <CardDescription>{policy.requirement}</CardDescription>
              </CardHeader>
            </Card>
          ))}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proposal</TableHead>
                <TableHead>Policy assessment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.assessments.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.id}</TableCell>
                  <TableCell>
                    {a.status}
                    {a.reason && (
                      <span className="block text-xs text-muted-foreground">
                        {a.reason}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <h3 className="font-medium">Availability exclusions</h3>
          <p className="text-sm text-muted-foreground">
            Showing the first 50 proposals. The evidence download retains every
            exclusion.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proposal</TableHead>
                <TableHead>Source facts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.physicalExclusions.slice(0, 50).map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    {Array.from(
                      new Set(
                        item.reasons.map((r) => `${r.resourceId}: ${r.message}`)
                      )
                    ).join("; ")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="rounds">
          {report.rounds.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Round</TableHead>
                  <TableHead>Compared proposals</TableHead>
                  <TableHead>Selected</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.rounds.map((round, index) => (
                  <TableRow key={index}>
                    <TableCell>{round.phase}</TableCell>
                    <TableCell>{round.inputIds.join(", ")}</TableCell>
                    <TableCell>{round.selectedId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Notice>
              There were fewer than two eligible survivors, so no comparison was
              needed.
            </Notice>
          )}
        </TabsContent>
        <TabsContent value="sources">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Rows</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.sources.map((source) => (
                <TableRow key={source.id}>
                  <TableCell>{source.title}</TableCell>
                  <TableCell>{source.rowCount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </section>
  )
}

export function OperationsPlanner({ catalog }: { catalog: PlanningCatalog }) {
  const [scenario, setScenario] = useState("toa_bus")
  const [accessKey, setAccessKey] = useState("")
  const [requirements, setRequirements] = useState("")
  const [objective, setObjective] = useState("")
  const [state, setState] = useState<RunState>({ kind: "idle" })
  const abort = useRef<AbortController | null>(null)
  useEffect(() => () => abort.current?.abort(), [])
  const busy = state.kind === "running"
  function reset() {
    setState({ kind: "idle" })
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    const parsed = planningRequestSchema.safeParse({
      kind: "coordinated",
      scenario,
      requirements,
      objective,
    })
    if (!parsed.success)
      return setState({
        kind: "error",
        message: parsed.error.issues.map((issue) => issue.message).join(" "),
      })
    const controller = new AbortController()
    abort.current = controller
    setState({
      kind: "running",
      message: "Preparing the scenario and resource calendars.",
    })
    try {
      const response = await fetch("/api/planning", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessKey ? { Authorization: `Bearer ${accessKey}` } : {}),
        },
        body: JSON.stringify(parsed.data),
        signal: controller.signal,
      })
      if (!response.ok || !response.body) {
        const error = z
          .object({ error: z.string() })
          .safeParse(await response.json())
        throw new Error(
          error.success ? error.data.error : "The planning request failed."
        )
      }
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let pending = ""
      let completed = false
      function consume(line: string) {
        const value: unknown = JSON.parse(line)
        const item = planningEventSchema.parse(value)
        if (item.type === "progress")
          setState({ kind: "running", message: item.message })
        else if (item.type === "result") {
          completed = true
          setState({ kind: "complete", report: item.report })
        } else {
          completed = true
          setState({ kind: "error", message: item.message })
        }
      }
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        pending += decoder.decode(value, { stream: true })
        let end = pending.indexOf("\n")
        while (end !== -1) {
          consume(pending.slice(0, end))
          pending = pending.slice(end + 1)
          end = pending.indexOf("\n")
        }
      }
      pending += decoder.decode()
      if (pending.trim()) consume(pending)
      if (!completed)
        throw new Error(
          "The planner stopped before returning a result. No complete recommendation was produced."
        )
    } catch (error) {
      setState(
        controller.signal.aborted
          ? { kind: "cancelled" }
          : {
              kind: "error",
              message:
                error instanceof Error ? error.message : "Planning failed.",
            }
      )
    } finally {
      abort.current = null
    }
  }
  return (
    <main className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      <Button
        nativeButton={false}
        variant="ghost"
        render={<Link href="/dashboard" />}
      >
        <ArrowLeft />
        Fleet dashboard
      </Button>
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <BusFront className="size-7 text-primary" />
          <h1 className="text-3xl font-semibold tracking-tight">
            Operations planner
          </h1>
          <Badge variant="secondary">Draft planning</Badge>
        </div>
        <p className="max-w-3xl text-muted-foreground">
          Compare recovery options using complete resource schedules and
          plain-text operating requirements. Proposals do not change the source
          roster or dispatch resources.
        </p>
        <p className="text-sm text-muted-foreground">
          {catalog.coverage.trips.toLocaleString()} trips ·{" "}
          {catalog.coverage.vehicles} buses ·{" "}
          {catalog.coverage.crewRecords.toLocaleString()} crew-day records ·{" "}
          {catalog.dates.length} dates · {catalog.routes.length} route
          directions · {catalog.coverage.handoutDatasets} imported datasets
        </p>
      </header>
      {!catalog.keyConfigured && (
        <Notice>
          Configure OPENAI_API_KEY or OPENAI_ENV_FILE on the server to run live
          Decisions comparisons.
        </Notice>
      )}
      <form onSubmit={submit} onChange={reset}>
        <fieldset disabled={busy} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Planning situation</CardTitle>
              <CardDescription>
                All times are Singapore time. Compare complete route, bus and
                crew allocations. These hypothetical disruptions use existing
                SQLite resources without adding spares.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label>Situation</Label>
                <Pick
                  label="Situation"
                  value={scenario}
                  options={scenarios}
                  onChange={(value) => {
                    setScenario(value)
                    reset()
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground sm:col-span-1 lg:col-span-3">
                {descriptions[scenario]}
              </p>
            </CardContent>
          </Card>
          <div className="max-w-sm space-y-2">
            <Label htmlFor="planner-access">Planner access key</Label>
            <Input
              id="planner-access"
              type="password"
              autoComplete="off"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              placeholder="Required for your first run in this browser"
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Operating requirements</CardTitle>
              <CardDescription>
                The database requirements remain in force. Add scenario
                requirements or change the comparison objective without editing
                code.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="requirements">Additional requirements</Label>
                <Textarea
                  id="requirements"
                  rows={4}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="For example: Every affected trip must have at least two wheelchair spaces."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="objective">Ranking objective</Label>
                <Textarea
                  id="objective"
                  rows={4}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Default: minimize changed crew assignments, then changed bus assignments. You can change that priority here."
                />
              </div>
              <div className="lg:col-span-2">
                <Tabs defaultValue="summary">
                  <TabsList>
                    <TabsTrigger value="summary">
                      Source policy scope
                    </TabsTrigger>
                    <TabsTrigger value="policies">
                      Read source policies
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="summary">
                    <p className="text-sm text-muted-foreground">
                      Listed resources, complete route coverage, turnaround,
                      qualifications, protected breaks, duty limits and
                      information known at the decision time.
                    </p>
                  </TabsContent>
                  <TabsContent value="policies" className="space-y-3">
                    {catalog.policies.map((policy) => (
                      <p key={policy.id} className="text-sm">
                        <span className="font-medium">{policy.id}. </span>
                        {policy.requirement}
                      </p>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
          <Button type="submit" disabled={!catalog.keyConfigured || !scenario}>
            <Play />
            Compare plans
          </Button>
        </fieldset>
      </form>
      {busy && (
        <div
          role="status"
          className="flex flex-wrap items-center gap-3 rounded-lg border p-4"
        >
          <Loader2 className="size-4 animate-spin" />
          <p className="flex-1 text-sm">{state.message}</p>
          <Button variant="outline" onClick={() => abort.current?.abort()}>
            <Square />
            Cancel run
          </Button>
        </div>
      )}
      {state.kind === "error" && (
        <div role="alert">
          <Notice>{state.message}</Notice>
        </div>
      )}
      {state.kind === "cancelled" && (
        <Notice>
          Planning was cancelled. The source database is unchanged.
        </Notice>
      )}
      {state.kind === "complete" && <Result report={state.report} />}
    </main>
  )
}
