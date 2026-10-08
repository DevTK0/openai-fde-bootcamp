# Service planning integration brief

Status: adapted into the main application in one PR. See [integration behavior and verification](service-planning-integration.md). Operating policy defaults remain proposed.

## Purpose

Help a planner identify a service problem, inspect its dated evidence, understand when it happened, and review possible interventions.

The `kuma` prototype at commit `f6434e1` is a behavioral reference. Its application code and generated datasets are outside this integration. The production replay is rendered programmatically; fixed Blender examples are not included. The original comparison used remote main at `61a465d`; the implementation follows current main.

The production work belongs in the existing dashboard and domain workspaces. It must use the current application data and shared UI conventions. The workspace comparison and existing capabilities are documented in the integration reference.

## Integration scope

The following behaviors are adapted together in one PR against main, per the revised delivery scope. Domain checks and application verification cover each workflow.

1. Add an explainable service watchlist and supporting evidence. Include peak queues, the share of observed boarding-stop positions with queues, and observation coverage.
2. Add candidate buses for reassignment. Explain the available window, supporting evidence, and remaining feasibility checks.
3. Add a service timeline and replay where they improve investigation. Preserve the selected service, date, and planning assumptions.

Blender videos support demonstrations. Timeline & replay includes fixed examples for services 132 and 159 on 7 October, separate from the current database replay. Generating or synchronizing new renders remains deferred.

## Watchlist acceptance criteria

- A planner can identify a service needing attention and inspect the dated records behind each flag.
- Departure delays, remaining queues, and service-linked maintenance holds have distinct explanations.
- Threshold changes update both the priority and its explanation consistently.
- The prototype's five-minute delay and 30-person queue thresholds remain proposed defaults until validated against operating policy.
- Repeated observations at one route position do not inflate the share of affected stops. Directions and repeated route positions remain distinct.
- Missing observations remain unknown. The view exposes observation coverage and does not imply that unobserved stops have no queue.
- The interface identifies synthetic or historical evidence and the observation window.

## Availability acceptance criteria

- Low utilization alone does not qualify a bus for reassignment.
- A candidate has evidence of release, location, completed turnaround, and a task-free window.
- Crew qualification, location, availability, protected breaks, and existing duties constrain the candidate list.
- A crew member cannot support conflicting candidate assignments.
- The view distinguishes a short available window from feasibility for a complete additional journey.
- Missing readiness or crew evidence prevents an affirmative availability claim.
- Candidate review does not issue dispatch changes.

## Replay acceptance criteria

- A planner can inspect departures and queue observations over the selected time window.
- The timeline preserves the service, date, and thresholds used in the watchlist.
- Any animated bus stays at a stop during its recorded dwell. Estimated movement between observations is labeled.
- Queues use the last known observation at or before the selected time. The view shows the observation time and age.
- The replay preserves the difference between an observed zero and an unknown queue.
- The replay does not imply live GPS, street geometry, or continuously measured passenger demand.
- Moving buses are included only when they explain an operational question better than a timeline alone.

## Policy decisions

The comparison with main is complete. The planner enters through Planning, then Service planning. The integration reference records the source records, existing capabilities, and remaining limits.

Outstanding product decisions include priority policy, observation windows, stale-data treatment, and the required feasibility horizon for reassignment. Prototype defaults are assumptions rather than approved operating policy.

## Verification gates

Each implementation PR requires `pnpm check` and task-specific verification in the running application. Behavioral checks must cover threshold boundaries, incomplete evidence, and the distinction between unknown and zero values.

The watchlist gate is a complete investigation of a flagged service using dated evidence. The availability gate includes conflicting duties and missing crew evidence. The replay gate compares displayed states with recorded events at known times.

This brief does not authorize deployment, dispatch changes, or merging. Keep `kuma` available as the prototype reference throughout implementation.
