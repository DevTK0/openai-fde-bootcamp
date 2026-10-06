import { readFileSync, writeFileSync } from "node:fs"
import { gunzipSync } from "node:zlib"
import { createHash } from "node:crypto"
import { fileURLToPath } from "node:url"

const web = new URL("../../web/", import.meta.url)
const read = (path) => readFileSync(new URL(path, web))
export function buildEvidence(fleet, operations, boarding) {
  const table = (title) => {
    const found = fleet.tables.find((t) => t.title === title)
    if (!found) throw new Error(`Missing report table: ${title}`)
    return found.rows
  }
  const monthly = fleet.tables.find(
    (t) => t.id === "monthly_vehicle_history"
  ).rows
  const sum = (rows, key) =>
    rows.reduce((s, r) => s + (typeof r[key] === "number" ? r[key] : 0), 0)
  const totals = (rows) => ({
    km: sum(rows, "recorded_km"),
    repair: sum(rows, "repair_cost_sgd"),
    holds: sum(rows, "repair_unavailable_hours"),
    preventive: sum(rows, "additional_preventive_cost_sgd"),
    servicing: sum(rows, "scheduled_service_cost_sgd"),
    jobs: sum(rows, "repair_count"),
    plannedHolds: sum(rows, "scheduled_maintenance_unavailable_hours"),
  })
  const vehicles = [...new Set(monthly.map((r) => r.vehicle_id))]
    .map((id) => ({
      id,
      ...totals(monthly.filter((r) => r.vehicle_id === id)),
    }))
    .sort((a, b) => b.repair - a.repair)
  const groups = operations.groups
  const delays = groups.flatMap((g) => g.departureDelays)
  const byService = [...new Set(groups.map((g) => g.service))].map((id) => {
    const rows = groups.filter((g) => g.service === id)
    return {
      id,
      trips: sum(rows, "trips"),
      late: rows.flatMap((g) => g.departureDelays).filter((s) => s > 300)
        .length,
      queuedCalls: sum(rows, "queuedCalls"),
      calls: sum(rows, "calls"),
      remaining: sum(rows, "remainingQueue"),
    }
  })
  const allocations = table("Proposed fleet allocations")
  const capacityByRoute = [
    ...new Set(allocations.map((r) => r["Route ID"]).filter(Boolean)),
  ].map((route) => ({
    route,
    spaces: allocations
      .filter((r) => r["Route ID"] === route)
      .reduce(
        (n, r) =>
          n +
          r["Planning limit per departure"] *
            r["Proposed departure times local"].split("|").length,
        0
      ),
    departures: allocations
      .filter((r) => r["Route ID"] === route)
      .flatMap((r) => r["Proposed departure times local"].split("|"))
      .sort(),
  }))
  return {
    boarding: boarding.rows.map(
      ({ date, waiting, boarded, remaining, capacity }) => ({
        date,
        waiting,
        boarded,
        remaining,
        capacity,
      })
    ),
    coolingJobs: table("Selected work orders")
      .filter((r) => r["Fault family"] === "HVAC")
      .map((r) => ({
        date: r["Opened at"].slice(0, 10),
        cost: r["Labour parts SGD"],
        hours:
          (Date.parse(r["Confirmed release at"].replace(" ", "T") + "+08:00") -
            Date.parse(r["Opened at"].replace(" ", "T") + "+08:00")) /
          3600000,
      })),
    festival: { capacityByRoute, routes: table("Temporary event routes") },
    plannedTrips: table("Protected 19 October service 132 trips").length,
    history: {
      rows: monthly.length,
      vehicles,
      earlier: totals(monthly.filter((r) => r.month < "2025-10")),
      latest: totals(monthly.filter((r) => r.month >= "2025-10")),
    },
    operations: {
      trips: sum(groups, "trips"),
      calls: sum(groups, "calls"),
      boardings: sum(groups, "boardings"),
      late: delays.filter((s) => s > 300).length,
      arrivalLate: groups.flatMap((g) => g.arrivalDelays).filter((s) => s > 300)
        .length,
      completed: sum(groups, "completed"),
      meanOccupancy: (sum(groups, "occupancySum") / sum(groups, "calls")) * 100,
      queuedCalls: sum(groups, "queuedCalls"),
      remaining: sum(groups, "remainingQueue"),
      dates: [...new Set(groups.map((g) => g.date))].sort(),
      byService,
    },
    workshop: operations.workshop,
    options: table("Options"),
    passengers: table("Journey reports"),
    requests: table("Requested maintenance"),
    capacity: table("Bay and staffing capacity"),
    allocations: table("Proposed fleet allocations"),
    incident: {
      requirements: table("Relief decision requirements")[0],
      arrivals: sum(table("Relief queue planning arrivals"), "Arrivals people"),
      baselineCapacity: sum(
        table("Already committed contracted relief departures"),
        "Capacity people"
      ),
    },
  }
}
export function loadEvidence() {
  const fleet = read("lib/fleet-data.json")
  const operations = read("data/operations/summary.json.gz")
  const boarding = read("lib/boarding-history.json")
  return {
    ...buildEvidence(
      JSON.parse(fleet),
      JSON.parse(gunzipSync(operations)),
      JSON.parse(boarding)
    ),
    provenance: {
      boarding: createHash("sha256").update(boarding).digest("hex"),
      fleet: createHash("sha256").update(fleet).digest("hex"),
      operations: createHash("sha256").update(operations).digest("hex"),
    },
  }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(
    new URL("../content/evidence.json", import.meta.url),
    JSON.stringify(loadEvidence(), null, 2) + "\n"
  )
  console.log("Refreshed slide evidence from apps/web report snapshots.")
}
