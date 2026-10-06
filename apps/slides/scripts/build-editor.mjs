import { writeCatalog } from "./catalog.mjs"
import { build as viteBuild } from "vite"
import tailwindcss from "@tailwindcss/vite"
import { readFile, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
const root = fileURLToPath(new URL("../", import.meta.url))
await writeCatalog(root + "dist/editor-catalog.json")
await viteBuild({
  configFile: false,
  plugins: [tailwindcss()],
  root,
  base: "/slides/",
  publicDir: false,
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: { input: root + "editor/index.html" },
  },
})
const editorHtml = await readFile(root + "dist/editor/index.html", "utf8")
const tags = [
  ...editorHtml.matchAll(
    /<script\b[^>]*src=[^>]+><\/script>|<link\b[^>]*rel="stylesheet"[^>]*>/g
  ),
]
  .map((match) => match[0])
  .join("\n")
const indexPath = root + "dist/index.html"
await writeFile(
  indexPath,
  (await readFile(indexPath, "utf8")).replace("</head>", tags + "\n</head>")
)
