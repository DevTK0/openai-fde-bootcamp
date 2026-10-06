---
title: A reverse auction for comparable workshop work
description: Run a bounded procurement round after suppliers qualify against the same service specification.
---

## Problem and proposed outcome

A procurement officer wants competing prices for a defined workshop job, but quotes may include different work, exclusions, and validity periods. Choosing the smallest number could select a different service. The proposal separates qualification from price competition and produces a reviewable award recommendation.

The opportunity is conditional. It requires enough willing qualified suppliers and an interchangeable specification. The fictional cost proposals establish differences in scope, not an existing competitive market or a guaranteed saving.

## Evidence and missing inputs

The `Cost options` table in `apps/web/lib/fleet-data.json` contains `Option ID`, `Scope`, `Quoted price SGD`, `Visits`, `Valid from`, `Valid through`, and `Commercial scope`. [Comparing proposed costs](/docs/cost-findings/) explains that diagnostic review, cleaning, and component replacement are not interchangeable purchases.

A real procurement round needs supplier identities, qualification evidence, a common statement of work, delivery terms, taxes, exclusions, bid confidentiality, and an approved award policy. None of those can be inferred from the quoted option price. [Evidence sources](/docs/applications/) distinguishes proposals from approved purchases and incurred spending.

## Mechanism and action

First define one narrow lot, such as an approved cleaning procedure with a specified inspection record. Evaluate supplier qualifications and acceptance of that exact scope before opening bids. A reverse auction then permits qualified suppliers to lower their prices until a published close time, under rules fixed before the round starts.

The bid service validates eligibility, currency, completeness, and deadlines. Each accepted bid receives a receipt. A published tie rule and any closing extension rule apply uniformly. After the close, the service ranks compliant final offers and creates an award recommendation with the bid history and qualification references.

A procurement officer confirms the recommendation. The first prototype neither contacts suppliers nor creates purchase orders. A low bid cannot override a failed qualification or excluded mandatory work. If the services remain materially different, the system rejects the lot as unsuitable for this auction format.

## Small prototype and falsification

Use three invented suppliers and one fixed lot. Submit a low bid from an unqualified supplier, a valid lower bid before the deadline, and a late bid. Demonstrate rejection of the unqualified and late bids and a reproducible ranking of accepted offers. Include a tie to prove the stated rule.

Acceptance requires consistent close-time handling, no access to competitors' confidential details beyond the announced auction policy, and a complete award record. Reject this opportunity if supplier discovery finds too few qualified participants or scope variation prevents a common lot. The prototype cannot establish savings without actual comparable bids.

## Tradeoffs and distinctness

A price-focused process can discourage suppliers if quality requirements or liability terms are unclear. Procurement policy and supplier participation need review before a live pilot.

Spare-parts replenishment decides when and how much to order. Invoice reconciliation checks documents after commercial activity. This proposal discovers a price among qualified competing offers before award. It neither predicts stock demand nor proves delivery.
