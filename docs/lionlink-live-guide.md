# OpenAI operations planning agent

Open `/live` for database-driven planner insights. OpenAI investigates the
observations and chooses recommendations. The application supplies read-only
context tools and checks proposed resource assignments; it does not select a
recommendation from coded thresholds or a preset candidate list. The earlier
rule-based live recommendation modules have been removed.

## Run the prototype

From the repository root, use two terminals:

```sh
pnpm --filter web dev
pnpm --filter web monitor
```

Both processes must use the same `PLANNING_DB_PATH`, which defaults to
`apps/web/.local/planning.sqlite`. The first worker run indexes the operational
records from `data/operations/lionlink-network.sqlite` into `ops_records`. Imports
preserve source IDs, repeated route-stop occurrences and distinct service
patterns. Later domain-workspace database edits refresh changed context and queue
an assessment for affected services. The planning database survives browser reloads
and app builds. SQLite is local single-instance storage; a deployed worker needs
a process supervisor and durable storage.

Configure `OPENAI_API_KEY` and optionally `OPENAI_MODEL` in `apps/.env`. Credentials
stay on the server. The current configured default is `gpt-6-luna`. The agent has
been enabled in this workspace at the user's request. A new database starts with
it disabled; **Configure OpenAI agent** enables it. When disabled, records remain
queued; no coded recommendation takes its place. **Ask agent to reassess** creates
an analysis request without duplicating a complaint or queue observation.

For a production preview, build and start the web app. In restricted environments
use `pnpm --filter web exec next build --webpack`, then `pnpm --filter web start`
and the same monitor command.

## What triggers an investigation

The worker scans every two seconds, even with the browser closed. New
`live_events` records trigger an assessment. Inserts/updates of `ops_records`
also enter a change inbox; the worker converts them to analysis requests, grouping
bursts by service/date. Imported bootstrap data does not generate thousands of
requests. Source changes carrying a service ID trigger that service; unscoped shared-fleet
changes reassess services with committed reports. All source services remain
available as network context.

Connected browsers receive server-sent updates approximately once per second.
The trace shows progress during model queries. Model investigations take longer
than the database scan and are processed sequentially. A burst queues behind the
current investigation. Starts are spaced by at least five seconds; each assessment
is bounded to eight Responses API requests, eighteen tool calls, 4,200 output tokens
per request and a 120-second overall API investigation budget. A 45-second
per-request timeout can end an investigation earlier. Token usage is stored in
its trace. This is an event-driven planning copilot, not a hard real-time dispatcher.

A database lease prevents duplicate workers. Crashed in-flight work is reclaimable
after 60 seconds; a running worker renews its lease. Invalid input and failed API
runs remain visible. There is no automatic rule-based fallback. Request a fresh
assessment after resolving an error. Reviewed/superseded recommendations and their
original evidence remain in history.

## Agent context and tools

The agent can choose these tools:

- `get_service_schedule`: upcoming departures, full-route patterns, fleet/driver
  records and the complete protected commitments on those resource blocks in a
  focused planning view. It supplies context rather than selected interventions.

- `get_operating_history`: up to fourteen days of observed departures, delay
  summaries, queue hotspots and delayed-trip examples, with partial-day coverage.
- `read_operational_records`: filtered and paged SQLite records from trips,
  routes, service patterns, stops, fleet inventory, readiness, duties, resource
  updates, workshop records, planning constraints and passenger observations.
- `read_recent_events`: complaints, delay/queue observations and network fault
  reports. Active faults persist until a newer Engineering clearance, even if
  the original fault is older than the general history window.
- `find_resources`: origin/time-matched fleet and qualified driver records,
  capacity, fault holds and overlapping published commitments. These are options,
  not automatically selected assignments.
- `validate_assignment_plan`: validate the agent's own exact trip/resource changes.
  Existing trip IDs replace assignments; `EXTRA-` IDs add full-route trips.
- `get_live_arrivals`: current public LTA DataMall arrival/load estimates, explicitly
  separate from the dated exercise context and local fleet identity.

The model can investigate repeated delays or crowding, propose a frequency/timing
change, identify a specific bus/driver pairing, compare cover or reallocation
options, or explain precisely which evidence prevents a supported allocation.
An initially blocked allocation prompts investigation of another intervention
within the remaining budget. Availability is not fabricated to make a plan look
complete.

The source dataset is fictional and dated. Its readiness does not establish
current real fleet availability. Singapore service dates are handled independently
of UTC dates. Tool reads are bounded to the assessment's event-time watermark and
known live-event delivery sequence. Each investigation holds a SQLite read
snapshot so concurrent context updates cannot silently change facts between its
tool calls; they trigger a new queued assessment instead. Future actual
departures/arrivals are withheld. Historical
queue snapshots are never summed into distinct passengers. The model must cite
returned evidence IDs; unsupported citations or blocked final proposal references
are rejected and sent back for correction. A citation confirms retrieval, not a
formal proof of every narrative inference; controllers still review the reasoning.

Assignment checks cover known resource IDs, Engineering holds, release/readiness
windows, route qualification, driver duty/break limits, location, full route
running time, protected network commitments and turnaround. Proposed assignments
cannot modify a trip already observed departing. No proposal dispatches a bus or
changes a timetable; acknowledgement records a versioned human review only.

## Insert observations directly

Start the monitor once to create the schema. Use **Record event**, or insert:

```sh
python3 - <<'PY'
import sqlite3
with sqlite3.connect('apps/web/.local/planning.sqlite') as db:
    db.execute('''INSERT INTO live_events
      (kind, service, service_date, title, details, occurred_at)
      VALUES (?, ?, ?, ?, ?, ?)''',
      ('observation', 'network', '2026-10-07', 'Driver reports a brake warning',
       'NW-V001 on service 235 reports a brake warning. Where can we get cover?',
       '2026-10-07T05:49:00+08:00'))
PY
```

Human reports use `kind=observation`: a raw-record envelope, not a signal classification.
The form and free-text API do not request a signal type. `interpret_observation`
lets OpenAI identify multiple signals, infer a service and extract only stated IDs
and measurements. The original text stays immutable; interpretation is persisted
with the decision and displayed in the trace. Inferred faults also block resource
assignments on later assessments. An inferred clearance cannot release a bus.

The service catalogue comes from database route records (currently 24 services),
plus committed service reports. `network` means no service hint was provided.
Readiness/duty coverage is richer for some services than others.

Structured telemetry adapters still support `complaint`, `fault`, `delay`,
`crowding`, `clearance`, and `analysis`.
Fault/clearance records require a vehicle; clearance requires `source='engineering'`.
Delays require integer `delay_seconds`; crowding requires integer `waiting_people`.
Observation timestamps must belong to the Singapore service date. `id`, `seq` and
receipt time are generated automatically. Events/reviews are append-only; insert
corrections or new observations. Duplicate independent inserts remain independent
reports; upstream producers should deduplicate their source identifiers.

## Update operational context

`ops_records` stores `table_name`, source `record_id`, optional `service_date`,
`service_no`, `known_at`, and the source record as JSON `payload`. A producer can
insert/update a fleet, readiness, duty or trip record here and the monitor sees the
change. Use a valid allowlisted table/field shape; preserve stable source IDs and
include the correct date/service and evidence issue timestamp. Vehicle inventory
alone does not constitute a released readiness record or a qualified driver duty.

For example, a fictional availability record can be inserted using SQLite and
Python `json.dumps`. To test without inventing a fleet resource, copy an existing
readiness record, change its issue time/availability consistently, and update that
record with the accompanying `known_at`. Its change automatically queues an
assessment. Keep all donor trip commitments in the database; deleting them to
appear free would invalidate the exercise. Domain workspace edits in the dashboard
SQLite database refresh the corresponding `ops_records` table on the next monitor
scan and queue changed records for assessment. Direct edits to `ops_records` are
supported for external telemetry, but may be replaced on the next source-table
refresh if they reuse an imported record ID.

## Inspect decisions

The interface shows model-generated insights, recommended responses, proposed
vehicle/driver allocations, confidence and uncertainties. Expand the decision
trace for actual database tool arguments/results and validation responses. Public
findings and justifications are stored; private model reasoning is not exposed.
Earlier rule-generated saved records are labeled as earlier assessments and stay
in history. New runs are explicitly marked OpenAI.

This private bootcamp prototype lacks production authentication/trusted Engineering
identity, a real operational telemetry feed and fleet-duty freshness guarantees.
Its context supports an honest resource proposal when evidence allows one, and
an explicit missing-resource conclusion when it does not. Real OpenAI calls have
been exercised against this fictional database, including a model-selected
07:25 retiming of the 238 trip using NW-V002 / NW-C003 that passed assignment
checks and a database context update that automatically triggered a new run; tests separately cover failure,
citation repair, blocked allocation, cutoff handling and database change detection.

## Route and repair exploration

The live room shows an inline 3D repair panel for the selected assessment.
Its vehicle and highlighted areas follow the agent interpretation, with linked workshop
records and an explicit single-deck model mismatch where applicable. Decision trace
is closed by default; **Show decision trace** or a recommendation's **Decision trace**
button opens its evidence and checks in a dialog.

**Explore operations** opens route and additional 3D repair views. Route plots join ordered
route stops with database latitude/longitude and expose stop IDs, names and distance.
Lines connect recorded stops; they are not road geometry or live bus positions.

The 3D view uses the supplied semantic `lionlink-maintenance.glb`, alongside the
original `lionlink-bus.glb` in `apps/web/public/assets/lionlink-bus`. The source asset
came from the workspace's `lionlink-bus` folder. Component metadata retains original
part IDs. The selected assessment determines the vehicle and every highlighted area;
there are no manual vehicle/area selectors or click-to-change highlights in the repair
view. Multiple supported mechanical findings can highlight multiple areas. Reports
without a mechanical area stay unhighlighted. Older saved single-area interpretations
remain readable. Drag to orbit and scroll to zoom.

Cutoff-bounded workshop records and release holds accompany the model. Internal system
areas are illustrative. The model is double-deck; single-deck vehicles explicitly show
the mismatch. No keyword rule diagnoses repairs or assigns a source work order to a
component. The 3D view does not release a vehicle.
