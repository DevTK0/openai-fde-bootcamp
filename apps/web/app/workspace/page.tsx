import { connection } from "next/server"
import { Workspace } from "@/components/workspace/workspace"
import { listBundles } from "@/lib/evidence/store"
import { seedSummary } from "@/lib/evidence/seed"
export default async function Page() {
  await connection()
  const revisions = await listBundles()
  return (
    <Workspace
      initialRevisions={[
        seedSummary,
        ...revisions.filter((revision) => revision.id !== seedSummary.id),
      ]}
    />
  )
}
