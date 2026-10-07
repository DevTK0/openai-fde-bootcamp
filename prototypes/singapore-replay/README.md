# Singapore replay experiment

Open `/prototypes/singapore-replay`, or use **Open interactive 3D replay** under Planning → Service planning → Timeline & replay. The link opens a separate tab to retain the planner's investigation context.

The accepted prototype is retained in the application repository. It reads the current SQLite database for services 132 and 159 on 7 October 2026, 06:00–12:00 SGT. Its service and time controls are independent of the dashboard selection. These operating records are synthetic. No dispatch writes occur.

## Behavior

- Playback defaults to 5×, with 1×, 5×, 15× and 60× controls.
- Buses dwell at recorded stops and follow LTA route geometry between calls. Position and heading between stops are estimates. Short terminal connectors preserve the original stop coordinates.
- Stops use circle markers. After departure, fading icon/count strips show boarded, alighted and left-behind passengers. Unknown is `?`; an observed zero is `0`. Strips hold for 30 replay seconds and expire after 180 seconds. They do not represent continuously measured queues.
- Drag rotates. Right-drag, trackpad two-finger scrolling, and touchscreen two-finger movement pan. Only the plus/minus buttons zoom.
- The passenger-example button selects record `NW-20261007-0108-03` at 07:06:45. Its counts are 10 boarded, 9 alighted and 10 left behind.

## Geography and limits

Four official LTA route paths match the supplied snapshot hashes, with monotonically ordered stop projections. Only these services have been validated. URA Master Plan 2019 subzones provide the land backdrop.

The committed city extract comes from OpenFreeMap's `20261004_113936_pt` OpenStreetMap snapshot. Roads cover Singapore. Buildings, parks and water details cover the central/northeast corridor, 103.78–103.94 E and 1.26–1.415 N. Building heights use tile estimates with an 8 m fallback. Symbols are enlarged for readability. The scene does not represent live GPS or photorealistic buildings.

Attribution appears on the map. See `apps/web/public/prototype-map/source.json`, [OpenStreetMap copyright](https://www.openstreetmap.org/copyright), and [OpenFreeMap](https://openfreemap.org/).

The city asset loads as one file, about 17 MB before transfer compression. Camera presets rebuild the scene. Streaming visible tiles and broader route/date support remain future integration work.

## Regenerate assets

Run from the repository root with Python 3. The committed assets let the application run without Python or the original source folder.

```bash
python3 prototypes/singapore-replay/extract-map.py --maps /path/to/lionlink-operations-source/maps --kml /path/to/verified-kml
python3 -m pip install requests mapbox-vector-tile shapely
python3 prototypes/singapore-replay/extract-streets.py
```

The KML directory must contain `LTA-KML-{service}-{direction}.kml` for services 132/159 and directions 1/2. The street extractor downloads the current OpenFreeMap snapshot, caches tiles under `.audit/vector-tiles`, and records provenance. A new snapshot may change the geometry.

## Verification

Run `pnpm check`. Focused tests cover passenger counts, departure/expiry boundaries, missing evidence, zero values, distinct directions, bends, endpoints and repeated route vertices.

In the running application, open the replay through Planning. Check both services, the passenger example, 1× and 5× playback, pause, camera presets, and road-aligned bus headings. At 06:03:36, vehicle NW-V009 dwells at Hougang; at 06:04 it travels toward Blk 302.
