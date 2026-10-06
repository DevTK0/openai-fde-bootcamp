---
title: Source contracts that quarantine incompatible refreshes
description: Admit new data only when its schema, lineage, and coverage match a declared source contract.
---

## Problem and proposed outcome

A maintainer refreshes a dataset and the new file still parses, but a unit, coverage window, or identifier convention has changed. Existing calculations could then produce plausible figures for a different population. The proposal stops incompatible refreshes before they replace the published dataset.

This is a failure scenario to test, not a claim that a current refresh has corrupted LionLink. The desired outcome is an explicit accept-or-quarantine decision, accompanied by the exact contract clause and evidence behind it.

## Evidence and missing inputs

`service_calendar.csv.gz` records `timezone` and `status`. `queue_windows.csv.gz` records observation boundaries and `scope`. `timetable_records.csv.gz` includes `version_id`, `effective_from`, and `effective_until`. `stops.csv.gz` and `route_stops.csv.gz` retain `source_id`. These fields show that provenance and scope belong to the meaning of the records.

[Measures and coverage](/docs/measures/) distinguishes boarding events from people and defines the bounded morning extract. [Trace a finding to its records](/docs/explore-records/) describes the checks a reader currently performs. A refresh contract additionally needs a source owner, version policy, declared units, expected key relationships, and a rule for deliberate coverage changes.

## Mechanism and action

A versioned contract defines required fields, types, units, key uniqueness, referential constraints, and acceptable coverage metadata. A candidate refresh enters an isolated staging location. Validators compare it with the declared contract and calculate a manifest containing source identity, retrieval time, and content hashes.

The admission decision is atomic for the dataset version. A failed candidate stays quarantined with its diagnostic report. The last accepted version remains available. An intentional semantic change requires a new contract version and a reviewed migration of affected consumers. Quiet coercion of changed units is outside the admission process.

A content hash detects changed bytes, but it does not establish that the source is truthful. Provenance records must say how the source was obtained and who approved it. The output is an accepted immutable dataset version or a rejected candidate, not a chart with a warning badge.

## Small prototype and falsification

Take a small operation fixture and create mutations with a duplicate `call_id`, an unknown `trip_id`, a missing timezone, and a changed declared observation window. Each mutation must fail its corresponding contract clause. A valid refresh must activate as one version, with no mixed old and new tables.

Acceptance requires repeatable admission results, preserved rejection evidence, and a rollback to a known accepted version. The proposal fails if meaningful unit or population changes are invisible to the supplied metadata. In that case, source-owner agreements must improve before stricter code can help.

## Tradeoffs and distinctness

Contracts create maintenance work and can reject legitimate changes. A documented migration path is necessary so staff do not bypass quarantine under deadline pressure.

Invoice reconciliation matches business documents and amounts to locate disputed transactions. Source contracts validate a feed's technical and semantic promises before publication. They do not establish that a repair invoice corresponds to delivered work, even when every field passes validation.
