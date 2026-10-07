#!/usr/bin/env python3
"""Build compact stop boarding, queue, and lateness overlays from supplied stop calls."""
import csv
import json
from collections import defaultdict
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "Data/lionlink-operations-network-candidate/data/stop_calls.csv"
OUTPUT = Path(__file__).resolve().with_name("stop-overlay-data.js")


def seconds_late(row):
    scheduled = datetime.fromisoformat(row["scheduled_arrival_at"])
    actual = datetime.fromisoformat(row["actual_arrival_at"])
    return max(0, int((actual - scheduled).total_seconds()))


def main():
    groups = defaultdict(lambda: {"stopId": "", "boardings": 0, "calls": 0, "late60": 0, "loadRatioSum": 0.0, "onboardSum": 0.0, "queueBeforeSum": 0, "queueAfterSum": 0, "maxQueue": 0})
    with SOURCE.open(newline="", encoding="utf-8") as file:
        for row in csv.DictReader(file):
            key = (row["service_date"], row["route_id"], int(row["stop_order"]))
            item = groups[key]
            item["stopId"] = row["stop_id"]
            item["boardings"] += int(row["boarded_people"] or 0)
            item["calls"] += 1
            item["late60"] += seconds_late(row) >= 60
            capacity = float(row["capacity_people"] or 0)
            if capacity:
                item["loadRatioSum"] += float(row["onboard_departing"] or 0) / capacity
            item["onboardSum"] += float(row["onboard_departing"] or 0)
            queue_before = int(row["queue_before_people"] or 0)
            item["queueBeforeSum"] += queue_before
            item["queueAfterSum"] += max(0, queue_before - int(row["boarded_people"] or 0))
            item["maxQueue"] = max(item["maxQueue"], queue_before)

    by_date = {}
    for (day, route, order), values in sorted(groups.items()):
        values["avgLoadRatio"] = round(values.pop("loadRatioSum") / values["calls"], 4) if values["calls"] else 0
        values["avgOnboard"] = round(values.pop("onboardSum") / values["calls"], 1) if values["calls"] else 0
        values["avgQueueBefore"] = round(values.pop("queueBeforeSum") / values["calls"], 1) if values["calls"] else 0
        values["avgQueueAfter"] = round(values.pop("queueAfterSum") / values["calls"], 1) if values["calls"] else 0
        by_date.setdefault(day, {}).setdefault(route, {})[str(order)] = values
    payload = {
        "source": "Data/lionlink-operations-network-candidate/data/stop_calls.csv",
        "latenessThresholdSeconds": 60,
        "grain": "route_id + service_date + stop_order; repeated stop codes remain separate occurrences",
        "byDate": by_date,
    }
    OUTPUT.write_text(
        "window.LIONLINK_STOP_OVERLAY_DATA = "
        + json.dumps(payload, separators=(",", ":"), ensure_ascii=False)
        + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUTPUT} with {len(by_date)} dates, {sum(len(routes) for routes in by_date.values())} route-days")


if __name__ == "__main__":
    main()
