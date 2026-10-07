# Service planning in Planning

The service planner adapts the behavior of `kuma` at `f6434e1` into the existing dashboard. It reads the current SQLite database and uses shared UI components. The watchlist, candidate review, and timeline replay ship together in one PR. The standalone prototype remains unchanged. The interactive Three.js visualization is embedded in Timeline & replay and shares its selected service, date, observation window and cursor.

## Planner workflow

Expand **Planning** in the sidebar, then select **Service optimisation**. Maintenance history is under **Maintenance**. Raw workshop records are under **Data**. Choose a date and service, adjust the planning assumptions, and select **Apply assumptions**. Select a service in the watchlist to inspect its dated departures, queue observations, and linked maintenance holds. The detail tabs contain candidate windows and timeline replay. Tables support search, export, and full record inspection, with no record mutation controls.

The URL preserves the service, date, observation window, thresholds, review horizon, and detail tab. For example, `/dashboard?view=service-planning&date=2026-10-07&service=132&queue=30&delay=5` opens that investigation directly. Replay starts at the window start when reopened.

See [replay data provenance](replay-data-lineage.md) for the comparison with the original source files and prototype snapshot.

## Data and policy

The watchlist groups queue observations by route ID and route position. Repeated visits count once. Directions and repeated positions of the same physical stop remain distinct. The final position is alighting-only. Coverage is observed boarding positions divided by all boarding positions in the supplied route sequence. Queue share is positions with any positive observation divided by observed positions. A missing observation is unknown. An observed zero remains zero.

Peak queues and replay use `stop_calls.boarding_cutoff_at` as the observation time. Departure flags compare actual and scheduled departure timestamps. The window selects actual departures and queue observations inclusively. Scheduled departure counts are shown separately because late trips can cross window boundaries.

The proposed priority policy uses delay at least five minutes, peak queue at least 30 people, and overlapping service-linked maintenance holds. Two or more triggers yield Critical; one yields High. No observed trigger is not a claim that unobserved conditions are healthy. Changing thresholds recalculates both reasons and priority through the same function. Existing Operations reliability metrics retain their separately labeled greater-than-five-minute measure.

Maintenance joins the operating fleet's recorded service assignment to dated repair and servicing records. Unassigned workshop vehicles cannot flag a service. The handout maintenance history is a selected extract, not complete coverage. Its timestamps without an offset are interpreted as Singapore time.

Candidate review considers the operating vehicle roster, readiness issued by the decision time, complete trip and terminal-movement timings, turnaround, location, qualified crew, crew availability, takeover, protected breaks, duty span, and recorded future tasks. A candidate must already be at an origin of the receiving service. Missing evidence prevents an affirmative result. A completed vehicle task is required to establish turnaround. Each list uses a crew member once. A different service review is an alternative scenario, not a simultaneous reservation.

The implementation uses the supplied exercise turnaround conventions: 45 seconds final alighting, 420 seconds turnaround, 120 seconds boarding after terminal movement, and at least 300 seconds for crew takeover. The crew record supplies its maximum duty span. These are exercise assumptions, not approved operating policy. Candidate windows end at the earliest recorded resource limit, next task, future maintenance hold, protected break, or duty limit. The default requested window is 30 minutes. Full additional-journey feasibility remains a separate planner check.

All outputs are retrospective synthetic evidence. Future actual task timings constrain the review; this is not an at-the-time dispatch simulation. No dispatch changes are issued. Replay shows recorded dwell and explicitly estimated between-stop states. Replay retains bus-state evidence and a departure timeline; the reconstructed queue-state table is omitted. The visualization uses LTA road geometry for every service in the database, with OpenStreetMap roads and buildings. It reads boarding and alighting counts from the existing report, alongside remaining queues. Fading icon/count strips represent recorded departure events, not live demand. The map and evidence tables share one cursor, with 5× default playback and 1×, 15× and 60× options. The renderer builds routes from current database stops without a service allowlist. Missing or disconnected road geometry uses labeled direct estimates; missing stop coordinates remain unplaced. The earlier standalone prototype page and independent controls are removed. See [map sources and regeneration](../../scripts/service-replay/README.md).

## Architecture decision

`ServicePlanning` requests `/api/service-planning` with the selected assumptions. The endpoint validates them and calls `getPlanningReport(selection, signal)`. The database worker reads source tables in one SQLite transaction. `buildPlanningReport(data, selection)` produces the watchlist, candidate decisions, and selected-service events. `replayAt(detail, cursor)` derives queue and vehicle states without fetching again on each playback tick.

The domain model distinguishes supported candidates from unavailable or unknown reviews. Nullable observations preserve the difference between missing evidence and zero. Zod schemas validate database rows and API responses. The UI uses the existing report-mode `DatasetTable`, `Pick`, cards, buttons, inputs, badges, and tabs.

Two structures were considered. Sending every service's raw events to the browser would allow local recalculation but expose fleet-wide joins and large payloads to the frontend. The chosen server report keeps SQLite queries and candidate policy together and returns only the selected service's replay events. Threshold changes make another request in exchange for current database evidence. No generated prototype data or second database is introduced.

Operating priority policy, stale-data treatment, observation windows, and the full-journey feasibility horizon still require product validation. These are exposed or labeled assumptions rather than silently approved defaults.

## Verification

Use the repository's Node 24.21.0 and pnpm 12.9.1. Run `pnpm check` from the root. For focused checks, run:

```bash
pnpm --filter web exec vitest run __tests__/service-planning.test.ts __tests__/service-planning-query.test.ts __tests__/dashboard.test.tsx
```

The domain tests cover inclusive thresholds, route-position deduplication, missing versus zero observations, time windows, service-linked holds, future and missing readiness, unique crew, conflicting tasks, breaks, incomplete timing, turnaround, and replay dwell. Database tests use an isolated SQLite copy and verify that changed queues and removed crew evidence change the report. Dashboard tests investigate service 132, raise its queue threshold, inspect candidates, and compare recorded dwell and queue zero with unknown positions.

In the running app, inspect service 132 on 7 October. At default assumptions its peak queue is 43 and it has two flagged departures. Raising the queue threshold to 44 leaves the departure trigger and changes Critical to High. At replay time 06:03:36, call `NW-20261007-0009-01` records a queue of zero and bus `NW-V009` remains at position 1 until 06:03:41. At 06:04:00 its between-stop state is labeled estimated. Before that queue observation, its value is unknown.

### Queue observation visual

Operations / Passenger queues shows queue observations as selectable dots by route position and recorded time, replacing the queue-hotspots table. Choose one operating date. The page service filter controls the summary; the visual has its own Service and Direction selectors. Service optimisation links to Passenger queues with the service, date, window and queue threshold preserved. Directions and repeated stop positions stay separate. Dot size indicates the remaining queue; threshold-meeting counts are red, observed zeroes are hollow and unknown counts display a question mark. Positions without observations remain visible. Counts use boarding cutoff timestamps. The visual fits its time axis to the dated observations across the selected date. The red highlight uses the proposed 30-person threshold. No movement or demand is interpolated.

Selecting a dot opens the source call ID, vehicle, trip, observation time, boarded, alighted and remaining counts. The chart has sticky stop labels and a sticky time axis, with scrolling contained within it. Other analysis tables and the existing replay remain unchanged. The view reuses the dated service-history API for its stop-call evidence. The rejected prototype alternatives are not integrated.

`queue-observations.test.tsx` verifies exact time/threshold boundaries, zero versus unknown, absent evidence, repeated stop positions, direction changes, keyboard selection, and removal of stale selected records after a refresh.

### Compact investigation

Service optimisation keeps the service watchlist and supported candidate comparison as tables. Flagged departures, service-linked maintenance holds and other vehicle reviews open in record drawers. The replay has optional bus-state and departure-record drawers instead of duplicate tables; recorded dwell and estimated movement remain distinguishable. Missing values display Unknown. Source tables remain in Data.
