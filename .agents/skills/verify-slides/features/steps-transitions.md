# Steps and transitions

Users advance through staged content and page changes without losing content or
breaking the geometry of objects that move between pages.

## Sub-features

- `steps-forward` reveals content in the authored order.
- `steps-jump` shows a complete page when selected from the overview.
- `transition-both-directions` animates forward and backward page navigation.
- `morph-continuity` preserves shared-object continuity between pages.

## How to get to it (user POV)

- Open a deck that declares Steps, SlideTransition, or MorphElement.
- Enter Present and advance with ArrowRight or Space; go back with ArrowLeft.
- Select the stepped page directly from its thumbnail or overview entry.

## Driving it with T3 preview

Preconditions:

- Inspect the target deck to identify actual animated pages. Existing business
  decks are static; absent primitives mean these checks are not applicable.
- Read the relevant [steps](../../slide-authoring/references/steps.md),
  [transitions](../../slide-authoring/references/transitions.md), or
  [morph](../../slide-authoring/references/morph.md) reference before driving.

1. Start `preview_recording_start` on the owned tab. Navigate to the page before
   the staged page and enter Present with the snapshot's control.
2. Use `preview_press` to advance one beat at a time. Require the authored reveal
   order, readable content at each beat, and no premature page change.
3. Exit presentation and jump directly to the staged page from its thumbnail.
   Require the complete content, then navigate backward and forward normally.
4. For a morph pair, require the same object to move continuously without a
   duplicate, flash, jump, or transform conflict. Check both directions and
   inspect content at rest for clipping. Require independently selectable
   source objects after returning to Edit.
5. Stop the recording with `preview_recording_stop` and retain its file along
   with the deck and page identifiers. A still screenshot cannot prove motion.

## Gotchas

- Do not add animation merely to make a static deck pass this recipe.
- Hidden thumbnails can mount page content. Verify the main presentation canvas.
- Test user navigation rather than setting animation state through JavaScript.
