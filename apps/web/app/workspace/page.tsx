import { connection } from "next/server"
import { Workspace } from "@/components/workspace/workspace"
import { listBundles } from "@/lib/evidence/store"
import { seedSummary } from "@/lib/evidence/seed"
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ revision?: string | string[] }>
}) {
  const { revision } = await searchParams
  await connection()
  const { revisions, unavailableRevisions } = await listBundles()
  const available = [
    seedSummary,
    ...revisions.filter((item) => item.id !== seedSummary.id),
  ]
  const selected =
    typeof revision === "string"
      ? available.find((item) => item.id === revision)?.id
      : undefined
  return (
    <Workspace
      initialRevision={selected}
      initialNotice={
        revision !== undefined && !selected
          ? "Requested revision is unavailable. Showing the supplied fixture instead."
          : ""
      }
      initialUnavailableRevisions={unavailableRevisions}
      initialRevisions={available}
    />
  )
}
