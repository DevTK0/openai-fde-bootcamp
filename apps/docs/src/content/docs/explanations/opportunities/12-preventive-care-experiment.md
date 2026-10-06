---
title: A controlled experiment for additional preventive care
description: Test whether an optional maintenance intervention changes outcomes before expanding it.
---

## Problem and proposed outcome

An Engineering manager must decide whether to expand optional condenser cleaning. A reduction in repair spending after cleaning would be encouraging, but vehicle use, selection, and ordinary variation could explain it. The proposed solution creates evidence for that decision through prospective randomized assignment.

The question is causal. Does offering an additional approved intervention improve a predefined outcome relative to the existing maintenance policy? The supplied fictional history does not answer it. [Repair spending and distance](/docs/maintenance-findings/) and [Comparing proposed costs](/docs/cost-findings/) explain why historical changes and quoted packages do not establish savings.

## Evidence and missing inputs

`monthly_vehicle_history` in `apps/web/lib/fleet-data.json` includes `recorded_km`, `repair_count`, `additional_preventive_visits`, and `repair_unavailable_hours`. `selected_component_observations` includes `component`, `condenser_obstruction_before_pct`, and `work_category`. These fields can inform outcome definitions and eligibility discussion.

The dataset lacks prospective random assignments, a complete eligible fleet, adherence records, and complete follow-up. The eight-vehicle historical sample is not a ready-made trial. Required additions include an Engineering-approved optional treatment, exclusions, allocation records, inspection consistency, and a plan for withdrawals. Routine servicing and required corrective work continue in every group.

## Mechanism and action

Before assignment, register the eligible cohort, follow-up period, primary outcome, analysis, and stopping conditions. Randomize eligible vehicles within relevant strata to the optional intervention or the existing policy. Freeze assignments before outcomes arrive. Record delivery and deviations separately from assignment.

Compare groups according to original assignment, with uncertainty and missing observations visible. Exposure measures such as kilometres need a predefined treatment in the analysis, especially if the intervention changes availability. The decision artifact is an experiment report that supports expansion, rejection, or further study. It does not automatically alter workshop bookings.

An optional analysis may estimate effects among treated vehicles, but it must state the additional assumptions. Replacing the primary comparison with whichever result looks strongest would defeat the experiment's purpose.

## Small prototype and falsification

Build an assignment register and replay invented outcomes for a synthetic cohort. Demonstrate balanced allocation within strata, an unchanged assignment after a dropout, and an inconclusive result when uncertainty remains wide. The demo tests the workflow, not maintenance effectiveness.

Acceptance requires reproducible assignment, a locked outcome definition, complete accounting of allocated vehicles, and an explicit handling of missing follow-up. The product hypothesis fails if managers cannot preserve the assigned comparison or collect consistent outcomes. A future live trial also needs a sample-size justification before its results can support expansion.

## Tradeoffs and distinctness

Engineering owns eligibility and any stop for vehicle condition. No experiment may delay necessary repairs. Operational spillovers, such as one group's reduced availability changing another group's workload, require a design review.

Component forecasting predicts what happens next under observed conditions. This experiment deliberately changes assignment to learn what an intervention causes. Workshop scheduling allocates execution capacity after an intervention is authorized. Neither forecasting nor scheduling substitutes for causal evidence.
