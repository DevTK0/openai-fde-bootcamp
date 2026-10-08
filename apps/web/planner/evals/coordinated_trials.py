"""Run or recheck live coordinated trials without sending gold labels to models."""

import argparse
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from coordinated import PRESETS, coordinated_case, generate_coordinated
from coordinated_oracle import evaluate
from engine import assess_network


def verify(case, evidence, result):
    plans = {p["id"]: p for p in evidence["evidence"]["candidate_plans"]}
    gold = {i: evaluate(case, p) for i, p in plans.items()}
    errors = [f"{i}: {r}" for i, r in gold.items() if r["status"] != "feasible"]
    errors += [
        f"{a['id']}: {a['status']} expected eligible"
        for a in result["assessments"]
        if a["status"] != "eligible"
    ]
    base = {t["id"]: t for t in case["snapshot"]["trips"]}

    def score(ident):
        actions = plans[ident]["assignments"]
        return (
            sum(a["crew"] != base[a["trip_id"]]["crew"] for a in actions),
            sum(a["bus"] != base[a["trip_id"]]["bus"] for a in actions),
        )

    for rd in result["rounds"]:
        if len(set(rd["inputIds"])) < 2 or score(rd["selectedId"]) != min(
            map(score, rd["inputIds"])
        ):
            errors.append(f"Incorrect comparison: {rd}")
    entrants = {a["id"] for a in result["assessments"] if a["status"] == "eligible"}
    compared = {i for r in result["rounds"] for i in r["inputIds"]}
    if len(entrants) < 30 or entrants - compared:
        errors.append("Fewer than 30 actual compared entrants")
    if not result["recommended"] or score(result["recommended"][0]) != min(
        map(score, plans)
    ):
        errors.append("Best generated score missing from first recommendation")
    return {
        "generated": len(plans),
        "entrants": len(entrants),
        "comparisons": len(result["rounds"]),
        "recommendations": result["recommended"],
        "bestScore": min(map(score, plans)),
        "errors": errors,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--live", action="store_true")
    parser.add_argument("--seed", type=int, default=43)
    args = parser.parse_args()
    if args.live:
        args.output.mkdir(parents=True, exist_ok=False)
    summary = {}
    for key in PRESETS:
        directory = args.output / key
        case = coordinated_case(key)
        if args.live:
            directory.mkdir()
            evidence, search = generate_coordinated(case)
            (directory / "evidence.json").write_text(json.dumps(evidence))
            started = time.monotonic()
            result = assess_network(
                evidence,
                directory,
                lambda p, m: print(key, p, m, flush=True),
                seed=args.seed,
            )
            result.pop("packets")
            result["seed"] = args.seed
            result["elapsedSeconds"] = time.monotonic() - started
            (directory / "result.json").write_text(json.dumps(result, indent=2))
        else:
            evidence = json.loads((directory / "evidence.json").read_text())
            result = json.loads((directory / "result.json").read_text())
        summary[key] = verify(case, evidence, result)
        print(key, json.dumps(summary[key]), flush=True)
    (args.output / "summary.json").write_text(json.dumps(summary, indent=2))
    if any(r["errors"] for r in summary.values()):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
