import { useEffect, useRef, useState, type ReactNode } from "react"
import { createRoot } from "react-dom/client"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/select"
import {
  Pencil,
  Save,
  RotateCcw,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { decks, type Slide } from "../content/decks"
import { SlideCanvas } from "../components/deck"
import { save, type SavedDeck } from "./store"
import "../components/deck.css"

const names: Record<string, string> = {
  rows: "Chart rows",
  value: "Value",
  display: "Displayed value",
  label: "Label",
  unit: "Units",
  threshold: "Reference line value",
  thresholdLabel: "Reference line label",
  concern: "Highlight",
  steps: "Diagram steps",
  items: "Diagram items",
  count: "Number shown",
  waitingPercent: "Stops leaving a queue (%)",
  demand: "People needing a ride",
  seats: "Bus places",
  terms: "Calculation terms",
  lines: "Text lines",
  operator: "Calculation sign",
  observed: "What is recorded",
  missing: "Records needed",
  conclusion: "Conclusion",
  text: "Quotation",
  attribution: "Attribution",
  join: "Join",
  blocked: "Blocked connection",
  detail: "Detail",
  values: "Values",
  labels: "Labels",
}
const protectedFields = new Set([
  "kind",
  "layout",
  "icon",
  "connected",
  "sequential",
])
function Fields({
  value,
  path = [],
  change,
}: {
  value: unknown
  path?: (string | number)[]
  change: (path: (string | number)[], value: string | number | boolean) => void
}): ReactNode {
  if (Array.isArray(value))
    return (
      <div className="space-y-5">
        {value.map((item, index) => (
          <fieldset
            key={index}
            className="space-y-3 border-l border-border pl-3"
          >
            <legend className="mb-2 text-xs font-medium text-muted-foreground">
              Item {index + 1}
            </legend>
            <Fields value={item} path={[...path, index]} change={change} />
          </fieldset>
        ))}
      </div>
    )
  if (value && typeof value === "object")
    return (
      <div className="space-y-4">
        {Object.entries(value)
          .filter(([key]) => !protectedFields.has(key))
          .map(([key, item]) => (
            <div key={key} className="space-y-2">
              <p className="text-sm font-medium">{names[key] ?? key}</p>
              <Fields value={item} path={[...path, key]} change={change} />
            </div>
          ))}
      </div>
    )
  const id = `field-${path.join("-")}`
  const label =
    path
      .map((key) =>
        typeof key === "number" ? String(key + 1) : (names[key] ?? key)
      )
      .join(" · ") || "Text"
  if (typeof value === "boolean")
    return (
      <Checkbox
        aria-label={label}
        checked={value}
        onCheckedChange={(checked) => change(path, !!checked)}
      />
    )
  if (typeof value === "number")
    return (
      <Input
        id={id}
        aria-label={label}
        type="number"
        min={0}
        step="any"
        value={value}
        onChange={(event) => {
          if (event.target.value !== "")
            change(path, Number(event.target.value))
        }}
      />
    )
  if (typeof value === "string")
    return (
      <Input
        id={id}
        aria-label={label}
        value={value}
        onChange={(event) => change(path, event.target.value)}
      />
    )
  return null
}
function Editor() {
  const query = new URLSearchParams(window.location.search)
  const deck = decks.find((item) => item.id === query.get("deck")) ?? decks[0]!
  const [index, setIndex] = useState(
    Math.max(
      0,
      Math.min(deck.slides.length - 1, (Number(query.get("page")) || 1) - 1)
    )
  )
  const [base, setBase] = useState<SavedDeck | null>(null)
  const [drafts, setDrafts] = useState<Record<number, Slide>>({})
  const [resets, setResets] = useState<Set<number>>(new Set())
  const [status, setStatus] = useState("Loading saved slides…")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [tab, setTab] = useState("text")
  const [labels, setLabels] = useState<string[]>([])
  const preview = useRef<HTMLDivElement>(null)
  const dirty = Object.keys(drafts).length > 0
  const loadSaved = async () => {
    setBusy(true)
    setError("")
    try {
      const response = await fetch(`/slides/api/decks/${deck.id}`, {
        cache: "no-store",
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setBase(data)
      setDrafts({})
      setResets(new Set())
      setStatus("All changes saved")
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Could not load slides"
      )
    } finally {
      setBusy(false)
    }
  }
  useEffect(() => {
    void loadSaved()
  }, [deck.id]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault()
        event.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [dirty])
  const slide = drafts[index] ?? base?.slides[index] ?? deck.slides[index]!
  const update = (next: Slide) => {
    setDrafts((current) => ({ ...current, [index]: next }))
    setResets((current) => {
      const next = new Set(current)
      next.delete(index)
      return next
    })
    setStatus("Unsaved changes")
    setError("")
  }
  const move = (next: number) => {
    setIndex(next)
    setLabels([])
    setTab("text")
    const url = new URL(window.location.href)
    url.searchParams.set("page", String(next + 1))
    history.replaceState(null, "", url)
  }
  const saveChanges = async () => {
    if (!base) return
    setBusy(true)
    setError("")
    try {
      const result = await save(
        deck.id,
        base.revision,
        Object.entries(drafts).map(([key, value]) => ({
          index: Number(key),
          baseline: base.baselines[Number(key)]!,
          slide: resets.has(Number(key)) ? null : value,
        }))
      )
      setBase(result)
      setDrafts({})
      setResets(new Set())
      setStatus("All changes saved")
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Could not save changes"
      )
    } finally {
      setBusy(false)
    }
  }
  const diagramChange = (
    path: (string | number)[],
    value: string | number | boolean
  ) => {
    if (
      typeof value === "number" &&
      (!Number.isFinite(value) || value < 0 || value > 1e12)
    )
      return
    if (
      path.at(-1) === "count" &&
      typeof value === "number" &&
      (!Number.isInteger(value) || value > 200)
    )
      return
    if (
      path.at(-1) === "waitingPercent" &&
      typeof value === "number" &&
      value > 100
    )
      return
    const next = structuredClone(slide)
    let target: unknown = next.visual
    for (const key of path.slice(0, -1))
      target = (target as Record<string | number, unknown>)[key]
    ;(target as Record<string | number, unknown>)[path.at(-1)!] = value
    update(next)
  }
  const captureLabels = () =>
    setLabels([
      ...new Set(
        [...preview.current!.querySelectorAll("text[data-original-text]")]
          .map((node) => node.getAttribute("data-original-text")!)
          .filter(Boolean)
      ),
    ])
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3">
        <Button
          variant="ghost"
          size="sm"
          render={<a href={`/slides/s/${deck.id}?p=${index + 1}`} />}
        >
          <ArrowLeft />
          View deck
        </Button>
        <Select
          value={deck.id}
          onValueChange={(id) => {
            if (id)
              window.location.href = `/slides/editor/?deck=${encodeURIComponent(id)}`
          }}
        >
          <SelectTrigger aria-label="Choose deck" className="max-w-96">
            <SelectValue>{deck.title}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {decks.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span role="status" className="ml-auto text-sm text-muted-foreground">
          {status}
        </span>
        <Button disabled={!dirty || busy || !base} onClick={saveChanges}>
          <Save />
          Save changes
        </Button>
      </header>
      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-4 border-b border-destructive bg-destructive/10 px-5 py-3 text-sm"
        >
          <span>{error}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={loadSaved}
            disabled={busy}
          >
            {dirty ? "Discard changes & reload" : "Retry"}
          </Button>
        </div>
      )}
      {!!base?.stale.length && (
        <p role="alert" className="border-b border-border px-5 py-3 text-sm">
          The published source changed for slides{" "}
          {base.stale.map((i) => i + 1).join(", ")}. Those pages show the
          updated source; older edits have been retained on the server for
          recovery.
        </p>
      )}
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[180px_minmax(0,1fr)_340px]">
        <nav
          aria-label="Slides"
          className="max-h-[calc(100vh-70px)] overflow-y-auto border-r border-border p-3"
        >
          {deck.slides.map((original, i) => (
            <Button
              key={i}
              variant={i === index ? "secondary" : "ghost"}
              aria-current={i === index ? "page" : undefined}
              onClick={() => move(i)}
              className="mb-2 h-auto w-full justify-start gap-2 px-2 py-3 text-left whitespace-normal"
            >
              <span className="text-muted-foreground">{i + 1}</span>
              <span className="line-clamp-3 text-xs">
                {drafts[i]?.title ?? base?.slides[i]?.title ?? original.title}
                {drafts[i] ? " •" : ""}
              </span>
            </Button>
          ))}
        </nav>
        <main className="flex min-w-0 flex-col gap-5 p-6">
          <div className="flex items-center justify-between text-sm">
            <h1 className="font-medium">
              Slide {index + 1} of {deck.slides.length}
            </h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Previous slide"
                disabled={!index}
                onClick={() => move(index - 1)}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Next slide"
                disabled={index === deck.slides.length - 1}
                onClick={() => move(index + 1)}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
          <div
            ref={preview}
            className="overflow-hidden rounded-lg border border-border bg-background shadow-lg"
          >
            <svg
              viewBox="0 0 1920 1080"
              className="aspect-video w-full"
              role="img"
              aria-label="Live slide preview"
            >
              <foreignObject width="1920" height="1080">
                <SlideCanvas deck={deck} slide={slide} index={index} />
              </foreignObject>
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">
            Changes appear in the preview immediately. Save to update the
            presentation for everyone.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!dirty || busy}
              onClick={() => {
                setDrafts({})
                setResets(new Set())
                setStatus("All changes saved")
                setError("")
              }}
            >
              Discard unsaved changes
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!base || busy}
              onClick={() => {
                setDrafts((current) => ({
                  ...current,
                  [index]: structuredClone(deck.slides[index]!),
                }))
                setResets((current) => new Set([...current, index]))
                setStatus("Reset ready to save")
              }}
            >
              <RotateCcw />
              Reset this slide to original
            </Button>
          </div>
        </main>
        <aside
          aria-label="Edit slide"
          className="max-h-[calc(100vh-70px)] overflow-y-auto border-l border-border p-4"
        >
          <Tabs
            value={tab}
            onValueChange={(value) => {
              setTab(String(value))
              if (value === "labels") captureLabels()
            }}
          >
            <TabsList className="w-full">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="data">Chart</TabsTrigger>
              <TabsTrigger value="labels">Labels</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="space-y-5 pt-4">
              {(
                [
                  ["title", "Headline"],
                  ["caption", "Caption"],
                  ["stage", "Section"],
                  ["source", "Source"],
                  ["notes", "Presenter notes"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{label}</Label>
                  <Textarea
                    id={key}
                    value={slide[key]}
                    disabled={!base || busy}
                    rows={key === "notes" ? 7 : 3}
                    onChange={(event) =>
                      update({ ...slide, [key]: event.target.value })
                    }
                  />
                </div>
              ))}
            </TabsContent>
            <TabsContent value="data" className="space-y-5 pt-4">
              <p className="text-xs text-muted-foreground">
                Change chart values here to resize bars and update diagrams.
                Review displayed values and headlines when changing numbers.
              </p>
              <fieldset disabled={!base || busy}>
                <Fields value={slide.visual} change={diagramChange} />
              </fieldset>
            </TabsContent>
            <TabsContent value="labels" className="space-y-4 pt-4">
              <p className="text-xs text-muted-foreground">
                Edit wording inside the diagram. Label edits do not change chart
                values.
              </p>
              {!labels.length && (
                <p className="text-sm text-muted-foreground">
                  This slide has no diagram labels. Use the Text tab.
                </p>
              )}
              {labels.map((original, i) => (
                <div key={original} className="space-y-2">
                  <Label
                    htmlFor={`label-${i}`}
                    className="text-xs text-muted-foreground"
                  >
                    {original}
                  </Label>
                  <Input
                    id={`label-${i}`}
                    disabled={!base || busy}
                    value={slide.diagramText?.[original] ?? original}
                    onChange={(event) =>
                      update({
                        ...slide,
                        diagramText: {
                          ...slide.diagramText,
                          [original]: event.target.value,
                        },
                      })
                    }
                  />
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  )
}
function Launcher() {
  const [url, setUrl] = useState(window.location.href)
  const [visible, setVisible] = useState(!document.fullscreenElement)
  useEffect(() => {
    const update = () => {
      setUrl(window.location.href)
      setVisible(!document.fullscreenElement)
    }
    const interval = window.setInterval(update, 500)
    document.addEventListener("fullscreenchange", update)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener("fullscreenchange", update)
    }
  }, [])
  const current = new URL(url)
  const match = /^\/slides\/s\/([a-z0-9-]+)$/.exec(current.pathname)
  if (!match || !visible) return null
  return (
    <div
      data-osd-interactive
      className="fixed right-4 bottom-4 z-40 print:hidden"
    >
      <Button
        render={
          <a
            href={`/slides/editor/?deck=${match[1]}&page=${current.searchParams.get("p") ?? "1"}`}
          />
        }
      >
        <Pencil />
        Edit deck
      </Button>
    </div>
  )
}
if (window.location.pathname.startsWith("/slides/editor/"))
  createRoot(document.getElementById("slide-editor")!).render(<Editor />)
else {
  const host = document.createElement("div")
  host.id = "slide-editor-launcher"
  document.body.append(host)
  createRoot(host).render(<Launcher />)
}
