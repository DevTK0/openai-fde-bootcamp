"""Replay saved Decisions answers only when current production inputs match."""

import gzip
import json
import sys
import tempfile
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import engine
from coordinated import coordinated_case, generate_coordinated
from coordinated_trials import verify


def signature(packet, questions):
    return json.dumps([packet, questions], sort_keys=True, separators=(",", ":"))


def main():
    archive = Path(__file__).with_name("coordinated-trials.json.gz")
    with gzip.open(archive, "rt") as stream:
        trials = json.load(stream)
    results = []
    for trial in trials:
        case = coordinated_case(trial["scenario"])
        evidence, _ = generate_coordinated(case)
        assert evidence == trial["evidence"], "Generated evidence changed"
        answers = {
            signature(json.loads(c["request"]["input"]), c["request"]["questions"]): c[
                "response"
            ]["answers"]
            for c in trial["calls"]
        }
        count = 0

        def replay(packet, questions, directory):
            nonlocal count
            count += 1
            directory.mkdir(parents=True, exist_ok=True)
            key = signature(packet, questions)
            if key not in answers:
                raise AssertionError(
                    f"Unrecorded model input for {trial['scenario']} at {directory.name}"
                )
            return answers[key]

        with tempfile.TemporaryDirectory() as directory, patch(
            "provider.decide", replay
        ), patch("engine.decide", replay):
            result = engine.assess_network(
                evidence,
                Path(directory),
                lambda *_: None,
                seed=trial["result"].get("seed", 43),
            )
        for field in ["recommended", "rounds", "assessments", "excluded"]:
            assert result[field] == trial["result"][field], field
        assert count == len(trial["calls"])
        report = verify(case, evidence, result)
        assert not report["errors"], report["errors"]
        results.append(
            {
                "trial": trial["trial"],
                "scenario": trial["scenario"],
                "matchedRequests": count,
                **report,
            }
        )
    from coordinated_controls import controls
    from coordinated import assess_policies
    from core import payload
    from input_facts import plan_facts
    from packet import candidate_packet

    with gzip.open(
        Path(__file__).with_name("coordinated-controls.json.gz"), "rt"
    ) as stream:
        control_records = {r["result"]["name"]: r for r in json.load(stream)}
    for name, case, plan, expected in controls():
        record = control_records[name]
        answers = {
            signature(json.loads(c["request"]["input"]), c["request"]["questions"]): c[
                "response"
            ]["answers"]
            for c in record["calls"]
        }
        evidence = payload(case, [plan])
        evidence["derived_schedule_facts"] = [plan_facts(case, plan)]
        packet = candidate_packet({"evidence": evidence}, plan)
        with tempfile.TemporaryDirectory() as directory, patch(
            "provider.decide", replay
        ):
            status, _ = assess_policies(packet, Path(directory))
        assert status == expected, name
    print(
        json.dumps(
            {"trials": results, "controlsPassed": len(control_records)}, indent=2
        )
    )


if __name__ == "__main__":
    main()
