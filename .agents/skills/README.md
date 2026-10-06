# Pstack for this repository

A selected port of [pstack](https://github.com/cursor/plugins/tree/main/pstack).
The entrypoint is **`/pstack`**, adapted from upstream `poteto-mode`. The original
principle text and selected workflows are retained, with focused changes for
Codex execution and this repository's rules.

## Start

Follow [AGENTS.md](../../AGENTS.md#pstack-skills) for developer setup. Example:

```text
/pstack verify this change, commit it, and open a PR.
```

`AGENTS.md` routes `/pstack` messages to [pstack/SKILL.md](pstack/SKILL.md).
Codex discovers the entrypoint directly in `.agents/skills/pstack`. Codex's native skill selector uses `/skills` or `$pstack`; `/pstack` is
our repository prompt alias, not a new built-in Codex command. If a client
intercepts unknown slash commands, use `$pstack` or explicitly ask the agent to
read `.agents/skills/pstack/SKILL.md`. See the [official skill discovery documentation](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills).

All 36 skills (the entrypoint, 11 supporting skills, and 24 principles) are
stored directly in `.agents/skills/`. Playbooks are loaded
by `/pstack`. Edit the skill sources in place. The skills are available to Codex on the next turn.
No global installation, model configuration, or companion plugin is required.
The original pstack repository is a provenance reference, not a runtime
dependency. Agent-facing skill edits use Codex's built-in `skill-creator`, resolved
from the session skill catalog. Removed pstack skills are not fetched or invoked.

## Included subset

All **24 principles** are included. Their index and triggers are in
[pstack/SKILL.md](pstack/SKILL.md#principles); each full text lives in its
`principle-*/SKILL.md` folder.

| Supporting skill | Purpose |
| --- | --- |
| [create-verification-skill](create-verification-skill/SKILL.md) | Generate and exercise a project-specific verification skill and feature map. |
| [maintain-verification-skill](maintain-verification-skill/SKILL.md) | Audit source and live behavior against an existing verification map. |
| [typescript-best-practices](typescript-best-practices/SKILL.md) | Apply the type-system principles to TypeScript. |
| [swarm](swarm/SKILL.md) | Coordinate independent workers and aggregate evidence-backed coverage. |
| [figure-it-out](figure-it-out/SKILL.md) | Design an auditable workflow when no narrower playbook fits. |
| [how](how/SKILL.md) | Trace the system before changing it. |
| [architect](architect/SKILL.md) | Sketch usage, types, and boundaries before implementation. |
| [tdd](tdd/SKILL.md) | Failing-before, passing-after evidence for cheap regression tests. |
| [unslop](unslop/SKILL.md) | Remove AI writing patterns. |
| [technical-writing](technical-writing/SKILL.md) | Structure clear documentation and technical explanations. |
| [show-me-your-work](show-me-your-work/SKILL.md) | Preserve decision evidence, as referenced by Prove It Works. |

The **7 playbooks** cover:

| Area | Playbooks |
| --- | --- |
| Autopilot | [autopilot-full](pstack/playbooks/autopilot-full.md), [autopilot-stack](pstack/playbooks/autopilot-stack.md) |
| Autonomous execution | [autonomous run](pstack/playbooks/autonomous-run.md) |
| Skill maintenance | [adapting skills](pstack/playbooks/adapting-skills.md) |
| PR lifecycle | [opening a PR](pstack/playbooks/opening-a-pr.md), [babysit](pstack/playbooks/babysit.md), [shipping](pstack/playbooks/shipping.md) |

There are **11 supporting skills**, plus the entrypoint and all 24 principles.
The verification skills are generators and maintenance workflows; no app-specific
`verify-*` skill has been generated yet. Invoke `/pstack create a verification
skill for apps/web` to run that workflow separately.

General feature, bug-fix, investigation, prototype, refactoring, eval,
performance/forensics workflows, arena/interrogate, general orchestration,
model setup, session handoff, and the remaining
situational skills and playbooks are not included. Motivation and regression
history use git history and available design records directly; the broader
`why` connector workflow is not bundled.

## Upstream and local changes

Imported from `cursor/plugins`, directory `pstack`, at commit
[`df581122cde17e6e27686b5a448bde23e4ad4318`](https://github.com/cursor/plugins/tree/df581122cde17e6e27686b5a448bde23e4ad4318/pstack).
Upstream's MIT notice is preserved in [LICENSE](LICENSE).

- Added `autonomous-run` from the same revision, replacing Cursor loops and watcher defaults with bounded session waits, scoped fixes, and explicit handoff instructions.
- Added `figure-it-out` from the same revision, with local skill resolution, sequential delivery, scoped rollback, and session-bound supervision. Removed Cursor-only invocation frontmatter, consistent with the other imported skills.
- Renamed `poteto-mode` to `pstack` and trimmed its routing to the bundled subset.
- Preserved the principles with focused corrections to nonnegative-duration
  modeling and test-assertion guidance. TypeScript examples also preserve tuple
  invariants with immutable copies. Removed Explain the Number's link to the
  excluded benchmark skill. Removed Cursor-specific frontmatter
  from skill files; retained standard `name` and `description` fields.
- Replaced Cursor tool APIs, pinned model identifiers, model-rule paths, loop
  commands, and transcript locations with Codex execution instructions.
- Added explicit sequential and same-model fallbacks. They cannot claim
  independent or multi-model review.
- Replaced excluded companion-plugin steps with direct diff/comment review and
  available runtime tools. PR creation automatically commits, pushes, and
  opens a PR, matching upstream unless the user sets a different stopping point.
- Added verification/TypeScript skills and delivery playbooks from
  the same revision. Generated verification
  sources live directly in `.agents/skills/`.
- Replaced the unbundled PR watcher, Origin-specific CLI assumptions, and Cursor
  cloud agents with Codex PR tools and subagents. Preserved shipping's
  independent-verifier gate and verification reuse. Patch equivalence uses a
  whitespace-preserving diff rather than patch IDs; relevant base changes
  require reassessing affected verification. Shipping untrusted contributor PRs
  requires verification isolated from landing credentials and shared Git state.
- Preserved unrelated work instead of upstream reset-based worktree recovery.
- Adapted upstream review triage to check PR comments, reviews, and threads
  regardless of reviewer. Historical examples remain attributed to upstream.

Ordinary delivery executes sequentially. Explicit swarm requests and autopilot
queues allow isolated parallel workers within Codex capacity. Swarm verification
requires every lane's evidence at the exact revision; missing lanes block a clean
verdict. Same-model agents are allowed, but self-review is not independent proof.

Autopilot-full builds and lands independent PRs under the operator's merge grant.
Autopilot-stack builds and verifies one linear stack and leaves landing to the
human. Both open early PRs as work records, retain decision/child-agent trails,
and supervise progress during the active Codex session. They do not install a
scheduler or continue unattended after the coordinator session ends. Session
handoffs preserve queue/PR state, exact revisions, evidence, and outstanding work.

The autopilot port retains the upstream ownership and verification structure,
replacing Cursor cloud agents, `/loop`, pinned model rules, and companion cleanup
skills with Codex agents, bounded session supervision, and direct diff review.
Stopped writers must be confirmed before branch reassignment. Stack topology has
one writer, and lease-protected pushes use the captured remote tip.

Codex instructions live directly in the affected skills and playbooks.
For imports and updates, follow [Adapting skills](pstack/playbooks/adapting-skills.md), routed directly from the pstack entrypoint. That playbook contains the procedure and adaptation rules without requiring this README. Supporting
references and the decision-log helper retain their upstream layout.

## MVP discussion

The next useful step is to generate and prove a verification skill for the web
app, then pilot a small queue through Autopilot-stack before granting automatic
landing through Autopilot-full.
This import adds workflow instructions; it does not start a verification run,
open or merge PRs, or install an unattended factory.
