"""Enumerate source resources and bounded combinations without evaluation labels."""

import itertools
from core import make_case, make_plan, payload, seconds, at
from input_facts import plan_facts


def build_case(request):
    case = make_case(
        request["scenario"],
        request["date"],
        request["route"],
        request.get("vehicle") or None,
    )
    snapshot = case["snapshot"]
    if request.get("objective", "").strip():
        case["objective"] = request["objective"].strip()
    text = request.get("requirements", "").strip()
    if text:
        snapshot["policies"] = snapshot["policies"] + [
            {
                "id": "SCENARIO-OPERATOR",
                "scope": "all affected trips",
                "requirement": text,
            }
        ]
    additions = request.get("resources", [])
    if additions and case["id"] not in ["new_bus", "new_crew"]:
        raise ValueError("New resource profiles belong to an onboarding scenario.")
    if additions:
        kind = "bus" if case["id"] == "new_bus" else "crew"
        profiles = snapshot["buses"] if kind == "bus" else snapshot["crews"]
        offered = case["event"]["offered_resource"]
        template = dict(profiles[offered])
        del profiles[offered]
        for addition in additions:
            rid = addition["id"].strip()
            if not rid or rid in snapshot["buses"] or rid in snapshot["crews"]:
                raise ValueError("Each added resource needs a new, unique identifier.")
            start = f"{snapshot['date']}T{addition['availableFrom']}:00+08:00"
            end = f"{snapshot['date']}T{addition['availableUntil']}:00+08:00"
            if seconds(end) <= seconds(start):
                raise ValueError(
                    "Resource availability must end after it starts on the selected date."
                )
            profile = {
                **template,
                "id": rid,
                "issued_at": snapshot["decision_at"],
                "available_from": start,
                "available_until": end,
                "registration": "confirmed" if addition["confirmed"] else "pending",
                "scenario_provenance": "Operator-supplied hypothetical resource, free of other commitments in the stated window. Location inherits the selected source resource staging stop.",
            }
            if kind == "bus":
                profile.update(
                    release=(
                        "released"
                        if addition["confirmed"]
                        else "pending Engineering release"
                    ),
                    capacity=addition["capacity"],
                    wheelchair_spaces=addition["wheelchairSpaces"],
                )
            else:
                profile.update(
                    qualification=(
                        addition["qualification"] if addition["confirmed"] else None
                    ),
                    break_start=end,
                    break_end=at(end, 1800),
                )
            profiles[rid] = profile
        case["event"].update(
            offered_resource=None,
            statement="Hypothetical onboarding overlay. The additional resource profiles state their registration, qualification/release and availability. Confirmed profiles are listed in this scenario; pending profiles remain unavailable. They have no other commitments within the stated windows. Existing source assignments remain protected.",
        )
    return case


def generate(case, candidate_limit=512, node_limit=50000):
    snap = case["snapshot"]
    base = {t["id"]: t for t in snap["trips"]}
    targets = [base[i] for i in case["affected_trip_ids"]]
    affected = set(case["affected_trip_ids"])
    originals = [
        {"trip_id": t["id"], "bus": t["bus"], "crew": t["crew"]} for t in targets
    ]
    plans = []
    seen = set()
    visits = 0
    limited = False

    def add(assignments):
        signature = tuple((a["trip_id"], a["bus"], a["crew"]) for a in assignments)
        if signature not in seen:
            seen.add(signature)
            plans.append(make_plan(case, assignments, f"plan_{len(plans) + 1}"))

    def free(kind, rid, group):
        profile = snap["buses" if kind == "bus" else "crews"][rid]
        if (
            rid == case["event"]["unavailable_bus"]
            or rid == case["event"]["unavailable_crew"]
        ):
            return False
        if profile.get("registration") == "pending" or (
            kind == "bus" and profile["release"] != "released"
        ):
            return False
        existing = [
            t for t in snap["trips"] if t[kind] == rid and t["id"] not in affected
        ]
        for task in group:
            start = seconds(task["start"]) - 420
            end = seconds(task["end"]) + 45
            if start < seconds(profile["available_from"]) or end > seconds(
                profile["available_until"]
            ):
                return False
            if kind == "crew" and profile["qualification"] != task["service"]:
                return False
            if kind == "bus":
                original = snap["buses"][task["bus"]]
                if (
                    profile["capacity"] < original["capacity"]
                    or profile["wheelchair_spaces"] < original["wheelchair_spaces"]
                ):
                    return False
            if any(
                start < seconds(t["end"]) + 45 and end > seconds(t["start"]) - 120
                for t in existing
            ):
                return False
        return True

    add(originals)
    if case["id"] in ["sick_crew", "new_crew"]:
        for rid in snap["crews"]:
            add([{**a, "crew": rid} for a in originals])
    else:
        groups = {
            rid: [t for t in targets if t["crew"] == rid]
            for rid in dict.fromkeys(t["crew"] for t in targets)
        }
        options = {
            rid: list(
                dict.fromkeys(
                    [rid]
                    + [other for other in snap["crews"] if free("crew", other, group)]
                )
            )
            for rid, group in groups.items()
        }
        for bus in snap["buses"]:
            for replacements in itertools.product(*(options[rid] for rid in groups)):
                mapping = dict(zip(groups, replacements))
                add([{**a, "bus": bus, "crew": mapping[a["crew"]]} for a in originals])

    if case["id"] in ["sick_crew", "faulty_depot"]:
        per_trip = []
        for task in targets:
            buses = (
                [task["bus"]]
                if case["id"] in ["sick_crew", "new_crew"]
                else [rid for rid in snap["buses"] if free("bus", rid, [task])]
            )
            crews = [rid for rid in snap["crews"] if free("crew", rid, [task])]
            per_trip.append(
                [
                    {"trip_id": task["id"], "bus": b, "crew": c}
                    for b in buses
                    for c in crews
                ]
            )
        search_added = 0

        def search(depth, chosen):
            nonlocal visits, limited, search_added
            visits += 1
            if visits > node_limit or search_added >= candidate_limit:
                limited = True
                return
            if depth == len(targets):
                before = len(plans)
                add(chosen)
                search_added += len(plans) - before
                return
            task = targets[depth]
            for option in per_trip[depth]:
                start = seconds(task["start"]) - 420
                conflict = any(
                    (
                        previous["bus"] == option["bus"]
                        or previous["crew"] == option["crew"]
                    )
                    and seconds(base[previous["trip_id"]]["end"]) + 45 > start
                    for previous in chosen
                )
                if not conflict:
                    search(depth + 1, chosen + [option])
                if limited:
                    return

        search(0, [])
    evidence = payload(case, plans)
    evidence["derived_schedule_facts"] = [plan_facts(case, p) for p in plans]
    return {"id": case["id"], "evidence": evidence}, {
        "resourcesConsidered": {
            "buses": len(snap["buses"]),
            "crews": len(snap["crews"]),
        },
        "candidateCount": len(plans),
        "searchNodes": visits,
        "searchLimited": limited,
        "scope": "Full-block substitutions across the supplied resource catalog. Sick-crew and depot-fault recovery also search bounded per-trip combinations. All other supplied commitments remain protected. Unknown rescue timings are not invented.",
    }
