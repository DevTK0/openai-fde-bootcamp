import { OperationsPlanner } from "@/components/operations-planner"
import { planningCatalog } from "@/lib/planning-server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function Page() {
  const { keyConfigured } = await planningCatalog()
  return <OperationsPlanner enabled={keyConfigured} />
}
