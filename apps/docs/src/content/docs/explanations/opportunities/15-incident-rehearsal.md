---
title: Incident rehearsal with branching decisions
description: Let controllers practise procedural choices through authored scenarios with evidence-based debriefs.
---

## Problem and proposed outcome

A new controller may understand a procedure yet struggle to apply it when information arrives in an awkward order. The proposed rehearsal lets that controller practise requests, checks, and escalation before operating a live service. The outcome is a debrief that identifies missed procedural steps.

This is a training hypothesis. The supplied fictional incident records provide scenario ingredients, but there is no evidence here that controllers lack competence. Training owners must first identify a procedure worth practising and a failure that current instruction does not address.

## Evidence and missing inputs

The `Incident baseline` tables in `apps/web/lib/fleet-data.json` include an `Incident ID`, `Issued at`, a `Takeover rule`, protected duties, and relief demand assumptions. The baseline states that a stationary takeover briefing does not permit dispatch before release. The operating `resource_updates` table provides timestamped statements for a separate source of scenario prompts.

[Workshop capacity](/docs/workshop-findings/) explains the difference between expected completion and confirmed release. [Evidence sources](/docs/applications/) identifies these records as fictional exercise material. Missing inputs include an approved procedure, instructor-authored choices, scoring criteria, and evidence that a training score relates to the intended skill.

## Mechanism and action

An instructor authors a directed scenario graph. Each node presents only the facts available at that point. A trainee chooses an action, requests missing evidence, or escalates. The selected edge determines the next authored consequence and the elapsed scenario time.

The scoring rubric checks procedural behavior, such as requesting release confirmation before authorizing a vehicle. It distinguishes an unsafe action from a reasonable choice made with incomplete information. The debrief replays the learner's decisions beside the evidence visible at each step and the relevant procedure.

This first version does not estimate real queue outcomes. An authored consequence is explicitly part of the training scenario. Instructors can alter the order of facts to test whether trainees follow the procedure rather than memorize a sequence of buttons.

## Small prototype and falsification

Build one ten-minute exercise around a vehicle whose expected completion precedes its confirmed release. Offer an early dispatch choice, a request for confirmation, and an escalation choice. Demonstrate that the debrief explains the premature dispatch error without revealing future information to the trainee during the exercise.

Acceptance requires deterministic replay, no access to future facts before their scenario time, and an instructor-approved explanation for every scored action. Test with experienced controllers and new learners. Reject the scoring model if experts disagree because the scenario omits material information, or if learners can pass through answer memorization without explaining the decision.

## Tradeoffs and distinctness

Training records can become personnel assessments. The prototype should provide private practice feedback and avoid employment decisions based on an unvalidated score. Scenario ownership is an ongoing cost when procedures change.

The queue simulation proposal predicts operational outcomes under numerical assumptions. This rehearsal teaches procedural judgment through authored branches. Formal crew-duty checking examines an actual proposed plan against rules. Neither replaces a person's opportunity to practise gathering evidence and explaining a decision.
