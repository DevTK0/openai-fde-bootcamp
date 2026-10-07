import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { z } from "zod";
import { createFleet, sum, money, fmt } from "../../../web/lib/fleet";
import { fleetSchema } from "../../../web/lib/dashboard-data";
import {
  buildOperationsReport,
  type OperationsSnapshot,
} from "../../../web/lib/operations";

// Validate the imported file once, then use the dashboard's report calculations.
const count = z.number();
const snapshotSchema: z.ZodType<OperationsSnapshot> = z.object({
  groups: z.array(
    z.object({
      date: z.string(),
      service: z.string(),
      trips: count,
      completed: count,
      km: count,
      positioningKm: count,
      seconds: count,
      vehicles: z.array(z.string()),
      departureDelays: z.array(count),
      arrivalDelays: z.array(count),
      substitutions: count,
      calls: count,
      boardings: count,
      alightings: count,
      queuedCalls: count,
      fullCalls: count,
      occupancySum: count,
      initialQueue: count,
      arrivals: count,
      remainingQueue: count,
      windowBoardings: count,
      controlActions: count,
      resourceUpdates: count,
    }),
  ),
  hotspots: z.array(
    z.object({
      date: z.string(),
      service: z.string(),
      route: z.string(),
      order: count,
      stop: z.string(),
      name: z.string(),
      arrivals: count,
      boardings: count,
      remaining: count,
    }),
  ),
  workshop: z.array(
    z.record(z.string(), z.union([z.string(), z.number(), z.null()])),
  ),
});
// Astro package scripts run from apps/docs; this source is read only at build time.
const snapshot = snapshotSchema.parse(
  JSON.parse(
    gunzipSync(
      readFileSync("../web/data/operations/summary.json.gz"),
    ).toString(),
  ),
);
export const operations = buildOperationsReport(snapshot, "all", "all");
export { money, fmt };

const { dataset, filterHistory } = createFleet(
  fleetSchema.parse(
    JSON.parse(readFileSync("../web/lib/fleet-data.json", "utf8")),
  ),
);

const earlier = filterHistory("all", "earlier");
const latest = filterHistory("all", "latest");
export const maintenance = {
  earlierRepair: sum(earlier, "repair_cost_sgd"),
  latestRepair: sum(latest, "repair_cost_sgd"),
  earlierKm: sum(earlier, "recorded_km"),
  latestKm: sum(latest, "recorded_km"),
};
export const maintenanceChart = {
  title: "Recorded maintenance costs across two years",
  description:
    "Eight selected buses · two complete October–September periods · SGD excluding tax",
  rows: [
    {
      name: "2024–25",
      repairs: maintenance.earlierRepair,
      routine: sum(earlier, "scheduled_service_cost_sgd"),
      preventive: sum(earlier, "additional_preventive_cost_sgd"),
    },
    {
      name: "2025–26",
      repairs: maintenance.latestRepair,
      routine: sum(latest, "scheduled_service_cost_sgd"),
      preventive: sum(latest, "additional_preventive_cost_sgd"),
    },
  ],
  series: [
    { key: "repairs", label: "Repairs (SGD)" },
    { key: "routine", label: "Routine service (SGD)" },
    { key: "preventive", label: "Preventive work (SGD)" },
  ],
};
export const repairRateChart = {
  title: "Repair cost for the distance recorded",
  description:
    "Repair charges divided by matched-period kilometres · SGD per 1,000 km",
  rows: [
    {
      name: "2024–25",
      rate: (maintenance.earlierRepair / maintenance.earlierKm) * 1000,
    },
    {
      name: "2025–26",
      rate: (maintenance.latestRepair / maintenance.latestKm) * 1000,
    },
  ],
  series: [{ key: "rate", label: "SGD per 1,000 km" }],
};
export const reliabilityChart = {
  title: "Departure timing in the recorded journeys",
  description:
    "All services · 5–16 October 2026 · departures scheduled 06:00–11:59",
  rows: [
    { name: "Early", trips: operations.metrics.earlyDepartures },
    { name: "0–5 min late", trips: operations.metrics.onTimeDepartures },
    { name: "Over 5 min late", trips: operations.metrics.lateDepartures },
  ],
  series: [{ key: "trips", label: "Trips" }],
};
export const arrivalChart = {
  title: "Arrival delay by recorded date",
  description: "All services · mean and 90th percentile · minutes",
  rows: operations.byDate.map((row) => ({
    name: row.name.slice(5),
    mean: row.meanArrival,
    p90: row.p90Arrival,
  })),
  series: [
    { key: "mean", label: "Mean (min)" },
    { key: "p90", label: "90th percentile (min)" },
  ],
};
export const crowdingChart = {
  title: "Passenger queue accounting",
  description:
    "All services and dates · route-position windows · counts are not unique passengers",
  rows: [
    { name: "Initial queue", people: operations.metrics.initialQueue },
    { name: "New arrivals", people: operations.metrics.arrivals },
    { name: "Boarded", people: operations.metrics.boardings },
    { name: "Remaining", people: operations.metrics.remainingQueue },
  ],
  series: [{ key: "people", label: "People / events" }],
};
const requests = dataset("Maintenance planning", "Requested maintenance").rows;
const capacity = dataset(
  "Maintenance planning",
  "Bay and staffing capacity",
).rows;
export const workshopChart = {
  title: "Requests overlap the available workshop capacity",
  description:
    "19 October 2026 at 09:00 · tentative requests, not completed work",
  rows: [
    {
      name: "Bays",
      requested: sum(requests, "Required bays"),
      available: sum(capacity, "Available bays"),
    },
    {
      name: "Technicians",
      requested: sum(requests, "Required technicians"),
      available: sum(capacity, "Available technicians"),
    },
  ],
  series: [
    { key: "requested", label: "Requested at 09:00" },
    { key: "available", label: "Available at a time" },
  ],
};

export const repairGrowth = fmt(
  (maintenance.latestRepair / maintenance.earlierRepair - 1) * 100,
  1,
);
export const distanceGrowth = fmt(
  (maintenance.latestKm / maintenance.earlierKm - 1) * 100,
  1,
);

const channels = new Map<string, number>();
for (const row of dataset("Passenger reports").rows) {
  const channel = String(row.Channel);
  channels.set(channel, (channels.get(channel) ?? 0) + 1);
}
export const passengerChart = {
  title: "How the selected passenger accounts were received",
  description: "Six selected accounts · counts by channel, not complaint rates",
  rows: [...channels].map(([name, reports]) => ({ name, reports })),
  series: [{ key: "reports", label: "Selected reports" }],
};
export const quoteChart = {
  title: "Proposed maintenance packages have different scopes",
  description: "Quoted SGD excluding tax · package totals, not price per visit",
  rows: dataset("Cost options")
    .rows.filter((row) => row.Option !== "Fleet replacement option")
    .map((row) => ({
      name: String(row["Option ID"]),
      quote: row["Quoted price SGD"] ?? null,
    })),
  series: [{ key: "quote", label: "Quoted SGD" }],
};
