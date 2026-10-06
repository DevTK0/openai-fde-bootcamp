import { writeCatalog } from "./catalog.mjs"
import { createEditorServer } from "../server/api.mjs"
import { createViteConfig } from "@open-slide/core/vite"
import { createServer } from "vite"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("../", import.meta.url))
const catalogPath = root + ".editor-data/catalog.json"
await writeCatalog(catalogPath)
const api = createEditorServer({ catalogPath, storePath: root + ".editor-data/edits" })
await new Promise((resolve) => api.listen(0, "127.0.0.1", resolve))

// Open Slide's default allow-list only covers the app itself. Include the
// monorepo so the shared @workspace/ui source and its dependencies can load.
const config = await createViteConfig({
  userCwd: fileURLToPath(new URL("../", import.meta.url)),
})
config.server = {
  ...config.server,
  host: "127.0.0.1",
  strictPort: true,
  proxy: { "/slides/api": `http://127.0.0.1:${api.address().port}` },
  fs: {
    ...config.server?.fs,
    allow: [
      ...(config.server?.fs?.allow ?? []),
      fileURLToPath(new URL("../../../", import.meta.url)),
    ],
  },
}
const server = await createServer(config)
server.watcher.on("change", async (path) => {
  if (path.includes("/content/")) await writeCatalog(catalogPath)
})
server.httpServer.on("close", () => api.close())
await server.listen()
server.printUrls()
