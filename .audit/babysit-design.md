# Review fixes for PR 24

Both reported defects have failing regression tests in operations-query.test.ts.

The data shape for expensive reads is a batch of parameterized SQL statements. One worker opens one read-only SQLite transaction and returns the rows. The server validates those rows with the existing schemas and computes the existing report. Metadata reads stay small and synchronous.

Candidate A keeps Node's SQLite driver and moves SQL batches into disposable workers. Four reads can run per process. Additional reads receive 503 with Retry-After. This preserves the existing Unicode and numeric substring search semantics.

Candidate B adopts an asynchronous third-party SQLite driver. It also moves work off the event loop, but adds a native dependency and deployment changes for a problem the existing runtime can solve. Native lower()/LIKE alone still blocks the event loop and changes Unicode case matching, so it does not resolve the full defect.

Choose A. The worker has no app or package dependencies, so the production trace only needs its .mjs entrypoint. No persistent pool, query cache or mtime invalidation is necessary. Derive service/date lists and coverage inside the existing metadata transaction. Keep source descriptions and archival checksums unchanged.

Verify event-loop progress during the actual largest-table search, overload and recovery, worker failures, live metadata edits, report parity, full checks, and the production worker trace. Use real HTTP concurrency checks to prove that page and summary requests can complete before two searches do.
