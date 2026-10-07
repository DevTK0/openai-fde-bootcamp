# Service replay visualization

Open **Planning → Service planning → Timeline & replay**. The Three.js map uses the existing replay clock, selected service, date, observation window and database report. The scene loads only when the replay tab is opened.

Boarded, alighted and remaining counts come from the same SQLite stop-call records as the evidence tables. The operating records are synthetic. There is no separate example date or service selector. Routes use the current database stop order and coordinates, with no service allowlist. New services render immediately when stop coordinates are available.

## Behavior

- A compact player bar below the map provides grouped previous-event, play/pause and next-event buttons, scrubbing, inspect time and grouped speed buttons. Playback defaults to 5×, with 1×, 5×, 15× and 60× options.
- Buses dwell at recorded stops and follow LTA route geometry between calls. Position and heading between stops are estimates. Short terminal connectors preserve the original stop coordinates.
- Boarding icons are mint, alighting icons cyan, and left-behind icons red.
- Stops use circle markers. After departure, fading icon/count strips show boarded, alighted and left-behind passengers. Unknown is `?`; an observed zero is `0`. Strips hold for 30 replay seconds and expire after 180 seconds. They do not represent continuously measured queues.
- Drag rotates. Right-drag, trackpad two-finger scrolling, and touchscreen two-finger movement pan. Only the plus/minus buttons zoom. Fit route restores the default framing. There are no camera presets or straight-line comparison controls; available LTA paths are always used.
- For service 132 on 7 October 2026 at 07:06:45, record `NW-20261007-0108-03` shows 10 boarded, 9 alighted and 10 left behind.

## Geography and limits

The committed LTA shapes cover all 24 database services and 36 directions. Their source hashes match the supplied registry. URA Master Plan 2019 subzones provide the land backdrop.

At runtime, the route builder uses a graph of each service/direction's source line segments. It joins multipart geometry at shared vertices, projects the current database stops onto that graph, and finds paths between successive stop occurrences. The stop sequence determines travel direction, including repeated visits on loops. Intermediate movement and junction choices are estimates, not measured trajectories. Original stop coordinates remain unchanged. A 250 m display tolerance limits the distance of a stop-to-road connector.

Without a source shape or a connected path, the builder uses an amber direct estimate for that leg. Missing coordinates omit the affected stop and its bus position, with an explicit notice. Add new source geometry through the registry and extraction script for road-following paths; no renderer changes or per-service branches are required. See `apps/web/public/service-replay/routes-source.json` for source URLs and hashes.

The committed city extract comes from OpenFreeMap's `20261004_113936_pt` OpenStreetMap snapshot. Roads cover Singapore. Buildings, parks and water details cover the central/northeast corridor, 103.78–103.94 E and 1.26–1.415 N. Building heights use tile estimates with an 8 m fallback. Symbols are enlarged for readability. The scene does not represent live GPS or photorealistic buildings.

Attribution appears on the map. See `apps/web/public/service-replay/source.json`, [OpenStreetMap copyright](https://www.openstreetmap.org/copyright), and [OpenFreeMap](https://openfreemap.org/).

The city asset loads as one file, about 17 MB before transfer compression. Fit route rebuilds the scene. Streaming visible tiles remains future work.

## Regenerate assets

Run from the repository root with Python 3. The committed assets let the application run without Python or the original source folder.

```bash
python3 scripts/service-replay/extract-map.py --maps /path/to/lionlink-operations-source/maps --kml /path/to/verified-kml
python3 -m pip install requests mapbox-vector-tile shapely
python3 scripts/service-replay/extract-streets.py
```

The extractor iterates every LTA KML entry in the supplied registry, downloads missing files to the KML cache, verifies hashes, and preserves all line segments. The street extractor downloads the current OpenFreeMap snapshot, caches tiles under `.audit/vector-tiles`, and records provenance. A new snapshot may change the geometry.

## Verification

Run `pnpm check`. Focused tests cover passenger counts, departure/expiry boundaries, missing evidence, zero values, distinct directions, bends, endpoints and repeated route vertices. A database-wide test builds all 36 routes and 1,353 stop occurrences and checks that every current leg has a connected road path. Synthetic fixtures cover a new service ID, reversed multipart lines, loops, disconnected geometry and missing coordinates.

In the running application, open the replay through Planning. Check a two-direction service, a loop and a multipart route such as 261, the dated passenger exchange, 1× and 5× playback, pause, Fit route, and road-aligned bus headings. At 06:03:36, vehicle NW-V009 dwells at Hougang; at 06:04 it travels toward Blk 302.

The control groups adapt the shadcn.io Button Group Player Controls and Button Group Playback Speed examples. They use the shared shadcn ButtonGroup primitive and the application replay clock. Previous/next pause playback and seek recorded arrivals, departures or observation times within the selected window; the window boundaries are also seek targets. Play at the end restarts the window.

## Fleet service history

Fleet overview includes a Service history map for all services on a selected operating date. Its date is independent of the vehicle and usage-period filters. The read-only `/api/service-history?date=YYYY-MM-DD` endpoint reads routes, ordered stops, trips and stop calls from SQLite. The map uses the same player and road geometry as Planning, with service-colored paths and bus service labels. It initially seeks the first event and allows inspection across the full Singapore calendar day.

Verify Fleet overview at 07:30 on 16 October 2026, change the operating date, and exercise play/pause, event seeking and the time scrubber. Check that all 24 services remain included and that changing vehicle and usage-period filters does not filter the service map. These are historical exercise records, and movement between observations remains estimated.

Passenger info and Bus stops toggles independently control departure overlays and stop circles. Both start hidden in Fleet history and visible in the single-service Planning replay. Bus labels remain on the map; the service legend and expandable source notes are omitted. Source provenance and interpretation limits remain documented here, with geographic attribution on the map.

## Scheduled service

Operations / Day schedule uses the same map and player with a separate scheduled-trip model. `/api/scheduled-service?date=YYYY-MM-DD` reads planned vehicle and crew assignments and scheduled departure/arrival times from SQLite. It does not read actual journey times or stop calls. Dates are limited to the operating calendar; the supplied records cover synthetic weekday morning departures on 5–16 October 2026.

Scheduled positions interpolate by distance along the route between scheduled departure and arrival. Buses appear at departure and disappear at arrival. There are no invented intermediate arrival times, dwell periods, passenger counts, delays, or readiness claims. Incomplete or reversed journey times and routes with missing stops are not animated. The Bus stops toggle remains available; passenger overlays are absent. Source tables beneath the map retain their existing search and import controls across all dates.

Verify a busy time such as 07:30, play/pause, next event and date switching. Confirm Fleet history still offers passenger overlays. Tests change actual vehicle/timing records and delete stop calls without changing the schedule response, and check movement boundaries and incomplete evidence.
