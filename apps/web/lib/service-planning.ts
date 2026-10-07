import { z } from "zod"

const clock = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)
export const planningSelectionSchema = z
  .object({
    date: z.iso.date(),
    service: z.string().min(1),
    delay: z.coerce.number().finite().min(0).max(120).default(5),
    queue: z.coerce.number().int().min(1).max(10000).default(30),
    start: clock.default("06:00"),
    end: clock.default("12:00"),
    horizon: z.coerce.number().int().min(1).max(240).default(30),
  })
  .refine((s) => s.start < s.end, {
    message: "Window end must follow its start",
  })
export type PlanningSelection = z.infer<typeof planningSelectionSchema>
const time = z.number().finite().nullable()
const count = z.number().nonnegative().nullable()
export const planningSourcesSchema = z.object({
  routes: z.array(
    z.object({
      id: z.string(),
      service: z.string(),
      direction: z.number(),
      name: z.string(),
      origin: z.string(),
    })
  ),
  positions: z.array(
    z.object({
      route: z.string(),
      order: z.number(),
      stop: z.string(),
      name: z.string(),
      boarding: z.number(),
      latitude: z.number().min(-90).max(90).nullable().optional(),
      longitude: z.number().min(-180).max(180).nullable().optional(),
    })
  ),
  vehicles: z.array(z.object({ id: z.string(), service: z.string() })),
  trips: z.array(
    z.object({
      id: z.string(),
      service: z.string(),
      route: z.string(),
      vehicle: z.string().nullable(),
      crew: z.string().nullable(),
      origin: z.string(),
      destination: z.string(),
      scheduled: time,
      departure: time,
      arrival: time,
    })
  ),
  calls: z.array(
    z.object({
      id: z.string(),
      trip: z.string(),
      route: z.string(),
      order: z.number(),
      vehicle: z.string().nullable(),
      arrival: time,
      departure: time,
      observed: time,
      queue: count,
      boarded: count.optional(),
      alighted: count.optional(),
    })
  ),
  releases: z.array(
    z.object({
      id: z.string(),
      vehicle: z.string(),
      issued: time,
      start: time,
      end: time,
      location: z.string().nullable(),
      state: z.string(),
    })
  ),
  duties: z.array(
    z.object({
      id: z.string(),
      crew: z.string(),
      service: z.string(),
      issued: time,
      start: time,
      end: time,
      location: z.string().nullable(),
      breakStart: time,
      breakEnd: time,
      maximum: count,
      takeover: count,
    })
  ),
  movements: z.array(
    z.object({
      id: z.string(),
      vehicle: z.string(),
      crew: z.string().nullable(),
      start: time,
      end: time,
      from: z.string(),
      to: z.string(),
    })
  ),
  holds: z.array(
    z.object({
      id: z.string(),
      vehicle: z.string(),
      start: time,
      end: time,
      source: z.string(),
    })
  ),
})
export type PlanningSources = z.infer<typeof planningSourcesSchema>
export type PlanningCall = PlanningSources["calls"][number]
export type PlanningTrip = PlanningSources["trips"][number]
export type PlanningPosition = PlanningSources["positions"][number]
export type PlanningHold = PlanningSources["holds"][number]
const delayEvidenceSchema = z.object({
  trip: z.string(),
  vehicle: z.string().nullable(),
  scheduled: z.number(),
  departure: z.number(),
  minutes: z.number(),
})
const serviceWatchSchema = z.object({
  service: z.string(),
  name: z.string(),
  priority: z.enum(["Critical", "High", "No observed trigger"]),
  reasons: z.array(z.string()),
  delays: z.array(delayEvidenceSchema),
  peak: planningSourcesSchema.shape.calls.element.nullable(),
  holds: planningSourcesSchema.shape.holds,
  observed: z.number(),
  affected: z.number(),
  total: z.number(),
  departuresObserved: z.number(),
  departuresTotal: z.number(),
})
const candidateBase = z.object({
  vehicle: z.string(),
  assignedService: z.string(),
})
const candidateSchema = z.discriminatedUnion("status", [
  candidateBase.extend({
    status: z.literal("candidate"),
    crew: z.string(),
    location: z.string(),
    until: z.number(),
    evidence: z.array(z.string()),
    readiness: planningSourcesSchema.shape.releases.element,
    duty: planningSourcesSchema.shape.duties.element,
    turnaroundCompleteAt: z.number().nullable(),
    dutyLimit: z.number(),
  }),
  candidateBase.extend({
    status: z.literal("unavailable"),
    reasons: z.array(z.string()),
  }),
  candidateBase.extend({
    status: z.literal("unknown"),
    reasons: z.array(z.string()),
  }),
])
const detailSchema = planningSourcesSchema.pick({
  routes: true,
  positions: true,
  calls: true,
  trips: true,
})
export const planningReportSchema = z.object({
  selection: planningSelectionSchema,
  watchlist: z.array(serviceWatchSchema),
  candidates: z.array(candidateSchema),
  detail: detailSchema,
})
export type ServiceWatch = z.infer<typeof serviceWatchSchema>
export type CandidateReview = z.infer<typeof candidateSchema>
export type PlanningDetail = z.infer<typeof detailSchema>
export type PlanningReport = z.infer<typeof planningReportSchema>
export function planningTime(date: string, clock: string) {
  return Date.parse(`${date}T${clock}:00+08:00`) / 1000
}
function positionKey(p: { route: string; order: number }) {
  return `${p.route}/${p.order}`
}
function overlaps(start: number, end: number, a: number, b: number) {
  return start < b && end > a
}

export function buildPlanningReport(
  data: PlanningSources,
  selection: PlanningSelection
): PlanningReport {
  const start = planningTime(selection.date, selection.start)
  const end = planningTime(selection.date, selection.end)
  const positions = new Map(data.positions.map((p) => [positionKey(p), p]))
  const services = [...new Set(data.routes.map((r) => r.service))]
  const watchlist = services
    .map((service): ServiceWatch => {
      const routes = data.routes.filter((r) => r.service === service)
      const routeIds = new Set(routes.map((r) => r.id))
      const trips = data.trips.filter((t) => t.service === service)
      const departures = trips.filter(
        (t) =>
          t.departure !== null && t.departure >= start && t.departure <= end
      )
      const delays = departures.flatMap((t) =>
        t.departure !== null &&
        t.scheduled !== null &&
        (t.departure - t.scheduled) / 60 >= selection.delay
          ? [
              {
                trip: t.id,
                vehicle: t.vehicle,
                scheduled: t.scheduled,
                departure: t.departure,
                minutes: (t.departure - t.scheduled) / 60,
              },
            ]
          : []
      )
      const calls = data.calls.filter(
        (c) =>
          routeIds.has(c.route) &&
          positions.get(positionKey(c))?.boarding === 1 &&
          c.observed !== null &&
          c.observed >= start &&
          c.observed <= end &&
          c.queue !== null
      )
      const observed = new Set(calls.map(positionKey))
      const affected = new Set(
        calls.filter((c) => c.queue !== null && c.queue > 0).map(positionKey)
      )
      const peak = calls.reduce<PlanningCall | null>(
        (best, call) =>
          !best || (call.queue ?? -1) > (best.queue ?? -1) ? call : best,
        null
      )
      const vehicleIds = new Set(
        data.vehicles.filter((v) => v.service === service).map((v) => v.id)
      )
      const holds = data.holds.filter(
        (h) =>
          vehicleIds.has(h.vehicle) &&
          h.start !== null &&
          overlaps(h.start, h.end ?? Infinity, start, end)
      )
      const reasons: string[] = []
      if (delays.length)
        reasons.push(
          `${delays.length} departure${delays.length === 1 ? "" : "s"} at least ${selection.delay} min late`
        )
      if (peak && peak.queue !== null && peak.queue >= selection.queue)
        reasons.push(
          `Peak remaining queue ${peak.queue} meets ${selection.queue}-person threshold`
        )
      if (holds.length)
        reasons.push(
          `${holds.length} service-linked maintenance hold${holds.length === 1 ? "" : "s"} overlap the window`
        )
      return {
        service,
        name: routes[0]?.name ?? service,
        priority:
          reasons.length >= 2
            ? "Critical"
            : reasons.length
              ? "High"
              : "No observed trigger",
        reasons,
        delays,
        peak,
        holds,
        observed: observed.size,
        affected: affected.size,
        total: data.positions.filter(
          (p) => routeIds.has(p.route) && p.boarding === 1
        ).length,
        departuresObserved: departures.filter((t) => t.scheduled !== null)
          .length,
        departuresTotal: trips.filter(
          (t) =>
            t.scheduled !== null && t.scheduled >= start && t.scheduled <= end
        ).length,
      }
    })
    .sort(
      (a, b) =>
        b.reasons.length - a.reasons.length ||
        (b.peak?.queue ?? -1) - (a.peak?.queue ?? -1) ||
        Math.max(0, ...b.delays.map((d) => d.minutes)) -
          Math.max(0, ...a.delays.map((d) => d.minutes)) ||
        a.service.localeCompare(b.service, "en", { numeric: true })
    )
  const routes = data.routes.filter((r) => r.service === selection.service)
  const routeIds = new Set(routes.map((r) => r.id))
  return {
    selection,
    watchlist,
    candidates: candidateReviews(data, selection),
    detail: {
      routes,
      positions: data.positions.filter((p) => routeIds.has(p.route)),
      // Full selected-date calls retain earlier queue evidence and the next arrival for replay.
      calls: data.calls.filter((c) => routeIds.has(c.route)),
      trips: data.trips.filter((t) => t.service === selection.service),
    },
  }
}

type Task = {
  id: string
  vehicle: string | null
  crew: string | null
  start: number
  end: number
  ready: number
  from: string
  to: string
}
function candidateReviews(
  data: PlanningSources,
  selection: PlanningSelection
): CandidateReview[] {
  const now = planningTime(selection.date, selection.end)
  const horizon = now + selection.horizon * 60
  const origins = new Set(
    data.routes
      .filter((r) => r.service === selection.service)
      .map((r) => r.origin)
  )
  const tasks: Task[] = [
    ...data.trips.flatMap((t) =>
      t.departure === null || t.arrival === null || t.arrival < t.departure
        ? []
        : [
            {
              id: t.id,
              vehicle: t.vehicle,
              crew: t.crew,
              start: t.departure - 120,
              end: t.arrival + 45,
              ready: t.arrival + 45 + 420,
              from: t.origin,
              to: t.destination,
            },
          ]
    ),
    ...data.movements.flatMap((m) =>
      m.start === null || m.end === null || m.end < m.start
        ? []
        : [
            {
              id: m.id,
              vehicle: m.vehicle,
              crew: m.crew,
              start: m.start,
              end: m.end,
              ready: m.end + 120,
              from: m.from,
              to: m.to,
            },
          ]
    ),
  ]
  const incomplete = [
    ...data.trips
      .filter(
        (t) =>
          t.departure === null || t.arrival === null || t.arrival < t.departure
      )
      .map((t) => ({ vehicle: t.vehicle, crew: t.crew })),
    ...data.movements
      .filter((m) => m.start === null || m.end === null || m.end < m.start)
      .map((m) => ({ vehicle: m.vehicle, crew: m.crew })),
  ]
  const reservedCrew = new Set<string>()
  return [...data.vehicles]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((vehicle): CandidateReview => {
      const base = { vehicle: vehicle.id, assignedService: vehicle.service }
      const unknown = (reason: string): CandidateReview => ({
        ...base,
        status: "unknown",
        reasons: [reason],
      })
      const unavailable = (reason: string): CandidateReview => ({
        ...base,
        status: "unavailable",
        reasons: [reason],
      })
      if (incomplete.some((t) => t.vehicle === vehicle.id))
        return unknown("Vehicle task timing is incomplete")
      const releases = data.releases
        .filter(
          (r) =>
            r.vehicle === vehicle.id && r.issued !== null && r.issued <= now
        )
        .sort((a, b) => (b.issued ?? 0) - (a.issued ?? 0))
      const release = releases[0]
      if (!release || release.start === null || release.end === null)
        return unknown(
          "No complete readiness evidence issued by the decision time"
        )
      if (release.state !== "released")
        return unavailable(`Readiness ${release.id} does not confirm release`)
      if (
        releases.some(
          (r) =>
            r.issued === release.issued &&
            (r.state !== release.state ||
              r.location !== release.location ||
              r.start !== release.start ||
              r.end !== release.end)
        )
      )
        return unknown("Conflicting readiness records")
      if (release.start > now || release.end < horizon)
        return unavailable(
          `Readiness ${release.id} does not cover the requested window`
        )
      const holds = data.holds.filter((h) => h.vehicle === vehicle.id)
      if (holds.some((h) => h.start === null))
        return unknown("Maintenance hold timing is incomplete")
      const hold = holds.find(
        (h) =>
          h.start !== null && overlaps(h.start, h.end ?? Infinity, now, horizon)
      )
      if (hold)
        return unavailable(`Maintenance hold ${hold.id} overlaps the window`)
      const vehicleTasks = tasks.filter((t) => t.vehicle === vehicle.id)
      const conflict = vehicleTasks.find((t) =>
        overlaps(t.start, t.ready, now, horizon)
      )
      if (conflict)
        return unavailable(
          `Task or turnaround ${conflict.id} overlaps the window`
        )
      const last = vehicleTasks
        .filter((t) => t.end <= now)
        .sort((a, b) => b.end - a.end)[0]
      if (!last)
        return unknown(
          "No completed vehicle task to establish turnaround and current location"
        )
      const location =
        last && last.end > (release.issued ?? 0) ? last.to : release.location
      if (!location) return unknown("Vehicle location is unknown")
      if (!origins.has(location))
        return unavailable(
          `Recorded location ${location} is not an origin for service ${selection.service}; positioning needs review`
        )
      const duties = data.duties.filter(
        (d) =>
          d.service === selection.service &&
          d.issued !== null &&
          d.issued <= now
      )
      for (const duty of duties) {
        if (
          reservedCrew.has(duty.crew) ||
          incomplete.some((t) => t.crew === duty.crew)
        )
          continue
        if (
          duty.start === null ||
          duty.end === null ||
          duty.breakStart === null ||
          duty.breakEnd === null ||
          duty.maximum === null ||
          duty.takeover === null
        )
          continue
        if (
          duty.start > now ||
          duty.end < horizon ||
          duty.breakStart > duty.breakEnd
        )
          continue
        const crewDuties = data.duties.filter(
          (d) => d.crew === duty.crew && d.issued !== null && d.issued <= now
        )
        if (
          crewDuties.some(
            (d) =>
              d.breakStart === null ||
              d.breakEnd === null ||
              overlaps(d.breakStart, d.breakEnd, now, horizon)
          )
        )
          continue
        const crewTasks = tasks.filter((t) => t.crew === duty.crew)
        if (crewTasks.some((t) => overlaps(t.start, t.end, now, horizon)))
          continue
        const crewLast = crewTasks
          .filter((t) => t.end <= now)
          .sort((a, b) => b.end - a.end)[0]
        if ((crewLast?.to ?? duty.location) !== location) continue
        const takeover = Math.max(300, duty.takeover)
        if ((crewLast?.end ?? duty.start) + takeover > now) continue
        const first = crewTasks
          .filter((t) => t.start <= now)
          .sort((a, b) => a.start - b.start)[0]
        const dutyLimit = (first?.start ?? duty.start) + duty.maximum * 60
        const nextVehicle = vehicleTasks
          .filter((t) => t.start >= horizon)
          .map((t) => t.start)
        const nextCrew = crewTasks
          .filter((t) => t.start >= horizon)
          .map((t) => t.start)
        const breaks = crewDuties.flatMap((d) =>
          d.breakStart !== null && d.breakStart >= now ? [d.breakStart] : []
        )
        const futureHolds = holds.flatMap((h) =>
          h.start !== null && h.start >= horizon ? [h.start] : []
        )
        const until = Math.min(
          release.end,
          duty.end,
          dutyLimit,
          ...futureHolds,
          ...nextVehicle,
          ...nextCrew,
          ...breaks
        )
        if (until < horizon) continue
        reservedCrew.add(duty.crew)
        return {
          ...base,
          status: "candidate",
          crew: duty.crew,
          location,
          until,
          readiness: release,
          duty,
          turnaroundCompleteAt: last?.ready ?? null,
          dutyLimit,
          evidence: [
            release.id,
            duty.id,
            ...(last ? [last.id] : []),
            ...(crewLast ? [crewLast.id] : []),
          ],
        }
      }
      return unknown(
        "No distinct qualified crew has complete evidence of location, takeover, availability, free duties and protected breaks for this window"
      )
    })
}

export function replayEventTimes(
  detail: Pick<PlanningDetail, "calls" | "trips">,
  start: number,
  end: number
) {
  return [
    ...new Set(
      [
        start,
        end,
        ...detail.calls.flatMap((call) => [
          call.arrival,
          call.observed,
          call.departure,
        ]),
        ...detail.trips.flatMap((trip) => [trip.departure, trip.arrival]),
      ].filter((at): at is number => at !== null && at >= start && at <= end)
    ),
  ].sort((a, b) => a - b)
}

export function replayAt(detail: PlanningDetail, at: number) {
  const queues = detail.positions
    .filter((p) => p.boarding === 1)
    .map((position) => {
      const observation = detail.calls
        .filter(
          (c) =>
            c.route === position.route &&
            c.order === position.order &&
            c.observed !== null &&
            c.observed <= at
        )
        .sort(
          (a, b) =>
            (b.observed ?? 0) - (a.observed ?? 0) ||
            b.trip.localeCompare(a.trip) ||
            b.id.localeCompare(a.id)
        )[0]
      return {
        ...position,
        observation: observation ?? null,
        age:
          observation?.observed !== null && observation?.observed !== undefined
            ? at - observation.observed
            : null,
      }
    })
  const buses = detail.trips.flatMap((trip) => {
    const calls = detail.calls
      .filter((c) => c.trip === trip.id)
      .sort((a, b) => a.order - b.order)
    const dwelling = calls.find(
      (c) =>
        c.arrival !== null &&
        c.departure !== null &&
        c.arrival <= at &&
        c.departure >= at
    )
    if (dwelling)
      return [
        {
          trip: trip.id,
          vehicle: trip.vehicle,
          route: trip.route,
          state: `Recorded dwell at position ${dwelling.order}`,
          evidence: dwelling.id,
        },
      ]
    for (let i = 1; i < calls.length; i++) {
      const prev = calls[i - 1],
        next = calls[i]
      if (
        prev &&
        next &&
        prev.departure !== null &&
        next.arrival !== null &&
        prev.departure < at &&
        next.arrival > at
      ) {
        return [
          {
            trip: trip.id,
            vehicle: trip.vehicle,
            route: trip.route,
            state: `Estimated between positions ${prev.order} and ${next.order}`,
            evidence: `${prev.id}, ${next.id}`,
          },
        ]
      }
    }
    return []
  })
  return { queues, buses }
}
