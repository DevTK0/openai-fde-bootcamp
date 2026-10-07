import { PARTS } from "./bus-parts"
export function assessmentRepairAreas(
  vehicleId?: string | null,
  repairAreas?: string[] | null,
  repairArea?: string | null
): string[] {
  if (!vehicleId) return []
  return [...new Set(repairAreas ?? (repairArea ? [repairArea] : []))].filter(
    (id) => Object.hasOwn(PARTS, id)
  )
}
