import { describe, expect, it, vi } from "vitest"
import { isValidElement, type ReactNode } from "react"
import { readFileSync } from "node:fs"
import { decks } from "./decks"

vi.mock("@open-slide/core", () => ({
  useSlidePageNumber: () => ({ current: 1, total: 1 }),
}))

function tags(node: ReactNode): string[] {
  if (Array.isArray(node)) return node.flatMap(tags)
  if (!isValidElement<{ children?: ReactNode }>(node)) return []
  return [
    ...(typeof node.type === "string" ? [node.type] : []),
    ...tags(node.props.children),
  ]
}

describe("native Open Slide authoring contract", () => {
  for (const deck of decks)
    it(`${deck.id} has directly editable pages and diagram labels`, async () => {
      const module = await import(`../slides/${deck.id}/index.tsx`)
      const pages = module.default as (() => ReactNode)[]
      expect(pages.length).toBeGreaterThan(0)
      expect(module.notes).toHaveLength(pages.length)
      const source = readFileSync(
        new URL(`../slides/${deck.id}/index.tsx`, import.meta.url),
        "utf8"
      )
      // Native edits target JSX locations inside each deck's index.tsx.
      expect(source).not.toMatch(/createDeck\(|SlideCanvas|editor\/store/)
      expect(source).toMatch(/export default \[/)
      for (const Page of pages) {
        const elements = tags(Page())
        expect(elements).toContain("h1")
        expect(elements).toContain("p")
        // SVG text cannot be selected by Open Slide's HTMLElement inspector.
        expect(elements).not.toContain("text")
        expect(elements).not.toContain("tspan")
      }
      expect(source).not.toContain("�")
    })
})
