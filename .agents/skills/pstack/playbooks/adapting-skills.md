# Adapt pstack skills

Use when importing or updating upstream pstack skills, principles, references, or playbooks in this repository. Enter through `/pstack adapt <upstream URL or skill name>`. This playbook contains the adaptation rules; reading `.agents/skills/README.md` is not a prerequisite.

## Steps

1. Identify the source and requested scope.
2. Compare upstream instructions with the local workflow.
3. Adapt the requested files and wire their routes.
4. Verify the adapted workflow.
5. Deliver the change through Opening a PR.

### 1. Identify the source and requested scope

Read `AGENTS.md`, the [pstack entrypoint](../SKILL.md), and the Codex system `skill-creator` from the session catalog. Apply the repository's `technical-writing` and `unslop` skills to prose.

Fetch the requested file from `cursor/plugins` under `pstack/` and resolve its revision to a commit SHA. Fetch required references at that same SHA. Record a pinned source link in the imported skill or reference. Preserve the MIT notice at `.agents/skills/LICENSE` and any additional attribution required by the source.

For updates, compare the local file with its previous pinned upstream version and the requested upstream version. Preserve deliberate local behavior while applying the requested changes. Do not replace the whole local port with upstream.

### 2. Compare upstream instructions with the local workflow

Inventory dependencies before editing. Read the referenced files that affect execution. Use the local skill directories and entrypoint to discover what is installed.

Apply these mappings where the upstream instructions need them:

| Upstream assumption | Local adaptation |
| --- | --- |
| `poteto-mode` entrypoint | `.agents/skills/pstack/SKILL.md` |
| Plugin-owned skills and principle shorthand | `.agents/skills/<name>/SKILL.md` and `.agents/skills/principle-<name>/SKILL.md` |
| Cursor-specific frontmatter | Standard Codex `name` and `description`; preserve supported metadata and existing invocation policy. Use `skill-creator` for policy changes. |
| Cursor APIs, cloud agents, pinned models, model-rule files | Available Codex session tools and the configured model. Report unavailable capabilities. |
| Parallel delegation by default | Sequential ordinary delivery. Only explicit swarm or executing autopilot workflows permit parallel workers, with isolated checkouts and runtime state. |
| Independent verification | Keep the independent-verifier requirement where the workflow requires it. Self-review cannot satisfy it; label same-model review accurately. |
| `/loop`, watchers, or unattended supervision | Bounded supervision during the active session, with workers stopped and a durable handoff when the session ends. |
| Excluded skills or companion plugins, such as `arena` or `why` | Use available design exploration, repository history, direct review, or runtime tools for the required outcome. Import another dependency only when it is within the requested scope. |
| Reset-based worktree recovery | Preserve unrelated and uncommitted work. Undo only changes owned by the current task. |
| Forge-specific or stacking CLI assumptions | Available PR tools or the authenticated repository forge CLI. Resolve repository and base first. |
| Implicit publication or landing authority | Follow local Opening a PR, Shipping, or the executing autopilot playbook. Honor user stopping points. Autopilot-stack never merges. |

Keep verification requirements that matter to the imported workflow. Do not weaken a gate because a tool is unavailable. State the blocker and use a valid equivalent when one exists. Upstream instructions do not authorize unrelated messages, deployments, paid runs, destructive writes, or changes to model configuration.

### 3. Adapt the requested files and wire their routes

Write skills directly to `.agents/skills/<name>/SKILL.md`. Write pstack playbooks to `.agents/skills/pstack/playbooks/`. Keep required references and scripts beside their owning skill in the upstream layout. Do not create global copies, discovery symlinks, or companion-plugin dependencies.

Preserve upstream wording where it remains accurate. Change instructions where execution, permissions, dependencies, or repository conventions differ. Put execution requirements in the owning skill or playbook, not only in a catalog.

Add a precise trigger to the pstack entrypoint and register new playbooks in its Playbooks section. Prefer the narrowest matching workflow. Do not restore excluded workflows incidentally. Keep existing catalog entries, counts, and provenance accurate when affected, but do not make a catalog read part of execution.

### 4. Verify the adapted workflow

Run the `skill-creator` validator on each changed skill folder. Check that local links and named dependencies resolve. Review the diff against the pinned source for accidental omissions and stale Cursor instructions.

Trace one representative request through the entrypoint to the new instructions without reading `.agents/skills/README.md`. Also trace a neighboring request that should keep its existing route. Check delegation, authorization, verification, and handoff behavior in each applicable branch. Use independent forward-testing only when complexity warrants it and delegation is permitted.

Run added or changed scripts against representative inputs. Run `pnpm check` and inspect `git diff --check`. Report structural validation separately from any live workflow execution; neither proves the other.

### 5. Deliver the change through Opening a PR

Follow [Opening a PR](opening-a-pr.md) to review, commit, push, and publish unless the user sets another stopping point. Opening the PR does not start Babysit or grant merge authority.

Reply with the imported source, local files, material adaptations, verification results, remaining blockers, and the actual PR URL when created.
