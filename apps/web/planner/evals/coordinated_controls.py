"""Adversarial controls for the compact eligibility projection."""

import argparse
import copy
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from coordinated import coordinated_case, generate_coordinated, assess_policies
from core import payload, make_plan
from input_facts import plan_facts
from packet import candidate_packet
from coordinated_oracle import evaluate


def controls():
    case = coordinated_case("toa_bus")
    evidence, _ = generate_coordinated(case, limit=1)
    plan = evidence["evidence"]["candidate_plans"][0]
    yield "valid", case, plan, "eligible"
    for name in [
        "held_bus",
        "capacity",
        "qualification",
        "overlap",
        "break",
        "duty",
        "wheelchair_policy",
    ]:
        c, p = copy.deepcopy(case), copy.deepcopy(plan)
        first = p["assignments"][0]
        if name == "held_bus":
            first["bus"] = c["event"]["unavailable_bus"]
        elif name == "capacity":
            # Preserve the independent original-allocation baseline by using a donor bus.
            first["bus"] = "NW-V172"
            c["snapshot"]["buses"]["NW-V172"]["capacity"] = 1
        elif name == "qualification":
            c["snapshot"]["crews"][first["crew"]]["qualification"] = "UNQUALIFIED"
        elif name == "overlap":
            for a in p["assignments"]:
                a["bus"] = first["bus"]
        elif name == "break":
            profile = c["snapshot"]["crews"][first["crew"]]
            profile["break_start"] = first["departure_at"]
            profile["break_end"] = first["arrival_at"]
        elif name == "duty":
            for a in p["assignments"]:
                c["snapshot"]["crews"][a["crew"]]["max_duty_minutes"] = 1
        else:
            c["snapshot"]["policies"].append(
                {
                    "id": "SCENARIO-OPERATOR",
                    "scope": "every affected trip",
                    "requirement": "Every affected trip must provide at least two wheelchair spaces.",
                }
            )
        p = make_plan(c, p["assignments"], p["id"])
        p.update(crew_changes=plan["crew_changes"], bus_changes=plan["bus_changes"])
        yield name, c, p, "blocked"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=False)
    results = []
    for name, case, plan, expected in controls():
        if name not in ["valid", "wheelchair_policy"]:
            assert evaluate(case, plan)["status"] == "invalid", name
        evidence = payload(case, [plan])
        evidence["derived_schedule_facts"] = [plan_facts(case, plan)]
        packet = candidate_packet({"evidence": evidence}, plan)
        status, answers = assess_policies(packet, args.output / name)
        answer = ", ".join(
            a["name"] + "=" + a["choice"] for a in answers if a["choice"] != "eligible"
        )
        results.append(
            {"name": name, "expected": expected, "actual": status, "reason": answer}
        )
        print(results[-1], flush=True)
    (args.output / "summary.json").write_text(json.dumps(results, indent=2))
    if any(r["actual"] != r["expected"] for r in results):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
