import { listBundles, saveBundle } from "@/lib/evidence/store"
import { seedSummary } from "@/lib/evidence/seed"
import { readImport, respond } from "@/lib/evidence/http"
export const runtime = "nodejs"
export async function GET() {
  return respond(async () => ({
    revisions: [
      seedSummary,
      ...(await listBundles()).filter((r) => r.id !== seedSummary.id),
    ],
  }))
}
export async function POST(request: Request) {
  return respond(async () => saveBundle(await readImport(request)))
}
