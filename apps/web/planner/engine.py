"""The shared planner. Evaluation expectations never enter this module."""

import copy
import json
import random
from pathlib import Path
from availability import unavailable_reasons
from candidates import build_case, generate
from catalog import Catalog
from coordinated import (
    DEFAULT_OBJECTIVE,
    PRESETS,
    coordinated_case,
    generate_coordinated,
    decision_view,
)
from packet import candidate_packet
from provider import decide

ROOT = Path(__file__).resolve().parent
PROMPTS = json.loads((ROOT / "prompts.json").read_text())
RANK_INSTRUCTIONS = "Rank these previously eligible alternative plans against the objective and written requirements. Choose the best remaining plan. They are alternatives, not simultaneous assignments. Prefer fewer changed assignments when the objective says so. Equal objective values are tied; choose any tied plan."


def choose(packet, instructions, choices, directory):
    return decide(
        packet,
        [
            {
                "name": "selection",
                "type": "choice",
                "instructions": instructions,
                "choices": choices,
            }
        ],
        directory,
    )[0]["choice"]


def tournament(ids, compare, progress, group_size=6, advance=2):
    rounds = []

    def rank(remaining, keep, phase):
        remaining = list(remaining)
        selected = []
        while remaining and len(selected) < keep:
            if len(remaining) == 1:
                selected.append(remaining.pop())
                break
            selected_id = compare(remaining, len(rounds))
            rounds.append(
                {"phase": phase, "inputIds": list(remaining), "selectedId": selected_id}
            )
            selected.append(selected_id)
            remaining.remove(selected_id)
            progress(
                "comparison", f"Compared {len(rounds)} groups; building the shortlist."
            )
        return selected

    survivors = list(ids)
    level = 1
    while len(survivors) > 5:
        survivors = [
            ident
            for start in range(0, len(survivors), group_size)
            for ident in rank(
                survivors[start : start + group_size], advance, f"Round {level}"
            )
        ]
        level += 1
    return rank(survivors, 5, "Final order"), rounds


def compare_network(case, packets, remaining, directory, chooser=choose):
    aliases = {f"choice_{i + 1}": ident for i, ident in enumerate(remaining)}
    fields = [
        "assignment_scope",
        "resource_measurements",
        "proposal",
        "effective_resource_schedules",
        "capacity_comparisons",
        "counterpart_profiles",
        "planning_movements",
        "resource_updates",
    ]
    data = {
        "objective": case["evidence"]["scenario"]["objective"],
        "scenario": case["evidence"]["scenario"],
        "operating_requirements": case["evidence"]["operating_requirements"],
        "plans": {
            alias: {k: v for k, v in packets[ident].items() if k in fields}
            for alias, ident in aliases.items()
        },
    }
    if (
        case["id"] in PRESETS
        and case["evidence"]["scenario"]["objective"] == DEFAULT_OBJECTIVE
    ):
        data["plans"] = {
            alias: {
                "capacity_arithmetic": decision_view(packets[ident])[
                    "capacity_arithmetic"
                ],
                "crew_changes": packets[ident]["proposal"]["crew_changes"],
                "bus_changes": packets[ident]["proposal"]["bus_changes"],
                "allocation_columns": ["trip_id", "route", "bus", "crew"],
                "allocations": [
                    [a[k] for k in ["trip_id", "route", "bus", "crew"]]
                    for a in packets[ident]["proposal"]["assignments"]
                ],
            }
            for alias, ident in aliases.items()
        }
        data["comparison_scope"] = (
            "Every plan has already passed policy eligibility. Apply the requested objective. The crew_changes and bus_changes counts compare the complete proposed allocation to the original roster. Ties are allowed. Full feasibility evidence was assessed separately."
        )
    choices = [
        {
            "value": alias,
            "description": f"Changes {packets[ident]['proposal']['resource_changes']} trip assignments. Minimum allocated wheelchair spaces {min(r['assigned_wheelchairs'] for r in packets[ident]['capacity_comparisons'])}. Minimum allocated passenger capacity {min(r['assigned_people'] for r in packets[ident]['capacity_comparisons'])}. Complete assignments and resource schedules are in plans.{alias}.",
        }
        for alias, ident in aliases.items()
    ]
    if case["id"] in PRESETS:
        choices = [
            {
                "value": alias,
                "description": f"Changed crew assignments: {packets[ident]['proposal']['crew_changes']}. Changed bus assignments: {packets[ident]['proposal']['bus_changes']}.",
            }
            for alias, ident in aliases.items()
        ]
    return aliases[
        chooser(
            data,
            RANK_INSTRUCTIONS
            + (
                " Follow the objective priority order exactly. When it says minimize crew changes then bus changes, compare crew_changes first and use bus_changes only to break a tie. Do not add those counts together."
                if case["id"] in PRESETS
                else ""
            ),
            choices,
            directory,
        )
    ]


def calendars(packet):
    rows = []
    for timeline in packet["effective_resource_schedules"]["resource_timelines"]:
        r = timeline["resource"]
        detail = (
            f"{r['capacity']} people; {r['wheelchair_spaces']} wheelchair spaces; {r['release']}"
            if timeline["kind"] == "bus"
            else f"Qualified for {r['qualification']}; maximum duty {r['max_duty_minutes']} minutes"
        )
        rows.append(
            {
                "kind": timeline["kind"],
                "resourceId": r["id"],
                "availableFrom": r["available_from"],
                "availableUntil": r["available_until"],
                "details": detail,
                "break": (
                    {"start": r["break_start"], "end": r["break_end"]}
                    if timeline["kind"] == "crew"
                    else None
                ),
                "tasks": [
                    {
                        "trip": t["trip"],
                        "bus": t["bus"],
                        "crew": t["crew"],
                        "route": t["service"],
                        "preparation": t["preparation_at"],
                        "alightingUntil": t["final_alighting_at"],
                        "departure": (
                            t["scheduled_departure"] if t["preparation_at"] else None
                        ),
                        "arrival": (
                            t["scheduled_arrival"] if t["preparation_at"] else None
                        ),
                        "origin": t["origin"],
                        "destination": t["destination"],
                    }
                    for t in timeline["effective_tasks_in_time_order"]
                ],
            }
        )
    return rows


def assess_network(case, directory, progress, seed=43, chooser=choose):
    plans = list(case["evidence"]["candidate_plans"])
    random.Random(str(seed) + case["id"]).shuffle(plans)
    packets = {}
    assessments = []
    excluded = []
    policy_cache = {}
    policy_checks = 0
    for index, plan in enumerate(plans):
        packet = candidate_packet(case, plan)
        reasons = unavailable_reasons(packet)
        if reasons:
            excluded.append(
                {
                    "id": plan["id"],
                    "reasons": [
                        {
                            "resourceId": r["resource"],
                            "message": r["fact"],
                            "tripIds": r.get(
                                "trips", [r["trip"]] if "trip" in r else []
                            ),
                        }
                        for r in reasons
                    ],
                }
            )
            continue
        packet = copy.deepcopy(packet)
        packet["proposal"].pop("id")
        packet["effective_resource_schedules"].pop("plan_id")
        progress(
            "eligibility",
            f"Assessing operating requirements for proposal {index + 1} of {len(plans)}.",
        )
        if case["id"] in PRESETS:
            from coordinated import assess_policies

            status, policy_answers = assess_policies(
                packet, directory / "eligibility" / plan["id"], policy_cache
            )
            policy_checks += len(policy_answers)
            assessments.append(
                {
                    "id": plan["id"],
                    "status": status,
                    "reason": ", ".join(
                        a["name"] + ":" + a.get("unit", "plan") + "=" + a["choice"]
                        for a in policy_answers
                        if a["choice"] != "eligible"
                    ),
                }
            )
        else:
            status = chooser(
                packet,
                PROMPTS["eligibility"],
                PROMPTS["eligibilityChoices"],
                directory / "eligibility" / plan["id"],
            )
            assessments.append({"id": plan["id"], "status": status})
        if status == "eligible":
            packets[plan["id"]] = packet
    recommended, rounds = tournament(
        list(packets),
        lambda ids, count: compare_network(
            case, packets, ids, directory / "comparisons" / str(count), chooser
        ),
        progress,
        group_size=3 if case["id"] in PRESETS else 6,
        advance=1 if case["id"] in PRESETS else 2,
    )
    return {
        "recommended": recommended,
        "rounds": rounds,
        "packets": packets,
        "assessments": assessments,
        "excluded": excluded,
        **(
            {
                "policyEvaluation": {
                    "apiCalls": len(policy_cache),
                    "reusedChecks": policy_checks - len(policy_cache),
                }
            }
            if case["id"] in PRESETS
            else {}
        ),
    }


def network(request, directory, progress):
    domain = (
        coordinated_case(request["scenario"])
        if request["kind"] == "coordinated"
        else build_case(request)
    )
    if request["kind"] == "coordinated":
        if request.get("objective", "").strip():
            domain["objective"] = request["objective"].strip()
        if request.get("requirements", "").strip():
            domain["snapshot"]["policies"].append(
                {
                    "id": "SCENARIO-OPERATOR",
                    "scope": "all affected trips",
                    "requirement": request["requirements"].strip(),
                }
            )
    progress(
        "preparation", "Checking the full resource catalog and future commitments."
    )
    case, search = (
        generate_coordinated(domain)
        if request["kind"] == "coordinated"
        else generate(domain)
    )
    (directory / "evidence.json").write_text(json.dumps(case["evidence"], indent=2))
    selection = assess_network(case, directory, progress)
    plans = case["evidence"]["candidate_plans"]
    recommended = selection["recommended"]
    rounds = selection["rounds"]
    packets = selection["packets"]
    assessments = selection["assessments"]
    excluded = selection["excluded"]
    by_id = {p["id"]: p for p in plans}
    recommendations = []
    for ident in recommended:
        plan = by_id[ident]
        recommendations.append(
            {
                "id": ident,
                "status": "eligible",
                "title": (
                    "Keep existing allocations"
                    if plan["resource_changes"] == 0
                    else f"Cover {len(plan['assignments'])} affected trips"
                ),
                "summary": (
                    f"{plan['crew_changes']} crew changes and {plan['bus_changes']} bus changes across {len({a['route'] for a in plan['assignments']})} routes. Earlier and outside-service commitments stay assigned."
                    if domain["id"] in PRESETS
                    else f"{plan['resource_changes']} changed trip assignments. All other supplied commitments stay assigned."
                ),
                "assignments": [
                    {
                        "trip": a["trip_id"],
                        "route": a["route"],
                        "bus": a["bus"],
                        "crew": a["crew"],
                        "departure": a["departure_at"],
                        "arrival": a["arrival_at"],
                    }
                    for a in plan["assignments"]
                ],
                "calendars": calendars(packets[ident]),
            }
        )
    if recommended:
        message = f"{len(recommended)} supported complete plan" + (
            "s." if len(recommended) != 1 else "."
        )
    elif case["evidence"]["scenario"]["event"]["type"] == "faulty_service":
        message = "No complete rescue is supported. Rescue positioning time, passenger load and transfer duration are missing. Keep the held bus out of service and obtain those facts before promising a recovery departure."
    else:
        message = "No complete cover was found in the supplied resources and candidate family. Review the excluded-resource facts, obtain confirmed additional cover or revise the scenario."
    return {
        "title": domain["title"],
        "decisionAt": domain["snapshot"]["decision_at"],
        "message": message,
        "recommendations": recommendations,
        "assessments": assessments,
        **(
            {"policyEvaluation": selection["policyEvaluation"]}
            if "policyEvaluation" in selection
            else {}
        ),
        "physicalExclusions": excluded,
        "rounds": rounds,
        "search": search,
        "policies": case["evidence"]["operating_requirements"],
        "sources": [
            {
                "id": "network",
                "title": "SQLite planned trips, complete resource schedules, readiness, movements and issued updates",
                "rowCount": len(domain["snapshot"]["trips"]),
            }
        ],
        "affectedTrips": [
            {
                "trip": t["id"],
                "route": t["route"],
                "bus": t["bus"],
                "crew": t["crew"],
                "departure": t["start"],
                "arrival": t["end"],
            }
            for t in domain["snapshot"]["trips"]
            if t["id"] in domain["affected_trip_ids"]
        ],
    }


def handout(request, directory, progress):
    template = next(
        (
            c
            for c in json.loads((ROOT / "scenarios.json").read_text())
            if c["id"] == request["scenario"]
        ),
        None,
    )
    if not template:
        raise ValueError("Unknown planning scenario.")
    sources = [h for h in Catalog().handouts() if h["sheet"] in template["sheets"]]
    evidence = {
        "id": template["id"],
        "decision_at": template["decision_at"],
        "objective": request.get("objective", "").strip() or template["objective"],
        "sources": sources,
        "candidates": template["candidates"],
    }
    extra = request.get("requirements", "").strip()
    if extra:
        evidence["scenario_policy_additions"] = [
            {"id": "SCENARIO-OPERATOR", "requirement": extra}
        ]
    (directory / "evidence.json").write_text(json.dumps(evidence, indent=2))
    progress(
        "eligibility",
        "Comparing explicit action alternatives with all relevant imported source records.",
    )
    choices = [
        {"value": status}
        for status in ["eligible", "conditional", "blocked", "unresolved"]
    ]
    questions = [
        {
            "name": p["id"],
            "type": "choice",
            "instructions": PROMPTS["handout"]
            + " Assess "
            + p["id"]
            + " only. Proposal: "
            + p["proposal"],
            "choices": choices,
        }
        for p in template["candidates"]
    ]
    answers = decide(evidence, questions, directory / "eligibility")
    assessments = [{"id": a["name"], "status": a["choice"]} for a in answers]
    allowed = {
        a["id"]: a["status"]
        for a in assessments
        if a["status"] in ["eligible", "conditional"]
    }
    by_id = {p["id"]: p for p in template["candidates"]}

    def compare(ids, count):
        packet = {**evidence, "candidates": [by_id[i] for i in ids]}
        return choose(
            packet,
            "Choose the best supported alternative against the objective. Preserve explicit future release conditions; a conditional allocation is not immediate dispatch authority.",
            [{"value": i, "description": by_id[i]["proposal"]} for i in ids],
            directory / "comparisons" / str(count),
        )

    recommended, rounds = tournament(list(allowed), compare, progress)
    return {
        "title": template["id"].replace("-", " ").title(),
        "decisionAt": template["decision_at"],
        "message": (
            f"{len(recommended)} supported action alternatives. Future allocations retain their stated release conditions."
            if recommended
            else "No supplied action alternative meets the current requirements. Missing facts or a different proposal need review."
        ),
        "recommendations": [
            {
                "id": i,
                "status": allowed[i],
                "title": (
                    "Conditional future plan"
                    if allowed[i] == "conditional"
                    else "Supported action"
                ),
                "summary": by_id[i]["proposal"],
                "assignments": [],
                "calendars": [],
            }
            for i in recommended
        ],
        "assessments": assessments,
        "physicalExclusions": [],
        "rounds": rounds,
        "search": {
            "candidateCount": len(template["candidates"]),
            "resourcesConsidered": {"buses": 0, "crews": 0},
            "searchNodes": 0,
            "searchLimited": False,
            "scope": "Explicit action templates for this imported scenario; source records are read live. This is not an exhaustive search of future allocations.",
        },
        "policies": (
            [
                {
                    "id": "SCENARIO-OPERATOR",
                    "scope": "this scenario",
                    "requirement": extra,
                }
            ]
            if extra
            else []
        ),
        "sources": [
            {"id": h["id"], "title": h["title"], "rowCount": len(h["rows"])}
            for h in sources
        ],
        "affectedTrips": [],
    }
