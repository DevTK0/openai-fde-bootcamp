import tempfile
import unittest
from pathlib import Path
from availability import unavailable_reasons
from candidates import build_case, generate
from cli import catalog
from engine import assess_network, tournament
from input_facts import retained_preparation
from packet import candidate_packet


class PlannerTests(unittest.TestCase):
    def test_catalog_covers_source(self):
        data = catalog()
        self.assertEqual(
            data["coverage"],
            dict(
                tables=27,
                rows=308628,
                trips=6900,
                vehicles=172,
                crewRecords=3272,
                handoutDatasets=40,
            ),
        )
        self.assertEqual(len(data["dates"]), 10)
        self.assertEqual(len(data["routes"]), 36)

    def test_full_catalog_relief_preserves_commitments(self):
        case, search = generate(
            build_case(dict(scenario="sick_crew", date="2026-10-07", route="B235_1"))
        )
        self.assertGreater(search["resourcesConsidered"]["crews"], 300)
        packets = [
            candidate_packet(case, p) for p in case["evidence"]["candidate_plans"]
        ]
        admitted = [p for p in packets if not unavailable_reasons(p)]
        self.assertEqual(len(admitted), 1)
        self.assertEqual(
            {a["crew"] for a in admitted[0]["proposal"]["assignments"]}, {"NW-C900"}
        )
        self.assertEqual(len(admitted[0]["proposal"]["assignments"]), 5)
        timelines = admitted[0]["effective_resource_schedules"]["resource_timelines"]
        bus = next(t for t in timelines if t["kind"] == "bus")
        self.assertTrue(
            any(
                t["crew"] == "NW-C002"
                and t["assignment_source"] == "retained commitment"
                for t in bus["effective_tasks_in_time_order"]
            )
        )
        with tempfile.TemporaryDirectory() as directory:
            calls = []

            def eligible(packet, instructions, choices, path):
                calls.append(packet)
                return "eligible"

            result = assess_network(
                case, Path(directory), lambda *_: None, chooser=eligible
            )
        self.assertEqual(len(calls), 1)
        self.assertEqual(len(result["recommended"]), 1)
        self.assertEqual(result["rounds"], [])

    def test_singleton_and_cluster_comparisons(self):
        def compare(ids, _):
            self.assertGreaterEqual(len(ids), 2)
            self.assertEqual(len(ids), len(set(ids)))
            return min(ids)

        self.assertEqual(tournament(["only"], compare, lambda *_: None), (["only"], []))
        selected, rounds = tournament(list(range(20)), compare, lambda *_: None)
        self.assertLessEqual(len(selected), 5)
        self.assertEqual(selected[0], 0)
        self.assertTrue(any(r["phase"] == "Round 2" for r in rounds))

    def test_retained_task_needs_takeover_after_changed_bus(self):
        previous = dict(
            crew="driver", bus="replacement", start="2026-10-07T10:00:00+08:00"
        )
        retained = dict(
            crew="driver", bus="original", start="2026-10-07T11:00:00+08:00"
        )
        self.assertEqual(
            retained_preparation([previous, retained], retained),
            "2026-10-07T10:53:00+08:00",
        )

    def test_unknown_rescue_time_is_not_a_definite_overlap(self):
        packet = {
            "scenario": {
                "event": {"unavailable_bus": "held", "unavailable_crew": None}
            },
            "proposal": {"assignments": []},
            "capacity_comparisons": [],
            "effective_resource_schedules": {
                "resource_timelines": [
                    {
                        "kind": "bus",
                        "resource": {"id": "rescue", "release": "released"},
                        "effective_tasks_in_time_order": [{"preparation_at": None}],
                    }
                ]
            },
        }
        self.assertEqual(unavailable_reasons(packet), [])

    def test_pending_and_duplicate_resources(self):
        request = dict(
            scenario="new_bus",
            date="2026-10-05",
            route="B235_1",
            resources=[
                dict(
                    id="TEST-SPARE",
                    kind="bus",
                    confirmed=False,
                    capacity=120,
                    wheelchairSpaces=2,
                    availableFrom="04:00",
                    availableUntil="23:59",
                )
            ],
        )
        case, _ = generate(build_case(request))
        proposals = [
            candidate_packet(case, p)
            for p in case["evidence"]["candidate_plans"]
            if any(a["bus"] == "TEST-SPARE" for a in p["assignments"])
        ]
        self.assertTrue(proposals)
        self.assertTrue(
            all(
                any(r["fact"] == "registration pending" for r in unavailable_reasons(p))
                for p in proposals
            )
        )
        request["resources"][0]["id"] = "NW-V001"
        with self.assertRaisesRegex(ValueError, "unique identifier"):
            build_case(request)


if __name__ == "__main__":
    unittest.main()
