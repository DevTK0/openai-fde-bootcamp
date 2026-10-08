import { expect, it } from "vitest"
import {
  headingBetween,
  routeHeading,
} from "../components/service-replay/geometry"

it("points along the road before and after a right-angle bend", () => {
  const route = {
    points: [
      [0, 0],
      [0, 10],
      [10, 10],
    ],
    distances: [0, 10, 20],
  }
  expect(routeHeading(route, 0)).toBe(0)
  expect(routeHeading(route, 5)).toBe(0)
  expect(routeHeading(route, 15)).toBeCloseTo(Math.PI / 2)
  expect(routeHeading(route, 20)).toBeCloseTo(Math.PI / 2)
  expect(headingBetween({ x: 10, z: 10 }, { x: 0, z: 10 })).toBeCloseTo(
    -Math.PI / 2
  )
})
it("handles repeated vertices without an invalid heading", () => {
  expect(
    routeHeading(
      {
        points: [
          [0, 0],
          [0, 0],
          [0, 10],
        ],
        distances: [0, 0, 10],
      },
      0
    )
  ).toBe(0)
})
