# Navigation, presentation, and notes

Users browse decks, move between pages, present, and save page-specific notes.

## Sub-features

- `nav-gallery` opens each business-function deck from the gallery.
- `nav-direct` opens a page from a `?p=N` link.
- `nav-controls` moves by thumbnail and keyboard.
- `present` opens presentation mode and returns to editing.
- `notes-save` persists a note for the correct page.

## How to get to it (user POV)

- Open Scheduling, Maintenance, or Ridership at `/slides/`.
- Open `/slides/s/ridership?p=2` directly.
- Click a page thumbnail or press ArrowRight and ArrowLeft outside text fields.
- Choose Present or an option under Present options.
- Choose Notes beneath the slide canvas.

## Driving it with T3 preview

Preconditions:

- Doctor passed. Back up the selected deck source before changing notes.

1. Use `preview_snapshot`, then `preview_click` on each gallery deck's actual
   locator. Require the matching title, nonempty page canvas, and correct count.
2. Use `preview_navigate` to the direct page-two URL. Require page 2, then choose
   page 3's thumbnail. Use `preview_press` with ArrowLeft and require page 2.
   Confirm that footer numbers match the viewer and notes follow page changes.
3. Choose Present using its snapshot locator. Advance a page with ArrowRight,
   capture the canvas, then press Escape. Require a return to the viewer.
   Test Present options separately when that menu or presenter view changed.
4. Choose Notes. Use `preview_type` on
   `textarea[placeholder="Write speaker notes for this slide (Markdown supported)…"]`
   to append a unique temporary sentence while preserving the original note.
   Press Escape to blur and flush. Wait for Saved. Notes auto-save independently
   of the inspector's Save button.
5. Read the source `notes` export and require the sentence at the selected page's
   index. Navigate away and back and require the persisted sentence. Confirm an
   adjacent page's note is unchanged. Restore the source and confirm the original
   note after fresh navigation.

## Gotchas

- Query parameter `p` is one-based; the notes export is zero-based.
- Arrow keys inside a text editor move the caret instead of the page.
- A presenter popup may need a separate supported browser tab. Report it as
  unverified if the tool cannot attach; normal presentation is not popup proof.
- Keep speaker notes in the deck's `notes` export, not a separate Markdown file.
