# LionLink planning MVP

The local `/planner` workspace connects the supplied fictional operations
snapshot to a deterministic candidate engine, an OpenAI explanation copilot,
a public LTA arrivals panel, and persisted exercise decisions.

## Run

From the repository root, run `pnpm --filter web dev`. Open the printed URL
followed by `/planner`. Use Node 22.12+ and the repository's pnpm version.
Production verification uses `pnpm check` and `pnpm build`; start the web build
with `pnpm --filter web start`. If the execution environment blocks Turbopack
worker ports, use `pnpm --filter web exec next build --webpack` for the web
production build. The existing Google Fonts setup requires network access
at build time.

Provider credentials stay on the server. Set `OPENAI_API_KEY` and `LTA_API_KEY`
in `apps/.env` or the process environment. Restart after changing credentials.
`OPENAI_MODEL` optionally overrides the default `gpt-5.4-mini`. The server also
accepts `LTA_DATAMALL_API_KEY`, `LTA_ACCOUNT_KEY`, or `DATAMALL_API_KEY`. Do not
use `NEXT_PUBLIC_` for these credentials. Missing or unavailable providers leave
manual comparison, evidence inspection, and proposal review usable.

## Demo workflow

1. Select Service 235, 7 October, and Decision-time planning. The snapshot ends
   at 05:49:59 SGT, before the 05:50 instruction. Compare published assignments
   against the listed C900 relief crew; future actual timings are withheld.
2. Review the assignment timeline, resource conflicts, narrow turnaround margin,
   and source evidence. Ask the copilot to explain the selected plan and risks.
3. Save the candidate. Open Saved decisions, enter a review note, and approve
   the exercise plan or reject it. Infeasible and conditional plans cannot be
   approved. Reload to verify persistence.
4. Switch to Retrospective replay to inspect the recorded 05:50 recovery
   instruction. Replay observations do not establish a causal AI benefit.
5. Select Service 238 to compare the published 07:30 trip with fixed five-minute
   earlier/later alternatives. Retrospective FIFO boarding replay must reconcile
   the supplied origin observations before waiting metrics are shown.
6. Inspect live public service arrivals at stop 52009. Their retrieval time is
   independent of the exercise date, and load categories are not exact counts.

## Implemented vertical slices

- Scenario fixtures with checksums, issued-time admission, stable evidence IDs,
  and decision-time redaction. Service 235 recovery covers 7 and 14 October;
  Service 238 covers all ten supplied dates.
- Fixed candidate generation with resource release, location, qualification,
  duty/break windows, later commitments, turnaround, route coverage, protected
  trips, and timetable checks. Unknown release or location yields a conditional
  result. Candidate warnings explain model assumptions and narrow slack.
- Origin FIFO replay for retrospective timetable comparison. Prospective demand
  and future running outcomes remain unevaluated.
- Server-side OpenAI Responses with scoped, validated read-only tools, bounded
  calls/tokens/time, and manual fallback. The copilot cannot approve or dispatch.
- LTA v3 BusArrival integration with a 20-second cache, timeout, normalized
  arrival/load fields, and explicit offline/empty/stale states.
- SQLite proposal persistence, version checks, source-snapshot checks,
  request-bound idempotency, and append-only audit events.

## Persistence and boundaries

The database defaults to `apps/web/.local/planning.sqlite`, outside build output
and ignored by Git. Set `PLANNING_DB_PATH` to a durable absolute path for a
server deployment. Builds do not remove saved proposals. Audit events record
exercise decisions under the local planner actor; there is no authenticated
identity or operator dispatch integration.

This is a private bootcamp prototype. It generates a small, documented candidate
set rather than a global fleet optimizer. Full-network demand prediction,
downstream queue simulation, workshop scheduling, and services 132/159 are
later scope. DataMall does not join real buses to fictional LionLink resources.
The API has per-request provider budgets but no per-user rate limit; do not
expose it publicly before adding authentication and cost controls.
