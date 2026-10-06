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
The data explorer includes every table and source note, with search, column sorting,
pagination, and filtered CSV export. Dates are Singapore local time; money is SGD
excluding tax. The sources are fictional exercise records for eight selected vehicles.

`Data/` contains the supplied five Excel workbooks, three CSV files, and documentation.
Regenerate the checked-in dashboard snapshot after changing the source files:

```bash
python3 scripts/import-data.py
pnpm check
```

The importer uses Python's standard library and preserves missing values and Excel
date formats. The dashboard uses the monthly CSV as its canonical historical ledger;
Excel views, annual summaries, and selected visits overlap and are not added again.
October extracts and future plans are displayed separately. The snapshot is static:
source edits require re-importing. This app has no authentication; keep this exercise
data deployment private if replacing the fixtures with sensitive information.
