"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { z } from "zod"
import {
  ArrowUp,
  AudioLines,
  Check,
  CircleHelp,
  FileText,
  LoaderCircle,
  Mic,
  MicOff,
  Play,
  Sparkles,
  Square,
  X,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@workspace/ui/components/alert-dialog"
import { cn } from "@workspace/ui/lib/utils"
import {
  chatSchema,
  mergeChat,
  type Chat,
  type Command,
  type NoteEvent,
} from "@/lib/fieldnotes/schema"
import { MicrophoneInput, inputLabels } from "./microphone-input"
import { MicrophoneEqualizer } from "./microphone-equalizer"
import { LiveCapture, type InputHealth } from "./live"
import { PresentationSidebar } from "./presentation-sidebar"
import { SpecificationPanel } from "./specification-panel"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"

type CaptureState = "idle" | "connecting" | "live" | "closing"
async function request(command?: Command, id?: string): Promise<unknown> {
  const response = await fetch(
    `/api/fieldnotes${id ? `?id=${encodeURIComponent(id)}` : ""}`,
    command
      ? {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(command),
        }
      : { cache: "no-store" }
  )
  const body: unknown = await response.json()
  if (!response.ok)
    throw new Error(z.object({ error: z.string() }).parse(body).error)
  return body
}
function message(error: unknown) {
  if (error instanceof DOMException && error.name === "NotAllowedError")
    return "Microphone access was denied. Allow microphone access in your browser settings, then press Play. You can still add written clarifications."
  if (error instanceof DOMException && error.name === "NotFoundError")
    return "No microphone was found. Connect a microphone and try again, or use written clarifications."
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again."
}
function transcriptGroups(events: NoteEvent[]) {
  const groups: { id: string; label: string; text: string }[] = []
  const ongoing = new Map<
    string,
    { id: string; label: string; text: string; end: number }
  >()
  for (const event of events) {
    if (event.kind === "clarification") {
      groups.push({
        id: event.id,
        label: "You · clarification",
        text: event.text,
      })
      ongoing.clear()
      continue
    }
    const key = `${event.sessionId}:${event.speaker}`
    let group = ongoing.get(key)
    if (!group || event.startMs - group.end > 5000) {
      group = {
        id: event.id,
        label: event.speaker === "user" ? "Presentation" : "Fieldnotes · voice",
        text: "",
        end: event.endMs,
      }
      groups.push(group)
      ongoing.set(key, group)
    }
    group.text += event.text
    group.end = event.endMs
  }
  return groups
}

export function FieldnotesApp() {
  const [chats, setChats] = useState<Chat[]>([])
  const [chat, setChat] = useState<Chat | null>(null)
  const current = useRef<Chat | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [busy, setBusy] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [state, setState] = useState<CaptureState>("idle")
  const [deviceId, setDeviceId] = useState("default")
  const [inputHealth, setInputHealth] = useState<InputHealth | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Chat | null>(null)
  const [muted, setMuted] = useState(false)
  const [error, setError] = useState("")
  const [draft, setDraft] = useState("")
  const [showSpec, setShowSpec] = useState(true)
  const [confirmEnd, setConfirmEnd] = useState(false)
  const [pending, setPending] = useState<NoteEvent[]>([])
  const pendingRef = useRef<NoteEvent[]>([])
  const capture = useRef<LiveCapture | null>(null)
  const audio = useRef<HTMLAudioElement>(null)
  const saving = useRef<Promise<void> | null>(null)
  const generation = useRef<Promise<void> | null>(null)
  const failedRevision = useRef(-1)
  const lastGenerated = useRef(0)
  const bottom = useRef<HTMLDivElement>(null)

  const accept = useCallback((incoming: Chat) => {
    const next = mergeChat(current.current, incoming)
    current.current = next
    setChat(next)
    setChats((items) =>
      [next, ...items.filter((item) => item.id !== next.id)].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt)
      )
    )
  }, [])

  useEffect(() => {
    let cancelled = false
    void request()
      .then((body) => {
        if (!cancelled) {
          setChats(z.array(chatSchema).parse(body))
          setLoaded(true)
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setError(message(error))
          setLoaded(true)
        }
      })
    return () => {
      cancelled = true
      capture.current?.dispose()
    }
  }, [])

  const enqueue = useCallback((event: NoteEvent) => {
    pendingRef.current = [...pendingRef.current, event]
    setPending(pendingRef.current)
  }, [])

  const flush = useCallback(async () => {
    if (saving.current) return saving.current
    const id = current.current?.id
    if (!id || !pendingRef.current.length) return
    const work = async () => {
      while (pendingRef.current.length) {
        const batch = pendingRef.current.slice(0, 100)
        const updated = chatSchema.parse(
          await request({ kind: "append", id, events: batch })
        )
        const saved = new Set(batch.map((event) => event.id))
        pendingRef.current = pendingRef.current.filter(
          (event) => !saved.has(event.id)
        )
        setPending(pendingRef.current)
        accept(updated)
      }
    }
    saving.current = work()
    try {
      await saving.current
    } finally {
      saving.current = null
    }
  }, [accept])

  const generate = useCallback(async () => {
    if (generation.current) return generation.current
    const selected = current.current
    if (!selected || selected.revision === selected.specRevision) return
    setGenerating(true)
    const work = async () => {
      try {
        accept(
          chatSchema.parse(await request({ kind: "generate", id: selected.id }))
        )
        failedRevision.current = -1
      } catch (error) {
        failedRevision.current = selected.revision
        throw error
      } finally {
        lastGenerated.current = Date.now()
        setGenerating(false)
      }
    }
    generation.current = work()
    try {
      await generation.current
    } finally {
      generation.current = null
    }
  }, [accept])

  useEffect(() => {
    const timer = setInterval(() => {
      void (async () => {
        await flush()
        const selected = current.current
        if (
          selected &&
          selected.revision !== selected.specRevision &&
          failedRevision.current !== selected.revision &&
          Date.now() - lastGenerated.current > 12000
        )
          await generate()
      })().catch((error) => setError(message(error)))
    }, 4000)
    return () => clearInterval(timer)
  }, [flush, generate])

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (capture.current?.connected || pendingRef.current.length) {
        event.preventDefault()
        event.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [])

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "nearest" })
  }, [chat?.events.length, pending.length])

  const locked = busy || generating || state !== "idle" || pending.length > 0
  async function run(action: () => Promise<void>) {
    setBusy(true)
    setError("")
    try {
      await action()
    } catch (error) {
      setError(message(error))
    } finally {
      setBusy(false)
    }
  }
  async function select(id: string) {
    await run(async () => {
      accept(chatSchema.parse(await request(undefined, id)))
      setDraft("")
      failedRevision.current = -1
    })
  }
  async function start() {
    if (!chat || !audio.current) return
    setInputHealth(null)
    setState("connecting")
    setError("")
    if (!navigator.mediaDevices?.getUserMedia) {
      setState("idle")
      setError(
        "Microphone capture needs HTTPS and a browser with microphone support."
      )
      return
    }
    const live = new LiveCapture({
      audio: audio.current,
      event: enqueue,
      input: setInputHealth,
      diagnostics: (diagnostics) => {
        void request({ kind: "diagnostics", id: chat.id, diagnostics }).catch(
          () => {}
        )
      },
      error: (text) => {
        setError(text)
        if (!capture.current?.connected) setState("idle")
      },
    })
    capture.current = live
    try {
      await live.start(chat.id, deviceId)
      if (capture.current === live) {
        setState("live")
        setMuted(false)
      }
    } catch (error) {
      live.dispose()
      if (capture.current === live) {
        capture.current = null
        setState("idle")
        setError(message(error))
      }
    }
  }
  async function end() {
    setConfirmEnd(false)
    setState("closing")
    setError("")
    try {
      if (capture.current) {
        const finalized = await capture.current.close()
        if (!finalized)
          setError(
            "Audio is stopped, but final session usage could not be confirmed."
          )
        capture.current = null
      }
      await flush()
      try {
        await generate()
      } catch (error) {
        setError(message(error))
      }
      if (current.current)
        accept(
          chatSchema.parse(
            await request({ kind: "end", id: current.current.id })
          )
        )
    } catch (error) {
      setError(message(error))
    } finally {
      setState("idle")
      setMuted(false)
    }
  }
  async function send() {
    if (!draft.trim() || !chat) return
    const text = draft.trim()
    enqueue({ kind: "clarification", id: crypto.randomUUID(), text })
    setDraft("")
    capture.current?.clarify(text)
    await run(async () => {
      await flush()
      await generate()
    })
  }
  function download() {
    if (!chat) return
    const url = URL.createObjectURL(
      new Blob([chat.specification], { type: "text/markdown;charset=utf-8" })
    )
    const link = document.createElement("a")
    link.href = url
    link.download = "product-spec.md"
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  const groups = transcriptGroups([...(chat?.events ?? []), ...pending])
  const ended = Boolean(chat?.endedAt)

  return (
    <SidebarProvider className="min-h-dvh bg-background text-foreground [--sidebar-width:15rem] md:h-dvh md:overflow-hidden">
      <PresentationSidebar
        chats={chats}
        selectedId={chat?.id}
        disabled={!loaded || locked}
        onCreate={() =>
          run(async () => {
            accept(chatSchema.parse(await request({ kind: "create" })))
            setDraft("")
            failedRevision.current = -1
          })
        }
        onSelect={select}
        onDelete={setDeleteTarget}
        onRename={(id, name) =>
          run(async () => {
            const updated = chatSchema.parse(
              await request({ kind: "rename", id, name })
            )
            if (current.current?.id === id) accept(updated)
            else
              setChats((items) =>
                items.map((item) => (item.id === id ? updated : item))
              )
          })
        }
      />
      <SidebarInset className="min-w-0 bg-muted/35 md:overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-background px-4 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {chat?.name ?? "Presentation workspace"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {ended
                  ? "Conversation ended · saved"
                  : chat
                    ? pending.length
                      ? "Saving transcript…"
                      : "Notes saved"
                    : "Capture a presentation and create a specification"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => setShowSpec(!showSpec)}
            aria-label="Specification"
            aria-pressed={showSpec}
          >
            <FileText />
            <span className="hidden sm:inline">Specification</span>
          </Button>
        </header>
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 border-b border-border bg-muted px-5 py-3 text-sm"
          >
            <CircleHelp className="mt-0.5 size-4 shrink-0" />
            <p className="flex-1">{error}</p>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Dismiss message"
              onClick={() => setError("")}
            >
              <X />
            </Button>
          </div>
        )}
        {!chat ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
            <div className="rounded-2xl bg-accent p-5">
              <AudioLines className="size-9 text-primary" />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Capture your next presentation
            </h2>
            <p className="max-w-md text-sm leading-7 text-muted-foreground">
              Start a new chat, press Play, and walk through your product.
              Fieldnotes captures the features, decisions, and questions as you
              go.
            </p>
            {!loaded && <LoaderCircle className="animate-spin" />}
            <p className="max-w-sm text-xs leading-6 text-muted-foreground">
              Audio and notes are sent to OpenAI for processing. Make sure
              everyone presenting knows before you start.
            </p>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
            <section
              aria-label="Conversation"
              className="flex min-h-130 min-w-0 flex-1 flex-col lg:min-h-0"
            >
              <div className="px-5 pt-6 md:px-8">
                <div className="flex flex-col items-center gap-4 py-6">
                  <div className="flex w-full items-center gap-4">
                    <Button
                      className="size-12 shrink-0 rounded-full"
                      size="icon"
                      aria-label={state === "live" ? "Stop" : "Play"}
                      disabled={
                        ended ||
                        busy ||
                        state === "connecting" ||
                        state === "closing"
                      }
                      onClick={() =>
                        state === "live" ? setConfirmEnd(true) : void start()
                      }
                    >
                      {state === "connecting" || state === "closing" ? (
                        <LoaderCircle className="animate-spin" />
                      ) : state === "live" ? (
                        <Square className="size-4 fill-current" />
                      ) : (
                        <Play className="size-5 fill-current" />
                      )}
                    </Button>
                    <div className="flex min-w-0 flex-1 justify-center">
                      <MicrophoneEqualizer
                        level={
                          state === "live" && !muted
                            ? (inputHealth?.level ?? 0)
                            : 0
                        }
                      />
                    </div>
                    <Button
                      variant="secondary"
                      className="size-10 shrink-0 rounded-full"
                      size="icon"
                      aria-label={muted ? "Unmute" : "Mute"}
                      aria-pressed={muted}
                      disabled={state !== "live"}
                      onClick={() => {
                        capture.current?.mute(!muted)
                        setMuted(!muted)
                      }}
                    >
                      {muted ? <MicOff /> : <Mic />}
                    </Button>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">
                      {ended
                        ? "Presentation complete"
                        : state === "live"
                          ? muted
                            ? "Microphone muted"
                            : inputLabels[inputHealth?.status ?? "waiting"]
                          : state === "connecting"
                            ? "Connecting microphone…"
                            : state === "closing"
                              ? "Finishing and saving…"
                              : "Ready when you are"}
                    </div>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {ended
                        ? "Your specification is ready to review."
                        : state === "live"
                          ? "GPT-Live · microphone input"
                          : "Press Play to start capturing audio."}
                    </p>
                  </div>
                  {!ended && (
                    <MicrophoneInput
                      value={deviceId}
                      health={inputHealth}
                      connected={state === "live"}
                      disabled={
                        busy || state === "connecting" || state === "closing"
                      }
                      onChange={(id) =>
                        void run(async () => {
                          if (capture.current?.connected)
                            await capture.current.changeMicrophone(id)
                          setDeviceId(id)
                        })
                      }
                    />
                  )}
                </div>
                {state === "connecting" && (
                  <Button
                    variant="ghost"
                    className="mt-2"
                    onClick={() => {
                      capture.current?.dispose()
                      capture.current = null
                      setState("idle")
                    }}
                  >
                    Cancel connection
                  </Button>
                )}
                <audio
                  ref={audio}
                  controls
                  className={cn(
                    "mt-2 h-8 w-full",
                    state !== "live" && "hidden"
                  )}
                  aria-label="Assistant voice playback"
                />
              </div>
              <div
                className="flex-1 space-y-6 overflow-y-auto px-5 py-8 md:px-8"
                aria-label="Captured notes"
              >
                <div>
                  <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="size-4" /> Fieldnotes
                  </div>
                  <p className="max-w-xl text-sm leading-7">
                    Ready for the presentation. Press Play when it begins. I’ll
                    capture features and open questions in the specification.
                  </p>
                </div>
                {groups.map((group) => (
                  <div key={group.id}>
                    <p className="mb-2 text-xs text-muted-foreground">
                      {group.label}
                    </p>
                    <p className="text-sm leading-7 whitespace-pre-wrap">
                      {group.text}
                    </p>
                  </div>
                ))}
                {ended && (
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="size-4" /> Conversation ended. Your notes
                    are saved.
                  </p>
                )}
                <div ref={bottom} />
              </div>
              <div className="px-5 pb-5 md:px-8">
                <form
                  className="rounded-xl border border-border bg-background p-3"
                  onSubmit={(event) => {
                    event.preventDefault()
                    void send()
                  }}
                >
                  <Textarea
                    className="min-h-18 resize-none border-0 bg-transparent p-1 shadow-none focus-visible:ring-0"
                    aria-label="Clarification"
                    placeholder={
                      ended
                        ? "This conversation has ended."
                        : "Add a clarification or a detail worth keeping…"
                    }
                    maxLength={8000}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    disabled={ended || state === "closing" || busy}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault()
                        if (!busy && draft.trim()) void send()
                      }
                    }}
                  />
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      {ended
                        ? "Start a new chat for another presentation."
                        : "Enter to send · Shift + Enter for a new line"}
                    </span>
                    <Button
                      type="submit"
                      size="icon"
                      aria-label="Send clarification"
                      disabled={
                        ended || busy || state === "closing" || !draft.trim()
                      }
                    >
                      {busy ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <ArrowUp />
                      )}
                    </Button>
                  </div>
                </form>
                {!ended && (
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">
                      Microphone audio only. AI drafts need your review.
                    </p>
                    <Button
                      variant="ghost"
                      size="xs"
                      disabled={
                        busy || state === "connecting" || state === "closing"
                      }
                      onClick={() => setConfirmEnd(true)}
                    >
                      End conversation
                    </Button>
                  </div>
                )}
              </div>
            </section>
            {showSpec && (
              <SpecificationPanel
                chat={chat}
                generating={generating}
                busy={busy}
                closing={state === "closing"}
                pending={pending.length}
                onDownload={download}
                onUpdate={() =>
                  void run(async () => {
                    await flush()
                    await generate()
                  })
                }
              />
            )}
          </div>
        )}
      </SidebarInset>
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the session, transcript, and
              specification.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const target = deleteTarget
                if (!target) return
                void run(async () => {
                  await request({ kind: "delete", id: target.id })
                  setChats((items) =>
                    items.filter((item) => item.id !== target.id)
                  )
                  if (current.current?.id === target.id) {
                    current.current = null
                    setChat(null)
                    setDraft("")
                  }
                  setDeleteTarget(null)
                })
              }}
            >
              Delete session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={confirmEnd} onOpenChange={setConfirmEnd}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End this conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              Stopping ends the entire conversation. You cannot resume it or
              send more messages. Your notes and specification remain available
              to review and download.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void end()}>
              End conversation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  )
}
