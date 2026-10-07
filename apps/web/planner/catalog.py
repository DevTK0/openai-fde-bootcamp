"""Read-only source catalog and complete coverage accounting."""

import hashlib, json, sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent
from core import DB

ROLES = {
    "vehicles": "Fleet capacity and accessibility for every listed vehicle.",
    "vehicle_readiness": "Time-bounded release, location and availability for every service date.",
    "crew_duties": "Qualifications, availability, rest and complete daily commitments.",
    "trips": "Every planned assignment across all dates and route directions; actual fields are retrospective only.",
    "routes": "Route directions and identifiers used by assignments.",
    "route_stops": "Full ordered route sequences, including repeated stop positions.",
    "stops": "Named locations and geography; straight-line distance is not a verified journey time.",
    "service_calendar": "All supplied operating dates.",
    "service_patterns": "Published route travel and service definitions.",
    "timetable_records": "Timetable publication and effective-date provenance.",
    "planning_constraints": "Plain-text network operating requirements.",
    "terminal_movements": "Published planning allowances; observed movement times only after they occur.",
    "resource_updates": "Only updates issued by the scenario decision time.",
    "control_actions": "Time-stamped commitments and controller instructions; later actions excluded from advance planning.",
    "workshop_vehicles": "Distinct workshop assets; not spare operating buses.",
    "workshop_work_orders": "Engineering holds; estimated completion never substitutes for confirmed release.",
    "stop_calls": "Historical boarding, capacity, delay and route-position evidence; no future actual outcomes supplied.",
    "origin_arrivals": "Exact historical arrival batches for passenger replay; not a forecast of another day.",
    "queue_windows": "Historical queue boundaries and reconciled counts by route position.",
    "rail_stations": "Interchange reference locations, not confirmation of accessible transfer time.",
    "rail_links": "Spatial interchange candidates, not permission to merge passenger cohorts.",
    "passenger_links": "Report-to-trip evidence links for incident triage.",
    "boarding_cohort": "Published subset membership for boarding comparison, not full-network evidence.",
    "handout_tables": "All source titles, columns and policy notes, including conditions and duplicate-data warnings.",
    "handout_rows": "All 40 imported datasets: maintenance, event, evening relief, passenger reports, history and quotes.",
    "dashboard_metadata": "Source manifests, reporting-scope metadata and both monthly-history documentation files.",
    "source_downloads": "CSV download copies of normalized source tables; checked as provenance, not added as new observations.",
}


def quote(name):
    return '"' + name.replace('"', '""') + '"'


class Catalog:
    def __init__(self, path=DB):
        self.path = path
        self.db = sqlite3.connect(f"file:{path}?mode=ro", uri=True)
        self.db.row_factory = sqlite3.Row
        self.tables = {
            r[0]
            for r in self.db.execute(
                "select name from sqlite_master where type='table'"
            )
        }

    def rows(self, table):
        if table not in self.tables:
            raise ValueError("Unknown table")
        return [dict(r) for r in self.db.execute("select * from " + quote(table))]

    def handouts(self):
        return [
            {
                **json.loads(r["metadata"]),
                "rows": [
                    {"source_position": x["position"], **json.loads(x["data"])}
                    for x in self.db.execute(
                        "select position,data from handout_rows where table_id=? order by position",
                        (r["id"],),
                    )
                ],
            }
            for r in self.db.execute("select * from handout_tables order by position")
        ]

    def handout(self, sheet, title):
        return next(
            h for h in self.handouts() if h["sheet"] == sheet and h["title"] == title
        )

    def census(self):
        if self.tables != set(ROLES):
            raise ValueError(
                f"Coverage mapping must account for table changes: {self.tables^set(ROLES)}"
            )
        result = []
        for table in sorted(self.tables):
            digest = hashlib.sha256()
            count = 0
            for row in self.db.execute(
                "select * from " + quote(table) + " order by rowid"
            ):
                value = {
                    k: (
                        {"bytes": len(v), "sha256": hashlib.sha256(v).hexdigest()}
                        if isinstance(v, bytes)
                        else v
                    )
                    for k, v in dict(row).items()
                }
                digest.update(
                    json.dumps(value, sort_keys=True, separators=(",", ":")).encode()
                )
                count += 1
            result.append(
                {
                    "table": table,
                    "rows": count,
                    "content_sha256": digest.hexdigest(),
                    "planning_use": ROLES[table],
                }
            )
        return {
            "database_sha256": hashlib.sha256(self.path.read_bytes()).hexdigest(),
            "tables": result,
            "handout_datasets": [
                {
                    "id": h["id"],
                    "title": h["title"],
                    "rows": len(h["rows"]),
                    "policy_notes": h["notes"],
                }
                for h in self.handouts()
            ],
            "service_dates": [
                r[0]
                for r in self.db.execute(
                    "select distinct service_date from trips order by service_date"
                )
            ],
            "route_ids": [
                r[0]
                for r in self.db.execute(
                    "select route_id from routes order by route_id"
                )
            ],
            "coverage_definition": "All rows are catalogued and all sources are available to scenario-specific evidence retrieval. A model request is a time-bounded relevant subset, not a raw dump of future observations. Evaluation coverage is reported separately from catalog coverage.",
        }


if __name__ == "__main__":
    coverage = Catalog().census()
    (ROOT / "coverage.json").write_text(json.dumps(coverage, indent=2))
    print(
        json.dumps(
            {
                "tables": len(coverage["tables"]),
                "rows": sum(t["rows"] for t in coverage["tables"]),
                "handout_datasets": len(coverage["handout_datasets"]),
                "dates": len(coverage["service_dates"]),
                "routes": len(coverage["route_ids"]),
            }
        )
    )
