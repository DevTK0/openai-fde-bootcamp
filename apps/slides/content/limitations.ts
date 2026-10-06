import evidence from "./evidence.json"

const onward = evidence.allocations
  .filter((allocation) => allocation["Route ID"] === "EXT-E2")
  .map((allocation) => {
    const limit = allocation["Planning limit per departure"]
    const times = allocation["Proposed departure times local"]
    if (limit === null || !times)
      throw new Error(
        "An onward allocation is missing its capacity or departures"
      )
    const departures = times.split("|").filter(Boolean)
    return {
      status: allocation["Allocation status"],
      places: limit * departures.length,
    }
  })
const regular = onward
  .filter((allocation) => allocation.status === "protected regular")
  .reduce((places, allocation) => places + allocation.places, 0)
const provisional = onward
  .filter((allocation) => allocation.status.startsWith("provisional"))
  .reduce((places, allocation) => places + allocation.places, 0)

export type LimitationVisual = {
  kind: "limitation"
  observed: string
  missing: string
  conclusion: string
  value?: string
  count?: number
  rows?: string[]
} & (
  | { layout: "allocation"; regular: number; provisional: number }
  | {
      layout: "history" | "sample" | "breakdown" | "records" | "money" | "plan"
    }
)
export type LimitationStory = {
  title: string
  caption: string
  visual: LimitationVisual
}
// These describe limits of inference from the supplied extract, not defects in
// the operator's record keeping. Requests concern ordinary retained documents.
export const limitationStories: Record<string, LimitationStory[]> = {
  "repair-spend": [
    {
      title: "Two years do not show a trend.",
      caption:
        "Share earlier monthly repair records to check whether costs keep rising.",
      visual: {
        kind: "limitation",
        layout: "history",
        observed: "Oct 2024 to Sep 2026",
        missing: "Earlier years",
        conclusion: "We need more years to check the trend.",
        value: "2 years",
      },
    },
    {
      title: "Eight buses may not represent the fleet.",
      caption: "Share repair and mileage reports for the other buses.",
      visual: {
        kind: "limitation",
        layout: "sample",
        observed: "8 selected buses",
        missing: "Other buses",
        conclusion: "Total fleet repair costs are unknown.",
        count: 8,
      },
    },
    {
      title: "We do not know why repair bills rose.",
      caption:
        "Share invoices and job sheets to separate parts, labour and major repairs.",
      visual: {
        kind: "limitation",
        layout: "breakdown",
        observed: "Repair totals supplied",
        missing: "Invoice detail needed",
        conclusion: "We do not know why costs rose.",
        rows: ["Parts prices", "Labour charges", "Major one-off jobs"],
      },
    },
  ],
  "hvac-comfort": [
    {
      title: "One bus cannot show how common cooling faults are.",
      caption:
        "Share earlier cooling job sheets and repair records for other buses.",
      visual: {
        kind: "limitation",
        layout: "records",
        observed: "3 jobs on one bus",
        missing: "Earlier jobs and other buses",
        conclusion: "We do not know how common faults are.",
        rows: ["28 Sep: repair", "5 Oct: repair", "12 Oct: repair"],
      },
    },
    {
      title: "Two complaints cannot show how common discomfort is.",
      caption:
        "Share the full cooling complaint register, including earlier months.",
      visual: {
        kind: "limitation",
        layout: "sample",
        observed: "2 selected accounts",
        missing: "Full complaint register",
        conclusion: "Two accounts do not show how common this is.",
        count: 2,
      },
    },
  ],
  "service-reliability": [
    {
      title: "Ten weekdays do not show a yearly pattern.",
      caption: "Share more months of trip records, including weekends.",
      visual: {
        kind: "limitation",
        layout: "history",
        observed: "5 to 16 Oct 2026",
        missing: "Earlier months and weekends",
        conclusion: "We do not know if delays persist.",
        value: "10 weekdays",
      },
    },
    {
      title: "Older trips need matching timetables.",
      caption:
        "Share the timetables used on those dates to measure how late each bus was.",
      visual: {
        kind: "limitation",
        layout: "records",
        observed: "Current dates are matched",
        missing: "Older schedules alongside older actuals",
        conclusion: "We need planned and actual times.",
        rows: [
          "Scheduled departure",
          "Actual departure",
          "Difference = lateness",
        ],
      },
    },
    {
      title: "Late trips may not lead to penalties.",
      caption:
        "Share contracts and payment deductions to check whether delays reduced income.",
      visual: {
        kind: "limitation",
        layout: "money",
        observed: "100 late arrivals",
        missing: "Contract terms and deductions",
        conclusion: "Penalty costs are not provided.",
      },
    },
  ],
  crowding: [
    {
      title: "Two weeks do not show typical crowding.",
      caption:
        "Share earlier boarding records, including weekends, to check whether queues persist.",
      visual: {
        kind: "limitation",
        layout: "history",
        observed: "5 to 16 Oct 2026",
        missing: "Earlier months and weekends",
        conclusion: "Crowding on other dates is unknown.",
        value: "10 weekdays",
      },
    },
  ],
  "capacity-use": [
    {
      title: "Ten weekdays do not show typical demand.",
      caption: "Share more months of trip records, including weekends.",
      visual: {
        kind: "limitation",
        layout: "history",
        observed: "5 to 16 Oct 2026",
        missing: "Earlier months and weekends",
        conclusion: "Typical demand is unknown.",
        value: "10 weekdays",
      },
    },
    {
      title: "Empty places do not tell us what costs can fall.",
      caption:
        "Share fuel, payroll and bus cost reports to identify which costs change when fewer buses run.",
      visual: {
        kind: "limitation",
        layout: "money",
        observed: "Quiet departures observed",
        missing: "Fuel, payroll and bus costs",
        conclusion: "Possible savings are unknown.",
      },
    },
  ],
  "workshop-scheduling": [
    {
      title: "One plan does not show how often bookings clash.",
      caption:
        "Share earlier bookings and completed job sheets to check how often clashes occur.",
      visual: {
        kind: "limitation",
        layout: "plan",
        observed: "19 Oct: proposed bookings",
        missing: "Earlier completed bookings",
        conclusion: "We do not know how often jobs clash.",
      },
    },
    {
      title: "A staffing gap does not prove overtime was worked.",
      caption:
        "Share mechanic rosters and timesheets to compare planned and paid hours.",
      visual: {
        kind: "limitation",
        layout: "records",
        observed: "3 needed; 2 available in plan",
        missing: "Actual hours from timesheets",
        conclusion: "The plan does not record overtime.",
        rows: ["Rostered hours", "Actual hours worked", "Overtime hours"],
      },
    },
    {
      title: "A replacement bus may not cost extra.",
      caption:
        "Share hire invoices to check whether covering the service added costs.",
      visual: {
        kind: "limitation",
        layout: "money",
        observed: "1 replacement bus listed",
        missing: "Hire and cover invoices",
        conclusion: "Extra replacement costs are unknown.",
      },
    },
  ],
  "fleet-availability": [
    {
      title: "Missing approval records do not prove buses are unavailable.",
      caption:
        "Share signed release records and completed job sheets to confirm when buses could return to service.",
      visual: {
        kind: "limitation",
        layout: "records",
        observed: "8 release records are missing",
        missing: "Signed release dates and times",
        conclusion: "Bus availability is unconfirmed.",
        rows: [
          "Expected completion",
          "Actual completion: ?",
          "Signed release: ?",
        ],
      },
    },
    {
      title: "Repair status does not show time spent waiting.",
      caption:
        "Share dated job sheets, parts orders and delivery receipts to separate repair time from waits for parts.",
      visual: {
        kind: "limitation",
        layout: "records",
        observed: "Current status recorded",
        missing: "Dates on jobs, orders and receipts",
        conclusion: "Time waiting for parts is unknown.",
        rows: ["Part ordered: ?", "Part received: ?", "Repair completed: ?"],
      },
    },
    {
      title: "Time in repair does not show replacement costs.",
      caption:
        "Share dated bus hire invoices and credits to check the actual charges.",
      visual: {
        kind: "limitation",
        layout: "money",
        observed: "8 workshop buses listed",
        missing: "Dated bus-hire invoices",
        conclusion: "Replacement bus costs are unknown.",
      },
    },
  ],
  "festival-allocation": [
    {
      title: "Some bus bookings are not confirmed.",
      caption:
        "Share the latest timetable and confirmed bookings to check the available capacity.",
      visual: {
        kind: "limitation",
        layout: "allocation",
        regular,
        provisional,
        observed: `Onward service: ${regular + provisional} listed places`,
        missing: "Confirm the provisional allocation",
        conclusion: `${provisional} places are not confirmed.`,
      },
    },
    {
      title: "Planned places do not show passenger demand.",
      caption:
        "Share passenger counts from similar events and any existing bookings.",
      visual: {
        kind: "limitation",
        layout: "records",
        observed: "Future event capacity plan",
        missing: "Previous event counts and bookings",
        conclusion: "Planned places do not show demand.",
        rows: ["Seats planned", "Bookings, if held: ?", "Past event usage: ?"],
      },
    },
    {
      title: "A missed connection does not show a financial loss.",
      caption:
        "Share the transport contract, agreed fees and hire quotes to assess the cost.",
      visual: {
        kind: "limitation",
        layout: "money",
        observed: "Last connection gap in plan",
        missing: "Event contract and agreed fees",
        conclusion: "The financial effect is unknown.",
      },
    },
  ],
  "incident-relief": [
    {
      title: "The queue estimate depends on assumptions.",
      caption:
        "Share past incident reports with bus departure and train restart times to check those assumptions.",
      visual: {
        kind: "limitation",
        layout: "records",
        observed: "122 waiting in the scenario",
        missing: "Past dispatch and restoration logs",
        conclusion: "The queue is calculated, not measured.",
        rows: [
          "Assumed arrivals",
          "Assumed departures",
          "No train restart is assumed",
        ],
      },
    },
    {
      title: "Buses and drivers may not stay available.",
      caption:
        "Share duty rosters and release records for the full disruption period.",
      visual: {
        kind: "limitation",
        layout: "records",
        observed: "One availability snapshot",
        missing: "Duties and releases across the period",
        conclusion: "Later availability is unknown.",
        rows: ["Current availability", "Later duties: ?", "Release changes: ?"],
      },
    },
    {
      title: "Queue length does not show replacement service costs.",
      caption:
        "Share replacement service contracts and invoices to compare agreed rates with actual payments.",
      visual: {
        kind: "limitation",
        layout: "money",
        observed: "122 waiting in the scenario",
        missing: "Service contracts and invoices",
        conclusion: "Replacement service costs are unknown.",
      },
    },
  ],
  "investment-options": [
    {
      title: "Two years do not show a cost trend.",
      caption:
        "Share earlier monthly maintenance reports using the same cost categories.",
      visual: {
        kind: "limitation",
        layout: "history",
        observed: "Oct 2024 to Sep 2026",
        missing: "Earlier years",
        conclusion: "We need more years to check the trend.",
        value: "2 years",
      },
    },
    {
      title: "Eight buses may not represent the fleet.",
      caption:
        "Share maintenance costs, mileage and ages for other buses doing similar work.",
      visual: {
        kind: "limitation",
        layout: "sample",
        observed: "8 selected buses",
        missing: "Other buses and their usage",
        conclusion: "Total fleet maintenance costs are unknown.",
        count: 8,
      },
    },
    {
      title: "Totals hide the cost of major one-off jobs.",
      caption:
        "Share invoices and job sheets to separate routine work, major jobs and price changes.",
      visual: {
        kind: "limitation",
        layout: "breakdown",
        observed: "Maintenance totals supplied",
        missing: "Underlying invoices and job sheets",
        conclusion: "Routine costs are not separated.",
        rows: ["Regular work", "Parts and labour prices", "Major one-off jobs"],
      },
    },
  ],
  "customer-growth": [
    {
      title: "Ten weekdays do not show ridership growth.",
      caption: "Share monthly passenger totals from earlier months and years.",
      visual: {
        kind: "limitation",
        layout: "history",
        observed: "5 to 16 Oct 2026",
        missing: "Earlier months and years",
        conclusion: "We cannot measure growth yet.",
        value: "10 weekdays",
      },
    },
    {
      title: "More boardings may not mean more revenue.",
      caption:
        "Share monthly revenue reports and contracts to check how passenger numbers affect payments.",
      visual: {
        kind: "limitation",
        layout: "money",
        observed: "Boardings recorded",
        missing: "Revenue reports and payment terms",
        conclusion: "Revenue per extra boarding is unknown.",
      },
    },
    {
      title: "The reports do not include marketing costs.",
      caption:
        "Share existing marketing budgets, invoices and campaign reports.",
      visual: {
        kind: "limitation",
        layout: "money",
        observed: "Boarding totals supplied",
        missing: "Marketing budgets and invoices",
        conclusion: "Marketing costs are not provided.",
      },
    },
  ],
}
