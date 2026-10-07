import { FleetDashboard } from "@/components/fleet-dashboard"
import { DashboardProvider } from "@/components/dashboard-provider"
import { readDashboardData } from "@/lib/dashboard-server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default function Page() {
  return (
    <DashboardProvider data={readDashboardData()}>
      <FleetDashboard />
    </DashboardProvider>
  )
}
