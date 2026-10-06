import { fileURLToPath } from "node:url"
import { createEditorServer } from "../server/api.mjs"
const server = createEditorServer({
  catalogPath:
    process.env.SLIDES_CATALOG_PATH ??
    fileURLToPath(new URL("../dist/editor-catalog.json", import.meta.url)),
  storePath:
    process.env.SLIDES_STORE_PATH ??
    fileURLToPath(new URL("../.editor-data", import.meta.url)),
})
server.listen(Number(process.env.PORT ?? 3002), "127.0.0.1", () =>
  console.log("Slide editor API listening on loopback")
)
