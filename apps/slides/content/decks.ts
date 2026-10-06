import evidence from "./evidence.json"
import { reviews } from "./review"
import { impacts } from "./impact"

export type SymbolName =
  | "bus"
  | "people"
  | "person"
  | "wrench"
  | "check"
  | "clock"
  | "home"
  | "train"
  | "event"
  | "search"
  | "wind"
  | "heat"
  | "money"
  | "chart"
  | "calendar"
  | "stop"
  | "road"
export type Step = { icon: SymbolName; label: string; concern?: boolean }
export type Visual =
  | {
      kind: "calculation"
      terms: { lines: string[]; value?: string }[]
      operator: "−" | "÷" | "×"
      unit: string
    }
  | {
      kind: "measures"
      items: { value: string; label: string; detail: string }[]
    }
  | {
      kind: "data-request"
      item: {
        icon: SymbolName
        label: string
        detail: string
        uncertainty: string
      }
    }
  | {
      kind: "journey"
      steps: Step[]
      join?: "arrow" | "plus"
      blocked?: number
    }
  | {
      kind: "bars"
      rows: {
        label: string
        value: number
        display: string
        concern?: boolean
      }[]
      unit: string
    }
  | { kind: "workshop"; sequential: false }
  | { kind: "comfort" }
  | { kind: "queue"; waitingPercent: number }
  | { kind: "fleet"; count: number }
  | { kind: "transfer"; connected: false }
  | { kind: "relief"; demand: number; seats: number }
  | {
      kind: "columns"
      rows: { label: string; value: number }[]
      unit: string
      threshold?: number
      thresholdLabel?: string
    }
  | {
      kind: "costmix"
      rows: { label: string; values: number[] }[]
      labels: string[]
    }
  | { kind: "quote"; text: string; attribution: string }
export type Slide = {
  title: string
  caption: string
  source: string
  visual: Visual
  notes: string
  stage: string
}
export type Deck = { id: string; title: string; scope: string; slides: Slide[] }
const history = "Monthly maintenance and mileage records · Oct 2024–Sep 2026"
const operations = "Journey and passenger queue records · 5–16 Oct 2026"
const boarding =
  "Same 07:15 departure at Toa Payoh · ten weekdays in October 2026"
const planning =
  "Requested workshop bookings and service schedule · 19 Oct 2026"
const workshop = "Workshop repair status records · October 2026"
const festival = "Festival bus timetable and capacity plan · 9 Nov 2026"
const incident = "Disruption plan and assumed passenger arrivals · 16 Oct 2026"
const passengers = "Six supplied passenger accounts · October 2026"
const cooling = "Selected cooling repair records · 28 Sep–12 Oct 2026"
const f = (n: number, d = 0) =>
  n.toLocaleString("en-SG", { maximumFractionDigits: d })
const money = (n: number) => `S$${f(n)}`
const step = (icon: SymbolName, label: string, concern = false): Step => ({
  icon,
  label,
  concern,
})
const flow = (steps: Step[]): Visual => ({ kind: "journey", steps })
const bars = (
  unit: string,
  rows: [string, number, string?, boolean?][]
): Visual => ({
  kind: "bars",
  unit,
  rows: rows.map(([label, value, display, concern]) => ({
    label,
    value,
    display: display ?? f(value),
    concern,
  })),
})
const slide = (
  stage: string,
  title: string,
  caption: string,
  source: string,
  visual: Visual,
  notes: string
): Slide => ({ stage, title, caption, source, visual, notes })
const h = evidence.history,
  o = evidence.operations,
  b = evidence.boarding
const rate = (p: typeof h.earlier) => (p.repair / p.km) * 1000
const total = (p: typeof h.earlier) => p.repair + p.preventive + p.servicing
const latestJobs = h.latest.jobs,
  earlierJobs = h.earlier.jobs
const qDays = b.filter((r) => r.remaining > 0),
  emptyDays = b.filter((r) => r.remaining === 0)
const repairs = evidence.coolingJobs,
  repairTotal = repairs.reduce((n, r) => n + r.cost, 0)
const repairHours = repairs.reduce((n, r) => n + r.hours, 0)
const leaders = [...h.vehicles].sort((a, b) => b.repair - a.repair)
const allRepair = leaders.reduce((n, r) => n + r.repair, 0)
const twoRepair = leaders.slice(0, 2).reduce((n, r) => n + r.repair, 0)
const late = [...o.byService]
  .filter((r) => r.late)
  .sort((a, b) => b.late - a.late)
const groups = ["In repair", "Awaiting parts", "Inspection pending"].map(
  (label) => ({
    label,
    value: evidence.workshop.filter((w) => w.work_status === label).length,
  })
)
const fest = evidence.festival.capacityByRoute
const shuttle = fest.find((r) => r.route.endsWith("1"))!,
  connector = fest.find((r) => r.route.endsWith("2"))!
const initial = evidence.incident.requirements["Initial waiting people"],
  demand = initial + evidence.incident.arrivals,
  seats = evidence.incident.baselineCapacity
const protectedTrips = evidence.plannedTrips
const historicalScope = "Same eight selected buses · not the whole fleet"
const operatingScope = "Ten supplied weekdays · not a complete month"
const baseDecks: Deck[] = [
  {
    id: "repair-spend",
    title: "Repair costs were higher in the second year",
    scope: historicalScope,
    slides: [
      slide(
        "How it works",
        "More repairs mean both bills and buses off the road.",
        "The records separate repair charges from time a bus cannot be used.",
        history,
        flow([
          step("wrench", "Repair needed", true),
          step("money", "Repair bill", true),
          step("stop", "Bus unavailable", true),
        ]),
        "Repair spending and time under repair are different measures of the same operational burden. The eight selected buses have complete monthly records across two equal twelve-month periods. Time unavailable does not establish cancelled services or passenger delay."
      ),
      slide(
        "Recorded evidence",
        "Repair spending grew much faster than distance travelled.",
        "Change between the two complete years, for the same eight buses.",
        history,
        bars("Percentage increase from earlier year", [
          [
            "Distance travelled",
            (h.latest.km / h.earlier.km - 1) * 100,
            `${f((h.latest.km / h.earlier.km - 1) * 100, 1)}%`,
          ],
          [
            "Repair spending",
            (h.latest.repair / h.earlier.repair - 1) * 100,
            `${f((h.latest.repair / h.earlier.repair - 1) * 100, 1)}%`,
            true,
          ],
        ]),
        `Earlier year: October 2024–September 2025. Later year: October 2025–September 2026. Repair spend rose from ${money(h.earlier.repair)} to ${money(h.latest.repair)}, while distance rose from ${f(h.earlier.km)} to ${f(h.latest.km)} km. These are incurred repair charges, not quotes.`
      ),
      slide(
        "Recorded evidence",
        "Repair spending per kilometre was higher in the second year.",
        "Repair spending per 1,000 km; this accounts for the increase in use.",
        history,
        bars("Singapore dollars per 1,000 km", [
          ["Earlier year", rate(h.earlier), money(Math.round(rate(h.earlier)))],
          [
            "Later year",
            rate(h.latest),
            money(Math.round(rate(h.latest))),
            true,
          ],
        ]),
        "Dividing repair charges by the distance recorded in the same period makes the comparison more informative than raw bills. The difference remains substantial after allowing for distance. It does not establish whether age, workload, specific faults or other conditions caused the increase."
      ),
      slide(
        "Recorded evidence",
        "The number of repair jobs also rose.",
        "Separate repair visits count as separate jobs; they are not necessarily roadside breakdowns.",
        history,
        bars("Completed repair jobs", [
          ["Earlier year", earlierJobs],
          ["Later year", latestJobs, undefined, true],
        ]),
        `There were ${earlierJobs} corrective jobs in the earlier year and ${latestJobs} in the later year. The increase is not just a comparison of one expensive invoice with many small ones. Jobs can follow faults found between duties; these counts must not be called cancelled trips or breakdowns.`
      ),
      slide(
        "Business significance",
        "Repair bills rose by S$11,255 in this small sample.",
        "Actual annual repair spending; the increase is an expense, not a proven recoverable saving.",
        history,
        bars("Recorded Singapore dollars · same eight buses", [
          ["Earlier year", h.earlier.repair, money(h.earlier.repair)],
          ["Later year", h.latest.repair, money(h.latest.repair), true],
        ]),
        `The recorded difference is ${money(h.latest.repair - h.earlier.repair)}. It is large enough to matter within this sample, but it cannot be extrapolated to the whole fleet or assumed avoidable. Regular servicing and additional preventive work are excluded here and examined separately.`
      ),
    ],
  },
  {
    id: "hvac-comfort",
    title: "Recurring discomfort has a cost",
    scope: "Selected repair history and passenger accounts",
    slides: [
      slide(
        "How it works",
        "Completing the journey does not guarantee a comfortable ride.",
        "A bus can run while passengers experience heat and weak airflow.",
        passengers,
        flow([
          step("bus", "Journey runs"),
          step("heat", "Hot inside", true),
          step("people", "Uncomfortable ride", true),
        ]),
        "Passenger experience includes what happens inside the bus, not only whether it leaves or arrives. The supplied accounts report heat and weak air movement on two journeys. They describe an experience, not a diagnosis of a particular broken part."
      ),
      slide(
        "Recorded evidence",
        "The same bus felt hot on two journeys.",
        "Passenger reports one week apart match the same bus in the journey records.",
        "Passenger accounts and matched departures · 5 and 12 Oct 2026",
        { kind: "comfort" },
        "The two accounts match departures using their stated stop and actual journey time. Both identify heat and weak airflow. These are selected accounts, not a complete complaint history; a wider complaint rate cannot be calculated from them."
      ),
      slide(
        "Recorded evidence",
        "Three cooling repairs appear within fifteen days.",
        "One bus, three separate recorded jobs; similar symptoms had different findings.",
        cooling,
        bars(
          "Recorded repair charge · Singapore dollars",
          repairs.map((r) => [
            `${new Date(r.date + "T00:00:00Z").getUTCDate()} ${r.date.includes("-09-") ? "Sep" : "Oct"}`,
            r.cost,
            money(r.cost),
            true,
          ])
        ),
        "The findings were a cooling-fluid hose leak, dirty filter and cooling surfaces, and an intermittent fan-control relay. Similar symptoms do not prove that one fault remained unfixed. The September charge is already included in monthly history and must not be added to it again."
      ),
      slide(
        "Recorded evidence",
        "The cooling jobs also took the bus out of use.",
        `Recorded repair holds total ${f(repairHours, 1)} hours; these are not passenger-delay hours.`,
        cooling,
        bars(
          "Hours from repair opening to signed release",
          repairs.map((r) => [
            `${new Date(r.date + "T00:00:00Z").getUTCDate()} ${r.date.includes("-09-") ? "Sep" : "Oct"}`,
            r.hours,
            `${f(r.hours, 1)} h`,
            true,
          ])
        ),
        "Durations are calculated from each job’s opening and confirmed release times. These selected jobs followed duties; no cancelled service is established by these records. Staff labour hours and workshop elapsed hours are also not the same quantity."
      ),
      slide(
        "Business significance",
        "Repair spending and passenger discomfort occurred together.",
        `${money(repairTotal)} across the three jobs; the effect on repeat travel is unknown.`,
        cooling,
        flow([
          step("money", `${money(repairTotal)} in repairs`, true),
          step("heat", "Repeat discomfort", true),
          step("people", "Future travel: ?"),
        ]),
        "The repeated experience and recorded costs make this a specific business problem, rather than an abstract concern about comfort. The evidence does not establish lost customers, reduced fares or a fault-reduction benefit. No customer-retention records are present in the supplied reports."
      ),
    ],
  },
  {
    id: "service-reliability",
    title: "A small number of delays can disrupt journeys",
    scope: operatingScope,
    slides: [
      slide(
        "How it works",
        "Passengers rely on the time, not just the bus.",
        "Leaving late can affect work, appointments and connections.",
        operations,
        flow([
          step("clock", "Promised departure"),
          step("stop", "Extra waiting", true),
          step("people", "Journey disrupted", true),
        ]),
        "Departure delay and arrival delay describe different parts of the experience. The operating data records both against the published timetable. Five minutes is an analytical threshold for these slides, not a supplied contractual service standard."
      ),
      slide(
        "Recorded evidence",
        "Late arrivals are more common than late starts.",
        "Journeys more than five minutes late, among 6,900 recorded trips.",
        operations,
        bars("Trips over five minutes late · overlapping groups", [
          ["Late departure", o.late],
          ["Late arrival", o.arrivalLate, undefined, true],
        ]),
        "The departure and arrival counts overlap and must not be added as unique disrupted journeys. A bus can leave near its scheduled time and encounter delay en route. These counts alone do not establish the cause, passenger count or revenue effect."
      ),
      slide(
        "Recorded evidence",
        "Every late start falls on three routes.",
        "The most affected route has 24 late starts out of 280 departures.",
        operations,
        bars(
          "Late starts · routes ranked by count",
          late.map((r, i) => [
            ["Most affected", "Next most affected", "Third affected"][i]!,
            r.late,
            `${r.late} / ${r.trips}`,
            true,
          ])
        ),
        "The descriptive labels avoid internal route references. These are counts with the trip denominators displayed. The rates differ: 24 of 280, 17 of 280 and 7 of 220. All other supplied routes have no departures beyond the five-minute threshold in this extract."
      ),
      slide(
        "Passenger evidence",
        "One passenger abandoned the delayed journey.",
        "A direct account, not an estimate of company-wide customer loss.",
        "Passenger account · Toa Payoh morning departure · 7 Oct 2026",
        {
          kind: "quote",
          text: "I gave up and made other arrangements",
          attribution: "Passenger reporting a delayed morning bus",
        },
        "The passenger expected the 06:20 departure and reported giving up before the bus arrived. This is evidence of an abandoned intended journey. It does not show whether a fare was lost, whether the person was a new customer, or whether they stopped using the operator later."
      ),
      slide(
        "Business significance",
        "A completed-trip total hides the customer experience.",
        "All 6,900 trips completed, yet 100 arrived over five minutes late.",
        operations,
        flow([
          step("check", `${f(o.completed)} trips completed`),
          step("clock", `${o.arrivalLate} late arrivals`, true),
          step("people", "Customer impact"),
        ]),
        "Completion is not a complete measure of useful service. The source shows a reliability problem despite every recorded trip completing. Additional passenger accounts describe lateness for work. No contract penalties or monetary customer losses are supplied."
      ),
    ],
  },
  {
    id: "crowding",
    title: "Some passengers cannot board the bus they need",
    scope: operatingScope,
    slides: [
      slide(
        "How it works",
        "A running bus can still leave people behind.",
        "Passengers need space at their stop and at the time they travel.",
        operations,
        flow([
          step("people", "Waiting passengers"),
          step("bus", "Limited places"),
          step("stop", "Some still waiting", true),
        ]),
        "A bus’s capacity is the maximum number of people it can carry, including standing places. Stop-level queues reveal where demand and available places do not line up. A queue alone does not prove that a bus was full; the detailed boarding example below does."
      ),
      slide(
        "Recorded evidence",
        "A queue remained after about 9 in 100 stops.",
        "22,210 of 252,380 recorded stop visits; rounded in the picture.",
        operations,
        { kind: "queue", waitingPercent: (o.queuedCalls / o.calls) * 100 },
        "The exact share is 8.8%. Each dot represents one percentage point of stop visits, not a person. One passenger might remain in a queue through several buses, so this is not a unique count of people denied boarding."
      ),
      slide(
        "Recorded evidence",
        "The same morning bus left people waiting on eight days.",
        "People remaining after the 07:15 departure, on all ten supplied weekdays.",
        boarding,
        {
          kind: "columns",
          unit: "People still waiting after departure",
          rows: b.map((r) => ({ label: r.date.slice(8), value: r.remaining })),
        },
        `Eight departures were full and left queues, ranging from ${Math.min(...qDays.map((r) => r.remaining))} to ${Math.max(...qDays.map((r) => r.remaining))} people. The other two left no queue. This covers all ten supplied dates for this selected departure, not only the day that generated a complaint.`
      ),
      slide(
        "Passenger evidence",
        "A passenger describes waiting for the next bus.",
        "The 6 October account matches a departure that left 30 people waiting.",
        "Passenger account and origin boarding record · 6 Oct 2026",
        {
          kind: "quote",
          text: "I got on the next bus around 07:30",
          attribution: "Passenger unable to board the 07:15 bus",
        },
        "The account reports that the additional wait disrupted their morning. The matching origin record has 115 waiting, 85 boarding and 30 remaining. The passenger says they travelled later, so this case cannot be presented as a lost customer or lost fare."
      ),
      slide(
        "Business significance",
        "Demand exceeded places on repeated mornings.",
        "Eight full departures show unmet demand at that time, not proven lost revenue.",
        boarding,
        bars("Selected departure · people", [
          ["Bus capacity", b[0]!.capacity],
          [
            "Lowest busy-day queue",
            Math.min(...qDays.map((r) => r.waiting)),
            undefined,
            true,
          ],
          [
            "Highest busy-day queue",
            Math.max(...qDays.map((r) => r.waiting)),
            undefined,
            true,
          ],
        ]),
        "The busy-day demand range is compared with the actual 85-person bus capacity. These are people waiting before boarding, not people left behind. Later departures may carry them; fare rules, abandonment and customer histories are not supplied, so additional revenue cannot be calculated."
      ),
    ],
  },
  {
    id: "capacity-use",
    title: "Bus use varies sharply at the same departure",
    scope: "One morning departure · all ten supplied dates",
    slides: [
      slide(
        "How it works",
        "Empty places and long queues can coexist.",
        "An average hides how demand changes from day to day.",
        boarding,
        flow([
          step("bus", "Fixed bus capacity"),
          step("calendar", "Different demand"),
          step("people", "Uneven use", true),
        ]),
        "The selected departure uses the same recorded 85-person capacity on each supplied day. A daily boarding record shows how much of that capacity is used at the starting stop. This does not measure occupancy for the entire route."
      ),
      slide(
        "Recorded evidence",
        "Eight departures were full; two were far below capacity.",
        "Boardings at the same origin and departure time; the dashed line is bus capacity.",
        boarding,
        {
          kind: "columns",
          unit: "People boarding · October dates",
          rows: b.map((r) => ({ label: r.date.slice(8), value: r.boarded })),
          threshold: 85,
          thresholdLabel: "85 places",
        },
        "The eight busy days each boarded 85 people and left a queue. On 9 October only 18 boarded, and on 16 October 26 boarded. Later stops can fill the bus; the empty capacity shown here is only at this origin departure."
      ),
      slide(
        "Recorded evidence",
        "On the quieter days, most places were empty at departure.",
        "18 and 26 boardings on a bus with room for 85 people.",
        boarding,
        bars(
          "Origin capacity used · percentage",
          emptyDays.map((r) => [
            `${r.date.slice(8)} October`,
            (r.boarded / r.capacity) * 100,
            `${f((r.boarded / r.capacity) * 100)}%`,
          ])
        ),
        "The percentages are about 21% and 31%. Empty places are not equal to avoidable operating cost: the bus may be needed for later stops, accessibility and the timetable. Fuel, driver costs and whole-route revenue are not supplied here."
      ),
      slide(
        "Recorded evidence",
        "The network average also hides local crowding.",
        "Average recorded occupancy was 36%, yet queues remained at 8.8% of stop visits.",
        operations,
        bars("Percent · different measures, not complementary shares", [
          ["Average occupancy", o.meanOccupancy, `${f(o.meanOccupancy)}%`],
          [
            "Stops leaving queues",
            (o.queuedCalls / o.calls) * 100,
            `${f((o.queuedCalls / o.calls) * 100, 1)}%`,
            true,
          ],
        ]),
        "Occupancy is the unweighted average of departing occupancy ratios across stop calls, not a time-weighted or passenger-kilometre load factor. The queue measure counts stops with anyone remaining. The two measures have different meanings and do not add to 100%. Neither proves that spare capacity can be moved freely."
      ),
      slide(
        "Business significance",
        "Capacity use varies too much for one average to explain it.",
        "Origin boardings span 18 to 85 on the selected departure.",
        boarding,
        bars("People boarding at the same starting stop", [
          ["Quietest supplied day", Math.min(...b.map((r) => r.boarded))],
          ["Busiest supplied days", Math.max(...b.map((r) => r.boarded))],
        ]),
        "The combination of repeated queues and lightly used departures establishes a demand-matching question. It does not establish a removable bus, a feasible timetable change or a revenue forecast. Whole-route demand and operating costs determine the commercial significance."
      ),
    ],
  },
  {
    id: "workshop-scheduling",
    title: "Workshop bookings conflict with available resources",
    scope: "Future planning records · 19 October 2026",
    slides: [
      slide(
        "How it works",
        "A bus cannot be serviced and carry passengers at once.",
        "Maintenance competes for workshop space, mechanics and replacement buses.",
        planning,
        flow([
          step("wrench", "Workshop time"),
          step("person", "Mechanic time"),
          step("bus", "Bus off the road", true),
        ]),
        "The supplied plan describes a single workshop space and two mechanics. Two requested jobs require buses that also have scheduled passenger journeys. The evidence is a future planning conflict, not an observed service cancellation."
      ),
      slide(
        "Planning evidence",
        "Two jobs are booked into one workshop space.",
        "Both requested bookings start at 09:00, creating two hours of overlap.",
        planning,
        { kind: "workshop", sequential: false },
        "One requested job lasts 09:00–13:00 and the other 09:00–11:00. Both require one space. The workshop has one space continuously available 09:00–17:00. The diagram shows the requested bookings exactly; no alternative schedule is presented."
      ),
      slide(
        "Planning evidence",
        "The overlapping jobs also need too many mechanics.",
        "At 09:00, one job needs two people and the other needs one.",
        planning,
        bars("Mechanics during the overlap", [
          ["Available", 2],
          ["Required", 3, undefined, true],
        ]),
        "The source lists two mechanics available, versus three required when both jobs run together. Counting total staffing hours would hide this simultaneous resource conflict. The record does not establish overtime costs or an approved staffing change."
      ),
      slide(
        "Planning evidence",
        "Eight passenger trips depend on the two buses.",
        "Only one replacement bus is named in the supplied plan.",
        planning,
        bars("Buses · not the number of journeys", [
          ["Buses requesting work", evidence.requests.length, undefined, true],
          ["Named replacement buses", 1],
        ]),
        `There are ${protectedTrips} protected journeys across the two buses. The single replacement bus has specific morning and afternoon windows and uses the assigned duty drivers. Two windows are not two buses. No other bus is confirmed available in this bounded future roster.`
      ),
      slide(
        "Business significance",
        "Time exists in the day, but the bookings collide.",
        "Six requested workshop hours fit within eight opening hours; the conflict is when they occur.",
        planning,
        bars("Workshop-space hours", [
          ["Total requested", 6],
          ["Available across day", 8],
        ]),
        "Total hours alone make the plan look comfortable, but simultaneous space, mechanics, bus cover and safety approval create constraints. This demonstrates a planning-efficiency problem. It is not a validated alternative schedule or evidence that all work can safely fit under uncertain repair scope."
      ),
    ],
  },
  {
    id: "fleet-availability",
    title: "Workshop estimates do not establish usable buses",
    scope: "Separate group of eight workshop buses",
    slides: [
      slide(
        "How it works",
        "Repair completion and permission to run are different events.",
        "A bus needs recorded safety approval before returning to passenger service.",
        workshop,
        flow([
          step("wrench", "Repair work"),
          step("clock", "Expected finish"),
          step("check", "Safety approval"),
        ]),
        "The expected finish is an estimate. A recorded release is a confirmed approval. Missing release records create uncertainty about usable resources; they do not prove a bus remained held for every day after its estimated completion."
      ),
      slide(
        "Recorded evidence",
        "Eight buses are listed; none has a recorded safety sign-off.",
        "This workshop extract contains no confirmed releases.",
        workshop,
        { kind: "fleet", count: evidence.workshop.length },
        "Each symbol represents one workshop bus. These eight buses are separate from the 172 buses in the operating timetable. Their absence from the available pool is not evidence of an equivalent number of cancelled services or a company-wide availability percentage."
      ),
      slide(
        "Recorded evidence",
        "The work is held at different stages.",
        "The eight current status records include repairs, parts waits and pending inspections.",
        workshop,
        bars(
          "Workshop buses by supplied status",
          groups.map((g) => [g.label, g.value])
        ),
        "Three buses are in repair, three await parts and two await inspection. The status categories describe the supplied records. They do not measure how long each stage lasted or how much time is recoverable."
      ),
      slide(
        "Evidence gap",
        "Estimated finishes exist; confirmed releases do not.",
        "Eight estimates are not eight usable buses.",
        workshop,
        bars("Records in the workshop extract", [
          [
            "Expected finish supplied",
            evidence.workshop.filter((w) => w.expected_completion_at).length,
          ],
          [
            "Confirmed release supplied",
            evidence.workshop.filter((w) => w.confirmed_release_at).length,
          ],
        ]),
        "The estimated dates span 6–16 October. No later actual release is supplied, so elapsed calendar time cannot safely be converted into actual downtime. This is a visibility limitation in the supplied data, not proof that the business has no approval process elsewhere."
      ),
      slide(
        "Business significance",
        "The available-bus count is uncertain at the planning point.",
        "Parts, repair and approval status affect whether another service can be promised.",
        workshop,
        flow([
          step("wrench", "Unfinished work", true),
          step("check", "Approval unconfirmed", true),
          step("bus", "Usable capacity: ?"),
        ]),
        "The business exposure is uncertainty when allocating buses and cover. Recoverable bus-hours, rental spending and missed journeys are not quantified in these records. The evidence supports the importance of availability accuracy without asserting a saving or a dispatch solution."
      ),
    ],
  },
  {
    id: "festival-allocation",
    title: "The festival plan has an end-to-end capacity gap",
    scope: "Future timetable · not observed attendance",
    slides: [
      slide(
        "How it works",
        "Some festival passengers depend on two connected buses.",
        "Places on the onward bus do not help someone who cannot reach it.",
        festival,
        flow([
          step("event", "Festival"),
          step("bus", "Shuttle"),
          step("bus", "Onward bus"),
          step("home", "Destination"),
        ]),
        "The temporary shuttle links the fictional venue to a connecting service. Some people may ride both legs. Counts of boardings or available places on the two legs cannot simply be added as unique people served."
      ),
      slide(
        "Planning evidence",
        "The listed onward capacity is more than twice the shuttle capacity.",
        "Total planned places across listed departures; includes the provisional onward allocation.",
        festival,
        bars("Passenger places · separate legs", [
          ["Venue shuttle", shuttle.spaces],
          ["Onward connection", connector.spaces, undefined, true],
        ]),
        "The shuttle has three departures of 85 places: 255 total. The onward service has 340 regular places plus 256 provisional places: 596 total. This is an imbalance in the listed plan, not proof of unused seats or unmet demand. Actual attendance and precise passenger flows are absent."
      ),
      slide(
        "Planning evidence",
        "The final shuttle arrives after the final onward departure.",
        "22:30 shuttle + 35-minute ride = 23:05 arrival; the last onward bus leaves at 22:45.",
        festival,
        { kind: "transfer", connected: false },
        "The 35-minute ride is a supplied planning allowance, not a measured travel time. The final arrival is 20 minutes after the last listed onward departure, before even allowing transfer time. No passenger has yet been observed making or missing this future connection."
      ),
      slide(
        "Planning evidence",
        "Eighty-five shuttle places face that last-connection gap.",
        "One of the three listed shuttle departures arrives too late for the onward bus.",
        festival,
        bars("Listed shuttle places", [
          ["Earlier departures", 170],
          ["Final departure", 85, undefined, true],
        ]),
        "The final 22:30 shuttle has a capacity of 85. This is capacity exposed to a missing onward connection, not 85 confirmed stranded passengers. Some riders may not need the connection, and the plan supplies no within-hour transfer-demand counts."
      ),
      slide(
        "Business significance",
        "Bus totals overstate what the whole journey can deliver.",
        "The transfer timing and unequal capacity constrain the usefulness of the plan.",
        festival,
        flow([
          step("event", "Event demand: ?"),
          step("bus", `${shuttle.spaces} shuttle places`),
          step("clock", "Last transfer missed", true),
          step("home", "Complete journeys: ?"),
        ]),
        "The commercial question concerns passenger journeys that the complete service can carry, not the sum of route capacity. No event revenue, operator payment basis or actual demand is supplied. The evidence establishes a planning gap, not a monetary return or an allocation recommendation."
      ),
    ],
  },
  {
    id: "incident-relief",
    title: "The disruption plan cannot clear the assumed queue",
    scope: "Bounded planning scenario · 16 October 2026",
    slides: [
      slide(
        "How it works",
        "People keep arriving while replacement buses make their trips.",
        "When trains stop, the queue depends on arrivals and available bus places.",
        incident,
        flow([
          step("train", "Train disruption", true),
          step("people", "Queue grows"),
          step("bus", "Limited departures"),
        ]),
        "The scenario assumes no confirmed train restoration through 19:00. The demand model begins with an existing queue and adds arrivals over four half-hour periods. These are supplied assumptions, not live observations or a forecast."
      ),
      slide(
        "Planning evidence",
        "There are 292 people to carry and only 170 places.",
        "Initial queue plus assumed arrivals, compared with the two committed departures.",
        incident,
        { kind: "relief", demand, seats },
        "The arithmetic is 112 initially waiting plus 180 subsequent arrivals, versus two departures with 85 places each. Both departures have enough waiting demand to fill. The result assumes no abandonment or route switching, and accessible boarding."
      ),
      slide(
        "Planning evidence",
        "More people arrive in every half-hour of the scenario.",
        "Assumed new arrivals from 17:00 to 19:00; the initial queue is additional.",
        incident,
        {
          kind: "columns",
          unit: "Assumed new arrivals in each half-hour",
          rows: [
            { label: "17:00", value: 60 },
            { label: "17:30", value: 50 },
            { label: "18:00", value: 40 },
            { label: "18:30", value: 30 },
          ],
        },
        "Arrivals are assumed uniformly distributed within each supplied half-hour. This is why a comparison of one initial queue with one bus would understate the pressure. These assumptions are only for this bounded fictional incident."
      ),
      slide(
        "Planning evidence",
        "The two planned departures leave 122 people waiting.",
        "About 42% of the assumed demand remains at 19:00.",
        incident,
        bars("People in the supplied scenario", [
          ["Carried by planned buses", seats],
          ["Still waiting at 19:00", demand - seats, undefined, true],
        ]),
        "This is a scenario balance, not observed abandonment or lost customers. The remaining queue is 122 divided by 292, or 41.8% of the assumed demand. Waiting duration and the monetary consequences require additional calculation and commercial data."
      ),
      slide(
        "Business significance",
        "Spare driver time does not establish a spare bus.",
        "The named relief driver is available, but the candidate bus remains held.",
        incident,
        {
          kind: "journey",
          steps: [
            step("person", "Relief driver ready"),
            step("stop", "Candidate bus held", true),
            step("people", "122 still waiting", true),
          ],
          blocked: 0,
        },
        "The candidate bus has no confirmed safety release at the planning snapshot. Seven other buses and crews retain their evening commitments. This identifies a resource constraint in the response plan; no instruction to divert services or accelerate a release is being proposed."
      ),
    ],
  },
  {
    id: "investment-options",
    title: "Maintenance spending is broader than repair bills",
    scope: historicalScope,
    slides: [
      slide(
        "How it works",
        "Keeping a bus running creates several different costs.",
        "Regular servicing, extra preventive work and repairs are separate charges.",
        history,
        flow([
          step("calendar", "Regular servicing"),
          step("wrench", "Extra checks"),
          step("money", "Repair bills"),
        ]),
        "These are distinct categories in the canonical monthly ledger. Annual summaries and selected job records overlap the same ledger and cannot be added as extra spending. Supplier quotes are not included because they are proposed purchases, not incurred costs."
      ),
      slide(
        "Recorded evidence",
        "Total recorded maintenance spending rose to S$81,835.",
        "All three categories for the same eight buses, in equal twelve-month periods.",
        history,
        {
          kind: "costmix",
          labels: ["Regular servicing", "Extra checks", "Repairs"],
          rows: [
            {
              label: "Earlier year",
              values: [
                h.earlier.servicing,
                h.earlier.preventive,
                h.earlier.repair,
              ],
            },
            {
              label: "Later year",
              values: [
                h.latest.servicing,
                h.latest.preventive,
                h.latest.repair,
              ],
            },
          ],
        },
        `Total earlier spending is ${money(total(h.earlier))}; later spending is ${money(total(h.latest))}. These include labour and parts recorded in the monthly source. They exclude fuel, wages outside the job charges, financing and unpriced replacement cover.`
      ),
      slide(
        "Recorded evidence",
        "Repair spending drives most of the increase.",
        "Changes in recorded charges between the two years.",
        history,
        bars(
          "Increase in Singapore dollars · preventive spending fell separately",
          [
            [
              "Regular servicing",
              h.latest.servicing - h.earlier.servicing,
              money(h.latest.servicing - h.earlier.servicing),
            ],
            [
              "Repairs",
              h.latest.repair - h.earlier.repair,
              money(h.latest.repair - h.earlier.repair),
              true,
            ],
          ]
        ),
        `The increase is ${money(total(h.latest) - total(h.earlier))} overall. Regular service charges rose ${money(h.latest.servicing - h.earlier.servicing)}, repair charges rose ${money(h.latest.repair - h.earlier.repair)}, and extra preventive charges fell by ${money(h.earlier.preventive - h.latest.preventive)}. A decline in preventive spending does not prove that it caused the rise in repairs.`
      ),
      slide(
        "Recorded evidence",
        "Two buses account for almost half the repair spending.",
        "Two-year repair charges within the eight-bus sample; buses ranked by total cost.",
        history,
        bars("Singapore dollars · full two-year period", [
          [
            "Highest-cost bus",
            leaders[0]!.repair,
            money(leaders[0]!.repair),
            true,
          ],
          [
            "Second-highest",
            leaders[1]!.repair,
            money(leaders[1]!.repair),
            true,
          ],
          [
            "Other six combined",
            allRepair - twoRepair,
            money(allRepair - twoRepair),
          ],
        ]),
        `The highest two buses account for ${money(twoRepair)} of ${money(allRepair)}, or ${f((twoRepair / allRepair) * 100, 1)}%. The group of six is combined, not an average bus. These raw totals differ in mileage and do not prove vehicle age or a particular component caused the difference.`
      ),
      slide(
        "Business significance",
        "More time under repair adds an operational burden.",
        "Repair-related unavailability increased from 151 to 265 hours.",
        history,
        bars("Recorded repair-unavailable hours", [
          ["Earlier year", h.earlier.holds, `${f(h.earlier.holds)} h`],
          ["Later year", h.latest.holds, `${f(h.latest.holds)} h`, true],
        ]),
        "These are elapsed vehicle hold hours, not mechanic labour hours or passenger delay. They can create demand for cover but the source does not price that cover or show cancelled departures. The hours are evidence of operating pressure, not a guaranteed recoverable benefit."
      ),
    ],
  },
  {
    id: "customer-growth",
    title: "Boarding counts do not explain customer growth",
    scope: "Supplied operating and passenger reports only",
    slides: [
      slide(
        "How it works",
        "A boarding, a customer and revenue are different things.",
        "One person can board repeatedly, transfer, or pay under different arrangements.",
        operations,
        flow([
          step("bus", "Boarding events"),
          step("people", "Distinct customers"),
          step("money", "Operator revenue"),
        ]),
        "Counting bus entries does not identify unique customers, whether they are new, or what the operator earns. The commercial model could involve fares, contracts or other payments; it is not supplied in these reports. A boarding cannot automatically be multiplied by an assumed fare."
      ),
      slide(
        "Recorded evidence",
        "The reports record over two million boardings.",
        "Across 6,900 trips; these are events, not two million distinct customers.",
        operations,
        flow([
          step("bus", `${f(o.trips)} trips`),
          step("people", `${f(o.boardings)} boardings`),
          step("money", "Revenue: unknown"),
        ]),
        "The complete operating extract has 2,048,591 boarding events across 6,900 trips and 252,380 stop visits. Repeat travel and transfers may count the same person multiple times. There is no payment or customer-identity field linking these events to customer acquisition."
      ),
      slide(
        "Passenger evidence",
        "There is a direct sign of an abandoned intended journey.",
        "One supplied account says the passenger made other arrangements after waiting.",
        "Passenger account · delayed morning bus · 7 Oct 2026",
        {
          kind: "quote",
          text: "I gave up and made other arrangements",
          attribution:
            "One selected account; later customer behaviour is unknown",
        },
        "This is a concrete sign of friction before completing a journey. The same report set also includes a person who waited for the next bus and someone whose changed bus ran as expected. These six selected accounts are not a random customer sample or a churn measure."
      ),
      slide(
        "Evidence gap",
        "New customers and repeat customers are not identified.",
        "The supplied data cannot separate acquisition, repeat travel and transfers.",
        operations,
        flow([
          step("people", "Boardings: recorded"),
          step("search", "New customers: ?"),
          step("calendar", "Repeat travel: ?"),
        ]),
        "This is a gap in the supplied material, not proof that the company has no customer systems. There are no acquisition channels, customer groups, campaign costs or repeat-customer identifiers here. Those absences prevent a defensible acquisition cost, retention rate or campaign return calculation."
      ),
      slide(
        "Business significance",
        "The commercial value of better service remains unpriced.",
        "Demand and customer friction are visible; extra revenue and retention gains are not established.",
        "Operating records and six passenger accounts · October 2026",
        flow([
          step("people", "Demand exists"),
          step("stop", "Some journeys disrupted", true),
          step("money", "Revenue effect: ?"),
        ]),
        "Recurring queues, discomfort and the abandoned-journey account justify attention to the customer experience. They do not establish how much revenue can be gained, which customers can be acquired, or which intervention works. No solution, spend request or financial uplift is presented."
      ),
    ],
  },
]

export const decks: Deck[] = baseDecks.map((deck) => {
  const review = reviews[deck.id]!
  const impact = impacts[deck.id]
  return {
    ...deck,
    slides: [
      ...deck.slides.slice(0, 4).map((slide, index) => ({
        ...slide,
        notes: `${slide.notes}${index > 0 ? `\n\nInterpretation: ${review.caveats[index - 1]}` : ""}`,
      })),
      ...review.items.map((item, index): Slide => ({
        stage: "Stakeholder data request",
        title: `${review.uncertainties[index]}.`,
        caption: `Please share ${item.label.charAt(0).toLowerCase() + item.label.slice(1)}: ${item.detail.charAt(0).toLowerCase() + item.detail.slice(1)}.`,
        source: deck.slides[4]!.source,
        visual: {
          kind: "data-request",
          item: { ...item, uncertainty: review.uncertainties[index]! },
        },
        notes: `This page concerns one gap: ${review.uncertainties[index]}. Request the existing ${item.label.toLowerCase()} (${item.detail.toLowerCase()}). The request extends the supplied material, not the operator's data-collection obligations. Confirm what is already retained before discussing additional analysis. These are fictional exercise records; validate against actual business records.`,
      })),
      ...(impact ? [impact] : []),
    ],
  }
})
