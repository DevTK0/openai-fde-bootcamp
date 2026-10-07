# SQLite migration

- [x] Read the pstack principles.
- [x] Frame. All dashboard data must load from SQLite. Existing results and explorer behavior must survive.
- [x] Ground. Fleet and relationship modules import snapshots in the browser. Operations uses a server API over gzip files. Slides and docs consume the original fixtures separately.
- [x] Sketch. Compare server props plus a client context with separate HTTP endpoints for every chart.
- [x] Agree. No checkpoint requested. Choose server props for small handout datasets and retain the operations API for large tables.
- [x] Implement the importer and database reader.
- [x] Migrate client callers and delete runtime snapshot imports.
- [x] Verify database parity, real API behavior, automated UI interactions, checks and production packaging. Visual browser verification is inconclusive because the T3 preview timed out.
- [x] Scrap. Skip because the architecture passed verification.
- [ ] Hand back the verified change.

## Design A

`Page` calls `readDashboardData()` and passes serializable data into `DashboardProvider`. `createFleet(data)` and `createRelationships(fleet, passengers)` retain pure calculations. Components read their data from context. `getOperationsReport(service, date)` aggregates relational SQLite tables. `queryOperationsTable(id, query, page)` uses bound parameters and a metadata allowlist. The database holds heterogeneous handout rows as JSON values with table metadata, while core operations retain typed SQL columns.

## Design B

Each chart calls a new HTTP endpoint that executes SQL for that chart. This avoids transferring all handouts initially, but spreads filter, loading and error handling across every dashboard. It expands the public API without a requirement for lazy loading these small datasets.

## Decision

Choose A. Keep the existing operations API and pure calculations, replace storage at the server boundary, and remove global imported data. Use Node's built-in SQLite reader with a read-only connection per operation. Database replacement or data edits are observed on the next request. Keep importer inputs for reproducibility and for slides/docs, but never use them as a runtime fallback. Store original compressed CSV downloads in SQLite because the UI explicitly promises original source bytes.

## Verification

Compare database output to the pre-migration fixtures, including all 21 table types, nulls, identifier strings, summary filters, original downloads, and handout calculations. A copied database mutation must change API output. Build and run the production app with snapshot files unavailable to prove there is no hidden fallback.

## Delivery

- [x] Worktree. Isolated task branch and runtime.
- [x] PRs. Reviewed the diff and comments guidance.
- [ ] Commits. Commit the verified migration and rebase onto current main.
- [ ] Forge. Push and open one PR against main.
- [ ] Readiness. Read back the PR and check feedback.
- [x] Babysit. Skip because no ongoing CI supervision was requested.
