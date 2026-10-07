"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Plus, Trash2, Upload } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  definitionSchema,
  type DatasetDefinition,
  type DatasetMutation,
} from "@/lib/dataset-records-schema"
import {
  importResultSchema,
  type ImportResult,
} from "@/lib/dataset-records-schema"
import { csvExport, type Row } from "@/lib/fleet"

export function downloadCsv(name: string, columns: string[], rows: Row[]) {
  const url = URL.createObjectURL(
    new Blob([csvExport(columns, rows)], { type: "text/csv;charset=utf-8" })
  )
  const link = document.createElement("a")
  link.href = url
  link.download = `${name}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
type EditorState =
  | { kind: "closed" }
  | { kind: "upload" }
  | { kind: "add" }
  | { kind: "remove"; recordId: number; row: Row }
export function useDatasetEditor(
  table: string,
  title: string,
  onSaved?: () => void
) {
  const router = useRouter()
  const [state, setState] = useState<EditorState>({ kind: "closed" })
  const [definition, setDefinition] = useState<DatasetDefinition>()
  const [fields, setFields] = useState<Record<string, string>>({})
  const [csv, setCsv] = useState("")
  const [preview, setPreview] = useState<ImportResult>()
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  async function open(next: EditorState) {
    setState(next)
    setDefinition(undefined)
    setError("")
    setPreview(undefined)
    setCsv("")
    setFields({})
    setMessage("")
    try {
      const response = await fetch(
        `/api/datasets?table=${encodeURIComponent(table)}`
      )
      if (!response.ok)
        throw new Error(
          "The dataset fields could not be loaded. Close this panel and try again."
        )
      setDefinition(definitionSchema.parse(await response.json()))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load fields.")
    }
  }
  async function submit(input: DatasetMutation) {
    setBusy(true)
    setError("")
    try {
      const response = await fetch("/api/datasets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      const body: unknown = await response.json()
      if (!response.ok)
        throw new Error(z.object({ error: z.string() }).parse(body).error)
      const result = importResultSchema.parse(body)
      if (!result.committed) {
        setPreview(result)
        return
      }
      setState({ kind: "closed" })
      setMessage(
        input.action === "remove"
          ? "Record removed."
          : `${result.count} new ${result.count === 1 ? "record added" : "records added"}.`
      )
      onSaved?.()
      router.refresh()
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "The change could not be saved."
      )
    } finally {
      setBusy(false)
    }
  }
  const actionTitle =
    state.kind === "remove"
      ? "Remove record"
      : state.kind === "add"
        ? "Add record"
        : "Upload new records"
  return {
    actions: (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void open({ kind: "upload" })}
        >
          <Upload />
          Upload new records
        </Button>
        <Button size="sm" onClick={() => void open({ kind: "add" })}>
          <Plus />
          Add record
        </Button>
      </>
    ),
    remove: (recordId: number | undefined, row: Row) =>
      recordId === undefined ? null : (
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Remove record ${String(row[Object.keys(row)[0] ?? ""] ?? recordId)}`}
          onClick={() => void open({ kind: "remove", recordId, row })}
        >
          <Trash2 />
          Remove
        </Button>
      ),
    feedback: message ? (
      <p role="status" className="text-sm text-primary">
        {message}
      </p>
    ) : null,
    panel: (
      <Sheet
        open={state.kind !== "closed"}
        onOpenChange={(open) => {
          if (!open && !busy) setState({ kind: "closed" })
        }}
      >
        <SheetContent
          className="w-full! overflow-y-auto sm:max-w-xl!"
          showCloseButton={!busy}
        >
          <SheetHeader>
            <SheetTitle>{actionTitle}</SheetTitle>
            <SheetDescription>{title}</SheetDescription>
          </SheetHeader>
          <div className="space-y-5 px-4 pb-6">
            {error && (
              <p
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              >
                {error}
              </p>
            )}
            {!definition && !error && (
              <p role="status">Loading dataset fields…</p>
            )}
            {definition && state.kind === "add" && (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  void submit({
                    action: "add",
                    table,
                    row: Object.fromEntries(
                      definition.fields.map((f) => [
                        f.name,
                        fields[f.name] ?? "",
                      ])
                    ),
                  })
                }}
              >
                <p className="text-sm text-muted-foreground">
                  Add one new record. Fields marked * are required. Existing
                  records are never replaced.
                </p>
                {definition.fields.map((field, i) => (
                  <div className="space-y-1.5" key={field.name}>
                    <Label htmlFor={`record-field-${i}`}>
                      {field.name.replaceAll("_", " ")}
                      {field.required ? " *" : ""}
                    </Label>
                    <Input
                      id={`record-field-${i}`}
                      required={field.required}
                      type={field.type === "TEXT" ? "text" : "number"}
                      step={field.type === "INTEGER" ? "1" : "any"}
                      value={fields[field.name] ?? ""}
                      onChange={(e) =>
                        setFields({ ...fields, [field.name]: e.target.value })
                      }
                      disabled={busy}
                    />
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button type="submit" disabled={busy}>
                    {busy ? "Saving…" : "Add record"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={busy}
                    onClick={() => setState({ kind: "closed" })}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
            {definition && state.kind === "upload" && (
              <>
                <p className="text-sm text-muted-foreground">
                  Append new records to {title}. Existing records stay
                  unchanged. Use unique record IDs and the columns in this
                  dataset’s template.
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    downloadCsv(
                      `${title}-template`,
                      definition.fields.map((f) => f.name),
                      []
                    )
                  }
                >
                  Download CSV template
                </Button>
                <div className="space-y-2">
                  <Label htmlFor="records-csv">CSV file</Label>
                  <Input
                    id="records-csv"
                    type="file"
                    accept=".csv,text/csv"
                    disabled={busy}
                    onChange={async (e) => {
                      setPreview(undefined)
                      setCsv("")
                      setError("")
                      const file = e.target.files?.[0]
                      if (!file) return
                      if (file.size > 2_000_000) {
                        setError("Maximum file size is 2 MB.")
                        return
                      }
                      try {
                        setCsv(await file.text())
                      } catch {
                        setError("The file could not be read.")
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    CSV · up to 1,000 records · maximum 2 MB
                  </p>
                </div>
                {preview && (
                  <div className="space-y-3">
                    <p role="status">
                      {preview.count} new{" "}
                      {preview.count === 1 ? "record" : "records"} ready to add.
                      Preview of the first {preview.sample.length}.
                    </p>
                    <div className="overflow-auto rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {preview.columns.map((c) => (
                              <TableHead key={c}>{c}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {preview.sample.map((row, i) => (
                            <TableRow key={i}>
                              {preview.columns.map((c) => (
                                <TableCell key={c}>
                                  {String(row[c] ?? "")}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    disabled={busy || !csv}
                    onClick={() =>
                      void submit({
                        action: "upload",
                        table,
                        csv,
                        commit: !!preview,
                      })
                    }
                  >
                    {busy
                      ? "Checking…"
                      : preview
                        ? `Add ${preview.count} new ${preview.count === 1 ? "record" : "records"}`
                        : "Review new records"}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={busy}
                    onClick={() => setState({ kind: "closed" })}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
            {definition && state.kind === "remove" && (
              <>
                <p>
                  Remove{" "}
                  <strong>
                    {definition.keys
                      .map((k) => String(state.row[k] ?? ""))
                      .join(" / ")}
                  </strong>{" "}
                  from {title}?
                </p>
                <p className="text-sm text-muted-foreground">
                  This deletes this record from the saved dataset and updates
                  the dashboard. Related records in other datasets stay
                  unchanged.
                </p>
                <dl className="space-y-2 rounded-md border p-3 text-sm">
                  {Object.entries(state.row).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-muted-foreground">
                        {key.replaceAll("_", " ")}
                      </dt>
                      <dd className="break-words">
                        {String(value ?? "Not supplied")}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    disabled={busy}
                    onClick={() =>
                      void submit({
                        action: "remove",
                        table,
                        recordId: state.recordId,
                        expected: state.row,
                      })
                    }
                  >
                    {busy ? "Removing…" : "Remove record"}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={busy}
                    onClick={() => setState({ kind: "closed" })}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    ),
  }
}
