import raw from "./seed.json"
import { bundleSchema } from "./schema"
import { contentId, summary } from "./store"
export const seedBundle = bundleSchema.parse(raw)
export const seedId = contentId(seedBundle)
export const seedSummary = summary(
  seedId,
  seedBundle,
  "2026-10-06T00:00:00.000Z",
  true
)
