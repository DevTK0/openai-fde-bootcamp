// @vitest-environment node
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { describe, expect, it } from "vitest"
import { planningRequestSchema } from "@/lib/planning-schema"

const execute = promisify(execFile)
describe("operations planner", () => {
  it("preserves real schedules and compares only distinct alternatives", async () => {
    const { stderr } = await execute("python3", [
      "-m",
      "unittest",
      "discover",
      "-s",
      "planner",
      "-p",
      "test_planner.py",
    ])
    expect(stderr).toContain("OK")
  }, 30000)
  it("rejects resource profiles outside matching onboarding scenarios", () => {
    const request = {
      kind: "network",
      scenario: "sick_crew",
      date: "2026-10-07",
      route: "B235_1",
      resources: [
        {
          kind: "crew",
          id: "new",
          confirmed: true,
          availableFrom: "04:00",
          availableUntil: "23:00",
          qualification: "235",
        },
      ],
    }
    expect(planningRequestSchema.safeParse(request).success).toBe(false)
    expect(
      planningRequestSchema.safeParse({ ...request, scenario: "new_crew" })
        .success
    ).toBe(true)
    expect(
      planningRequestSchema.safeParse({
        ...request,
        scenario: "new_crew",
        resources: [...request.resources, ...request.resources],
      }).success
    ).toBe(false)
  })
})
