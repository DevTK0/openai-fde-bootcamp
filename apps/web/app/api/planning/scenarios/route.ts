import { z } from "zod"
import { buildCandidates } from "@/lib/planning/engine"
import { loadScenario, listScenarios } from "@/lib/planning/fixture"
import { dateSchema, jsonError, planningModeSchema, scenarioIdSchema } from "@/lib/server/http"
import type { PlanningFixture } from "@/lib/planning/contracts"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const querySchema = z.object({
  scenario: scenarioIdSchema,
  date: dateSchema,
  mode: planningModeSchema,
})

function publicTrip(row: Record<string, unknown>, retrospective: boolean) {
  if (retrospective) return row
  const { actual_vehicle_id, actual_crew_id, actual_departure_at, actual_arrival_at, completion_state, ...known } = row
  return known
}

function toFixtureDTO(fixture: PlanningFixture) {
  const retrospective = fixture.scenario.mode === "retrospective"
  return {
    scenario: fixture.scenario,
    sourceHash: fixture.sourceHash,
    admittedThrough: fixture.admittedThrough,
    sourceCounts: fixture.sourceCounts,
    trips: fixture.trips.map((row) => publicTrip(row, retrospective)),
    relatedTrips: fixture.relatedTrips.map((row) => publicTrip(row, retrospective)),
    controlActions: fixture.controlActions,
    resourceUpdates: fixture.resourceUpdates,
    crewDuties: fixture.crewDuties,
    vehicleReadiness: fixture.vehicleReadiness,
    terminalMovements: fixture.terminalMovements,
    planningConstraints: fixture.planningConstraints,
    warnings: fixture.warnings,
  }
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const parsed = querySchema.safeParse({
    scenario: params.get("scenario"),
    date: params.get("date"),
    mode: params.get("mode") ?? "prospective",
  })
  if (!parsed.success) return jsonError("Select a valid scenario, date and mode.", 400)
  try {
    const [scenarios, fixture] = await Promise.all([
      listScenarios(),
      loadScenario(parsed.data.scenario, parsed.data.date, parsed.data.mode),
    ])
    return Response.json({
      scenarios,
      fixture: toFixtureDTO(fixture),
      candidates: buildCandidates(fixture),
    }, { headers: { "Cache-Control": "no-store" } })
  } catch {
    return jsonError("The requested planning scenario could not be loaded.", 404)
  }
}
