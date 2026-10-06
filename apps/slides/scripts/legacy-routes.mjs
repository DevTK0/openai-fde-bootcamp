import { readFileSync } from "node:fs"

const groups = JSON.parse(
  readFileSync(new URL("../content/deck-groups.json", import.meta.url), "utf8")
)

const legacyPages = JSON.parse(
  readFileSync(
    new URL("../content/legacy-deck-pages.json", import.meta.url),
    "utf8"
  )
)

export function legacyDeckUrl(requestUrl) {
  const url = new URL(requestUrl, "http://localhost")
  const match = /^\/slides\/s\/([^/]+)(\/presenter)?\/?$/.exec(url.pathname)
  if (!match || groups.some((group) => group.id === match[1])) return null
  if (!Object.hasOwn(legacyPages, match[1])) return null
  const pages = legacyPages[match[1]]
  const oldPage = Math.max(
    1,
    Math.floor(Number(url.searchParams.get("p")) || 1)
  )
  const [deck, page] = pages[oldPage] ?? pages[1]
  url.pathname = `/slides/s/${deck}${match[2] ?? ""}`
  url.searchParams.set("p", String(page))
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
