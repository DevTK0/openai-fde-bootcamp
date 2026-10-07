"use client"

import { useState } from "react"
import { AudioLines, Check, Clock3, Pencil, Plus } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import type { Chat } from "@/lib/fieldnotes/schema"

export function PresentationSidebar({
  chats,
  selectedId,
  disabled,
  onCreate,
  onSelect,
  onRename,
}: {
  chats: Chat[]
  selectedId?: string
  disabled: boolean
  onCreate: () => Promise<void>
  onSelect: (id: string) => Promise<void>
  onRename: (id: string, name: string) => Promise<void>
}) {
  const [rename, setRename] = useState<{ id: string; name: string } | null>(
    null
  )
  const { setOpenMobile } = useSidebar()
  async function navigate(action: () => Promise<void>) {
    await action()
    setOpenMobile(false)
  }
  return (
    <Sidebar>
      <SidebarHeader className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <AudioLines className="size-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Fieldnotes.
            </h1>
            <p className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
              Presentation workspace
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 pt-5">
        <Button
          className="mb-5 h-10 justify-start"
          disabled={disabled}
          onClick={() => void navigate(onCreate)}
        >
          <Plus /> New chat
        </Button>
        <p className="mb-2 px-3 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
          Presentations
        </p>
        <SidebarMenu aria-label="Presentations">
          {chats.map((chat) => (
            <SidebarMenuItem key={chat.id} className="flex items-center gap-1">
              {rename?.id === chat.id ? (
                <form
                  className="flex w-full flex-wrap gap-1 p-1"
                  onSubmit={(event) => {
                    event.preventDefault()
                    void onRename(chat.id, rename.name).then(() =>
                      setRename(null)
                    )
                  }}
                >
                  <Input
                    autoFocus
                    aria-label="Presentation name"
                    maxLength={100}
                    value={rename.name}
                    onChange={(event) =>
                      setRename({ ...rename, name: event.target.value })
                    }
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={disabled || !rename.name.trim()}
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setRename(null)}
                  >
                    Cancel
                  </Button>
                </form>
              ) : (
                <>
                  <SidebarMenuButton
                    isActive={selectedId === chat.id}
                    className="h-10 gap-3 px-3 data-active:bg-primary/10 data-active:text-primary"
                    disabled={disabled}
                    onClick={() => void navigate(() => onSelect(chat.id))}
                  >
                    <Clock3 />
                    <span>{chat.name}</span>
                    {chat.endedAt && <Check className="ml-auto" />}
                  </SidebarMenuButton>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Rename ${chat.name}`}
                    disabled={disabled}
                    onClick={() => setRename({ id: chat.id, name: chat.name })}
                  >
                    <Pencil className="size-3" />
                  </Button>
                </>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
