### Opening a PR

Use when preparing a change for PR delivery. Commit, push the task branch, and open a PR without a separate permission question. Honor an explicit user stopping point. Status-only requests do not create PRs. Run `pnpm check` and task-specific verification first. Autopilot is the exception for early publication: publish the owner's first scoped snapshot before live self-proof, clearly report pending verification, then run the full gates before declaring it ready to land.

**Worktree.** Use the existing task worktree when suitable, or create an isolated worktree from the intended base. Give concurrent writers separate worktrees. Preserve unrelated and uncommitted work; never reset or discard it to simplify this workflow.

**Commits.** Commit liberally within the task scope. Organize small, ordered commits before opening PRs without rewriting unrelated or shared history. Each commit is a future PR: landable, ordered to tell the story. Amend when the fix belongs in a just-made commit. New commit when separable.

**PRs.** Review the diff for unnecessary complexity, unrelated changes, and generated boilerplate before commit. Apply the entrypoint's Comments guidance before review. Write every PR title, PR description, and commit body with `/technical-writing`, then apply `/unslop`. Apply every technical-writing layer except Diátaxis. Use one word for each action, keep articles, and avoid `-ing` when a plain verb works.

**Titles.** Use Conventional Commits in the form `type(scope): subject`. Use `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, or `perf` as the type. Use the changed area, such as `pstack` or `web`, as the scope. Keep the subject short and imperative. Name a real symbol when one carries the change. For example, `fix(pstack): retarget opening-a-pr babysit trigger`. Do not add a trailing period.

**Descriptions.** The PR body is a briefing, not the lab notebook. A reviewer who has the diff should learn why the change exists, what it leaves out, what it could break, and how you proved it works, in under a minute. Write short, simple sentences with few identifiers. Do not write walls of text. The squash commit body is the PR body. If the body would make the squash commit longer than about 40 lines, cut the body.

Put each section under a `##` heading, not a bold lead-in, so the sections stand apart. Use these sections in order. Drop a section when it has nothing to say.

- `## Why` gives the problem and the approach in one to three short sentences. Do not list SHAs or rebase genealogy. Do not add a "based on main" preamble.
- `## What changed` has one to three short bullets. Name a real symbol or path only when it carries the change. Name both sides of a rename or retarget.
- `## Scope` always names what the PR covers and what it deliberately leaves out, for example a related follow-up or a known gap. Use one to three short items. Do not list symbols or paths, and do not write a file-by-file essay.
- `## Tradeoffs` names only rejected alternatives that a reviewer would otherwise ask about. Skip this section when there was no real choice.
- `## Blast Radius` gives one or two sentences on who or what the change touches and why that is safe or risky. If main is red, state the cost of leaving it red.
- `## Verification` has one to three bullets. Each bullet names a real run path and its outcome. For a performance change, report one primary number with its unit in `before → after` form. Link the verification artifacts for the remaining evidence. Do not include sample-size methodology, worker recitals, or metric tables.

After these sections, attach videos or screenshots when they prove a claim. Do not paste full SHAs, worker-by-worker recitals, lever-correction essays, file-by-file checklists, or "CLEAN" verdicts. Put these details in a linked artifact. A commit body does not restate its subject.

**Forge.** Resolve the repository, remote, and intended base branch before the first PR operation; do not assume `main`. Prefer Codex's native PR tools when available; otherwise use an authenticated forge CLI such as `gh` for GitHub. Use the same repository and forge throughout. Do not require an additional stacking CLI. In T3 Code, when the tools are available, call `link_pull_request` with the full URL immediately when creating or starting work on each PR. Before finishing, call `list_thread_pull_requests` and link any missing PR from this work. Report linking failures. Use structured arguments or body files for descriptions and comments.

**Size and stacks.** Prefer five narrow PRs to one large PR. A stack is a base-branch chain. The root PR targets trunk. Each child branch rebases onto its parent's exact tip and its PR targets the parent branch. Use the selected forge's create/edit operations to set each child's base to its parent branch. Branch from trunk only for independent work. Rebase on trunk before substantial stack work.

**Readiness.** Honor the user's draft/ready preference. For ordinary delivery, open ready only when verification is complete. Autopilot opens an early PR as its durable work record, following the operator's draft preference and clearly labelling pending proof; publication is not merge readiness. Read back the actual PR state before reporting its status.

**Babysit.** Opening a PR does not start a babysit. Post the URL and keep building. Finish the phase or stack first. Run a separate babysit pass only when the user asks for one after the whole stack exists. A babysit for each new PR stalls the build and spends checks on commits that later waves restart. Push back when feedback drifts from intent.

A subagent that opens a PR reviews the diff and comments, and posts the URL. It returns to the parent without babysitting unless its task explicitly includes the babysit loop.

An Autopilot-full or Autopilot-stack owner brief includes the babysit loop. That assignment starts babysitting after the code-ready report without a second user request or waiting for the whole stack. Autopilot-full owns its branch rebases; Autopilot-stack reserves topology changes for the root.
