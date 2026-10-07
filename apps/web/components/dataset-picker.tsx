"use client"

import { useState, type ReactNode } from "react"
import { Pick } from "@/components/report-ui"

export function DatasetPicker({
  items,
  defaultValue,
}: {
  items: { id: string; label: string; content: ReactNode }[]
  defaultValue?: string
}) {
  const [selected, setSelected] = useState(defaultValue ?? items[0]?.id)
  const current = items.find((item) => item.id === selected) ?? items[0]
  if (!current) return null
  return (
    <div className="min-w-0 space-y-4">
      {items.length > 1 && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium">Source records</span>
          <Pick
            label="Dataset"
            value={current.id}
            onChange={setSelected}
            options={items.map(({ id, label }) => ({ value: id, label }))}
          />
        </div>
      )}
      <div key={current.id} className="min-w-0 space-y-4">
        {current.content}
      </div>
    </div>
  )
}
