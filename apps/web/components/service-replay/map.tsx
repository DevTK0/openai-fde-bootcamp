"use client"

import { useMemo, useState } from "react"
import { LogIn, LogOut, UserRoundX } from "lucide-react"
import type { PlanningDetail } from "@/lib/service-planning"
import { busPositions, prepareBusTrips, point } from "./geometry"
import { exchangesAt } from "./passenger-exchange"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { Badge } from "@workspace/ui/components/badge"
import { serviceColor } from "./service-color"
import { buildRoutes } from "./route-geometry"
import { Scene, type Marker } from "./scene"

export function ServiceReplayMap({
  detail,
  at,
}: {
  detail: PlanningDetail
  at: number
}) {
  const [selected, setSelected] = useState("")
  const routes = useMemo(() => buildRoutes(detail), [detail])
  const services = [
    ...new Set(detail.routes.map((route) => route.service)),
  ].sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
  const network = services.length > 1
  const trips = useMemo(() => prepareBusTrips(detail, routes), [detail, routes])
  const state = useMemo(() => {
    const buses = busPositions(trips, at)
    const exchanges = exchangesAt(
      detail.calls,
      detail.calls.map((call) => ({
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
    for (const queue of detail.positions) {
      const stop = routes
        .find((r) => r.id === queue.route)
        ?.stops.find((s) => s.order === queue.order)
      if (stop)
        markers.push({
          ...point(stop.point),
          key: `stop:${queue.route}/${queue.order}`,
          kind: "queue",
          count: null,
          exchange: exchanges.get(`${queue.route}/${queue.order}`),
        })
    }
    return { buses, markers }
  }, [detail, trips, at, routes])
  if (routes.every((route) => route.stops.length === 0))
    return (
      <p className="text-sm text-muted-foreground">
        No stop coordinates are available for this service. Recorded evidence
        remains available below.
      </p>
    )
  return (
    <section aria-label="Service replay map" className="space-y-4">
      {network && (
        <p className="text-sm text-muted-foreground">
          {services.length} services · {state.buses.length}{" "}
          {state.buses.length === 1 ? "bus" : "buses"} shown at this time ·
          Route colors match the service labels on buses.
        </p>
      )}
      {routes.some(
        (r) => r.legs.some((leg) => leg.kind === "direct") || r.missingStops > 0
      ) && (
        <p className="text-sm text-muted-foreground">
          Amber segments are direct stop-to-stop estimates where road geometry
          is missing or disconnected. Stops without coordinates cannot be placed
          on the map.
        </p>
      )}
      <div className="space-y-3">
        <div className="space-y-3">
          <Scene
            routes={routes}
            selected={selected}
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
                  aria-label="Red passengers were left behind"
                  className="text-red-400"
                >
                  <UserRoundX className="size-5" />
                </TooltipTrigger>
                <TooltipContent>Passengers left behind</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      {network ? (
        <div aria-label="Service legend" className="flex flex-wrap gap-2">
          {services.map((service) => (
            <Badge variant="outline" key={service}>
              <svg aria-hidden="true" className="size-3" viewBox="0 0 12 12">
                <circle cx="6" cy="6" r="5" fill={serviceColor(service)} />
              </svg>
              {service}
            </Badge>
          ))}
        </div>
      ) : (
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
      )}
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
          These are departure events, not current waiting counts. Routes are
          assembled from the selected service’s ordered database stops and
          available road geometry. Connections along road geometry are
          estimated, including terminal connectors and ambiguous road junctions.
        </p>
      </details>
    </section>
  )
}
