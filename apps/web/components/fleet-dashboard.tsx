"use client"

import { Plot } from "@workspace/ui/components/report-chart"

import { useState } from "react"
import { Pick, Notice, Metric, Records } from "@/components/report-ui"
import {
  OperationsDashboard,
  OperationsSources,
} from "@/components/operations-dashboard"
import { operationsManifest } from "@/lib/operations"
import operationsPassengers from "@/lib/operations-passengers.json"
import { RelationshipsDashboard } from "@/components/relationships-dashboard"
import { RoutePlanningDashboard } from "@/components/route-planning-dashboard"
import {
  Activity,
  ArrowUpRight,
  BusFront,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  Database,
  FileSpreadsheet,
  Gauge,
  LayoutDashboard,
  MessageSquareText,
  Wrench,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"
import {
  data,
  dataset,
  filterHistory,
  fmt,
  money,
  num,
  sum,
  vehicles,
  groupSum,
  type Dataset,
} from "@/lib/fleet"

const sections = [
  {
    id: "overview",
    label: "Fleet overview",
    icon: LayoutDashboard,
    description:
      "A clear view of cost, use, and maintenance across the selected fleet.",
  },
  {
    id: "relationships",
    label: "Relationships",
    icon: ChartNoAxesCombined,
    description:
      "Explore how use, cost, component condition, and passenger experience connect.",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: Wrench,
    description:
      "Repair history, routine servicing, and recorded component findings.",
  },
  {
    id: "operations",
    label: "Operations",
    icon: Activity,
    description:
      "172 operating vehicles · 24 services · detailed journeys, queues, and resources for 5–16 October 2026.",
  },
  {
    id: "route-planning",
    label: "Route planning MVP",
    icon: BusFront,
    description:
      "Compare crowded and quieter services before a planner considers moving bus capacity.",
  },
  {
    id: "planning",
    label: "Workshop & planning",
    icon: CalendarDays,
    description:
      "Workshop requests, festival allocations, and the evening incident baseline.",
  },
  {
    id: "passengers",
    label: "Passenger reports",
    icon: MessageSquareText,
    description:
      "Six selected accounts, preserved alongside their reported journey details.",
  },
  {
    id: "costs",
    label: "Cost options",
    icon: ChartNoAxesCombined,
    description:
      "Compare proposed quotes with clearly separated historical expenditure.",
  },
  {
    id: "explorer",
    label: "Data explorer",
    icon: Database,
    description:
      "Explore every imported table, source field, and coverage note.",
  },
] as const
function SourceChart({ table }: { table: Dataset }) {
  const numeric = table.columns.filter((col) =>
    table.rows.some((r) => typeof r[col] === "number")
  )
  const [field, setField] = useState(numeric[0] ?? "__count")
  const [category, setCategory] = useState(table.columns[0]!)
  const [offset, setOffset] = useState(0)
  const countMode = field === "__count"
  const chartRows = countMode
    ? groupSum(
        table.rows.map((r) => ({ ...r, __count: 1 })),
        category,
        ["__count"]
      ).map((r) => ({ name: r.name!, value: r.__count! }))
    : table.rows.map((r, i) => ({
        name: `${i + 1} · ${r[category] ?? "Not supplied"}`,
        value: r[field] ?? null,
      }))
  const pageCount = Math.max(1, Math.ceil(chartRows.length / 20))
  const page = Math.min(offset, pageCount - 1)
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Pick
          label="Chart measure"
          value={field}
          onChange={(v) => {
            setField(v)
            setOffset(0)
          }}
          options={[
            { value: "__count", label: "Record count by category" },
            ...numeric.map((c) => ({
              value: c,
              label: c.replaceAll("_", " "),
            })),
          ]}
        />
        <Pick
          label="Chart labels"
          value={category}
          onChange={(v) => {
            setCategory(v)
            setOffset(0)
          }}
          options={table.columns.map((c) => ({
            value: c,
            label: c.replaceAll("_", " "),
          }))}
        />
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Previous chart records"
          disabled={page === 0}
          onClick={() => setOffset(page - 1)}
        >
          <ChevronLeft />
        </Button>
        <span className="text-xs text-muted-foreground">
          Chart {page + 1} / {pageCount}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Next chart records"
          disabled={page >= pageCount - 1}
          onClick={() => setOffset(page + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
      <Plot
        title={
          countMode ? `Records by ${category}` : field.replaceAll("_", " ")
        }
        description={
          countMode
            ? "Counts source records in each category; overlapping tables are not combined."
            : "Individual source values in source order · up to 20 records per chart · blanks remain missing, not zero. Units follow the selected field."
        }
        rows={chartRows.slice(page * 20, page * 20 + 20)}
        series={[
          {
            key: "value",
            label: countMode ? "Records" : field.replaceAll("_", " "),
          },
        ]}
      />
    </div>
  )
}
function SourcePicker({
  tables,
  visualize = false,
}: {
  tables: Dataset[]
  visualize?: boolean
}) {
  const [id, setId] = useState(tables[0]!.id)
  const table = tables.find((t) => t.id === id) ?? tables[0]!
  return (
    <div className="space-y-4">
      <Pick
        label="Source table"
        value={table.id}
        options={tables.map((t) => ({
          value: t.id,
          label: `${t.sheet} · ${t.title}`,
        }))}
        onChange={setId}
      />
      {visualize && <SourceChart key={`chart-${table.id}`} table={table} />}
      <Records key={table.id} table={table} />
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Source notes & coverage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs leading-relaxed text-muted-foreground">
          {table.notes.map((note, i) => (
            <p key={i}>{note}</p>
          ))}
          <p>
            Blank cells mean not supplied or not applicable. Dates and times are
            Singapore local time (UTC+08).
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
function Overview({ vehicle, period }: { vehicle: string; period: string }) {
  const rows = filterHistory(vehicle, period)
  const repair = sum(rows, "repair_cost_sgd"),
    routine = sum(rows, "scheduled_service_cost_sgd"),
    preventive = sum(rows, "additional_preventive_cost_sgd"),
    km = sum(rows, "recorded_km")
  const monthly = groupSum(rows, "month", [
    "repair_cost_sgd",
    "scheduled_service_cost_sgd",
    "additional_preventive_cost_sgd",
  ])
  const ranked = groupSum(rows, "vehicle_id", [
    "repair_cost_sgd",
    "recorded_km",
  ]).sort((a, b) => num(b, "repair_cost_sgd") - num(a, "repair_cost_sgd"))
  const comparison = vehicles
    .filter((v) => vehicle === "all" || vehicle === v)
    .map((v) => ({
      name: v,
      earlier: sum(filterHistory(v, "earlier"), "repair_cost_sgd"),
      latest: sum(filterHistory(v, "latest"), "repair_cost_sgd"),
    }))
  return (
    <div className="space-y-6">
      <div className="grid gap-4 @lg/dashboard:grid-cols-2 @4xl/dashboard:grid-cols-4">
        <Metric
          title="Recorded maintenance cost"
          value={money(repair + routine + preventive)}
          detail="Repairs + routine service + preventive work"
        />
        <Metric
          title="Corrective repairs"
          value={fmt(sum(rows, "repair_count"))}
          detail={`${money(repair)} in recorded repair charges`}
        />
        <Metric
          title="Recorded distance"
          value={`${fmt(km)} km`}
          detail={`${fmt(sum(rows, "recorded_operating_hours"), 1)} operating hours · matched period`}
        />
        <Metric
          title="Repair cost / 1,000 km"
          value={money(km ? (repair / km) * 1000 : 0)}
          detail="Repair charges divided by matched-period use"
        />
      </div>
      <div className="grid gap-6 @4xl/dashboard:grid-cols-[1.6fr_1fr]">
        <Plot
          title="Maintenance spending over time"
          description="Monthly charges · SGD excluding tax"
          rows={monthly}
          area
          series={[
            { key: "scheduled_service_cost_sgd", label: "Routine service" },
            { key: "repair_cost_sgd", label: "Repairs" },
            { key: "additional_preventive_cost_sgd", label: "Preventive" },
          ]}
        />
        <Plot
          title="Repair spending by vehicle"
          description="Selected period · ranked by recorded cost (SGD)"
          rows={ranked}
          series={[{ key: "repair_cost_sgd", label: "Repair cost" }]}
        />
      </div>
      <div className="grid gap-6 @4xl/dashboard:grid-cols-2">
        <Plot
          title="Like-for-like annual repair spend"
          description="Always compares two complete October–September periods · SGD"
          rows={comparison}
          series={[
            { key: "earlier", label: "2024–25" },
            { key: "latest", label: "2025–26" },
          ]}
        />
        <Plot
          title="Recorded vehicle unavailability"
          description="Selected period · vehicle hold hours, not passenger delay"
          rows={groupSum(rows, "vehicle_id", [
            "repair_unavailable_hours",
            "scheduled_maintenance_unavailable_hours",
          ])}
          series={[
            { key: "repair_unavailable_hours", label: "Repair holds" },
            {
              key: "scheduled_maintenance_unavailable_hours",
              label: "Scheduled maintenance",
            },
          ]}
        />
      </div>
      <Notice>
        The monthly ledger is the single source for these totals. Workbook
        summaries, annual repair summaries, and selected visits overlap this
        ledger and are not added again. This is a selected eight-bus sample, not
        the 172-vehicle fleet.
      </Notice>
      <Records
        table={dataset("Fleet")}
        rows={dataset("Fleet").rows.filter(
          (r) => vehicle === "all" || r["Vehicle ID"] === vehicle
        )}
      />
    </div>
  )
}
function Maintenance({ vehicle, period }: { vehicle: string; period: string }) {
  const rows = filterHistory(vehicle, period)
  const tables = data.tables.filter((t) =>
    ["Repairs", "Servicing", "Inspections", "Selected observations"].includes(
      t.sheet
    )
  )
  return (
    <div className="space-y-6">
      <div className="grid gap-4 @2xl/dashboard:grid-cols-3">
        <Metric
          title="Routine services"
          value={fmt(sum(rows, "scheduled_service_count"))}
          detail="Completed required routine services"
        />
        <Metric
          title="Additional preventive visits"
          value={fmt(sum(rows, "additional_preventive_visits"))}
          detail="Separate from required routine services"
        />
        <Metric
          title="Maintenance hold hours"
          value={fmt(
            sum(rows, "repair_unavailable_hours") +
              sum(rows, "scheduled_maintenance_unavailable_hours"),
            1
          )}
          detail="Repair and scheduled holds do not overlap"
        />
      </div>
      <Plot
        title="Monthly maintenance activity"
        description="Selected historical period · completed jobs and visits"
        rows={groupSum(rows, "month", [
          "repair_count",
          "scheduled_service_count",
          "additional_preventive_visits",
        ])}
        series={[
          { key: "scheduled_service_count", label: "Routine services" },
          { key: "repair_count", label: "Repair jobs" },
          { key: "additional_preventive_visits", label: "Preventive visits" },
        ]}
      />
      <Notice>
        Historical filters apply to the chart and metrics above. Detailed
        extracts below retain their own dates and all vehicles. Repair jobs are
        not breakdown counts; repeated symptoms do not establish a shared cause.
        Estimated completion and routine-service completion do not establish
        vehicle release.
      </Notice>
      <SourcePicker tables={tables} />
    </div>
  )
}
function SelectedOperations() {
  const daily = dataset("Daily usage").rows,
    observations = dataset("Service observations").rows
  return (
    <div className="space-y-6">
      <div className="grid gap-4 @2xl/dashboard:grid-cols-3">
        <Metric
          title="Completed trips"
          value={fmt(sum(daily, "Completed trips"))}
          detail="Supplied ten weekday morning cohorts"
        />
        <Metric
          title="Recorded use"
          value={`${fmt(sum(daily, "Recorded total km"))} km`}
          detail={`${fmt(sum(daily, "Recorded operating hours"), 1)} running hours including listed positioning`}
        />
        <Metric
          title="Selected trip observations"
          value={String(observations.length)}
          detail="Selected observations, not network-wide performance"
        />
      </div>
      <div className="grid gap-6 @4xl/dashboard:grid-cols-2">
        <Plot
          title="Recorded distance by service"
          description="October extract · km · daily rows only, excluding duplicate weekly totals"
          rows={groupSum(daily, "Service no", ["Recorded total km"])}
          series={[{ key: "Recorded total km", label: "Distance (km)" }]}
        />
        <Plot
          title="Selected departure and arrival delays"
          description="Minutes · negative values indicate early arrival"
          rows={observations.map((r) => ({
            name: r["Service observation ID"]!,
            departure: num(r, "Departure delay seconds") / 60,
            arrival: num(r, "Arrival delay seconds") / 60,
          }))}
          series={[
            { key: "departure", label: "Departure (min)" },
            { key: "arrival", label: "Arrival (min)" },
          ]}
        />
      </div>
      <Notice>
        The October extract is a partial operating window, not a complete month.
        Morning release records end at 16:00 and cannot establish evening
        availability. Service delay is not automatically a mechanical fault.
      </Notice>
      <SourcePicker
        tables={data.tables.filter((t) =>
          [
            "Daily usage",
            "Weekly usage",
            "Service observations",
            "Control evidence",
            "Readiness",
          ].includes(t.sheet)
        )}
      />
    </div>
  )
}
function Planning() {
  const requests = dataset("Maintenance planning", "Requested maintenance").rows
  const allocations = dataset(
    "Festival allocation",
    "Proposed fleet allocations"
  ).rows
  const arrivals = dataset(
    "Incident baseline",
    "Relief queue planning arrivals"
  ).rows
  return (
    <Tabs defaultValue="workshop" className="gap-6">
      <TabsList>
        <TabsTrigger value="workshop">Workshop</TabsTrigger>
        <TabsTrigger value="festival">Festival</TabsTrigger>
        <TabsTrigger value="incident">Incident</TabsTrigger>
      </TabsList>
      <TabsContent value="workshop" className="space-y-6">
        <div className="grid gap-4 @2xl/dashboard:grid-cols-3">
          <Metric
            title="Requested jobs"
            value={String(requests.length)}
            detail="19 October 2026 · tentative requests"
          />
          <Metric
            title="Available bays"
            value={String(
              dataset("Maintenance planning", "Bay and staffing capacity")
                .rows[0]!["Available bays"]
            )}
            detail="09:00–17:00 · Hougang staging"
          />
          <Metric
            title="Available technicians"
            value={String(
              dataset("Maintenance planning", "Bay and staffing capacity")
                .rows[0]!["Available technicians"]
            )}
            detail="Capacity at a time, staffed in shifts"
          />
        </div>
        <Plot
          title="Requested workshop resources"
          description="Both requests start at 09:00: overlapping requests exceed the one-bay / two-technician capacity"
          rows={requests.map((r) => ({
            name: r["Vehicle ID"]!,
            bays: r["Required bays"]!,
            technicians: r["Required technicians"]!,
          }))}
          series={[
            { key: "bays", label: "Requested bays" },
            { key: "technicians", label: "Requested technicians" },
          ]}
        />
        <Notice>
          Requests need rescheduling and complete service cover. Only NW-V005 is
          offered as additional cover. Tentative end times are not confirmed
          Engineering releases.
        </Notice>
        <SourcePicker
          tables={data.tables.filter((t) => t.sheet === "Maintenance planning")}
        />
      </TabsContent>
      <TabsContent value="festival" className="space-y-6">
        <Plot
          title="Proposed departure capacity by route"
          description="9 November · passenger places across proposed departures, not unique passengers"
          rows={groupSum(
            allocations
              .filter((r) => r["Route ID"])
              .map((r) => ({
                route: r["Route ID"]!,
                capacity:
                  num(r, "Planning limit per departure") *
                  String(r["Proposed departure times local"]).split("|").length,
              })),
            "route",
            ["capacity"]
          )}
          series={[{ key: "capacity", label: "Proposed passenger places" }]}
        />
        <Notice>
          Allocations are conditional. NW-V005 is the only named unallocated
          additional bus and crew; NW-V009 and NW-V050 have other protected
          bookings. No attendance or actual boarding figures are supplied. Do
          not add the two routes as unique people.
        </Notice>
        <SourcePicker
          tables={data.tables.filter((t) => t.sheet === "Festival allocation")}
        />
      </TabsContent>
      <TabsContent value="incident" className="space-y-6">
        <div className="grid gap-4 @2xl/dashboard:grid-cols-3">
          <Metric
            title="Protected evening buses"
            value={String(
              dataset("Incident baseline", "Protected evening duties").rows
                .length
            )}
            detail="16 October · baseline known at 17:00"
          />
          <Metric
            title="Held vehicle"
            value="NW-V050"
            detail="Door-interlock inspection · release unconfirmed"
          />
          <Metric
            title="Initial waiting people"
            value={String(
              dataset("Incident baseline", "Relief decision requirements")
                .rows[0]!["Initial waiting people"]
            )}
            detail="Planning baseline at 17:00 · one wheelchair user"
          />
        </div>
        <Plot
          title="Assumed relief queue arrivals"
          description="Planning arrivals per half-hour; these are not observed outcomes or remaining queue counts"
          rows={arrivals.map((r) => ({
            name: String(r["Window start"]).slice(11, 16),
            arrivals: r["Arrivals people"]!,
          }))}
          series={[{ key: "arrivals", label: "Assumed arrivals" }]}
        />
        <Notice>
          Only the 17:00 baseline is supplied. The estimated 17:30 completion is
          not authority to dispatch. Contracted departures already have
          dedicated resources; they are not extra spare vehicles.
        </Notice>
        <SourcePicker
          tables={data.tables.filter((t) => t.sheet === "Incident baseline")}
        />
      </TabsContent>
    </Tabs>
  )
}
function Passengers() {
  const reports = dataset("Passenger reports")
  return (
    <div className="space-y-6">
      <Notice>
        Validated against all {fmt(operationsManifest.coverage.trips)} origin
        departures:{" "}
        {operationsPassengers.filter((c) => c.matches.length === 1).length} of{" "}
        {operationsPassengers.length} reports match one trip using stop, journey
        window, and supplied identifiers. Expected journeys use scheduled
        departure; observed journeys use actual departure. Matching an event
        does not establish a cause.
      </Notice>
      <div className="grid gap-6 @3xl/dashboard:grid-cols-2">
        <Plot
          title="Reports by channel"
          description="Six selected reports · not complaint rates"
          rows={groupSum(
            reports.rows.map((r) => ({ ...r, count: 1 })),
            "Channel",
            ["count"]
          )}
          series={[{ key: "count", label: "Reports" }]}
        />
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Read the journey, then the evidence</CardTitle>
            <CardDescription>
              5–14 October 2026 · Singapore local time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 text-sm leading-relaxed">
            <p>
              Reports describe comfort, delayed departures, a vehicle
              substitution, and a boarding queue. Individual experiences are
              reported, not independently verified.
            </p>
            <p className="text-muted-foreground">
              Receipt time differs from journey time. A blank reported service
              or vehicle is unknown; it has not been inferred here. Match the
              journey window and stop to Operations before drawing conclusions.
            </p>
            <Badge variant="secondary">
              Selected accounts · no causal attribution
            </Badge>
          </CardContent>
        </Card>
      </div>
      <Records table={reports} />
      {reports.rows.map((r) => (
        <Card key={String(r["Case ID"])} className="gap-3 shadow-none">
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>
                {String(r["Case ID"])} ·{" "}
                {r["Reported service no"]
                  ? `Service ${r["Reported service no"]}`
                  : `Vehicle ${r["Reported vehicle ID"]}`}
              </CardTitle>
              <Badge variant="outline">{String(r.Channel)}</Badge>
            </div>
            <CardDescription>
              {String(r["Journey window start"])} –{" "}
              {String(r["Journey window end"]).slice(11)} ·{" "}
              {String(r["Journey time basis"])}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            “{String(r["Passenger report"])}”
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
function Costs() {
  const options = dataset("Cost options")
  const maintenance = options.rows.filter(
    (r) => r.Option !== "Fleet replacement option"
  )
  return (
    <div className="space-y-6">
      <Notice>
        These are proposed quotes issued 16 October 2026, valid 19 October–16
        November. They are not incurred costs, guaranteed savings, or additive
        recommendations. Some scopes overlap; the replacement quote excludes
        finance, infrastructure, resale, and transition costs.
      </Notice>
      <div className="grid gap-6 @3xl/dashboard:grid-cols-[1.6fr_1fr]">
        <Plot
          title="Maintenance quote comparison"
          description="SGD excluding tax · full quoted package, not price per visit"
          rows={maintenance.map((r) => ({
            name: r["Option ID"]!,
            quote: r["Quoted price SGD"]!,
          }))}
          series={[{ key: "quote", label: "Quoted SGD" }]}
        />
        <Card className="shadow-none">
          <CardHeader>
            <CardDescription>Separate capital option · NW-V020</CardDescription>
            <CardTitle className="text-4xl tracking-tight">
              {money(
                num(
                  options.rows.find(
                    (r) => r.Option === "Fleet replacement option"
                  )!,
                  "Quoted price SGD"
                )
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm">
            <Badge variant="secondary">Indicative replacement quote</Badge>
            <p className="text-muted-foreground">
              10-month lead time. A same-capacity double-deck vehicle. The
              supplied history does not establish that replacement is
              economical.
            </p>
            <p>
              Capital and maintenance quotes are shown separately to preserve a
              useful comparison scale.
            </p>
          </CardContent>
        </Card>
      </div>
      <Records table={options} />
    </div>
  )
}
function Explorer() {
  return (
    <div className="space-y-6">
      <Notice>
        {data.tables.length} handout tables plus{" "}
        {operationsManifest.tables.length} operations tables from 24 CSV files
        and five workbooks. These include duplicate and overlapping views;
        source row counts must not be summed as distinct events. All fields are
        available below. Handout tables support sorting and filtered CSV export;
        operations tables support server-side search, pagination, and full CSV
        downloads.
      </Notice>
      <Tabs defaultValue="handouts" className="gap-4">
        <TabsList>
          <TabsTrigger value="handouts">Handouts (40 tables)</TabsTrigger>
          <TabsTrigger value="operations">Operations (21 tables)</TabsTrigger>
        </TabsList>
        <TabsContent value="handouts">
          <SourcePicker tables={data.tables} visualize />
        </TabsContent>
        <TabsContent value="operations">
          <OperationsSources />
        </TabsContent>
      </Tabs>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Monthly-history documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="0">
            <TabsList>
              {data.documents.map((doc, i) => (
                <TabsTrigger key={doc.file} value={String(i)}>
                  {doc.file.split("/").pop()}
                </TabsTrigger>
              ))}
            </TabsList>
            {data.documents.map((doc, i) => (
              <TabsContent key={doc.file} value={String(i)}>
                <pre className="mt-4 max-h-96 overflow-auto font-sans text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {doc.text}
                </pre>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
export function FleetDashboard() {
  const [section, setSection] = useState<string>("overview")
  const [vehicle, setVehicle] = useState("all")
  const [period, setPeriod] = useState("latest")
  const current = sections.find((s) => s.id === section)!
  const historical = section === "overview" || section === "maintenance"
  return (
    <SidebarProvider className="[--chart-1:oklch(0.55_0.11_175)] [--chart-2:oklch(0.67_0.13_65)] [--chart-3:oklch(0.6_0.12_260)] [--chart-4:oklch(0.65_0.1_310)] [--sidebar-width:15rem]">
      <Sidebar>
        <SidebarHeader className="px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BusFront className="size-5" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">
                LionLink<span className="text-primary">.</span>
              </p>
              <p className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                Fleet intelligence
              </p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-3 pt-5">
          <p className="mb-2 px-3 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
            Workspace
          </p>
          <SidebarMenu>
            {sections.map((s) => (
              <SidebarMenuItem key={s.id}>
                <SidebarMenuButton
                  isActive={section === s.id}
                  onClick={() => setSection(s.id)}
                  className="h-10 gap-3 px-3 data-active:bg-primary/10 data-active:text-primary"
                >
                  <s.icon className="size-4" />
                  <span>{s.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-5">
          <div className="rounded-lg border bg-card p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium">
              <FileSpreadsheet className="size-4 text-primary" /> Local data
              workspace
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              5 workbooks · 24 CSV files
              <br />
              40 handout tables + 21 operations tables
            </p>
          </div>
          <p className="mt-3 text-[10px] text-muted-foreground">
            FICTIONAL EXERCISE DATA · SGD
          </p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-w-0 bg-muted/35">
        <header className="flex h-16 items-center justify-between gap-3 border-b bg-background px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Analytics
            </span>
            <ChevronRight className="size-3 text-muted-foreground" />
            <span className="text-xs font-medium">{current.label}</span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Badge variant="outline" className="hidden sm:flex">
              <Database className="size-3" /> Source snapshot
            </Badge>
          </div>
        </header>
        <main
          id="active-report"
          data-report-title={current.label}
          data-report-section={section}
          className="@container/dashboard mx-auto w-full max-w-400 space-y-6 p-4 lg:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-primary">
                <Gauge className="size-4" /> LIONLINK OPERATIONS
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {current.label}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                {current.description}
              </p>
            </div>
            {historical && (
              <div className="flex flex-wrap gap-2">
                <Pick
                  label="Vehicle"
                  value={vehicle}
                  onChange={setVehicle}
                  options={[
                    { value: "all", label: "All 8 vehicles" },
                    ...vehicles.map((v) => ({ value: v, label: v })),
                  ]}
                />
                <Pick
                  label="Historical period"
                  value={period}
                  onChange={setPeriod}
                  options={[
                    { value: "latest", label: "Oct 2025 – Sep 2026" },
                    { value: "earlier", label: "Oct 2024 – Sep 2025" },
                    { value: "all", label: "All 24 months" },
                  ]}
                />
              </div>
            )}
          </div>
          {historical && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" />
              <span>Complete monthly history</span>
              <span>·</span>
              <span>{vehicle === "all" ? "8 selected vehicles" : vehicle}</span>
              <span>·</span>
              <span>SGD excluding tax</span>
              <Button
                variant="link"
                size="sm"
                className="ml-auto h-auto p-0 text-xs"
                onClick={() => setSection("explorer")}
              >
                Explore source data <ArrowUpRight className="size-3" />
              </Button>
            </div>
          )}
          {section === "overview" && (
            <Overview vehicle={vehicle} period={period} />
          )}
          {section === "maintenance" && (
            <Maintenance vehicle={vehicle} period={period} />
          )}
          {section === "relationships" && <RelationshipsDashboard />}
          {section === "operations" && (
            <Tabs defaultValue="network" className="gap-6">
              <TabsList>
                <TabsTrigger value="network">Full operating cohort</TabsTrigger>
                <TabsTrigger value="selected">
                  Selected handout extracts
                </TabsTrigger>
              </TabsList>
              <TabsContent value="network">
                <OperationsDashboard />
              </TabsContent>
              <TabsContent value="selected">
                <SelectedOperations />
              </TabsContent>
            </Tabs>
          )}
          {section === "route-planning" && <RoutePlanningDashboard />}
          {section === "planning" && <Planning />}
          {section === "passengers" && <Passengers />}
          {section === "costs" && <Costs />}
          {section === "explorer" && <Explorer />}
          <footer className="border-t pt-5 text-xs text-muted-foreground">
            LionLink · Selected exercise records · Singapore time (UTC+08) ·
            Sources: supplied fleet handouts and operations records
          </footer>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
