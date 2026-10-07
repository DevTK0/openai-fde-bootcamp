# Upstream integration

This local skill supplies input to pstack. It does not replace pstack's design or
delivery workflows. The comparison below uses `cursor/plugins` revision
`9f451cf875ad1239912762f67741e8e5ba6ac0f1`. The repository's existing pstack MIT
notice remains in `.agents/skills/LICENSE`.

| Upstream source | Integration decision |
| --- | --- |
| [Feature](https://github.com/cursor/plugins/blob/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/poteto-mode/playbooks/feature.md) starts with `how`, then `architect`, and verifies the affected behavior. | Carry a grounded brief into the installed skills. Each acceptance criterion needs an observable verification method. The local port does not include Feature, so do not reference it as an installed playbook. |
| [Architect](https://github.com/cursor/plugins/blob/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/architect/SKILL.md) carries grounding findings into design and makes human design approval opt-in. | Reuse repository findings as design constraints. Do not duplicate architectural decisions in intake or add a mandatory brief approval. |
| [Multi-phase plan](https://github.com/cursor/plugins/blob/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/poteto-mode/playbooks/multi-phase-plan.md) produces a plan and explicitly forbids implementation during planning. | Give plan-only prompts an explicit stop. Order requested units by dependencies and name their verification evidence. Do not import its full program template for a small feature brief. |
| [Investigation](https://github.com/cursor/plugins/blob/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/poteto-mode/playbooks/investigation.md) returns a cited answer without code or PR work. | Preserve an investigation stopping point when the user needs an answer before choosing a feature. Use the installed `how` skill. |
| [Recall](https://github.com/cursor/plugins/blob/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/recall/SKILL.md) rebuilds context from agent history. [Automate me](https://github.com/cursor/plugins/blob/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/automate-me/SKILL.md) derives personal conventions. | Neither replaces task intake from a supplied employee transcript. Do not mine other chats or infer durable user preferences from the transcript. |

Upstream's mandatory delegation, Cursor model configuration, `arena`, `interrogate`,
and companion control skills are not dependencies of this integration. The local
pstack entrypoint owns delegation, verification, and publication rules. Importing
those workflows would be a separate adaptation task.

The intake skill remains local. The comparison informs its boundaries rather than
claiming that upstream ships a transcript-to-feature workflow. Required execution
instructions live in `SKILL.md`; this reference explains their origin.
