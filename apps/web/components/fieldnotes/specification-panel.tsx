"use client"
import Markdown from "react-markdown"
import { ArrowDownToLine, RefreshCw } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import type { Chat } from "@/lib/fieldnotes/schema"
export function SpecificationPanel({
  chat,
  generating,
  busy,
  closing,
  pending,
  onDownload,
  onUpdate,
}: {
  chat: Chat
  generating: boolean
  busy: boolean
  closing: boolean
  pending: number
  onDownload: () => void
  onUpdate: () => void
}) {
  return (
    <section
      aria-label="Specification"
      className="flex min-h-100 min-w-0 flex-1 flex-col border-t border-border bg-card lg:border-t-0 lg:border-l"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-5 md:px-7">
        <div>
          <h2 className="text-base font-semibold">Specification</h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            product-spec.md
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Update specification"
            disabled={
              generating ||
              busy ||
              closing ||
              (!pending && chat.revision === chat.specRevision)
            }
            onClick={onUpdate}
          >
            <RefreshCw className={cn("size-4", generating && "animate-spin")} />
          </Button>
          <Button variant="outline" disabled={generating} onClick={onDownload}>
            <ArrowDownToLine /> Download
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 px-5 pt-5 md:px-7">
        <Badge variant="secondary">
          {generating
            ? "Updating draft…"
            : chat.revision > chat.specRevision || pending
              ? "Updates pending"
              : chat.revision
                ? "Draft saved"
                : "Awaiting presentation"}
        </Badge>
      </div>
      <article className="min-w-0 flex-1 overflow-y-auto px-5 py-6 text-sm leading-7 wrap-anywhere md:px-7 [&_h1]:mb-6 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-5 [&_h3]:font-semibold [&_li]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-5">
        <Markdown
          skipHtml
          components={{
            img: () => null,
            a: ({ children }) => <span>{children}</span>,
          }}
        >
          {chat.specification}
        </Markdown>
      </article>
    </section>
  )
}
