---
title: Synthetic case generation without copying passenger records
description: Generate bounded fictional test cases from explicit rules instead of transformed passenger narratives.
---

## Problem and proposed outcome

Developers need unusual passenger cases to test matching, time interpretation, and error handling. Copying operational narratives into fixtures would create a future privacy concern if real records replaced the current fictional ones. The proposal creates cases independently from a schema and an authored grammar.

The present dataset is already fictional. This proposal does not claim to remove a current privacy breach. Its product hypothesis is that a rule-based case generator can supply useful test coverage without depending on private passenger text or learning a distribution from it.

## Evidence and missing inputs

The `Passenger reports` table in `apps/web/lib/fleet-data.json` contains `Case ID`, `Journey window start`, `Journey window end`, `Journey time basis`, `Reported service no`, `Reported stop ID`, and `Passenger report`. [Passenger accounts](/docs/passenger-findings/) explains why a scheduled journey and an observed departure need different matching rules.

The existing schema supplies useful field types. It does not supply a full test specification or a privacy mechanism for a model trained on sensitive data. The new inputs are independently written narrative templates, invented identifiers, allowed value ranges, and a catalog of deliberately invalid combinations. [Evidence sources](/docs/applications/) keeps the distinction between fictional records and real populations explicit.

## Mechanism and action

A seeded generator chooses a case category, creates structured fields, and renders an authored narrative template from those fields. Valid cases obey declared invariants. Invalid cases violate exactly one selected invariant, such as a reversed journey window or an unknown stop identifier.

Each case includes its seed, category, expected interpretation, and whether it is intentionally invalid. Coverage comes from the rule catalog, not resemblance to a real person's story. The generated artifact becomes a test fixture pack for consumers such as a journey-matching form or an import validator.

The generator must never read passenger narratives. A build-time input allowlist can enforce that boundary. If future requirements demand realistic private distributions, that is a different design needing an explicit privacy argument. Random names and paraphrased narratives would not satisfy this proposal's boundary.

## Small prototype and falsification

Author categories for scheduled versus observed departure, missing vehicle identifiers, midnight boundaries, and conflicting service identifiers. Generate a repeatable fixture pack and demonstrate that the same seed yields the same cases. A consumer test should distinguish an unknown match from an invalid report.

Acceptance requires no reads from passenger narrative sources, a declared expected result per case, and coverage of every authored category. Review generated text for accidental contradictions outside the chosen invalid field. Reject the generator if its fixtures reproduce only trivial happy paths or require source narratives to become useful.

## Tradeoffs and distinctness

Independent authoring provides a narrow data-minimization argument, not a formal guarantee of anonymity or statistical representativeness. Synthetic fixtures cannot establish model quality on a real population.

Incident rehearsal authors choices for a learner. This generator produces reproducible data artifacts for software tests. The source-contract proposal validates incoming records. It can consume these fixtures, but it does not generate them or define their coverage.
