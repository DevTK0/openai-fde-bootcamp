export type LimitationVisual = {
  kind: "limitation"
  layout:
    | "history"
    | "sample"
    | "breakdown"
    | "records"
    | "money"
    | "plan"
    | "allocation"
  observed: string
  missing: string
  conclusion: string
  value?: string
  count?: number
  rows?: string[]
}
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
      title: "Two annual totals cannot establish a sustained increase.",
      caption:
        "Share earlier monthly repair records to distinguish a persistent increase from an unusual year.",
      visual: {
        kind: "limitation",
        layout: "history",
        observed: "Oct 2024–Sep 2026",
        missing: "Earlier years",
        conclusion: "Long-term direction remains unknown.",
        value: "2 years",
      },
    },
    {
      title:
        "Costs for eight selected buses may not represent the whole fleet.",
      caption:
        "Share the same repair and mileage reports for the other buses before estimating fleet-wide costs.",
      visual: {
        kind: "limitation",
        layout: "sample",
        observed: "8 selected buses",
        missing: "Other buses",
        conclusion: "Fleet-wide repair cost cannot be inferred.",
        count: 8,
      },
    },
    {
      title: "Higher repair bills do not tell us what became more expensive.",
      caption:
        "Share repair invoices and job sheets to separate parts, labour and major one-off jobs.",
      visual: {
        kind: "limitation",
        layout: "breakdown",
        observed: "Repair totals supplied",
        missing: "Invoice detail needed",
        conclusion: "The cause of higher spending remains unclear.",
        rows: ["Parts prices", "Labour charges", "Major one-off jobs"],
      },
    },
  ],
  "hvac-comfort": [
    {
      title:
        "Three cooling repairs on one bus cannot establish a fleet-wide pattern.",
      caption:
        "Share earlier cooling job sheets and those for other buses to check how widely faults recur.",
      visual: {
        kind: "limitation",
        layout: "records",
        observed: "3 jobs on one bus",
        missing: "Earlier jobs and other buses",
        conclusion: "Frequency across the fleet is unknown.",
        rows: ["28 Sep: repair", "5 Oct: repair", "12 Oct: repair"],
      },
    },
    {
      title:
        "Two selected complaints cannot show how common uncomfortable rides are.",
      caption:
        "Share the existing cooling-complaint register for earlier months to establish recorded complaint volumes.",
      visual: {
        kind: "limitation",
        layout: "sample",
        observed: "2 selected accounts",
        missing: "Full complaint register",
        conclusion: "Selected accounts do not establish frequency.",
        count: 2,
      },
    },
  ],
  "service-reliability": [
    {
      title: "Ten weekdays cannot show whether delays persist across the year.",
      caption:
        "Share earlier operating extracts, including weekends, to compare reliability across more months.",
      visual: {
        kind: "limitation",
        layout: "history",
        observed: "5–16 Oct 2026",
        missing: "Earlier months and weekends",
        conclusion: "Recurring lateness is not yet established.",
        value: "10 weekdays",
      },
    },
    {
      title:
        "Earlier running times need the timetables that applied on those dates.",
      caption:
        "When sharing older operating records, include the matching timetable versions so lateness is measured consistently.",
      visual: {
        kind: "limitation",
        layout: "records",
        observed: "Current dates are matched",
        missing: "Older schedules alongside older actuals",
        conclusion: "Lateness needs a scheduled and actual time.",
        rows: [
          "Scheduled departure",
          "Actual departure",
          "Difference = lateness",
        ],
      },
    },
    {
      title: "Late trips do not automatically create a financial penalty.",
      caption:
        "Share the service contracts and recorded deductions to establish whether these delays affected payments.",
      visual: {
        kind: "limitation",
        layout: "money",
        observed: "100 late arrivals",
        missing: "Contract terms and deductions",
        conclusion: "Recorded financial penalty: unknown.",
      },
    },
  ],
  crowding: [
    {
      title:
        "Two weeks of queues cannot establish the year-round crowding pattern.",
      caption:
        "Share earlier boarding extracts, including weekends, to check whether the queues persist.",
      visual: {
        kind: "limitation",
        layout: "history",
        observed: "5–16 Oct 2026",
        missing: "Earlier months and weekends",
        conclusion: "Crowding beyond this window is unknown.",
        value: "10 weekdays",
      },
    },
  ],
  "capacity-use": [
    {
      title:
        "Ten weekdays cannot establish typical demand across months and weekends.",
      caption:
        "Share earlier operating extracts to distinguish a recurring demand pattern from an unusual fortnight.",
      visual: {
        kind: "limitation",
        layout: "history",
        observed: "5–16 Oct 2026",
        missing: "Earlier months and weekends",
        conclusion: "Typical demand remains unconfirmed.",
        value: "10 weekdays",
      },
    },
    {
      title:
        "Empty places do not show how much operating cost could be avoided.",
      caption:
        "Share existing fuel, payroll and bus-cost reports to separate costs that change with service from costs that remain.",
      visual: {
        kind: "limitation",
        layout: "money",
        observed: "Quiet departures observed",
        missing: "Fuel, payroll and bus costs",
        conclusion: "Avoidable operating cost: unknown.",
      },
    },
  ],
  "workshop-scheduling": [
    {
      title:
        "One proposed schedule cannot show whether workshop clashes happen regularly.",
      caption:
        "Share earlier booking logs and completed job sheets to compare planned overlaps with what actually happened.",
      visual: {
        kind: "limitation",
        layout: "plan",
        observed: "19 Oct: proposed bookings",
        missing: "Earlier completed bookings",
        conclusion: "One clash does not show how often it happens.",
      },
    },
    {
      title:
        "A planned staffing shortage does not show actual overtime worked.",
      caption:
        "Share mechanic rosters and timesheets to compare scheduled staffing with paid hours.",
      visual: {
        kind: "limitation",
        layout: "records",
        observed: "3 needed; 2 available in plan",
        missing: "Actual hours from timesheets",
        conclusion: "Overtime cannot be inferred from the plan.",
        rows: ["Rostered hours", "Actual hours worked", "Overtime hours"],
      },
    },
    {
      title:
        "A replacement bus in the plan does not establish an extra expense.",
      caption:
        "Share existing hire and cover invoices to establish whether replacement service incurred additional charges.",
      visual: {
        kind: "limitation",
        layout: "money",
        observed: "1 replacement bus listed",
        missing: "Hire and cover invoices",
        conclusion: "Additional cover spending: unknown.",
      },
    },
  ],
  "fleet-availability": [
    {
      title:
        "An empty release field does not prove a bus is still unavailable.",
      caption:
        "Share completed job sheets and signed release records to establish when each bus was cleared for service.",
      visual: {
        kind: "limitation",
        layout: "records",
        observed: "8 releases absent from extract",
        missing: "Signed release dates and times",
        conclusion: "Actual availability remains unconfirmed.",
        rows: [
          "Expected completion",
          "Actual completion: ?",
          "Signed release: ?",
        ],
      },
    },
    {
      title: "Current repair status cannot tell us how long each stage took.",
      caption:
        "Share dated job sheets, parts orders and delivery receipts to distinguish repair time from time waiting for parts.",
      visual: {
        kind: "limitation",
        layout: "records",
        observed: "Current status recorded",
        missing: "Dates on jobs, orders and receipts",
        conclusion: "Time waiting for parts remains unknown.",
        rows: ["Part ordered: ?", "Part received: ?", "Repair completed: ?"],
      },
    },
    {
      title:
        "Workshop time cannot be converted directly into replacement-bus spending.",
      caption:
        "Share bus-hire invoices, including dates and credits, to establish actual replacement charges.",
      visual: {
        kind: "limitation",
        layout: "money",
        observed: "8 workshop buses listed",
        missing: "Dated bus-hire invoices",
        conclusion: "Billed replacement cost: unknown.",
      },
    },
  ],
  "festival-allocation": [
    {
      title:
        "Provisional allocations may change the capacity available for the event.",
      caption:
        "Share the latest confirmed timetable and bus bookings before treating the listed capacity as committed.",
      visual: {
        kind: "limitation",
        layout: "allocation",
        observed: "Onward service: 596 listed places",
        missing: "Confirm the provisional allocation",
        conclusion: "256 listed places remain provisional.",
      },
    },
    {
      title:
        "Planned bus capacity does not establish how many people will travel.",
      caption:
        "Share previous comparable event reports and recorded bookings, if held, to ground the demand assumptions.",
      visual: {
        kind: "limitation",
        layout: "records",
        observed: "Future event capacity plan",
        missing: "Previous event counts and bookings",
        conclusion: "Actual demand cannot be read from capacity.",
        rows: ["Seats planned", "Bookings, if held: ?", "Past event usage: ?"],
      },
    },
    {
      title: "A gap in the event timetable does not establish a monetary loss.",
      caption:
        "Share the event transport contract, agreed fees and hire quotes to understand the commercial exposure.",
      visual: {
        kind: "limitation",
        layout: "money",
        observed: "Last connection gap in plan",
        missing: "Event contract and agreed fees",
        conclusion: "Financial exposure remains unpriced.",
      },
    },
  ],
  "incident-relief": [
    {
      title:
        "The remaining queue depends on assumptions about how the disruption unfolds.",
      caption:
        "Share previous incident reports with dispatch and restoration times to compare this scenario with past operations.",
      visual: {
        kind: "limitation",
        layout: "records",
        observed: "122 waiting in the scenario",
        missing: "Past dispatch and restoration logs",
        conclusion: "Scenario result is not an observed outcome.",
        rows: [
          "Assumed arrivals",
          "Assumed departures",
          "Restoration assumed absent",
        ],
      },
    },
    {
      title:
        "A resource snapshot cannot establish availability throughout the disruption.",
      caption:
        "Share the relevant bus and driver rosters and release records to check availability across the full response window.",
      visual: {
        kind: "limitation",
        layout: "records",
        observed: "One availability snapshot",
        missing: "Duties and releases across the period",
        conclusion: "Available now does not mean available throughout.",
        rows: ["Current availability", "Later duties: ?", "Release changes: ?"],
      },
    },
    {
      title:
        "A remaining queue does not tell us the cost of relief operations.",
      caption:
        "Share relief-service contracts and invoices to distinguish agreed rates from actual payments.",
      visual: {
        kind: "limitation",
        layout: "money",
        observed: "122 waiting in the scenario",
        missing: "Relief contracts and invoices",
        conclusion: "Actual relief spending: unknown.",
      },
    },
  ],
  "investment-options": [
    {
      title:
        "Two annual totals cannot establish a sustained maintenance-cost trend.",
      caption:
        "Share earlier monthly maintenance reports using the same categories to test whether higher spending persists.",
      visual: {
        kind: "limitation",
        layout: "history",
        observed: "Oct 2024–Sep 2026",
        missing: "Earlier years",
        conclusion: "Long-term maintenance trend remains unknown.",
        value: "2 years",
      },
    },
    {
      title:
        "Eight selected buses cannot establish the maintenance burden of the whole fleet.",
      caption:
        "Share fleet-wide maintenance records, mileage and bus ages to compare buses doing similar work.",
      visual: {
        kind: "limitation",
        layout: "sample",
        observed: "8 selected buses",
        missing: "Other buses and their usage",
        conclusion: "Fleet-wide maintenance cost remains unknown.",
        count: 8,
      },
    },
    {
      title:
        "Total maintenance spending cannot distinguish recurring costs from exceptional work.",
      caption:
        "Share the underlying invoices and job sheets to identify major one-off jobs and changes in parts or labour charges.",
      visual: {
        kind: "limitation",
        layout: "breakdown",
        observed: "Maintenance totals supplied",
        missing: "Underlying invoices and job sheets",
        conclusion: "Recurring cost cannot be isolated from totals.",
        rows: [
          "Regular work",
          "Parts and labour prices",
          "Exceptional major jobs",
        ],
      },
    },
  ],
  "customer-growth": [
    {
      title:
        "Ten weekdays of boardings cannot show whether ridership is growing.",
      caption:
        "Share monthly ridership totals for earlier months and years to compare equivalent periods.",
      visual: {
        kind: "limitation",
        layout: "history",
        observed: "5–16 Oct 2026",
        missing: "Earlier months and years",
        conclusion: "Ridership growth cannot yet be measured.",
        value: "10 weekdays",
      },
    },
    {
      title:
        "More boardings do not necessarily mean more revenue for the operator.",
      caption:
        "Share monthly revenue reports and contracts to establish how payments relate to passenger numbers.",
      visual: {
        kind: "limitation",
        layout: "money",
        observed: "Boarding events recorded",
        missing: "Revenue reports and payment terms",
        conclusion: "Revenue per additional boarding: unknown.",
      },
    },
    {
      title:
        "Boarding totals cannot show what was spent to attract passengers.",
      caption:
        "Share existing marketing budgets, invoices and campaign summaries, if held, to establish acquisition spending.",
      visual: {
        kind: "limitation",
        layout: "money",
        observed: "Boarding totals supplied",
        missing: "Marketing budgets and invoices",
        conclusion: "Acquisition spending is not in these reports.",
      },
    },
  ],
}
