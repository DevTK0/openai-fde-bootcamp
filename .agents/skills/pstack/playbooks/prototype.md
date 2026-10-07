# Prototype

Use for `/pstack prototype <decision>` or a request to compare throwaway designs before implementation.

Adapted from [upstream prototype.md](https://github.com/cursor/plugins/blob/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/poteto-mode/playbooks/prototype.md). The MIT notice is in [LICENSE](../../LICENSE).

You own the design decision. The prototype is a throwaway instrument. Production implementation follows [Feature](feature.md) when requested.

For prototype work, prioritize cheap design evidence over production polish. Read the [Laziness Protocol](../../principle-laziness-protocol/SKILL.md) for the usual baseline. Here, avoid production abstractions and test suites for disposable artifacts. Keep repository checks and direct observation of the decision. Propose useful variations, discard an approach, and try another. Keep planning to the decision and the steps below.

## Steps

1. Scope the decision the prototype exists to make.
2. Gather references when the design space is open.
3. Build a throwaway artifact in isolation.
4. Put alternatives behind one labeled switcher.
5. Verify on the matching surface.
6. Present the decision and hand off the chosen direction.

### 1. Scope the decision the prototype exists to make

Name the layout, interaction, density, behavior, timing, or approach to decide. No decision means no prototype. Use [Feature](feature.md) when implementation is requested, or return to the [pstack entrypoint](../SKILL.md) for the requested scope.

### 2. Gather references when the design space is open

Search for prior art and summarize a moodboard of themes, palettes, and layouts. Let the user pick directions before building when their preference determines the comparison. If the request already gives enough direction, proceed. Skip this step when the direction is set.

### 3. Build a throwaway artifact in isolation

For a standalone layout or interaction decision, use plain HTML, CSS, and JavaScript in an isolated scratch directory outside production source. Native HTML controls and plain CSS are allowed under the throwaway-prototype exception in `AGENTS.md`. Use a lightweight local server when needed. Do not set up an app worktree merely to render an idea.

Use an isolated worktree of the relevant app when the decision depends on existing components, app state, routing, or integration. In that worktree, follow `AGENTS.md` for shadcn components, Tailwind tokens, and framework guidance. Use the app's `pnpm dev` script and follow the [preview guide](../../../../docs/development/previews.md). Share the full HTTPS `Preview:` URL, including the app path.

Retain the terminal session handle for every server you start. Stop only your own launch through its session. Keep all experimental code disposable and separate from the working checkout's production source.

For a behavioral or timing decision, use the smallest script that exercises the question in an isolated scratch directory. Avoid production abstractions and tests for the disposable artifact. Run alternatives sequentially unless an explicit swarm or executing autopilot workflow authorizes parallel workers.

### 4. Put alternatives behind one labeled switcher

When comparing visual alternatives, use buttons or a keypress to switch between labeled variants. For scripts, use a variant argument or labeled output. Read [Exhaust the Design Space](../../principle-exhaust-the-design-space/SKILL.md) and compare structurally distinct alternatives when the answer is not obvious.

### 5. Verify on the matching surface

For a visual decision, screenshot each variant and drive its interaction with the available Codex browser tools. Use a project-local verification skill if one exists. For a behavioral or timing decision, observe the thing you are deciding by logging timing, printing output, or watching the render. Read [Explain the Number](../../principle-explain-the-number/SKILL.md) before relying on measurements.

The observation is the experiment's test. A build or screenshot alone does not prove an interaction. If the required runtime or browser is unavailable, report the blocker and leave the decision unverified. Run `pnpm check` before handing off repository changes.

### 6. Present the decision and hand off the chosen direction

Present alternatives, tradeoffs, and a recommendation. The output is the decision plus the throwaway artifact. Hand the chosen direction and evidence to [Feature](feature.md) when implementation is requested. Use the local [architect skill](../../architect/SKILL.md) for design-only work and stop before its implementation phase. Continue only within the user's requested scope.

## Reply

Include the variants explored, the evidence, tradeoffs, your recommendation, and the scratch or worktree path. Use screenshots for a visual decision and observed output or timing for a behavioral one. Include the full preview URL when available. State plainly that the prototype is throwaway and identify any unverified decision.
