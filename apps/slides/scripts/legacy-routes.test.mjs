import { describe, expect, it } from "vitest"
import { legacyDeckUrl } from "./legacy-routes.mjs"

describe("consolidated deck links", () => {
  it("keeps links to retained evidence on the matching page", () => {
    expect(legacyDeckUrl("/slides/s/repair-spend?p=3")).toBe(
      "/slides/s/maintenance-costs?p=5"
    )
    expect(legacyDeckUrl("/slides/s/hvac-comfort?p=3")).toBe(
      "/slides/s/service-quality?p=7"
    )
  })
  it("sends repeated caveats and impacts to the combined page", () => {
    expect(legacyDeckUrl("/slides/s/repair-spend?p=6")).toBe(
      "/slides/s/maintenance-costs?p=9"
    )
    expect(legacyDeckUrl("/slides/s/repair-spend?p=9")).toBe(
      "/slides/s/maintenance-costs?p=12"
    )
    expect(legacyDeckUrl("/slides/s/incident-relief?p=8")).toBe(
      "/slides/s/special-service-plans?p=12"
    )
  })
  it("preserves presenter routes and other query parameters", () => {
    expect(legacyDeckUrl("/slides/s/crowding/presenter?p=3&session=test")).toBe(
      "/slides/s/passenger-demand/presenter?p=3&session=test"
    )
  })
  it("leaves current decks and unrelated paths alone", () => {
    expect(legacyDeckUrl("/slides/s/passenger-demand?p=2")).toBeNull()
    expect(legacyDeckUrl("/slides/s/customer-growth?p=2")).toBeNull()
    expect(legacyDeckUrl("/slides/s/missing")).toBeNull()
    expect(legacyDeckUrl("/__edit")).toBeNull()
  })
})
