"use client"
import { useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import {
  ArrowDownToLine,
  ChevronLeft,
  ChevronRight,
  Info,
  Search,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@workspace/ui/components/chart"
import { Input } from "@workspace/ui/components/input"
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
import { csvExport, fmt, type Dataset, type Row } from "@/lib/fleet"
const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
]
export function Pick({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <Select
      value={value}
      onValueChange={(v) => {
        if (v !== null) onChange(v)
      }}
    >
      <SelectTrigger
        aria-label={label}
        className="h-9 max-w-full min-w-40 bg-card"
      >
        <SelectValue>
          {options.find((o) => o.value === value)?.label ?? value}
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {options.map((o) => (
          <SelectItem value={o.value} key={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card px-4 py-3 text-xs leading-relaxed text-muted-foreground">
      <Info className="mt-0.5 size-4 shrink-0 text-primary" />
      <div>{children}</div>
    </div>
  )
}
export function Metric({
  title,
  value,
  detail,
}: {
  title: string
  value: string
  detail: string
}) {
  return (
    <Card className="gap-3 shadow-none">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl font-semibold tracking-tight tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        {detail}
      </CardContent>
    </Card>
  )
}
type Series = { key: string; label: string }
export function Plot({
  title,
  description,
  rows,
  series,
  area = false,
}: {
  title: string
  description: string
  rows: Row[]
  series: Series[]
  area?: boolean
}) {
  const chartSeries = series.map((s, i) => ({ ...s, id: `series${i}` }))
  const chartRows = rows.map((row) => ({
    name: row.name,
    ...Object.fromEntries(chartSeries.map((s) => [s.id, row[s.key]])),
  }))
  const config = Object.fromEntries(
    chartSeries.map((s, i) => [
      s.id,
      { label: s.label, color: colors[i % colors.length] },
    ])
  )
  const axes = (
    <>
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey="name"
        tickLine={false}
        axisLine={false}
        tickMargin={10}
        minTickGap={18}
      />
      <YAxis
        tickLine={false}
        axisLine={false}
        width={52}
        tickFormatter={(v: number) =>
          Math.abs(v) >= 1000 ? `${fmt(v / 1000, 1)}k` : fmt(v, 1)
        }
      />
      <ChartTooltip content={<ChartTooltipContent />} />
      <ChartLegend content={<ChartLegendContent />} />
    </>
  )
  return (
    <Card
      className="min-w-0 shadow-none"
      data-report-chart={JSON.stringify({ title, description, rows, series })}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="h-72 w-full"
          aria-label={title}
        >
          {area ? (
            <AreaChart data={chartRows} margin={{ left: 0, right: 12, top: 8 }}>
              {axes}
              {chartSeries.map((s) => (
                <Area
                  key={s.key}
                  dataKey={s.id}
                  type="monotone"
                  fill={`var(--color-${s.id})`}
                  fillOpacity={0.1}
                  stroke={`var(--color-${s.id})`}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </AreaChart>
          ) : (
            <BarChart data={chartRows} margin={{ left: 0, right: 12, top: 8 }}>
              {axes}
              {chartSeries.map((s) => (
                <Bar
                  key={s.key}
                  dataKey={s.id}
                  fill={`var(--color-${s.id})`}
                  radius={[3, 3, 0, 0]}
                  maxBarSize={36}
                />
              ))}
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
function download(table: Dataset, rows: Row[]) {
  const url = URL.createObjectURL(
    new Blob([csvExport(table.columns, rows)], {
      type: "text/csv;charset=utf-8",
    })
  )
  const a = document.createElement("a")
  a.href = url
  a.download = `${table.title}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
export function Records({
  table,
  rows = table.rows,
}: {
  table: Dataset
  rows?: Row[]
}) {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<{ key: string; desc: boolean } | null>(null)
  const filtered = rows.filter((row) =>
    Object.values(row).some((v) =>
      String(v ?? "")
        .toLowerCase()
        .includes(query.toLowerCase())
    )
  )
  if (sort)
    filtered.sort((a, b) => {
      const av = a[sort.key],
        bv = b[sort.key]
      const result =
        av == null
          ? bv == null
            ? 0
            : 1
          : bv == null
            ? -1
            : typeof av === "number" && typeof bv === "number"
              ? av - bv
              : String(av).localeCompare(String(bv))
      return result * (sort.desc ? -1 : 1)
    })
  const pages = Math.max(1, Math.ceil(filtered.length / 10)),
    current = Math.min(page, pages - 1)
  return (
    <Card className="min-w-0 gap-4 overflow-hidden shadow-none">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>{table.title}</CardTitle>
            <CardDescription className="mt-1 break-all">
              {table.file} · {table.sheet}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => download(table, filtered)}
          >
            <ArrowDownToLine /> Export CSV
          </Button>
        </div>
        <div className="relative mt-2 max-w-sm">
          <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
          <Input
            aria-label={`Search ${table.title}`}
            placeholder="Search all fields…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(0)
            }}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent className="min-w-0 px-0">
        <Table>
          <TableHeader>
            <TableRow>
              {table.columns.map((col) => (
                <TableHead key={col}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setSort({
                        key: col,
                        desc: sort?.key === col ? !sort.desc : false,
                      })
                    }
                  >
                    {col.replaceAll("_", " ")}
                    {sort?.key === col ? (sort.desc ? " ↓" : " ↑") : ""}
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.slice(current * 10, current * 10 + 10).map((row, i) => (
              <TableRow key={i}>
                {table.columns.map((col) => (
                  <TableCell
                    key={col}
                    className="max-w-96 min-w-28 px-4 py-3 align-top text-xs leading-relaxed whitespace-normal"
                  >
                    {row[col] == null ? (
                      <span className="text-muted-foreground">—</span>
                    ) : typeof row[col] === "number" ? (
                      col.toLowerCase().includes("year") ? (
                        String(row[col])
                      ) : (
                        fmt(row[col] as number, 6)
                      )
                    ) : (
                      String(row[col])
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {!filtered.length && (
              <TableRow>
                <TableCell
                  colSpan={table.columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No matching records. Try another search or filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between gap-3 border-t px-5 pt-4 text-xs text-muted-foreground">
          <span>
            {fmt(filtered.length)} records · Page {current + 1} of {pages}
          </span>
          <div className="flex gap-1">
            <Button
              aria-label="Previous page"
              variant="outline"
              size="icon-sm"
              disabled={current === 0}
              onClick={() => setPage(current - 1)}
            >
              <ChevronLeft />
            </Button>
            <Button
              aria-label="Next page"
              variant="outline"
              size="icon-sm"
              disabled={current === pages - 1}
              onClick={() => setPage(current + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
