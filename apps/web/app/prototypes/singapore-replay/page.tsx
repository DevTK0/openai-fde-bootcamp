import { getPlanningReport } from "@/lib/service-planning-server"
import { planningSelectionSchema } from "@/lib/service-planning"
import { withDatabase } from "@/lib/database"
import { passengerRecordsSchema } from "./passenger-exchange"
import { SingaporeReplay } from "./replay"

export const dynamic = "force-dynamic"

export default async function Page() {
  const reports = await Promise.all(
    ["132", "159"].map((service) =>
      getPlanningReport(
        planningSelectionSchema.parse({ date: "2026-10-07", service })
      )
    )
  )
  const passengers = withDatabase((database) =>
    passengerRecordsSchema.parse(
      database
        .prepare(
          "SELECT call_id AS id, boarded_people AS boarded, alighted_people AS alighted, queue_after_people AS left FROM stop_calls WHERE service_date = ? AND route_id IN ('B132_1','B132_2','B159_1','B159_2')"
        )
        .all("2026-10-07")
    )
  )
  return <SingaporeReplay reports={reports} passengers={passengers} />
}
