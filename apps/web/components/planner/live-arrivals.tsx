"use client"

import { useEffect, useState } from "react"
import { BusFront, Radio, RefreshCw } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import type { BusArrivalResult } from "@/lib/server/datamall"

export function LiveArrivals({ service }: { service: string }) {
  const [stop, setStop] = useState("52009")
  const [queryStop, setQueryStop] = useState("52009")
  const [result, setResult] = useState<BusArrivalResult | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const controller = new AbortController()
    setResult(null)
    setError("")
    async function load() {
      if (document.visibilityState === "hidden") return
      setLoading(true)
      try {
        const response = await fetch(
          `/api/datamall/arrivals?${new URLSearchParams({ stop: queryStop, service })}`,
          { signal: controller.signal }
        )
        const data = await response.json()
        if (!response.ok)
          throw new Error(
            data.error ?? "Public arrival estimates are unavailable."
          )
        if (!controller.signal.aborted) {
          setResult(data)
          setError("")
          setNow(Date.now())
        }
      } catch (e) {
        if (!controller.signal.aborted)
          setError(
            e instanceof Error
              ? e.message
              : "Public arrival estimates are unavailable."
          )
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void load()
    const interval = setInterval(() => {
      void load()
    }, 20_000)
    document.addEventListener("visibilitychange", load)
    return () => {
      controller.abort()
      clearInterval(interval)
      document.removeEventListener("visibilitychange", load)
    }
  }, [queryStop, service, refresh])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Radio className="size-4 text-primary" />
            Public arrivals
          </CardTitle>
          <Badge variant="outline">LTA DataMall</Badge>
        </div>
        <CardDescription className="text-xs">
          Live public service {service} · separate from the exercise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (/^\d{5}$/.test(stop)) {
              setQueryStop(stop)
              setRefresh((r) => r + 1)
            }
          }}
        >
          <div className="min-w-0 flex-1 space-y-1.5">
            <Label htmlFor="public-stop" className="text-xs">
              Bus stop code
            </Label>
            <Input
              id="public-stop"
              value={stop}
              onChange={(e) => setStop(e.target.value)}
              maxLength={5}
              inputMode="numeric"
              pattern="[0-9]{5}"
              required
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            size="icon"
            disabled={loading || !/^\d{5}$/.test(stop)}
            aria-label="Refresh public arrivals"
          >
            <RefreshCw className={loading ? "animate-spin" : ""} />
          </Button>
        </form>
        {error ? (
          <p
            role="alert"
            className="text-xs leading-relaxed text-muted-foreground"
          >
            {error}
            {result &&
              " Last retrieved estimates are shown below; they may be stale."}
          </p>
        ) : (
          result?.message && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result.message}
            </p>
          )
        )}
        {result?.services?.flatMap((s) =>
          s.buses.map((bus, i) => {
            const minutes = bus.estimatedArrival
              ? Math.max(
                  0,
                  Math.floor(
                    (new Date(bus.estimatedArrival).getTime() - now) / 60_000
                  )
                )
              : null
            return (
              <div
                key={`${s.serviceNo}-${i}`}
                className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <BusFront className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium">
                      {s.serviceNo} · {i === 0 ? "Next bus" : `Bus ${i + 1}`}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {bus.load === "SEA"
                        ? "Seats available"
                        : bus.load === "SDA"
                          ? "Standing available"
                          : bus.load === "LSD"
                            ? "Limited standing"
                            : "Load unavailable"}{" "}
                      · {bus.monitored ? "Monitored" : "Schedule estimate"}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold">
                  {minutes === null
                    ? "No ETA"
                    : minutes === 0
                      ? "Arr"
                      : `${minutes} min`}
                </span>
              </div>
            )
          })
        )}
        {result?.retrievedAt && (
          <p className="text-[10px] text-muted-foreground">
            Retrieved{" "}
            {new Date(result.retrievedAt).toLocaleTimeString("en-SG", {
              timeZone: "Asia/Singapore",
              hour12: false,
            })}{" "}
            SGT · {result.state}
          </p>
        )}
        <p className="border-t pt-3 text-[10px] leading-relaxed text-muted-foreground">
          Load is a category, not a passenger count. These estimates do not
          identify fictional fleet vehicles or confirm Engineering release.
        </p>
      </CardContent>
    </Card>
  )
}
