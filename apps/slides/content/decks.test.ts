import { describe, expect, it } from "vitest"
import { existsSync } from "node:fs"
import { decks } from "./decks"
import { reviews } from "./review"
import { speakerNotes } from "../components/deck"

const jargon =
  /apps\/|packages\/|\.json|\.csv|NW-[A-Z0-9]+|EXT-[A-Z0-9]+|PC0\d|HVAC|SLA|counterfactual|cohort|dispatchable/
const words = (s: string) => s.trim().split(/\s+/).length

describe("plain-language visual decks", () => {
  it("preserves all eleven deck addresses and gives every slide a visual", () => {
    expect(decks).toHaveLength(11)
    expect(new Set(decks.map((d) => d.id)).size).toBe(11)
    for (const deck of decks) {
      expect(
        existsSync(new URL(`../slides/${deck.id}/index.tsx`, import.meta.url))
      ).toBe(true)
      expect(deck.slides[0]?.stage).toBe("How it works")
      expect(deck.slides[4]?.stage).toBe("Stakeholder data request")
      expect(deck.slides[4]?.visual.kind).toBe("data-request")
      const requests = deck.slides.filter(
        (slide) => slide.stage === "Stakeholder data request"
      )
      expect(requests).toHaveLength(reviews[deck.id]!.items.length)
      requests.forEach((slide, index) => {
        expect(slide.visual.kind).toBe("data-request")
        if (slide.visual.kind === "data-request") {
          expect(slide.visual.item.label).toBe(
            reviews[deck.id]!.items[index]!.label
          )
          expect(slide.visual).not.toHaveProperty("items")
        }
      })
      const impact = deck.slides.find((slide) => slide.stage === "Impact")
      if (impact) {
        expect(deck.slides.at(-1)).toBe(impact)
        expect(["calculation", "measures", "bars"]).toContain(
          impact.visual.kind
        )
        expect(impact.caption).not.toMatch(/request|ask/i)
      }
      for (const slide of deck.slides)
        expect(slide).not.toHaveProperty("caveat")
      expect(
        new Set(deck.slides.map((s) => s.visual.kind)).size
      ).toBeGreaterThan(1)
      for (const slide of deck.slides) {
        expect(slide.visual.kind).toBeTruthy()
        expect(["trial", "choice"]).not.toContain(slide.visual.kind)
        expect(slide.stage).not.toMatch(/solution|decision|change|proposal/i)
        expect(slide.title + " " + slide.caption).not.toMatch(
          /approve|ask:|trial|pilot|recommend/i
        )
      }
    }
  })
  it("uses short headlines, short captions and human-readable data sources", () => {
    for (const deck of decks) {
      expect(deck.title).not.toMatch(jargon)
      for (const slide of deck.slides) {
        expect(words(slide.title), slide.title).toBeLessThanOrEqual(15)
        expect(words(slide.caption), slide.caption).toBeLessThanOrEqual(25)
        expect(JSON.stringify(slide)).not.toMatch(jargon)
        expect(slide.source.length).toBeGreaterThan(15)
        expect(slide.notes.length).toBeGreaterThan(100)
        if (slide.visual.kind === "bars") {
          expect(
            slide.visual.rows.every(
              (r) => Number.isFinite(r.value) && r.value >= 0
            )
          ).toBe(true)
        }
      }
    }
  })
  it("keeps explanation and caveats aligned with all presenter pages", () => {
    for (const deck of decks) {
      const notes = speakerNotes(deck)
      expect(notes).toHaveLength(deck.slides.length)
      notes.forEach((note, i) => {
        expect(note).toContain(deck.slides[i]!.notes)
        expect(note).toContain(deck.slides[i]!.source)
        expect(note).not.toMatch(jargon)
      })
    }
  })
})
