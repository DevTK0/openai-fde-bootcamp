import { z } from "zod"
const errorSchema = z.object({ error: z.string() })
export async function responseError(response: Response) {
  const text = await response.text()
  try {
    const parsed = errorSchema.safeParse(JSON.parse(text))
    if (parsed.success) return parsed.data.error
  } catch {
    /* Plain-text errors are also supported. */
  }
  return text || `Factory returned ${response.status}`
}
