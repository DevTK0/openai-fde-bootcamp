---
title: Festival contingency plans through queue simulation
description: A proposed LionLink problem and solution, with evidence limits and a falsifiable prototype.
---

## Problem

An event planner must decide whether a proposed shuttle allocation still works if crowds arrive in bursts or a bus returns late. A capacity total ignores when passengers appear and when each vehicle can load again. The problem is to compare the consequences of complete contingency plans before choosing one.

## Evidence

The fictional `03_workshop_and_fleet/Festival allocation/9` table provides route `EXT-E1`, `Cycle minutes`, and `Outward ride minutes`. Table `/16` includes allocation `EXT-FA01`, `Proposed departure times local`, `Planning limit per departure`, and `Wheelchair spaces`. Tables `/31` and `/44` provide crews and event requirements. [Evidence sources](/docs/applications/) identifies these as planning evidence. The values are assumptions, not observed event travel times.

## Mechanism

A discrete-event model advances between passenger arrivals, bus arrivals, boarding completion, and vehicle returns. Each departure removes eligible passengers from a queue up to the assigned capacity. Separate accessible-space accounting preserves wheelchair constraints. For each proposed allocation, run the same declared demand and delay scenarios. Return the distribution of waiting times, people still waiting at closing, and resource violations, together with the assumptions that produced them.

## Small prototype

Model the two temporary routes and supplied allocations. Start with deterministic arrivals so a reviewer can calculate several departures by hand. Then compare the baseline with the explicitly permitted reassignment and additional-resource options under a small scenario grid. Keep random seeds fixed across alternatives so differences do not come from different sampled crowds.

## Missing data and assumptions

The allocations do not establish the real arrival curve, event attendance, accessible-demand mix, abandonment behavior, or travel-time variability. Those must be supplied as scenario inputs or measured later. Availability and Engineering release remain conditional. Name every assumed extra vehicle and crew. Do not let a simulation invent capacity when the queue becomes inconvenient.

## Failure modes and safeguards

An attractive average can hide a stranded tail. Report closing backlog and the worst declared scenario alongside mean wait. Keep protected departures intact and check complete returns within crew availability. Separate uncertainty about demand from random variation inside a chosen scenario. A smooth animation is not evidence that the model describes a real event.

## Acceptance and falsification

First require exact passenger conservation in each run: initial queue plus arrivals equals boardings plus remaining passengers, adjusted only for explicitly modeled exits. Hand-calculated deterministic cases must match. Compare candidate plans under identical scenarios and require no protected-service violation. Reject any confident recommendation if the ranking reverses across plausible inputs that the team cannot measure or bound.

## Difference from nearby ideas

[Workshop scheduling](/docs/explanations/opportunities/01-workshop-scheduling/) finds resource-feasible bookings under stated constraints. This simulation estimates queue consequences across uncertain scenarios and may leave the choice to the planner. [Headway control](/docs/explanations/opportunities/02-headway-control/) acts during service. This proposal runs before the event and issues a contingency comparison rather than live hold commands.
