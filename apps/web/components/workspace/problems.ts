export type Problem = {
  id: string
  group: "Scheduling" | "Maintenance" | "Ridership"
  title: string
  stakeholder: string
  decision: string
  hypothesis: string
  limit: string
  request: string
  query: string
  preferredTable: string
}
export const problems: Problem[] = [
  {
    id: "service-reliability",
    preferredTable: "operations",
    group: "Scheduling",
    title: "What affects service reliability?",
    stakeholder: "Service planners and dispatch",
    decision: "Which services need timetable or dispatch changes?",
    hypothesis:
      "Traffic, dispatch gaps or vehicle holds may explain late departures.",
    limit:
      "Service-date aggregates cannot link a particular repair to a late trip.",
    request:
      "Dated trip timings, vehicle assignments, traffic and dispatch logs.",
    query: "departure completed service trips",
  },
  {
    id: "workshop-scheduling",
    preferredTable: "fleet-14",
    group: "Scheduling",
    title: "Do workshop bookings fit capacity?",
    stakeholder: "Workshop supervisors and schedulers",
    decision: "Which bookings can fit the available bays and technicians?",
    hypothesis:
      "Simultaneous bookings may compete for the same skills and space.",
    limit:
      "Requested bookings are plans, not completed work or proven capacity.",
    request:
      "Confirmed bay slots, technician skills, task duration and service commitments.",
    query: "workshop bookings technician bay",
  },
  {
    id: "festival-allocation",
    preferredTable: "fleet-20",
    group: "Scheduling",
    title: "Where might the festival plan have gaps?",
    stakeholder: "Event operations and fleet planners",
    decision: "Where should standby buses and timetable changes go?",
    hypothesis:
      "Uneven headways and directional demand may leave coverage gaps.",
    limit: "Planned capacity is not measured festival ridership.",
    request:
      "Observed arrivals by stop and time, confirmed allocations and turnaround times.",
    query: "festival timetable capacity",
  },
  {
    id: "incident-relief",
    preferredTable: "fleet-31",
    group: "Scheduling",
    title: "Can relief buses clear the queue?",
    stakeholder: "Incident controllers",
    decision:
      "How many relief trips are needed under the incident assumptions?",
    hypothesis:
      "Passenger arrivals may exceed relief departures during the response window.",
    limit: "Assumed arrivals and planned seats do not prove a real queue.",
    request:
      "Timestamped incident arrivals, actual dispatch, boarding and clearance records.",
    query: "replacement disruption queue relief",
  },
  {
    id: "repair-spend",
    preferredTable: "fleet-37",
    group: "Maintenance",
    title: "What is driving repair cost?",
    stakeholder: "Engineering and finance",
    decision: "Which vehicles and periods deserve a work-order review?",
    hypothesis:
      "Exposure, repeat faults, parts prices or vehicle age may explain differences in repair costs.",
    limit:
      "Compare matched vehicle cohorts and periods. Repair costs may already be included in maintenance totals.",
    request:
      "Matched mileage, coded work orders, parts prices and vehicle age for each comparison period.",
    query: "repair cost maintenance",
  },
  {
    id: "investment-options",
    preferredTable: "fleet-34",
    group: "Maintenance",
    title: "Which maintenance investments make sense?",
    stakeholder: "Finance and fleet leadership",
    decision:
      "Should the operator repair, renew or change preventive maintenance?",
    hypothesis:
      "Routine servicing, repair and vehicle exposure may drive different cost changes.",
    limit:
      "Overlapping monthly summaries and ledgers must not be added. Quotes are not realised costs.",
    request:
      "Comparable lifecycle costs, renewal quotes, residual values and service impact.",
    query: "maintenance investment cost",
  },
  {
    id: "fleet-availability",
    preferredTable: "fleet-12",
    group: "Maintenance",
    title: "Which buses are confirmed available?",
    stakeholder: "Workshop and dispatch",
    decision: "Which buses can be committed to the next service?",
    hypothesis: "Parts or sign-off delays may extend estimated repair holds.",
    limit:
      "Estimated completion is different from confirmed release. Hold hours do not prove cancelled trips.",
    request:
      "Actual release approvals, parts ETA, inspections and dispatch assignments.",
    query: "repair release availability",
  },
  {
    id: "hvac-comfort",
    preferredTable: "fleet-39",
    group: "Maintenance",
    title: "What explains cooling faults?",
    stakeholder: "Engineering and customer experience",
    decision: "Which cooling systems need repeat-fault investigation?",
    hypothesis:
      "A recurring component fault or operating conditions may explain cooling complaints.",
    limit:
      "Selected visits and passenger accounts do not establish fleet prevalence or causality.",
    request:
      "Temperature readings, linked complaints, diagnostic results and repeat work orders.",
    query: "cooling faults HVAC",
  },
  {
    id: "crowding",
    preferredTable: "operations",
    group: "Ridership",
    title: "Where is boarding capacity constrained?",
    stakeholder: "Service planners and customer experience",
    decision: "Which stops and departures need more boarding capacity?",
    hypothesis:
      "Arrival peaks, delays or uneven loading may produce persistent queues.",
    limit:
      "Queues are not unique people. A queue alone does not establish a full bus.",
    request:
      "Stop-level arrivals, boarding refusals, occupancy and vehicle capacity.",
    query: "queued calls boardings",
  },
  {
    id: "capacity-use",
    preferredTable: "operations",
    group: "Ridership",
    title: "How does demand vary by day?",
    stakeholder: "Network and capacity planners",
    decision: "Where should capacity match recurring demand?",
    hypothesis: "Weekday patterns or transfer arrivals may change utilisation.",
    limit:
      "Limited departures or short observation windows cannot establish network demand.",
    request:
      "Matched departures across weeks, occupancy, capacity and special-event indicators.",
    query: "boardings capacity demand",
  },
  {
    id: "customer-growth",
    preferredTable: "fleet-33",
    group: "Ridership",
    title: "Can the evidence show customer growth?",
    stakeholder: "Commercial and customer experience",
    decision: "What evidence is needed to judge retention and acquisition?",
    hypothesis:
      "Reliability and comfort may affect repeat travel, but this remains untested.",
    limit:
      "Boardings are events, not unique customers. Passenger accounts alone do not measure retention.",
    request:
      "Retained aggregate ridership, fares, revenue and service history. Unique acquisition and retention remain unidentifiable without existing suitable records.",
    query: "customer passengers boardings retention",
  },
]
