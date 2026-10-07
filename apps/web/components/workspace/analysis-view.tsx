"use client"
import { Plot } from "@workspace/ui/components/report-chart"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import type { EvidenceAnalysis } from "@/lib/evidence/analysis"
import type { Problem } from "./problems"

export function number(value: number | null) {
  return value === null
    ? "Unavailable"
    : value.toLocaleString("en-SG", { maximumFractionDigits: 1 })
}
export function AnalysisView({
  analysis,
  problem,
  inspect,
}: {
  analysis: EvidenceAnalysis
  problem: Problem
  inspect: (id: string) => void
}) {
  const ids =
    problem.group === "Maintenance"
      ? ["repair_cost", "repair_rate", "repair_hours"]
      : problem.group === "Scheduling"
        ? ["completion", "on_time", "queued_calls"]
        : ["boardings", "queued_calls", "completion"]
  const metrics = analysis.metrics.filter((metric) => ids.includes(metric.id))
  return (
    <div className="space-y-5">
      <p className="text-xs text-muted-foreground">
        Descriptive indicators for the selected scope. These do not answer the
        causal question above. Workshop, festival and relief capacity require
        the planning records in the record inspector.
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card
            key={metric.id}
            className="gap-3 shadow-none"
            data-metric={metric.id}
          >
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-3xl tabular-nums">
                {number(metric.value)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>
                {metric.unit} · {metric.rowCount} scoped records
              </p>
              <p>{metric.definition}</p>
              {metric.denominator !== null && (
                <p>
                  Numerator {number(metric.numerator)} / denominator{" "}
                  {number(metric.denominator)}
                </p>
              )}
              {metric.reason && <p>{metric.reason}</p>}
              {metric.evidenceKind && (
                <Badge variant="outline">{metric.evidenceKind}</Badge>
              )}
              {metric.tableId && (
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto px-0"
                  onClick={() => inspect(metric.tableId ?? "")}
                >
                  Inspect contributing records
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {metrics.slice(0, 2).map((metric) => (
          <div key={metric.id} className="min-w-0 space-y-2">
            {metric.status === "available" ? (
              <Plot
                title={`${metric.label} over time`}
                description={`${metric.unit}. Each point uses only its period's records.`}
                rows={metric.series.map((point) => ({
                  name: point.period,
                  value: point.value,
                }))}
                series={[{ key: "value", label: metric.label }]}
                area
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>{metric.label} over time</CardTitle>
                  <CardDescription>
                    No compatible numeric evidence in this scope.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
            <details className="rounded-lg border px-4 py-2 text-xs">
              <summary className="cursor-pointer">
                View chart values and caveats
              </summary>
              <ul className="mt-2 space-y-1">
                {metric.series.map((point) => (
                  <li key={point.period}>
                    {point.period}: {number(point.value)} {metric.unit}
                  </li>
                ))}
                {metric.caveats.map((caveat) => (
                  <li key={caveat} className="text-muted-foreground">
                    {caveat}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        ))}
      </div>
    </div>
  )
}
