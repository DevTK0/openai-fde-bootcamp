import { z } from "zod"
import { getBusArrivals } from "@/lib/server/datamall"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const stopCodeSchema = z.string().regex(/^\d{5}$/)
const serviceNoSchema = z.string().regex(/^[A-Za-z0-9]{1,6}$/)

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const stopResult = stopCodeSchema.safeParse(params.get("stop"))
  const serviceRaw = params.get("service")
  const serviceResult = serviceRaw === null ? null : serviceNoSchema.safeParse(serviceRaw)
  if (!stopResult.success || (serviceResult && !serviceResult.success)) {
    return Response.json({ error: "Provide a five-digit stop code and an optional service number." }, { status: 400 })
  }
  const result = await getBusArrivals(stopResult.data, serviceResult?.data ?? null)
  return Response.json(result, { headers: { "Cache-Control": "no-store" } })
}
