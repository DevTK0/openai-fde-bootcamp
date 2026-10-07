import os
import copy
import hashlib
import json
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path

DB = Path(
    os.environ.get(
        "DASHBOARD_DATABASE_PATH",
        Path(__file__).resolve().parents[3] / "data/operations/lionlink-network.sqlite",
    )
)
SCENARIOS = {
    "new_bus": "New bus offered",
    "new_crew": "New crew offered",
    "sick_crew": "Crew sick for remaining duty",
    "faulty_depot": "Bus held before departure",
    "faulty_service": "Bus fault during service",
}


def seconds(t):
    return int(datetime.fromisoformat(t).timestamp())


def at(t, delta):
    return (datetime.fromisoformat(t) + timedelta(seconds=delta)).isoformat()


def load_snapshot(date=None, clock=None):
    with sqlite3.connect(f"file:{DB}?mode=ro", uri=True) as db:
        db.row_factory = sqlite3.Row

        def query(sql, args=()):
            return [dict(r) for r in db.execute(sql, args)]

        date = date or db.execute("select min(service_date) from trips").fetchone()[0]
        clock = clock or date + "T05:50:00+08:00"
        trips = query(
            """select trip_id as id, route_id as route, service_no as service,
            planned_vehicle_id as bus, planned_crew_id as crew, origin_stop_id as origin,
            destination_stop_id as destination, scheduled_departure_at as start,
            scheduled_arrival_at as end from trips where service_date=? and timetable_version in
            (select version_id from timetable_records where issued_at<=?) order by scheduled_departure_at,trip_id""",
            (date, clock),
        )
        buses = query(
            """select r.vehicle_id as id, r.issued_at, r.available_from, r.available_until,
            r.location_stop_id as location, r.release_state as release, r.capacity_people as capacity,
            v.wheelchair_spaces from vehicle_readiness r join vehicles v using(vehicle_id)
            where r.service_date=? and r.issued_at<=? order by r.issued_at""",
            (date, clock),
        )
        crews = query(
            """select crew_id as id, qualified_service_no as qualification,
            record_issued_at as issued_at, available_from, available_until, start_stop_id as location,
            protected_break_start as break_start, protected_break_end as break_end,
            maximum_continuous_duty_minutes as max_duty_minutes from crew_duties
            where service_date=? and record_issued_at<=? order by record_issued_at""",
            (date, clock),
        )
        policies = query(
            "select constraint_id as id, scope, requirement from planning_constraints order by constraint_id"
        )
        routes = query(
            "select route_id as route, stop_order, stop_id from route_stops order by route_id,stop_order"
        )
        updates = query(
            "select * from resource_updates where service_date=? and issued_at<=?",
            (date, clock),
        )
        movements = query(
            "select movement_id,vehicle_id,crew_id,from_trip_id,to_trip_id,from_stop_id,to_stop_id,planning_seconds,basis from terminal_movements where service_date=?",
            (date,),
        )
        calls = query(
            "select stop_order,stop_id,scheduled_arrival_at from stop_calls where trip_id=? order by stop_order",
            (trips[0]["id"],),
        )
    return {
        "date": date,
        "decision_at": clock,
        "trips": trips,
        "buses": {r["id"]: r for r in buses},
        "crews": {r["id"]: r for r in crews},
        "policies": policies,
        "route_stops": routes,
        "resource_updates": updates,
        "first_trip_planned_stops": calls,
        "planning_movements": movements,
    }


def make_case(kind, date=None, route=None, vehicle=None):
    snap = load_snapshot(date)
    target = next(
        t
        for t in snap["trips"]
        if (route is None or t["route"] == route)
        and (vehicle is None or t["bus"] == vehicle)
    )
    base_bus = target["bus"]
    base_crew = target["crew"]
    targets = (
        [t for t in snap["trips"] if t["crew"] == base_crew]
        if kind in ["sick_crew", "new_crew"]
        else [t for t in snap["trips"] if t["bus"] == base_bus]
    )
    event = {
        "type": kind,
        "source": "Hypothetical scenario overlay on SQLite; not an observed incident.",
        "unavailable_bus": None,
        "unavailable_crew": None,
        "offered_resource": None,
    }
    objective = "Cover every affected trip at its scheduled time, preserving all other commitments, route-stop sequences, and the original allocated capacity. Prefer fewer resource changes, then fewer buses and crew used. Return only complete plans supported by the evidence."
    if kind in ["faulty_depot", "faulty_service"]:
        event.update(
            unavailable_bus=base_bus,
            statement=f"{base_bus} is held for the remainder of the supplied operating day. No return-to-service release exists in this scenario.",
        )
    elif kind == "sick_crew":
        event.update(
            unavailable_crew=base_crew,
            statement=f"{base_crew} is sick and unavailable for all remaining assigned trips today.",
        )
    elif kind == "new_bus":
        proposed = copy.deepcopy(snap["buses"][base_bus])
        proposed.update(
            id="OFFERED-BUS",
            release="pending Engineering release",
            issued_at=snap["decision_at"],
        )
        snap["buses"][proposed["id"]] = proposed
        event.update(
            offered_resource=proposed["id"],
            statement="A bus is offered with the stated capacity and availability, but Engineering release and registration are not yet confirmed. Compare full-block deployment proposals; keeping the original roster and holding the offered bus is a valid alternative.",
        )
    else:
        proposed = copy.deepcopy(snap["crews"][base_crew])
        proposed.update(
            id="OFFERED-CREW", qualification=None, issued_at=snap["decision_at"]
        )
        snap["crews"][proposed["id"]] = proposed
        event.update(
            offered_resource=proposed["id"],
            statement="A crew member is offered with the stated location and availability, but qualification and registration are not yet confirmed. Compare full-duty deployment proposals; keeping the original roster and holding the offer is a valid alternative.",
        )
    if kind == "faulty_service":
        with sqlite3.connect(f"file:{DB}?mode=ro", uri=True) as db:
            db.row_factory = sqlite3.Row
            stops = [
                dict(r)
                for r in db.execute(
                    "select stop_order,stop_id,scheduled_arrival_at from stop_calls where trip_id=? order by stop_order",
                    (target["id"],),
                )
            ]
        incident = stops[max(1, len(stops) // 3)]
        incident_clock = at(incident["scheduled_arrival_at"], 30)
        snap = load_snapshot(snap["date"], incident_clock)
        snap["first_trip_planned_stops"] = stops
        targets = [
            t
            for t in snap["trips"]
            if t["bus"] == base_bus and t["start"] >= target["start"]
        ]
        event.update(
            incident_stop_id=incident["stop_id"],
            incident_stop_order=incident["stop_order"],
            statement=f"{base_bus} reports a fault on {target['id']} at route position {incident['stop_order']}, stop {incident['stop_id']}, at {incident_clock}. Earlier duties and earlier positions on this trip are assumed served in this hypothetical scenario. The bus is held for the rest of the day. Rescue travel time, transfer duration and passenger count are not supplied.",
        )
        objective = "Recover passengers and the remaining route of the interrupted trip, and cover every later affected trip while preserving all other commitments. No dispatch recommendation is feasible without supported rescue timing and capacity. Return unresolved proposals separately."
    return {
        "schema_version": 2,
        "id": kind,
        "title": SCENARIOS[kind],
        "objective": objective,
        "event": event,
        "snapshot": snap,
        "affected_trip_ids": [t["id"] for t in targets],
        "scope": "Complete remaining assignments in the supplied day for the incident resource, plus the full supplied schedules of all resources touched by a plan. No claim about unrecorded duties.",
    }


def materialize(case, plan):
    overrides = {r["trip_id"]: r for r in plan["assignments"]}
    trips = []
    for t in case["snapshot"]["trips"]:
        item = copy.deepcopy(t)
        if t["id"] in overrides:
            r = overrides[t["id"]]
            item.update(bus=r["bus"], crew=r["crew"])
        trips.append(item)
    return trips


def closure(case, plans):
    buses = set()
    crews = set()
    for p in plans:
        for a in p["assignments"]:
            buses.add(a["bus"])
            crews.add(a["crew"])
    for t in case["snapshot"]["trips"]:
        if t["id"] in case["affected_trip_ids"]:
            buses.add(t["bus"])
            crews.add(t["crew"])
    while True:
        bs = set(buses)
        cs = set(crews)
        for t in case["snapshot"]["trips"]:
            if t["bus"] in buses or t["crew"] in crews:
                buses.add(t["bus"])
                crews.add(t["crew"])
        if buses == bs and crews == cs:
            break
    return buses, crews


def payload(case, plans, policies=None):
    snap = case["snapshot"]
    buses, crews = closure(case, plans)
    trips = [t for t in snap["trips"] if t["bus"] in buses or t["crew"] in crews]
    routes = {t["route"] for t in trips}
    return {
        "schema_version": 2,
        "scenario": {
            k: case[k]
            for k in ["id", "title", "objective", "event", "affected_trip_ids", "scope"]
        },
        "decision_at": snap["decision_at"],
        "operating_requirements": (
            policies if policies is not None else snap["policies"]
        ),
        "action_contract": [
            "Each candidate is an alternative complete plan, not a simultaneous assignment. Apply every listed assignment override. Every other timetable row remains unchanged.",
            "Every affected trip must have an explicit assignment, even if unchanged. A fault or sickness overlay overrides the earlier database state for the entire remaining day.",
            "Each operated trip retains its complete ordered route and timetable, except the interrupted first trip in faulty_service, whose remaining route starts at the scenario incident position and whose rescue times are explicitly unknown. Substitution must preserve the original allocated passenger and wheelchair capacity. This capacity-preservation condition is part of this experiment objective, not a claim of observed demand.",
            "All timetable times are planning inputs, not future observations. No actual outcome fields are supplied. Supplied source schedules outside the changed assignment must remain protected.",
            "Boarding needs 120 seconds, and a driver moving to a different bus needs 300 seconds takeover before boarding. Continuing on the same bus does not repeat takeover. An initial changed assignment also requires takeover. Later same-stop vehicle turnaround includes boarding and may overlap stationary driver change as allowed by NW-PC03.",
            "Unknown evidence is not permission. Offered resources are not listed/released/qualified until explicitly confirmed. Do not invent a release, driver, movement time, or passenger transfer.",
            "Return only feasible complete plans. Unknown or invalid plans are not recommendations. No requirement to fill five slots.",
        ],
        "buses": [snap["buses"][b] for b in sorted(buses)],
        "crews": [snap["crews"][c] for c in sorted(crews)],
        "protected_timetable": trips,
        "ordered_route_stops": [r for r in snap["route_stops"] if r["route"] in routes],
        "planning_movements": [
            m
            for m in snap.get("planning_movements", [])
            if m["vehicle_id"] in buses or m["crew_id"] in crews
        ],
        "resource_updates": [
            u
            for u in snap["resource_updates"]
            if set(u["resource_id"].split("|")) & (buses | crews)
        ],
        "candidate_plans": plans,
    }


def make_plan(case, assignments, ident=None):
    snap = case["snapshot"]
    base = {t["id"]: t for t in snap["trips"]}
    action = []
    effective = materialize(case, {"assignments": assignments})
    for a in assignments:
        t = base[a["trip_id"]]
        earlier = [
            r for r in effective if r["crew"] == a["crew"] and r["start"] < t["start"]
        ]
        previous = max(earlier, key=lambda r: r["start"]) if earlier else None
        takeover = (
            (previous["bus"] != a["bus"])
            if previous
            else (a["bus"], a["crew"]) != (t["bus"], t["crew"])
        )
        action.append(
            {
                "trip_id": t["id"],
                "bus": a["bus"],
                "crew": a["crew"],
                "takeover_at": at(t["start"], -420) if takeover else None,
                "boarding_at": at(t["start"], -120),
                "departure_at": t["start"],
                "arrival_at": t["end"],
                "alighting_complete_at": at(t["end"], 45),
                "origin": t["origin"],
                "destination": t["destination"],
                "route": t["route"],
            }
        )
    if case["id"] == "faulty_service":
        for row in action:
            if row["trip_id"] == case["affected_trip_ids"][0]:
                row.update(
                    origin=case["event"]["incident_stop_id"],
                    remaining_route_from_position=case["event"]["incident_stop_order"],
                )
                for field in [
                    "takeover_at",
                    "boarding_at",
                    "departure_at",
                    "arrival_at",
                    "alighting_complete_at",
                ]:
                    row[field] = None
    changed = sum(
        (a["bus"], a["crew"]) != (base[a["trip_id"]]["bus"], base[a["trip_id"]]["crew"])
        for a in assignments
    )
    return {
        "id": ident or "PENDING",
        "assignments": action,
        "unchanged_commitments": "Every protected timetable row not overridden here remains assigned as supplied. No donor trips are dropped.",
        "resource_changes": changed,
        "rescue": (
            {
                "stop_id": case["event"].get("incident_stop_id"),
                "remaining_route_from_position": case["event"].get(
                    "incident_stop_order"
                ),
                "positioning_seconds": None,
                "transfer_seconds": None,
                "passengers": None,
            }
            if case["id"] == "faulty_service"
            else None
        ),
    }
