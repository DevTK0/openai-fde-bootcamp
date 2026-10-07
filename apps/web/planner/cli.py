import json
import os
import sys
import uuid
from pathlib import Path
from catalog import Catalog
from engine import network, handout
from provider import api_key


def emit(event):
    print(json.dumps(event, separators=(",", ":")), flush=True)


def catalog():
    source = Catalog()
    dates = [
        r[0]
        for r in source.db.execute(
            "select distinct service_date from trips order by service_date"
        )
    ]
    routes = [
        dict(r)
        for r in source.db.execute(
            "select distinct route_id as id,service_no as service,origin_stop_id as origin,destination_stop_id as destination from trips order by route_id"
        )
    ]
    vehicles = [
        {"id": r[0], "routes": r[1].split(",")}
        for r in source.db.execute(
            "select planned_vehicle_id,group_concat(distinct route_id) from trips group by planned_vehicle_id order by planned_vehicle_id"
        )
    ]
    policies = [
        dict(r)
        for r in source.db.execute(
            "select constraint_id as id,scope,requirement from planning_constraints order by constraint_id"
        )
    ]

    def count(table):
        return source.db.execute('select count(*) from "' + table + '"').fetchone()[0]

    try:
        api_key()
        configured = True
    except (ValueError, OSError):
        configured = False
    return {
        "dates": dates,
        "routes": routes,
        "vehicles": vehicles,
        "policies": policies,
        "keyConfigured": configured,
        "coverage": {
            "tables": len(source.tables),
            "rows": sum(count(t) for t in source.tables),
            "trips": count("trips"),
            "vehicles": count("vehicles"),
            "crewRecords": count("crew_duties"),
            "handoutDatasets": count("handout_tables"),
        },
        "importedScenarios": [
            {
                "id": c["id"],
                "title": c["id"].replace("-", " ").title(),
                "decisionAt": c["decision_at"],
                "objective": c["objective"],
            }
            for c in json.loads((Path(__file__).parent / "scenarios.json").read_text())
        ],
    }


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "catalog":
        emit(catalog())
        return
    request = json.load(sys.stdin)
    ident = str(uuid.uuid4())
    directory = (
        Path(
            os.environ.get(
                "OPS_PLANNING_RUNS_DIR",
                Path(__file__).resolve().parent.parent / ".ops-planning",
            )
        )
        / ident
    )
    directory.mkdir(parents=True)
    (directory / "input.json").write_text(json.dumps(request, indent=2))

    def progress(phase, message):
        emit({"type": "progress", "runId": ident, "phase": phase, "message": message})

    try:
        progress("preparation", "Loading the source records for this scenario.")
        if request["kind"] == "network":
            meta = catalog()
            if request["date"] not in meta["dates"] or request["route"] not in {
                r["id"] for r in meta["routes"]
            }:
                raise ValueError(
                    "Choose an operating date and route from the source database."
                )
            report = network(request, directory, progress)
        elif request["kind"] == "handout":
            report = handout(request, directory, progress)
        else:
            raise ValueError("Unknown planning request type.")
        report["runId"] = ident
        (directory / "report.json").write_text(json.dumps(report, indent=2))
        emit({"type": "result", "report": report})
    except Exception as error:
        message = (
            str(error)
            if isinstance(error, (ValueError, OSError))
            else "The planning run could not complete. Inspect the saved run evidence."
        )
        (directory / "error.json").write_text(json.dumps({"message": message}))
        emit({"type": "error", "runId": ident, "message": message})
        sys.exit(1)


if __name__ == "__main__":
    main()
