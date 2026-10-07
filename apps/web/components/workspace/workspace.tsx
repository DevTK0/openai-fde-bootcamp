"use client"
import { useState } from "react"
import Link from "next/link"
import {
  Activity,
  Database,
  ArrowUpRight,
  Upload,
  RefreshCw,
} from "lucide-react"
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
import { Pick } from "@/components/report-ui"
import type { summary, saveBundle } from "@/lib/evidence/store"
import type { EvidenceAnalysis } from "@/lib/evidence/analysis"
import type { EvidenceFilters } from "@/lib/evidence/schema"
import { problems } from "./problems"
import { requestJson, useResource } from "./use-resource"
import { AnalysisView } from "./analysis-view"
import { RecordsPanel } from "./records-panel"
import { ContextPanel } from "./context-panel"

type Revision = ReturnType<typeof summary>
const emptyFilters: EvidenceFilters = {
  vehicle: "",
  service: "",
  from: "",
  to: "",
}
export function Workspace({
  initialRevisions,
  initialRevision,
}: {
  initialRevisions: Revision[]
  initialRevision?: string
}) {
  const [revisions, setRevisions] = useState(initialRevisions)
  const [revision, setRevision] = useState(
    initialRevision ?? initialRevisions[0]?.id ?? ""
  )
  const [filters, setFilters] = useState(emptyFilters)
  const [problemId, setProblemId] = useState("repair-spend")
  const [notice, setNotice] = useState("")
  const [uploading, setUploading] = useState(false)
  const [table, setTable] = useState({ id: "", serial: 0 })
  const problem = problems.find((item) => item.id === problemId) ?? problems[0]
  const scope = new URLSearchParams(filters).toString()
  const analysis = useResource<EvidenceAnalysis>(
    revision ? `/api/workspace/${revision}?${scope}` : ""
  )
  function selectRevision(value: string) {
    setRevision(value)
    setFilters(emptyFilters)
    setTable({ id: "", serial: 0 })
    const url = new URL(window.location.href)
    url.searchParams.set("revision", value)
    window.history.replaceState(null, "", url)
  }
  async function refresh() {
    try {
      const result = await requestJson<{ revisions: Revision[] }>(
        "/api/workspace"
      )
      setRevisions(result.revisions)
      setNotice("Revision list refreshed.")
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Refresh failed")
    }
  }
  async function upload(file: File) {
    setUploading(true)
    setNotice("")
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error("Import exceeds 5 MiB")
      const result = await requestJson<Awaited<ReturnType<typeof saveBundle>>>(
        "/api/workspace",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: await file.text(),
        }
      )
      setRevisions((current) => [
        result.revision,
        ...current.filter((item) => item.id !== result.revision.id),
      ])
      selectRevision(result.revision.id)
      setNotice(
        result.created
          ? "Import complete. Analysis now uses the new revision."
          : "Already imported. Restored the existing revision without duplication."
      )
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Import failed")
    } finally {
      setUploading(false)
    }
  }
  if (!problem) return null
  return (
    <main className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary p-2.5 text-primary-foreground">
              <Activity className="size-5" />
            </div>
            <div>
              <p className="text-xs tracking-widest text-muted-foreground uppercase">
                Fleet intelligence
              </p>
              <h1 className="text-xl font-semibold tracking-tight">
                Decision workspace
              </h1>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Historical fixture reports
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-[1600px] space-y-6 p-5 lg:p-8">
        <section
          aria-label="Dataset scope"
          className="space-y-4 rounded-xl border bg-card p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Database className="size-4" /> IMMUTABLE DATA REVISION
              </div>
              <Pick
                label="Data revision"
                value={revision}
                options={revisions.map((item) => ({
                  value: item.id,
                  label: `${item.name}${item.seed ? " · supplied fixture" : ""}`,
                }))}
                onChange={selectRevision}
              />
              <p className="font-mono text-xs text-muted-foreground">
                {revision.slice(0, 12)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={refresh}>
                <RefreshCw className="size-4" />
                Refresh revisions
              </Button>
              <Button
                variant="outline"
                render={<a href="/evidence/example-bundle.json" download />}
              >
                Download sample JSON
              </Button>
            </div>
          </div>
          <details className="text-sm">
            <summary className="cursor-pointer font-medium">
              Import new evidence
            </summary>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bundle">Upload evidence bundle</Label>
                <Input
                  id="bundle"
                  aria-label="Upload evidence bundle"
                  type="file"
                  accept=".json,application/json"
                  disabled={uploading}
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) void upload(file)
                    event.target.value = ""
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  <Upload className="mr-1 inline size-3" />
                  {uploading
                    ? "Validating and importing…"
                    : "JSON, up to 5 MiB. Import creates an immutable revision."}
                </p>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Start with the sample. Use schemaVersion 1, name, description,
                sources and tables. Each source needs an ID, evidence kind,
                reference, caveats and text. Each table needs unique row IDs and
                declared columns. Only one canonical maintenance table and one
                operations table are allowed. Put overlapping summaries, plans
                and quotes in evidence tables. Use null for missing measures.
              </p>
            </div>
          </details>
          {notice && (
            <p role="status" className="rounded-md bg-muted p-3 text-sm">
              {notice}
            </p>
          )}
        </section>
        <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="space-y-5" aria-label="Stakeholder questions">
            <div>
              <h2 className="font-semibold">Choose a decision</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                11 questions across the supplied docs and slides.
              </p>
            </div>
            {(["Maintenance", "Scheduling", "Ridership"] as const).map(
              (group) => (
                <div key={group} className="space-y-1">
                  <h3 className="mb-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    {group}
                  </h3>
                  {problems
                    .filter((item) => item.group === group)
                    .map((item) => (
                      <Button
                        key={item.id}
                        variant={problem.id === item.id ? "secondary" : "ghost"}
                        className="h-auto w-full justify-start px-3 py-2.5 text-left text-xs leading-relaxed whitespace-normal"
                        aria-pressed={problem.id === item.id}
                        onClick={() => {
                          setProblemId(item.id)
                          setTable({ id: "", serial: 0 })
                        }}
                      >
                        {item.title}
                      </Button>
                    ))}
                </div>
              )
            )}
          </aside>
          <div className="min-w-0 space-y-5">
            <div className="space-y-2">
              <Badge variant="outline">{problem.stakeholder}</Badge>
              <h2 className="text-2xl font-semibold tracking-tight">
                {problem.decision}
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Compare the observations, test an explanation, then decide what
                evidence to request.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-1">
                <Label htmlFor="scope-from">From</Label>
                <Input
                  id="scope-from"
                  type="date"
                  value={filters.from}
                  onChange={(event) =>
                    setFilters({ ...filters, from: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="scope-to">To</Label>
                <Input
                  id="scope-to"
                  type="date"
                  value={filters.to}
                  onChange={(event) =>
                    setFilters({ ...filters, to: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Vehicle</Label>
                <Pick
                  label="Vehicle filter"
                  value={filters.vehicle || "all"}
                  options={[
                    { value: "all", label: "All vehicles" },
                    ...(analysis.status === "ready"
                      ? analysis.data.availableFilters.vehicles.map(
                          (value) => ({ value, label: value })
                        )
                      : filters.vehicle
                        ? [{ value: filters.vehicle, label: filters.vehicle }]
                        : []),
                  ]}
                  onChange={(value) =>
                    setFilters({
                      ...filters,
                      vehicle: value === "all" ? "" : value,
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Service</Label>
                <Pick
                  label="Service filter"
                  value={filters.service || "all"}
                  options={[
                    { value: "all", label: "All services" },
                    ...(analysis.status === "ready"
                      ? analysis.data.availableFilters.services.map(
                          (value) => ({ value, label: value })
                        )
                      : filters.service
                        ? [{ value: filters.service, label: filters.service }]
                        : []),
                  ]}
                  onChange={(value) =>
                    setFilters({
                      ...filters,
                      service: value === "all" ? "" : value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <p>
                Complete monthly periods only. Vehicle and service records have
                different grains.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters(emptyFilters)}
              >
                Reset filters
              </Button>
            </div>
            {analysis.status === "loading" && (
              <p role="status" className="rounded-xl border bg-card p-10">
                Loading this revision and scope…
              </p>
            )}
            {analysis.status === "error" && (
              <p role="alert">{analysis.error}</p>
            )}
            {analysis.status === "ready" && (
              <div key={`${revision}?${scope}`} className="space-y-5">
                <div className="rounded-lg border bg-card p-4 text-xs text-muted-foreground">
                  <p className="mb-2 font-medium text-foreground">
                    {analysis.data.name} · {analysis.data.sources.length}{" "}
                    sources · {analysis.data.tables.length} tables
                  </p>
                  <p>{analysis.data.description}</p>
                  {analysis.data.caveats.map((caveat) => (
                    <p key={caveat} className="mt-1">
                      {caveat}
                    </p>
                  ))}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {[
                      ...new Set(
                        analysis.data.sources.map((source) => source.kind)
                      ),
                    ].map((kind) => (
                      <Badge variant="outline" key={kind}>
                        {kind}
                      </Badge>
                    ))}
                  </div>
                </div>
                <AnalysisView
                  analysis={analysis.data}
                  problem={problem}
                  inspect={(id) => {
                    setTable((current) => ({ id, serial: current.serial + 1 }))
                    document
                      .getElementById("records")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }}
                />
                <div className="grid gap-3 xl:grid-cols-3">
                  {[
                    { title: "Hypothesis to test", text: problem.hypothesis },
                    {
                      title: "What this cannot establish",
                      text: problem.limit,
                    },
                    { title: "Next record request", text: problem.request },
                  ].map((item) => (
                    <Card key={item.title} className="gap-3 shadow-none">
                      <CardHeader>
                        <CardTitle className="text-sm">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs leading-relaxed text-muted-foreground">
                        {item.text}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <ContextPanel
                  key={problem.id}
                  analysis={analysis.data}
                  scope={scope}
                  problem={problem}
                />
                <RecordsPanel
                  key={`${problem.id}-${table.serial}`}
                  analysis={analysis.data}
                  scope={scope}
                  initialTable={
                    table.id ||
                    [...analysis.data.tables].sort((a, b) => {
                      const score = (title: string) =>
                        problem.query
                          .split(" ")
                          .filter((term) =>
                            title.toLowerCase().includes(term.toLowerCase())
                          ).length
                      return score(b.title) - score(a.title)
                    })[0]?.id ||
                    ""
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
