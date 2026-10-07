"use client"

import type { ReactNode } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

export function DatasetTabs({
  items,
  defaultValue,
}: {
  items: { id: string; label: string; content: ReactNode }[]
  defaultValue?: string
}) {
  return (
    <Tabs defaultValue={defaultValue ?? items[0]?.id} className="min-w-0 gap-4">
      <div className="max-w-full overflow-x-auto pb-2">
        <TabsList aria-label="Datasets" variant="line" className="w-max">
          {items.map((item) => (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className="shrink-0 px-3"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {items.map((item) => (
        <TabsContent
          key={item.id}
          value={item.id}
          className="min-w-0 space-y-4"
        >
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
