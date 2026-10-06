---
title: Mechanic questioning based on information gained
description: A proposed LionLink problem and solution, with evidence limits and a falsifiable prototype.
---

## Problem

A mechanic receives a warm-saloon report that fits several possible faults. Repeating a generic checklist can waste effort, while guessing a repair can leave the cause unresolved. The useful next step is the safe observation or test that best separates the remaining explanations for this specific case.

## Evidence

The fictional work-order table `01_maintenance_and_repairs/Repairs/8` records `Reported symptom`, `Inspection finding`, `Fault family`, and `Repair action`. Work order `NW-MWO001` links a warm saloon to a recorded hose leak. Condition-check table `/Inspections/8` includes `Component`, `Observed condition`, and `Work order ID`. [Passenger accounts](/docs/passenger-findings/) explains why a reported experience does not itself diagnose a mechanical cause.

## Mechanism

Maintain an engineer-reviewed set of fault hypotheses and safe tests. Each test has possible outcomes, estimated likelihoods under each hypothesis, duration, and prerequisites. After the mechanic enters an observation, update the hypothesis probabilities. Select the next permitted test by expected reduction in uncertainty relative to test cost. Return the question, its rationale, and the observations that would change the next step. A mechanic records the actual result before the sequence continues.

## Small prototype

Limit the prototype to one comfort complaint and a small hypothesis set approved by an engineer. Use staged fictional cases with known causes and ambiguous cases that should end in escalation. Compare the selected sequence with the same fixed checklist for every case. Keep the question inventory fixed initially so evaluation measures test selection rather than fluent wording.

## Missing data and assumptions

The supplied work orders lack a validated hypothesis catalogue, negative test results, likelihood estimates, and measured test costs. Those require engineering input and prospective collection. A language model could normalize a symptom description, but it cannot invent a safe test procedure or evidence for a diagnosis. Unseen faults need an explicit unknown-cause option.

## Failure modes and safeguards

Information gain can favor a dangerous or impractical test. Safety prerequisites and approved procedures must constrain the candidate set before ranking. Avoid premature certainty when several symptoms share a cause or when test outcomes are correlated. Show uncertainty and allow the mechanic to override the proposed sequence with a recorded reason. Engineering retains diagnosis and release authority.

## Acceptance and falsification

On blinded staged cases, measure tests performed before reaching the independently confirmed cause, incorrect conclusions, and escalations. Require every proposed test to come from the approved inventory with satisfied prerequisites. The prototype fails if it saves tests only by increasing incorrect diagnoses, or if poorly known likelihoods make question order unstable across reasonable expert estimates.

## Difference from nearby ideas

[Component survival](/docs/explanations/opportunities/06-component-survival/) predicts when faults may occur. This proposal selects evidence to distinguish causes after a report. [Visual inspection](/docs/explanations/opportunities/09-visual-inspection/) could supply one observation, but selecting the next question is a sequential decision under uncertainty rather than image recognition or document retrieval.
