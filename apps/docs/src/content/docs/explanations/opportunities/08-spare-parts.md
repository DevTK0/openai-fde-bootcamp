---
title: Spare-part replenishment under uncertain lead times
description: A proposed LionLink problem and solution, with evidence limits and a falsifiable prototype.
---

## Problem

A parts coordinator must order before the exact next repair is known. Ordering only after a confirmed fault can extend vehicle downtime, while ordering every possible part ties up stock and creates expiry or obsolescence risk. The recurring decision is how much of a particular part to hold and when to replenish it.

## Evidence

The fictional selected work-order table `01_maintenance_and_repairs/Repairs/8` includes `Repair action`, `Labour parts SGD`, and work-order identifiers such as `NW-MWO001`. `monthly_vehicle_history` has `repair_count` and `repair_unavailable_hours`. [Repair spending](/docs/maintenance-findings/) explains the supplied cost and exposure context. These records motivate a parts question, but neither combined job charges nor repair counts identify part consumption or stockouts.

## Mechanism

For each part, track on-hand quantity, committed quantity, and outstanding orders. Estimate demand over supplier lead time from verified consumption and delivery history. An agreed service-level objective produces a reorder point and target stock level, subject to shelf life and storage constraints. When inventory position crosses the threshold, create a purchase proposal for the difference. Recompute the policy periodically rather than generating a fresh purchase from every mention of a fault.

## Small prototype

Use one commonly consumed fictional part with a deliberately supplied transaction ledger and lead-time scenarios. Backtest an order-up-to policy against a fixed reorder rule using the same demand sequence. The result includes purchase proposals, backorders, inventory held, and expired stock. Keep all purchasing simulated until the coordinator reviews both the policy and the input coverage.

## Missing data and assumptions

New data must include part numbers, compatible vehicles, issued quantities, returns, current stock, open orders, supplier lead times, minimum order quantities, and prices. Repairs without an issued-part record cannot stand in for consumption. Demand suppressed by a stockout must also be recorded, or the policy can learn that unavailable parts are unnecessary. Fixture cost proposals are not supplier delivery commitments.

## Failure modes and safeguards

A policy optimized for average demand may fail during a cluster of related faults. Stress-test shared-component failures and late deliveries. Separate non-substitutable safety-critical parts from items with approved alternatives. Do not silently pool similar names as one part. A purchase proposal must state the inventory snapshot and outstanding orders to prevent duplicate replenishment.

## Acceptance and falsification

The prototype passes if every simulated stock balance reconciles and repeated runs produce identical orders for the same ledger. Compare unmet requests, holding cost, and expiry cost across declared scenarios. An agreed service target must hold without exceeding the approved inventory budget. Falsify the business case if reliable consumption history is unavailable or if minimum order quantities dominate any benefit from finer thresholds.

## Difference from nearby ideas

[Workshop scheduling](/docs/explanations/opportunities/01-workshop-scheduling/) assigns specific jobs to time and resources. This proposal manages repeated uncertain demand across a stock ledger. [Invoice reconciliation](/docs/explanations/opportunities/10-invoice-reconciliation/) checks a past purchase. Neither determines the replenishment threshold that is this proposal's central decision.
