# Native editability

Users select and edit real slide objects, then save changes to the deck's JSX.
A rendered image of a page is not an editable slide.

## Sub-features

- `edit-text` changes a heading through the native editor.
- `edit-shape` selects a chart shape independently from its text label.
- `edit-save` persists changes in source and across reload.
- `edit-discard` discards an unsaved change without modifying source.

## How to get to it (user POV)

- Open Ridership from the gallery, then choose Edit in the top toolbar.
- Open `/slides/s/ridership?p=1` directly and choose Edit.
- Select text, then choose Edit on slide in Format. Double-clicking text is an
  alternate entry point when the browser tool supports a double-click action.

## Driving it with T3 preview

Preconditions:

- Doctor passed on an owned authoring instance. Back up
  `apps/slides/slides/ridership/index.tsx` and record its hash.
- Snapshot the page. The first heading is `A bus can run and still leave people behind.`
  Confirm the actual heading before editing; page content can change.

1. Use `preview_click` with the snapshot's Edit control. Select the main canvas
   heading, scoped to `[data-inspector-root] h1` to exclude thumbnails.
   Format must identify a text object. Capture the selection snapshot.
2. Choose the snapshot's Edit on slide control. Use `preview_type` on the active
   `[contenteditable="true"]` element, with `clear: true`, to enter
   `Editable verification heading`. Press Escape to exit inline typing.
3. Choose Save through `preview_click`. Read the deck source and save its diff
   from the backup. Require the new literal JSX text, with unrelated chart
   objects retained. Navigate to the same URL afresh. The heading must still
   read `Editable verification heading`.
4. On a chart page, select a numeric label and then its bar or shape separately.
   Use snapshot locators where exposed. If a shape has no locator, derive its
   coordinates from a current screenshot. Require distinct selections in Format
   and in the fresh viewer state. A single image selection fails this check.
5. Make another temporary text edit and choose Discard. Require the last saved
   text and an unchanged source hash. Capture the action and result.
6. Discard pending drafts, restore this run's original source bytes, reload, and
   require the original heading and hash. Preserve the saved-change diff and
   screenshots as evidence.

The local helper in [verify-slides](../SKILL.md#helpers) runs this recipe with
Playwright when local testing is requested. It uses native browser actions and
reads the resulting source and selection state.

## Gotchas

- Thumbnail text duplicates main-canvas text. Scope selection to the canvas.
- DOM text, JSX, or a successful build alone does not prove native saving works.
- Photos and icons may be images. Headings, labels, and chart shapes must remain
  independent objects. SVG text is not selectable by the HTMLElement inspector.
- Labels and bar sizes are separate objects. Do not change a real data value
  without updating its corresponding shape and checking the evidence.
- A static export cannot prove editing. Do not replace this test with a PDF,
  screenshot, or presentation download.
