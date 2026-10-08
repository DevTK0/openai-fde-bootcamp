"use client"

import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import type { InputHealth } from "./live"

export const inputLabels: Record<InputHealth["status"], string> = {
  waiting: "Connected · speak to check your microphone",
  silent: "No microphone signal detected",
  sending: "Audio detected · waiting for transcript",
  transcribing: "Transcribing your presentation",
  muted: "Microphone muted",
  interrupted: "Microphone audio interrupted",
  unknown: "Connected · waiting for transcript",
}

export function MicrophoneInput({
  value,
  onChange,
  health,
  disabled,
  connected,
}: {
  value: string
  onChange: (id: string) => void
  health: InputHealth | null
  disabled: boolean
  connected: boolean
}) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  useEffect(() => {
    let cancelled = false
    const refresh = () => {
      void navigator.mediaDevices
        ?.enumerateDevices()
        .then((list) => {
          if (!cancelled)
            setDevices(
              list.filter(
                (device) =>
                  device.kind === "audioinput" &&
                  device.deviceId &&
                  device.deviceId !== "default"
              )
            )
        })
        .catch(() => {
          if (!cancelled) setDevices([])
        })
    }
    refresh()
    navigator.mediaDevices?.addEventListener("devicechange", refresh)
    return () => {
      cancelled = true
      navigator.mediaDevices?.removeEventListener("devicechange", refresh)
    }
  }, [connected])
  return (
    <div className="w-full max-w-sm space-y-2">
      <Select
        value={value}
        onValueChange={(id) => {
          if (id) onChange(id)
        }}
        disabled={disabled}
      >
        <SelectTrigger aria-label="Microphone" className="w-full bg-background">
          <SelectValue>
            {value === "default"
              ? "Default microphone"
              : devices.find((device) => device.deviceId === value)?.label ||
                "Selected microphone"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default microphone</SelectItem>
          {devices.map((device, index) => (
            <SelectItem key={device.deviceId} value={device.deviceId}>
              {device.label || `Microphone ${index + 1}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {connected && health && (
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>{health.device}</p>
          <p className="font-mono" aria-label="Microphone signal level">
            Input level:{" "}
            {health.level === null
              ? "unavailable"
              : `${Math.round(Math.min(1, health.level) * 100)}%`}
          </p>
          {(health.status === "silent" || health.status === "interrupted") && (
            <p className="text-foreground">
              No speech is being captured. Check your microphone’s mute switch
              or choose another input above before continuing.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
