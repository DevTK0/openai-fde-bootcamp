import { createHash, randomUUID } from "node:crypto"
import {
  mkdir,
  readFile,
  readdir,
  stat,
  writeFile,
  link,
  unlink,
} from "node:fs/promises"
import { join } from "node:path"
import { bundleSchema, revisionIdSchema, type DatasetBundle } from "./schema"

export function dataDirectory() {
  return (
    process.env.EVIDENCE_DATA_DIR || join(process.cwd(), "data", "evidence")
  )
}
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`
  if (value !== null && typeof value === "object")
    return `{${Object.entries(value)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`)
      .join(",")}}`
  return JSON.stringify(value)
}
export function contentId(bundle: DatasetBundle) {
  return createHash("sha256").update(canonical(bundle)).digest("hex")
}
export function summary(
  id: string,
  bundle: DatasetBundle,
  createdAt: string,
  seed = false
) {
  return {
    id,
    name: bundle.name,
    description: bundle.description,
    createdAt,
    seed,
    tableCount: bundle.tables.length,
    rowCount: bundle.tables.reduce((n, t) => n + t.rows.length, 0),
  }
}
export async function saveBundle(input: unknown, directory = dataDirectory()) {
  const bundle = bundleSchema.parse(input),
    id = contentId(bundle)
  await mkdir(directory, { recursive: true })
  const target = join(directory, `${id}.json`),
    temp = join(directory, `.${randomUUID()}.tmp`)
  await writeFile(temp, canonical(bundle), { flag: "wx", mode: 0o600 })
  let created = true
  try {
    await link(temp, target)
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "EEXIST")
      created = false
    else throw error
  } finally {
    await unlink(temp)
  }
  const info = await stat(target)
  return { revision: summary(id, bundle, info.mtime.toISOString()), created }
}
export async function loadBundle(id: string, directory = dataDirectory()) {
  revisionIdSchema.parse(id)
  const bundle = bundleSchema.parse(
    JSON.parse(await readFile(join(directory, `${id}.json`), "utf8"))
  )
  if (contentId(bundle) !== id)
    throw new Error("Revision integrity check failed")
  return bundle
}
const summaryCache = new Map<
  string,
  { fingerprint: string; value: ReturnType<typeof summary> }
>()
export async function listBundles(directory = dataDirectory()) {
  await mkdir(directory, { recursive: true })
  const files = (await readdir(directory)).filter((f) =>
    /^[a-f0-9]{64}\.json$/.test(f)
  )
  const revisions: ReturnType<typeof summary>[] = []
  const unavailableRevisions: string[] = []
  for (const file of files) {
    const id = file.slice(0, -5),
      path = join(directory, file)
    try {
      const info = await stat(path)
      const fingerprint = `${info.ino}:${info.size}:${info.mtimeMs}:${info.ctimeMs}`
      const cached = summaryCache.get(path)
      if (cached?.fingerprint === fingerprint) revisions.push(cached.value)
      else {
        const bundle = await loadBundle(id, directory)
        const value = summary(id, bundle, info.mtime.toISOString())
        if (summaryCache.size >= 1000) summaryCache.clear()
        summaryCache.set(path, { fingerprint, value })
        revisions.push(value)
      }
    } catch {
      summaryCache.delete(path)
      unavailableRevisions.push(id)
    }
  }
  return {
    revisions: revisions.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    unavailableRevisions,
  }
}
