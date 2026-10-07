"""Physical candidate construction checks, independent of the evaluation oracle.

These checks run before model calls. They are reported separately, never as model
successes. Written-policy eligibility and preferences remain model decisions.
"""

from core import seconds


def unavailable_reasons(packet):
    reasons = []
    event = packet["scenario"]["event"]
    for a in packet["proposal"]["assignments"]:
        if a["bus"] == event["unavailable_bus"]:
            reasons.append(
                {"resource": a["bus"], "fact": "incident hold", "trip": a["trip_id"]}
            )
        if a["crew"] == event["unavailable_crew"]:
            reasons.append(
                {
                    "resource": a["crew"],
                    "fact": "incident absence",
                    "trip": a["trip_id"],
                }
            )
    for row in packet["capacity_comparisons"]:
        if (
            row["assigned_people"] < row["original_people"]
            or row["assigned_wheelchairs"] < row["original_wheelchairs"]
        ):
            reasons.append(
                {
                    "resource": row["assigned_bus"],
                    "fact": "capacity below requested original allocation",
                    "trip": row["trip"],
                }
            )
    for timeline in packet["effective_resource_schedules"]["resource_timelines"]:
        resource = timeline["resource"]
        rid = resource["id"]
        tasks = [
            t
            for t in timeline["effective_tasks_in_time_order"]
            if t["preparation_at"] is not None
        ]
        if resource.get("registration") == "pending":
            reasons.append({"resource": rid, "fact": "registration pending"})
        if timeline["kind"] == "bus" and resource["release"] != "released":
            reasons.append(
                {
                    "resource": rid,
                    "fact": "no release",
                    "source_value": resource["release"],
                }
            )
        if timeline["kind"] == "crew":
            services = {t["service"] for t in tasks}
            if services - {resource["qualification"]}:
                reasons.append(
                    {
                        "resource": rid,
                        "fact": "qualification does not cover assigned services",
                        "qualification": resource["qualification"],
                        "services": sorted(services),
                    }
                )
        for task in tasks:
            if task["preparation_at"] and seconds(task["preparation_at"]) < seconds(
                resource["available_from"]
            ):
                reasons.append(
                    {
                        "resource": rid,
                        "fact": "preparation precedes availability",
                        "trip": task["trip"],
                    }
                )
            if seconds(task["final_alighting_at"]) > seconds(
                resource["available_until"]
            ):
                reasons.append(
                    {
                        "resource": rid,
                        "fact": "completion exceeds availability",
                        "trip": task["trip"],
                    }
                )
        for i, left in enumerate(tasks):
            for right in tasks[i + 1 :]:
                if max(
                    seconds(left["scheduled_departure"]),
                    seconds(right["scheduled_departure"]),
                ) < min(
                    seconds(left["final_alighting_at"]),
                    seconds(right["final_alighting_at"]),
                ):
                    reasons.append(
                        {
                            "resource": rid,
                            "fact": "simultaneous trips",
                            "trips": [left["trip"], right["trip"]],
                        }
                    )
    return reasons
