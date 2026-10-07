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
  type EntityKind = "service" | "vehicle"
  const known: Record<EntityKind, string[]> = { service: [], vehicle: [] }
  for (const table of bundle.tables) {
    if (table.kind === "operations")
      known.service.push(...table.rows.map((r) => String(r.values.service)))
    if (table.kind === "maintenance")
      known.vehicle.push(...table.rows.map((r) => String(r.values.vehicle_id)))
  }
  known.service = [...new Set(known.service)]
  known.vehicle = [...new Set(known.vehicle)]
  // Keep quantities whole. Ranking words are deliberately not scope tokens.
  const rawTokens =
    question.match(
      /"[^"\n]+"|'[^'\n]+'|[a-z0-9]+(?:[-_.,][a-z0-9]+)*%?|[:=#/&,]/gi
    ) ?? []
  const tokens = rawTokens.map((token) => token.toLowerCase())
  const value = (token: string) => token.replace(/^["']|["']$/g, "")
  const matches = (kind: EntityKind, id: string) =>
    known[kind].filter((v) => v.toLowerCase() === id)
  const references: { kind: EntityKind | "route"; id: string }[] = []
  const consumed = new Set<number>()
  const issues: string[] = []
  const isReference = (token: string, index: number) =>
    /[0-9"']/.test(token) ||
    /^[A-Z]+$/.test(rawTokens[index] ?? "") ||
    known.service.some((v) => v.toLowerCase() === token) ||
    known.vehicle.some((v) => v.toLowerCase() === token)
  for (let i = 0; i < tokens.length; i++) {
    const label = tokens[i]
    const kind =
      label && /^services?$/.test(label)
        ? "service"
        : label && /^routes?$/.test(label)
          ? "route"
          : label && /^vehicles?$/.test(label)
            ? "vehicle"
            : null
    if (!kind) continue
    consumed.add(i)
    let cursor = i + 1
    let marked = false
    while (/^(?:id|number|no|[:=#])$/.test(tokens[cursor] ?? "")) {
      marked = true
      consumed.add(cursor)
      cursor++
    }
    const first = tokens[cursor]
    if (!first || (!marked && !isReference(first, cursor))) continue
    while (tokens[cursor]) {
      const token = tokens[cursor]
      if (!token) break
      references.push({ kind, id: value(token) })
      consumed.add(cursor)
      const connector = tokens[cursor + 1]
      const next = tokens[cursor + 2]
      if (
        !connector ||
        !/^(?:and|or|\/|&|,)$/.test(connector) ||
        !next ||
        !isReference(next, cursor + 2)
      )
        break
      cursor += 2
    }
  }
  const dates: string[] = []
  for (const [index, token] of tokens.entries()) {
    if (consumed.has(index)) continue
    if (/^\d{4}-\d{2}(?:-\d{2})?$/.test(token)) {
      dates.push(token)
      continue
    }
    // Bare numeric values have no entity intent. Nonnumeric exact IDs can infer
    // scope only when their namespace is unique.
    if (!/[a-z]/.test(token)) continue
    const kinds = (["service", "vehicle"] as const).filter(
      (kind) => matches(kind, value(token)).length
    )
    if (kinds.length > 1)
      issues.push(`Ambiguous identifier ${token}; specify service or vehicle.`)
    else if (kinds[0]) references.push({ kind: kinds[0], id: value(token) })
    else if (/[a-z]/.test(token) && /\d/.test(token) && /[-_]/.test(token))
      issues.push(`Unrecognized identifier ${token}.`)
  }
  if (references.some((reference) => reference.kind === "route"))
    issues.push(
      "Route scope is unsupported: no route-to-service mapping is present."
    )
  const effectiveFilters = { ...filters }
  for (const kind of ["service", "vehicle"] as const) {
    const ids = [
      ...new Set(references.filter((r) => r.kind === kind).map((r) => r.id)),
    ]
    if (ids.length > 1)
      issues.push(
        `Multiple ${kind} identifiers require an explicit single selection.`
      )
    for (const id of ids) {
      const found = matches(kind, id)
      if (found.length !== 1) {
        issues.push(`Unrecognized or ambiguous ${kind} identifier ${id}.`)
        continue
      }
      const canonical = found[0]
      if (!canonical) continue
      if (filters[kind] && filters[kind] !== canonical)
        issues.push("Question scope conflicts with the selected filters.")
      else effectiveFilters[kind] = canonical
    }
  }
  const uniqueDates = [...new Set(dates)]
  if (uniqueDates.length > 1)
    issues.push("Multiple dates require explicit date filters.")
  for (const date of uniqueDates) {
    const bounds = dateBounds(date)
    if (!bounds) {
      issues.push(`Invalid date ${date}.`)
      continue
    }
    if (
      (filters.from && filters.from > bounds.end) ||
      (filters.to && filters.to < bounds.start)
    )
      issues.push("Question scope conflicts with the selected filters.")
    effectiveFilters.from =
      filters.from > bounds.start ? filters.from : bounds.start
    effectiveFilters.to =
      filters.to && filters.to < bounds.end ? filters.to : bounds.end
  }
  if (!filterSchema.safeParse(effectiveFilters).success)
    issues.push("Invalid scope selection.")

  return {
    filters: effectiveFilters,
    issues,
  }
}

export function retrieveContext(
  bundle: DatasetBundle,
  revision: string,
  question: string,
  filters: EvidenceFilters
) {
  let truncated = false
  const take = <T>(entries: T[], limit: number) => {
    if (entries.length > limit) truncated = true
    return entries.slice(0, limit)
  }
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
  const terms = take(
    [
      ...new Set(question.toLowerCase().match(/[a-z0-9][a-z0-9_-]{2,}/g) ?? []),
    ].filter((t) => !stopWords.has(t)),
    20
  )
  const scope = resolveScope(bundle, question, filters)
  const effectiveFilters = scope.filters

  const score = (text: string) => {
    const words = new Set(
      text.toLowerCase().match(/[a-z0-9][a-z0-9_-]*/g) ?? []
    )
    return terms.reduce((n, term) => n + (words.has(term) ? 1 : 0), 0)
  }
  const rows = take(
    (scope.issues.length ? [] : bundle.tables)
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
      ),
    8
  )
  const documents = take(
    bundle.sources
      .flatMap((source) => {
        const paragraphs = take(
          source.text
            .split(/\n\s*\n/)
            .map((text, index) => ({ text, index, score: score(text) }))
            .filter((p) => p.score > 0)
            .sort((a, b) => b.score - a.score),
          2
        )
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
      .sort((a, b) => b.score - a.score),
    4
  )
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
        : "Use service <ID>, vehicle <ID> and ISO dates for scope; quote alphabetic IDs. Route scope is unsupported. Bare numbers never select entities. Exact nonnumeric IDs must identify one namespace. Unknown or conflicting references withhold numeric context. Inspect the effective filters; other natural-language conditions are not interpreted.",
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
      maxParagraphsPerSource: 2,
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
