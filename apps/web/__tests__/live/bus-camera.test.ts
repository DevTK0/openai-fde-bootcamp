import { describe, expect, it } from "vitest"
import { cameraDistanceScale } from "@/components/live/bus-camera"

describe("repair-view framing", () => {
  it("moves the camera farther back in the narrow dashboard column", () => {
    expect(cameraDistanceScale(0.75)).toBeGreaterThan(2)
    expect(cameraDistanceScale(1.7)).toBe(1)
  })
})
