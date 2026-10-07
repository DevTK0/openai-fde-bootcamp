"use client"
import { useEffect, useMemo, useState, type ReactNode } from "react"
import dynamic from "next/dynamic"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import { Slider } from "@workspace/ui/components/slider"
import { Card, CardContent } from "@workspace/ui/components/card"
import { PlanningTimePicker } from "../planning-time-picker"
import { replayEventTimes, type PlanningDetail } from "@/lib/service-planning"
const ServiceReplayMap = dynamic(
  () => import("./map").then((module) => module.ServiceReplayMap),
  { ssr: false, loading: () => <p role="status">Loading service map…</p> }
)
const clock = (at: number) =>
  new Date(at * 1000 + 8 * 3600 * 1000).toISOString().slice(11, 19)
export function ReplayPlayer({
  detail,
  date,
  start,
  end,
  initialAt,
  context,
  children,
}: {
  detail: PlanningDetail
  date: string
  start: number
  end: number
  initialAt?: number
  context: ReactNode
  children?: (cursor: number) => ReactNode
}) {
  const [cursor, setCursor] = useState(initialAt ?? start)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(5)
  const ended = cursor >= end
  useEffect(() => {
    if (!playing || ended) return
    let previous = performance.now()
    const timer = window.setInterval(() => {
      const now = performance.now()
      const elapsed = Math.min(1, (now - previous) / 1000)
      previous = now
      setCursor((value) => Math.min(end, value + elapsed * speed))
    }, 250)
    return () => window.clearInterval(timer)
  }, [playing, ended, end, speed])
  const events = useMemo(
    () => replayEventTimes(detail, start, end),
    [detail, start, end]
  )
  const previous = events.filter((at) => at < cursor).at(-1) ?? start
  const next = events.find((at) => at > cursor) ?? end
  const seek = (at: number) => {
    setPlaying(false)
    setCursor(at)
  }
  return (
    <div className="space-y-5">
      <ServiceReplayMap detail={detail} at={cursor} />
      <Card>
        <CardContent className="space-y-3 py-3">
          <Slider
            aria-label="Replay time"
            className="w-full"
            min={start}
            max={end}
            step={1}
            value={[cursor]}
            onValueChange={(value) => {
              setPlaying(false)
              setCursor(Array.isArray(value) ? (value[0] ?? start) : value)
            }}
          />
          <div className="flex flex-wrap items-center gap-3">
            <ButtonGroup aria-label="Replay controls">
              <Button
                size="icon"
                variant="outline"
                aria-label="Previous event"
                title="Previous event"
                disabled={cursor <= start}
                onClick={() => seek(previous)}
              >
                <SkipBack />
              </Button>
              <Button
                size="icon"
                variant="outline"
                aria-label={playing && !ended ? "Pause replay" : "Play replay"}
                title={playing && !ended ? "Pause replay" : "Play replay"}
                onClick={() => {
                  if (ended) setCursor(start)
                  setPlaying((value) => ended || !value)
                }}
              >
                {playing && !ended ? <Pause /> : <Play />}
              </Button>
              <Button
                size="icon"
                variant="outline"
                aria-label="Next event"
                title="Next event"
                disabled={ended}
                onClick={() => seek(next)}
              >
                <SkipForward />
              </Button>
            </ButtonGroup>
            <PlanningTimePicker
              label="Inspect time"
              showSeconds
              min={clock(start)}
              max={clock(end)}
              value={new Date(cursor * 1000 + 8 * 3600 * 1000)
                .toISOString()
                .slice(11, 19)}
              onValueChange={(value) => {
                if (!/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(value)) return
                const next = Date.parse(`${date}T${value}+08:00`) / 1000
                setPlaying(false)
                setCursor(Math.max(start, Math.min(end, next)))
              }}
            />
            <ButtonGroup aria-label="Playback speed">
              {[1, 5, 15, 60].map((value) => (
                <Button
                  key={value}
                  size="sm"
                  variant={speed === value ? "default" : "outline"}
                  aria-label={`${value}× playback speed`}
                  aria-pressed={speed === value}
                  onClick={() => setSpeed(value)}
                >
                  {value}×
                </Button>
              ))}
            </ButtonGroup>
            <span className="ml-auto text-xs text-muted-foreground">
              {context}
            </span>
          </div>
        </CardContent>
      </Card>
      {children?.(cursor)}
    </div>
  )
}
