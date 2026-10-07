import { expect, it } from "vitest"
import { exchangesAt } from "../app/prototypes/singapore-replay/passenger-exchange"

const call = {
  id: "a",
  route: "B132_1",
  order: 3,
  observed: 100,
  departure: 110,
}
const counts = { id: "a", boarded: 10, alighted: 9, left: 10 }
it("shows the recorded boarding, alighting and left-behind counts after departure", () => {
  expect(exchangesAt([call], [counts], 109).size).toBe(0)
  expect(exchangesAt([call], [counts], 140).get("B132_1/3")).toEqual({
    ...counts,
    age: 30,
  })
  expect(exchangesAt([call], [counts], 290).size).toBe(0)
})
it("keeps missing evidence distinct from zero and directions distinct", () => {
  const other = { ...call, id: "b", route: "B132_2" }
  const missing = { id: "b", boarded: null, alighted: 0, left: null }
  const events = exchangesAt([call, other], [counts, missing], 140)
  expect(events.size).toBe(2)
  expect(events.get("B132_2/3")).toEqual({ ...missing, age: 30 })
  expect(exchangesAt([{ ...call, departure: null }], [counts], 140).size).toBe(
    0
  )
  expect(exchangesAt([{ ...call, observed: null }], [counts], 140).size).toBe(0)
})
