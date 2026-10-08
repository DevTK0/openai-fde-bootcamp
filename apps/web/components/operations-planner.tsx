"use client"

import { PlanningPlanTimeline } from "@/components/planning-plan-timeline"
import { useEffect, useRef, useState } from "react"
import { z } from "zod"
import { Loader2, Play, Square, ChevronRight } from "lucide-react"
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
import { Pick, Notice } from "@/components/report-ui"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"
import {
  planningEventSchema,
  planningRequestSchema,
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

function Result({ report }: { report: PlanningReport }) {
  return (
    <section className="space-y-4" aria-label="Planning results">
      <h2 className="text-xl font-semibold">Recommended plans</h2>
      {report.search.searchLimited && (
        <p className="text-sm text-muted-foreground">
          This is a shortlist of evaluated options. Other workable plans may
          exist.
        </p>
      )}
      {report.recommendations.length === 0 ? (
        <Notice>{report.message}</Notice>
      ) : (
        report.recommendations.map((plan, index) => (
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
                  {plan.status === "conditional" ? "Conditional" : "Supported"}
                </Badge>
              </div>
              <CardDescription>{plan.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <PlanningPlanTimeline
                calendars={plan.calendars}
                original={report.affectedTrips}
                decisionAt={report.decisionAt}
              />
            </CardContent>
          </Card>
        ))
      )}
    </section>
  )
}

export function OperationsPlanner({ enabled }: { enabled: boolean }) {
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
    <SidebarProvider className="[--sidebar-width:16.5rem]">
      <DashboardSidebar
        view="operations-planner"
        workspace="planning"
        search=""
      />
      <SidebarInset className="min-w-0 bg-muted/35">
        <header className="flex h-16 items-center gap-3 border-b bg-background px-4 lg:px-8">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Planning
          </span>
          <ChevronRight className="size-3 text-muted-foreground" />
          <span className="text-xs font-medium">Operations planner</span>
        </header>
        <main className="mx-auto w-full max-w-400 space-y-6 p-4 lg:p-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Operations planner
            </h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Compare recovery plans and see how route, bus and crew schedules
              fit together. Recommendations are drafts; running the planner does
              not change assignments.
            </p>
          </header>
          {!enabled && (
            <Notice>
              The planner is not available yet. Contact your administrator to
              enable it.
            </Notice>
          )}
          <form onSubmit={submit} onChange={reset}>
            <fieldset disabled={busy} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Planning situation</CardTitle>
                  <CardDescription>
                    Choose a disruption to plan for. All times are Singapore
                    time.
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
                    requirements or change the comparison objective without
                    editing code.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="requirements">
                      Additional requirements
                    </Label>
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
                </CardContent>
              </Card>
              <Button type="submit" disabled={!enabled || !scenario}>
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
      </SidebarInset>
    </SidebarProvider>
  )
}
