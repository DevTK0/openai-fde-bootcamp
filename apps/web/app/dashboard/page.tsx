import { FleetDashboard } from "@/components/fleet-dashboard"
import { DashboardProvider } from "@/components/dashboard-provider"
import { readDashboardData } from "@/lib/dashboard-server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const initialQuery = new URLSearchParams(
    Object.entries(params).flatMap(([key, value]) =>
      typeof value === "string" ? [[key, value]] : []
    )
  ).toString()
  return (
    <DashboardProvider data={readDashboardData()}>
      <FleetDashboard initialQuery={initialQuery} />
    </DashboardProvider>
  )
}
