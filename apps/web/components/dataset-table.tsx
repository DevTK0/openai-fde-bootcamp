"use client"

import { useEffect, useId, useState } from "react"
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Eye,
  X,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@workspace/ui/components/sheet"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { useDashboard } from "./dashboard-provider"
import { useDatasetEditor, downloadCsv } from "./dataset-editor"
import {
  emptyRecordQuery,
  filterRecords,
  RECORD_PAGE_SIZE,
  recordsResultSchema,
  type RecordQuery,
} from "@/lib/record-query"
import { fmt, type Dataset, type Row } from "@/lib/fleet"
import type { z } from "zod"

type Source =
  | { kind: "local"; table: Dataset; rows: Row[] }
  | {
      kind: "report"
      table: Pick<Dataset, "id" | "title" | "file" | "columns">
      rows: Row[]
    }
  | {
      kind: "remote"
      table: Pick<Dataset, "id" | "title" | "file" | "columns">
    }
export function DatasetTable({ source }: { source: Source }) {
  const { table } = source
  const [query, setQuery] = useState<RecordQuery>(emptyRecordQuery)
  const [details, setDetails] = useState<Row | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<
    | { key: string; data: z.infer<typeof recordsResultSchema> }
    | { key: string; error: string }
  >()
  const dashboard = useDashboard()
  const formId = useId()
  const params = new URLSearchParams({
    table: table.id,
    ...Object.fromEntries(
      Object.entries(query).map(([k, v]) => [k, String(v)])
    ),
  }).toString()
  const requestKey = `${params}:${attempt}`
  useEffect(() => {
    if (source.kind !== "remote") return
    const controller = new AbortController()
    const timer = setTimeout(() => {
      fetch(`/api/operations?view=records&${params}`, {
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.ok)
            throw new Error("Records could not be loaded. Please retry.")
          return recordsResultSchema.parse(await response.json())
        })
        .then((data) => {
          if (!controller.signal.aborted) setResult({ key: requestKey, data })
        })
        .catch((error: unknown) => {
          if (!controller.signal.aborted)
            setResult({
              key: requestKey,
              error:
                error instanceof Error
                  ? error.message
                  : "Records could not be loaded.",
            })
        })
    }, 250)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [source.kind, params, requestKey, dashboard])
  const changeQuery = (patch: Partial<RecordQuery>) =>
    setQuery((current) => ({ ...current, ...patch, page: 0 }))
  const editor = useDatasetEditor(table.id, table.title, () => {
    setQuery((current) => ({ ...current, page: 0 }))
    setAttempt((a) => a + 1)
  })
  const filtered =
    source.kind !== "remote" ? filterRecords(source.rows, query) : []
  const remote =
    result?.key === requestKey && "data" in result ? result.data : undefined
  const total =
    source.kind !== "remote" ? filtered.length : (remote?.total ?? 0)
  const pages = Math.max(1, Math.ceil(total / RECORD_PAGE_SIZE))
  const page =
    source.kind !== "remote" ? Math.min(query.page, pages - 1) : query.page
  const rows =
    source.kind !== "remote"
      ? filtered.slice(page * RECORD_PAGE_SIZE, (page + 1) * RECORD_PAGE_SIZE)
      : (remote?.rows ?? [])
  const error =
    result?.key === requestKey && "error" in result ? result.error : undefined
  const loading = source.kind === "remote" && !remote && !error
  const active = !!(query.q || query.column || query.sort)
  return (
    <Card
      className="min-w-0 gap-4 overflow-hidden shadow-none"
      aria-label={`${table.title} records`}
    >
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>{table.title}</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            {source.kind !== "remote" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadCsv(table.title, table.columns, filtered)
                }
              >
                <ArrowDownToLine />
                Export CSV
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<a href={`/api/operations?view=export&${params}`} />}
              >
                <ArrowDownToLine />
                Export CSV
              </Button>
            )}
            {source.kind !== "report" && editor.actions}
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-48 flex-1 space-y-1.5">
            <Label htmlFor={`${formId}-search`}>Search records</Label>
            <div className="relative">
              <Search className="absolute top-2 left-2.5 size-4 text-muted-foreground" />
              <Input
                id={`${formId}-search`}
                placeholder="Search all fields…"
                value={query.q}
                maxLength={120}
                className="pl-9"
                onChange={(e) => changeQuery({ q: e.target.value })}
              />
            </div>
          </div>
          <div className="w-full space-y-1.5 sm:w-48">
            <Label htmlFor={`${formId}-column`}>Filter by</Label>
            <Select
              value={query.column || "__all"}
              onValueChange={(value) => {
                if (value !== null)
                  changeQuery({
                    column: value === "__all" ? "" : value,
                    value: "",
                    match: "contains",
                  })
              }}
            >
              <SelectTrigger id={`${formId}-column`} className="w-full">
                <SelectValue>
                  {query.column.replaceAll("_", " ") || "All fields"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all">All fields</SelectItem>
                {table.columns.map((column) => (
                  <SelectItem value={column} key={column}>
                    {column.replaceAll("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {query.column && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-match`}>Match</Label>
                <Select
                  value={query.match}
                  onValueChange={(value) => {
                    if (
                      value === "contains" ||
                      value === "equals" ||
                      value === "empty"
                    )
                      changeQuery({ match: value })
                  }}
                >
                  <SelectTrigger id={`${formId}-match`} className="min-w-32">
                    <SelectValue>
                      {query.match === "empty"
                        ? "Is blank"
                        : query.match === "equals"
                          ? "Equals"
                          : "Contains"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="empty">Is blank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {query.match !== "empty" && (
                <div className="min-w-40 flex-1 space-y-1.5">
                  <Label htmlFor={`${formId}-value`}>Filter value</Label>
                  <Input
                    id={`${formId}-value`}
                    placeholder={`Filter ${query.column.replaceAll("_", " ")}…`}
                    value={query.value}
                    maxLength={120}
                    onChange={(e) => changeQuery({ value: e.target.value })}
                  />
                </div>
              )}
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            disabled={!active}
            onClick={() => setQuery(emptyRecordQuery)}
          >
            <X />
            Reset
          </Button>
        </div>
        {editor.feedback}
      </CardHeader>
      {source.kind !== "report" && editor.panel}
      <Sheet
        open={details !== null}
        onOpenChange={(open) => {
          if (!open) setDetails(null)
        }}
      >
        <SheetContent className="w-full! overflow-y-auto sm:max-w-xl!">
          <SheetHeader>
            <SheetTitle>Record details</SheetTitle>
            <SheetDescription>{table.title}</SheetDescription>
          </SheetHeader>
          <dl className="space-y-4 px-4 pb-6">
            {details &&
              table.columns.map((column) => (
                <div key={column}>
                  <dt className="text-xs text-muted-foreground">
                    {column.replaceAll("_", " ")}
                  </dt>
                  <dd className="mt-1 text-sm break-words whitespace-pre-wrap">
                    {details[column] === null || details[column] === ""
                      ? "Not supplied"
                      : String(details[column] ?? "Not supplied")}
                  </dd>
                </div>
              ))}
          </dl>
        </SheetContent>
      </Sheet>
      <CardContent className="min-w-0 px-0">
        <div className="max-h-[32rem] overflow-auto" aria-busy={loading}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">Actions</TableHead>
                {table.columns.map((column) => (
                  <TableHead
                    key={column}
                    aria-sort={
                      query.sort === column
                        ? query.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        changeQuery({
                          sort: column,
                          direction:
                            query.sort === column && query.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      {column.replaceAll("_", " ")}
                      {query.sort === column ? (
                        query.direction === "asc" ? (
                          <ArrowUp />
                        ) : (
                          <ArrowDown />
                        )
                      ) : (
                        <ArrowUpDown className="text-muted-foreground" />
                      )}
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow
                  key={
                    source.kind === "local"
                      ? (source.table.recordIds?.[
                          source.table.rows.indexOf(row)
                        ] ?? i)
                      : (remote?.recordIds[i] ?? i)
                  }
                >
                  <TableCell className="px-4 py-2">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`View record ${String(row[table.columns[0] ?? ""] ?? i + 1)}`}
                        onClick={() => setDetails(row)}
                      >
                        <Eye />
                        View
                      </Button>
                      {source.kind !== "report" &&
                        editor.remove(
                          source.kind === "local"
                            ? source.table.recordIds?.[
                                source.table.rows.indexOf(row)
                              ]
                            : remote?.recordIds[i],
                          row
                        )}
                    </div>
                  </TableCell>
                  {table.columns.map((column) => {
                    const value = row[column]
                    return (
                      <TableCell
                        key={column}
                        className="max-w-80 min-w-32 px-4 py-3 text-xs"
                      >
                        <div className="max-w-72 truncate">
                          {value === null ||
                          value === undefined ||
                          value === "" ? (
                            <span className="text-muted-foreground">—</span>
                          ) : typeof value === "number" &&
                            !column.toLowerCase().includes("year") ? (
                            fmt(value, 6)
                          ) : (
                            String(value)
                          )}
                        </div>
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
              {!rows.length && (
                <TableRow>
                  <TableCell
                    colSpan={table.columns.length + 1}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    {error ? (
                      <div role="alert">
                        {error}
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-3"
                          onClick={() => setAttempt((a) => a + 1)}
                        >
                          Retry
                        </Button>
                      </div>
                    ) : loading ? (
                      <span role="status">Loading records…</span>
                    ) : (
                      <div>
                        <p>No matching records.</p>
                        <p className="mt-1 text-xs">
                          {active
                            ? "Try another search or reset the filters."
                            : source.kind === "report"
                              ? "No records in the selected report scope."
                              : "Add a record or upload a CSV to get started."}
                        </p>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 pt-4 text-xs text-muted-foreground">
          <span role="status">
            {loading
              ? "Loading…"
              : `${fmt(total)} ${total === 1 ? "record" : "records"} · Page ${page + 1} of ${pages} · ${RECORD_PAGE_SIZE} per page`}
          </span>
          <div className="flex gap-1">
            <Button
              aria-label="Previous page"
              variant="outline"
              size="icon-sm"
              disabled={loading || page === 0}
              onClick={() => setQuery({ ...query, page: page - 1 })}
            >
              <ChevronLeft />
            </Button>
            <Button
              aria-label="Next page"
              variant="outline"
              size="icon-sm"
              disabled={loading || page >= pages - 1}
              onClick={() => setQuery({ ...query, page: page + 1 })}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
