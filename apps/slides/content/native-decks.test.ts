import { describe, expect, it, vi } from "vitest"
import { createElement, isValidElement, type ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { readFileSync } from "node:fs"
import groups from "./deck-groups.json"

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

function sourceTitles(pages: (() => ReactNode)[]): string[] {
  const titles: string[] = []
  function visit(node: ReactNode) {
    if (Array.isArray(node)) return node.forEach(visit)
    if (!isValidElement<{ children?: ReactNode }>(node)) return
    if (node.type === "h1") titles.push(String(node.props.children))
    visit(node.props.children)
  }
  pages.forEach((Page) => visit(Page()))
  return titles
}

describe("native Open Slide authoring contract", () => {
  for (const deck of groups)
    it(`${deck.id} has directly editable pages and diagram labels`, async () => {
      const module = await import(`../slides/${deck.id}/index.tsx`)
      const pages = module.default as (() => ReactNode)[]
      expect(pages.length).toBeGreaterThan(0)
      expect(module.notes).toHaveLength(pages.length)
      expect(module.meta.title).toBe(deck.title)
      expect(
        sourceTitles(pages).filter((title) => title === "Caveats")
      ).toHaveLength(1)
      const source = readFileSync(
        new URL(`../slides/${deck.id}/index.tsx`, import.meta.url),
        "utf8"
      )
      // Native edits target JSX locations inside each deck's index.tsx.
      expect(source).not.toMatch(/createDeck\(|SlideCanvas|editor\/store/)
      expect(source).toMatch(/export default \[/)
      expect(source.match(/<PageNumber\s*\/>/g)).toHaveLength(pages.length)
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

it("shows route departure counts rather than page numbers in the chart", async () => {
  const { default: pages } = await import("../slides/scheduling/index")
  const Page = pages[2]
  if (!Page) throw new Error("Missing route delay slide")
  const html = renderToStaticMarkup(createElement(Page))
  const figure = html.match(/<figure\b[\s\S]*?<\/figure>/)?.[0]
  expect(figure).toContain("24 of 280")
  expect(figure).toContain("17 of 280")
  expect(figure).toContain("7 of 220")
  expect(figure).not.toContain("1 / 1")
})

it("keeps published caveat notes on their own topic", async () => {
  const { notes } = await import("../slides/ridership/index")
  const revenue = notes.find((note) =>
    note.startsWith("More boardings may not mean more revenue.")
  )
  expect(revenue).toBeDefined()
  expect(revenue).not.toContain("Six selected accounts")
})

it("keeps published chart figures aligned with their evidence", async () => {
  const { decks } = await import("./decks")
  const { SlideCanvas } = await import("../components/deck")
  function numbers(html: string) {
    const chart = html.split("<footer")[0] ?? ""
    const text = chart
      .replace(/<(desc|title)\b[^>]*>[\s\S]*?<\/\1>/g, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&#(?:x([0-9a-f]+)|(\d+));/gi, (_, hex, decimal) =>
        String.fromCodePoint(parseInt(hex ?? decimal, hex ? 16 : 10))
      )
    return (text.match(/\d+(?:[,.]\d+)*(?::\d+)?/g) ?? []).sort()
  }
  for (const group of groups) {
    const { default: pages } = await import(`../slides/${group.id}/index.tsx`)
    for (const [index, [sourceId, page]] of group.pages.entries()) {
      const deck = decks.find((deck) => deck.id === sourceId)
      const slide = deck?.slides[Number(page) - 1]
      if (!deck || !slide)
        throw new Error(`Missing evidence for ${sourceId}:${page}`)
      const published = renderToStaticMarkup(createElement(pages[index]))
      const reference = renderToStaticMarkup(
        createElement(SlideCanvas, { deck, slide, index: Number(page) - 1 })
      )
      const expected = numbers(
        reference.match(/<figure\b[\s\S]*?<\/figure>/)?.[0] ?? ""
      )
      const actual = numbers(
        published.match(/<figure\b[\s\S]*?<\/figure>/)?.[0] ?? ""
      )
      expect.soft(actual, `${group.id} page ${index + 1}`).toEqual(expected)
    }
  }
})
