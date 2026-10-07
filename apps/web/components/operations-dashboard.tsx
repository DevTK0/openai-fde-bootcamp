"use client"

import { DatasetTabs } from "./dataset-tabs"
import { DatasetTable } from "./dataset-table"
import { useDashboard } from "@/components/dashboard-provider"

import { Plot } from "@workspace/ui/components/report-chart"

import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { Metric, Notice, Pick } from "@/components/report-ui"
import { type OperationsReport } from "@/lib/operations"
import { fmt } from "@/lib/fleet"

function useReport<T>(url: string) {
  const dashboard = useDashboard()
  const [result, setResult] = useState<{
    url: string
    data?: T
    error?: string
  }>({ url: "" })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok)
          throw new Error("The report could not be loaded. Please retry.")
        return response.json() as Promise<T>
      })
      .then((data) => {
        if (!controller.signal.aborted) setResult({ url, data })
      })
      .catch((error: Error) => {
        if (!controller.signal.aborted) setResult({ url, error: error.message })
      })
    return () => controller.abort()
  }, [url, attempt, dashboard])
  return {
    data: result.url === url ? result.data : undefined,
    error: result.url === url ? result.error : undefined,
    retry: () => {
      setResult({ url: "" })
      setAttempt((a) => a + 1)
    },
  }
}
function Pending({ error, retry }: { error?: string; retry: () => void }) {
  return error ? (
    <Notice>
      <p role="alert">{error}</p>
      <Button variant="outline" className="mt-2" onClick={retry}>
        Retry
      </Button>
    </Notice>
  ) : (
    <div
      role="status"
      aria-label="Loading operations data"
      className="space-y-4"
    >
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-80 w-full" />
    </div>
  )
}
export function OperationsDashboard() {
  const { operationsManifest: manifest } = useDashboard()
  const [service, setService] = useState("all"),
    [date, setDate] = useState("all"),
    [tab, setTab] = useState("reliability")
  const request = useReport<OperationsReport>(
    `/api/operations?service=${encodeURIComponent(service)}&date=${encodeURIComponent(date)}`
  )
  const report = request.data,
    m = report?.metrics
  return (
    <div className="space-y-6">
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(String(value))}
        className="gap-5"
      >
        <TabsList className="h-auto! flex-wrap">
          <TabsTrigger value="reliability">Reliability</TabsTrigger>
          <TabsTrigger value="crowding">Crowding</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
        </TabsList>
        {(tab === "reliability" || tab === "crowding") && (
          <div className="flex flex-wrap gap-3">
            <Pick
              label="Operating service"
              value={service}
              onChange={setService}
              options={[
                {
                  value: "all",
                  label: `All ${manifest.services.length} services`,
                },
                ...manifest.services.map((s) => ({
                  value: s,
                  label: `Service ${s}`,
                })),
              ]}
            />
            <Pick
              label="Operating date"
              value={date}
              onChange={setDate}
              options={[
                { value: "all", label: `All ${manifest.dates.length} dates` },
                ...manifest.dates.map((d) => ({ value: d, label: d })),
              ]}
            />
          </div>
        )}
        <TabsContent value="records">
          <OperationsSources />
        </TabsContent>
        {tab === "records" ? null : !report || !m ? (
          <Pending error={request.error} retry={request.retry} />
        ) : (
          <>
            <TabsContent value="reliability" className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Metric
                  title="Supplied trips"
                  value={fmt(m.trips)}
                  detail={`${fmt(m.completed)} completed · ${m.vehicles} actual vehicles`}
                />
                <Metric
                  title="Departures >5 minutes late"
                  value={`${fmt(m.trips ? (m.lateDepartures / m.trips) * 100 : 0, 1)}%`}
                  detail={`${fmt(m.lateDepartures)} of ${fmt(m.trips)} departures`}
                />
                <Metric
                  title="90th percentile arrival delay"
                  value={`${fmt(m.p90Arrival, 1)} min`}
                  detail="Minutes"
                />
                <Metric
                  title="Recorded vehicle use"
                  value={`${fmt(m.km, 1)} km`}
                  detail={`${fmt(m.hours, 1)} running hours`}
                />
              </div>
              <div className="grid gap-6 xl:grid-cols-2">
                <Plot
                  title="Arrival delay by service"
                  description="Top 12 services · minutes"
                  rows={[...report.byService]
                    .sort((a, b) => b.meanArrival - a.meanArrival)
                    .slice(0, 12)
                    .map((r) => ({
                      name: r.name,
                      mean: r.meanArrival,
                      p90: r.p90Arrival,
                    }))}
                  series={[
                    { key: "mean", label: "Mean arrival delay" },
                    { key: "p90", label: "90th percentile" },
                  ]}
                />
                <Plot
                  title="Delay by date"
                  description="Minutes"
                  rows={report.byDate.map((r) => ({
                    name: r.name.slice(5),
                    departure: r.meanDeparture,
                    arrival: r.meanArrival,
                  }))}
                  series={[
                    { key: "departure", label: "Mean departure delay" },
                    { key: "arrival", label: "Mean arrival delay" },
                  ]}
                />
              </div>
              <DatasetTable
                source={{
                  kind: "report",
                  table: {
                    id: "service-comparison",
                    title: "Service comparison",
                    file: "trips.csv + terminal_movements.csv · selected service and date",
                    columns: [
                      "Service",
                      "Trips",
                      "Vehicles",
                      "Departure >5m (%)",
                      "Early departures",
                      "Mean arrival (min)",
                      "P90 arrival (min)",
                      "Substitutions",
                    ],
                  },
                  rows: report.byService.map((r) => ({
                    Service: r.name,
                    Trips: r.trips,
                    Vehicles: r.vehicles,
                    "Departure >5m (%)": Number(
                      ((r.lateDepartures / r.trips) * 100).toFixed(1)
                    ),
                    "Early departures": r.earlyDepartures,
                    "Mean arrival (min)": Number(r.meanArrival.toFixed(1)),
                    "P90 arrival (min)": Number(r.p90Arrival.toFixed(1)),
                    Substitutions: r.substitutions,
                  })),
                }}
              />
            </TabsContent>
            <TabsContent value="crowding" className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Metric
                  title="Recorded boardings"
                  value={fmt(m.boardings)}
                  detail="Boarding events"
                />
                <Metric
                  title="Calls with a remaining queue"
                  value={fmt(m.queuedCalls)}
                  detail={`${fmt(m.calls ? (m.queuedCalls / m.calls) * 100 : 0, 1)}% of ${fmt(m.calls)} stop calls`}
                />
                <Metric
                  title="Departures at capacity"
                  value={fmt(m.fullCalls)}
                  detail="Stop calls where onboard departing equals capacity"
                />
                <Metric
                  title="Remaining at window ends"
                  value={fmt(m.remainingQueue)}
                  detail="Across route / date records"
                />
              </div>
              <div>
                <Plot
                  title="Boarding activity by service"
                  description="Top 12 services · boarding events"
                  rows={[...report.byService]
                    .sort((a, b) => b.boardings - a.boardings)
                    .slice(0, 12)
                    .map((r) => ({ name: r.name, boardings: r.boardings }))}
                  series={[{ key: "boardings", label: "Boarding events" }]}
                />
              </div>
              <DatasetTable
                source={{
                  kind: "report",
                  table: {
                    id: "queue-hotspots",
                    title: "Where queues remain at observation end",
                    file: "Top 20 route-position cohorts · dates summed when all dates are selected · queue_windows.csv + routes.csv + stops.csv",
                    columns: [
                      "Service / route",
                      "Stop position",
                      "Stop code",
                      "Location",
                      "Arrivals",
                      "Boarded",
                      "Final remaining",
                    ],
                  },
                  rows: report.hotspots.map((r) => ({
                    "Service / route": `${r.service} / ${r.route}`,
                    "Stop position": r.order,
                    "Stop code": r.stop,
                    Location: r.name,
                    Arrivals: r.arrivals,
                    Boarded: r.boardings,
                    "Final remaining": r.remaining,
                  })),
                }}
              />
            </TabsContent>
            <TabsContent value="resources" className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Metric
                  title="Operating vehicles"
                  value={String(manifest.coverage.vehicles)}
                  detail="Operating fleet"
                />
                <Metric
                  title="Additional workshop vehicles"
                  value={String(manifest.coverage.workshopVehicles)}
                  detail="Workshop fleet"
                />
                <Metric
                  title="Crew-duty records"
                  value={fmt(
                    manifest.tables.find((t) => t.id === "crew_duties")!.count
                  )}
                  detail="Duty records"
                />
                <Metric
                  title="Control instructions"
                  value={String(
                    manifest.tables.find((t) => t.id === "control_actions")!
                      .count
                  )}
                  detail={`${manifest.tables.find((t) => t.id === "resource_updates")!.count} resource updates`}
                />
              </div>
              <OperationsSources
                initialTable="workshop_work_orders"
                allowedTables={["workshop_work_orders"]}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}
const operationsTables = [
  "trips",
  "stop_calls",
  "control_actions",
  "resource_updates",
  "vehicle_readiness",
  "crew_duties",
  "origin_arrivals",
  "queue_windows",
  "terminal_movements",
  "routes",
  "route_stops",
  "stops",
  "service_calendar",
  "service_patterns",
  "timetable_records",
  "rail_stations",
  "rail_links",
]

export function OperationsSources({
  initialTable = "trips",
  allowedTables = operationsTables,
}: {
  initialTable?: string
  allowedTables?: string[]
}) {
  const { operationsManifest: manifest } = useDashboard()
  const items = allowedTables.flatMap((id) => {
    const table = manifest.tables.find((entry) => entry.id === id)
    if (!table) return []
    return [
      {
        id,
        label: id.replaceAll("_", " "),
        content: (
          <DatasetTable
            source={{
              kind: "remote",
              table: { ...table, title: id.replaceAll("_", " ") },
            }}
          />
        ),
      },
    ]
  })
  if (items.length === 1) return items[0]?.content
  return <DatasetTabs items={items} defaultValue={initialTable} />
}
