"use client"

import { useMemo, useState } from "react"
import { LogIn, LogOut, UserRoundX, Users, MapPin } from "lucide-react"
import type { PlanningDetail } from "@/lib/service-planning"
import { busPositions, prepareBusTrips, point } from "./geometry"
import { exchangesAt } from "./passenger-exchange"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { Toggle } from "@workspace/ui/components/toggle"
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
  const [showPassengers, setShowPassengers] = useState(!network)
  const [showStops, setShowStops] = useState(!network)
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
          exchange: showPassengers
            ? exchanges.get(`${queue.route}/${queue.order}`)
            : undefined,
        })
    }
    return { buses, markers }
  }, [detail, trips, at, routes, showPassengers])
  if (routes.every((route) => route.stops.length === 0))
    return (
      <p className="text-sm text-muted-foreground">
        No stop coordinates are available for this service. Recorded evidence
        remains available below.
      </p>
    )
  return (
    <section aria-label="Service replay map" className="space-y-4">
      <div aria-label="Map layers" className="flex flex-wrap gap-2">
        <Toggle
          variant="outline"
          pressed={showPassengers}
          onPressedChange={setShowPassengers}
          aria-label="Passenger info"
        >
          <Users /> Passenger info
        </Toggle>
        <Toggle
          variant="outline"
          pressed={showStops}
          onPressedChange={setShowStops}
          aria-label="Bus stops"
        >
          <MapPin /> Bus stops
        </Toggle>
      </div>
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
            showStops={showStops}
            routes={routes}
            selected={selected}
            markers={state.markers}
            onPick={setSelected}
          />
          <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
            <span>
              Drag to rotate · Two-finger scroll to pan · + / − to zoom
            </span>
            {showPassengers && (
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
            )}
          </div>
        </div>
      </div>
      {!network && (
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
    </section>
  )
}
