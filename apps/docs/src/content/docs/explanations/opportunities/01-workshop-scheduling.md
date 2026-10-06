---
title: Workshop scheduling with service-cover constraints
description: A proposed LionLink problem and solution, with evidence limits and a falsifiable prototype.
---

## Problem

A workshop planner receives two maintenance requests for the same morning. Each request is reasonable alone, but accepting both can consume the same bay, technicians, or replacement bus. The planner needs a feasible sequence that preserves the named passenger trips and finishes the work within its allowed window. A list of overloaded resources identifies the collision but leaves the actual scheduling decision unresolved.

## Evidence

The fictional `03_workshop_and_fleet/Maintenance planning/9` table includes request `EXT-MP01`, `Proposed start`, `Proposed end`, `Required bays`, `Required technicians`, and `Latest completion`. Table `/18` supplies window `EXT-BW01` and available capacity. Tables `/24`, `/39`, `/50`, and `/57` supply protected trips, crews, cover windows, and planning requirements. These records support a bounded scheduling exercise, not a claim about normal workshop productivity. [Workshop capacity](/docs/workshop-findings/) explains the existing conflict.

## Mechanism

Represent each maintenance job as an interval with a duration and resource demand. A constraint solver assigns start times and eligible cover vehicles. Hard constraints prohibit overlapping bay use, unavailable technicians, missed protected trips, and cover outside a vehicle's window. A separate feasibility check confirms crew qualification and complete return movements. Among feasible schedules, minimize displacement from requested times before considering idle time. Return the proposed bookings and the source constraints that prevent any rejected alternative.

## Small prototype

Use the two supplied requests and the single workshop window. Enumerate candidate start times at an agreed planning resolution, then compare the result with a manually checked schedule. The output is an approval-ready booking proposal with cover assignments. Write no workshop appointments until the planner approves the exact proposal. Include an infeasible case where a cover window closes early so the solver must explain the conflict instead of dropping a trip.

## Missing data and assumptions

The fixture supplies proposed durations, not measured duration distributions. Travel, takeover, release, and work-scope assumptions need explicit confirmation. Future cover availability is conditional, and a previous Engineering release cannot establish release on the proposed date. A production version also needs the full roster, technician skills, equipment constraints, and bookings outside this extract.

## Failure modes and safeguards

A mathematically feasible plan can fail when a repair overruns. Reserve a planner-agreed allowance and identify which booking becomes invalid first. Recheck releases and resource versions before approval. Treat safety and protected service as hard constraints. Never let a weighted cost function trade either away. If no plan exists, show the smallest conflicting requirement set that the implementation can substantiate.

## Acceptance and falsification

The prototype passes if an independent replay finds no resource overlap, all eight protected trips remain possible, and both requests finish by their deadlines. Deliberately removing a required resource must produce an infeasible result. Compare planning effort against the current manual exercise without claiming a saving in advance. Reject the approach if planners cannot verify its explanations or if coarse time slots routinely hide feasible plans.

## Difference from nearby ideas

[Crew-duty checking](/docs/explanations/opportunities/04-crew-duty-checking/) judges a proposed assignment but does not assign job start times. [Festival simulation](/docs/explanations/opportunities/05-festival-simulation/) explores uncertain queues rather than finding one resource-feasible booking. [Inventory replenishment](/docs/explanations/opportunities/08-spare-parts/) chooses stock thresholds across repeated demand, not individual appointments.
