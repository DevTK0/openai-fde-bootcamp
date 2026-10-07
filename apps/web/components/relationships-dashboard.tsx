"use client"

import { useDashboard } from "@/components/dashboard-provider"

import { useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts"
import { ArrowRight, Info } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { fmt, money, num } from "@/lib/fleet"
import { pearson } from "@/lib/relationships"

const palette = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"]
function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
      <Info className="mt-0.5 size-4 shrink-0" />
      <div>{children}</div>
    </div>
  )
}
function Stat({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <Card className="gap-3 shadow-none">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  )
}
function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (s: string) => void
}) {
  return (
    <Select
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v)
      }}
    >
      <SelectTrigger aria-label={label} className="max-w-full bg-card">
        <SelectValue>
          {options.find((o) => o.value === value)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
type Series = { key: string; label: string }
function Bars({
  title,
  description,
  rows,
  series,
  note,
}: {
  title: string
  description: string
  rows: Record<string, string | number>[]
  series: Series[]
  note: string
}) {
  return (
    <Card className="min-w-0 shadow-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="h-80 w-full"
          aria-label={title}
          data-report-chart={JSON.stringify({
            title,
            description,
            rows,
            series,
            note,
          })}
          config={Object.fromEntries(
            series.map((s, i) => [s.key, { label: s.label, color: palette[i] }])
          )}
        >
          <BarChart data={rows} margin={{ left: 0, right: 10, bottom: 30 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-30}
              textAnchor="end"
              height={55}
              tickFormatter={(v: string) => v.replace("NW-", "")}
            />
            <YAxis
              width={55}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => fmt(v, 1)}
            />
            <ReferenceLine y={0} stroke="var(--border)" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {series.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                fill={`var(--color-${s.key})`}
                radius={[3, 3, 0, 0]}
                maxBarSize={35}
              />
            ))}
          </BarChart>
        </ChartContainer>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {note}
        </p>
      </CardContent>
    </Card>
  )
}
type Point = { x: number; y: number; label: string }
function Dots({
  title,
  description,
  groups,
  xLabel,
  yLabel,
  note,
}: {
  title: string
  description: string
  groups: { label: string; points: Point[] }[]
  xLabel: string
  yLabel: string
  note: string
}) {
  return (
    <Card className="min-w-0 shadow-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          aria-label={title}
          data-report-chart={JSON.stringify({
            title,
            description,
            groups,
            xLabel,
            yLabel,
            note,
          })}
          className="h-80 w-full"
          config={Object.fromEntries(
            groups.map((g, i) => [
              `g${i}`,
              { label: g.label, color: palette[i % palette.length] },
            ])
          )}
        >
          <ScatterChart margin={{ top: 12, right: 18, bottom: 25, left: 0 }}>
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey="x"
              name={xLabel}
              tickLine={false}
              label={{ value: xLabel, position: "bottom", offset: 0 }}
              tickFormatter={(v: number) => fmt(v)}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yLabel}
              width={62}
              tickLine={false}
              tickFormatter={(v: number) => fmt(v)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) =>
                    String(payload[0]?.payload?.label ?? "Observation")
                  }
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            {groups.map((g, i) => (
              <Scatter
                key={g.label}
                name={`g${i}`}
                data={g.points}
                fill={`var(--color-g${i})`}
                fillOpacity={0.7}
              />
            ))}
          </ScatterChart>
        </ChartContainer>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {note}
        </p>
      </CardContent>
    </Card>
  )
}
const pct = (a: number, b: number) => (b / a - 1) * 100
function CostsAndUse() {
  const { vehicles, annualTotals, annualVehicles, monthlyPoints } =
    useDashboard()
  const [vehicle, setVehicle] = useState("all")
  const [measure, setMeasure] = useState("repair_cost_sgd")
  const points = monthlyPoints(vehicle, measure),
    r = pearson(points)
  const [basis, setBasis] = useState("rate")
  const a = annualTotals.earlier,
    b = annualTotals.latest
  const focus = annualVehicles.filter((v) =>
    ["NW-V020", "NW-V005"].includes(v.vehicle)
  )
  const share =
    (focus.reduce((s, v) => s + v.latest.repair - v.earlier.repair, 0) /
      (b.repair - a.repair)) *
    100
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          title="Repair spending increase"
          value={`+${fmt(pct(a.repair, b.repair), 1)}%`}
          description={`${money(a.repair)} → ${money(b.repair)}; distance rose ${fmt(pct(a.km, b.km), 1)}%`}
        />
        <Stat
          title="Repair cost per 1,000 km"
          value={`+${fmt(pct(a.rate, b.rate), 1)}%`}
          description={`${money(a.rate)} → ${money(b.rate)} after accounting for distance`}
        />
        <Stat
          title="Increase from V020 + V005"
          value={`${fmt(share, 1)}%`}
          description="Share of the net increase in repair spending"
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Bars
          title="Repairs outpace vehicle use"
          description="Percentage change · Oct 2024–Sep 2025 → Oct 2025–Sep 2026"
          rows={[
            { name: "Distance", change: pct(a.km, b.km) },
            { name: "Repair jobs", change: pct(a.jobs, b.jobs) },
            { name: "Repair spend", change: pct(a.repair, b.repair) },
            { name: "Repair holds", change: pct(a.holds, b.holds) },
          ]}
          series={[{ key: "change", label: "Change (%)" }]}
          note="Source: monthly_vehicle_history.csv · same eight vehicles and equal twelve-month periods. Repair holds are vehicle unavailability, not passenger delay."
        />
        <Bars
          title="Who contributes to the cost increase?"
          description="Change in annual repair spending · SGD · negative bars are reductions"
          rows={annualVehicles
            .map((v) => ({
              name: v.vehicle,
              change: v.latest.repair - v.earlier.repair,
            }))
            .sort((a, b) => b.change - a.change)}
          series={[{ key: "change", label: "Repair cost change (SGD)" }]}
          note="Source: monthly_vehicle_history.csv · V020 and V005 contribute most of the net increase; reductions elsewhere offset part of it."
        />
      </div>
      <div className="space-y-3">
        <Choice
          label="Vehicle comparison measure"
          value={basis}
          onChange={setBasis}
          options={[
            { value: "rate", label: "Repair cost per 1,000 km" },
            { value: "repair", label: "Total repair spending" },
          ]}
        />
        <Bars
          title="Compare vehicles on equal periods"
          description={
            basis === "rate"
              ? "SGD per 1,000 recorded km · matched-period exposure"
              : "Recorded repair spending · SGD"
          }
          rows={annualVehicles.map((v) => ({
            name: v.vehicle,
            earlier: v.earlier[basis as "rate" | "repair"],
            latest: v.latest[basis as "rate" | "repair"],
          }))}
          series={[
            { key: "earlier", label: "Oct 2024–Sep 2025" },
            { key: "latest", label: "Oct 2025–Sep 2026" },
          ]}
          note="Source: monthly_vehicle_history.csv · V140 has the highest latest-year cost/km, but only four repairs and 9,410 km. Small denominators can amplify rates."
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <Choice
          label="Relationship vehicle"
          value={vehicle}
          onChange={setVehicle}
          options={[
            { value: "all", label: "All eight vehicles" },
            ...vehicles.map((v) => ({ value: v, label: v })),
          ]}
        />
        <Choice
          label="Relationship measure"
          value={measure}
          onChange={setMeasure}
          options={[
            { value: "repair_cost_sgd", label: "Repair spending (SGD)" },
            {
              value: "scheduled_service_count",
              label: "Routine-service count",
            },
          ]}
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Dots
          title="How closely does activity follow mileage?"
          description={`${points.length} vehicle-months · Pearson r = ${r === null ? "undefined" : r.toFixed(2)} · both historical years`}
          groups={[
            {
              label: vehicle === "all" ? "All vehicle-months" : vehicle,
              points,
            },
          ]}
          xLabel="Recorded km / month"
          yLabel={
            measure === "repair_cost_sgd"
              ? "Repair spending (SGD)"
              : "Routine services"
          }
          note="Source: monthly_vehicle_history.csv · use the vehicle filter to inspect within-bus patterns. Repeated months are not independent samples; correlation does not establish causation."
        />
        <Dots
          title="Age alone does not identify expensive buses"
          description="Latest complete year · eight selected vehicles"
          groups={[
            {
              label: "Vehicles",
              points: annualVehicles.map((v) => ({
                x: 2026 - v.year,
                y: v.latest.rate,
                label: `${v.vehicle} · ${v.latest.jobs} repairs · ${fmt(v.latest.km)} km`,
              })),
            },
          ]}
          xLabel="2026 minus in-service year"
          yLabel="Repair SGD / 1,000 km"
          note="Sources: Fleet register + monthly_vehicle_history.csv · age is approximate (year only). V140 is newest but has the highest rate; this does not establish an age effect."
        />
      </div>
    </div>
  )
}
function Components() {
  const { vehicles, annualVehicles, componentObservations } = useDashboard()
  const hvac = componentObservations.filter(
    (r) => typeof r.condenser_obstruction_before_pct === "number"
  )
  const points = hvac.map((r) => ({
    x: num(r, "km_since_component_attention"),
    y: num(r, "condenser_obstruction_before_pct"),
    label: `${r.observation_id} · ${r.vehicle_id} · ${r.observed_on}`,
  }))
  const comparison = annualVehicles.filter((v) =>
    ["NW-V020", "NW-V009"].includes(v.vehicle)
  )
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          title="Selected condenser observations"
          value={String(hvac.length)}
          description="Three vehicles · February–August 2026"
        />
        <Stat
          title="Distance vs obstruction"
          value={`r = ${pearson(points)!.toFixed(2)}`}
          description="Pooled descriptive correlation across selected visits"
        />
        <Stat
          title="What this supports"
          value="Investigate"
          description="A component-specific cleaning interval; no optimal threshold or savings established"
        />
      </div>
      <Dots
        title="Longer attention intervals, greater obstruction"
        description="Condenser obstruction before work (%) against distance since component attention"
        groups={["NW-V020", "NW-V009", "NW-V002"].map((v) => ({
          label: v,
          points: hvac
            .filter((r) => r.vehicle_id === v)
            .map((r) => ({
              x: num(r, "km_since_component_attention"),
              y: num(r, "condenser_obstruction_before_pct"),
              label: `${r.observation_id} · ${r.vehicle_id} · ${r.observed_on}`,
            })),
        }))}
        xLabel="Km since component attention"
        yLabel="Obstruction before work (%)"
        note="Source: selected_component_observations.csv · visual estimates to the nearest 5 percentage points. Selected repeated visits and vehicle differences confound this relationship. Routine servicing does not reset the component-attention interval."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <Bars
          title="Condition before and after recorded work"
          description="Selected condenser visits · obstruction (%)"
          rows={hvac.map((r) => ({
            name: String(r.observation_id),
            before: num(r, "condenser_obstruction_before_pct"),
            after: num(r, "condenser_obstruction_after_pct"),
          }))}
          series={[
            { key: "before", label: "Before (%)" },
            { key: "after", label: "After (%)" },
          ]}
          note="Source: selected_component_observations.csv · these measurements show the recorded visit outcome, not how long improvement lasted."
        />
        <Bars
          title="A comparison worth testing"
          description="Latest year · repair + additional preventive spending per 1,000 km"
          rows={comparison.map((v) => ({
            name: v.vehicle,
            repair: v.latest.rate,
            preventive: (v.latest.preventive / v.latest.km) * 1000,
          }))}
          series={[
            { key: "repair", label: "Repair SGD / 1,000 km" },
            { key: "preventive", label: "Preventive SGD / 1,000 km" },
          ]}
          note={`Source: monthly_vehicle_history.csv · V009: 14 additional visits, combined S$105/1,000 km. V020: 1 visit, combined S$268/1,000 km. Similar mileage, but no controlled intervention or measured saving; routine-service charges are excluded.`}
        />
      </div>
      <Note>
        Similar symptoms can have different causes. V020’s detailed cooling
        findings include a hose leak, dirty surfaces, and an intermittent relay.
        V005’s selected door visits include dirt, a worn roller, and a connector
        fault. Cleaning does not address every recorded finding. These visit
        charges are already included in historical totals.
      </Note>
    </div>
  )
}
const interpretations: Record<string, string> = {
  PC01: "Cooling comfort: same-day MWO002 found dirty filter/condenser surfaces. The approximately 24-minute arrival delay has no supplied mechanical attribution.",
  PC02: "Cooling comfort: same-day MWO003 found an intermittent condenser-fan relay. Similar symptoms, different findings; delay cause is not established.",
  PC03: "Crew cover: action NW-A0017 used V039 on the earlier departure. Its retained 06:20 trip then departed about 20 minutes late; the original vehicle remained released.",
  PC04: "Crew cover: action NW-A0058 used V039 on the earlier departure. Its retained 06:20 trip departed about 20 minutes late; no mechanical withdrawal is recorded.",
  PC05: "Substitution: the different bus is documented and the 06:00 departure was on time. A substitution alone does not imply a fault.",
  PC07: "Capacity: 115 people waited, 85 boarded, and 30 remained. This supports a boarding constraint; the passenger’s individual wait is not independently verified.",
}
function PassengerLinks() {
  const {
    matchPassengerReports,
    operationsPassengers,
    boardingHistory,
    operationsManifest,
  } = useDashboard()
  const links = matchPassengerReports()
  const confirmed = operationsPassengers.filter(
    (c) => c.matches.length === 1
  ).length
  return (
    <div className="space-y-6">
      <Note>
        {confirmed} of {operationsPassengers.length} reports confirmed against{" "}
        {fmt(operationsManifest.coverage.trips)} full-source origin departures.
        Matches use the reported stop, supplied vehicle/service identifiers, and
        journey window. Expected departures match scheduled times; observed
        departures match actual times. Each report has one matching origin
        departure among all 6,900 supplied trips. This is a bounded morning
        cohort, not a complete service day.
      </Note>
      <div>
        <Bars
          title="The matching trips have different delay patterns"
          description="Minutes · not individual passenger waiting time"
          rows={links.flatMap(({ report, matches }) =>
            matches.map((r) => ({
              name: String(report["Case ID"]),
              departure: num(r, "Departure delay seconds") / 60,
              arrival: num(r, "Arrival delay seconds") / 60,
            }))
          )}
          series={[
            { key: "departure", label: "Departure delay (min)" },
            { key: "arrival", label: "Arrival delay (min)" },
          ]}
          note="Sources: Passenger reports + full trips.csv / stop_calls.csv · negative values mean early arrival. The cooling-report journeys left near schedule but arrived late; that timing alone does not diagnose a fault."
        />
      </div>
      <Bars
        title={`The ${boardingHistory.departure} service ${boardingHistory.service} bus filled up and left people waiting on ${boardingHistory.rows.filter((r) => r.remaining > 0 && r.onboard === r.capacity).length} of ${boardingHistory.rows.length} mornings`}
        description={`People per departure · same origin stop ${boardingHistory.stop} · 5–16 October 2026 · bus capacity: 85`}
        rows={boardingHistory.rows.map((r) => ({
          name: `${Number(r.date.slice(8))} Oct${r.reported ? " (PC07)" : ""}`,
          boarded: r.boarded,
          remaining: r.remaining,
        }))}
        series={[
          { key: "boarded", label: "Boarded the bus" },
          { key: "remaining", label: "Left waiting at the stop" },
        ]}
        note="Sources: trips.csv + stop_calls.csv · same route, origin and scheduled 07:15 departure across all ten supplied weekdays, including both mornings with nobody left waiting. On eight mornings, the bus carried its full 85-person capacity and left 24–39 people waiting. PC07 is the complaint linked to 6 October. These fictional operating observations support a recurring capacity problem in this sample; they do not measure how long people waited for another bus."
      />
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Daily boarding counts for the 07:15 departure</CardTitle>
          <CardDescription>
            Waiting before boarding = boarded + left waiting. PC07 is one
            example of the repeated pattern.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Waiting before boarding</TableHead>
                <TableHead>Boarded</TableHead>
                <TableHead>Left waiting</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {boardingHistory.rows.map((r) => (
                <TableRow
                  key={r.tripId}
                  className={r.reported ? "bg-muted/50" : undefined}
                >
                  <TableCell>
                    {Number(r.date.slice(8))} October
                    {r.reported ? " · PC07" : ""}
                  </TableCell>
                  <TableCell>{r.waiting}</TableCell>
                  <TableCell>{r.boarded}</TableCell>
                  <TableCell>{r.remaining}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="min-w-0 shadow-none">
        <CardHeader>
          <CardTitle>Follow the evidence for each account</CardTitle>
          <CardDescription>
            Sources: 04 Passenger reports → 02 Service observations / Control
            evidence → 01 Repairs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case</TableHead>
                <TableHead>Matched observation</TableHead>
                <TableHead>Vehicle / service</TableHead>
                <TableHead>What the linked records support</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map(({ report, matches }) => (
                <TableRow key={String(report["Case ID"])}>
                  <TableCell className="align-top font-medium">
                    {String(report["Case ID"])}
                  </TableCell>
                  <TableCell className="align-top">
                    {matches
                      .map((r) => String(r["Service observation ID"]))
                      .join(", ") || "No match"}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {String(report["Journey window start"]).slice(0, 10)}
                    </p>
                  </TableCell>
                  <TableCell className="align-top">
                    {matches
                      .map(
                        (r) => `${r["Actual vehicle ID"]} / ${r["Service no"]}`
                      )
                      .join(", ")}
                  </TableCell>
                  <TableCell className="max-w-xl min-w-64 align-top text-xs leading-relaxed whitespace-normal">
                    {interpretations[String(report["Case ID"])]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
function Constraints() {
  const { dataset, annualVehicles } = useDashboard()
  const requests = dataset("Maintenance planning", "Requested maintenance").rows
  const capacity = dataset("Maintenance planning", "Bay and staffing capacity")
    .rows[0]!
  const hold = dataset(
    "Incident baseline",
    "Engineering work order known at 17:00"
  ).rows[0]!
  return (
    <div className="space-y-6">
      <Bars
        title="The proposed 09:00 jobs exceed capacity"
        description="19 October · simultaneous demand during the 09:00–11:00 overlap"
        rows={[
          {
            name: "Bays",
            requested: requests.reduce(
              (s, r) => s + num(r, "Required bays"),
              0
            ),
            available: num(capacity, "Available bays"),
          },
          {
            name: "Technicians",
            requested: requests.reduce(
              (s, r) => s + num(r, "Required technicians"),
              0
            ),
            available: num(capacity, "Available technicians"),
          },
        ]}
        series={[
          { key: "requested", label: "Requested at 09:00" },
          { key: "available", label: "Available" },
        ]}
        note="Source: 03 Workshop and fleet / Maintenance planning · two bays and three technicians requested, one bay and two technicians available. The requests need rescheduling and complete service cover."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader>
            <Badge variant="outline">19 October planning window</Badge>
            <CardTitle>Workshop time also consumes service capacity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              V020 is requested for 09:00–13:00 and V009 for 09:00–11:00. Both
              have protected service 132 trips during that window.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Workshop request</Badge>
              <ArrowRight className="size-4" />
              <Badge variant="secondary">Service cover</Badge>
              <ArrowRight className="size-4" />
              <Badge variant="secondary">Engineering release</Badge>
            </div>
            <p className="text-muted-foreground">
              Only V005 is offered as additional cover. Its capacity fits the
              stated loads, but one bus cannot cover simultaneous duties. A
              feasible plan must preserve journeys, turnarounds, crew takeover,
              and confirmed release.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader>
            <Badge variant="outline">
              16 October · separate evening baseline
            </Badge>
            <CardTitle>
              Low historical cost does not mean available now
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              V050 recorded{" "}
              {money(
                annualVehicles.find((v) => v.vehicle === "NW-V050")!.latest
                  .repair
              )}{" "}
              in latest-year repairs, yet work order{" "}
              {String(hold["Work order ID"])} places it on hold at 16:20.
            </p>
            <Badge variant="destructive">
              Release state: {String(hold["Release state"])}
            </Badge>
            <p className="text-muted-foreground">
              At 17:00, the estimated completion is 17:30 and confirmed release
              is missing. Seven other buses retain protected evening duties.
              Historical cost and morning readiness do not establish an
              available relief vehicle.
            </p>
          </CardContent>
        </Card>
      </div>
      <Note>
        Source: 03_workshop_and_fleet.xlsx. The 19 October workshop plan, 9
        November festival allocations, and 16 October evening incident are
        separate dated scenarios. Future allocations require day-of-service
        release; historical records cannot be carried forward as availability.
      </Note>
    </div>
  )
}
export function RelationshipsDashboard() {
  const { data, operationsManifest } = useDashboard()
  return (
    <div className="space-y-6">
      <Note>
        Exploratory relationships in a fictional eight-bus sample. Historical
        comparisons use the monthly CSV once; duplicate workbook views and
        selected visits are not added again. All money is SGD excluding tax.
        Associations identify questions to investigate, not causal effects or
        proven savings.
      </Note>
      <Tabs defaultValue="costs" className="gap-6">
        <TabsList className="h-auto! w-full flex-wrap justify-start sm:w-fit">
          <TabsTrigger value="costs">Costs & use</TabsTrigger>
          <TabsTrigger value="components">Component care</TabsTrigger>
          <TabsTrigger value="passengers">Passenger evidence</TabsTrigger>
          <TabsTrigger value="constraints">Planning constraints</TabsTrigger>
        </TabsList>
        <TabsContent value="costs">
          <CostsAndUse />
        </TabsContent>
        <TabsContent value="components">
          <Components />
        </TabsContent>
        <TabsContent value="passengers">
          <PassengerLinks />
        </TabsContent>
        <TabsContent value="constraints">
          <Constraints />
        </TabsContent>
      </Tabs>
      <p className="text-xs text-muted-foreground">
        Full source records and field definitions remain available in Data
        explorer · {data.tables.length} handout tables +{" "}
        {operationsManifest.tables.length} operations tables.
      </p>
    </div>
  )
}
