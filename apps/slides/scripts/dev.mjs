import { createViteConfig } from "@open-slide/core/vite"
import { createServer } from "vite"
import { fileURLToPath } from "node:url"

// Open Slide's default allow-list only covers the app itself. Include the
// monorepo so the shared @workspace/ui source and its dependencies can load.
const config = await createViteConfig({
  userCwd: fileURLToPath(new URL("../", import.meta.url)),
})
config.server = {
  ...config.server,
  host: "127.0.0.1",
  strictPort: true,
  fs: {
    ...config.server?.fs,
    allow: [
      ...(config.server?.fs?.allow ?? []),
      fileURLToPath(new URL("../../../", import.meta.url)),
    ],
  },
}
const server = await createServer(config)
await server.listen()
server.printUrls()
