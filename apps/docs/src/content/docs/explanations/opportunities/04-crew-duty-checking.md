---
title: Crew-duty rules as executable assignment checks
description: A proposed LionLink problem and solution, with evidence limits and a falsifiable prototype.
---

## Problem

A spare bus does not create a spare driver. A planner may find an apparently available crew member while overlooking a protected break, route qualification, takeover interval, or the return journey. The required answer is whether a specific proposed duty satisfies every declared rule, with the exact failing interval when it does not.

## Evidence

The fictional `crew_duties` table supplies `duty_id`, `qualified_service_no`, `available_from`, `available_until`, `protected_break_start`, `protected_break_end`, `maximum_continuous_duty_minutes`, and `takeover_seconds`. Record `NW-D00001` illustrates a bounded morning assignment. The incident table `03_workshop_and_fleet/Incident baseline/66` includes crew `EXT-RC01`, protected rest, and existing commitments. [Evidence sources](/docs/applications/) explains the records' scope. These are exercise requirements, not statements of employment law.

## Mechanism

Translate each approved rule into a predicate over a complete ordered duty timeline. Normalize driving, positioning, takeover, waiting, and protected rest into explicitly typed intervals. Check qualification, availability, location continuity, overlap, and continuous-duty duration. Return pass, fail, or unknown for each rule. A failure includes the offending interval and rule version. Missing preceding activity yields unknown rather than an invented clean history.

## Small prototype

Build a command-line checker for one supplied duty and a proposed relief assignment. Include a valid case, a one-minute overlap with protected rest, an unqualified route, and a return after availability ends. Produce an explanation that a roster supervisor can compare with the supplied records. Keep rule definitions separate from the timeline so a rule change has an auditable version.

## Missing data and assumptions

The records omit the full working day and many preceding duties. Production checks require agreed work definitions, authoritative qualifications, local agreements, and applicable reviewed rules. They also need reliable travel and takeover durations. Do not label an exercise pass as legal compliance. If a rule's meaning is ambiguous, an authorized roster specialist must resolve it before that predicate can approve assignments.

## Failure modes and safeguards

The most dangerous result is a confident pass on an incomplete timeline. Make missing coverage visible and prevent unknown checks from becoming automatic approval. Time-zone conversion and duties crossing midnight need explicit cases. A rule change must not rewrite the historical meaning of an accepted duty. Store the rule version and input snapshot with every result.

## Acceptance and falsification

The prototype passes when all deliberately invalid cases identify the correct rule and interval, and the valid case passes without exceptions. Removing preceding-duty coverage must change the relevant result to unknown. Compare explanations with an independent manual review. Falsify the approach if the organization cannot express its operative rules consistently enough for reviewers to agree on expected outcomes.

## Difference from nearby ideas

[Workshop scheduling](/docs/explanations/opportunities/01-workshop-scheduling/) searches for a feasible arrangement. This checker evaluates a supplied arrangement and does not optimize it. [Dispatch history](/docs/explanations/opportunities/03-dispatch-ledger/) resolves concurrent commands. Both can call the checker, but executable rule semantics and counterexample explanations are the separate product.
