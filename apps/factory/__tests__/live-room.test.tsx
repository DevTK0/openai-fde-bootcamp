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

it.each([200, 401])(
  "retains the new session when an old restore returns %s late",
  async (status) => {
    const old = deferredResponse()
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>(async (_url, init) =>
        new Headers(init?.headers).get("Authorization") === "Bearer old-token"
          ? old.promise
          : Response.json(snapshot())
      )
    )
    sessionStorage.setItem("factory-access", "old-token")
    render(<LiveRoom />)
    fireEvent.change(screen.getByLabelText("Factory access token"), {
      target: { value: "new-token" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Connect to factory" }))
    await screen.findByRole("button", { name: "Start listening" })
    expect(sessionStorage.getItem("factory-access")).toBe("new-token")
    await act(async () =>
      old.resolve(
        Response.json(status === 200 ? snapshot(roomB) : { error: "Expired" }, {
          status,
        })
      )
    )
    expect(sessionStorage.getItem("factory-access")).toBe("new-token")
    expect(screen.queryByText("Existing Room B transcript")).toBeNull()
    fireEvent.change(
      screen.getByRole("textbox", { name: "Or add to the transcript" }),
      { target: { value: "Use the new session" } }
    )
    fireEvent.click(screen.getByRole("button", { name: "Add to conversation" }))
    await waitFor(() => {
      const post = vi
        .mocked(fetch)
        .mock.calls.find(([, init]) => init?.method === "POST")
      expect(new Headers(post?.[1]?.headers).get("Authorization")).toBe(
        "Bearer new-token"
      )
    })
  }
)
it.each([false, true])(
  "retains clarification across selection and clears on disconnect, failed save $0",
  async (failedSave) => {
    const request: Snapshot["requests"][number] = {
      id: "44444444-4444-4444-8444-444444444444",
      conversationId: roomA.id,
      triggerSegmentId: "55555555-5555-4555-8555-555555555555",
      context: [],
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
      attempt: 1,
      answers: [],
      state: { kind: "clarification", question: "Which report?" },
    }
    const data: Snapshot = {
      ...snapshot(),
      requests: [
        request,
        {
          ...request,
          id: "66666666-6666-4666-8666-666666666666",
          state: { kind: "queued" },
        },
      ],
    }
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>(async (_url, init) =>
        init?.method === "POST"
          ? Response.json({ error: "Unavailable" }, { status: 503 })
          : Response.json(data)
      )
    )
    await connect()
    fireEvent.click(screen.getByRole("button", { name: /Needs your input/ }))
    fireEvent.change(screen.getByRole("textbox", { name: "Which report?" }), {
      target: { value: "Preserve the monthly report" },
    })
    if (failedSave) {
      fireEvent.click(
        screen.getByRole("button", { name: "Answer and continue" })
      )
      await screen.findByRole("alert")
    }
    fireEvent.click(screen.getByRole("button", { name: /Queued/ }))
    fireEvent.click(screen.getByRole("button", { name: /Needs your input/ }))
    expect(
      screen.getByRole("textbox", { name: "Which report?" })
    ).toHaveProperty("value", "Preserve the monthly report")
    fireEvent.click(screen.getByRole("button", { name: "Disconnect" }))
    fireEvent.change(screen.getByLabelText("Factory access token"), {
      target: { value: "new-token" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Connect to factory" }))
    await screen.findByRole("button", { name: "Start listening" })
    fireEvent.click(screen.getByRole("button", { name: /Needs your input/ }))
    expect(
      screen.getByRole("textbox", { name: "Which report?" })
    ).toHaveProperty("value", "")
  }
)

for (const kind of ["segment", "create"]) {
  it(`keeps one ${kind} after restoring edits and retrying an uncertain save`, async () => {
    const save = deferredResponse()
    const ids: string[] = []
    const stored = new Set<string>()
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>(async (_url, init) => {
        if (init?.method === "POST") {
          const command = commandSchema.parse(JSON.parse(String(init.body)))
          if (command.kind !== "segment" && command.kind !== "create")
            throw new Error("Unexpected command")
          ids.push(command.id)
          stored.add(command.id)
          return ids.length === 1 ? save.promise : Response.json(snapshot())
        }
        return Response.json(snapshot())
      })
    )
    await connect()
    const input = screen.getByRole("textbox", {
      name:
        kind === "segment"
          ? "Or add to the transcript"
          : "New conversation name",
    })
    const submit = screen.getByRole("button", {
      name: kind === "segment" ? "Add to conversation" : "Create conversation",
    })
    const text = "I think we can get the software factory to do this"
    fireEvent.change(input, { target: { value: text } })
    fireEvent.click(submit)
    fireEvent.change(input, { target: { value: text + "!" } })
    fireEvent.change(input, { target: { value: text } })
    await act(async () =>
      save.resolve(
        Response.json({ error: "Response lost after save" }, { status: 503 })
      )
    )
    fireEvent.click(submit)
    await waitFor(() => expect(ids).toHaveLength(2))
    expect(stored.size).toBe(1)
    expect(ids[1]).toBe(ids[0])
  })
}

it("starts a later clarification with an empty draft after another client answers", async () => {
  const request: Snapshot["requests"][number] = {
    id: "44444444-4444-4444-8444-444444444444",
    conversationId: roomA.id,
    triggerSegmentId: "55555555-5555-4555-8555-555555555555",
    context: [],
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    attempt: 1,
    answers: [],
    state: { kind: "clarification", question: "Which report?" },
  }
  let current: Snapshot = {
    ...snapshot(),
    requests: [
      request,
      {
        ...request,
        id: "66666666-6666-4666-8666-666666666666",
        state: { kind: "queued" },
      },
    ],
  }
  vi.stubGlobal(
    "fetch",
    vi.fn<typeof fetch>(async () => Response.json(current))
  )
  await connect()
  fireEvent.click(screen.getByRole("button", { name: /Needs your input/ }))
  fireEvent.change(screen.getByRole("textbox", { name: "Which report?" }), {
    target: { value: "Monthly report" },
  })
  fireEvent.click(screen.getByRole("button", { name: /Queued/ }))
  current = {
    ...current,
    requests: current.requests.map((item) =>
      item.id === request.id
        ? {
            ...item,
            attempt: 2,
            answers: [{ question: "Which report?", answer: "Weekly report" }],
            state: { kind: "clarification", question: "Which region?" },
          }
        : item
    ),
  }
  await waitFor(
    () =>
      expect(
        screen.getByRole("button", { name: /Needs your input/ }).textContent
      ).toContain("Attempt 2"),
    { timeout: 4000 }
  )
  fireEvent.click(screen.getByRole("button", { name: /Needs your input/ }))
  expect(screen.getByRole("textbox", { name: "Which region?" })).toHaveProperty(
    "value",
    ""
  )
})
