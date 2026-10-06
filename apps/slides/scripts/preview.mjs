import { preview } from "vite"
import { fileURLToPath } from "node:url"
import { createEditorServer } from "../server/api.mjs"
const root = fileURLToPath(new URL("../", import.meta.url))
const api = createEditorServer({
  catalogPath: root + "dist/editor-catalog.json",
  storePath: root + ".editor-data/edits",
})
await new Promise((resolve) => api.listen(0, "127.0.0.1", resolve))
const server = await preview({
  configFile: false,
  root,
  base: "/slides/",
  preview: {
    host: "127.0.0.1",
    port: 3001,
    strictPort: true,
    proxy: { "/slides/api": `http://127.0.0.1:${api.address().port}` },
  },
})
server.httpServer.on("close", () => api.close())
server.printUrls()
