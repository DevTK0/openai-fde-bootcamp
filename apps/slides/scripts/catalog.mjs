import { build as bundle } from "esbuild"
import { mkdir, writeFile } from "node:fs/promises"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
const root = fileURLToPath(new URL("../", import.meta.url))
export async function writeCatalog(catalogPath) {
await mkdir(dirname(catalogPath), { recursive: true })
const result = await bundle({
  entryPoints: [root + "content/decks.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
})
const { decks } = await import(
  `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`
)
await writeFile(catalogPath, JSON.stringify(decks))
}
