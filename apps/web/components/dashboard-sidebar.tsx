"use client"

import { useEffect, useState } from "react"
import { BusFront, ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import {
  dashboardWorkspaces,
  dashboardHref,
  dashboardPage,
  type DashboardView,
} from "@/lib/dashboard-navigation"

export function DashboardSidebar({
  view,
  workspace,
  search,
}: {
  view: DashboardView
  workspace: string
  search: string
}) {
  const { setOpenMobile } = useSidebar()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  useEffect(() => {
    let activePage = dashboardPage(window.location.search).id
    const revealActiveWorkspace = () => {
      const next = dashboardPage(window.location.search)
      if (next.id === activePage) return
      activePage = next.id
      const activeWorkspace = next.workspace
      setExpanded((previous) =>
        previous[activeWorkspace]
          ? previous
          : { ...previous, [activeWorkspace]: true }
      )
    }
    window.addEventListener("popstate", revealActiveWorkspace)
    return () => window.removeEventListener("popstate", revealActiveWorkspace)
  }, [])
  return (
    <Sidebar>
      <SidebarHeader className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BusFront className="size-5" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">
              LionLink<span className="text-primary">.</span>
            </p>
            <p className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
              Fleet intelligence
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-3">
        <p className="px-3 pb-2 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
          Workspaces
        </p>
        <nav aria-label="Workspaces">
          <SidebarMenu className="gap-2">
            {dashboardWorkspaces.map((group) => (
              <Collapsible
                key={group.id}
                open={expanded[group.id] ?? group.id === workspace}
                onOpenChange={(open) =>
                  setExpanded((previous) => ({ ...previous, [group.id]: open }))
                }
                render={<SidebarMenuItem />}
              >
                <CollapsibleTrigger
                  render={
                    <SidebarMenuButton className="h-10 gap-3 px-3 font-medium" />
                  }
                >
                  <group.icon className="size-4" />
                  <span>{group.label}</span>
                  <ChevronRight className="ml-auto size-3.5 transition-transform in-aria-expanded:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="mt-1 gap-1">
                    {group.pages.map((page) => (
                      <SidebarMenuSubItem key={page.id}>
                        <SidebarMenuSubButton
                          href={dashboardHref(search, page.id)}
                          isActive={page.id === view}
                          aria-current={page.id === view ? "page" : undefined}
                          className="h-8 data-active:bg-primary/10 data-active:font-medium data-active:text-primary"
                          onClick={(event) => {
                            if (
                              event.button !== 0 ||
                              event.metaKey ||
                              event.ctrlKey ||
                              event.shiftKey ||
                              event.altKey
                            )
                              return
                            event.preventDefault()
                            window.history.pushState(
                              null,
                              "",
                              dashboardHref(window.location.search, page.id)
                            )
                            window.dispatchEvent(new PopStateEvent("popstate"))
                            setOpenMobile(false)
                            window.scrollTo(0, 0)
                          }}
                        >
                          <span>{page.label}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                    {group.id === "planning" && (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/ops-planning">
                          <span>Operations planner</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </SidebarMenu>
        </nav>
      </SidebarContent>
      <SidebarFooter className="border-t px-6 py-4 text-xs text-muted-foreground">
        <span>Singapore · UTC+08</span>
        <span>Historical & exercise records</span>
      </SidebarFooter>
    </Sidebar>
  )
}
