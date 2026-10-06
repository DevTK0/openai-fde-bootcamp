---
title: Defect reports that survive a lost connection
description: Capture workshop evidence locally and reconcile delayed edits without losing safety-critical observations.
---

## Problem and proposed outcome

A technician records a defect while a device has no connection. If a form requires a successful server request, the technician must remember the details or keep a separate note. The proposal preserves the report immediately, then reconciles it when connectivity returns.

Connectivity loss is a proposed operating scenario, not an observed defect in the supplied application. The value hypothesis is that durable local capture reduces abandoned or duplicated reports. The first investigation must establish whether workshop users actually encounter that problem.

## Evidence and missing inputs

The fictional `workshop_work_orders.csv.gz` includes `work_order_id`, `vehicle_id`, `fault_summary`, `updated_at`, `work_status`, and `release_status`. Its separation of expected completion and `confirmed_release_at` matters. [Workshop capacity](/docs/workshop-findings/) explains that a tentative completion does not authorize release.

There are no device identities, synchronization cursors, conflict records, or attachments in that table. The prototype needs these as new structures. It also needs device storage limits, a retention policy, access revocation behavior, and agreement on which observations a technician can correct. [Evidence sources](/docs/applications/) supplies the scope of the existing records.

## Mechanism and action

A local durable queue stores each observation with a unique operation identifier, work-order reference, author, and the server revision last seen. The user receives a local-save receipt before any network request. A synchronization worker retries pending operations and the server deduplicates repeated identifiers.

Independent observations can accumulate without conflict. Corrections to the same field require an explicit resolution when the referenced revision is stale. A status transition such as release requires an online authority check and cannot emerge from automatic text merging. The user sees local-only, synchronized, and needs-review states with their exact meanings.

The server returns acknowledged operations and new revisions. The device retains unacknowledged reports after a restart. Attachment upload is separate, so a large photograph cannot erase the associated text report. Device clocks describe reported capture times but do not establish authoritative event order.

## Small prototype and falsification

Use one fictional work order and two device sessions. Disconnect one session, submit an observation, restart it, and reconnect. Retry the same operation repeatedly. Demonstrate exactly one server observation. Then edit the same report from both sessions and demonstrate an explicit conflict with both versions preserved.

Acceptance requires no loss of acknowledged local saves, no duplicate server observations under retries, and no offline release transition. Test storage exhaustion by refusing a new save with a visible error. Reject the approach if required devices cannot provide durable local storage or users cannot resolve conflicts reliably.

## Tradeoffs and distinctness

Locally retained notes need device-level protection and a bounded lifetime. Remote revocation cannot erase data from a disconnected device immediately, so sensitive content must be minimized.

The closest proposal is the dispatch event ledger. That ledger records authoritative operational decisions. This proposal addresses disconnected writers, durable drafts, retries, and conflicting revisions. It can feed a ledger, but a ledger alone does not provide offline capture or conflict resolution.
