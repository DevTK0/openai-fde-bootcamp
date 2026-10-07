<img src="assets/icon.svg" width="64" height="64" alt="">

# openai-fde

A fleet decision workspace, historical reports, stakeholder presentations, and a software factory for shipping
changes with Codex.

The **decision workspace** analyses imported evidence with scoped charts, record inspection, and cited evidence search. The historical **LionLink dashboard** and **slide decks** use fixed fictional exercise data.

## Run it locally

You'll need **Node.js 22.12+** and **pnpm 12.9.1**. From the repository root:

```bash
pnpm install
pnpm dev
```

Then open:

- [Decision workspace](http://localhost:3000/workspace)
- [Historical fleet dashboard](http://localhost:3000/dashboard)
- [Slide decks](http://127.0.0.1:3001/slides/)
- [Documentation](http://127.0.0.1:3002/docs/)

If port 3000 is occupied, use the web address printed in the terminal.
To start just one app, use `pnpm --filter web dev` or
`pnpm --filter @workspace/slides dev`, or `pnpm --filter @workspace/docs dev`.

## Ship changes with Codex

Open this checkout in Codex and type **`$pstack`** to select the entrypoint. The
skills are registered for this checkout; no separate installation is needed.
In Codex CLI or the IDE extension, you can also select it from `/skills`.

Our **`/pstack`** prompt alias works when the client passes it to the agent; it
doesn't register a custom slash command in the client. If skills are missing,
restart Codex in this checkout. You can always ask directly:
`Read .agents/skills/pstack/SKILL.md and use it for this task.`

Choose a workflow based on where your work stands:

| I want to… | Ask Codex |
| --- | --- |
| Open a PR for my changes | `$pstack opening-a-pr: verify this change, commit it, and open a PR.` |
| Get a PR ready to merge | `$pstack babysit PR 123: address feedback and failing checks.` |
| Verify and merge existing PRs | `$pstack shipping: verify and land PRs 123 and 124 in order.` |
| Build a queue of tasks for human review | `$pstack autopilot-stack: build this task queue and open a stack of PRs: …` |
| Build and merge a queue of tasks | `$pstack autopilot-full: build this task queue and merge verified PRs: …` |

For a task queue, describe each change and what counts as done. **Autopilot-stack
leaves merging to you. Autopilot-full can merge when you authorize it.** Both use
independent agents to check the work and run only while the Codex session is active.

Before your first autopilot run, ask Codex to use `create-verification-skill` to
set up repeatable checks for the app. That app-specific skill isn't set up yet.
The [skill catalog](.agents/skills/README.md) has the full workflow details and explains
how this collection adapts the original pstack.

## Make a change

The main places to work are:

| Location | What's there |
| --- | --- |
| [apps/web](apps/web) | Dashboard pages and app components |
| [apps/slides](apps/slides) | Presentations and supporting evidence |
| [apps/docs](apps/docs) | Astro Starlight documentation served at `/docs/` |
| [packages/ui](packages/ui) | Shared shadcn/ui components and theme |
| [skills](.agents/skills) | Codex workflows and principles |
| [apps/web/lib/fleet-data.json](apps/web/lib/fleet-data.json) | Converted handout data and source documentation |

Use the shared components for UI work. To add a missing shadcn component, run
`pnpm dlx shadcn@latest add <component> -c apps/web` from the repo root.

Before submitting a change:

```bash
pnpm check       # lint, TypeScript checks, and tests
pnpm build       # build the apps
```

You can also run `pnpm lint`, `pnpm typecheck`, or `pnpm test` individually.
Repository conventions and instructions for coding agents live in
[AGENTS.md](AGENTS.md).

## Analyse new evidence

Open `/workspace`, choose a stakeholder question, and select **Import new evidence**.
Download the sample JSON bundle from the page, adapt its sources and records, then
upload it. Valid imports create immutable revisions and update charts without a
rebuild. Choose a revision and filter by vehicle, service, and date to inspect
metrics, their definitions, source caveats, and contributing records. The selected
revision stays in the URL across reloads.

`EVIDENCE_DATA_DIR` selects the persistent import directory. Its default is
`apps/web/data/evidence` when the app runs from its workspace. Keep that directory
across restarts. Behind a trusted proxy, set `EVIDENCE_PUBLIC_ORIGIN` to the public
application origin so same-origin uploads pass validation.

Evidence search retrieves bounded local context with row and source citations.
It exposes missing evidence and exports the retrieved context. It does not use a
language model to generate answers or establish root causes. Imported revisions
do not update historical reports or slide conclusions.

See the [workspace guide](apps/web/components/workspace/README.md) for the UI and
browser verification, and the [evidence API and import contract](apps/web/lib/evidence/README.md)
for JSON fields, limits, metric scope, persistence, and deployment access requirements.

## Historical LionLink dashboards

Visit `/dashboard` for fleet history, maintenance, October operations, workshop and
festival planning, the incident baseline, passenger accounts, and quoted cost options.
Relationships connects maintenance costs, component care, passenger evidence, and
planning constraints. Dates are Singapore local time; money is SGD excluding tax.
All operating observations are fictional exercise records.

The dashboard combines two sources with different coverage:

- `apps/web/lib/fleet-data.json` contains the converted data and documentation from
  five Excel workbooks and three historical CSV files, providing 40 handout tables
  with maintenance history for eight selected vehicles.
  Its explorer supports search, column sorting, pagination, and filtered CSV export.
- The separate `lionlink-operations-source` directory supplies 21 operations CSV tables:
  172 operating vehicles, 24 services, 6,900 trips, and 252,380 stop calls. Departures
  cover 06:00 to 11:59 on ten weekdays from 5 to 16 October 2026, with complete downstream
  calls retained. Its explorer provides search, 25-row pagination, and downloads of
  complete original CSV files compressed with gzip. Reliability and crowding reports
  can be filtered by service and date; workshop resources are shown separately.

The operations snapshot is checked in under `apps/web/data/operations/`, including
compressed source tables, report aggregates, and a manifest with source definitions
and checksums. Running the app does not require the external source directory.
The original handout files and Python conversion scripts are no longer included
in this repository. The apps use the checked-in snapshots directly.

## Refresh slide evidence

The historical reports and slide snapshots are fixed exercise fixtures. New JSON
bundles belong in `/workspace`. Replacing the historical fixtures requires
coordinated updates to the operations manifest, compressed source tables, report
aggregates, passenger matches, and boarding history.

To regenerate slide evidence from the existing snapshots and check consistency:

```bash
pnpm --filter @workspace/slides generate
pnpm check
```

Review the authored slide figures and conclusions after a refresh. They do not
update automatically. Restart the dashboard to clear its cached reports, and
rebuild it for production deployment. Dates use Singapore local time and costs are SGD excluding tax.

The dashboard has no authentication, so keep deployments private if you replace
the fictional records with sensitive data.

For the deck list, data caveats, and slide deployment instructions, see the
[slides README](apps/slides/README.md).

## Documentation deployment

Run `bash scripts/deploy-docs.sh` to build and publish the Astro Starlight docs on this VM.
Nginx serves the static release at `/docs/`. The nginx snippet is `deploy/nginx/docs.conf`. Verify the published site with
`python3 scripts/verify-docs.py http://127.0.0.1:8000`.
