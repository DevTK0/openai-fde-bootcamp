import { afterEach, describe, expect, it } from "vitest"
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { createEditorServer } from "./api.mjs"
const cleanups = []
afterEach(async () => {
  for (const cleanup of cleanups.splice(0).reverse()) await cleanup()
})
async function setup() {
  const dir = await mkdtemp(join(tmpdir(), "slide-editor-test-"))
  cleanups.push(() => rm(dir, { recursive: true, force: true }))
  const catalogPath = join(dir, "catalog.json")
  const storePath = join(dir, "saved")
  const original = {
    title: "Original",
    caption: "Caption",
    notes: "Notes",
    source: "Records",
    stage: "Evidence",
    visual: {
      kind: "bars",
      unit: "Dollars",
      rows: [{ label: "Repair", value: 10, display: "10", concern: false }],
    },
  }
  await writeFile(
    catalogPath,
    JSON.stringify([{ id: "sample", slides: [original] }])
  )
  async function start() {
    const server = createEditorServer({ catalogPath, storePath })
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
    const origin = `http://127.0.0.1:${server.address().port}`
    const stop = () =>
      new Promise((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve()))
      )
    cleanups.push(stop)
    return { origin, stop }
  }
  const connection = await start()
  const call = async (input, origin = connection.origin) => {
    const response = await fetch(
      `${connection.origin}/slides/api/decks/sample`,
      input === undefined
        ? {}
        : {
            method: "PUT",
            headers: { "Content-Type": "application/json", Origin: origin },
            body: JSON.stringify(input),
          }
    )
    return { status: response.status, data: await response.json() }
  }
  return { ...connection, call, start, original, catalogPath, storePath }
}
function update(state, slide) {
  return {
    revision: state.revision,
    updates: [{ index: 0, baseline: state.baselines[0], slide }],
  }
}
describe("persistent slide editor", () => {
  it("persists text, diagram labels and numeric data across a server restart", async () => {
    const api = await setup()
    const state = (await api.call()).data
    const changed = structuredClone(api.original)
    changed.title = "Saved headline"
    changed.visual.rows[0].value = 25
    changed.diagramText = { Repair: "Repair bills" }
    expect((await api.call(update(state, changed))).status).toBe(200)
    await api.stop()
    cleanups.pop()
    const restarted = await api.start()
    const response = await fetch(`${restarted.origin}/slides/api/decks/sample`)
    const saved = await response.json()
    expect(saved.slides[0]).toEqual(changed)
    expect(saved.revision).toBe(1)
  })
  it("rejects stale concurrent saves instead of overwriting another editor", async () => {
    const api = await setup(),
      state = (await api.call()).data
    const results = await Promise.all([
      api.call(update(state, { ...api.original, title: "First" })),
      api.call(update(state, { ...api.original, title: "Second" })),
    ])
    expect(results.map((result) => result.status).sort()).toEqual([200, 409])
    expect((await api.call()).data.revision).toBe(1)
  })
  it("rejects foreign origins, invalid data and unknown deck paths", async () => {
    const api = await setup(),
      state = (await api.call()).data
    expect(
      (await api.call(update(state, api.original), "https://another.example"))
        .status
    ).toBe(403)
    const bad = structuredClone(api.original)
    bad.visual.rows[0].value = -1
    expect((await api.call(update(state, bad))).status).toBe(400)
    expect(
      (await api.call(update(state, { ...api.original, file: "/tmp/x" })))
        .status
    ).toBe(400)
    expect((await fetch(`${api.origin}/slides/api/decks/unknown`)).status).toBe(
      404
    )
    expect((await api.call()).data.revision).toBe(0)
  })
  it("resets only the requested saved slide to its original content", async () => {
    const api = await setup(),
      state = (await api.call()).data
    const saved = (
      await api.call(update(state, { ...api.original, title: "Edited" }))
    ).data
    const reset = await api.call(update(saved, null))
    expect(reset.data.slides[0]).toEqual(api.original)
    expect(reset.data.revision).toBe(2)
  })
  it("flags source changes without applying old edits to a different source slide", async () => {
    const api = await setup(),
      state = (await api.call()).data
    await api.call(update(state, { ...api.original, title: "User edit" }))
    await writeFile(
      api.catalogPath,
      JSON.stringify([
        { id: "sample", slides: [{ ...api.original, title: "New source" }] },
      ])
    )
    const refreshed = await api.call()
    expect(refreshed.data.stale).toEqual([0])
    expect(refreshed.data.slides[0].title).toBe("New source")
    expect(
      JSON.parse(await readFile(join(api.storePath, "sample.json"), "utf8"))
        .edits[0].slide.title
    ).toBe("User edit")
    expect(
      (await api.call({ ...update(state, api.original), revision: 1 })).status
    ).toBe(409)
  })
})
