"""Project actual dependencies and arithmetic, without evaluator labels."""

import copy
from core import seconds, at


def candidate_packet(case, plan):
    source = case["evidence"]
    facts = copy.deepcopy(
        next(f for f in source["derived_schedule_facts"] if f["plan_id"] == plan["id"])
    )
    original = [
        t
        for t in source["protected_timetable"]
        if t["id"] in source["scenario"]["affected_trip_ids"]
    ]
    buses = {
        row["bus"]
        for t in facts["resource_timelines"]
        for row in t["effective_tasks_in_time_order"]
    } | {t["bus"] for t in original}
    crews = {
        row["crew"]
        for t in facts["resource_timelines"]
        for row in t["effective_tasks_in_time_order"]
    } | {t["crew"] for t in original}
    profiles = {r["id"]: r for r in source["buses"]}
    base = {t["id"]: t for t in original}
    capacities = [
        {
            "trip": a["trip_id"],
            "original_bus": base[a["trip_id"]]["bus"],
            "assigned_bus": a["bus"],
            "original_people": profiles[base[a["trip_id"]]["bus"]]["capacity"],
            "assigned_people": profiles[a["bus"]]["capacity"],
            "original_wheelchairs": profiles[base[a["trip_id"]]["bus"]][
                "wheelchair_spaces"
            ],
            "assigned_wheelchairs": profiles[a["bus"]]["wheelchair_spaces"],
        }
        for a in plan["assignments"]
    ]
    for timeline in facts["resource_timelines"]:
        tasks = timeline["effective_tasks_in_time_order"]
        profile = timeline["resource"]
        previous = None
        for t in tasks:
            end = at(t["scheduled_arrival"], 45)
            t["final_alighting_at"] = end
            t["available_until_minus_final_alighting_seconds"] = seconds(
                profile["available_until"]
            ) - seconds(end)
            if previous:
                t["previous_trip"] = previous["trip"]
                t["previous_destination"] = previous["destination"]
                t["departure_minus_previous_final_alighting_seconds"] = seconds(
                    t["scheduled_departure"]
                ) - seconds(previous["final_alighting_at"])
                if t["preparation_at"]:
                    t["preparation_minus_previous_final_alighting_seconds"] = seconds(
                        t["preparation_at"]
                    ) - seconds(previous["final_alighting_at"])
            previous = t
        if (
            timeline["kind"] == "crew"
            and tasks
            and all(t["preparation_at"] for t in tasks)
        ):
            first = min(t["preparation_at"] for t in tasks)
            last = max(t["final_alighting_at"] for t in tasks)
            timeline["own_duty"] = {
                "first_preparation_at": first,
                "last_alighting_at": last,
                "span_seconds": seconds(last) - seconds(first),
            }
    event = source["scenario"]["event"]

    def effective_profile(profile):
        result = copy.deepcopy(profile)
        if profile["id"] == event["unavailable_bus"]:
            result["source_release_before_incident"] = result["release"]
            result["release"] = "held by current incident for remainder of day"
        if profile["id"] == event["unavailable_crew"]:
            result["operational_status"] = "sick and unavailable for remainder of day"
        return result

    for timeline in facts["resource_timelines"]:
        timeline["resource"] = effective_profile(timeline["resource"])
    measurements = []
    for timeline in facts["resource_timelines"]:
        tasks = timeline["effective_tasks_in_time_order"]
        profile = timeline["resource"]
        gaps = [
            t["departure_minus_previous_final_alighting_seconds"]
            for t in tasks
            if "departure_minus_previous_final_alighting_seconds" in t
        ]
        preps = [
            t["preparation_minus_available_from_seconds"]
            for t in tasks
            if "preparation_minus_available_from_seconds" in t
        ]
        item = {
            "resource_id": profile["id"],
            "kind": timeline["kind"],
            "assigned_services": sorted({t["service"] for t in tasks}),
            "task_count": len(tasks),
            "initial_location": profile["location"],
            "first_task_origin": tasks[0]["origin"] if tasks else None,
            "location_transitions": [
                {"from": a["destination"], "to": b["origin"]}
                for a, b in zip(tasks, tasks[1:])
            ],
            "minimum_seconds_from_previous_alighting_to_next_departure": (
                min(gaps) if gaps else None
            ),
            "minimum_seconds_from_availability_start_to_preparation": (
                min(preps) if preps else None
            ),
            "minimum_seconds_from_final_alighting_to_availability_end": min(
                (t["available_until_minus_final_alighting_seconds"] for t in tasks),
                default=None,
            ),
            "simultaneous_trip_pairs": [
                {
                    "first": a["trip"],
                    "second": b["trip"],
                    "overlap_seconds": min(
                        seconds(a["final_alighting_at"]),
                        seconds(b["final_alighting_at"]),
                    )
                    - max(
                        seconds(a["scheduled_departure"]),
                        seconds(b["scheduled_departure"]),
                    ),
                }
                for i, a in enumerate(tasks)
                for b in tasks[i + 1 :]
                if max(
                    seconds(a["scheduled_departure"]), seconds(b["scheduled_departure"])
                )
                < min(
                    seconds(a["final_alighting_at"]), seconds(b["final_alighting_at"])
                )
            ],
        }
        if timeline["kind"] == "crew":
            item["qualified_service"] = profile["qualification"]
            item["own_duty"] = timeline.get("own_duty")
        else:
            item["release"] = profile["release"]
        measurements.append(item)
    routes = {a["route"] for a in plan["assignments"]}
    return {
        "scenario_policy_additions": [
            r
            for r in source["operating_requirements"]
            if r["id"].startswith("SCENARIO-")
        ],
        "assignment_scope": {
            "changed_trip_count": plan["resource_changes"],
            "assigned_offered_resource": [
                a["trip_id"]
                for a in plan["assignments"]
                if event["offered_resource"]
                and event["offered_resource"] in [a["bus"], a["crew"]]
            ],
            "meaning": "An offered resource not assigned here stays outside this plan. Its pending checks do not alter qualifications or release of existing assigned resources.",
        },
        "resource_measurements": measurements,
        "scenario": source["scenario"],
        "decision_at": source["decision_at"],
        "decision_stage": "dispatch_recovery",
        "operating_requirements": source["operating_requirements"],
        "action_contract": source["action_contract"],
        "proposal": plan,
        "effective_resource_schedules": facts,
        "capacity_comparisons": capacities,
        "counterpart_profiles": {
            "buses": [
                effective_profile(r) for r in source["buses"] if r["id"] in buses
            ],
            "crews": [
                effective_profile(r) for r in source["crews"] if r["id"] in crews
            ],
        },
        "original_affected_assignments": original,
        "ordered_route_stops": [
            r for r in source["ordered_route_stops"] if r["route"] in routes
        ],
        "planning_movements": [
            m
            for m in source.get("planning_movements", [])
            if m["vehicle_id"] in buses or m["crew_id"] in crews
        ],
        "resource_updates": [
            r
            for r in source["resource_updates"]
            if set(r["resource_id"].split("|")) & (buses | crews)
        ],
        "evidence_semantics": {
            "scheduled_times": "Published planning inputs, not future observations. The source timetable was issued before the decision time.",
            "numeric_gaps": "Exact timestamp subtraction in seconds. No eligibility verdicts or policy thresholds are included.",
            "original_assignments": "Baseline for capacity and override comparison only. Replaced resources do not also perform the replaced trips.",
            "crew_scope": "A crew member performs only the trips naming that crew. Other crews later using the same bus have separate duties.",
            "same_stop_turnaround": "Boarding is inside stationary turnaround under NW-PC03. The time from previous final alighting to next departure is the entire available turnaround interval.",
        },
        "projection_contract": "Every listed override is applied. Full effective schedules of each directly assigned bus and crew are supplied. Original and counterpart profiles are supplied. Untouched assignments retain their original time, route, bus and crew. Do not apply another alternative plan at the same time.",
    }
