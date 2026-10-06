---
title: Consistent disruption notices across languages
description: Compile approved incident facts into reviewed language templates and block incomplete notices.
---

## Problem and proposed outcome

During a disruption, a communications officer must explain the affected service, location, time, and passenger action across several channels. Independently editing each message creates a plausible risk of conflicting instructions. The proposal produces every language version from the same approved facts.

This is a proposed workflow improvement. The fictional operating records contain resource updates and control instructions, but they do not establish that multilingual notices currently disagree. A discovery session with communications staff must confirm that this problem exists before implementation.

## Evidence and missing inputs

`resource_updates.csv.gz` includes `update_id`, `issued_at`, `location_stop_id`, `related_trip_id`, and `statement`. `control_actions.csv.gz` links instructions through `referenced_update_ids`. `stops.csv.gz` supplies stop descriptions. These are possible source references, not publication-ready incident notices.

The new system needs an approved incident taxonomy, passenger-facing locations, effective and expiry times, channel limits, reviewed language templates, and a publication authority. Free-text resource statements cannot silently become facts. [Journey reliability](/docs/reliability-findings/) distinguishes observed delays from explanations, while [Evidence sources](/docs/applications/) describes the extract's scope.

## Mechanism and action

An editor creates a typed incident record. A stop closure requires an affected stop and an approved alternative. A delay notice requires an affected service and a status time. Each record references its operational evidence and approval revision.

A compiler checks the fields required by that incident type, inserts them into reviewed language templates, and produces channel-specific previews. Identifiers, dates, and directions remain structured values throughout rendering. Missing facts, an unsupported language, or an overlong mandatory instruction blocks that output.

The publication step accepts only artifacts compiled from the approved revision. A later change invalidates those artifacts and requires another preview. The output is a versioned set of notices plus a list of channels needing an update. The compiler cannot infer a cause or promise a recovery time absent from the approved record.

## Small prototype and falsification

Start with two incident types, two reviewed language fixtures, and one text channel. Demonstrate a stop closure that lacks its alternative stop. Compilation must fail with a specific missing-field message. Add the approved alternative and inspect both outputs. Change the effective time and prove that the older outputs cannot publish.

Acceptance requires identical underlying locations and times in every version, complete required instructions, and rejection of stale approvals. A fluent reviewer must assess every template. A successful structural check alone does not establish translation quality. Reject the proposal if operators cannot express common incidents within a maintainable set of typed records.

## Tradeoffs and distinctness

Templates sacrifice expressive flexibility for controlled meaning. An exceptional incident needs a separately reviewed free-text workflow, with no claim that it passed the template compiler.

This differs from retrieval or translation chat. It validates a typed source and renders approved language rules. The source-contract proposal validates incoming datasets, whereas this compiler creates passenger instructions and binds them to a publication approval.
