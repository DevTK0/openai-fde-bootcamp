<img src="assets/icon.svg" width="64" height="64" alt="">

# openai-fde

Turborepo + pnpm monorepo with Next.js, Tailwind CSS v4, and shadcn/ui.

## Structure

- `apps/web` – Next.js app
- `packages/ui` – shared shadcn/ui components (`@workspace/ui`)
- `packages/eslint-config` – shared ESLint config
- `packages/typescript-config` – shared TypeScript config

## Commands

```bash
pnpm install
pnpm dev        # turbo dev
pnpm build      # turbo build
pnpm lint
pnpm typecheck
```


## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```

## LionLink dashboards

Visit `/dashboard` for fleet history, maintenance, October operations, workshop and
festival planning, the incident baseline, passenger accounts, and quoted cost options.
Relationships connects maintenance costs, component care, passenger evidence, and
planning constraints. Dates are Singapore local time; money is SGD excluding tax.
All operating observations are fictional exercise records.

The dashboard combines two sources with different coverage:

- `Data/` contains five Excel workbooks, three historical CSV files, and documentation,
  providing 40 handout tables with maintenance history for eight selected vehicles.
  Its explorer supports search, column sorting, pagination, and filtered CSV export.
- The separate `lionlink-operations-source` directory supplies 21 operations CSV tables:
  172 operating vehicles, 24 services, 6,900 trips, and 252,380 stop calls. Departures
  cover 06:00–11:59 on ten weekdays from 5–16 October 2026, with complete downstream
  calls retained. Its explorer provides search, 25-row pagination, and downloads of
  complete original CSV files compressed with gzip. Reliability and crowding reports
  can be filtered by service and date; workshop resources are shown separately.

The operations snapshot is checked in under `apps/web/data/operations/`, including
compressed source tables, report aggregates, and a manifest with source definitions
and checksums. Running the app does not require the external source directory.
Rebuilding the snapshot requires that directory's `data/schema.json`, CSV files,
and source documentation.

After changing either source, regenerate in this order from the repository root,
replacing the operations path with the location of your source directory:

```bash
python3 scripts/import-data.py
python3 scripts/import-operations.py /path/to/lionlink-operations-source
pnpm check
```

The importers use Python's standard library. The handout importer preserves missing
values and Excel date formats. The operations importer checks passenger accounting,
rebuilds `apps/web/lib/operations-passengers.json`, and automatically runs
`scripts/build-boarding-history.py` to regenerate `apps/web/lib/boarding-history.json`.
These support six matched passenger reports and the ten-day comparison of the 07:15
service 238 departure, including mornings with nobody left waiting.

The dashboard uses the monthly CSV as its canonical historical ledger; Excel views,
annual summaries, and selected visits overlap and are not added again. The broader
operations cohort, selected October extracts, and future plans are separate scopes.
Snapshots are static: source edits require re-importing. Restart the app after
regeneration to clear process caches, and rebuild it for production deployment.
This app has no authentication; keep this exercise data deployment private if
replacing the fixtures with sensitive information.
