"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, Wrench } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
import { Badge } from "@workspace/ui/components/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  repairAreas,
  repairResultSchema,
  type RepairResult,
} from "@/lib/repairs/schema"
import { crewClock } from "@/lib/crew-planning"
import { RepairModel } from "./repair-model"

type AnalysisState =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "error"; message: string }
  | { kind: "complete"; result: RepairResult }

export function RepairInvestigation({
  vehicle,
  date,
  onSelectTrip,
}: {
  vehicle: string
  date: string
  onSelectTrip: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="w-full" />}>
        <Wrench />
        Analyze a reported fault
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Repair investigation · {vehicle}</DialogTitle>
          <DialogDescription>
            Describe a fault to explore possible causes and next checks against
            the supplied maintenance records for {date}.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <InvestigationForm
            key={`${vehicle}/${date}`}
            vehicle={vehicle}
            date={date}
            onSelectTrip={(id) => {
              setOpen(false)
              onSelectTrip(id)
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function InvestigationForm({
  vehicle,
  date,
  onSelectTrip,
}: {
  vehicle: string
  date: string
  onSelectTrip: (id: string) => void
}) {
  const [report, setReport] = useState("")
  const [state, setState] = useState<AnalysisState>({ kind: "idle" })
  const pending = useRef<AbortController | null>(null)
  useEffect(() => () => pending.current?.abort(), [])
  const result = state.kind === "complete" ? state.result : null
  const cancel = () => {
    pending.current?.abort()
    pending.current = null
    setState({ kind: "idle" })
  }
  async function analyze(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    pending.current?.abort()
    const controller = new AbortController()
    pending.current = controller
    setState({ kind: "pending" })
    try {
      const response = await fetch("/api/repairs/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicle, date, report }),
        signal: controller.signal,
      })
      const data: unknown = await response.json()
      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Analysis could not complete. Please try again."
        throw new Error(message)
      }
      const parsed = repairResultSchema.parse(data)
      if (
        parsed.request.vehicle !== vehicle ||
        parsed.request.date !== date ||
        parsed.request.report !== report.trim()
      )
        throw new Error(
          "The analysis did not match this report. Please try again."
        )
      if (!controller.signal.aborted)
        setState({ kind: "complete", result: parsed })
    } catch (error) {
      if (!controller.signal.aborted)
        setState({
          kind: "error",
          message:
            error instanceof Error
              ? error.message
              : "Analysis failed. Please try again.",
        })
    } finally {
      if (pending.current === controller) pending.current = null
    }
  }
  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-4">
        <form onSubmit={analyze} className="space-y-3">
          <Label htmlFor="repair-report">Your fault report</Label>
          <Textarea
            id="repair-report"
            value={report}
            maxLength={4000}
            rows={5}
            placeholder="What happened, when, and under what conditions? Include warning messages and checks already performed."
            onChange={(event) => {
              cancel()
              setReport(event.target.value)
            }}
          />
          <p className="text-xs text-muted-foreground">
            The report and this vehicle&apos;s maintenance evidence are sent to
            OpenAI when you select Analyze fault. Reports and results are not
            saved after closing this panel.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              disabled={report.trim().length < 10 || state.kind === "pending"}
            >
              {state.kind === "pending" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Wrench />
              )}
              {state.kind === "pending" ? "Analyzing fault…" : "Analyze fault"}
            </Button>
            {state.kind === "pending" && (
              <Button type="button" variant="outline" onClick={cancel}>
                Cancel analysis
              </Button>
            )}
          </div>
          {state.kind === "pending" && (
            <p role="status" className="text-sm text-muted-foreground">
              Reading maintenance evidence and assessing possible causes. This
              can take up to 90 seconds.
            </p>
          )}
          {state.kind === "error" && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/40 p-3 text-sm"
            >
              {state.message}
            </p>
          )}
        </form>
        <RepairModel areas={result?.analysis.areas.map((a) => a.id) ?? []} />
        <p className="text-xs text-muted-foreground">
          Illustrative double-deck model, including for single-deck vehicles.
          Orange areas come from the AI analysis and do not establish a
          diagnosis.
        </p>
        {result?.analysis.areas.length ? (
          result.analysis.areas.map((area, index) => (
            <article
              key={`${area.id}/${index}`}
              className="space-y-1 rounded-lg border p-3 text-sm"
            >
              <h3 className="font-medium">{repairAreas[area.id].label}</h3>
              <p>{area.reason}</p>
              <p className="text-xs text-muted-foreground">
                {repairAreas[area.id].note}
              </p>
              <Citations ids={area.evidenceIds} result={result} />
            </article>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No supported repair area selected.
          </p>
        )}
        {result && (
          <section className="space-y-3" aria-label="Source evidence">
            <h3 className="font-semibold">Source evidence</h3>
            <p className="text-xs text-muted-foreground">
              Supplied snapshots, not live engineering clearance. Findings and
              updates can postdate {date}. Missing records do not confirm
              availability.
            </p>
            {result.evidence.filter((e) => e.kind !== "report").length ===
              0 && (
              <p className="text-sm">
                No maintenance or readiness evidence supplied for this vehicle.
                Analysis relies on your unverified report.
              </p>
            )}
            {result.evidence.map((e, index) => (
              <article
                id={`repair-evidence-${index}`}
                key={e.id}
                tabIndex={-1}
                className="scroll-mt-4 space-y-2 rounded-lg border p-3 text-sm"
              >
                <Badge variant="outline">
                  {e.kind === "report"
                    ? "Operator report · unverified"
                    : "Recorded evidence"}
                </Badge>
                <h4 className="font-medium break-words">{e.title}</h4>
                <p className="break-words whitespace-pre-wrap text-muted-foreground">
                  {e.detail}
                </p>
              </article>
            ))}
          </section>
        )}
      </div>
      <div className="min-w-0 space-y-5" aria-live="polite">
        {result ? (
          <>
            <section className="space-y-2">
              <Badge variant="secondary">
                AI analysis · requires engineering review
              </Badge>
              <h3 className="font-semibold">Possible causes and next checks</h3>
              <p className="text-sm">{result.analysis.summary}</p>
              <p className="text-xs text-muted-foreground">
                This analysis does not confirm a root cause or release the
                vehicle.
              </p>
            </section>
            <section className="space-y-3" aria-label="Possible causes">
              <h3 className="font-semibold">Possible causes</h3>
              {result.analysis.hypotheses.length === 0 && (
                <p className="text-sm">
                  There is not enough relevant evidence to suggest a cause.
                </p>
              )}
              {result.analysis.hypotheses.map((h, index) => (
                <article
                  key={index}
                  className="space-y-2 rounded-lg border p-3 text-sm"
                >
                  <h4 className="font-medium">
                    {index + 1}. {h.cause}
                  </h4>
                  <p>{h.rationale}</p>
                  <Citations ids={h.evidenceIds} result={result} />
                </article>
              ))}
            </section>
            <section className="space-y-2">
              <h3 className="font-semibold">Recommended engineering checks</h3>
              {result.analysis.checks.length === 0 && (
                <p className="text-sm">
                  Clarify the report before choosing diagnostic checks.
                </p>
              )}
              <ol className="list-decimal space-y-3 pl-5 text-sm">
                {result.analysis.checks.map((check, index) => (
                  <li key={index}>
                    <p className="font-medium">{check.action}</p>
                    <p className="text-muted-foreground">{check.reason}</p>
                  </li>
                ))}
              </ol>
            </section>
            {result.analysis.questions.length > 0 && (
              <section className="space-y-2">
                <h3 className="font-semibold">Questions to resolve</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  {result.analysis.questions.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))}
                </ul>
              </section>
            )}
            <section className="space-y-3" aria-label="Planned trips to review">
              <h3 className="font-semibold">Planned trips to review</h3>
              <p className="text-xs text-muted-foreground">
                All assignments on {date}, across services. Recorded hold
                overlaps are calculated from the schedule. The new report has
                not created a hold or established an outage duration.
              </p>
              {!result.trips.length && (
                <p className="text-sm">
                  No planned trips supplied on this date.
                </p>
              )}
              {result.trips.map((trip) => (
                <div key={trip.id} className="space-y-1 rounded-lg border p-3">
                  <Button
                    variant="link"
                    className="h-auto max-w-full p-0 text-left whitespace-normal"
                    onClick={() => onSelectTrip(trip.id)}
                  >
                    Service {trip.service} · {crewClock(trip.departure)} to{" "}
                    {crewClock(trip.arrival)}
                  </Button>
                  <p className="text-xs break-all text-muted-foreground">
                    {trip.id}
                  </p>
                  <p className="text-xs">
                    {trip.holdIds.length
                      ? "Overlaps a recorded maintenance hold"
                      : "Report-related review only; no recorded timed hold overlap"}
                  </p>
                  {trip.holdIds.length > 0 && (
                    <Citations ids={trip.holdIds} result={result} />
                  )}
                </div>
              ))}
            </section>
            <p className="text-xs text-muted-foreground">
              Generated {new Date(result.generatedAt).toLocaleString()} ·{" "}
              {result.model}
            </p>
          </>
        ) : (
          <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
            <h3 className="mb-2 font-semibold text-foreground">
              Start with what you observed
            </h3>
            <p>
              Analysis connects your report with this vehicle&apos;s fault
              history, inspection findings, repair actions, and holds. Possible
              causes, diagnostic checks, and supporting records will appear
              here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function Citations({ ids, result }: { ids: string[]; result: RepairResult }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
      {ids.map((id, index) => {
        const evidenceIndex = result.evidence.findIndex((e) => e.id === id)
        const evidence = result.evidence[evidenceIndex]
        return evidence ? (
          <a
            key={`${id}/${index}`}
            href={`#repair-evidence-${evidenceIndex}`}
            className="break-all text-primary underline underline-offset-2"
            onClick={(event) => {
              event.preventDefault()
              document
                .getElementById(`repair-evidence-${evidenceIndex}`)
                ?.focus()
            }}
          >
            {evidence.kind === "report" ? "Operator report" : evidence.title}
          </a>
        ) : null
      })}
    </div>
  )
}
