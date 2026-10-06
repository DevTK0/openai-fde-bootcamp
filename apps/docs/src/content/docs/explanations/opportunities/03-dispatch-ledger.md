---
title: Dispatch instructions with replayable command history
description: A proposed LionLink problem and solution, with evidence limits and a falsifiable prototype.
---

## Problem

Two controllers can act on different versions of vehicle availability. One assigns a spare while another has already used it, and a delayed message can appear after a newer instruction. The dispatcher needs a definite answer to which command is accepted, which resources it reserves, and what evidence supported that decision at the time.

## Evidence

The fictional `control_actions` table contains `action_id`, `issued_at`, `trip_id`, `vehicle_id`, `crew_id`, and `referenced_update_ids`. Action `NW-A0017` refers to updates `NW-U0017`, `NW-U0018`, and `NW-U0019` in the selected control evidence. `resource_updates` records availability windows and resource locations. [Evidence sources](/docs/applications/) describes the operating extract. The fixture has action records but does not prove a transactional command service exists.

## Mechanism

Create an append-only command ledger. A proposed assignment carries an idempotency key and expected versions for its trip, vehicle, and crew. One transaction checks those versions, validates current availability, reserves the resources, and appends an accepted event. A stale proposal becomes a rejected event with its conflict reason. Projections reconstruct current assignments by replaying accepted events. Cancellation is a new compensating command rather than deletion of the earlier instruction.

## Small prototype

Replay the supplied action and update sequence through a small local service. Submit two assignments for the same vehicle from separate simulated clients. Duplicate one request and deliver an old update late. The prototype returns one durable outcome per request, an inspectable rejection for the conflict, and a reconstructed assignment view identical to the original after restart.

## Missing data and assumptions

The fixture lacks command acknowledgements, stable producer sequence numbers, user permissions, and clock-quality evidence. New integrations must distinguish event occurrence time from arrival time and retain the originating system's identifier. An accepted ledger entry also needs a separate delivery acknowledgement before anyone assumes the driver received the instruction.

## Failure modes and safeguards

A ledger can faithfully preserve a bad instruction. Keep Engineering release checks and crew rules at command acceptance, and require a controller to approve proposed operational changes. If connectivity prevents an authoritative decision, show the assignment as pending rather than accepted. Reconcile manual radio instructions explicitly after recovery. Avoid a second writable assignment database that can disagree with the ledger.

## Acceptance and falsification

Acceptance requires exactly one reservation when concurrent proposals compete for the same resource. Duplicate submissions must return the same accepted outcome without duplicate effects. Restart and replay must restore identical assignments. A late update cannot silently overwrite a newer accepted command. Reject the design if the team cannot define the authority for offline instructions or safely reconcile them.

## Difference from nearby ideas

[Headway control](/docs/explanations/opportunities/02-headway-control/) chooses an operational adjustment. This proposal governs how any chosen adjustment becomes authoritative. [Crew-duty checking](/docs/explanations/opportunities/04-crew-duty-checking/) supplies a validation result. The ledger's distinctive contribution is concurrency control and durable command identity, not another planner or a searchable transcript.
