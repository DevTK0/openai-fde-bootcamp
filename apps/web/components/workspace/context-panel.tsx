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
import type {
  EvidenceAnalysis,
  EvidenceRowDetail,
} from "@/lib/evidence/analysis"
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
  const [submitted, setSubmitted] = useState({ query: problem.query, attempt: 0 })
  const resource = useResource<EvidenceContext>(
    `/api/workspace/${analysis.revision}?${scope}&view=context&q=${encodeURIComponent(submitted.query)}`,
    submitted.attempt
  )
  const [expanded, setExpanded] = useState<number | null>(null)
  function download(context: EvidenceContext) {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(context)], {
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
          className="flex flex-wrap gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            setSubmitted((previous) => ({ query, attempt: previous.attempt + 1 }))
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
            <p className="text-xs text-muted-foreground">
              Evidence scope: vehicle {resource.data.filters.vehicle || "all"};
              service {resource.data.filters.service || "all"}; from{" "}
              {resource.data.filters.from || "start"}; to{" "}
              {resource.data.filters.to || "end"}. {resource.data.scopeNote}
            </p>
            {resource.data.truncation.truncated && (
              <p className="text-xs text-muted-foreground">
                {resource.data.truncation.note}
              </p>
            )}
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
                      : "Source record within the effective evidence scope."}
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
                      {item.type === "document" ? (
                        <p className="break-words whitespace-pre-wrap">
                          {
                            analysis.sources
                              .find(
                                (source) => source.id === item.citation.sourceId
                              )
                              ?.text.split(/\n\s*\n/)[
                              item.citation.paragraph - 1
                            ]
                          }
                        </p>
                      ) : (
                        <CitedRow
                          url={`/api/workspace/${item.citation.revision}?${new URLSearchParams(resource.data.filters)}&view=row&table=${encodeURIComponent(item.citation.tableId)}&row=${encodeURIComponent(item.citation.rowId)}`}
                        />
                      )}
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

function CitedRow({ url }: { url: string }) {
  const resource = useResource<EvidenceRowDetail>(url)
  if (resource.status === "loading")
    return <p role="status">Loading complete record…</p>
  if (resource.status === "error") return <p role="alert">{resource.error}</p>
  return (
    <div className="space-y-2">
      <p className="font-medium">Complete cited record</p>
      <p>
        {resource.data.title} · {resource.data.row.id}
      </p>
      <dl className="space-y-2">
        {resource.data.columns.map((column) => (
          <div key={column}>
            <dt className="font-medium">{column}</dt>
            <dd className="break-words whitespace-pre-wrap">
              {resource.data.row.values[column] === null ||
              resource.data.row.values[column] === undefined
                ? "Not recorded"
                : String(resource.data.row.values[column])}
            </dd>
          </div>
        ))}
      </dl>
      {resource.data.caveats.map((caveat) => (
        <p key={caveat}>{caveat}</p>
      ))}
    </div>
  )
}
