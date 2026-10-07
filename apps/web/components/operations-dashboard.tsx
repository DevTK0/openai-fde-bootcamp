"use client"

import { useDashboard } from "@/components/dashboard-provider"

import { Plot } from "@workspace/ui/components/report-chart"

import { useEffect, useState } from "react"
import {
  ArrowDownToLine,
  ChevronLeft,
  ChevronRight,
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
import { Input } from "@workspace/ui/components/input"
import { Skeleton } from "@workspace/ui/components/skeleton"
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
import { Metric, Notice, Pick, Records } from "@/components/report-ui"
import { type OperationsReport } from "@/lib/operations"
import { fmt, type Dataset, type Row } from "@/lib/fleet"

function useReport<T>(url: string) {
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
  }, [url, attempt])
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
function resourceDataset(rows: Row[], columns: string[]): Dataset {
  return {
    id: "workshop_work_orders",
    file: "data/workshop/workshop_work_orders.csv",
    sheet: "Workshop supplement",
    title: "Held workshop work orders",
    columns,
    rows,
    sourceRows: rows.map((_, i) => i + 2),
    notes: [],
  }
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
      <Notice>
        Full operating source: {fmt(manifest.coverage.trips)} trips,{" "}
        {fmt(manifest.coverage.stopCalls)} stop calls,{" "}
        {manifest.coverage.vehicles} operating vehicles, and{" "}
        {manifest.coverage.stops} stops. Departures cover 06:00–11:59 on ten
        weekdays; complete downstream journeys are retained. These are fictional
        operations on an attributed public network. Historical maintenance still
        covers only eight selected buses.
      </Notice>
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(String(value))}
        className="gap-5"
      >
        <TabsList className="h-auto! flex-wrap">
          <TabsTrigger value="reliability">Reliability</TabsTrigger>
          <TabsTrigger value="crowding">Crowding</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        {tab !== "resources" && (
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
        {!report || !m ? (
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
                  detail={`${fmt(m.lateDepartures)} of ${fmt(m.trips)} departures · analytical threshold`}
                />
                <Metric
                  title="90th percentile arrival delay"
                  value={`${fmt(m.p90Arrival, 1)} min`}
                  detail="Signed actual minus scheduled terminal arrival"
                />
                <Metric
                  title="Recorded vehicle use"
                  value={`${fmt(m.km, 1)} km`}
                  detail={`${fmt(m.hours, 1)} running hours; includes listed positioning`}
                />
              </div>
              <div className="grid gap-6 xl:grid-cols-2">
                <Plot
                  title="Arrival delay by service"
                  description="Minutes · up to 12 services ranked by mean delay · full comparison below"
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
                  title="Delay across supplied dates"
                  description="Minutes · selected service scope · negative values mean early"
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
              <Card className="min-w-0 shadow-none">
                <CardHeader>
                  <CardTitle>Service comparison</CardTitle>
                  <CardDescription>
                    Source: trips.csv + terminal_movements.csv · no duplicate
                    handout totals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {[
                          "Service",
                          "Trips",
                          "Vehicles",
                          "Departure >5m",
                          "Early departures",
                          "Mean arrival (min)",
                          "P90 arrival (min)",
                          "Substitutions",
                        ].map((h) => (
                          <TableHead key={h}>{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.byService.map((r) => (
                        <TableRow key={r.name}>
                          <TableCell>{r.name}</TableCell>
                          <TableCell>{fmt(r.trips)}</TableCell>
                          <TableCell>{r.vehicles}</TableCell>
                          <TableCell>
                            {fmt((r.lateDepartures / r.trips) * 100, 1)}%
                          </TableCell>
                          <TableCell>{r.earlyDepartures}</TableCell>
                          <TableCell>{fmt(r.meanArrival, 1)}</TableCell>
                          <TableCell>{fmt(r.p90Arrival, 1)}</TableCell>
                          <TableCell>{r.substitutions}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Notice>
                The five-minute threshold is a dashboard comparison rule, not a
                supplied service standard. Delays use published versus actual
                times; a delayed journey or vehicle substitution does not
                establish a mechanical fault. Percentiles are calculated from
                individual trips, not averaged across services.
              </Notice>
            </TabsContent>
            <TabsContent value="crowding" className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Metric
                  title="Recorded boardings"
                  value={fmt(m.boardings)}
                  detail="Boarding events, not unique people across journeys"
                />
                <Metric
                  title="Calls with a remaining queue"
                  value={fmt(m.queuedCalls)}
                  detail={`${fmt(m.calls ? (m.queuedCalls / m.calls) * 100 : 0, 1)}% of ${fmt(m.calls)} supplied calls`}
                />
                <Metric
                  title="Departures at capacity"
                  value={fmt(m.fullCalls)}
                  detail="Stop calls where onboard departing equals capacity"
                />
                <Metric
                  title="Remaining at window ends"
                  value={fmt(m.remainingQueue)}
                  detail="Summed route-position/date cohorts, not simultaneous queues"
                />
              </div>
              <div className="grid gap-6 xl:grid-cols-2">
                <Plot
                  title="Boarding activity by service"
                  description="Boarding events · up to 12 highest-volume services in the selected scope"
                  rows={[...report.byService]
                    .sort((a, b) => b.boardings - a.boardings)
                    .slice(0, 12)
                    .map((r) => ({ name: r.name, boardings: r.boardings }))}
                  series={[{ key: "boardings", label: "Boarding events" }]}
                />
                <Plot
                  title="Passenger queue accounting"
                  description="Distinct categories in the supplied route-position windows · selected scope"
                  rows={[
                    { name: "Initial queue", people: m.initialQueue },
                    { name: "New arrivals", people: m.arrivals },
                    { name: "Boarded", people: m.boardings },
                    { name: "Remaining", people: m.remainingQueue },
                  ]}
                  series={[{ key: "people", label: "People / events" }]}
                />
              </div>
              <Notice>
                Queue accounting reconciles: initial queue + new arrivals =
                boardings + final remaining queue. A remaining queue does not
                necessarily mean the bus was full: arrivals during dwell may
                miss the counting cutoff. Repeated calls can observe the same
                waiting cohort; do not add their queues as unique people. No
                abandonment or route switching is modelled.
              </Notice>
              <Card className="min-w-0 shadow-none">
                <CardHeader>
                  <CardTitle>Where queues remain at observation end</CardTitle>
                  <CardDescription>
                    Top 20 route-position cohorts · dates summed when all dates
                    are selected · source: queue_windows.csv + routes.csv +
                    stops.csv
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {[
                          "Service / route",
                          "Stop position",
                          "Stop code",
                          "Location",
                          "Arrivals",
                          "Boarded",
                          "Final remaining",
                        ].map((h) => (
                          <TableHead key={h}>{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.hotspots.map((r) => (
                        <TableRow key={`${r.route}/${r.order}`}>
                          <TableCell>
                            {r.service} / {r.route}
                          </TableCell>
                          <TableCell>{r.order}</TableCell>
                          <TableCell>{r.stop}</TableCell>
                          <TableCell className="min-w-40 whitespace-normal">
                            {r.name}
                          </TableCell>
                          <TableCell>{fmt(r.arrivals)}</TableCell>
                          <TableCell>{fmt(r.boardings)}</TableCell>
                          <TableCell>{fmt(r.remaining)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="resources" className="space-y-6">
              <Notice>
                Resource coverage is the complete source, independent of the
                service/date filters on other tabs. These are records of
                commitments and release conditions, not a count of buses or
                crews currently free to dispatch.
              </Notice>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Metric
                  title="Operating vehicles"
                  value={String(manifest.coverage.vehicles)}
                  detail="Belong to the published operating cohort"
                />
                <Metric
                  title="Additional workshop vehicles"
                  value={String(manifest.coverage.workshopVehicles)}
                  detail="Separate held cohort · no supplied trips or releases"
                />
                <Metric
                  title="Crew-duty records"
                  value={fmt(
                    manifest.tables.find((t) => t.id === "crew_duties")!.count
                  )}
                  detail="Dated duties; not a count of unique available drivers"
                />
                <Metric
                  title="Control instructions"
                  value={String(
                    manifest.tables.find((t) => t.id === "control_actions")!
                      .count
                  )}
                  detail={`${manifest.tables.find((t) => t.id === "resource_updates")!.count} contemporaneous resource updates`}
                />
              </div>
              <Records
                table={resourceDataset(
                  report.workshop,
                  manifest.tables.find((t) => t.id === "workshop_work_orders")!
                    .columns
                )}
              />
              <Notice>
                All eight NW-W workshop vehicles are held and all
                confirmed-release fields are blank. Estimated completion does
                not authorize dispatch. Their 180-entry combined register
                includes 172 operating vehicles plus eight workshop vehicles; it
                does not increase the timetable fleet.
              </Notice>
            </TabsContent>
          </>
        )}
      </Tabs>
      <OperationsSources initialTable="trips" compact />
    </div>
  )
}
export function OperationsSources({
  initialTable = "trips",
  compact = false,
}: {
  initialTable?: string
  compact?: boolean
}) {
  const { operationsManifest: manifest } = useDashboard()
  const [table, setTable] = useState(initialTable),
    [draft, setDraft] = useState(""),
    [query, setQuery] = useState(""),
    [page, setPage] = useState(0)
  const source = manifest.tables.find((t) => t.id === table)!
  const request = useReport<{
    rows: Row[]
    columns: string[]
    total: number
    pageSize: number
  }>(
    `/api/operations?view=records&table=${table}&q=${encodeURIComponent(query)}&page=${page}`
  )
  const result = request.data
  return (
    <div className="space-y-4">
      <Card className="min-w-0 shadow-none">
        <CardHeader>
          <CardTitle>
            {compact
              ? "Inspect the underlying operations records"
              : "Operations source explorer"}
          </CardTitle>
          <CardDescription>
            21 tables · rows are fetched 25 at a time · downloads contain the
            complete original CSV, gzip-compressed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Pick
              label="Operations source table"
              value={table}
              onChange={(v) => {
                setTable(v)
                setPage(0)
                setQuery("")
                setDraft("")
              }}
              options={manifest.tables.map((t) => ({
                value: t.id,
                label: `${t.id.replaceAll("_", " ")} (${fmt(t.count)})`,
              }))}
            />
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <a href={`/api/operations?view=download&table=${table}`} />
              }
            >
              <ArrowDownToLine />
              Download full CSV.gz
            </Button>
          </div>
          <form
            className="flex max-w-lg gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              setQuery(draft)
              setPage(0)
            }}
          >
            <Input
              aria-label="Search operations records"
              placeholder="Search ID, date, stop code, or any field…"
              maxLength={120}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <Button type="submit" variant="outline">
              <Search />
              Search
            </Button>
          </form>
          <p className="text-xs text-muted-foreground">
            {source.file} · table search is independent of report filters.
            Identifiers and leading-zero stop codes are preserved.
          </p>
          {!result ? (
            <Pending error={request.error} retry={request.retry} />
          ) : (
            <>
              <div className="max-h-[32rem] overflow-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {result.columns.map((col) => (
                        <TableHead key={col}>
                          {col.replaceAll("_", " ")}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.rows.map((row, i) => (
                      <TableRow key={i}>
                        {result.columns.map((col) => (
                          <TableCell
                            key={col}
                            className="max-w-80 min-w-28 align-top text-xs leading-relaxed whitespace-normal"
                          >
                            {row[col] === null ? "—" : String(row[col])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    {result.rows.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={result.columns.length}
                          className="h-20 text-center"
                        >
                          No matching records.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <p>
                  {fmt(result.total)} matches · Page {page + 1} of{" "}
                  {Math.max(1, Math.ceil(result.total / result.pageSize))}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="icon-sm"
                    variant="outline"
                    aria-label="Previous operations page"
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="outline"
                    aria-label="Next operations page"
                    disabled={(page + 1) * result.pageSize >= result.total}
                    onClick={() => setPage(page + 1)}
                  >
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      {!compact && (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Operations definitions and source scope</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="0">
              <TabsList className="h-auto! flex-wrap">
                {manifest.documents.map((doc, i) => (
                  <TabsTrigger key={doc.file} value={String(i)}>
                    {i === 0
                      ? "Coverage"
                      : i === 1
                        ? "Data dictionary"
                        : "Workshop supplement"}
                  </TabsTrigger>
                ))}
              </TabsList>
              {manifest.documents.map((doc, i) => (
                <TabsContent key={doc.file} value={String(i)}>
                  <pre className="max-h-96 overflow-auto font-sans text-xs leading-relaxed whitespace-pre-wrap">
                    {doc.text}
                  </pre>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
