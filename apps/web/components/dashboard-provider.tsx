"use client"

import { createContext, useContext, useMemo } from "react"
import type { DashboardData } from "@/lib/dashboard-data"
import { createFleet } from "@/lib/fleet"
import { createRelationships } from "@/lib/relationships"

function createDashboard(data: DashboardData) {
  const fleet = createFleet(data.fleet)
  return {
    ...data,
    ...fleet,
    ...createRelationships(fleet, data.operationsPassengers),
  }
}
const DashboardContext = createContext<ReturnType<
  typeof createDashboard
> | null>(null)

export function DashboardProvider({
  data,
  children,
}: {
  data: DashboardData
  children: React.ReactNode
}) {
  const value = useMemo(() => createDashboard(data), [data])
  return <DashboardContext value={value}>{children}</DashboardContext>
}
export function useDashboard() {
  const dashboard = useContext(DashboardContext)
  if (!dashboard) throw new Error("DashboardProvider is required")
  return dashboard
}
