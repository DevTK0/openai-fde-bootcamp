import type { SymbolName } from "./decks"

type RequestItem = { icon: SymbolName; label: string; detail: string }
export type EvidenceReview = {
  caveats: string[]
  uncertainties: string[]
  question: string
  caption: string
  items: RequestItem[]
  notes: string
}

// Requests extend routine reports or source documents; they do not require new research.
export const reviews: Record<string, EvidenceReview> = {
  "repair-spend": {
    uncertainties: [
      "Only two years supplied",
      "Only eight buses included",
      "Monthly totals hide individual jobs",
    ],
    caveats: [
      "Two years show a difference, not a sustained trend; only eight selected buses are included.",
      "Distance is accounted for; bus age, workload, prices and one-off repairs are not.",
      "More jobs may reflect more inspections or changed recording, as well as more faults.",
      "The increase is not a recoverable saving and cannot be applied to the whole fleet.",
    ],
    question: "Extend the maintenance history before calling this a trend.",
    caption: "Existing records to add to the supplied reports.",
    items: [
      {
        icon: "calendar",
        label: "Earlier monthly records",
        detail: "Earlier years, if retained",
      },
      {
        icon: "bus",
        label: "The same fleet-wide report",
        detail: "Repair costs and mileage",
      },
      {
        icon: "money",
        label: "Repair invoices and job sheets",
        detail: "Parts, labour and major repairs",
      },
    ],
    notes:
      "Request earlier years of the same monthly maintenance and mileage report, records for the other buses, and the underlying repair invoices or job sheets. Start with records already held; no new study is needed. Older records help distinguish a persistent increase from an unusual year. Wider coverage tests whether the eight selected buses represent the fleet; invoice detail separates price changes and major one-off work.",
  },
  "hvac-comfort": {
    uncertainties: [
      "Only three selected jobs supplied",
      "Only selected passenger accounts",
    ],
    caveats: [
      "Two selected accounts on one bus cannot establish how common discomfort is.",
      "Different findings can produce similar symptoms; repeated visits do not prove unsuccessful repairs.",
      "Workshop hours are not cancelled trips, passenger delays or staff labour hours.",
      "Costs and complaints occurred together; customer loss and a shared cause are unproven.",
    ],
    question: "Extend the cooling-repair and complaint records.",
    caption: "Existing records to add to the supplied reports.",
    items: [
      {
        icon: "wrench",
        label: "Full cooling-repair job history",
        detail: "Earlier jobs and other buses",
      },
      {
        icon: "people",
        label: "Existing complaint register",
        detail: "Earlier months, if retained",
      },
    ],
    notes:
      "Request the existing cooling-repair job cards, invoices and release records for earlier periods and other buses. If a complaint register is maintained, request the already-recorded cooling complaints over the same period. This extends supplied records rather than asking for cabin sensors, passenger follow-up or new customer research. Complaint counts need a service denominator and are not a representative measure of all passenger experiences.",
  },
  "service-reliability": {
    uncertainties: [
      "Only ten weekdays supplied",
      "Only a short timetable window",
      "Financial penalties not supplied",
    ],
    caveats: [
      "Ten weekdays may be unusual; five minutes is an analytical threshold, not an agreed service standard.",
      "The route pattern is limited to this extract and does not establish the cause of delays.",
      "One abandoned journey does not establish a lost fare or a customer who never returned.",
      "Trip counts do not measure affected passengers, missed connections or financial consequences.",
    ],
    question: "Extend the operating records beyond ten weekdays.",
    caption: "Existing records to add to the supplied reports.",
    items: [
      {
        icon: "calendar",
        label: "Earlier operating extracts",
        detail: "More months, including weekends",
      },
      {
        icon: "clock",
        label: "Published timetable history",
        detail: "Schedules for the same dates",
      },
      {
        icon: "money",
        label: "Service contracts and invoices",
        detail: "Agreed penalties and deductions",
      },
    ],
    notes:
      "Request more months of the same scheduled and actual departure and arrival records, including weekends, plus timetable versions covering those dates. For financial consequences, request applicable service contracts and actual penalty deductions or invoices already held by finance. These records can show recurring performance and recorded penalties without requiring passenger-level journey matching or estimates of abandoned travel.",
  },
  crowding: {
    uncertainties: ["Only ten weekdays supplied"],
    caveats: [
      "Queue observations can count the same person repeatedly; a queue alone does not prove a full bus.",
      "One departure over ten weekdays does not establish the pattern across routes or seasons.",
      "This passenger boarded later; the account does not demonstrate a lost sale.",
      "Demand at that time is visible; extra revenue depends on later travel and the payment model.",
    ],
    question: "Extend the boarding history beyond ten weekdays.",
    caption: "Existing records to add to the supplied reports.",
    items: [
      {
        icon: "calendar",
        label: "Earlier boarding extracts",
        detail: "Earlier months, including weekends",
      },
    ],
    notes:
      "The supplied operating data already covers 6,900 trips across 24 routes, with detailed stop records for other and following departures. The one-departure comparison was an analytical selection, not missing data. Request earlier months and weekends of the same boarding and queue records to test whether the ten-weekday pattern persists. Do not request other trips already supplied, passenger identities or abandonment research. The current extract covers morning departures with downstream calls retained; additional history is a coverage request, not evidence of corrupt or erroneous records.",
  },
  "capacity-use": {
    uncertainties: [
      "Only ten weekdays supplied",
      "Operating costs not supplied",
    ],
    caveats: [
      "This is one starting stop over ten weekdays; later stops may fill the bus.",
      "Empty places at departure do not establish that a bus or its operating cost is avoidable.",
      "These measures have different denominators; average occupancy is not weighted by distance or time.",
      "Whole-route demand, service commitments and operating costs determine the commercial significance.",
    ],
    question: "Extend the passenger counts and operating-cost records.",
    caption: "Existing records to add to the supplied reports.",
    items: [
      {
        icon: "calendar",
        label: "Earlier operating extracts",
        detail: "More months and weekends",
      },
      {
        icon: "money",
        label: "Existing cost reports",
        detail: "Fuel, driver pay and bus costs",
      },
    ],
    notes:
      "Complete-route stop-by-stop counts are already supplied. Request earlier dates of the same extract; do not request other trips already available. Ask for routine fuel, payroll and bus-expense reports at the level already maintained; do not require a new allocation of every cost to every passenger. This extends reporting the operator has already demonstrated it holds. Full-route records distinguish an empty origin from a quiet complete journey, while accounting records provide the cost basis. They do not establish a removable bus or guaranteed saving.",
  },
  "workshop-scheduling": {
    uncertainties: [
      "One requested plan supplied",
      "One staffing snapshot supplied",
      "Replacement costs not supplied",
    ],
    caveats: [
      "One requested plan shows a conflict, not how often conflicts occur or whether this plan was carried out.",
      "Staffing needs and availability are planning inputs; actual work and attendance may differ.",
      "The supplied roster may omit other cover; eight scheduled trips are not eight cancellations.",
      "Total hours do not show a feasible schedule; uncertain repair duration may change the picture.",
    ],
    question: "Compare the proposed bookings with earlier workshop records.",
    caption: "Existing records to add to the supplied reports.",
    items: [
      {
        icon: "calendar",
        label: "Earlier workshop booking logs",
        detail: "Planned and completed work",
      },
      {
        icon: "wrench",
        label: "Mechanic rosters and timesheets",
        detail: "Normal hours and overtime",
      },
      {
        icon: "money",
        label: "Replacement-bus invoices",
        detail: "Existing hire and cover bills",
      },
    ],
    notes:
      "Request prior workshop booking logs and completed job sheets, mechanic rosters or timesheets, and paid replacement-bus invoices. Use the dates and fields already maintained rather than requiring a new record of every planning decision. Compare requested and actual work where both are recorded. These routine records can show recurring conflicts and incurred overtime or hire charges; a single conflicting request is not proof of realised losses.",
  },
  "fleet-availability": {
    uncertainties: [
      "Release fields are empty in extract",
      "Only current work status supplied",
      "Replacement spending not supplied",
    ],
    caveats: [
      "Missing releases in this extract do not prove the buses stayed unavailable; records may exist elsewhere.",
      "A status snapshot does not measure time spent waiting for parts, repair or inspection.",
      "Estimated dates cannot substitute for actual release times or establish overdue downtime.",
      "This is a data visibility gap; rental costs and missed services have not been established.",
    ],
    question: "Complete the workshop records with releases and invoices.",
    caption: "Existing records to add to the supplied reports.",
    items: [
      {
        icon: "check",
        label: "Completed job and release records",
        detail: "Signed dates and times",
      },
      {
        icon: "wrench",
        label: "Job sheets and parts orders",
        detail: "Existing order and receipt dates",
      },
      {
        icon: "money",
        label: "Bus-hire invoices",
        detail: "Dates, charges and credits",
      },
    ],
    notes:
      "Request completed job sheets and signed release records, the relevant parts orders and delivery receipts, and replacement-bus hire invoices. These are ordinary workshop, purchasing and accounting records that may sit outside the supplied extract. Do not assume a detailed electronic status history is maintained. The records should establish actual completion dates and billed cover costs before calculating downtime or financial impact.",
  },
  "festival-allocation": {
    uncertainties: [
      "Some bus allocations provisional",
      "Only this event plan supplied",
      "Commercial terms not supplied",
    ],
    caveats: [
      "Capacity is not attendance; unequal totals do not prove empty seats or unmet demand.",
      "This gap depends on listed departures and an assumed ride time; transfer time is additional.",
      "Eighty-five places are exposed, not eighty-five confirmed stranded passengers.",
      "This is a future planning risk; complete-journey demand and the revenue effect remain unknown.",
    ],
    question:
      "Complete the event plan with existing schedules and commercial records.",
    caption: "Existing records to add to the supplied reports.",
    items: [
      {
        icon: "bus",
        label: "Latest confirmed event timetable",
        detail: "Departures and bus capacities",
      },
      {
        icon: "event",
        label: "Previous comparable event reports",
        detail: "Bus counts and bookings, if held",
      },
      {
        icon: "money",
        label: "Event transport contract",
        detail: "Agreed fees and hire quotes",
      },
    ],
    notes:
      "Request the latest confirmed event schedules and bus bookings, previous comparable event operating reports if retained, and the event transport agreement or supplier quotes. These are planning and commercial documents, not a request to predict every passenger destination or transfer decision. Prior event counts provide context only; quotes and agreed fees are not incurred expenses. A future connection gap cannot be priced as an actual loss from the supplied plan.",
  },
  "incident-relief": {
    uncertainties: [
      "Only one assumed scenario supplied",
      "Resource availability is a snapshot",
      "Relief-service charges not supplied",
    ],
    caveats: [
      "Demand is assumed, not observed; restoration, alternative routes and people leaving would change it.",
      "Arrival rates are scenario inputs and may vary widely between real incidents.",
      "The 122-person queue is conditional arithmetic, not an observed outcome or a forecast.",
      "Driver and bus availability are a snapshot; updated releases and commitments could change the constraint.",
    ],
    question:
      "Compare the scenario with existing incident and payment records.",
    caption: "Existing records to add to the supplied reports.",
    items: [
      {
        icon: "calendar",
        label: "Previous incident reports",
        detail: "Dispatch and restoration times",
      },
      {
        icon: "bus",
        label: "Bus and driver duty rosters",
        detail: "Relevant release and duty records",
      },
      {
        icon: "money",
        label: "Relief contracts and invoices",
        detail: "Agreed rates and actual bills",
      },
    ],
    notes:
      "Request previous incident logs with recorded dispatch and restoration times, bus and driver duty rosters, and relief-service contracts and invoices. Use any existing operational counts in those reports but do not ask for passenger abandonment or individual alternatives. These records can test whether the scenario resembles prior operations and show recorded spending. Assumed queue sizes are not observed ridership changes.",
  },
  "investment-options": {
    uncertainties: [
      "Only two annual periods supplied",
      "Only eight buses included",
      "Totals combine many repair jobs",
    ],
    caveats: [
      "Two annual totals do not establish a sustained trend; prices and the mix of work may have changed.",
      "Changes in spending do not prove that fewer preventive checks caused more repairs.",
      "Two buses may cost more because of heavier use, age or one major job; totals alone cannot explain why.",
      "Repair holds are not labour hours or passenger delays; the cost of replacement service is unknown.",
    ],
    question: "Extend and reconcile the maintenance accounts.",
    caption: "Existing records to add to the supplied reports.",
    items: [
      {
        icon: "calendar",
        label: "Earlier monthly maintenance reports",
        detail: "Same categories, more years",
      },
      {
        icon: "bus",
        label: "Fleet-wide maintenance records",
        detail: "Costs, mileage and bus ages",
      },
      {
        icon: "money",
        label: "Underlying invoices and job sheets",
        detail: "Parts, labour and major work",
      },
    ],
    notes:
      "Request earlier monthly maintenance reports using the same cost categories, the equivalent records for the rest of the fleet, and underlying invoices and job sheets. Bus ages and mileage should come from the fleet register and existing operating records. These are extensions of routine records already supplied. Reconcile categories and overlapping job records before comparing years. The overall maintenance increase includes the repair increase, so the two impact figures must not be added.",
  },
  "customer-growth": {
    uncertainties: [
      "Only ten weekdays of boardings",
      "Operator revenue not supplied",
      "Marketing spending not supplied",
    ],
    caveats: [
      "Repeated travel and transfers count again; boarding events do not reveal new customers or earnings.",
      "Six selected accounts cannot establish an abandonment rate, lost customers or lost revenue.",
      "These fields are absent from the supplied reports; the business may hold them elsewhere.",
      "Service friction suggests a question to investigate, not a quantified acquisition or retention opportunity.",
    ],
    question: "Add the existing ridership and revenue reports.",
    caption: "Existing records to add to the supplied reports.",
    items: [
      {
        icon: "calendar",
        label: "Monthly ridership totals",
        detail: "Earlier months and years",
      },
      {
        icon: "money",
        label: "Monthly revenue and contracts",
        detail: "Existing finance reports",
      },
      {
        icon: "search",
        label: "Marketing invoices and budgets",
        detail: "Existing campaign reports, if held",
      },
    ],
    notes:
      "Request routine monthly ridership totals over earlier months and years, monthly revenue reports and operator contracts, and marketing budgets or invoices if acquisition spending exists. Existing campaign summaries may be useful if already maintained, but do not require customer-level tracking, new versus repeat passenger histories or abandonment research. Aggregate ridership changes can be measured from comparable periods; they do not prove which service issue caused a change. The payment model determines whether ridership changes affect operator revenue.",
  },
}
