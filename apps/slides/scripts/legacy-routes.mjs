import { readFileSync } from "node:fs"

const groups = JSON.parse(
  readFileSync(new URL("../content/deck-groups.json", import.meta.url), "utf8")
)

// These aliases record the consolidation, not live source-file locations.
export function legacyDeckUrl(requestUrl) {
  const url = new URL(requestUrl, "http://localhost")
  const match = /^\/slides\/s\/([^/]+)(\/presenter)?\/?$/.exec(url.pathname)
  if (!match || groups.some((group) => group.id === match[1])) return null
  const group = groups.find((group) =>
    group.pages.some(([id]) => id === match[1])
  )
  if (!group) return null
  const oldPage = Math.max(
    1,
    Math.floor(Number(url.searchParams.get("p")) || 1)
  )
  const retained = group.pages.findIndex(
    ([id, page]) => id === match[1] && page === oldPage
  )
  const newPage =
    retained >= 0 ? retained + 1 : (group.aliases?.[match[1]]?.[oldPage] ?? 1)
  url.pathname = `/slides/s/${group.id}${match[2] ?? ""}`
  url.searchParams.set("p", String(newPage))
  return url.pathname + url.search
}

export const legacyDeckRedirects = {
  name: "consolidated-deck-links",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const target = legacyDeckUrl(req.url ?? "/")
      if (!target || !["GET", "HEAD"].includes(req.method)) return next()
      res.writeHead(302, { Location: target, "Cache-Control": "no-store" })
      res.end()
    })
  },
}
