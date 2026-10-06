---
title: Headway control through bounded departure feedback
description: A proposed LionLink problem and solution, with evidence limits and a falsifiable prototype.
---

## Problem

A controller sees successive buses depart too close together while the following gap grows. Rewriting tomorrow's timetable cannot correct a disturbance already developing. The operational decision is whether to hold a particular departure briefly, using the latest spacing and passenger load, without creating a worse gap behind it.

## Evidence

The `trips` extract provides `trip_id`, `route_id`, `scheduled_departure_at`, `actual_departure_at`, and `actual_arrival_at`. Its first record is `NW-20261005-0001`. `queue_windows` record `NW-W00001` supplies `initial_queue_people`, `total_arrivals_people`, `total_boarded_people`, and `remaining_queue_people`. These are historical fictional observations. They do not constitute a live position feed. [Journey reliability](/docs/reliability-findings/) describes their limited morning coverage.

## Mechanism

A feedback controller estimates the gap to the preceding bus and the expected gap to the following bus at a permitted control point. It calculates a bounded hold from those errors, then applies occupancy, maximum-wait, and departure-authority checks. A deadband suppresses small corrections. The next observation closes the loop by measuring the actual spacing after the action. The action is a short hold recommendation with an expiry time, not a new network schedule.

## Small prototype

Replay one route direction using time-ordered trip events and an explicitly synthetic live-observation stream. Compare a fixed no-hold baseline with a simple proportional controller across the same disturbances. Show the hold duration and the reason to a simulated controller. First test isolated perturbations, then repeated delays, rather than tuning until one chosen day looks good.

## Missing data and assumptions

Actual production inputs would include vehicle positions, observation latency, loads, control-point permissions, and a forecast for the next arrival. The fixture does not establish these feeds or passenger arrival distributions between every observed call. The exercise's timetable-change limits are not automatic authority for live holding. Operations must define which actions are allowed and how long a recommendation remains valid.

## Failure modes and safeguards

Delayed observations can make feedback oscillate. Bound each hold and the cumulative hold per journey, and stop recommendations when freshness checks fail. Protect passengers already aboard by measuring their extra delay alongside waiting time at stops. A controller can improve spacing while making the last bus less useful, so terminal departures and the end of service need separate handling.

## Acceptance and falsification

A useful prototype reduces an agreed headway-error measure on held-out replay scenarios while keeping every hold within the declared limits. Report onboard delay and worst passenger wait alongside that measure. Inject missing observations and verify that the controller abstains. Falsify the proposal if gains disappear with realistic latency, or if lower headway error consistently increases total passenger delay.

## Difference from nearby ideas

[Festival simulation](/docs/explanations/opportunities/05-festival-simulation/) evaluates complete contingency plans before an event. This proposal repeatedly changes one imminent departure in response to new measurements. [Dispatch commands](/docs/explanations/opportunities/03-dispatch-ledger/) establish which instruction is authoritative. They do not decide the hold duration. The distinctive mechanism here is closed-loop control.
