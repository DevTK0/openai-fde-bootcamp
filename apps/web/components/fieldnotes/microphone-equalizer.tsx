"use client"

import { useEffect, useState } from "react"

export function MicrophoneEqualizer({ level }: { level: number }) {
  const [levels, setLevels] = useState<number[]>(Array(48).fill(0))
  useEffect(() => {
    const timer = setInterval(
      () => setLevels((previous) => [...previous.slice(1), level]),
      100
    )
    return () => clearInterval(timer)
  }, [level])
  return (
    <svg
      role="img"
      aria-label="Microphone equalizer"
      viewBox="0 0 288 96"
      className="h-24 w-full max-w-80 text-primary"
    >
      {levels.map((value, index) => {
        const height = Math.max(4, Math.min(88, Math.sqrt(value) * 160))
        return (
          <rect
            key={index}
            x={index * 6}
            y={(96 - height) / 2}
            width={3}
            height={height}
            rx={1.5}
            fill="currentColor"
          />
        )
      })}
    </svg>
  )
}
