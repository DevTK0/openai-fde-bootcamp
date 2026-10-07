# Service replay visualization

Open **Planning → Service planning → Timeline & replay**. The Three.js map uses the existing replay clock, selected service, date, observation window and database report. The scene loads only when the replay tab is opened.

Boarded, alighted and remaining counts come from the same SQLite stop-call records as the evidence tables. The operating records are synthetic. There is no separate example date or service selector. Routes use the current database stop order and coordinates, with no service allowlist. New services render immediately when stop coordinates are available.

## Behavior

- A compact player bar below the map provides play/pause, reset, scrubbing, inspect time and a speed dropdown. Playback defaults to 5×, with 1×, 5×, 15× and 60× options.
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
