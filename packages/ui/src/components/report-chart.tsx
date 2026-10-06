"use client"

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

const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
]
const formatTick = (value: number) =>
  value.toLocaleString("en-SG", { maximumFractionDigits: 1 })

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
  rows: Record<string, string | number | null>[]
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
          Math.abs(v) >= 1000 ? `${formatTick(v / 1000)}k` : formatTick(v)
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
