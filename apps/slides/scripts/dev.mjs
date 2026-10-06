import { createViteConfig } from "@open-slide/core/vite"
import { createServer } from "vite"
import { fileURLToPath } from "node:url"

const config = await createViteConfig({
  userCwd: fileURLToPath(new URL("../", import.meta.url)),
})
config.server = {
  ...config.server,
  host: "127.0.0.1",
  strictPort: true,
  // nginx preserves the host for both the public site and collaborative preview.
  allowedHosts: [
    "valley-or-edit.exe.xyz",
    "valley-or-edit.halibut-bass.ts.net",
  ],
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
