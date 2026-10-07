# Bus Service Decision Dashboard

Standalone local copy of the LionLink Service Planner. This folder contains the complete existing dashboard, separate from the repository's Next.js apps. No package installation is required to view it.

Open `dist/index.html` in a browser. Its adjacent JavaScript, stylesheet, favicon and aggregated synthetic data must remain together.

## Files

- `dist/index.html`: dashboard markup.
- `dist/styles.css`: responsive layout and styling.
- `dist/app.js`: priority rules, threshold controls and service evidence dialogs.
- `dist/data.js`: generated data for 24 services across ten fictional weekdays.
- `dist/favicon.svg`: dashboard icon.
- `prepare-data.cjs`: source-data aggregation and vehicle availability calculations.
- `dist/replay.html`: critical-service bus-position and stop-queue replay page.
- `dist/replay.js`, `dist/replay-engine.js`, `dist/decision-rules.js`: replay controls, motion/queue calculations and priority rules shared with the first page.
- `dist/replay-data/`: route geometry and individual dated replay records for all 24 services.
- `dist/animations/`: Blender script, scenes and MP4 renders for the default critical services.

## Decision rules

Default priority triggers are terminal departure delay of at least 5 minutes, a remaining queue of at least 30 passengers, or a service-linked repair or maintenance hold. The delay and queue thresholds are editable planning assumptions. Two or more triggers give Critical priority; one gives High. Services are ranked by number of triggers, then maximum remaining queue, then departure delay.

The Underutilized buses column counts buses released and idle at noon, with completed turnaround, a service-origin location, a 30-minute task-free window and distinct qualified crew available at that location. Details show vehicle IDs, crew, locations and the end of each free window. Full journey feasibility and later duties require planner review before dispatch.

The separate eight held workshop vehicles have no service assignment or confirmed release and are excluded from the operating fleet. All operational records are synthetic exercise data; this is a retrospective morning snapshot, not a live feed.

## Regenerate data

The Stops with queue after boarding column is the percentage of distinct observed boarding-stop positions with a positive remaining queue at least once during 06:00–12:00 on the selected date. Repeated bus calls at a position count once; directions and repeated route positions remain separate. Final alighting-only terminals are excluded, and unobserved stops are not treated as zero. The table shows affected / observed counts; service details also show observed / total route boarding-stop coverage. This measure uses any positive queue and is independent of the editable high-queue priority threshold.

`queue-coverage.cjs` calculates this measure. Run its focused checks with `node --test queue-coverage.test.cjs`.

The saved dashboard runs independently of the original raw inputs. To regenerate `dist/data.js`, run from this folder:

```powershell
node prepare-data.cjs "C:/path/to/Hackathon"
```

The supplied directory must contain `lionlink-operations-source/data/` and `fleet-repository-data.js`. Without an argument, the script uses the workspace two levels above this folder, matching its current location inside `Hackathon/openai-fde-bootcamp`.

Run `node --check dist/app.js` and `node --check prepare-data.cjs` for JavaScript syntax checks. The existing dashboard's data and browser interaction checks passed before this copy was saved.

This copy contains no Sites registration, separate Git repository, browser profiles, or deployment credentials. It remains local unless explicitly published later.

## Critical-service animations

Select **Animate critical services** on the priority watchlist, or open `dist/replay.html`. The date and the planner's delay/queue thresholds are passed in the link and evaluated using the same rules as the first page. All critical services are shown; the selector can focus on one. Both supplied directions are shown, while loop-only services retain their single sourced pattern. No reverse route is invented.

The page supports play/pause, playback speed, scrubbing across 06:00–12:00 SGT, bus IDs, and a complete per-direction boarding-stop queue table. Positions interpolate between actual departure from one stop and arrival at the next; while dwelling, a bus stays at the recorded stop. Lines join sourced stop coordinates directly and are not street or GPS geometry. A queue is the most recent `queue_after_people` observation at or before replay time, ordered by boarding cutoff and trip ID. Unknown observations remain unknown, and observations older than ten minutes are dimmed. The last observed queue is not a continuously measured queue; new arrivals between observations are not added. Final terminals are alighting-only.

This is a replay of synthetic operating records. No live GPS or passenger feed is connected.

### Rebuild the replay data

```powershell
node prepare-replay.cjs "C:/path/to/Hackathon"
node --test queue-coverage.test.cjs replay-engine.test.cjs
```

The generator saves per-date browser assets and `Hackathon/outputs/critical-service-replay/replay-data.json` for Blender. The browser also offers **Download replay data** for the current critical set and date. To create Blender scenes and animations for that export, place the JSON beside `build_animation.py`, then run:

```powershell
& "C:/path/to/blender.exe" --background --python "build_animation.py" -- --data "replay-data.json" --animate
```

The script outputs one `.blend` scene and MP4 per exported critical service, with both directions, recorded arrival/departure keyframes and queue changes at boarding cutoffs. Included 7 October renders cover services 132 and 159. Their six-hour replay is compressed into 120 frames at 12 fps (10 seconds); the `.blend` preserves the underlying event timing. The browser replay provides finer time inspection.
