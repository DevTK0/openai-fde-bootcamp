# Decision workspace

The home page opens `/workspace`. Choose a stakeholder question, a data revision, and filters to inspect deterministic measures. Import the sample JSON from the page to replace the supplied fixture with new evidence without rebuilding. The selected revision is saved in the URL and survives reloads. Invalid revision links show a warning and open the supplied fixture.

The eleven question definitions live in `problems.ts`. Each question separates a hypothesis, an inference limit, and a request for ordinary retained records. Explicit table preferences choose the relevant supplied planning records. Imported revisions fall back to a compatible table, and the inspector lets users choose any table.

Evidence search uses the local bounded retrieval API. It shows effective filters inferred from the question and lets users open full source passages or exact records. The exported JSON is the compact bounded API payload, including citations and missing evidence. This is retrieval context for later model integration; it does not generate a diagnosis.

Raw numeric charts show one bar per record on the current table page. They do not aggregate overlapping quotes, plans, or summaries. Historical fixture reports remain available at `/dashboard`.

## Verify the UI

Run `pnpm check --concurrency=1` at the repository root. Start an isolated web process with its own evidence directory and same-origin import setting:

```sh
cd apps/web
EVIDENCE_DATA_DIR=/tmp/workspace-proof-data EVIDENCE_PUBLIC_ORIGIN=http://localhost:3013 pnpm exec next dev --port 3013
```

From the repository root, run the browser driver with a separately installed Playwright module:

```sh
node apps/web/scripts/verify-workspace-browser.mjs http://localhost:3013 /absolute/path/to/node_modules/playwright /tmp/workspace-proof
```

The driver uses role and label selectors. It checks imported metric values, revision reloads, validation failures, duplicate imports, table search and pagination, long row citations, source passages, scoped context export, missing evidence, same-query retry after a transient error, delayed request races, question-specific chart order, rendered charts, and mobile navigation. It saves desktop and mobile screenshots for visual inspection. The dependency path is explicit so verification does not add a browser package to the application.
