import { analyse, citation, selectedRows } from "./analysis"
import type { DatasetBundle, EvidenceFilters } from "./schema"

const stopWords = new Set([
  "what",
  "why",
  "how",
  "does",
  "this",
  "that",
  "with",
  "from",
  "have",
  "the",
  "and",
  "for",
  "are",
  "was",
  "can",
  "did",
  "which",
])
export function retrieveContext(
  bundle: DatasetBundle,
  revision: string,
  question: string,
  filters: EvidenceFilters
) {
  const terms = [
    ...new Set(question.toLowerCase().match(/[a-z0-9][a-z0-9_-]{2,}/g) ?? []),
  ]
    .filter((t) => !stopWords.has(t))
    .slice(0, 20)
  const identifiers = terms.filter((t) => /\d/.test(t) && /[-_]/.test(t))
  const score = (text: string) => {
    const words = new Set(
      text.toLowerCase().match(/[a-z0-9][a-z0-9_-]*/g) ?? []
    )
    return terms.reduce((n, term) => n + (words.has(term) ? 1 : 0), 0)
  }
  const rows = bundle.tables
    .flatMap((table) =>
      selectedRows(table, filters).flatMap((row) => {
        const text = JSON.stringify(row.values)
        const values = Object.values(row.values).map((v) =>
          String(v).toLowerCase()
        )
        if (
          identifiers.length &&
          !identifiers.every((id) => values.includes(id))
        )
          return []
        const relevance = score(text + " " + table.title)
        return relevance
          ? [
              {
                type: "row" as const,
                score: relevance,
                text: text.slice(0, 1600),
                citation: citation(revision, table, row),
                title: table.title,
                kind:
                  bundle.sources.find((s) => s.id === table.sourceId)?.kind ??
                  "reported",
                caveats: table.caveats,
              },
            ]
          : []
      })
    )
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.citation.tableId.localeCompare(b.citation.tableId) ||
        a.citation.rowId.localeCompare(b.citation.rowId)
    )
    .slice(0, 8)
  const documents = bundle.sources
    .flatMap((source) => {
      const paragraphs = source.text
        .split(/\n\s*\n/)
        .map((text, index) => ({ text, index, score: score(text) }))
        .filter((p) => p.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 2)
      return paragraphs.map((p) => ({
        type: "document" as const,
        score: p.score,
        title: source.title,
        kind: source.kind,
        reference: source.reference,
        citation: { revision, sourceId: source.id, paragraph: p.index + 1 },
        text: p.text.slice(0, 1400),
        caveats: source.caveats,
        scope: "Background guidance; not a filtered numeric observation.",
      }))
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
  const analysis = analyse(bundle, revision, filters)
  const metrics = analysis.metrics
    .filter((m) => score(`${m.label} ${m.definition}`) > 0)
    .map(({ citations, series, ...metric }) => ({
      ...metric,
      citations: citations.slice(0, 5),
      series: series.slice(-24),
    }))
  const insufficient = rows.length === 0
  return {
    revision,
    question,
    filters,
    status: insufficient
      ? ("insufficient" as const)
      : ("evidence-found" as const),
    method:
      "Local lexical retrieval with exact identifier matches, structured filters and deterministic metrics. No model-generated answer.",
    answer: insufficient
      ? "No matching row evidence supports an answer in this scope. Background guidance alone is insufficient."
      : "Matching evidence is available for investigation. These records do not establish a root cause.",
    metrics,
    evidence: [...rows, ...documents],
    missingEvidence: [
      "Validate a causal hypothesis with matched exposure, dated work orders, inspections and control records.",
      ...(insufficient
        ? ["Supply records for the requested entities, dates and measures."]
        : []),
      ...(filters.vehicle
        ? [
            "Service-date operational aggregates cannot be allocated to an individual vehicle.",
          ]
        : []),
    ],
    limits: {
      maxRows: 8,
      maxDocuments: 4,
      maxRowCharacters: 1600,
      maxDocumentCharacters: 1400,
      maxQueryTerms: 20,
    },
  }
}
export type EvidenceContext = ReturnType<typeof retrieveContext>
