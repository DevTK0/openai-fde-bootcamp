import { afterEach, beforeEach, expect, it, vi } from "vitest"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { FieldnotesApp } from "@/components/fieldnotes/fieldnotes-app"
import { chatSchema, initialSpecification } from "@/lib/fieldnotes/schema"

const chat = chatSchema.parse({
  id: "00000000-0000-4000-8000-000000000001",
  name: "Presentation 1",
  createdAt: "2026-10-07T00:00:00Z",
  endedAt: null,
  revision: 0,
  specRevision: 0,
  specification: initialSpecification,
  events: [],
})
let appendStatus = 500
let ended = false
let appended: unknown[] = []
beforeEach(() => {
  localStorage.clear()
  appendStatus = 500
  ended = false
  appended = []
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }))
  HTMLElement.prototype.scrollIntoView = vi.fn()
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url: string, init?: RequestInit) => {
      if (!init?.body)
        return Response.json(String(_url).includes("?id=") ? chat : [chat])
      const command = JSON.parse(String(init.body))
      if (command.kind === "append") {
        if (appendStatus !== 200)
          return Response.json(
            { error: "Cannot save these notes." },
            { status: appendStatus }
          )
        appended = command.events
        return Response.json({
          ...chat,
          revision: 1,
          specRevision: 1,
          events: command.events,
        })
      }
      if (command.kind === "end") {
        ended = true
        return Response.json({ ...chat, endedAt: "2026-10-07T01:00:00Z" })
      }
      throw new Error(`Unexpected command ${command.kind}`)
    })
  )
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  localStorage.clear()
})
async function enterNote() {
  render(<FieldnotesApp />)
  fireEvent.click(await screen.findByRole("button", { name: "Presentation 1" }))
  const input = await screen.findByRole("textbox", { name: "Clarification" })
  fireEvent.change(input, { target: { value: "Import supports UTF-8." } })
  fireEvent.click(screen.getByRole("button", { name: "Send clarification" }))
  await screen.findByText("Cannot save these notes.")
}
it("recovers unsaved notes after remount and removes recovery data only after a successful save", async () => {
  await enterNote()
  cleanup()
  appendStatus = 200
  render(<FieldnotesApp />)
  await screen.findByText("Import supports UTF-8.")
  fireEvent.click(screen.getByRole("button", { name: "Update specification" }))
  await waitFor(() =>
    expect(appended).toEqual([
      {
        kind: "clarification",
        id: expect.any(String),
        text: "Import supports UTF-8.",
      },
    ])
  )
  await waitFor(() =>
    expect(
      Object.keys(localStorage).filter((key) =>
        key.startsWith("fieldnotes:outbox:")
      )
    ).toEqual([])
  )
})
it.each([409, 413])(
  "retains rejected notes for download and permits ending after HTTP %s",
  async (status) => {
    appendStatus = status
    await enterNote()
    expect(
      screen.getByRole("button", { name: "Download unsaved notes" })
    ).toBeEnabled()
    expect(screen.getByRole("button", { name: "New chat" })).toBeEnabled()
    fireEvent.click(screen.getByRole("button", { name: "End conversation" }))
    const dialog = await screen.findByRole("alertdialog")
    fireEvent.click(
      within(dialog).getByRole("button", { name: "End conversation" })
    )
    await waitFor(() => expect(ended).toBe(true))
    cleanup()
    render(<FieldnotesApp />)
    fireEvent.click(
      await screen.findByRole("button", { name: "Presentation 1" })
    )
    expect(
      await screen.findByRole("button", { name: "Download unsaved notes" })
    ).toBeEnabled()
  }
)
