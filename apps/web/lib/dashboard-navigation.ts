import {
  Activity,
  CalendarDays,
  ChartNoAxesCombined,
  LayoutDashboard,
  Database,
  Wrench,
} from "lucide-react"

export const dashboardWorkspaces = [
  {
    id: "fleet",
    label: "Fleet",
    icon: LayoutDashboard,
    pages: [
      {
        id: "overview",
        label: "Fleet overview",
        description:
          "Recorded vehicle use and service history across the fleet.",
      },
      {
        id: "vehicles",
        label: "Vehicle register",
        description: "Planned vehicle assignments and engineering evidence.",
      },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    icon: Activity,
    pages: [
      {
        id: "live-operations",
        label: "Live AI operations",
        description:
          "Monitor incoming reports and review evidence-backed AI recommendations.",
      },
      {
        id: "day-schedule",
        label: "Day schedule",
        description: "Scheduled service simulation.",
      },
      {
        id: "reliability",
        label: "Service reliability",
        description: "Departures, arrival delays, and recorded vehicle use.",
      },
      {
        id: "crowding",
        label: "Passenger queues",
        description: "Observed queues and boarding demand by service and stop.",
      },
      {
        id: "usage",
        label: "Usage & service",
        description: "Selected daily usage and service observations.",
      },
    ],
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: Wrench,
    pages: [
      {
        id: "maintenance",
        label: "Maintenance history",
        description:
          "Maintenance spending, completed services, repairs, inspections, and vehicle hold hours.",
      },
    ],
  },
  {
    id: "planning",
    label: "Planning",
    icon: CalendarDays,
    pages: [
      {
        id: "crew-planning",
        label: "Crew planning",
        description: "Planned assignments, duty windows, and protected breaks.",
      },
      {
        id: "service-planning",
        label: "Service optimisation",
        description:
          "Investigate service problems and review possible interventions.",
      },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: ChartNoAxesCombined,
    pages: [
      {
        id: "costs",
        label: "Cost options",
        description: "Compare supplied costs and recorded repair spending.",
      },
    ],
  },
  {
    id: "data",
    label: "Data",
    icon: Database,
    pages: [
      {
        id: "data-operations",
        label: "Operations data",
        description:
          "Source records for services, vehicles, crews, and workshop activity.",
      },
      {
        id: "data-supplied",
        label: "Supplied datasets",
        description:
          "Imported fleet, maintenance, planning, passenger, and cost records.",
      },
      {
        id: "control-log",
        label: "Control log",
        description:
          "Recorded control instructions and their supporting references.",
      },
      {
        id: "network",
        label: "Network records",
        description: "Routes, stops, service patterns, and rail connections.",
      },
      {
        id: "workshop-register",
        label: "Workshop register",
        description:
          "Work orders, engineering readiness, and the separately held workshop vehicle cohort.",
      },
      {
        id: "passengers",
        label: "Passenger reports",
        description: "Passenger feedback, channels, and recorded concerns.",
      },
    ],
  },
] as const

export type DashboardView =
  (typeof dashboardWorkspaces)[number]["pages"][number]["id"]

const pages = dashboardWorkspaces.flatMap((workspace) =>
  workspace.pages.map((page) => ({
    ...page,
    workspace: workspace.id,
    workspaceLabel: workspace.label,
  }))
)

export function dashboardPage(search: string) {
  const view = new URLSearchParams(search).get("view") ?? "overview"
  return (
    pages.find((page) => page.id === view) ?? {
      ...dashboardWorkspaces[0].pages[0],
      workspace: dashboardWorkspaces[0].id,
      workspaceLabel: dashboardWorkspaces[0].label,
    }
  )
}

export function dashboardHref(search: string, view: DashboardView) {
  const params = new URLSearchParams(search)
  params.set("view", view)
  return `/dashboard?${params}`
}
