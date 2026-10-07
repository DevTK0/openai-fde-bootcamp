# Operations planner

The `/ops-planning` page drafts bus and crew substitutions against the current SQLite database. It supports new buses, new crew, sick crew, depot faults, and in-service faults. Four imported scenarios cover maintenance, festival allocation, evening relief, and Engineering history.

## Run the tool

Use the repository's Node and pnpm versions and Python 3. The planner has no third-party Python dependencies.

Set `OPENAI_API_KEY` in the server environment, or set `OPENAI_ENV_FILE` to a local file containing `OPENAI_API_KEY=...`. Keep that file outside tracked source. The server never sends the key to the browser or saves it in evidence.

Run `pnpm --filter web dev` from the repository root. Open the printed preview URL at `/ops-planning`. The sidebar also links to the planner.

Choose the situation, date, route, and target bus. For onboarding, enter up to eight new resource IDs and their confirmed or pending status. Add written requirements and a ranking objective, then select **Compare plans**. Read each proposal's complete supplied calendar before using it. **Download run evidence** includes the inputs, exclusions, API requests, responses, and report.

`DASHBOARD_DATABASE_PATH` selects another compatible SQLite database. `PYTHON_BIN` selects the Python executable. `OPS_PLANNING_RUNS_DIR` selects the audit directory, which defaults to `apps/web/.ops-planning`.

## Planning behavior

The Python engine reads the full resource catalog for the selected operating day. It keeps future commitments and projects the complete schedules of every directly assigned resource into each assessment. It supplies original capacities, qualifications, issued updates, movements, and plain-text policies. Future observed outcomes do not enter advance planning.

Physical availability checks exclude held, absent, unqualified, overlapping, under-capacity, and out-of-window assignments before model calls. The report distinguishes these exclusions from model assessments. Decisions interprets the remaining written requirements and classifies each proposal. Eligible plans enter groups of six. Two advance from each group, and regrouping continues until at most five remain. Decisions orders those finalists. A singleton advances without an API call.

The shared engine powers the UI and frozen evaluation runner. Evaluation labels are stored only in the evaluation corpus and never enter model requests. Request hashes protect the saved replay from accidental prompt changes.

Each request has a separate run directory. Cancellation stops its Python process. SQLite opens in read-only mode. Recommendations do not update rosters or dispatch resources. Failed or refused API responses fail the run instead of fabricating recommendations.

## Scope and limits

The source contains 27 tables and 308,628 rows. The catalog includes 6,900 trips, 172 buses, 3,272 crew-day records, 10 dates, 36 route directions, and 40 imported datasets. A single model call receives the relevant evidence, not every raw database row. Historical datasets and duplicated downloads are not extra future availability.

Network scenarios use the first supplied duty for the selected target and a hypothetical incident overlay. The tool does not yet accept arbitrary incident timestamps or confirmed rescue travel, transfer, and passenger facts. In-service scenarios therefore expose missing recovery evidence rather than invent a rescue departure.

Whole-block substitutions examine the source resource catalog. Sick-crew and depot-fault cases also search per-trip combinations, capped at 512 additional candidates and 50,000 search nodes. Search bounds appear in the report. This is not exhaustive enumeration of every possible allocation. Onboarding profiles inherit a source staging location and declare no other commitments within the entered window. Their confirmation is a scenario assumption, not an external registration check.

Imported scenarios compare six explicit action templates against live source records. They do not solve arbitrary future roster optimization. Conditional allocations retain their release conditions.

The UI currently supports additions only in onboarding scenarios. It does not combine new resource registration with a disruption in one request.

## Verify and evaluate

Run the repository checks with `pnpm check`. The planner tests exercise real database coverage, C900 relief, retained commitments and takeover time, pending resources, duplicate IDs, and singleton advancement.

Replay all frozen workflows without API calls from the repository root:

```sh
python3 apps/web/planner/evals/run.py --output /tmp/planner-replay
```

Use a fresh output directory for each run. To make live Decisions calls, configure the key and add `--live`. `--limit 10` runs a network smoke subset plus all four handout cases. For a paired Astra benchmark after a complete live Decisions pass:

```sh
python3 apps/web/planner/evals/run.py --astra --decisions-gate /tmp/decisions-run/summary.json --output /tmp/astra-run
```

The Astra adapter uses Responses with `gpt-6-astra` and medium reasoning. Decisions uses `gpt-6-luna`. Both use the same evidence, options, objectives, availability checks, and grouping seeds. Different selections can change later tournament groups.

See [evaluation results](evals/RESULTS.md) for measured results and limitations.

`evals/verify-live.mjs` drives the live UI with Playwright and makes paid Decisions calls. Pass `--url` with the preview origin and, if Playwright is outside the workspace, pass `--playwright` with its installed module entry. Its default report path is `/tmp/planning-ui-verification.json`. Use the native collaborative preview when it is available; this script is the fallback for a headless environment.

API contracts follow the official [Decisions reference](https://developers.openai.com/api/reference/resources/decisions/methods/create) and [Astra model reference](https://developers.openai.com/api/docs/models/gpt-6-astra).
