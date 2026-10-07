# Replay data provenance

Checked on 7 October 2026 against `/home/exedev/lionlink-operations-source`, its `SOURCE-MANIFEST.json`, the current app database, and the Blender snapshot at prototype commit `f6434e1557757b0862e25afb971af8f365f6c61d`.

## Existing source records

All 21 operations and workshop CSV tables match the database, covering 307,402 rows. No source rows are added, removed, or changed in content. The comparison uses SQLite column types for numbers and treats blank text and null as equivalent empty fields. The only raw representation differences are two empty `related_trip_id` values in `resource_updates`; those are also present on main.

Every source CSV matches its supplied SHA-256 manifest entry. Decompressing each archived source download from the database produces bytes identical to the corresponding original CSV. There are no changes to `data/` or `apps/web/data/` between this integration branch and main at the time of checking.

The operations data and SQLite import precede this integration. Main history includes the operations dashboard import at `91b6b7c`, the SQLite export at `73799a4` and the SQLite-backed dashboard at `81a45e5`.

## Blender snapshot comparison

The prototype's `prepare-replay.cjs` reads `routes.csv`, `stops.csv`, `route_stops.csv`, `trips.csv`, and `stop_calls.csv` from `lionlink-operations-source/data`. It groups records for rendering and converts timestamps to local seconds since midnight. The Blender examples use services 132 and 159 on 7 October 2026.

Every snapshot entry was compared to its corresponding original record.

| Snapshot content                                               | Checked | Result |
| -------------------------------------------------------------- | ------: | ------ |
| Route definitions                                              |       4 | Match  |
| Ordered stop positions, names, coordinates, and terminal flags |     191 | Match  |
| Trips and vehicle assignments                                  |      56 | Match  |
| Arrival/departure stop calls                                   |   2,674 | Match  |
| Queue counts and observation timestamps                        |   2,474 | Match  |

These counts describe the subset stored with the two Blender renders, not the full operations dataset.

## What the prototype added

The prototype added derived replay bundles, animation scenes, video renders, and presentation calculations. Intermediate bus positions, visual queue markers, and animation timing are generated representations. Watchlist priorities, affected-stop percentages, candidate windows, and stale-data labels are application calculations and policy assumptions rather than new observed records.

The source's own `data/README.md` says Singapore network geography is based on public source data, while LionLink timetables, vehicles, crew, passenger counts, control messages, and service outcomes are synthetic exercise records. Existing source data does not mean measured real-world operations.

The videos are frozen snapshots. This check establishes their source lineage, not that they will remain synchronized after database edits. Their player remains separate from the current database replay.
