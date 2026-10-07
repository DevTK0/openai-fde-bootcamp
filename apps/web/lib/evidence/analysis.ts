import { dateBounds } from "./schema"
import type {
  DatasetBundle,
  EvidenceFilters,
  EvidenceRow,
  EvidenceTable,
} from "./schema"

export type Citation = {
  revision: string
  sourceId: string
  tableId: string
  rowId: string
}
export const metricDefinitions = [
  {
    id: "repair_cost",
    label: "Repair spend",
    unit: "SGD",
    kind: "maintenance",
    numerator: "repair_cost_sgd",
    denominator: "",
    definition:
      "Sum of repair costs in the canonical monthly ledger. Selected visits and quotes are excluded.",
  },
  {
    id: "repair_rate",
    label: "Repair cost per 1,000 km",
    unit: "SGD / 1,000 km",
    kind: "maintenance",
    numerator: "repair_cost_sgd",
    denominator: "recorded_km",
    definition:
      "Canonical repair cost divided by recorded kilometres, multiplied by 1,000. Compare matched cohorts and complete months.",
  },
  {
    id: "repair_hours",
    label: "Repair unavailable hours",
    unit: "hours",
    kind: "maintenance",
    numerator: "repair_unavailable_hours",
    denominator: "",
    definition:
      "Recorded repair hold hours. This does not establish cancelled trips or passenger delay.",
  },
  {
    id: "completion",
    label: "Trip completion",
    unit: "%",
    kind: "operations",
    numerator: "completed",
    denominator: "trips",
    definition:
      "Completed trips divided by listed trips. Coverage is the imported service-date aggregate.",
  },
  {
    id: "on_time",
    label: "Departures within 0–5 minutes",
    unit: "%",
    kind: "operations",
    numerator: "on_time_departures",
    denominator: "departure_samples",
    definition:
      "Departures between zero and 300 seconds late, inclusive, divided by departures with timing evidence. Early departures are outside this band.",
  },
  {
    id: "boardings",
    label: "Passenger boardings",
    unit: "boarding events",
    kind: "operations",
    numerator: "boardings",
    denominator: "",
    definition: "Sum of recorded boarding events, not unique customers.",
  },
  {
    id: "queued_calls",
    label: "Calls with a queue",
    unit: "%",
    kind: "operations",
    numerator: "queued_calls",
    denominator: "calls",
    definition:
      "Stop calls with a queue divided by observed stop calls. A queue does not establish a full bus or unmet demand.",
  },
] as const
export function selectedRows(
  table: EvidenceTable,
  filters: EvidenceFilters
): EvidenceRow[] {
  return table.rows.filter(({ values }) => {
    if (
      filters.vehicle &&
      values.vehicle_id !== filters.vehicle &&
      values["Vehicle ID"] !== filters.vehicle &&
      values["Reported vehicle ID"] !== filters.vehicle
    )
      return false
    if (
      filters.service &&
      values.service !== filters.service &&
      values["Service no"] !== filters.service &&
      values["Reported service no"] !== filters.service
    )
      return false
    const date =
      values.month ??
      values.date ??
      values["Service date"] ??
      values["Observed on"] ??
      values["Reported at"] ??
      values["Month"] ??
      values["Opened at"] ??
      values["Inspected at"] ??
      values["Week start"] ??
      values["Period"]
    if (filters.from || filters.to) {
      if (typeof date !== "string") return false
      const bounds = dateBounds(date)
      if (!bounds) return false
      const { start, end } = bounds
      if (
        (filters.from && start < filters.from) ||
        (filters.to && end > filters.to)
      )
        return false
    }
    return true
  })
}
export function citation(
  revision: string,
  table: EvidenceTable,
  row: EvidenceRow
): Citation {
  return {
    revision,
    sourceId: table.sourceId,
    tableId: table.id,
    rowId: row.id,
  }
}
function total(rows: EvidenceRow[], field: string) {
  if (!rows.length || rows.some((r) => typeof r.values[field] !== "number"))
    return null
  return rows.reduce((n, r) => n + Number(r.values[field]), 0)
}
export function analyse(
  bundle: DatasetBundle,
  revision: string,
  filters: EvidenceFilters
) {
  const indexed = bundle.tables.map((table) => {
    const source = bundle.sources.find((s) => s.id === table.sourceId)
    const rows =
      source?.kind === "observed" || source?.kind === "synthetic"
        ? selectedRows(table, filters)
        : []
    const periods = new Map<string, EvidenceRow[]>()
    for (const row of rows) {
      const period = String(row.values.month ?? row.values.date)
      const group = periods.get(period) ?? []
      group.push(row)
      periods.set(period, group)
    }
    return { table, source, rows, periods }
  })
  const metrics = metricDefinitions.map((def) => {
    const entry = indexed.find((item) => item.table.kind === def.kind)
    const table = entry?.table,
      source = entry?.source,
      rows = entry?.rows ?? []
    const numerator = total(rows, def.numerator),
      denominator = def.denominator ? total(rows, def.denominator) : null
    const available =
      numerator !== null &&
      (!def.denominator || (denominator !== null && denominator > 0))
    const factor = def.id === "repair_rate" ? 1000 : 100
    return {
      ...def,
      value: available
        ? def.denominator
          ? (numerator / Number(denominator)) * factor
          : numerator
        : null,
      numerator,
      denominator,
      status: available ? ("available" as const) : ("unavailable" as const),
      reason: available
        ? null
        : "No compatible complete numeric evidence for this scope and denominator.",
      rowCount: rows.length,
      sourceId: source?.id ?? null,
      evidenceKind: source?.kind ?? null,
      tableId: table?.id ?? null,
      citations: table
        ? rows.slice(0, 25).map((row) => citation(revision, table, row))
        : [],
      citationsTruncated: rows.length > 25,
      caveats: [...(source?.caveats ?? []), ...(table?.caveats ?? [])],
      series: [...(entry?.periods.entries() ?? [])]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([period, group]) => {
          const n = total(group, def.numerator),
            d = def.denominator ? total(group, def.denominator) : null
          return {
            period,
            value:
              n === null || (def.denominator && (d === null || d === 0))
                ? null
                : def.denominator
                  ? (n / Number(d)) * factor
                  : n,
          }
        }),
    }
  })
  return {
    revision,
    name: bundle.name,
    description: bundle.description,
    filters,
    metrics,
    availableFilters: {
      vehicles: [
        ...new Set(
          bundle.tables.flatMap((t) =>
            t.kind === "maintenance"
              ? t.rows.map((r) => String(r.values.vehicle_id))
              : []
          )
        ),
      ].sort(),
      services: [
        ...new Set(
          bundle.tables.flatMap((t) =>
            t.kind === "operations"
              ? t.rows.map((r) => String(r.values.service))
              : []
          )
        ),
      ].sort(),
    },
    sources: bundle.sources,
    tables: bundle.tables.map((t) => ({
      id: t.id,
      title: t.title,
      sourceId: t.sourceId,
      kind: t.kind,
      columns: t.columns,
      caveats: t.caveats,
      rowCount: t.rows.length,
      filteredRowCount: selectedRows(t, filters).length,
    })),
    caveats: [
      "Descriptive associations are not causal proof. Missing evidence is unavailable, never zero.",
      "Date filters include complete monthly periods only. Service filters exclude vehicle-only maintenance; vehicle filters exclude service-only operational aggregates.",
    ],
  }
}
export type EvidenceAnalysis = ReturnType<typeof analyse>
export function inspectTable(
  bundle: DatasetBundle,
  revision: string,
  tableId: string,
  filters: EvidenceFilters,
  query: string,
  page: number
) {
  const table = bundle.tables.find((t) => t.id === tableId)
  if (!table) return null
  const rows = selectedRows(table, filters).filter((r) =>
    JSON.stringify(r.values).toLowerCase().includes(query.toLowerCase())
  )
  return {
    revision,
    tableId,
    title: table.title,
    columns: table.columns,
    sourceId: table.sourceId,
    caveats: table.caveats,
    total: rows.length,
    page,
    pageSize: 25,
    rows: rows
      .slice(page * 25, page * 25 + 25)
      .map((row) => ({ ...row, citation: citation(revision, table, row) })),
  }
}
export type EvidenceTablePage = NonNullable<ReturnType<typeof inspectTable>>

export function inspectRow(
  bundle: DatasetBundle,
  revision: string,
  tableId: string,
  rowId: string,
  filters: EvidenceFilters
) {
  const table = bundle.tables.find((t) => t.id === tableId)
  if (!table) return null
  const row = selectedRows(table, filters).find((r) => r.id === rowId)
  if (!row) return null
  return {
    revision,
    tableId,
    title: table.title,
    columns: table.columns,
    source: bundle.sources.find((s) => s.id === table.sourceId) ?? null,
    caveats: table.caveats,
    row: { ...row, citation: citation(revision, table, row) },
  }
}
export type EvidenceRowDetail = NonNullable<ReturnType<typeof inspectRow>>
