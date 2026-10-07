"use client"

import { DatasetTabs } from "@/components/dataset-tabs"
import { useDashboard } from "@/components/dashboard-provider"

import { Plot } from "@workspace/ui/components/report-chart"

import { useState } from "react"
import { Pick, Metric, Records } from "@/components/report-ui"
import {
  OperationsDashboard,
  OperationsSources,
} from "@/components/operations-dashboard"
import { RoutePlanningDashboard } from "@/components/route-planning-dashboard"
import {
  Activity,
  BusFront,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronRight,
  LayoutDashboard,
  MessageSquareText,
  Wrench,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
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
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"
import { fmt, money, num, sum, groupSum, type Dataset } from "@/lib/fleet"

const sections = [
  {
    id: "overview",
    label: "Fleet overview",
    icon: LayoutDashboard,
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: Wrench,
  },
  {
    id: "operations",
    label: "Operations",
    icon: Activity,
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
  },
  {
    id: "passengers",
    label: "Passenger reports",
    icon: MessageSquareText,
  },
  {
    id: "costs",
    label: "Cost options",
    icon: ChartNoAxesCombined,
  },
] as const
function SourcePicker({
  tables,
  operations = [],
}: {
  tables: Dataset[]
  operations?: string[]
}) {
  return (
    <DatasetTabs
      items={[
        ...tables.map((table) => ({
          id: table.id,
          label: table.title,
          content: <Records table={table} />,
        })),
        ...operations.map((id) => ({
          id,
          label: id.replaceAll("_", " "),
          content: <OperationsSources initialTable={id} allowedTables={[id]} />,
        })),
      ]}
    />
  )
}
function Overview({ vehicle, period }: { vehicle: string; period: string }) {
  const { data, filterHistory, vehicles } = useDashboard()
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
          detail={`${fmt(sum(rows, "recorded_operating_hours"), 1)} operating hours`}
        />
        <Metric
          title="Repair cost / 1,000 km"
          value={money(km ? (repair / km) * 1000 : 0)}
          detail="SGD per 1,000 km"
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
        <Tabs defaultValue="period" className="min-w-0 gap-3">
          <TabsList aria-label="Repair spending view">
            <TabsTrigger value="period">Selected period</TabsTrigger>
            <TabsTrigger value="annual">Annual comparison</TabsTrigger>
          </TabsList>
          <TabsContent value="period">
            <Plot
              title="Repair spending by vehicle"
              description="Selected period · ranked by recorded cost (SGD)"
              rows={ranked}
              series={[{ key: "repair_cost_sgd", label: "Repair cost" }]}
            />
          </TabsContent>
          <TabsContent value="annual">
            <Plot
              title="Like-for-like annual repair spend"
              description="October–September · SGD"
              rows={comparison}
              series={[
                { key: "earlier", label: "2024–25" },
                { key: "latest", label: "2025–26" },
              ]}
            />
          </TabsContent>
        </Tabs>
      </div>
      <div>
        <Plot
          title="Recorded vehicle unavailability"
          description="Vehicle hold hours"
          rows={groupSum(rows, "vehicle_id", [
            "repair_unavailable_hours",
            "scheduled_maintenance_unavailable_hours",
          ]).sort(
            (a, b) =>
              num(b, "repair_unavailable_hours") -
              num(a, "repair_unavailable_hours")
          )}
          series={[
            { key: "repair_unavailable_hours", label: "Repair holds" },
            {
              key: "scheduled_maintenance_unavailable_hours",
              label: "Scheduled maintenance",
            },
          ]}
        />
      </div>
      <SourcePicker
        tables={data.tables.filter(
          (t) =>
            t.sheet === "Fleet" ||
            t.sheet === "Monthly usage" ||
            t.id === "monthly_vehicle_history"
        )}
        operations={["vehicles"]}
      />
    </div>
  )
}
function Maintenance({ vehicle, period }: { vehicle: string; period: string }) {
  const { data, filterHistory } = useDashboard()
  const rows = filterHistory(vehicle, period)
  const tables = data.tables.filter(
    (t) =>
      [
        "Repairs",
        "Servicing",
        "Inspections",
        "Selected observations",
        "Monthly maintenance",
      ].includes(t.sheet) || t.id === "selected_component_observations"
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
          detail="Preventive visits"
        />
        <Metric
          title="Maintenance hold hours"
          value={fmt(
            sum(rows, "repair_unavailable_hours") +
              sum(rows, "scheduled_maintenance_unavailable_hours"),
            1
          )}
          detail="Hours"
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
      <SourcePicker tables={tables} />
    </div>
  )
}
function SelectedOperations() {
  const { data, dataset } = useDashboard()
  const daily = dataset("Daily usage").rows,
    observations = dataset("Service observations").rows
  return (
    <div className="space-y-6">
      <div className="grid gap-4 @2xl/dashboard:grid-cols-3">
        <Metric
          title="Completed trips"
          value={fmt(sum(daily, "Completed trips"))}
          detail={`${daily.length} daily records`}
        />
        <Metric
          title="Recorded use"
          value={`${fmt(sum(daily, "Recorded total km"))} km`}
          detail={`${fmt(sum(daily, "Recorded operating hours"), 1)} running hours`}
        />
        <Metric
          title="Selected trip observations"
          value={String(observations.length)}
          detail="Trip observations"
        />
      </div>
      <div>
        <Plot
          title="Selected departure and arrival delays"
          description="Minutes"
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
  const { data, dataset } = useDashboard()
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
                .rows[0]?.["Available bays"] ?? "Not supplied"
            )}
            detail="09:00–17:00 · Hougang staging"
          />
          <Metric
            title="Available technicians"
            value={String(
              dataset("Maintenance planning", "Bay and staffing capacity")
                .rows[0]?.["Available technicians"] ?? "Not supplied"
            )}
            detail="Technicians per shift"
          />
        </div>
        <Plot
          title="Requested workshop resources"
          description="Bays and technicians"
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
        <SourcePicker
          tables={data.tables.filter((t) => t.sheet === "Maintenance planning")}
          operations={[
            "workshop_work_orders",
            "workshop_vehicles",
            "planning_constraints",
          ]}
        />
      </TabsContent>
      <TabsContent value="festival" className="space-y-6">
        <Plot
          title="Proposed departure capacity by route"
          description="Passenger capacity by route"
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
                .rows[0]?.["Initial waiting people"] ?? "Not supplied"
            )}
            detail="Planning baseline at 17:00"
          />
        </div>
        <Plot
          title="Assumed relief queue arrivals"
          description="Planned arrivals per half-hour"
          rows={arrivals.map((r) => ({
            name: String(r["Window start"]).slice(11, 16),
            arrivals: r["Arrivals people"]!,
          }))}
          series={[{ key: "arrivals", label: "Assumed arrivals" }]}
        />
        <SourcePicker
          tables={data.tables.filter((t) => t.sheet === "Incident baseline")}
        />
      </TabsContent>
    </Tabs>
  )
}
function Passengers() {
  const { dataset } = useDashboard()
  const reports = dataset("Passenger reports")
  return <Records table={reports} />
}

function Costs() {
  const { data, dataset } = useDashboard()
  const options = dataset("Cost options")
  const replacement = options.rows.find(
    (r) => r.Option === "Fleet replacement option"
  )
  const maintenance = options.rows.filter(
    (r) => r.Option !== "Fleet replacement option"
  )
  return (
    <div className="space-y-6">
      <div className="grid gap-6 @3xl/dashboard:grid-cols-[1.6fr_1fr]">
        <Plot
          title="Maintenance quote comparison"
          description="Quoted price · SGD excluding tax"
          rows={maintenance.map((r) => ({
            name: r.Option!,
            quote: r["Quoted price SGD"]!,
          }))}
          series={[{ key: "quote", label: "Quoted SGD" }]}
        />
        <Card className="shadow-none">
          <CardHeader>
            <CardDescription>Separate capital option · NW-V020</CardDescription>
            <CardTitle className="text-4xl tracking-tight">
              {replacement
                ? money(num(replacement, "Quoted price SGD"))
                : "Not supplied"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm">
            <Badge variant="secondary">Indicative replacement quote</Badge>
            <p>Lead time · 10 months</p>
          </CardContent>
        </Card>
      </div>
      <SourcePicker
        tables={data.tables.filter(
          (t) =>
            t.file.includes("06_cost_options") ||
            t.id === "repair_spend_by_vehicle"
        )}
      />
    </div>
  )
}
export function FleetDashboard() {
  const { vehicles } = useDashboard()
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
                  onClick={() => {
                    setSection(s.id)
                  }}
                  className="h-10 gap-3 px-3 data-active:bg-primary/10 data-active:text-primary"
                >
                  <s.icon className="size-4" />
                  <span>{s.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
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
        </header>
        <main
          id="active-report"
          data-report-title={current.label}
          data-report-section={section}
          className="@container/dashboard mx-auto w-full max-w-400 space-y-6 p-4 lg:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {current.label}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {historical && (
                <div className="flex flex-wrap gap-2">
                  <Pick
                    label="Vehicle"
                    value={vehicle}
                    onChange={setVehicle}
                    options={[
                      {
                        value: "all",
                        label: `All ${vehicles.length} vehicles`,
                      },
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
          </div>
          {historical && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" />
              <span>Complete monthly history</span>
              <span>·</span>
              <span>
                {vehicle === "all"
                  ? `${vehicles.length} selected vehicles`
                  : vehicle}
              </span>
              <span>·</span>
              <span>SGD excluding tax</span>
            </div>
          )}
          {section === "overview" && (
            <Overview vehicle={vehicle} period={period} />
          )}
          {section === "maintenance" && (
            <Maintenance vehicle={vehicle} period={period} />
          )}
          {section === "operations" && (
            <Tabs defaultValue="network" className="gap-6">
              <TabsList>
                <TabsTrigger value="network">Network</TabsTrigger>
                <TabsTrigger value="selected">Usage & service</TabsTrigger>
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
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
