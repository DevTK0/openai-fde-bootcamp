"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowRight, Check, Circle, Factory, GitBranch, LoaderCircle, MessageSquare, Mic, MicOff, Plus, Radio, Send, Square, X } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { MAGIC_PHRASE, snapshotSchema, type Command, type FactoryRequest, type Snapshot } from "@/lib/contracts"
import { startTranscription } from "@/lib/transcription"

type Microphone = "off" | "connecting" | "listening" | "stopping"
type PendingSegment = Extract<Command, { kind: "segment" }>
const labels = { queued: "Queued", running: "Building", clarification: "Needs your input", ready: "Ready to review", failed: "Needs attention", cancelled: "Cancelled" }

export function LiveRoom() {
  const [token, setToken] = useState("")
  const [access, setAccess] = useState("")
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [title, setTitle] = useState("")
  const [speaker, setSpeaker] = useState("Employee")
  const [draft, setDraft] = useState("")
  const [partial, setPartial] = useState("")
  const [microphone, setMicrophone] = useState<Microphone>("off")
  const [pending, setPending] = useState<PendingSegment[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const controller = useRef<AbortController | null>(null)
  const audio = useRef<Awaited<ReturnType<typeof startTranscription>> | null>(null)
  const currentRoom = useRef<string | null>(null)
  const mutationQueue = useRef(Promise.resolve())
  const revision = useRef(0)
  const api = useCallback(async (key: string, command?: Command, conversationId?: string) => {
    const version = ++revision.current
    const response = await fetch(`/api/factory${conversationId ? `?conversationId=${encodeURIComponent(conversationId)}` : ""}`, {
      method: command ? "POST" : "GET", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      ...(command ? { body: JSON.stringify(command) } : {}), cache: "no-store",
    })
    if (!response.ok) {
      const body = await response.text()
      throw new Error(body || `Factory returned ${response.status}`)
    }
    const result = snapshotSchema.parse(await response.json())
    if (version === revision.current) {
      setSnapshot(result)
      currentRoom.current = result.conversation?.id ?? null
    }
    return result
  }, [])
  useEffect(() => {
    const saved = sessionStorage.getItem("factory-access")
    if (!saved) return
    void api(saved).then(() => setAccess(saved)).catch(() => sessionStorage.removeItem("factory-access"))
  }, [api])
  useEffect(() => {
    if (!access) return
    const interval = setInterval(() => {
      if (busy) return
      void api(access, undefined, currentRoom.current ?? undefined).catch((e: unknown) => setError(message(e)))
    }, 2500)
    return () => clearInterval(interval)
  }, [access, api, busy])
  useEffect(() => () => { controller.current?.abort() }, [])

  async function mutate(command: Command) {
    setBusy(true)
    setError("")
    try { await api(access, command) } finally { setBusy(false) }
  }
  function saveSpeech(command: PendingSegment) {
    setPending((items) => items.some((item) => item.id === command.id) ? items : [...items, command])
    mutationQueue.current = mutationQueue.current.then(async () => {
      await api(access, command)
      setPending((items) => items.filter((item) => item.id !== command.id))
    }).catch((e: unknown) => {
      setError(`Speech has not been saved. ${message(e)}`)
      controller.current?.abort()
      setMicrophone("off")
    })
  }
  async function start() {
    const conversationId = snapshot?.conversation?.id
    if (!conversationId) return
    const abort = new AbortController()
    controller.current = abort
    setMicrophone("connecting")
    setError("")
    try {
      audio.current = await startTranscription({ token: access, signal: abort.signal,
        onPartial: setPartial,
        onFinal: ({ text }) => { if (text.trim()) saveSpeech({ kind: "segment", id: crypto.randomUUID(), conversationId, speaker, text }) },
        onError: (text) => { setError(text); setMicrophone("off"); setPartial("") },
      })
      if (!abort.signal.aborted) setMicrophone("listening")
    } catch (e) {
      if (!abort.signal.aborted) setError(message(e))
      setMicrophone("off")
    }
  }
  async function stop() {
    if (microphone === "connecting") { controller.current?.abort(); setMicrophone("off"); return }
    setMicrophone("stopping")
    await audio.current?.stop()
    controller.current?.abort()
    audio.current = null
    setMicrophone("off")
    setPartial("")
  }
  const request = snapshot?.requests.find((item) => item.id === selected) ?? snapshot?.requests.at(-1)
  const micActive = microphone !== "off"
  const worker = snapshot?.configuration

  if (!access) return <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6"><Card className="w-full max-w-md shadow-lg"><CardHeader className="gap-4"><Factory className="size-9 text-primary" /><div><p className="text-sm text-muted-foreground">LionLink</p><CardTitle className="mt-1 text-2xl">Software factory</CardTitle></div><p className="text-sm leading-6 text-muted-foreground">Bring a pain point into the conversation. Turn it into a software change your team can review.</p></CardHeader><CardContent><form className="space-y-4" onSubmit={(event) => {
    event.preventDefault(); setBusy(true); setError("")
    void api(token).then(() => { sessionStorage.setItem("factory-access", token); setAccess(token); setToken("") }).catch((e: unknown) => setError(message(e))).finally(() => setBusy(false))
  }}><div className="space-y-2"><Label htmlFor="access-token">Factory access token</Label><Input id="access-token" type="password" autoComplete="off" required value={token} onChange={(event) => setToken(event.target.value)} /><p className="text-xs text-muted-foreground">Ask your factory operator for access. This tab remembers the token until you disconnect.</p></div>{error && <p role="alert" className="break-words text-sm text-destructive">{error}</p>}<Button type="submit" disabled={busy || !token.trim()} className="w-full">{busy ? <LoaderCircle className="animate-spin" /> : <ArrowRight />}Connect to factory</Button></form></CardContent></Card></main>

  return <main className="min-h-screen bg-muted/20">
    <header className="border-b bg-background"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4"><div className="flex items-center gap-3"><div className="rounded-xl bg-primary p-2.5 text-primary-foreground"><Factory className="size-5" /></div><div><p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">LionLink</p><h1 className="text-lg font-semibold tracking-tight">Software factory</h1></div></div><div className="flex items-center gap-3"><Badge variant={worker?.worker === "ready" ? "secondary" : "outline"}><Circle className="size-2 fill-current" />{worker?.worker === "ready" ? "Builder connected" : "Builder unavailable"}</Badge><Button variant="ghost" size="sm" onClick={() => { controller.current?.abort(); revision.current += 1; sessionStorage.removeItem("factory-access"); setAccess(""); setSnapshot(null); setMicrophone("off"); setPending([]) }}>Disconnect</Button></div></div></header>
    <div className="mx-auto max-w-7xl space-y-6 px-5 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-muted-foreground">A shorter path from feedback to a fix</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Talk it through. Build what matters.</h2></div><Badge variant="outline">Changes stay in a review branch</Badge></div>
      {error && <div role="alert" className="flex items-start justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"><p className="break-words">{error}</p><Button variant="ghost" size="icon-sm" aria-label="Dismiss error" onClick={() => setError("")}><X /></Button></div>}
      {worker?.reason && <p className="rounded-xl border bg-background p-4 text-sm text-muted-foreground">{worker.reason} You can keep capturing feedback. Requests wait until the builder is available.</p>}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section className="min-w-0 space-y-5" aria-label="Conversation">
          <Card><CardHeader className="gap-4"><div className="flex items-center justify-between gap-3"><CardTitle className="flex items-center gap-2"><MessageSquare className="size-4" />Conversation</CardTitle><Badge variant={microphone === "listening" ? "default" : "secondary"}>{microphone === "listening" ? "Listening" : microphone === "connecting" ? "Connecting microphone" : microphone === "stopping" ? "Finishing transcript" : "Microphone off"}</Badge></div><div className="flex flex-wrap gap-2">{snapshot?.conversations.map((room) => <Button key={room.id} size="sm" variant={room.id === snapshot.conversation?.id ? "secondary" : "ghost"} disabled={micActive || busy || pending.length > 0} onClick={() => { setSelected(null); void api(access, undefined, room.id).catch((e: unknown) => setError(message(e))) }}>{room.title}</Button>)}</div><form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); void mutate({ kind: "create", id: crypto.randomUUID(), title }).then(() => { setTitle(""); setSelected(null) }).catch((e: unknown) => setError(message(e))) }}><Input aria-label="New conversation name" placeholder="Name a conversation" maxLength={160} value={title} onChange={(event) => setTitle(event.target.value)} /><Button aria-label="Create conversation" type="submit" variant="outline" disabled={!title.trim() || busy || micActive || pending.length > 0}><Plus /></Button></form></CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-4"><div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-primary uppercase"><Radio className="size-4" />Your signal to build</div><p className="mt-2 text-lg font-medium leading-7">&ldquo;{MAGIC_PHRASE}&rdquo;</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Describe the change first, then say the phrase. The factory uses the preceding conversation and starts work automatically. It may ask a focused question.</p></div>
              {!snapshot?.conversation ? <div className="py-8 text-center"><MessageSquare className="mx-auto mb-3 size-8 text-muted-foreground" /><h3 className="font-medium">Start with a conversation</h3><p className="mt-2 text-sm text-muted-foreground">Give it a name above, then share what gets in your way.</p></div> : <>
                <div className="flex flex-wrap items-end gap-3"><div className="min-w-32 flex-1 space-y-2"><Label htmlFor="speaker">Speaker name</Label><Input id="speaker" maxLength={100} value={speaker} disabled={micActive} onChange={(event) => setSpeaker(event.target.value)} /></div><Button onClick={() => void (micActive ? stop() : start())} disabled={!speaker.trim() || microphone === "stopping" || pending.length > 0} variant={micActive ? "destructive" : "default"}>{microphone === "connecting" ? <LoaderCircle className="animate-spin" /> : micActive ? <Square /> : <Mic />}{microphone === "connecting" ? "Cancel connection" : micActive ? "Stop listening" : "Start listening"}</Button></div>
                <p className="text-xs leading-5 text-muted-foreground">Only start with everyone&apos;s agreement. While listening, audio goes to OpenAI for transcription. Final text is saved in this conversation. Raw audio is not stored by this app.</p>
                <div className="max-h-96 min-h-36 space-y-4 overflow-y-auto rounded-xl border bg-muted/20 p-4" aria-label="Saved transcript">{snapshot.segments.length === 0 ? <div className="py-5 text-sm text-muted-foreground"><MicOff className="mb-3 size-5" /><p>No transcript yet. Start the microphone or type below.</p></div> : snapshot.segments.map((segment) => <article key={segment.id}><p className="mb-1 text-xs font-semibold text-muted-foreground">{segment.speaker} <time className="ml-2 font-normal">{new Date(segment.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time></p><p className="whitespace-pre-wrap text-sm leading-6">{segment.text}</p></article>)}{partial && <p className="text-sm italic text-muted-foreground" aria-live="polite">{partial}</p>}</div>
                {pending.length > 0 && <div className="space-y-2 rounded-lg border p-3"><p className="text-sm font-medium">Unsaved speech</p>{pending.map((item) => <div key={item.id} className="flex items-start gap-2"><p className="flex-1 text-sm">{item.text}</p><Button size="sm" variant="outline" onClick={() => saveSpeech(item)}>Retry save</Button></div>)}</div>}
                <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); const text = draft; void mutate({ kind: "segment", id: crypto.randomUUID(), conversationId: snapshot.conversation?.id ?? "", speaker, text }).then(() => setDraft("")).catch((e: unknown) => setError(message(e))) }}><Label htmlFor="transcript">Or add to the transcript</Label><Textarea id="transcript" placeholder="Describe a pain point, then use the signal phrase when you want the factory to act." maxLength={12000} value={draft} onChange={(event) => setDraft(event.target.value)} /><div className="flex justify-end"><Button type="submit" size="sm" disabled={!draft.trim() || !speaker.trim() || busy || micActive || pending.length > 0}><Send />Add to conversation</Button></div></form>
              </>}
            </CardContent></Card>
        </section>
        <section className="min-w-0 space-y-5" aria-label="Factory requests"><Card><CardHeader><CardTitle className="flex items-center justify-between">Factory requests<Badge variant="secondary">{snapshot?.requests.length ?? 0}</Badge></CardTitle></CardHeader><CardContent className="space-y-3">{!snapshot?.requests.length ? <div className="py-10 text-center"><GitBranch className="mx-auto mb-4 size-8 text-muted-foreground" /><h3 className="font-medium">Your next improvement starts here</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">When you use the signal phrase, a request appears here with its progress and any questions from the builder.</p></div> : [...snapshot.requests].reverse().map((item) => <Button key={item.id} variant={request?.id === item.id ? "secondary" : "outline"} className="h-auto w-full justify-start whitespace-normal px-4 py-3 text-left" onClick={() => setSelected(item.id)}><div className="w-full"><div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold">{labels[item.state.kind]}</span><span className="text-xs text-muted-foreground">Attempt {item.attempt}</span></div><p className="mt-1 line-clamp-2 text-xs font-normal leading-5 text-muted-foreground">{item.context.map((segment) => segment.text).join(" ")}</p></div></Button>)}</CardContent></Card>{request && <RequestDetail key={request.id} request={request} busy={busy} act={(command) => mutate(command).catch((e: unknown) => setError(message(e)))} />}</section>
      </div>
    </div>
  </main>
}

function RequestDetail({ request, busy, act }: { request: FactoryRequest; busy: boolean; act: (command: Command) => Promise<void> }) {
  const [answer, setAnswer] = useState("")
  const state = request.state
  return <Card><CardHeader><CardTitle className="flex items-center gap-2">{state.kind === "ready" ? <Check className="size-4" /> : <GitBranch className="size-4" />}{labels[state.kind]}</CardTitle></CardHeader><CardContent className="space-y-4">
    {state.kind === "queued" && <p className="text-sm text-muted-foreground">The factory has captured the request and is waiting for the builder.</p>}
    {state.kind === "running" && <p className="flex items-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" />The builder is working in an isolated branch.</p>}
    {state.kind === "clarification" && <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); void act({ kind: "answer", requestId: request.id, answer }).then(() => setAnswer("")) }}><Label htmlFor="answer">{state.question}</Label><Textarea id="answer" required maxLength={12000} value={answer} onChange={(event) => setAnswer(event.target.value)} /><Button type="submit" disabled={busy || !answer.trim()}>Answer and continue<ArrowRight /></Button></form>}
    {state.kind === "failed" && <p role="alert" className="text-sm text-destructive">{state.reason}</p>}
    {state.kind === "cancelled" && <p className="text-sm text-muted-foreground">This request was cancelled. Its conversation is still saved.</p>}
    {state.kind === "ready" && <><p className="whitespace-pre-wrap text-sm leading-6">{state.summary}</p><p className="break-all rounded-lg bg-muted p-3 font-mono text-xs">{state.branch}</p><Badge variant={state.checks.exitCode === 0 ? "secondary" : "destructive"}>{state.checks.exitCode === 0 ? "Checks passed" : "Checks failed"}</Badge><details><summary className="cursor-pointer text-sm font-medium">View changes</summary><pre className="mt-3 max-h-96 overflow-auto rounded-lg bg-muted p-3 text-xs">{state.diff || "No diff was returned."}</pre></details><details><summary className="cursor-pointer text-sm font-medium">View check output</summary><pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-muted p-3 text-xs">{state.checks.output}</pre></details><p className="text-xs text-muted-foreground">Ready for human review. The factory has not merged or deployed this change.</p></>}
    <details><summary className="cursor-pointer text-sm text-muted-foreground">Conversation used for this request</summary><div className="mt-3 space-y-2">{request.context.map((segment) => <p key={segment.id} className="whitespace-pre-wrap text-sm leading-6"><span className="font-medium">{segment.speaker}.</span> {segment.text}</p>)}</div></details>
    {request.answers.map((item, index) => <div key={index} className="border-l-2 pl-3 text-sm"><p className="text-muted-foreground">{item.question}</p><p className="mt-1">{item.answer}</p></div>)}
    <div className="flex gap-2">{["queued", "running", "clarification"].includes(state.kind) && <Button variant="outline" size="sm" disabled={busy} onClick={() => void act({ kind: "cancel", requestId: request.id })}>Cancel request</Button>}{["failed", "cancelled"].includes(state.kind) && <Button variant="outline" size="sm" disabled={busy} onClick={() => void act({ kind: "retry", requestId: request.id })}>Retry request</Button>}</div>
  </CardContent></Card>
}
function message(error: unknown) { return error instanceof Error ? error.message : "Something went wrong. Please try again." }
