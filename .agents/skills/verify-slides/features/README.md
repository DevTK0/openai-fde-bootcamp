# Slides verification map

This map is the maintained verification source for `apps/slides`. Launch and
clean up with [verify-slides](../SKILL.md). Choose features by the behavior changed,
then cover their listed entry points. Source inspection alone is not a live pass.

## Baseline

The gallery has Scheduling, Maintenance, Ridership, and LionLink AI scheduling.
Their current page counts are 25, 24, 14, and 8. Reconcile those counts with the deck exports after intentional
page changes. Use an owned authoring preview and a dedicated browser tab. Back up
files before editing, including uncommitted content. Mutation recipes restore
original content after collecting evidence.

## Features

| Feature | Required evidence |
| --- | --- |
| [Navigation, presentation, and notes](navigation-notes.md) | Gallery and direct-link navigation, page controls, presentation, and note persistence. |
| [Native editability](native-editability.md) | Separate text and shape selection, native Save, file diff, reload, and restoration. |
| [Inspector comments and current selection](inspector-comments.md) | Fresh viewer state, persisted comment marker, applied change, and marker removal. |
| [Themes and design](themes-design.md) | Theme gallery and demo, or an explicit empty state; token editing where supported. |
| [Steps and transitions](steps-transitions.md) | User-driven reveal order and page transitions on decks that declare them. |

## Coverage reporting

Record feature IDs and each entry point as passed, failed, blocked, or not run.
An empty theme gallery does not verify theme editing. A deck with no animation
does not verify steps or morphs. Use an authorized scratch fixture when that
behavior is in scope, following the corresponding authoring skill, and remove it
in cleanup. Never silently add content to a user's deck to satisfy a check.

This map was seeded from repository source and the installed Open Slide 2.0.1
implementation. Live validation status belongs in the run report. Until an
end-to-end run succeeds, the generated skill remains a draft.
