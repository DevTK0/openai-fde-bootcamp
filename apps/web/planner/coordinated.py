"""Bounded terminal-wide allocation search using only issued SQLite resources."""

import random
from core import load_snapshot, seconds, make_plan, payload
from input_facts import plan_facts

DEFAULT_OBJECTIVE = "Cover all remaining trips across the selected services at their published times. Prefer fewer changed crew assignments, then fewer changed bus assignments. Preserve all earlier and outside-service commitments. Compare complete allocations, not individual replacements."

PRESETS = {
    "toa_bus": {
        "title": "Toa Payoh bus withdrawal",
        "services": ["231", "232", "235", "238"],
        "bus": "NW-V001",
        "crew": None,
    },
    "amk_bus": {
        "title": "Ang Mo Kio bus withdrawal",
        "services": ["261", "262", "269"],
        "bus": "NW-V031",
        "crew": None,
    },
    "toa_crew": {
        "title": "Toa Payoh relief crew sickness",
        "services": ["231", "232", "235", "238"],
        "bus": None,
        "crew": "NW-C062",
    },
}


def coordinated_case(ident, date="2026-10-05", clock="09:25"):
    preset = PRESETS[ident]
    snap = load_snapshot(date, f"{date}T{clock}:00+08:00")
    targets = [
        t
        for t in snap["trips"]
        if t["service"] in preset["services"]
        and seconds(t["start"]) >= seconds(snap["decision_at"]) + 420
    ]
    return {
        "schema_version": 2,
        "id": ident,
        "title": preset["title"],
        "objective": DEFAULT_OBJECTIVE,
        "event": {
            "type": ident,
            "source": "Hypothetical withdrawal at the stated decision time; all resources and duties come from SQLite.",
            "unavailable_bus": preset["bus"],
            "unavailable_crew": preset["crew"],
            "offered_resource": None,
            "statement": f"{preset['bus'] or preset['crew']} is unavailable for trips departing after the decision time. Trips already underway complete as planned. No additional resources are introduced.",
        },
        "snapshot": snap,
        "affected_trip_ids": [t["id"] for t in targets],
        "scope": "Coordinated remaining-trip allocations across selected co-located loop services. Earlier trips, trips starting within seven minutes, and all outside-service duties remain unchanged. Listed resources are considered across the entire day. Search is bounded and not exhaustive.",
    }


def generate_coordinated(case, limit=36, attempts=3000):
    snap = case["snapshot"]
    affected = set(case["affected_trip_ids"])
    targets = [t for t in snap["trips"] if t["id"] in affected]
    retained = [t for t in snap["trips"] if t["id"] not in affected]
    rng = random.Random(41)
    plans, seen = [], set()
    visits = 0
    for attempt in range(attempts):
        calendars = {
            kind: {rid: [t for t in retained if t[kind] == rid] for rid in snap[plural]}
            for kind, plural in [("bus", "buses"), ("crew", "crews")]
        }
        chosen = []
        for task in targets:
            visits += 1
            options = {}
            for kind, plural in [("bus", "buses"), ("crew", "crews")]:
                options[kind] = []
                for rid, profile in snap[plural].items():
                    if rid == case["event"]["unavailable_" + kind]:
                        continue
                    if kind == "crew" and profile["qualification"] != task["service"]:
                        continue
                    if kind == "bus" and (
                        profile["release"] != "released"
                        or profile["capacity"] < snap["buses"][task["bus"]]["capacity"]
                        or profile["wheelchair_spaces"]
                        < snap["buses"][task["bus"]]["wheelchair_spaces"]
                    ):
                        continue
                    start, end = seconds(task["start"]), seconds(task["end"]) + 45
                    if start - 420 < seconds(
                        profile["available_from"]
                    ) or end > seconds(profile["available_until"]):
                        continue
                    rows = sorted(
                        calendars[kind][rid] + [task], key=lambda t: t["start"]
                    )
                    if profile["location"] != rows[0]["origin"]:
                        continue
                    if any(
                        a["destination"] != b["origin"]
                        or seconds(b["start"]) - seconds(a["end"]) < 465
                        for a, b in zip(rows, rows[1:])
                    ):
                        continue
                    if kind == "crew":
                        if (
                            seconds(rows[-1]["end"])
                            + 45
                            - (seconds(rows[0]["start"]) - 420)
                            > profile["max_duty_minutes"] * 60
                        ):
                            continue
                        if any(
                            seconds(t["start"]) - 420 < seconds(profile["break_end"])
                            and seconds(t["end"]) + 45 > seconds(profile["break_start"])
                            for t in rows
                        ):
                            continue
                    options[kind].append(rid)
            if not options["bus"] or not options["crew"]:
                break
            assignment = {"trip_id": task["id"]}
            for kind in ["bus", "crew"]:
                pool = options[kind]
                # Vary how strongly each search restart preserves the current roster.
                rid = (
                    task[kind]
                    if task[kind] in pool
                    and rng.random() < (0.98 if attempt % 3 == 0 else 0.75)
                    else rng.choice(pool)
                )
                assignment[kind] = rid
            chosen.append(assignment)
            effective = {**task, "bus": assignment["bus"], "crew": assignment["crew"]}
            for kind in ["bus", "crew"]:
                calendars[kind][assignment[kind]].append(effective)
        if len(chosen) != len(targets):
            continue
        signature = tuple((a["bus"], a["crew"]) for a in chosen)
        if signature in seen:
            continue
        seen.add(signature)
        plan = make_plan(case, chosen, f"plan_{len(plans) + 1}")
        plan["crew_changes"] = sum(
            a["crew"] != t["crew"] for a, t in zip(chosen, targets)
        )
        plan["bus_changes"] = sum(a["bus"] != t["bus"] for a, t in zip(chosen, targets))
        plans.append(plan)
        if len(plans) == limit:
            break
    evidence = payload(case, plans)
    evidence["derived_schedule_facts"] = [plan_facts(case, p) for p in plans]
    return {"id": case["id"], "evidence": evidence}, {
        "candidateCount": len(plans),
        "resourcesConsidered": {
            "buses": len(snap["buses"]),
            "crews": len(snap["crews"]),
        },
        "searchNodes": visits,
        "searchLimited": True,
        "scope": case["scope"],
    }


def decision_view(packet):
    """Arithmetic projection of complete calendars, without policy verdicts."""
    resources = []
    for timeline in packet["effective_resource_schedules"]["resource_timelines"]:
        tasks = timeline["effective_tasks_in_time_order"]
        profile = timeline["resource"]
        item = {
            "kind": timeline["kind"],
            "id": profile["id"],
            "initial_location": profile["location"],
            "first_origin": tasks[0]["origin"],
            "assigned_services": sorted({t["service"] for t in tasks}),
            "location_changes": [
                {"from": a["destination"], "to": b["origin"]}
                for a, b in zip(tasks, tasks[1:])
                if a["destination"] != b["origin"]
            ],
            "minimum_preparation_minus_available_from_seconds": min(
                seconds(t["preparation_at"]) - seconds(profile["available_from"])
                for t in tasks
            ),
            "minimum_available_until_minus_alighting_seconds": min(
                seconds(profile["available_until"]) - seconds(t["final_alighting_at"])
                for t in tasks
            ),
            "minimum_departure_minus_previous_alighting_seconds": min(
                (
                    seconds(b["scheduled_departure"]) - seconds(a["final_alighting_at"])
                    for a, b in zip(tasks, tasks[1:])
                ),
                default=None,
            ),
            "minimum_preparation_minus_previous_alighting_seconds": min(
                (
                    seconds(b["preparation_at"]) - seconds(a["final_alighting_at"])
                    for a, b in zip(tasks, tasks[1:])
                ),
                default=None,
            ),
            "task_count": len(tasks),
        }
        if timeline["kind"] == "crew":
            item.update(
                qualification=profile["qualification"],
                maximum_duty_seconds=profile["max_duty_minutes"] * 60,
                duty_span_minutes=timeline["own_duty"]["span_seconds"] / 60,
                duty_span_seconds=timeline["own_duty"]["span_seconds"],
                maximum_break_overlap_seconds=max(
                    max(
                        0,
                        min(
                            seconds(t["final_alighting_at"]),
                            seconds(profile["break_end"]),
                        )
                        - max(
                            seconds(t["preparation_at"]),
                            seconds(profile["break_start"]),
                        ),
                    )
                    for t in tasks
                ),
            )
        else:
            item.update(
                release=profile["release"],
                capacity=profile["capacity"],
                wheelchair_spaces=profile["wheelchair_spaces"],
            )
        resources.append(item)
    numeric_fields = [
        "minimum_preparation_minus_available_from_seconds",
        "minimum_available_until_minus_alighting_seconds",
        "minimum_departure_minus_previous_alighting_seconds",
        "minimum_preparation_minus_previous_alighting_seconds",
    ]
    envelope = {}
    for kind in ["bus", "crew"]:
        group = [r for r in resources if r["kind"] == kind]
        envelope[kind] = {
            field: min((r[field] for r in group if r[field] is not None), default=None)
            for field in numeric_fields
        }
        envelope[kind]["initial_location_mismatches"] = [
            r["id"] for r in group if r["initial_location"] != r["first_origin"]
        ]
        envelope[kind]["location_changes"] = [
            change for r in group for change in r["location_changes"]
        ]
    bus_gap = envelope["bus"].pop("minimum_departure_minus_previous_alighting_seconds")
    envelope["bus"]["minimum_previous_arrival_to_next_departure_seconds"] = (
        None if bus_gap is None else bus_gap + 45
    )
    envelope["bus"].pop("minimum_preparation_minus_previous_alighting_seconds")
    envelope["crew"].pop("minimum_departure_minus_previous_alighting_seconds")
    crew = [r for r in resources if r["kind"] == "crew"]
    envelope["crew"].update(
        longest_duty_minutes=max(r["duty_span_minutes"] for r in crew),
        maximum_continuous_duty_minutes=min(
            r["maximum_duty_seconds"] / 60 for r in crew
        ),
        maximum_break_overlap_seconds=max(
            r["maximum_break_overlap_seconds"] for r in crew
        ),
        qualifications=[
            {
                "id": r["id"],
                "qualified_service": r["qualification"],
                "assigned_services": r["assigned_services"],
            }
            for r in crew
        ],
    )
    limiting_crew = min(
        crew, key=lambda r: r["maximum_duty_seconds"] / 60 - r["duty_span_minutes"]
    )
    envelope["crew"]["tightest_individual_duty"] = {
        "crew": limiting_crew["id"],
        "duty_minutes": limiting_crew["duty_span_minutes"],
        "maximum_minutes": limiting_crew["maximum_duty_seconds"] / 60,
    }
    envelope["bus"]["release_states"] = sorted(
        {r["release"] for r in resources if r["kind"] == "bus"}
    )
    capacities = packet["capacity_comparisons"]
    proposal = packet["proposal"]
    view = {
        "scenario": {
            k: v for k, v in packet["scenario"].items() if k != "affected_trip_ids"
        },
        "decision_at": packet["decision_at"],
        "operating_requirements": packet["operating_requirements"],
        "action_contract": packet["action_contract"],
        "projection": "The arithmetic below is calculated across every effective task of each assigned resource, including retained earlier and future commitments. Negative time differences indicate overlap or out-of-window work. Earlier retained tasks are not new dispatches. All route stop sequences and departure times are retained. Zero location changes means every consecutive destination equals the next origin. No passenger replay is proposed. Full source calendars are saved in the audit evidence.",
        "proposal": {
            "affected_trip_count": len(packet["scenario"]["affected_trip_ids"]),
            "explicit_assignment_count": len(proposal["assignments"]),
            "assigned_buses": sorted({a["bus"] for a in proposal["assignments"]}),
            "assigned_crews": sorted({a["crew"] for a in proposal["assignments"]}),
            "assigned_routes": sorted({a["route"] for a in proposal["assignments"]}),
            "changed_crew_assignments": proposal["crew_changes"],
            "changed_bus_assignments": proposal["bus_changes"],
            "missing_affected_trip_ids": sorted(
                set(packet["scenario"]["affected_trip_ids"])
                - {a["trip_id"] for a in proposal["assignments"]}
            ),
            "unchanged_commitments": proposal["unchanged_commitments"],
        },
        "capacity_arithmetic": {
            "minimum_assigned_people": min(r["assigned_people"] for r in capacities),
            "minimum_assigned_wheelchairs": min(
                r["assigned_wheelchairs"] for r in capacities
            ),
            "minimum_assigned_minus_original_people": min(
                r["assigned_people"] - r["original_people"] for r in capacities
            ),
            "minimum_assigned_minus_original_wheelchairs": min(
                r["assigned_wheelchairs"] - r["original_wheelchairs"]
                for r in capacities
            ),
        },
        "listed_bus_profiles": [
            {k: r[k] for k in ["id", "release", "capacity", "wheelchair_spaces"]}
            for r in resources
            if r["kind"] == "bus"
        ],
        "calendar_extrema": envelope,
        "preparation_semantics": "Crew preparation already includes 120 seconds boarding plus 300 seconds takeover when changing buses. The crew preparation-minus-previous-alighting gap is AFTER subtracting those preparation activities. Zero means the previous trip finishes exactly when the next preparation starts, with no overlap. Do not subtract boarding or takeover twice. Finishing exactly at available_until or protected break_start is within the permitted window. Bus arrival-to-departure gaps include the 45 seconds alighting; same-stop turnaround then needs 420 seconds, including boarding.",
        "extrema_semantics": "Each minimum is the lowest value across every task of every assigned resource, including retained duties. Each maximum is the highest. Values are exact timestamp arithmetic, not eligibility labels. Duty values use minutes; gaps and overlaps use seconds.",
        "resource_updates": packet["resource_updates"],
        "planning_movements": packet["planning_movements"],
    }

    if packet["scenario_policy_additions"]:
        view["additional_policy_evidence"] = {
            "complete_resource_schedules": packet["effective_resource_schedules"],
            "original_affected_assignments": packet["original_affected_assignments"],
            "capacity_comparisons": packet["capacity_comparisons"],
            "ordered_route_stops": packet["ordered_route_stops"],
        }
    return view


def policy_evidence(packet, policy):
    view = decision_view(packet)
    proposal = view["proposal"]
    event = packet["scenario"]["event"]
    bus, crew = view["calendar_extrema"]["bus"], view["calendar_extrema"]["crew"]
    cap = view["capacity_arithmetic"]
    tightest = crew["tightest_individual_duty"]
    if policy["id"] == "NW-PC02":
        units = []
        for timeline in packet["effective_resource_schedules"]["resource_timelines"]:
            profile = timeline["resource"]
            tasks = timeline["effective_tasks_in_time_order"]
            early_count = sum(
                seconds(t["preparation_at"]) < seconds(profile["available_from"])
                for t in tasks
            )
            late_count = sum(
                seconds(t["final_alighting_at"]) > seconds(profile["available_until"])
                for t in tasks
            )
            text = f"This is a listed {timeline['kind']} from SQLite. Number of its tasks starting preparation before availability: {early_count}. Number finishing after availability: {late_count}. "
            if timeline["kind"] == "bus":
                capacities = [
                    r
                    for r in packet["capacity_comparisons"]
                    if r["assigned_bus"] == profile["id"]
                ]
                text += f"Its release state is {profile['release']}. Tasks with passenger capacity below the original allocation: {sum(r['assigned_people'] < r['original_people'] for r in capacities)}. Tasks with wheelchair spaces below the original allocation: {sum(r['assigned_wheelchairs'] < r['original_wheelchairs'] for r in capacities)}."
            else:
                text += f"Its qualified service is {profile['qualification']}. Its assigned services are {sorted({t['service'] for t in tasks})}. Its status is {'sick and unavailable' if profile['id'] == event['unavailable_crew'] else 'available'} ."
            units.append(
                {"unit": profile["id"], "scope": timeline["kind"], "facts": text}
            )
        return units
    facts = {
        "NW-PC01": f"The proposal explicitly assigns {proposal['explicit_assignment_count']} of {proposal['affected_trip_count']} affected trips. Missing trips: {proposal['missing_affected_trip_ids']}. Every departure time and ordered route-stop sequence remains unchanged. All other timetable rows remain assigned unchanged.",
        "NW-PC03": f"The shortest time between a bus arrival and its next departure is {bus['minimum_previous_arrival_to_next_departure_seconds']} seconds. This includes alighting and turnaround. The shortest time from a crew finishing alighting to starting preparation for its next task is {crew['minimum_preparation_minus_previous_alighting_seconds']} seconds. Preparation already includes 120 seconds boarding and 300 seconds takeover when changing bus. Zero means those activities fit exactly; negative means overlap. Initial location mismatches: {bus['initial_location_mismatches'] + crew['initial_location_mismatches']}. Consecutive task location changes: {bus['location_changes'] + crew['location_changes']}. Empty lists mean no positioning movement is needed.",
        "NW-PC04": f"The longest crew duty, including all retained earlier and later tasks, spans {crew['longest_duty_minutes']} minutes. Crew {tightest['crew']} has a duty of {tightest['duty_minutes']} minutes and its own maximum is {tightest['maximum_minutes']} minutes. This crew has the smallest remaining margin against its individual limit. The longest overlap between any crew task and its protected break is {crew['maximum_break_overlap_seconds']} seconds. A positive overlap means part of the break is occupied by work; zero means breaks are free.",
        "NW-PC05": f"The decision time is {packet['decision_at']}. SQLite queries restrict timetable versions, crew profiles, readiness and updates to records issued at or before that time. Times used in this proposal are published planning inputs. No retrospective running observations or actual outcomes are used.",
        "NW-PC06": "Only bus and crew assignments are proposed. No passenger replay, merging of cohorts or directions, transfer calculation or rail-wait estimate is proposed.",
        "NW-PC07": "Only bus and crew assignments are proposed. No passenger replay or boarding/alighting demand model is proposed.",
    }
    if policy["id"] in facts:
        return {
            "proposed_operation": "Bus and crew assignment recovery",
            "facts": facts[policy["id"]],
        }
    return {
        "proposed_operation": "Bus and crew assignment recovery",
        "capacity_facts": f"The minimum assigned capacity across affected trips is {cap['minimum_assigned_people']} people and {cap['minimum_assigned_wheelchairs']} wheelchair spaces.",
        "evidence": view,
    }


def assess_policies(packet, directory, cache=None):
    import hashlib
    import json
    from provider import decide

    cache = {} if cache is None else cache
    answers = []
    for policy in packet["operating_requirements"]:
        evidence = policy_evidence(packet, policy)
        units = (
            evidence
            if isinstance(evidence, list)
            else [{"unit": "plan", "scope": "complete plan", "facts": evidence}]
        )
        for unit in units:
            data = {"scope": unit["scope"], "facts": unit["facts"]}
            detail = {
                "NW-PC02": "Assess only this resource. An assigned bus must be released; a held bus or sick crew cannot operate. Every assigned service must match its crew qualification. Preserve original allocated capacity. Tasks before or after availability violate availability.",
                "NW-PC04": "Each crew individual listed maximum also applies. A positive overlap with a protected break is a violation.",
            }.get(policy["id"], "")
            questions = [
                {
                    "name": policy["id"],
                    "type": "choice",
                    "instructions": "Assess this requirement alone: "
                    + policy["requirement"]
                    + " "
                    + detail
                    + " Choose eligible if this requirement is satisfied or does not apply to the proposed operation. Choose blocked for a definite violation. Choose unresolved only if evidence needed for this requirement is missing.",
                    "choices": [
                        {
                            "value": "eligible",
                            "description": "Complies with this requirement.",
                        },
                        {
                            "value": "blocked",
                            "description": "Violates this requirement.",
                        },
                        {
                            "value": "unresolved",
                            "description": "A necessary fact for this requirement is missing.",
                        },
                    ],
                }
            ]
            signature = hashlib.sha256(
                json.dumps([data, questions], sort_keys=True).encode()
            ).hexdigest()
            destination = directory / policy["id"] / unit["unit"]
            if signature in cache:
                answer, source = cache[signature]
                destination.mkdir(parents=True, exist_ok=True)
                (destination / "cached.json").write_text(
                    json.dumps(
                        {
                            "requestHash": signature,
                            "source": str(source.relative_to(directory.parent)),
                            "answer": answer,
                        },
                        indent=2,
                    )
                )
            else:
                answer = decide(data, questions, destination)[0]
                cache[signature] = answer, destination
            answers.append({**answer, "unit": unit["unit"]})
    statuses = {a["choice"] for a in answers}
    return (
        "blocked"
        if "blocked" in statuses
        else "unresolved" if "unresolved" in statuses else "eligible"
    ), answers
