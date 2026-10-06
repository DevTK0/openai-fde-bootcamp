"use client"
import { useState } from "react"
import { Search, Download } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import type { EvidenceContext } from "@/lib/evidence/context"
import type { EvidenceAnalysis } from "@/lib/evidence/analysis"
import type { Problem } from "./problems"
import { useResource } from "./use-resource"

export function ContextPanel({
  analysis,
  scope,
  problem,
}: {
  analysis: EvidenceAnalysis
  scope: string
  problem: Problem
}) {
  const [query, setQuery] = useState(problem.query)
  const [submitted, setSubmitted] = useState(problem.query)
  const resource = useResource<EvidenceContext>(
    `/api/workspace/${analysis.revision}?${scope}&view=context&q=${encodeURIComponent(submitted)}`
  )
  const [expanded, setExpanded] = useState<number | null>(null)
  function download(context: EvidenceContext) {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify({ problem, ...context }, null, 2)], {
        type: "application/json",
      })
    )
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `evidence-context-${analysis.revision.slice(0, 12)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Evidence search</CardTitle>
        <CardDescription>
          Bounded local retrieval for an investigation. No model-generated
          diagnosis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            setSubmitted(query)
            setExpanded(null)
          }}
        >
          <Input
            aria-label="Evidence question"
            value={query}
            maxLength={500}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button type="submit">
            <Search className="size-4" />
            Search evidence
          </Button>
        </form>
        {resource.status === "loading" && (
          <p role="status">Retrieving scoped evidence…</p>
        )}
        {resource.status === "error" && <p role="alert">{resource.error}</p>}
        {resource.status === "ready" && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm" role="status">
                {resource.data.answer}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => download(resource.data)}
              >
                <Download className="size-4" />
                Export context
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {resource.data.method} Revision{" "}
              {resource.data.revision.slice(0, 12)}. Up to{" "}
              {resource.data.limits.maxRows} rows and{" "}
              {resource.data.limits.maxDocuments} passages.
            </p>
            <div className="grid gap-3 lg:grid-cols-2">
              {resource.data.evidence.map((item, index) => (
                <div
                  className="min-w-0 rounded-lg border p-4"
                  key={`${item.type}-${index}`}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{item.kind}</Badge>
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                  <p className="text-xs leading-relaxed break-words">
                    {item.text}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {item.type === "document"
                      ? item.scope
                      : "Row observation within selected filters."}
                  </p>
                  {item.caveats.map((caveat) => (
                    <p
                      key={caveat}
                      className="mt-1 text-xs text-muted-foreground"
                    >
                      {caveat}
                    </p>
                  ))}
                  <Button
                    variant="link"
                    className="mt-2 h-auto max-w-full px-0 text-left text-xs whitespace-normal"
                    onClick={() =>
                      setExpanded(expanded === index ? null : index)
                    }
                  >
                    Open citation · {item.citation.sourceId} /{" "}
                    {item.type === "row"
                      ? `${item.citation.tableId} / ${item.citation.rowId}`
                      : `paragraph ${item.citation.paragraph}`}
                  </Button>
                  {expanded === index && (
                    <div className="mt-2 space-y-2 rounded-md bg-muted p-3 text-xs">
                      <p className="break-all">
                        Revision {item.citation.revision}
                      </p>
                      <p>
                        {
                          analysis.sources.find(
                            (source) => source.id === item.citation.sourceId
                          )?.reference
                        }
                      </p>
                      <p className="break-words whitespace-pre-wrap">
                        {item.type === "document"
                          ? analysis.sources
                              .find(
                                (source) => source.id === item.citation.sourceId
                              )
                              ?.text.split(/\n\s*\n/)[
                              item.citation.paragraph - 1
                            ]
                          : item.text}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-muted p-4 text-xs">
              <p className="mb-2 font-medium">Evidence still needed</p>
              <ul className="list-disc space-y-1 pl-4">
                {resource.data.missingEvidence.map((missing) => (
                  <li key={missing}>{missing}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
