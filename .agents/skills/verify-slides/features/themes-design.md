# Themes and design

Users browse reusable themes and preview a theme's editable demo. Decks with a
design export can also expose editable design tokens.

## Sub-features

- `themes-gallery` lists available themes or shows No themes yet.
- `themes-demo` renders the selected theme's demo pages.
- `design-save` persists a token change and updates the rendered deck.

## How to get to it (user POV)

- Choose Themes from the home navigation or open `/slides/themes`.
- Open an available theme's card and move through its demo pages.
- On a deck that exports design tokens, open Design in the slide toolbar.

## Driving it with T3 preview

Preconditions:

- Read [create-theme](../../create-theme/SKILL.md) and the
  [design reference](../../slide-authoring/references/design-system.md).
- Inspect `apps/slides/themes/` and the target deck for available fixtures.
  This checkout currently has no themes and its existing decks use shared
  Tailwind styling without a `design` export. Do not claim those paths passed.

1. Choose Themes with `preview_click` using its snapshot locator. If no themes
   exist, require No themes yet and report demo and token editing as not run.
2. When a theme exists, open it and use Next page and Previous page. Require the
   actual demo content, matching palette and typography, and unclipped pages.
   Read both `themes/<id>.md` and `themes/<id>.demo.tsx`; require literal editable
   demo content, not an image of the intended design.
3. When an authorized deck has a literal exported design object, back it up.
   Open Design, change one visible token using the snapshot's input, and Save.
   Require the matching source change and rendered value after fresh navigation.
   Discard a second draft and require no persisted change. Restore the backup.

## Gotchas

- Theme creation produces both Markdown instructions and a runnable demo.
- Theme selection at authoring time differs from a deck's runtime Design panel.
- A no-theme result proves the empty state only. Create a scratch theme only
  when theme verification is in scope, then remove that run's files in cleanup.
