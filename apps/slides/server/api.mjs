import { createServer } from "node:http"
import { readFile, mkdir, writeFile, rename } from "node:fs/promises"
import { createHash } from "node:crypto"
import { join } from "node:path"

const fingerprint = (value) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex")
class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}
const object = (value) =>
  value && typeof value === "object" && !Array.isArray(value)
function validate(original, edited, path = "slide") {
  if (typeof original === "string") {
    if (typeof edited !== "string" || edited.length > 10000)
      throw new HttpError(400, `Invalid text at ${path}`)
    return
  }
  if (typeof original === "number") {
    if (path.endsWith(".count") && (!Number.isInteger(edited) || edited > 200))
      throw new HttpError(400, "Diagram count must be a whole number up to 200")
    if (path.endsWith(".waitingPercent") && edited > 100)
      throw new HttpError(400, "Percentage cannot exceed 100")
    if (
      typeof edited !== "number" ||
      !Number.isFinite(edited) ||
      edited < 0 ||
      edited > 1e12
    )
      throw new HttpError(400, `Invalid number at ${path}`)
    return
  }
  if (typeof original === "boolean") {
    if (typeof edited !== "boolean")
      throw new HttpError(400, `Invalid choice at ${path}`)
    return
  }
  if (Array.isArray(original)) {
    if (!Array.isArray(edited) || edited.length !== original.length)
      throw new HttpError(400, `Invalid rows at ${path}`)
    original.forEach((value, index) =>
      validate(value, edited[index], `${path}.${index}`)
    )
    return
  }
  if (!object(edited) || !object(original))
    throw new HttpError(400, `Invalid content at ${path}`)
  const extra = Object.keys(edited).filter(
    (key) => !Object.hasOwn(original, key)
  )
  if (extra.some((key) => path !== "slide" || key !== "diagramText"))
    throw new HttpError(400, "Unknown field")
  for (const [key, value] of Object.entries(original)) {
    if (
      ["kind", "layout", "icon", "connected", "sequential"].includes(key) &&
      edited[key] !== value
    )
      throw new HttpError(400, "Diagram type cannot change")
    validate(value, edited[key], `${path}.${key}`)
  }
  if (path === "slide" && edited.diagramText !== undefined) {
    if (
      !object(edited.diagramText) ||
      Object.keys(edited.diagramText).length > 150
    )
      throw new HttpError(400, "Invalid diagram labels")
    for (const [key, value] of Object.entries(edited.diagramText)) {
      if (
        ["__proto__", "constructor", "prototype"].includes(key) ||
        key.length > 2000 ||
        typeof value !== "string" ||
        value.length > 2000
      )
        throw new HttpError(400, "Invalid diagram label")
    }
  }
}
async function body(req) {
  let value = ""
  for await (const chunk of req) {
    value += chunk
    if (Buffer.byteLength(value) > 512000)
      throw new HttpError(413, "Changes are too large")
  }
  try {
    return JSON.parse(value)
  } catch {
    throw new HttpError(400, "Invalid JSON")
  }
}

export function createEditorServer({ catalogPath, storePath }) {
  let queue = Promise.resolve()
  async function readStore(id) {
    try {
      return JSON.parse(await readFile(join(storePath, `${id}.json`), "utf8"))
    } catch (error) {
      if (error.code === "ENOENT") return { revision: 0, edits: {} }
      throw error
    }
  }
  return createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json")
    res.setHeader("Cache-Control", "no-store")
    res.setHeader("X-Content-Type-Options", "nosniff")
    try {
      const url = new URL(req.url, "http://localhost")
      const match = /^\/slides\/api\/decks\/([a-z0-9-]+)$/.exec(url.pathname)
      if (!match) throw new HttpError(404, "Unknown deck")
      const catalog = JSON.parse(await readFile(catalogPath, "utf8"))
      const deck = catalog.find((item) => item.id === match[1])
      if (!deck) throw new HttpError(404, "Unknown deck")
      if (!["GET", "PUT"].includes(req.method))
        throw new HttpError(405, "Method not allowed")
      if (req.method === "PUT") {
        let origin
        try {
          origin = new URL(req.headers.origin)
        } catch {
          throw new HttpError(403, "Same-origin editor request required")
        }
        if (
          origin.host !== req.headers.host ||
          !["http:", "https:"].includes(origin.protocol)
        )
          throw new HttpError(403, "Same-origin editor request required")
        if (!req.headers["content-type"]?.startsWith("application/json"))
          throw new HttpError(415, "JSON required")
        const input = await body(req)
        if (!object(input)) throw new HttpError(400, "Invalid changes")
        const work = queue.then(async () => {
          const state = await readStore(deck.id)
          if (
            !Number.isInteger(input.revision) ||
            input.revision !== state.revision
          )
            throw new HttpError(
              409,
              "Someone else saved this deck. Reload saved changes before saving again."
            )
          if (
            !Array.isArray(input.updates) ||
            !input.updates.length ||
            input.updates.length > deck.slides.length
          )
            throw new HttpError(400, "Invalid changes")
          const seen = new Set()
          for (const update of input.updates) {
            if (
              !Number.isInteger(update.index) ||
              !deck.slides[update.index] ||
              seen.has(update.index)
            )
              throw new HttpError(400, "Invalid slide")
            seen.add(update.index)
            const original = deck.slides[update.index]
            const baseline = fingerprint(original)
            if (update.baseline !== baseline)
              throw new HttpError(
                409,
                "The published slide changed. Reload before editing it."
              )
            if (update.slide === null) delete state.edits[update.index]
            else {
              validate(original, update.slide)
              state.edits[update.index] = { baseline, slide: update.slide }
            }
          }
          state.revision += 1
          state.updatedAt = new Date().toISOString()
          await mkdir(storePath, { recursive: true })
          const target = join(storePath, `${deck.id}.json`)
          const temporary = `${target}.tmp`
          await writeFile(temporary, JSON.stringify(state, null, 2) + "\n", {
            mode: 0o600,
          })
          await rename(temporary, target)
        })
        queue = work.catch(() => {})
        await work
      }
      await queue
      const state = await readStore(deck.id)
      const stale = []
      const baselines = deck.slides.map(fingerprint)
      const slides = deck.slides.map((slide, index) => {
        const saved = state.edits[index]
        if (!saved) return slide
        if (saved.baseline !== baselines[index]) {
          stale.push(index)
          return slide
        }
        return saved.slide
      })
      res.end(
        JSON.stringify({
          revision: state.revision,
          slides,
          baselines,
          stale,
          updatedAt: state.updatedAt ?? null,
        })
      )
    } catch (error) {
      res.statusCode = error.status ?? 500
      res.end(
        JSON.stringify({
          error: error.status
            ? error.message
            : "Could not load or save slides. Please try again.",
        })
      )
    }
  })
}
