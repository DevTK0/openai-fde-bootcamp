# Operations planner

The `/ops-planning` page compares complete route, bus and crew recovery plans against the current SQLite database. It offers three hypothetical disruptions using existing resources, without adding spares.

| Situation | Withdrawal | Services |
| --- | --- | --- |
| Toa Payoh bus withdrawal | NW-V001 after its current trip | 231, 232, 235, 238 |
| Ang Mo Kio bus withdrawal | NW-V031 after its current trip | 261, 262, 269 |
| Toa Payoh relief crew sickness | NW-C062 before relief duty | 231, 232, 235, 238 |

All presets use 5 October 2026 at 09:25 Singapore time. They generate 36 complete allocations across 29, 27 and 29 future trips respectively. Earlier and outside-service commitments remain assigned.

## Run the tool

Use the repository's Node and pnpm versions and Python 3 on a Unix-compatible runtime. The planner has no third-party Python dependencies.

1. Set `OPENAI_API_KEY` in the server environment, or set `OPENAI_ENV_FILE` to a local file containing `OPENAI_API_KEY=...`. Keep that file outside tracked source. The server never sends this key to the browser or saves it in evidence.
2. Set a separate, high-entropy `OPS_PLANNING_ACCESS_KEY` for operator access.
3. Run `pnpm --filter web dev` from the repository root. Open the printed HTTPS preview URL at `/ops-planning`.
4. Choose a situation and enter the operator key in **Planner access key**. The server issues a signed, expiring HttpOnly session cookie. This demo grants one operator capability access to all runs, not per-user ownership.
5. Optionally add written requirements or change the ranking objective. Select **Compare plans**.
6. Use each recommendation's coordinated timeline to inspect its route, bus and crew schedules together. Click a trip to select it across all three rows and see assignment changes and exact times. Purple blocks are recommended reassignments; grey blocks are existing duties. A separate outline marks the selected trip. Overlapping route trips occupy lanes under one route label. Protected breaks are hatched. The default view retains the earlier and later duties of resources involved in changes; **Show full plan** reveals all supplied resource calendars. Route rows show those resources' trips, not the entire service timetable. Use **View complete assignment table** for every affected trip. Read the complete supplied calendar before using the plan. **Download run evidence** includes inputs, exclusions, API requests, responses and the report.

`DASHBOARD_DATABASE_PATH` selects another compatible SQLite database. `PYTHON_BIN` selects the Python executable. `OPS_PLANNING_RUNS_DIR` selects the writable audit directory, which defaults to `apps/web/.ops-planning`.

## Planning behavior

The engine considers all 172 buses and 327 crew profiles for the preset day. A bounded search constructs 36 distinct complete allocations while checking resource availability, capacity, qualifications, task timing and retained commitments. This is not exhaustive allocation search.

Decisions assesses each written requirement using the relevant facts. Release, qualification, capacity and availability checks operate on one resource at a time. Identical policy inputs reuse a verdict within the run. The UI reports policy calls separately from cached checks and distinct plans.

Eligible plans enter groups of three. One advances from each group, leaving 12 survivors and then four finalists. Decisions orders the finalists. With 36 eligible entrants, this makes 19 comparison calls. Singletons advance without an API call. The default objective minimizes changed crew assignments, then changed bus assignments. A custom objective receives the full comparison evidence.

Each request has a separate audit directory. Only one web-triggered worker may run at a time. Cancellation stops it, and the server enforces a ten-minute timeout. SQLite opens read-only. Recommendations do not update rosters or dispatch resources. Failed or refused API responses fail the run instead of fabricating recommendations.

## Scope and limits

The database contains 27 tables and 308,628 rows, including 6,900 trips, 172 buses, 3,272 crew-day records, 10 dates, 36 route directions and 40 imported datasets. A model call receives relevant evidence, not every raw row. Historical observations and duplicated downloads do not create future availability.

The UI uses the three fixed exercises above. It does not accept arbitrary incident times or confirmed roadside rescue facts. Withdrawn buses complete their current trip. Crew retain their service qualifications, while buses may move between the selected services when their commitments allow it.

The older onboarding, individual disruption and imported-handout scenarios remain available through the API and historical evaluation corpus. They are not current UI controls. Their prior Astra comparison does not establish Astra performance on the new coordinated scenarios.

The six final coordinated trials and eight direct policy controls passed. These cases were used during tuning. Zero observed errors on them does not establish universal correctness. The shortlist is not guaranteed to contain every globally best allocation. See [the delivery record](DELIVERY.md) for the tuning history, timings, evidence and limitations.

## Verify and evaluate

Run `pnpm check` for repository checks. Replay the current coordinated trials and controls without API calls:

```sh
python3 apps/web/planner/evals/replay_coordinated.py
```

For new paid Decisions trials, use fresh output directories and configure the OpenAI key:

```sh
python3 apps/web/planner/evals/coordinated_trials.py --live --seed 71 --output /tmp/new-coordinated-trials
python3 apps/web/planner/evals/coordinated_controls.py --output /tmp/new-coordinated-controls
```

`evals/verify-live.mjs` drives all three current presets and makes paid Decisions calls. It checks 36 actual entrants, 19 comparisons, four recommendations, cookie-only session reuse, audit access, cancellation and mobile layout. Pass the preview origin with `--url`. Set `OPS_PLANNING_ACCESS_KEY` or supply its local env-file path with `--env-file`. If Playwright is outside the workspace, pass its installed module entry with `--playwright`. The default report path is `/tmp/planning-ui-verification.json`. Use the native collaborative preview when available; this script is the fallback for a headless environment.

Replay the older 936-workflow corpus without API calls:

```sh
python3 apps/web/planner/evals/run.py --output /tmp/planner-replay
```

The historical runner supports `--live`, or `--astra --decisions-gate /path/to/live-decisions-summary.json`. That Astra adapter uses Responses with `gpt-6-astra` and medium reasoning. Decisions uses `gpt-6-luna`. See [historical evaluation results](evals/RESULTS.md) for the older comparison. The coordinated runner currently evaluates Decisions only.

API contracts follow the official [Decisions reference](https://developers.openai.com/api/reference/resources/decisions/methods/create) and [Astra model reference](https://developers.openai.com/api/docs/models/gpt-6-astra).
