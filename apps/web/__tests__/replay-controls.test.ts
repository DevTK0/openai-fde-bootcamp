import { expect, it } from "vitest"
import { planningSourcesSchema, replayEventTimes } from "@/lib/service-planning"

it("steps through actual events in order, including observed zero and window boundaries", () => {
  const detail = planningSourcesSchema
    .pick({ calls: true, trips: true })
    .parse({
      calls: [
        {
          id: "a",
          trip: "t",
          route: "r",
          order: 1,
          vehicle: "b",
          arrival: 90,
          observed: 120,
          departure: 125,
          queue: 0,
        },
        {
          id: "b",
          trip: "t",
          route: "r",
          order: 2,
          vehicle: "b",
          arrival: 150,
          observed: null,
          departure: null,
          queue: null,
        },
      ],
      trips: [
        {
          id: "t",
          service: "1",
          route: "r",
          vehicle: "b",
          crew: null,
          origin: "a",
          destination: "b",
          scheduled: 105,
          departure: 125,
          arrival: 210,
        },
      ],
    })
  expect(replayEventTimes(detail, 100, 200)).toEqual([100, 120, 125, 150, 200])
  expect(replayEventTimes({ calls: [], trips: [] }, 100, 200)).toEqual([
    100, 200,
  ])
})
