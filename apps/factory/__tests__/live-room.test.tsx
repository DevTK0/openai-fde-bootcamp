// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"
import { LiveRoom } from "../components/live-room"
import { commandSchema, type Snapshot } from "../lib/contracts"
import { startTranscription } from "../lib/transcription"

vi.mock("../lib/transcription", () => ({
  startTranscription: vi.fn(async () => ({ stop: async () => {} })),
}))

const roomA = {
  id: "11111111-1111-4111-8111-111111111111",
  title: "Room A",
  createdAt: "2026-01-01",
}
const roomB = {
  id: "22222222-2222-4222-8222-222222222222",
  title: "Room B",
  createdAt: "2026-01-01",
}
function snapshot(room = roomA): Snapshot {
  return {
    conversations: [roomA, roomB],
    conversation: room,
    segments:
      room === roomB
        ? [
            {
              id: "33333333-3333-4333-8333-333333333333",
              conversationId: room.id,
              speaker: "Employee",
              text: "Existing Room B transcript",
              createdAt: "2026-01-01",
            },
          ]
        : [],
    requests: [],
    configuration: { worker: "offline", reason: null },
  }
}
function deferredResponse() {
  let resolve: (response: Response) => void = () => {
    throw new Error("Response is not initialized")
  }
  const promise = new Promise<Response>((done) => {
    resolve = done
  })
  return { promise, resolve }
}
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  sessionStorage.clear()
  vi.clearAllMocks()
})
async function connect() {
  sessionStorage.setItem("factory-access", "fixture-token")
  render(<LiveRoom />)
  await screen.findByRole("button", { name: "Start listening" })
}
it("preserves new transcript edits when a previous save finishes", async () => {
  const save = deferredResponse()
  vi.stubGlobal(
    "fetch",
    vi.fn<typeof fetch>(async (_url, init) =>
      init?.method === "POST" ? save.promise : Response.json(snapshot())
    )
  )
  await connect()
  const draft = screen.getByRole("textbox", {
    name: "Or add to the transcript",
  })
  fireEvent.change(draft, { target: { value: "First turn" } })
  fireEvent.click(screen.getByRole("button", { name: "Add to conversation" }))
  fireEvent.change(draft, { target: { value: "Second turn, still writing" } })
  await act(async () => save.resolve(Response.json(snapshot())))
  expect(draft).toHaveProperty("value", "Second turn, still writing")
  expect(
    screen.getByRole("button", { name: "Add to conversation" })
  ).toHaveProperty("disabled", false)
})
it("waits for the selected room before capturing speech", async () => {
  const room = deferredResponse()
  vi.stubGlobal(
    "fetch",
    vi.fn<typeof fetch>(async (url, init) =>
      init?.method === "POST"
        ? Response.json(snapshot(roomB))
        : String(url).includes("conversationId=")
          ? room.promise
          : Response.json(snapshot())
    )
  )
  await connect()
  fireEvent.click(screen.getByRole("button", { name: "Room B" }))
  const start = screen.getByRole("button", { name: "Start listening" })
  expect(start).toHaveProperty("disabled", true)
  fireEvent.click(start)
  expect(startTranscription).not.toHaveBeenCalled()
  await act(async () => room.resolve(Response.json(snapshot(roomB))))
  expect(screen.getByText("Existing Room B transcript")).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: "Start listening" }))
  await screen.findByRole("button", { name: "Stop listening" })
  const options = vi.mocked(startTranscription).mock.calls.at(0)?.[0]
  if (!options) throw new Error("Microphone did not start")
  await act(async () =>
    options.onFinal({ id: "provider-turn", text: "Request for visible Room B" })
  )
  await waitFor(() => {
    const post = vi
      .mocked(fetch)
      .mock.calls.find(([, init]) => init?.method === "POST")
    expect(
      commandSchema.parse(JSON.parse(String(post?.[1]?.body)))
    ).toMatchObject({
      kind: "segment",
      conversationId: roomB.id,
      text: "Request for visible Room B",
    })
  })
})
it("preserves a newly typed conversation name while creation finishes", async () => {
  const save = deferredResponse()
  vi.stubGlobal(
    "fetch",
    vi.fn<typeof fetch>(async (_url, init) =>
      init?.method === "POST" ? save.promise : Response.json(snapshot())
    )
  )
  await connect()
  const title = screen.getByRole("textbox", { name: "New conversation name" })
  fireEvent.change(title, { target: { value: "First room" } })
  fireEvent.click(screen.getByRole("button", { name: "Create conversation" }))
  fireEvent.change(title, { target: { value: "Next room" } })
  await act(async () => save.resolve(Response.json(snapshot())))
  expect(title).toHaveProperty("value", "Next room")
})
it("keeps the loaded room usable after a room selection fails", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn<typeof fetch>(async (url) =>
      String(url).includes("conversationId=")
        ? Response.json({ error: "Room unavailable" }, { status: 503 })
        : Response.json(snapshot())
    )
  )
  await connect()
  fireEvent.click(screen.getByRole("button", { name: "Room B" }))
  await screen.findByRole("alert")
  const start = screen.getByRole("button", { name: "Start listening" })
  await waitFor(() => expect(start).toHaveProperty("disabled", false))
  fireEvent.click(start)
  await screen.findByRole("button", { name: "Stop listening" })
  const options = vi.mocked(startTranscription).mock.calls.at(0)?.[0]
  if (!options) throw new Error("Microphone did not start")
  await act(async () =>
    options.onFinal({ id: "provider-turn", text: "Still in Room A" })
  )
  await waitFor(() => {
    const post = vi
      .mocked(fetch)
      .mock.calls.find(([, init]) => init?.method === "POST")
    expect(
      commandSchema.parse(JSON.parse(String(post?.[1]?.body)))
    ).toMatchObject({ conversationId: roomA.id, text: "Still in Room A" })
  })
})
it("clears the submitted transcript when it has not been edited", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn<typeof fetch>(async () => Response.json(snapshot()))
  )
  await connect()
  const draft = screen.getByRole("textbox", {
    name: "Or add to the transcript",
  })
  fireEvent.change(draft, { target: { value: "Saved turn" } })
  fireEvent.click(screen.getByRole("button", { name: "Add to conversation" }))
  await waitFor(() => expect(draft).toHaveProperty("value", ""))
})
it("preserves clarification edits made during a pending answer save", async () => {
  const save = deferredResponse()
  const room: Snapshot = {
    ...snapshot(),
    requests: [
      {
        id: "44444444-4444-4444-8444-444444444444",
        conversationId: roomA.id,
        triggerSegmentId: "55555555-5555-4555-8555-555555555555",
        context: [],
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
        attempt: 1,
        answers: [],
        state: { kind: "clarification", question: "Which report?" },
      },
    ],
  }
  vi.stubGlobal(
    "fetch",
    vi.fn<typeof fetch>(async (_url, init) =>
      init?.method === "POST" ? save.promise : Response.json(room)
    )
  )
  await connect()
  const answer = screen.getByRole("textbox", { name: "Which report?" })
  fireEvent.change(answer, { target: { value: "Weekly report" } })
  fireEvent.click(screen.getByRole("button", { name: "Answer and continue" }))
  fireEvent.change(answer, { target: { value: "Monthly report too" } })
  await act(async () => save.resolve(Response.json(room)))
  expect(answer).toHaveProperty("value", "Monthly report too")
})
