# Feature

Use for `/pstack feature <task>` or a request to implement a feature through design, verification, and PR delivery. Prefer a narrower playbook for skill adaptation, prototypes, or existing PR work.

Adapted from [upstream feature.md](https://github.com/cursor/plugins/blob/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/poteto-mode/playbooks/feature.md). The MIT notice is in [LICENSE](../../LICENSE).

You own the design. Plan, review, and verify. Follow the user's scope and stopping point. Importing this playbook does not start feature delivery or authorize publication of the import itself.

## Steps

1. Ground the affected subsystem with how.
2. Explore the design with architect.
3. Record the throughput checkpoint.
4. Implement the chosen design.
5. Verify on the matching surface.
6. Organize small, ordered commits.
7. Resolve contested design claims.
8. Run Opening a PR.

### 1. Ground the affected subsystem with how

Use [how](../../how/SKILL.md) to trace the affected subsystem. Carry the user's requirements and any prototype decision into the grounding. Define acceptance criteria with observable verification methods.

### 2. Explore the design with architect

Use [architect](../../architect/SKILL.md) through its design phases here. Its implementation phase belongs to step 4 below. Follow its sequential candidate comparison and record the chosen shape, rejected alternatives, and reasons. Reuse valid grounding and prototype evidence. Do not treat a throwaway prototype as production code.

### 3. Record the throughput checkpoint

Write these four todo items. Keep an inapplicable item with `n/a: <reason>`.

- **Blocking first steps.** Run prerequisite checks before dependent work.
- **Independent workstreams.** Identify disjoint files, services, or layers. Ordinary delivery stays sequential. Parallel workers require an explicit swarm or an executing autopilot workflow.
- **Shared mutable state.** Read [Separate Before Serializing Shared State](../../principle-separate-before-serializing-shared-state/SKILL.md). Give authorized concurrent writers isolated checkouts and runtime state. Serialize only when a shared writer is a real invariant.
- **Smallest safe decomposition.** Name the owner of coupled changes and explain the chosen decomposition. One feature or migration stays with one owner unless independent artifacts justify splitting it.

Update the checkpoint when dependencies or ownership change. Record the ordered delivery units, verification gates, and current blocker.

### 4. Implement the chosen design

Use the configured session model and implement ordinary work sequentially. Read [Model the Domain](../../principle-model-the-domain/SKILL.md) and name the data shape and its organizing structure before writing logic. Define file scope and success criteria. Follow the entrypoint's code, TypeScript, and Comments instructions.

If several implementation shapes remain viable, compare them against the requirements before choosing. Use the local architect workflow for a structural change. Review the completed diff in a separate pass. This direct review is self-review, not upstream Arena's independent cross-judge or delegated implementation review.

Within an explicitly invoked swarm or executing autopilot workflow, follow that workflow's delegation, isolation, and verification rules. Give each worker its assigned phase and scope, not an instruction to restart Feature recursively. Use fresh owners for new rounds unless existing runtime state requires reuse.

Keep edits scoped. Re-ground upstream-derived changes against their source. Apply shared component improvements to all affected consumers and verify each. Preserve unrelated and uncommitted work.

### 5. Verify on the matching surface

Run `pnpm check` and the task-specific verification for every acceptance criterion. Use the project's verification skill when available, or available browser, terminal, and runtime tools. For UI previews, follow [the preview guide](../../../../docs/development/previews.md) and retain the launch session handle.

Read [Prove It Works](../../principle-prove-it-works/SKILL.md). Exercise the changed behavior directly. Inconclusive evidence or evidence from the wrong surface is not a pass. Report an access blocker and leave the affected criterion unverified if no valid equivalent exists.

### 6. Organize small, ordered commits

Use [Sequence Work into Verifiable Units](../../principle-sequence-verifiable-units/SKILL.md). Verify each unit before proceeding to the next. Organize commits and stack follow-ups when needed. Respect a user request to leave work uncommitted. Do not rewrite shared history or discard unrelated work to produce a cleaner sequence.

### 7. Resolve contested design claims

State the disputed claim, compare alternatives against the requirements, and verify the claim against source or runtime evidence. Record the decision and any unresolved issue. Direct review replaces the unbundled Interrogate workflow here. Do not describe it as independent or multi-model review. An unresolved correctness issue blocks a ready PR.

### 8. Run Opening a PR

Follow [Opening a PR](opening-a-pr.md) to commit, push, and publish the verified change unless the user set an earlier stopping point. Report pending verification rather than claiming readiness. Feature does not authorize merging. Landing follows [Shipping](shipping.md) or an executing Autopilot-full queue, including its independent-verifier requirement.

## Dependencies and local adaptations

The linked skills, principles, and PR playbooks are installed locally. Upstream also calls [Arena](https://github.com/cursor/plugins/blob/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/arena/SKILL.md) for competing implementations and [Interrogate](https://github.com/cursor/plugins/blob/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/interrogate/SKILL.md) for contested designs. Their Cursor model rules, parallel runners, and independent review workflows are not imported. This port uses local sequential design comparison and explicitly labeled self-review. It preserves the independent verification required for shipping and autopilot.

## Reply

Explain what you built, what you chose and why, the throughput checkpoint, verification results, and open decisions. Use a table when design alternatives need comparison. Include the actual PR URL when published, or state the user's earlier stopping point.
