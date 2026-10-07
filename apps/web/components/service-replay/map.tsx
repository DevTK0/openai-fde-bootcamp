"use client"

import { useMemo, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { LogIn, LogOut, UserRoundX } from "lucide-react"
import { replayAt, type PlanningReport } from "@/lib/service-planning"
import { busPositions, mapData, point } from "./geometry"
import { exchangesAt } from "./passenger-exchange"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { Scene, type Marker } from "./scene"

export function ServiceReplayMap({
  report,
  at,
}: {
  report: PlanningReport
  at: number
}) {
  const service = report.selection.service
  const [cameraVersion, setCameraVersion] = useState(0)
  const [roads, setRoads] = useState(true)
  const [view, setView] = useState<"tilted" | "top">("tilted")
  const [extent, setExtent] = useState<"service" | "island" | "neighborhood">(
    "service"
  )
  const [selected, setSelected] = useState("")
  const state = useMemo(() => {
    const buses = busPositions(report.detail, at, roads)
    const queues = replayAt(report.detail, at).queues
    const exchanges = exchangesAt(
      report.detail.calls,
      report.detail.calls.map((call) => ({
        id: call.id,
        boarded: call.boarded ?? null,
        alighted: call.alighted ?? null,
        left: call.queue,
      })),
      at
    )
    const markers: Marker[] = buses.map((b) => ({
      ...b,
      key: `bus:${b.trip}`,
      kind: "bus",
      count: null,
    }))
    for (const queue of queues) {
      const stop = mapData.routes
        .find((r) => r.id === queue.route)
        ?.stops.find((s) => s.order === queue.order)
      if (stop)
        markers.push({
          ...point(stop.point),
          key: `stop:${queue.route}/${queue.order}`,
          kind: "queue",
          count: queue.observation?.queue ?? null,
          exchange: exchanges.get(`${queue.route}/${queue.order}`),
        })
    }
    return { buses, queues, markers }
  }, [report, at, roads])
  const routes = mapData.routes.filter((r) => r.service === service)
  if (!routes.length)
    return (
      <p className="text-sm text-muted-foreground">
        Road geometry is available for services 132 and 159. Use the recorded
        evidence below for this service.
      </p>
    )
  return (
    <section aria-label="Service replay map" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={view === "tilted" ? "default" : "outline"}
            onClick={() => {
              setView("tilted")
              setCameraVersion((v) => v + 1)
            }}
          >
            Tilted 3D
          </Button>
          <Button
            size="sm"
            variant={view === "top" ? "default" : "outline"}
            onClick={() => {
              setView("top")
              setCameraVersion((v) => v + 1)
            }}
          >
            Top-down
          </Button>
          <Button
            size="sm"
            variant={extent === "service" ? "secondary" : "outline"}
            onClick={() => {
              setExtent("service")
              setCameraVersion((v) => v + 1)
            }}
          >
            Fit service
          </Button>
          <Button
            size="sm"
            variant={extent === "island" ? "secondary" : "outline"}
            onClick={() => {
              setExtent("island")
              setCameraVersion((v) => v + 1)
            }}
          >
            Singapore overview
          </Button>
          <Button
            size="sm"
            variant={extent === "neighborhood" ? "secondary" : "outline"}
            onClick={() => {
              setExtent("neighborhood")
              setCameraVersion((v) => v + 1)
            }}
          >
            Terminal close-up
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={roads ? "default" : "outline"}
            onClick={() => setRoads(true)}
          >
            LTA road paths
          </Button>
          <Button
            size="sm"
            variant={!roads ? "default" : "outline"}
            onClick={() => setRoads(false)}
          >
            Straight-line comparison
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        <div className="space-y-3">
          <Scene
            selected={selected}
            cameraVersion={cameraVersion}
            service={service}
            roads={roads}
            view={view}
            extent={extent}
            markers={state.markers}
            onPick={setSelected}
          />
          <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
            <span>
              Drag to rotate · Two-finger scroll to pan · + / − to zoom
            </span>
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger
                  aria-label="Green passengers boarded the bus"
                  className="text-emerald-400"
                >
                  <LogIn className="size-5" />
                </TooltipTrigger>
                <TooltipContent>Passengers boarded</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  aria-label="Blue passengers alighted from the bus"
                  className="text-sky-400"
                >
                  <LogOut className="size-5" />
                </TooltipTrigger>
                <TooltipContent>Passengers alighted</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  aria-label="Amber passengers were left behind"
                  className="text-amber-400"
                >
                  <UserRoundX className="size-5" />
                </TooltipTrigger>
                <TooltipContent>Passengers left behind</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {routes.map((r) => (
          <div key={r.id} className="text-sm">
            <span className="font-medium">Direction {r.direction}</span>
            <span className="ml-2 text-muted-foreground">
              {r.origin} → {r.destination} · {r.stops.length} stops
            </span>
          </div>
        ))}
      </div>
      <details className="text-xs text-muted-foreground">
        <summary className="cursor-pointer">Map sources and limits</summary>
        <p className="mt-2 max-w-4xl leading-relaxed">
          Official LTA service KML paths from the supplied 2 October 2026 source
          snapshot. Stops use the supplied geographic network. Land shapes use
          URA Master Plan 2019 subzone boundaries under the Singapore Open Data
          Licence; they are not current coastline or terrain. This view has no
          live GPS or continuously measured demand. OpenStreetMap streets and
          buildings come from OpenFreeMap under ODbL. Building detail covers the
          central and northeast service corridor. Heights are approximate, using
          tile attributes or an 8 metre fallback. The operating records come
          from the app’s SQLite database. Directions and repeated route
          positions retain separate evidence. Passenger exchanges replay
          recorded boarding, alighting and remaining counts after departure. The
          icon groups show boarded, alighted and left-behind totals, in that
          order. Numbers give exact recorded counts; a question mark means
          missing evidence. They fade completely after three replay minutes.
          These are departure events, not current waiting counts. Only services
          132 and 159 have been validated for this visualization.
        </p>
      </details>
    </section>
  )
}
