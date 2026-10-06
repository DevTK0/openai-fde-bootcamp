---
name: swarm
description: "Fan out N parallel workers, drain them, and return one report. Use for /swarm, 'swarm this', or parallel coverage, races, gauntlets, and exploration."
---

# Swarm

Fan out N independent Codex workers. They may cover separate slices, race the same brief, or mix both. The parent waits, aggregates, and returns one report.

## Start

Open a todolist with one entry per phase before launching anything.

1. Frame
2. Fan out
3. Aggregate
4. Report

## Phase A: Frame

1. State the done predicate and the artifact or report the swarm must return.
2. Choose the shape. Partition into slices, race N workers on identical briefs, or mix both. For a race or mixed shape, declare `first pass`, `rank all`, or `best-of` before spawning.
3. Set N from the user or derive it from the shape. N is total workers, not the Codex concurrency limit. Queue excess workers in waves; reserve capacity for verification rather than filling every slot with waiting owners.
4. Use the Codex session model unless the user explicitly selects another available model. Do not guess model IDs or install another agent runtime. For a requested model comparison, name the actual models and disclose any unavailable choices.
5. Give each worker its own writable output when it writes. When workers verify or measure commits, each brief names the exact SHAs. A measurement brief also names the method (sample count, what one sample is, order). The worker records both in its result.

## Phase B: Fan out

Launch workers through Codex subagent tools up to the available concurrency limit. Give each worker the repository guidance and only its assigned scope. Independent verification uses fresh contexts that did not author the change. When slots are scarce, complete owners first and then schedule verification in waves. If independent agents are unavailable, report `BLOCKED`; do not call self-review a swarm verdict.

For a specific revision, prepare an isolated checkout/worktree at the exact SHA and include its absolute path in the brief. Workers sharing the Codex filesystem must not share writable checkouts, ports, data directories, or browser sessions. Use separate verification instances; serialize a live lane when its runtime cannot be isolated. Verifiers do not edit the owner's branch or production code.

Every brief stands alone. Include the goal, scope, exact slice or race arm, how to verify, and what to report. Reports use `PASS`, `ISSUES`, or `BLOCKED` with evidence. A worker that can prove a defect reports `ISSUES` and lists every issue it can prove, not only the first.

If a worker drops out, continue collecting the others and record missing coverage. A required missing lane blocks a clean verdict; replace it or report `BLOCKED`. On stop, tell every worker to stop writes, interrupt active workers, and confirm they are stopped before reassigning any writable location.

## Phase C: Aggregate

Read the terminal results. Drop a result that does not record the SHAs and method its brief names, and respawn that worker once. After a second miss, record a gap. A gap does not count as a pass. For coverage, every required slice needs a valid result. Autopilot verification always uses coverage, never a race where an early pass hides another lane's findings. Inspect the referenced artifacts and confirm they match the reported revision; summaries alone are not proof. For a race, apply the selection rule declared up front. Use first pass, rank all, or best-of. Do not paste raw worker dumps.

Keep a compact result table, one-line evidenced issues, and explicit gaps or dropouts.

## Phase D: Report

Return one consolidated in-chat report with the table, issue one-liners, gaps or dropouts, and the race rule when used.
