<img src="assets/icon.svg" width="64" height="64" alt="">

# openai-fde

A fleet dashboard, stakeholder presentations, and a software factory for shipping
changes with Codex.

The **LionLink dashboard** lets you explore fleet history, maintenance, incidents,
and operating costs. The **slide decks** turn that data into stakeholder
presentations. Both use fictional sample data.

## Run it locally

You'll need **Node.js 20.9+** and **pnpm 12.9.1**. From the repository root:

```bash
pnpm install
pnpm dev
```

Then open:

- [Fleet dashboard](http://localhost:3000/dashboard)
- [Slide decks](http://127.0.0.1:3001/slides/)

If port 3000 is occupied, use the web address printed in the terminal.
To start just one app, use `pnpm --filter web dev` or
`pnpm --filter @workspace/slides dev`.

## Ship changes with Codex

Open this checkout in Codex and type **`$pstack`** to select the entrypoint. The
skills are registered for this checkout; no separate installation is needed.
In Codex CLI or the IDE extension, you can also select it from `/skills`.

Our **`/pstack`** prompt alias works when the client passes it to the agent; it
doesn't register a custom slash command in the client. If skills are missing,
restart Codex in this checkout. You can always ask directly:
`Read skills/pstack/SKILL.md and use it for this task.`

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
The [skill catalog](skills/README.md) has the full workflow details and explains
how this collection adapts the original pstack.

## Make a change

The main places to work are:

| Location | What's there |
| --- | --- |
| [apps/web](apps/web) | Dashboard pages and app components |
| [apps/slides](apps/slides) | Presentations and supporting evidence |
| [packages/ui](packages/ui) | Shared shadcn/ui components and theme |
| [skills](skills) | Codex workflows and principles |
| [Data](Data) | Sample workbooks, CSVs, and source documentation |

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

## Update the sample data

The apps read generated snapshots. After editing the records in `Data/`, run:

```bash
python3 scripts/import-data.py
pnpm --filter @workspace/slides generate
pnpm check
```

Python's standard library is enough; no extra Python packages are needed.
Review the slide conclusions after a refresh—their wording doesn't update
with the numbers. Dates use Singapore local time and costs are SGD excluding tax.

The dashboard has no authentication, so keep deployments private if you replace
the fictional records with sensitive data.

For the deck list, data caveats, and slide deployment instructions, see the
[slides README](apps/slides/README.md).
