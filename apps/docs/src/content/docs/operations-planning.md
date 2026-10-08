---
title: Why the operations planner separates feasibility from preference
description: The problem, tuning journey, evidence design, and paired Decisions and Astra evaluation behind LionLink operations planning.
---

A bus breaks down before departure. The nearest spare looks suitable, but its driver has another duty later that morning. Replacing one trip might fix the immediate problem and create another one an hour later.

The planning problem is to propose a complete recovery that respects the rest of the operation. It must account for the bus, crew, route, passenger capacity, future assignments, preparation time, breaks, and release conditions. Only then does it make sense to ask which plan is best.

The earlier evaluation explored this problem through five situations: a new bus, new crew, sick crew, a faulty bus in the depot, and a faulty bus during service. Its SQLite source also includes imported maintenance, festival, evening-relief, and Engineering records.

## The shipped planner compares coordinated recovery plans

The main app now offers **Planning → Operations planner**. Its three presets cover a Toa Payoh bus withdrawal, an Ang Mo Kio bus withdrawal, and a sick Toa Payoh relief crew member. All use 5 October 2026 at 09:25 Singapore time.

For the preset day, the engine considers 172 buses and 327 crew profiles. A bounded search constructs 36 complete allocations across the affected services. Decisions checks written requirements through focused policy questions, with identical checks reused within the run. Eligible plans enter groups of three; one advances from each group until four finalists remain. Ordering those finalists brings each preset to 19 comparison calls. A singleton still advances without a comparison.

Each recommendation shows route, bus and crew schedules on one time axis. Purple blocks identify recommended reassignments; grey blocks show existing duties. Selecting a trip highlights it across the schedules. Earlier and later commitments, preparation and protected breaks remain visible. The page keeps the run inputs and visual plans; evaluation details remain in the saved audit.

Six live trials across two grouping orders admitted all 36 plans with no observed eligibility or objective-order errors. This is a finite tuning result, not proof of global optimality or general accuracy. Astra has **not** been rerun on these coordinated presets. The [delivery record](https://github.com/DevTK0/openai-fde-bootcamp/blob/5436857/apps/web/planner/DELIVERY.md) documents this stage.

The rest of this explanation traces the earlier tuning and paired evaluation that led to this design. Its five-situation examples and six-plan tournament groups describe that earlier engine configuration.

## Why use AI when schedules can be checked in code?

Much of this problem is deterministic. Two overlapping trips cannot use the same bus. A held vehicle cannot be dispatched. Those facts do not become more useful when a language model rediscovers them.

The useful AI task comes from the **operating requirements written in plain text**. An operations team can add a rule such as “Every affected trip must have at least two wheelchair spaces” or change the objective to prioritize accessibility over the number of changes. The model interprets the applicable written requirements and compares otherwise supportable alternatives.

This division keeps code responsible for concrete availability checks and exact arithmetic. It gives AI the policy interpretation and preference questions. Adding a written requirement needs no new application code, but a new rule still needs evaluation. The model is not a formal guarantee that every possible policy will be enforced correctly.

## The first prototype asked too much of an incomplete candidate

The initial prototype focused on the first route 235 trip on one operating date. It offered up to 24 illustrative candidates. Each candidate contained a bus, a driver, a proposed task window, future schedules, resource updates, and known blockers or missing facts.

Future schedules were already present. The weakness was how the proposed action related to them. A resource pair for one trip does not specify how every later affected trip will run.

<picture>
  <source media="(max-width: 600px)" srcset="/docs/operations-planning/candidate-evolution-mobile.svg" />
  <img src="/docs/operations-planning/candidate-evolution.svg" alt="Initial candidates contained one bus-and-crew pair for one trip with schedules attached. Current candidates contain assignments for every affected trip, applied to resource calendars while retaining other commitments." loading="lazy" />
</picture>

The early comparison call also mixed two questions. It classified each candidate against the policies and selected a preference from the same group, including a `NONE` option. Uncertain candidates could advance for review, and option probabilities helped order survivors. This made an empty shortlist hard to diagnose. It could reflect a real lack of cover, incomplete evidence, or a mistaken classification.

The revised planner makes each alternative a **complete plan**. It applies that plan's substitutions to the supplied calendars before asking the model to assess it. Original allocations remain available as the baseline for capacity and change counts. They do not appear as simultaneous extra tasks after replacement.

## The tuning journey exposed both input problems and model errors

The development sequence mattered. A small case passing did not imply that the same approach worked across the network.

| Observation                                                                          | Change                                                                                                 | What the result established                                                                                                                   |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| The early prototype covered one date and route with illustrative candidates.         | Expand cases across all supplied dates and route directions, then audit the actual projected evidence. | An initial coverage audit still found 210 missing trips and 101 missing crew-day records. Adding 143 direct-resource cases closed those gaps. |
| Replaced-bus profiles were absent from some projected inputs.                        | Preserve the original capacity baseline alongside the proposed allocation.                             | The model can compare the replacement with what the original plan promised.                                                                   |
| Calendar interpretation required the model to derive time gaps and duty spans.       | Supply exact timestamp differences and each driver's own effective duty.                               | The input states the relevant facts without requiring repeated arithmetic.                                                                    |
| In-service cases contained both a known held-bus violation and missing rescue facts. | Make a definite violation take precedence over missing evidence.                                       | A held-bus proposal is blocked; missing rescue timing does not make that violation merely unresolved.                                         |
| Repeating all policy text inside the question instructions seemed likely to help.    | Test the duplication, then revert it.                                                                  | That experiment produced 152 eligibility errors. More repetition was not an improvement.                                                      |
| A wider raw-classifier audit still approved impossible assignments.                  | Enforce physical availability before model assessment and report those exclusions separately.          | The final result measures the combined planner, not the model's ability to catch every physical violation.                                    |

The raw-classifier audit recorded **204 errors in 4,386 completed assessments**, including **181 unsafe approvals**. Those failures remain part of the evidence. The eventual zero-error result does not replace or invalidate them.

The largest supported improvement was the change in responsibility between candidate construction and model assessment. Clearer calendars and calculated facts also helped, but the experiments did not isolate each input change in a controlled ablation. We cannot assign a percentage improvement to any individual prompt edit.

## What entered Decisions in the paired evaluation

The planner reads the resource catalog for the selected operating day, constructs alternatives, and preserves other supplied commitments. A fault or sickness becomes an explicit scenario overlay, so an earlier release record cannot override the current incident.

<picture>
  <source media="(max-width: 600px)" srcset="/docs/operations-planning/pipeline-mobile.svg" />
  <img src="/docs/operations-planning/pipeline.svg" alt="The planner constructs complete alternatives, excludes physically unavailable plans in code, uses Decisions to assess written requirements, then compares only eligible plans. Exclusions and model assessments remain separately reported." loading="lazy" />
</picture>

In that evaluation, each eligibility assessment contained the complete proposed assignments and their supporting evidence. The later tournament receives four main parts:

| Input                  | Example or purpose                                                                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scenario               | The incident, unavailable resource, affected trips, and planning scope.                                                                               |
| Objective              | “Prioritize wheelchair capacity, then prefer fewer changed crew assignments.”                                                                         |
| Operating requirements | Source policies plus the operator's additional written requirements.                                                                                  |
| Alternative plans      | Assignments, effective calendars, retained commitments, resource profiles, capacity comparisons, calculated time gaps, movements, and issued updates. |

The model receives detailed schedules alongside the summaries. Expected evaluation answers never enter its input. Earlier observed outcomes are not silently treated as facts known at an earlier planning time.

### Example: sick crew without losing later duties

In the live 7 October route 235 case, the planner considered 328 proposals. Physical checks excluded 327. Decisions assessed the remaining plan and supported C900 taking five morning trips on V001.

The same bus still had C002's later work. The effective calendar made that distinction explicit.

| Departure | Bus  | Proposed crew | Treatment                       |
| --------- | ---- | ------------- | ------------------------------- |
| 06:00     | V001 | C900          | Replace the sick crew.          |
| 06:40     | V001 | C900          | Replace the sick crew.          |
| 07:24     | V001 | C900          | Replace the sick crew.          |
| 08:12     | V001 | C900          | Replace the sick crew.          |
| 09:00     | V001 | C900          | Replace the sick crew.          |
| 10:20     | V001 | C002          | Retain the existing commitment. |
| 11:40     | V001 | C002          | Retain the existing commitment. |

Identifiers omit the source's `NW-` prefix for readability. Times are Singapore time.

C900's duty is the work assigned to C900, not the entire vehicle's day. This distinction prevents the model from incorrectly attributing C002's later commitments to the relief driver. With one eligible survivor, the planner needed **one eligibility call and zero comparison calls**.

## The tournament compares complete alternatives

The paired evaluation used groups of six eligible plans. Decisions chooses the best remaining plan, then chooses again after that plan is removed. Two plans advance from each group. If more than five survive, the planner groups them again and repeats. It then orders the finalists with the same detailed evidence.

<picture>
  <source media="(max-width: 600px)" srcset="/docs/operations-planning/tournament-mobile.svg" />
  <img src="/docs/operations-planning/tournament.svg" alt="An illustrative tournament starts with two groups of six eligible plans. Each group advances two. The four finalists are ordered, with the last singleton advancing without a comparison call." loading="lazy" />
</picture>

The shortlist can contain fewer than five plans. A lone survivor advances without a call. The tournament never asks a plan to compete with itself.

This is a way to reduce a candidate pool, not a proof of the globally best five plans. Early elimination and grouping can affect which alternatives reach the final round. Repeated grouping seeds in the evaluation test some of that sensitivity.

### Example: a written accessibility rule changes the result

A live onboarding case supplied eight confirmed hypothetical buses, each with two wheelchair spaces and capacity for 128 people. The added requirement was:

> Every affected trip must have at least two wheelchair spaces.

The objective prioritized wheelchair capacity, then fewer changed crew assignments. The run made 18 eligibility assessments and nine comparison calls, producing two recommendations. The original one-wheelchair allocation did not satisfy the added requirement.

Changing the offered buses to **pending checks** produced no qualifying plan under that same requirement. Capacity alone could not substitute for release and registration. No policy-specific application code changed between the two situations.

## What “whole database” means in this evaluation

The database contains 27 tables and 308,628 rows. The network evaluation's projected candidate evidence includes every one of the 6,900 trips, all 1,720 bus-day records, and all 3,272 crew-day records. It spans 10 dates and 36 route directions. The imported-case evidence includes all 40 imported datasets.

That coverage includes proposals rejected before model calls. It does **not** mean that a model assessed every raw row. Each call receives the relevant planning context. Historical observations, duplicate downloads, and unrelated records are not additional confirmed future resources.

It also does not mean that every possible incident or allocation was tested. The network corpus has 876 cases and 5,263 candidate proposals. Availability checks exclude 4,603 proposals before the model assesses the remaining 660. Thirty additional policy and tournament cases run under two grouping seeds, contributing another 420 assessments and 160 comparisons.

## How the earlier paired result compares with Astra

Astra ran after the final Decisions evaluation passed. Both used the same frozen scenarios, candidate pools, policies, objectives, physical checks, and grouping seeds. All 660 paired core eligibility input strings matched byte-for-byte. Different choices can still cause later tournament groups to differ.

| Final measured result                      | Decisions, GPT-6 Luna | Responses, GPT-6 Astra with medium reasoning |
| ------------------------------------------ | --------------------: | -------------------------------------------: |
| Network workflows                          |                   876 |                                          876 |
| Additional policy and tournament workflows |                    60 |                                           60 |
| Eligibility assessments                    |                 1,080 |                                        1,080 |
| Comparison calls                           |                   160 |                                          160 |
| Imported-source assessments                |                    24 |                                           24 |
| Pre-model physical exclusions              |                 4,603 |                                        4,603 |
| Observed errors or failed workflows        |                     0 |                                            0 |

On this final corpus, **both combined pipelines passed**. The results do not establish that Decisions is more accurate than Astra. They also do not establish that either model will make no mistakes on new policies or incidents. The corpus was used during tuning, so it is a regression check rather than an unseen accuracy estimate.

The recorded request-to-response medians were about 0.28 seconds for Decisions core assessments, 0.30 seconds for Decisions tournament-validation calls, and 2.80 seconds across Astra traces. These file-based timings came from overlapping runs with different call mixes. They suggest a latency advantage worth testing, but they are not a controlled speed benchmark or a reliable speedup ratio. No cost comparison was established.

The earliest prototype comparison was less fair. Astra ranked the candidate pool in one call while Decisions used multiple cluster calls, and the workflows applied different final checks. Agreement with Astra was never a ground-truth correctness measure. The final paired pipeline replaced that comparison.

## What the evaluation can and cannot establish

The resulting tool shares one Python planning engine between the application and the evaluation runner. It reads SQLite without modifying it, preserves an audit of model inputs and outputs, and produces draft proposals. It does not dispatch resources or write a new roster.

In the earlier evaluation, whole-block substitutions examined the supplied resource catalog. Sick-crew and depot-fault cases also search per-trip combinations, bounded at 512 additional candidates and 50,000 search nodes. The result discloses a reached bound. The four imported scenarios compare explicit action templates rather than solving arbitrary future rosters.

An in-service fault remains a useful boundary case. Without confirmed positioning time, passenger load, and transfer duration, a complete rescue is unsupported. The current tool identifies that gap. It cannot yet accept those missing rescue facts or an arbitrary incident timestamp and produce a fully specified recovery.

The next useful evaluation is a held-out set of new incidents, policies, and resource combinations. It should test both missed feasible plans and unsafe recommendations. A controlled latency comparison should keep the input, call type, concurrency, and retry policy fixed. Those tests would tell us more than another pass over the tuning corpus.

## Evidence behind the explanation

The saved artifacts retain the final results and the earlier failures:

- [Evaluation results and limitations](https://github.com/DevTK0/openai-fde-bootcamp/blob/cdb9562/apps/web/planner/evals/RESULTS.md).
- [Earlier raw-classifier failures](https://github.com/DevTK0/openai-fde-bootcamp/blob/cdb9562/apps/web/planner/evals/raw-classifier-failures.json).
- [Paired benchmark results and descriptive timings](https://github.com/DevTK0/openai-fde-bootcamp/blob/cdb9562/apps/web/planner/evals/benchmark-summary.json).
- [Projected source coverage](https://github.com/DevTK0/openai-fde-bootcamp/blob/cdb9562/apps/web/planner/evals/projected-coverage.json).
- [Live scenario verification](https://github.com/DevTK0/openai-fde-bootcamp/blob/cdb9562/apps/web/planner/evals/ui-verification.json).
- [Shared engine and tournament](https://github.com/DevTK0/openai-fde-bootcamp/blob/cdb9562/apps/web/planner/engine.py).

The [planner guide](https://github.com/DevTK0/openai-fde-bootcamp/blob/cdb9562/apps/web/planner/README.md) documents the reproducible evaluation commands. A packaged replay matched 1,240 saved Decisions requests across the 936 network, policy, and tournament workflows. Replay verifies implementation consistency with those recorded calls; it is not another live accuracy experiment.
