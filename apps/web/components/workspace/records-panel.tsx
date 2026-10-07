"use client"
import { Plot } from "@workspace/ui/components/report-chart"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { Pick } from "@/components/report-ui"
import type {
  EvidenceAnalysis,
  EvidenceTablePage,
} from "@/lib/evidence/analysis"
import { useResource } from "./use-resource"

export function RecordsPanel({
  analysis,
  scope,
  initialTable,
}: {
  analysis: EvidenceAnalysis
  scope: string
  initialTable: string
}) {
  const [tableId, setTableId] = useState(
    analysis.tables.some((item) => item.id === initialTable)
      ? initialTable
      : analysis.tables[0]?.id || ""
  )
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)
  const [numericColumn, setNumericColumn] = useState("")
  const resource = useResource<EvidenceTablePage>(
    `/api/workspace/${analysis.revision}?${scope}&view=table&table=${encodeURIComponent(tableId)}&q=${encodeURIComponent(search)}&page=${page}`
  )
  const table = analysis.tables.find((item) => item.id === tableId)
  const source = analysis.sources.find((item) => item.id === table?.sourceId)
  const numericColumns =
    resource.status === "ready"
      ? resource.data.columns.filter((column) =>
          resource.data.rows.some(
            (row) => typeof row.values[column] === "number"
          )
        )
      : []
  const chartColumn = numericColumns.includes(numericColumn)
    ? numericColumn
    : (numericColumns[0] ?? "")
  return (
    <Card id="records" className="min-w-0 shadow-none">
      <CardHeader>
        <CardTitle>Record inspector</CardTitle>
        <CardDescription>
          Row IDs and source IDs are stable within this revision. Filters apply
          before search and pagination.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Pick
            label="Evidence table"
            value={tableId}
            options={analysis.tables.map((item) => ({
              value: item.id,
              label: `${item.title} (${item.filteredRowCount})`,
            }))}
            onChange={(value) => {
              setTableId(value)
              setPage(0)
              setSearch("")
            }}
          />
          <Input
            className="max-w-sm"
            aria-label="Search records"
            placeholder="Search record values"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(0)
            }}
          />
        </div>
        {source && (
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              <Badge variant="outline">{source.kind}</Badge> {source.title} ·{" "}
              {source.id}
            </p>
            <p>{source.reference}</p>
            {[...source.caveats, ...(table?.caveats ?? [])].map((caveat) => (
              <p key={caveat}>{caveat}</p>
            ))}
          </div>
        )}
        {resource.status === "loading" && <p role="status">Loading records…</p>}
        {resource.status === "error" && <p role="alert">{resource.error}</p>}
        {resource.status === "ready" && (
          <>
            {chartColumn && (
              <div className="space-y-3">
                <Pick
                  label="Chart numeric column"
                  value={chartColumn}
                  options={numericColumns.map((column) => ({
                    value: column,
                    label: column,
                  }))}
                  onChange={setNumericColumn}
                />
                <Plot
                  title="Record comparison"
                  description={`${chartColumn} as supplied, current page only. One bar per row; no aggregation. Check units and evidence class before comparing.`}
                  rows={resource.data.rows.map((row) => ({
                    name: row.id,
                    value:
                      typeof row.values[chartColumn] === "number"
                        ? row.values[chartColumn]
                        : null,
                  }))}
                  series={[{ key: "value", label: chartColumn }]}
                />
              </div>
            )}
            <div className="max-h-96 overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Row ID</TableHead>
                    {resource.data.columns.map((column) => (
                      <TableHead key={column}>{column}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resource.data.rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-xs">
                        {row.id}
                      </TableCell>
                      {resource.data.columns.map((column) => (
                        <TableCell
                          key={column}
                          className="max-w-80 whitespace-normal"
                        >
                          {row.values[column] === null ||
                          row.values[column] === undefined
                            ? "Not recorded"
                            : String(row.values[column])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <p>
                {resource.data.total} matching records · Page {page + 1} of{" "}
                {Math.max(
                  1,
                  Math.ceil(resource.data.total / resource.data.pageSize)
                )}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                >
                  Previous records
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    (page + 1) * resource.data.pageSize >= resource.data.total
                  }
                  onClick={() => setPage(page + 1)}
                >
                  Next records
                </Button>
              </div>
            </div>
            {!resource.data.total && (
              <p>No matching records. Try a broader scope.</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
