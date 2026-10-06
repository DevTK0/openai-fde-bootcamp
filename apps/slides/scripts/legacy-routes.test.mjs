import { describe, expect, it } from "vitest"
import { legacyDeckUrl } from "./legacy-routes.mjs"

describe("consolidated deck links", () => {
  it("keeps links to retained evidence on the matching page", () => {
    expect(legacyDeckUrl("/slides/s/repair-spend?p=3")).toBe(
      "/slides/s/maintenance?p=5"
    )
    expect(legacyDeckUrl("/slides/s/hvac-comfort?p=3")).toBe(
      "/slides/s/maintenance?p=13"
    )
  })
  it("sends repeated caveats and impacts to the combined page", () => {
    expect(legacyDeckUrl("/slides/s/repair-spend?p=6")).toBe(
      "/slides/s/maintenance?p=16"
    )
    expect(legacyDeckUrl("/slides/s/repair-spend?p=9")).toBe(
      "/slides/s/maintenance?p=24"
    )
    expect(legacyDeckUrl("/slides/s/incident-relief?p=8")).toBe(
      "/slides/s/scheduling?p=25"
    )
  })
  it("splits old mixed decks by the problem on each page", () => {
    expect(legacyDeckUrl("/slides/s/service-quality?p=2")).toBe(
      "/slides/s/scheduling?p=2"
    )
    expect(legacyDeckUrl("/slides/s/service-quality?p=6")).toBe(
      "/slides/s/maintenance?p=12"
    )
    expect(legacyDeckUrl("/slides/s/workshop-capacity?p=2")).toBe(
      "/slides/s/scheduling?p=6"
    )
    expect(legacyDeckUrl("/slides/s/workshop-capacity?p=6")).toBe(
      "/slides/s/maintenance?p=9"
    )
    expect(legacyDeckUrl("/slides/s/customer-growth?p=5")).toBe(
      "/slides/s/ridership?p=11"
    )
  })
  it("preserves presenter routes and other query parameters", () => {
    expect(legacyDeckUrl("/slides/s/crowding/presenter?p=3&session=test")).toBe(
      "/slides/s/ridership/presenter?p=3&session=test"
    )
  })
  it("leaves current decks and unrelated paths alone", () => {
    expect(legacyDeckUrl("/slides/s/ridership?p=2")).toBeNull()
    expect(legacyDeckUrl("/slides/s/scheduling?p=2")).toBeNull()
    expect(legacyDeckUrl("/slides/s/missing")).toBeNull()
    expect(legacyDeckUrl("/slides/s/__proto__")).toBeNull()
    expect(legacyDeckUrl("/__edit")).toBeNull()
  })
})
