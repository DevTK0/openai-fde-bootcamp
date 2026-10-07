import path from "node:path"
import { fileURLToPath } from "node:url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    {
      name: "native-sqlite-for-tests",
      enforce: "pre",
      resolveId(id) {
        // Vitest 5's client external list omits Node's prefix-only SQLite module.
        if (id === "node:sqlite") return { id, external: true }
      },
    },
  ],
  resolve: {
    alias: {
      "@": dirname,
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next"],
    css: false,
  },
})
