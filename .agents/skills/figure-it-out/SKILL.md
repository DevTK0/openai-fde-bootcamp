---
name: figure-it-out
description: "Design an auditable playbook when no narrower one fits: a large migration, an ambitious multi-part change, or work a human reviews after stepping away. Scales rigor to the task, runs a hypothesis loop, and logs decisions via show-me-your-work. Use for /figure-it-out, 'figure it out', a large migration, or when no narrower playbook applies."
---

# Figure it out

When the task matches no playbook, design one. The deliverable before any code is the workflow itself: a sequence of phases that scales rigor to the task, runs the scientific method, and leaves a decision trail a human can audit after stepping away.

Adapted from [upstream pstack](https://github.com/cursor/plugins/blob/df581122cde17e6e27686b5a448bde23e4ad4318/pstack/skills/figure-it-out/SKILL.md). The MIT notice is in [LICENSE](../LICENSE).

## Start

Open a todolist whose first item is to read the Principles section of the [pstack](../pstack/SKILL.md) skill. Then add the phases below as todos. Follow its scope, authorization, and delegation rules. Resolve principle shorthand to `.agents/skills/principle-<name>/SKILL.md` and supporting skills to `.agents/skills/<name>/SKILL.md`. Read each skill before applying it.

## Phase A: Frame

Ground first, then commit. Don't start the run until you can state:

- The definition of done as a falsifiable predicate (the **prove-it-works** principle skill).
- Scope, quantified: rough units and effort, plus the blockers grounding surfaced.
- The rigor level, biased high. One-way doors and high blast radius get more. Reversible low-stakes steps get less. Rigor is gates and artifacts, not "try harder".

Present the framing and tradeoffs before committing to a long run. Reversible work proceeds (the **never-block-on-the-human** principle skill), and a multi-hour run gets a progress checkpoint. Ask only when missing information or authorization blocks the next action.

## Phase B: Design the workflow

Decompose into atomic, independently-landable units. Sequence riskiest-unknown-first. Scaffold and verification come before features (the **foundational-thinking** principle skill).

- Build the verification harness before the work, with the baseline captured from the pre-change state, so the check reads as "old value vs new value".
- For one-way-door design decisions, run the **architect** skill and compare alternatives using the available Codex tools. Skip it for mechanical work whose shape is already concrete. Repeating design exploration over a settled design is unnecessary work (the **laziness-protocol** principle skill).
- Execute ordinary work sequentially. Parallel workers require an explicitly invoked **swarm** or an executing autopilot workflow. Within those workflows, separate writable checkouts and runtime state, and reserve verification capacity (the **separate-before-serializing-shared-state** principle skill). This skill alone does not authorize delegation.
- Write the designed phase list down. That list is what the human reviews.

Then execute the design. Add its steps to the todolist as concrete items, after the Phase C entry and before Phase D. Run each under the Phase C loop discipline, and weave the Phase D log through them, a row as each step lands, rather than saving the whole trail for the end.

## Phase C: Run the loop

Each unit is an experiment. State the hypothesis, make the smallest change, measure against the predicate on the real artifact, keep it if it advanced, undo only your own unit's changes if it didn't. Preserve unrelated and pre-existing work.
Apply the **sequence-verifiable-units** principle skill, verifying each unit before starting the next instead of batching checks at the end.

- Verify by inspecting the artifact, never a self-report. When something passes too easily, suspect the observation method before the system.
- Pair delegated work with a judge. If a worker bypasses the verification gate, reject the result and strengthen the contract without discarding unrelated work. If the gate itself is wrong, fix the gate in its own change rather than routing around it.
- A verdict is VERIFIED, NOT VERIFIED, or INCONCLUSIVE. Inconclusive is not a pass. Don't hide a negative.

## Phase D: Keep the audit trail

Log the run via the **show-me-your-work** skill. figure-it-out's work is usually ambitious enough to commit the trail so the reviewer can read it in the PR. The trail plus the diff is what lets the human come back and trust the work.

## Phase E: Verify and hand back

Check the whole against the Phase A predicate on the real product, not just the harness. Encode any recurring correction as a gate, a lint rule, a check, or a script (the **encode-lessons-in-structure** principle skill).

Use the matching pstack delivery playbook for PR creation or landing. This workflow grants no additional authority to merge, deploy, delete data, or contact others. Supervise work only during the active session and persist a handoff if it ends.

**Reply:** the playbook you designed, the rigor level and why, the decision-trail path, what's verified against the predicate, and what's still open.
