"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Slider } from "@workspace/ui/components/slider"
import { Pause, Play, RotateCcw, LogIn, LogOut, UserRoundX } from "lucide-react"
import {
  planningTime,
  replayAt,
  type PlanningReport,
} from "@/lib/service-planning"
import { busPositions, mapData, point } from "./geometry"
import { exchangesAt, type PassengerRecord } from "./passenger-exchange"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { Scene, type Marker } from "./scene"

const start = planningTime("2026-10-07", "06:00")
const end = planningTime("2026-10-07", "12:00")
const clock = (at: number) =>
  new Date(at * 1000).toLocaleTimeString("en-SG", {
    timeZone: "Asia/Singapore",
    hour12: false,
  })

export function SingaporeReplay({
  reports,
  passengers,
}: {
  reports: PlanningReport[]
  passengers: PassengerRecord[]
}) {
  const [cameraVersion, setCameraVersion] = useState(0)
  const [service, setService] = useState("132")
  const [at, setAt] = useState(start + 216)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(5)
  const [roads, setRoads] = useState(true)
  const [view, setView] = useState<"tilted" | "top">("tilted")
  const [extent, setExtent] = useState<"service" | "island" | "neighborhood">(
    "service"
  )
  const [selected, setSelected] = useState("bus:NW-20261007-0009")
  const report = reports.find((r) => r.selection.service === service)
  const ended = at >= end
  useEffect(() => {
    if (!playing || ended) return
    let previous = performance.now()
    const timer = setInterval(() => {
      const now = performance.now()
      const elapsed = Math.min(1, (now - previous) / 1000)
      previous = now
      setAt((t) => Math.min(end, t + elapsed * speed))
    }, 250)
    return () => clearInterval(timer)
  }, [playing, ended, speed])
  const state = useMemo(() => {
    if (!report) return { buses: [], queues: [], markers: [] }
    const buses = busPositions(report.detail, at, roads)
    const queues = replayAt(report.detail, at).queues
    const exchanges = exchangesAt(report.detail.calls, passengers, at)
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
  }, [report, at, roads, passengers])
  const routes = mapData.routes.filter((r) => r.service === service)
  return (
    <main className="mx-auto max-w-[1700px] space-y-5 p-5 md:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline">Experimental replay</Badge>
            <span className="text-xs text-muted-foreground">
              PLANNING / SERVICE REPLAY
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            A service in motion
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Singapore · 7 October 2026 · 06:00–12:00 SGT · Synthetic operating
            records
          </p>
        </div>
        <div className="flex gap-2">
          {["132", "159"].map((s) => (
            <Button
              key={s}
              variant={service === s ? "default" : "outline"}
              onClick={() => {
                setService(s)
                setSelected("")
              }}
            >
              Service {s}
            </Button>
          ))}
        </div>
      </header>
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
      <Card>
        <CardContent className="space-y-4 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => {
                  if (at >= end) setAt(start)
                  setPlaying((p) => at >= end || !p)
                }}
              >
                {playing && at < end ? <Pause /> : <Play />}
                {playing && at < end ? "Pause" : "Play"}
              </Button>
              <Button
                size="icon-sm"
                variant="outline"
                aria-label="Reset time"
                onClick={() => {
                  setAt(start)
                  setPlaying(false)
                }}
              >
                <RotateCcw />
              </Button>
              <span className="ml-2 font-mono text-xl">{clock(at)}</span>
              <span className="text-xs text-muted-foreground">SGT</span>
              <div
                className="flex gap-1"
                role="group"
                aria-label="Playback speed"
              >
                {[1, 5, 15, 60].map((value) => (
                  <Button
                    key={value}
                    size="sm"
                    variant={speed === value ? "secondary" : "ghost"}
                    aria-pressed={speed === value}
                    aria-label={`${value}× playback speed`}
                    onClick={() => setSpeed(value)}
                  >
                    {value}×
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setAt(start + 216)
                  setPlaying(false)
                }}
              >
                06:03:36 · Dwell
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setAt(start + 240)
                  setPlaying(false)
                }}
              >
                06:04 · Travel
              </Button>
              <Button
                size="icon-sm"
                variant="outline"
                aria-label="Replay a passenger exchange"
                title="Passenger exchange: 07:06:45"
                onClick={() => {
                  setService("132")
                  setAt(start + 4005)
                  setExtent("neighborhood")
                  setCameraVersion((v) => v + 1)
                  setPlaying(false)
                }}
              >
                <LogIn />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setAt(start + 7200)
                  setPlaying(false)
                }}
              >
                08:00 · Peak
              </Button>
            </div>
          </div>
          <Slider
            aria-label="Replay time"
            min={start}
            max={end}
            step={1}
            value={[at]}
            onValueChange={(value) => {
              setAt(Array.isArray(value) ? (value[0] ?? start) : value)
              setPlaying(false)
            }}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>06:00</span>
            <span>07:00</span>
            <span>08:00</span>
            <span>09:00</span>
            <span>10:00</span>
            <span>11:00</span>
            <span>12:00</span>
          </div>
        </CardContent>
      </Card>
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
        <summary className="cursor-pointer">
          Map sources and prototype limits
        </summary>
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
          132 and 159 have been validated for this prototype.
        </p>
      </details>
    </main>
  )
}
