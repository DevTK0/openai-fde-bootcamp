"use client"

import { useId, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Pick } from "@/components/report-ui"

const examples = ["132", "159"]
const exampleDate = "2026-10-07"

export function BlenderReplayPreview({
  service,
  date,
}: {
  service: string
  date: string
}) {
  const [example, setExample] = useState(
    examples.includes(service) ? service : "132"
  )
  const [failed, setFailed] = useState(false)
  const descriptionId = useId()
  const path = `/replay-examples/service-${example}-${exampleDate}`
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <CardTitle>Blender 3D preview</CardTitle>
            <CardDescription>
              Fixed prototype video · Both directions · 7 Oct 2026, 06:00–12:00
              SGT
            </CardDescription>
          </div>
          <Pick
            label="Blender example"
            value={example}
            options={examples.map((value) => ({
              value,
              label: `Service ${value}`,
            }))}
            onChange={(value) => {
              setFailed(false)
              setExample(value)
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p id={descriptionId} className="text-sm text-muted-foreground">
          Watch buses and queue markers on a schematic 3D route. This is a
          synthetic prototype snapshot with estimated movement between stops.
          Video playback is separate from the database replay above; it does not
          change with the selected time, thresholds, or database edits.
        </p>
        {(example !== service || date !== exampleDate) && (
          <p className="text-sm text-muted-foreground">
            This example shows service {example} on 7 October, not the selected
            service {service} on {date}. Renders are available for services 132
            and 159 on that date.
          </p>
        )}
        <video
          key={path}
          controls
          playsInline
          preload="none"
          poster={`${path}-preview.png`}
          aria-label={`Blender 3D example for service ${example} on 7 October 2026`}
          aria-describedby={descriptionId}
          className="aspect-[11/7] w-full rounded-lg bg-muted"
          onError={() => setFailed(true)}
        >
          <source src={`${path}.mp4`} type="video/mp4" />
          Your browser cannot play this video. Use the Open video link below.
        </video>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Silent 10-second render of a six-hour window. Use the evidence
            tables for exact recorded times and unknown versus zero queues.
          </p>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            role="link"
            render={<a href={`${path}.mp4`} target="_blank" rel="noreferrer" />}
          >
            Open video
          </Button>
        </div>
        {failed && (
          <p role="alert" className="text-sm text-destructive">
            The video could not be loaded. Try the Open video link or choose the
            other example.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
