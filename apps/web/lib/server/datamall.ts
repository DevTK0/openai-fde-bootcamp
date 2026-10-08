import { getDataMallConfig } from "./env"

export type ArrivalState = "live" | "empty" | "stale" | "offline" | "unconfigured"

export type BusEstimate = {
  slot: 1 | 2 | 3
  estimatedArrival: string | null
  minutesUntilArrival: number | null
  monitored: boolean | null
  load: string | null
  feature: string | null
  vehicleType: string | null
  originCode: string | null
  destinationCode: string | null
  visitNumber: string | null
}

export type ArrivalService = {
  serviceNo: string
  operator: string | null
  buses: BusEstimate[]
}

export type BusArrivalResult = {
  stopCode: string
  serviceNo: string | null
  state: ArrivalState
  retrievedAt: string | null
  cacheAgeSeconds: number | null
  services: ArrivalService[]
  message: string | null
}

type UpstreamEstimate = {
  EstimatedArrival?: string
  Monitored?: number | string
  Load?: string
  Feature?: string
  Type?: string
  OriginCode?: string
  DestinationCode?: string
  VisitNumber?: string
}

type UpstreamService = {
  ServiceNo?: string
  Operator?: string
  NextBus?: UpstreamEstimate
  NextBus2?: UpstreamEstimate
  NextBus3?: UpstreamEstimate
}

type UpstreamPayload = { BusStopCode?: string; Services?: UpstreamService[] }

type CacheEntry = { savedAt: number; result: BusArrivalResult }
const ttlMs = 20_000
const timeoutMs = 4_000
const cache = new Map<string, CacheEntry>()
const pending = new Map<string, Promise<BusArrivalResult>>()

function normalizeEstimate(bus: UpstreamEstimate | undefined, slot: 1 | 2 | 3, now: number): BusEstimate {
  const at = bus?.EstimatedArrival && Number.isFinite(Date.parse(bus.EstimatedArrival))
    ? new Date(bus.EstimatedArrival).toISOString()
    : null
  const monitored = bus?.Monitored === 1 || bus?.Monitored === "1"
    ? true
    : bus?.Monitored === 0 || bus?.Monitored === "0"
      ? false
      : null
  return {
    slot,
    estimatedArrival: at,
    minutesUntilArrival: at ? Math.max(0, Math.floor((Date.parse(at) - now) / 60_000)) : null,
    monitored,
    load: bus?.Load || null,
    feature: bus?.Feature || null,
    vehicleType: bus?.Type || null,
    originCode: bus?.OriginCode || null,
    destinationCode: bus?.DestinationCode || null,
    visitNumber: bus?.VisitNumber || null,
  }
}

function normalize(payload: UpstreamPayload, stopCode: string, requestedService: string | null, retrievedAt: string): BusArrivalResult {
  const now = Date.parse(retrievedAt)
  const services = (payload.Services ?? [])
    .filter((service) => !requestedService || service.ServiceNo === requestedService)
    .map((service) => ({
      serviceNo: service.ServiceNo ?? "",
      operator: service.Operator || null,
      buses: [
        normalizeEstimate(service.NextBus, 1, now),
        normalizeEstimate(service.NextBus2, 2, now),
        normalizeEstimate(service.NextBus3, 3, now),
      ],
    }))
    .filter((service) => service.serviceNo)
  const anyEstimate = services.some((service) => service.buses.some((bus) => bus.estimatedArrival))
  return {
    stopCode,
    serviceNo: requestedService,
    state: anyEstimate ? "live" : "empty",
    retrievedAt,
    cacheAgeSeconds: 0,
    services,
    message: anyEstimate ? null : "No arrival estimates are currently available for this stop and service.",
  }
}

function refreshAge(entry: CacheEntry, now: number, state: ArrivalState = entry.result.state, message = entry.result.message): BusArrivalResult {
  return {
    ...entry.result,
    state,
    cacheAgeSeconds: Math.max(0, Math.floor((now - entry.savedAt) / 1000)),
    message,
    services: entry.result.services.map((service) => ({
      ...service,
      buses: service.buses.map((bus) => ({
        ...bus,
        minutesUntilArrival: bus.estimatedArrival
          ? Math.max(0, Math.floor((Date.parse(bus.estimatedArrival) - now) / 60_000))
          : null,
      })),
    })),
  }
}

export function clearDataMallCacheForTests() {
  cache.clear()
  pending.clear()
}

export async function getBusArrivals(stopCode: string, serviceNo: string | null, now = Date.now()): Promise<BusArrivalResult> {
  const key = `${stopCode}:${serviceNo ?? "*"}`
  const entry = cache.get(key)
  if (entry && now - entry.savedAt < ttlMs) {
    return refreshAge(entry, now)
  }
  const active = pending.get(key)
  if (active) return active
  const { apiKey } = getDataMallConfig()
  if (!apiKey) {
    return {
      stopCode, serviceNo, state: "unconfigured", retrievedAt: null, cacheAgeSeconds: null,
      services: [], message: "LTA DataMall credentials are not configured on the server.",
    }
  }
  const request: Promise<BusArrivalResult> = (async () => {
    const url = new URL("https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival")
    url.searchParams.set("BusStopCode", stopCode)
    if (serviceNo) url.searchParams.set("ServiceNo", serviceNo)
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(url, {
        headers: { AccountKey: apiKey, accept: "application/json" },
        signal: controller.signal,
        cache: "no-store",
      })
      if (!response.ok) throw new Error(`upstream-${response.status}`)
      const payload = (await response.json()) as UpstreamPayload
      if (!Array.isArray(payload.Services)) throw new Error("upstream-invalid-response")
      const retrievedAt = new Date().toISOString()
      const result = normalize(payload, stopCode, serviceNo, retrievedAt)
      cache.set(key, { savedAt: Date.now(), result })
      return result
    } catch {
      const stale = cache.get(key)
      return stale
        ? refreshAge(stale, Date.now(), "stale", "Live DataMall is unavailable; showing the last successful response.")
        : {
            stopCode, serviceNo, state: "offline", retrievedAt: null, cacheAgeSeconds: null,
            services: [], message: "Live arrival data is temporarily unavailable.",
          }
    } finally {
      clearTimeout(timer)
      pending.delete(key)
    }
  })()
  pending.set(key, request)
  return request
}
