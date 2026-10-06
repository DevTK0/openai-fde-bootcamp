# Agent guidelines

## Repository layout

Turborepo + pnpm workspace.

- `apps/web` – Next.js app (App Router, Tailwind CSS v4).
- `packages/ui` – shared shadcn/ui component library, published to the workspace as `@workspace/ui`.
- `packages/eslint-config`, `packages/typescript-config` – shared tooling configs.
- `.agents/skills` – repository-owned agent workflows for the software factory.

## Pstack skills

The repository's software factory entrypoint is `/pstack`. When a user starts a
request with `/pstack`, read [.agents/skills/pstack/SKILL.md](.agents/skills/pstack/SKILL.md) and
follow the matching playbook. Codex discovers the skill through `.agents/skills/pstack`; `/pstack` is a
repository prompt alias, while `$pstack` is the native skill invocation.

Developer setup:

1. Use the Node and pnpm versions specified in `package.json`, then run `pnpm install`.
2. Open an agent session in this checkout. Skills are versioned under `.agents/skills/`.
3. Start with `/pstack <task>`. In Codex's native skill UI, use `$pstack` or
   select it through `/skills`. The checked-in `.agents/skills/` directories
   register all 35 skills for this repository. Restart the session if the new entry does not appear.
4. If the client intercepts `/pstack`, use `$pstack` or
   `Read .agents/skills/pstack/SKILL.md and use it for <task>`.

See [.agents/skills/README.md](.agents/skills/README.md) for the included skills, all 24
principles, the five shipping/autopilot playbooks, upstream revision, and local adaptations.
No global installation or companion plugin is required. Edit skill sources directly in `.agents/skills/`.

These skills target Codex. Ordinary delivery runs sequentially. Parallel workers
are allowed only inside an explicitly invoked swarm or an executing autopilot
workflow, with isolated checkouts/runtime state and capacity reserved for verification.
Use Codex session tools and the configured model.
PR creation automatically commits, pushes the task branch, and opens a
PR unless the user sets a different stopping point. Merging follows the Shipping
playbook or an executing Autopilot-full queue with landing authority.
Autopilot-stack delivers verified PRs for human landing and never merges. Follow user scope and Codex permissions.
Shipping and autopilot require independent verification. Autopilot supervision
lasts only for the active Codex session; stop workers and persist a handoff when
the session ends. Do not claim an unattended scheduler is running. Report unavailable capabilities honestly. Run
`pnpm check` and the playbook's task-specific verification before handing off.

## UI components: use shadcn/ui

All UI must be built from shadcn/ui components living in `packages/ui`.

- **Do not hand-roll UI primitives** (buttons, inputs, dialogs, dropdowns, tabs, tooltips, tables, forms, toasts, etc.). If a primitive is needed and is not yet in `packages/ui/src/components`, add it with the shadcn CLI from the repo root:

  ```bash
  pnpm dlx shadcn@latest add <component> -c apps/web
  ```

  This writes the component into `packages/ui/src/components`.
- **Do not add external UI component libraries** (MUI, Chakra, Ant Design, Mantine, Headless UI, DaisyUI, etc.). shadcn/ui on top of `@base-ui/react` is the only component layer.
- **Import from the ui package**, never by relative path across packages:

  ```tsx
  import { Button } from "@workspace/ui/components/button"
  import { cn } from "@workspace/ui/lib/utils"
  ```

- **Compose, don't fork.** Build app-specific components in `apps/web/components` by composing `@workspace/ui` components and Tailwind utility classes. Only edit files under `packages/ui/src/components` when the change should apply everywhere the component is used.
- **Style with Tailwind and the theme tokens** defined in `packages/ui/src/styles/globals.css` (e.g. `bg-primary`, `text-muted-foreground`). Do not add CSS modules, styled-components, or inline style objects for things Tailwind can express.
- **Icons** come from `lucide-react` (the configured shadcn icon library).

## Commands

Run from the repo root; Turbo fans them out to every workspace.

```bash
pnpm install
pnpm dev          # start apps/web
pnpm lint         # eslint, zero warnings allowed
pnpm typecheck    # tsc --noEmit
pnpm test         # vitest run
pnpm check        # lint + typecheck + test
pnpm build
```

Before finishing any change, make sure `pnpm check` passes.

## Testing

- Vitest + React Testing Library, jsdom environment.
- Co-locate tests as `*.test.ts(x)` next to the code in `packages/ui/src`; put app tests in `apps/web/__tests__`.
- Query by role and accessible name; avoid snapshot tests.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
