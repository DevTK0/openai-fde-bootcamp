"""Independent schedule oracle retained from the original evaluation prototype.

Used only by trials and tests, never candidate construction or model prompts.
"""

from core import materialize, seconds


def evaluate(case, plan, partial=False):
    snap = case["snapshot"]
    violations = []
    unknown = []

    def fail(code, detail):
        violations.append({"code": code, "detail": detail})

    assignment_ids = [a["trip_id"] for a in plan["assignments"]]
    if len(set(assignment_ids)) != len(assignment_ids):
        fail("duplicate_assignment", "A trip has multiple assignment overrides.")
    missing = set(case["affected_trip_ids"]) - set(assignment_ids)
    if missing and not partial:
        fail(
            "uncovered_trip",
            "Missing explicit assignments for " + ", ".join(sorted(missing)),
        )
    if set(assignment_ids) - set(case["affected_trip_ids"]):
        fail(
            "unauthorized_displacement",
            "A protected non-target trip was changed without an explicitly covered expanded incident scope.",
        )
    if case["id"] == "faulty_service":
        unknown.append(
            "Rescue movement, transfer duration, and passenger load are unknown; the listed timeline cannot establish a complete in-service rescue."
        )
    base = {t["id"]: t for t in snap["trips"]}
    effective = materialize(case, plan)
    relevant_ids = set(assignment_ids) if partial else set(case["affected_trip_ids"])
    touched_buses = {t["bus"] for t in effective if t["id"] in relevant_ids}
    touched_crews = {t["crew"] for t in effective if t["id"] in relevant_ids}
    for t in effective:
        if t["id"] not in relevant_ids:
            continue
        b = snap["buses"].get(t["bus"])
        c = snap["crews"].get(t["crew"])
        if b is None or c is None:
            fail("unlisted_resource", f'{t["id"]} uses an unlisted resource.')
            continue
        if t["bus"] == case["event"]["unavailable_bus"]:
            fail("held_bus", f'{t["id"]} still uses held bus {t["bus"]}.')
        if t["crew"] == case["event"]["unavailable_crew"]:
            fail("sick_crew", f'{t["id"]} still uses sick crew {t["crew"]}.')
        if b["release"] != "released":
            fail("no_release", f'{t["bus"]} has no confirmed release.')
        if t["bus"].startswith("OFFERED") or t["crew"].startswith("OFFERED"):
            fail(
                "unlisted_resource",
                f'{t["id"]} uses a pending, unregistered offered resource.',
            )
        if c["qualification"] != t["service"]:
            fail(
                "qualification",
                f'{t["crew"]} lacks confirmed qualification for service {t["service"]}.',
            )
        required = snap["buses"][base[t["id"]]["bus"]]
        if (
            b["capacity"] < required["capacity"]
            or b["wheelchair_spaces"] < required["wheelchair_spaces"]
        ):
            fail(
                "capacity",
                f'{t["bus"]} reduces the original allocation capacity on {t["id"]}.',
            )
    for kind, ids, resources in [
        ("bus", touched_buses, snap["buses"]),
        ("crew", touched_crews, snap["crews"]),
    ]:
        for rid in sorted(ids):
            resource = resources.get(rid)
            if resource is None:
                continue
            schedule = sorted(
                [
                    t
                    for t in effective
                    if t[kind] == rid
                    and not (
                        case["id"] == "faulty_service"
                        and t["id"] == case["affected_trip_ids"][0]
                    )
                ],
                key=lambda t: t["start"],
            )
            previous = None
            first_task = None
            last_end = None
            for t in schedule:
                start = seconds(t["start"])
                end = seconds(t["end"]) + 45
                original = base[t["id"]]
                changed = (t["bus"], t["crew"]) != (original["bus"], original["crew"])
                takeover = (
                    300 if (previous["bus"] != t["bus"] if previous else changed) else 0
                )
                prep = start - 120 - (takeover if kind == "crew" else 0)
                if previous is None and kind == "bus" and changed:
                    prep = start - 420
                if (
                    t["id"] in relevant_ids
                    and not (
                        case["id"] == "faulty_service"
                        and t["id"] == case["affected_trip_ids"][0]
                    )
                    and prep < seconds(snap["decision_at"])
                ):
                    fail(
                        "past_task",
                        f'{rid} preparation for {t["id"]} would start before the decision.',
                    )
                if prep < seconds(resource["available_from"]) or end > seconds(
                    resource["available_until"]
                ):
                    if t["id"] in relevant_ids:
                        fail(
                            "availability",
                            f'{rid} cannot cover preparation through final alighting for {t["id"]}.',
                        )
                if previous:
                    gap = start - seconds(previous["end"])
                    if start < seconds(previous["end"]) + 45:
                        fail(
                            "overlap",
                            f'{rid} has overlapping {previous["id"]} and {t["id"]}.',
                        )
                    if kind == "bus" and gap < 465:
                        fail(
                            "turnaround",
                            f'{rid}: {previous["id"]} to {t["id"]} has {gap}s; needs 465s.',
                        )
                    if kind == "crew" and prep < seconds(previous["end"]) + 45:
                        fail(
                            "takeover",
                            f'{rid} cannot finish {previous["id"]} and prepare {t["id"]}.',
                        )
                    if previous["destination"] != t["origin"]:
                        movement = next(
                            (
                                m
                                for m in snap.get("planning_movements", [])
                                if m["from_trip_id"] == previous["id"]
                                and m["to_trip_id"] == t["id"]
                            ),
                            None,
                        )
                        if movement is None:
                            unknown.append(
                                f'{rid} has no supplied movement timing from {previous["destination"]} to {t["origin"]} between {previous["id"]} and {t["id"]}.'
                            )
                        elif gap < 45 + 420 + movement["planning_seconds"] + 120:
                            fail(
                                "positioning",
                                f'{rid} has {gap}s gap; supplied positioning takes {movement["planning_seconds"]}s in addition to alighting, turnaround and boarding.',
                            )
                elif resource["location"] != t["origin"]:
                    unknown.append(
                        f'{rid} has no supplied initial positioning time from {resource["location"]} to {t["origin"]}.'
                    )
                if kind == "crew":
                    if prep < seconds(resource["break_end"]) and end > seconds(
                        resource["break_start"]
                    ):
                        fail(
                            "protected_break",
                            f'{rid} task {t["id"]} overlaps its protected break.',
                        )
                    first_task = prep if first_task is None else min(first_task, prep)
                    last_end = end if last_end is None else max(last_end, end)
                previous = t
            if (
                kind == "crew"
                and schedule
                and last_end - first_task > resource["max_duty_minutes"] * 60
            ):
                fail(
                    "duty_span",
                    f'{rid} duty spans {last_end-first_task}s, above {resource["max_duty_minutes"]*60}s.',
                )
    seen = set()
    violations = [
        v
        for v in violations
        if (v["code"], v["detail"]) not in seen
        and not seen.add((v["code"], v["detail"]))
    ]
    return {
        "status": "invalid" if violations else "unresolved" if unknown else "feasible",
        "violations": violations,
        "unknown": list(dict.fromkeys(unknown)),
    }
