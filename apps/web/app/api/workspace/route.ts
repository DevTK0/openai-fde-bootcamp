import { listBundles, saveBundle } from "@/lib/evidence/store"
import { seedSummary } from "@/lib/evidence/seed"
import { readImport, respond } from "@/lib/evidence/http"
export const runtime = "nodejs"
export async function GET() {
  return respond(async () => {
    const catalog = await listBundles()
    return {
      revisions: [
        seedSummary,
        ...catalog.revisions.filter((r) => r.id !== seedSummary.id),
      ],
      unavailableRevisions: catalog.unavailableRevisions,
    }
  })
}
export async function POST(request: Request) {
  return respond(async () => saveBundle(await readImport(request)))
}
