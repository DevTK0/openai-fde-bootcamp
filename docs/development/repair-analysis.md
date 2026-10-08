# Manual repair analysis

Open **Fleet > Vehicle register**, select a date and vehicle, then select
**Analyze a reported fault**. Describe the symptom and select **Analyze fault**.
The dialog shows possible causes, diagnostic checks, follow-up questions,
supported repair areas on a 3D bus, and planned trips to review. Select an evidence
link to focus the original report or maintenance record. Select a trip to return
to its assignment details.

The report and the selected vehicle's evidence are sent to OpenAI only on
submission. Closing the dialog or refreshing discards the report and result.
Editing the report clears the previous analysis. Cancel stops waiting for the
request; it cannot guarantee cancellation of provider billing.

## Evidence and interpretation

The server reads the existing vehicle planning snapshot. It includes work orders
from workshop records and the repair handout, readiness, and maintenance holds.
Orders opened after the selected date are excluded. Undated orders remain, and
findings or updates can postdate the selected date. This is a supplied snapshot,
not a reconstruction of what an operator knew at that time.

The operator report remains unverified. Model hypotheses cite the report or
records, while engineering findings remain in the source evidence. The server
rejects citations outside that vehicle's supplied evidence and unsupported repair
area IDs. Citation validation establishes that the source exists, not that a
model's explanation follows from it. Engineering review remains necessary.

The application computes planned assignments and hold overlaps using
`vehicleRows`. It shows every scheduled trip for the vehicle on the selected day,
including other services. Trips without a timed hold overlap are review items,
not confirmed disruptions. A report does not create a hold. Estimated completion
does not release a vehicle. Missing timing or maintenance evidence cannot
establish availability.

The double-deck model is illustrative even for single-deck vehicles. Cooling,
electrical, pneumatic, brake, and suspension highlights show approximate system
areas. They do not locate internal defects. Text descriptions remain available
when WebGL or the model asset cannot load.

## Server configuration

Set `OPENAI_API_KEY` in `apps/web/.env`. `REPAIR_ANALYSIS_MODEL` defaults to
`gpt-5.6-terra`. The key stays on the server. Analysis uses the Responses API with
`store: false`, a structured output schema, and a 90-second request timeout. The
app does not retry automatically or persist investigations. Each server process
admits at most two concurrent requests and six requests per minute across all
visitors, regardless of forwarded client addresses. Excess requests return 429.
Bodies over 32 KiB are rejected before JSON parsing. These bounds limit accidental
quota consumption; they do not authenticate visitors. The preview relies on its
private hosting access controls. A public or multi-instance deployment needs
authentication and a shared quota policy at its gateway. The endpoint checks
request origin, including the application's forwarded preview host.

## Design choice

A request-scoped dialog keeps one report, one evidence snapshot, and one answer
together. A saved investigation with polling would add persistence, stale-version
handling, and a worker lifecycle. Those are unnecessary for this manual flow.
The existing maintenance panel supplies vehicle selection, so there is no second
fleet picker to keep synchronized. The analysis module owns evidence selection,
provider transport, and citation checks behind `analyzeRepair(request, signal)`.
The UI state is idle, pending, error, or complete.

The schema in `apps/web/lib/repairs/schema.ts` owns analysis fields and legal area
IDs. The route validates external input; the server fetches evidence rather than
trusting records supplied by the browser. No event subscriptions, record writes,
dispatch, or release actions run as part of an investigation.

## Verification

Run `pnpm check` for all checks. The repair tests exercise the real POST handler
and SQLite records with a fixture provider. They cover vehicle isolation, future
orders, missing records, invalid citations, unsupported areas, provider errors,
manual submission, retries, cancellation, and stale-result removal. The model test
checks actual highlightable geometry for every mapped area.

For browser proof, install Playwright in a scratch directory or use an existing
installation. Start the app with `pnpm --filter web dev`, then run:

```bash
node apps/web/scripts/verify-repairs.mjs \
  --playwright /absolute/path/to/playwright/index.mjs \
  --url http://127.0.0.1:PORT
```

This uses a fixture response and checks the real panel, model, evidence links,
manual trigger, desktop and mobile layouts, reusing the loaded model, and clearing
results on edits.
Pass `--live` to submit one real report through the server instead. This
requires a configured API key and incurs a provider request. Screenshots and the
returned analysis are saved to `.audit/repair-browser` by default.

For live model review, also try a warm saloon report for NW-V020 and an unrelated
passenger-crowding report. Check that historical repairs remain distinct from
current hypotheses, the unrelated report gets clarification rather than invented
mechanical causes, and no answer claims engineering clearance.
