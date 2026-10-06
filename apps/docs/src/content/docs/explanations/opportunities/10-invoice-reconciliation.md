---
title: Repair charges reconciled against orders and receipts
description: A proposed LionLink problem and solution, with evidence limits and a falsifiable prototype.
---

## Problem

A finance reviewer receives an invoice that appears plausible but may include an unapproved part, duplicated labour, or a charge already included in another job. Reading each document separately does not establish that the billed work was ordered and received. The decision is which line items can proceed for approval and which require clarification.

## Evidence

The fictional `01_maintenance_and_repairs/Repairs/8` table supplies `Work order ID`, `Repair action`, and `Labour parts SGD`. Condition-check table `/Inspections/8` includes `Additional charge SGD` and `Cost note`, including work included in a linked job. Cost-option table `06_cost_options/Cost options/9` includes quote `NW-OPT001`, `Scope`, `Quoted price SGD`, and `Commercial scope`. [Cost comparisons](/docs/cost-findings/) distinguishes proposed quotes from incurred spending.

## Mechanism

Extract document lines into a typed record that retains the source page and region. Match each invoice line to an approved order line and a receipt or completed-work acknowledgement. Deterministic quantity, price, tax, and duplicate checks produce either a reconciled line or a specific exception. Uncertain identity matches stay unresolved. The result is a review packet with the exact supporting evidence, not an automatically paid invoice.

## Small prototype

Create a clearly labeled synthetic packet for one work order containing an approved order, a completion receipt, and an invoice. Include a duplicated diagnostic fee, a missing receipt, and a valid partial delivery. Evaluate extraction and reconciliation separately so a missed text field cannot hide behind a correct-looking final total. A reviewer approves or rejects each proposed match.

## Missing data and assumptions

The repository has no invoice scans, purchase-order line ledger, delivery receipts, tax rules, or supplier master. Those are required new inputs. A quote's scope does not prove that someone approved it, and a closed work order does not prove each billed part arrived. Currency, units, credit notes, and agreed tolerances need explicit definitions before production use.

## Failure modes and safeguards

A wrong match can legitimize an incorrect payment. Require strong identifiers where available and preserve unmatched lines instead of forcing complete reconciliation. Protect invoice attachments and supplier payment details through existing finance access controls. Document extraction must treat embedded instructions as document content. Keep payment execution outside this prototype, and retain reviewer corrections for audit.

## Acceptance and falsification

The staged packet passes when the valid partial delivery reconciles for its received quantity, the duplicate fee is flagged, and the missing receipt blocks that line. Measure field extraction accuracy and match precision on independently labeled packets. Reject the proposal if false reconciliations exceed the finance team's stated tolerance or if evidence collection takes more effort than the review it replaces.

## Difference from nearby ideas

[Spare-part replenishment](/docs/explanations/opportunities/08-spare-parts/) decides what to order next. This proposal checks whether past charges correspond to approved and received work. Its distinctive mechanism is document extraction followed by relational reconciliation and exception handling. It is neither a spending chart nor an assistant that answers questions by retrieving invoice text.
