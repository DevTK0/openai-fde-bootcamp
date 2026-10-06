# Evidence workspace architecture

The existing reports read a fixed fixture. The evidence workspace adds complete immutable revisions so analysts can import new records without rebuilding the app.

A mutable database and a generic SQL agent were considered. That design would require replacing report queries and let generated SQL decide accounting scope. This implementation uses validated JSON bundles and deterministic metrics instead. The SHA-256 digest of canonical JSON identifies each revision. An atomic hard link publishes a complete file. Identical imports converge on one file, including concurrent requests. Readers validate the digest. No mutable current-revision pointer exists.

`schema.ts` owns the import contract. `store.ts` owns persistence. `analysis.ts` owns metrics and filters. `context.ts` assembles bounded local retrieval context. Route handlers validate requests and call those modules. The seed generator adapts the canonical monthly ledger, operations service-date aggregates, supporting records and original explanatory documents. Existing reports remain unchanged.

## Import contract

Download `/evidence/example-bundle.json` for a complete example. POST its JSON to `/api/workspace` with `Content-Type: application/json` and an `Origin` matching the application origin. `EVIDENCE_PUBLIC_ORIGIN` configures that origin behind a trusted proxy. Imports are at most 5 MiB and 20,000 rows. This local exercise workspace has no user accounts; deploy behind an authenticated access boundary before accepting sensitive data.

A bundle contains `schemaVersion: 1`, `name`, `description`, `sources` and `tables`. Sources have unique IDs, titles, evidence kind, original reference, caveats and text. Evidence kind is `observed`, `reported`, `planned` or `synthetic`. Tables have unique IDs, title, sourceId, kind, columns, rows and caveats. Rows contain a unique stable ID and a `values` object with declared column names and string, finite number or null values. Put coverage, units and effective dates in source caveats. Unknown fields are rejected.

Only one canonical `maintenance` table and one canonical `operations` table are allowed. Put overlapping summaries, quotes, observations and plans in `evidence` tables. Evidence tables never contribute to metrics. Canonical tables backed by planned or reported sources produce unavailable metrics. Synthetic metrics remain explicitly labelled synthetic.

Maintenance rows have grain `month` in YYYY-MM and `vehicle_id`. Required numeric fields are `recorded_km`, `repair_count`, `repair_cost_sgd` and `repair_unavailable_hours`. Operations rows have grain `date` in YYYY-MM-DD and `service`. Required numeric fields are `trips`, `completed`, `boardings`, `calls`, `queued_calls`, `on_time_departures` and `departure_samples`. Each required measure may be null for missing evidence. Counts must be nonnegative integers. Duplicate grains are rejected. On-time departures are zero through 300 seconds late, inclusive. Numerators cannot exceed their denominators.

## API reference

- GET `/api/workspace` returns `{ revisions }`, including the built-in seed.
- POST `/api/workspace` returns `{ revision, created }` after validation and durable file publication.
- GET `/api/workspace/{revision}` returns analysis, metric definitions, numerator, denominator, citation list, series, source metadata and available filters.
- GET `/api/workspace/{revision}?view=table&table={tableId}&page=0&q={text}` returns up to 25 rows and exact revision/source/table/row citations.
- GET `/api/workspace/{revision}?view=context&q={question}` returns a maximum of eight row excerpts and four document excerpts, relevant deterministic metrics, missing evidence and retrieval limits.

All revision queries accept `vehicle`, `service`, `from` and `to`. Date filters include complete months only for monthly ledgers. A vehicle filter excludes service-only aggregates and a service filter excludes vehicle-only maintenance. Unknown scope yields unavailable metrics. Partially missing numeric fields also yield unavailable values rather than biased partial totals.

Retrieval uses exact identifier matches, lexical terms and structured scope. Document excerpts are background guidance, not filtered measurements. This is the retrieval and context-management part of a RAG system. It does not generate an answer with a language model, claim causality or execute imported instructions. A model synthesis adapter requires a separately verified provider and citation contract.

## Storage and verification

`EVIDENCE_DATA_DIR` selects the persistent directory. The default is `apps/web/data/evidence` when the web app runs from its workspace. Keep this directory across restarts. It is ignored by Git. Immutable imports have no deletion or merge endpoint.

Run `node apps/web/scripts/generate-evidence-seed.mjs` from any directory to regenerate the checked-in seed from current source artifacts. Run `EVIDENCE_URL=http://localhost:3011 node apps/web/scripts/verify-evidence-api.mjs` against the app. Restart the app with the same data directory and repeat the driver to prove persistence. Set `EVIDENCE_ORIGIN` when the server has a configured proxy origin. The driver changes the server only by importing the documented synthetic examples.
