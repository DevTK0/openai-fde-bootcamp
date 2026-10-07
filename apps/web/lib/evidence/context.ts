import { analyse, citation, selectedRows } from "./analysis"
import {
  filterSchema,
  dateBounds,
  type DatasetBundle,
  type EvidenceFilters,
} from "./schema"

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
function resolveScope(
  bundle: DatasetBundle,
  question: string,
  filters: EvidenceFilters
) {
  const scopeText = question
    .toLowerCase()
    .replace(
      /\b\d+(?:\.\d+)?\s*(?:km|minutes?|hours?|seconds?|days?|percent)\b/g,
      ""
    )
  const tokens = [...new Set(scopeText.match(/[a-z0-9][a-z0-9_-]*/g) ?? [])]
  const dates = tokens.filter((t) => /^\d{4}-\d{2}(?:-\d{2})?$/.test(t))
  const explicitIdentifiers = [
    ...question
      .toLowerCase()
      .matchAll(
        /\b(?:services?|routes?|vehicles?)(?:\s+|[:=#]\s*)(?:(?:id|number|no)\.?\s*|#\s*)?([a-z0-9][a-z0-9_-]*(?:\s*(?:,|and|or|\/|&)\s*[a-z0-9][a-z0-9_-]*)*)/g
      ),
  ].flatMap((match) => match[1]?.match(/[a-z0-9][a-z0-9_-]*/g) ?? [])
  const identifiers = [
    ...new Set([
      ...explicitIdentifiers.filter((token) => /\d/.test(token)),
      ...tokens.filter((token) => /\d/.test(token) && /[-_]/.test(token)),
    ]),
  ].filter((token) => !dates.includes(token))
  const vehicles = [
    ...new Set(
      bundle.tables.flatMap((t) =>
        t.kind === "maintenance"
          ? t.rows.map((r) => String(r.values.vehicle_id))
          : []
      )
    ),
  ].filter((v) => tokens.includes(v.toLowerCase()))
  const services = [
    ...new Set(
      bundle.tables.flatMap((t) =>
        t.kind === "operations"
          ? t.rows.map((r) => String(r.values.service))
          : []
      )
    ),
  ].filter((v) => tokens.includes(v.toLowerCase()))
  const effectiveFilters = { ...filters }
  if (!filters.vehicle && vehicles.length === 1)
    effectiveFilters.vehicle = vehicles[0] ?? ""
  if (!filters.service && services.length === 1)
    effectiveFilters.service = services[0] ?? ""
  const date = dates[0]
  if (dates.length === 1 && date) {
    const bounds = dateBounds(date)
    if (bounds) {
      if (!filters.from) effectiveFilters.from = bounds.start
      if (!filters.to) effectiveFilters.to = bounds.end
    }
  }
  const unknownIdentifiers = identifiers.filter(
    (id) => ![...vehicles, ...services].some((v) => v.toLowerCase() === id)
  )
  const inferredScopeValid = filterSchema.safeParse(effectiveFilters).success
  const ambiguousScope =
    !inferredScopeValid ||
    dates.some((value) => !dateBounds(value)) ||
    vehicles.length > 1 ||
    services.length > 1 ||
    dates.length > 1 ||
    unknownIdentifiers.length > 0 ||
    vehicles.some((v) =>
      services.some((service) => service.toLowerCase() === v.toLowerCase())
    )
  const conflictingScope =
    vehicles.some((v) => filters.vehicle && v !== filters.vehicle) ||
    services.some((v) => filters.service && v !== filters.service) ||
    Boolean(
      date &&
      ((filters.from && date < filters.from.slice(0, date.length)) ||
        (filters.to && date > filters.to.slice(0, date.length)))
    )

  return {
    filters: effectiveFilters,
    issues: [
      ...unknownIdentifiers.map((id) => `Unrecognized identifier ${id}.`),
      ...(ambiguousScope
        ? [
            "Question scope does not resolve to a single valid entity and date selection.",
          ]
        : []),
      ...(conflictingScope
        ? ["Question scope conflicts with the selected filters."]
        : []),
    ],
  }
}

export function retrieveContext(
  bundle: DatasetBundle,
  revision: string,
  question: string,
  filters: EvidenceFilters
) {
  let truncated = false
  const clip = (text: string, length: number) => {
    if (text.length <= length) return text
    truncated = true
    return text.slice(0, length - 14) + " … [truncated]"
  }
  const caveats = (values: string[]) => {
    const unique = [...new Set(values)]
    if (unique.length > 3) truncated = true
    return unique.slice(0, 3).map((value) => clip(value, 240))
  }
  const terms = [
    ...new Set(question.toLowerCase().match(/[a-z0-9][a-z0-9_-]{2,}/g) ?? []),
  ]
    .filter((t) => !stopWords.has(t))
    .slice(0, 20)
  const scope = resolveScope(bundle, question, filters)
  const effectiveFilters = scope.filters

  const score = (text: string) => {
    const words = new Set(
      text.toLowerCase().match(/[a-z0-9][a-z0-9_-]*/g) ?? []
    )
    return terms.reduce((n, term) => n + (words.has(term) ? 1 : 0), 0)
  }
  const rows = (scope.issues.length ? [] : bundle.tables)
    .flatMap((table) =>
      selectedRows(table, effectiveFilters).flatMap((row) => {
        const text = JSON.stringify(row.values)
        const relevance = score(text + " " + table.title)
        return relevance
          ? [
              {
                type: "row" as const,
                score: relevance,
                text: clip(text, 1600),
                citation: citation(revision, table, row),
                title: table.title,
                kind:
                  bundle.sources.find((s) => s.id === table.sourceId)?.kind ??
                  "reported",
                caveats: caveats([
                  ...table.caveats,
                  ...(bundle.sources.find((s) => s.id === table.sourceId)
                    ?.caveats ?? []),
                ]),
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
        text: clip(p.text, 1400),
        caveats: caveats(source.caveats),
        scope: "Background guidance; not a filtered numeric observation.",
      }))
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
  const metrics = (
    scope.issues.length
      ? []
      : analyse(bundle, revision, effectiveFilters).metrics
  )
    .filter((m) => score(`${m.label} ${m.definition}`) > 0)
    .map(({ citations, series, ...metric }) => {
      const citationsTruncated =
        metric.citationsTruncated || citations.length > 3
      if (citationsTruncated || series.length > 12) truncated = true
      return {
        ...metric,
        citationsTruncated,
        caveats: caveats(metric.caveats),
        citations: citations.slice(0, 3),
        series: series.slice(-12),
      }
    })
  const insufficient =
    rows.length === 0 && !metrics.some((m) => m.status === "available")
  const result = {
    revision,
    question,
    filters: effectiveFilters,
    requestedFilters: filters,
    unresolvedScope: scope.issues,
    scopeNote:
      scope.issues.length > 0
        ? "Numeric context omitted because question identifiers need an unambiguous matching scope. Set explicit filters."
        : "Explicit filters take precedence. A single recognized vehicle, service or date in the question supplies missing filters.",
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
      ...(effectiveFilters.vehicle
        ? [
            "Service-date operational aggregates cannot be allocated to an individual vehicle.",
          ]
        : []),
    ],
    truncation: {
      truncated,
      omittedEntriesForBudget: 0,
      note: "Excerpts and citation lists are bounded. Inspect the full revision for complete records and caveats.",
    },
    limits: {
      maxRows: 8,
      maxDocuments: 4,
      maxRowCharacters: 1600,
      maxDocumentCharacters: 1400,
      maxQueryTerms: 20,
      maxSerializedCharacters: 32000,
      maxMetricCitations: 3,
      maxMetricPeriods: 12,
      maxCaveatsPerEntry: 3,
      maxCaveatCharacters: 240,
    },
  }
  while (
    JSON.stringify(result).length > result.limits.maxSerializedCharacters
  ) {
    result.truncation.truncated = true
    result.truncation.omittedEntriesForBudget++
    if (result.evidence.length > 1) result.evidence.pop()
    else if (result.metrics.length) result.metrics.pop()
    else break
  }
  return result
}
export type EvidenceContext = ReturnType<typeof retrieveContext>
