"""Replay frozen Decisions traces or evaluate the same corpus with live Decisions."""

import argparse
import gzip
import hashlib
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from engine import assess_network, choose
from provider import decide
from astra import choose as astra_choose, answer as astra_answer


def digest(value):
    return hashlib.sha256(
        json.dumps(value, sort_keys=True, separators=(",", ":")).encode()
    ).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--live",
        action="store_true",
        help="Make paid Decisions API calls instead of replaying saved answers.",
    )
    parser.add_argument(
        "--astra",
        action="store_true",
        help="Benchmark Astra after a successful Decisions run.",
    )
    parser.add_argument(
        "--decisions-gate",
        type=Path,
        help="Path to a completed live Decisions summary.",
    )
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Limit network workflows for a smoke run. Zero runs all.",
    )
    args = parser.parse_args()
    if args.astra:
        if not args.decisions_gate:
            parser.error("--astra requires --decisions-gate")
        gate = json.loads(args.decisions_gate.read_text())
        if (
            gate.get("mode") != "live"
            or gate.get("workflows") != 936
            or gate.get("errors") != []
            or gate.get("handout_assessments") != 24
        ):
            parser.error(
                "The Decisions gate must be a complete live run with zero errors."
            )
    args.output.mkdir(parents=True, exist_ok=False)
    root = Path(__file__).resolve().parent
    errors = []
    counts = dict(
        workflows=0,
        eligibility_assessments=0,
        physical_exclusions=0,
        comparison_calls=0,
        handout_assessments=0,
    )
    with gzip.open(root / "corpus.jsonl.gz", "rt") as stream:
        for line in stream:
            item = json.loads(line)
            case = item["case"]
            directory = args.output / str(counts["workflows"])

            def replay(packet, instructions, choices, path):
                request = dict(
                    model="gpt-6-luna",
                    input=json.dumps(packet, separators=(",", ":")),
                    questions=[
                        dict(
                            name="selection",
                            type="choice",
                            instructions=instructions,
                            choices=choices,
                        )
                    ],
                )
                saved = item["calls"][str(path.relative_to(directory))]
                if digest(request) != saved["requestSha256"]:
                    raise ValueError(
                        "Replay input differs from the saved provider request: "
                        + str(path)
                    )
                return saved["answers"][0]["choice"]

            result = assess_network(
                case,
                directory,
                lambda *_: None,
                item["seed"],
                astra_choose if args.astra else choose if args.live else replay,
            )
            gold = case["gold"]
            expected = {
                "feasible": "eligible",
                "invalid": "blocked",
                "unresolved": "unresolved",
            }
            for assessment in result["assessments"]:
                if assessment["status"] != expected[gold[assessment["id"]]["status"]]:
                    errors.append(
                        dict(case=case["id"], type="eligibility", assessment=assessment)
                    )
            for excluded in result["excluded"]:
                if gold[excluded["id"]]["status"] != "invalid":
                    errors.append(
                        dict(
                            case=case["id"],
                            type="false_physical_exclusion",
                            id=excluded["id"],
                        )
                    )
            for ident in result["recommended"] + [
                r["selectedId"] for r in result["rounds"]
            ]:
                if gold[ident]["status"] != "feasible":
                    errors.append(
                        dict(case=case["id"], type="invalid_recommendation", id=ident)
                    )
            if case.get("best_ids") and (
                not result["recommended"]
                or result["recommended"][0] not in case["best_ids"]
            ):
                errors.append(dict(case=case["id"], type="wrong_first_recommendation"))
            if (
                any(g["status"] == "feasible" for g in gold.values())
                and not result["recommended"]
            ):
                errors.append(dict(case=case["id"], type="missed_all_supported_plans"))
            counts["workflows"] += 1
            counts["eligibility_assessments"] += len(result["assessments"])
            counts["physical_exclusions"] += len(result["excluded"])
            counts["comparison_calls"] += len(result["rounds"])
            if counts["workflows"] % 100 == 0:
                print(json.dumps({**counts, "errors": len(errors)}), flush=True)
            if args.limit and counts["workflows"] >= args.limit:
                break
    for item in json.loads(gzip.decompress((root / "handouts.json.gz").read_bytes())):
        request = item["request"]
        answers = (
            (astra_answer if args.astra else decide)(
                json.loads(request["input"]),
                request["questions"],
                args.output / "handouts" / item["case"],
            )
            if args.live or args.astra
            else item["response"]["answers"]
        )
        for answer in answers:
            counts["handout_assessments"] += 1
            if answer.get("choice") != item["expected"][answer["name"]]:
                errors.append(dict(case=item["case"], type="handout", answer=answer))
    report = dict(
        mode="astra" if args.astra else "live" if args.live else "replay",
        **counts,
        errors=errors
    )
    (args.output / "summary.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report), flush=True)
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
