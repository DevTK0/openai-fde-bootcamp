"""Source-derived arithmetic, without eligibility labels or policy thresholds."""

from core import materialize, seconds, at


def plan_facts(case, plan):
    snap = case["snapshot"]
    rows = materialize(case, plan)
    actions = {a["trip_id"]: a for a in plan["assignments"]}
    result = {"plan_id": plan["id"], "resource_timelines": [], "rescue": plan["rescue"]}
    for kind, profiles in [("bus", snap["buses"]), ("crew", snap["crews"])]:
        for rid in sorted({a[kind] for a in plan["assignments"]}):
            profile = profiles[rid]
            tasks = sorted(
                [t for t in rows if t[kind] == rid], key=lambda t: (t["start"], t["id"])
            )
            timeline = []
            previous = None
            for t in tasks:
                action = actions.get(t["id"])
                task_start = (
                    (action.get("takeover_at") or action.get("boarding_at"))
                    if action
                    else retained_preparation(rows, t)
                )
                item = {
                    "trip": t["id"],
                    "bus": t["bus"],
                    "crew": t["crew"],
                    "service": t["service"],
                    "origin": t["origin"],
                    "destination": t["destination"],
                    "preparation_at": task_start,
                    "scheduled_departure": t["start"],
                    "scheduled_arrival": t["end"],
                    "assignment_source": (
                        "candidate override" if action else "retained commitment"
                    ),
                }
                if task_start:
                    item["preparation_minus_available_from_seconds"] = seconds(
                        task_start
                    ) - seconds(profile["available_from"])
                if previous:
                    item["departure_minus_previous_arrival_seconds"] = seconds(
                        t["start"]
                    ) - seconds(previous["end"])
                timeline.append(item)
                previous = t
            result["resource_timelines"].append(
                {
                    "kind": kind,
                    "resource": profile,
                    "effective_tasks_in_time_order": timeline,
                }
            )
    return result


def retained_preparation(rows, task):
    earlier = [
        r for r in rows if r["crew"] == task["crew"] and r["start"] < task["start"]
    ]
    previous = max(earlier, key=lambda r: r["start"]) if earlier else None
    return at(
        task["start"], -420 if previous and previous["bus"] != task["bus"] else -120
    )
