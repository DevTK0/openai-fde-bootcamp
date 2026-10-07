---
name: create-slide
description: "Create a new open-slide presentation in apps/slides. Use for drafting decks, adding slide content, and writing speaker notes. Do not use for framework changes."
---

# Create a slide in open-slide

## Repository integration

The open-slide workspace is `apps/slides/`. Resolve `slides/`, `themes/`,
`assets/`, and `node_modules/.open-slide/current.json` below that directory,
not the repository root. Read the repository's `AGENTS.md` before editing.
Its shared UI, Tailwind, and preview rules take precedence over upstream
examples that use inline styles. Use existing `@workspace/ui` components
for UI controls. Do not add dependencies for slide authoring.

Use the available Codex tools for file reads, edits, and questions. Ask only
for missing information that materially affects the result; honor choices
already supplied and use stated defaults for optional preferences. For
browser work, use the T3 preview tools when available. Start previews with
`pnpm --filter @workspace/slides dev` from the repository root, retain the
terminal session handle, and share the full HTTPS `Preview:` URL including
`/slides/`. Follow [the preview guide](../../../docs/development/previews.md).
Run `pnpm check` from the repository root before finishing changes.

Source: [open-slide/open-slide at `ad82b8966793`](https://github.com/open-slide/open-slide/tree/ad82b8966793a90113e7d69988f6dc354bfec421/packages/core/skills/create-slide).
The upstream MIT notice is in [LICENSE.open-slide](../LICENSE.open-slide).

This skill owns the **workflow** for drafting a new deck. The technical reference — file contract, 1920×1080 canvas, type scale, palette, layout, assets — lives in the **`slide-authoring`** skill. Read that skill whenever you need details on *how* a page is structured. This skill assumes you'll consult it before writing code.

You only write files under `slides/<id>/`. Never modify `package.json`, `open-slide.config.ts`, or existing slides.

## Step 1 — Pick a theme

List files under `themes/`. Use a theme the user already named. If theme markdown files exist and the choice matters, offer the relevant theme ids and "no theme, design from scratch" through the available question tool. The user can name another theme in free text.

- If the user picks a theme: read `themes/<id>.md` end-to-end. The theme's palette, typography, layout, and Title/Footer components are now authoritative — copy them directly into the slide. If the theme declares a webfont import, load it per `references/webfonts.md` in `slide-authoring` (module-level, slide-keyed injection) — don't let the slide silently fall back to system fonts. **Also set `theme: '<theme-id>'` on the `meta` export in `index.tsx`** (e.g. `export const meta: SlideMeta = { title: '…', createdAt: '…', theme: '<theme-id>' };` — `createdAt` per the file contract in `slide-authoring`) so the slide back-links to the theme (chip on the slide card + listing on `/themes/<id>`). In Step 2, skip the **aesthetic direction** question (the theme already commits to one direction); you still need the topic itself, so confirm it before moving on. Page count and text density are independent of theme — ask those normally. For motion, if the theme's Motion section commits to a philosophy, present it as the "(Recommended)" option and reuse the theme's paste-ready keyframes; the user can still override.
- If the user picks "no theme", or `themes/` contains no theme markdown files: proceed to Step 2 unchanged.

If you skip the aesthetic question because a theme was picked, restate the theme name in Step 2 so the user can correct course before you start writing.

## Step 2 — Clarify missing requirements

Use the user's topic, audience, and stated preferences. Ask for a missing topic before choosing an aesthetic. For optional style choices, offer topic-specific recommendations through the available question tool when useful. Skip questions already answered, and proceed with stated defaults when optional preferences remain unanswered. Consider these four decisions:

1. **Aesthetic direction** — propose 3 visual directions tailored to *this* topic. Do **not** pull from a fixed preset list. Each option must combine a vibe word + a concrete visual cue (palette, typography, motif) so the user can picture it; bare labels like "minimal" or "corporate" alone are too vague. The three options should feel meaningfully different from each other — not three flavors of the same idea.

   How options should shift with topic:
   - *"Intro to Rust for backend engineers"* → **rust-orange technical editorial** (warm rust/charcoal, mono headings, code-grid layout) · **blueprint dev-doc** (cyan grid on near-black, monospace, schematic feel) · **brutalist terminal** (lime-on-black, ASCII rules, no-nonsense)
   - *"Q2 product roadmap for stakeholders"* → **calm corporate clean** (off-white, single accent, generous whitespace) · **confident editorial** (large display serif, tight grid, one bold accent) · **data-forward dashboard** (charts as hero, muted neutrals + status colors)
   - *"Kindergarten parent night"* → **playful crayon** (paper texture, hand-drawn accents, primary colors) · **soft pastel storybook** (peach/mint, rounded type, illustrated icons) · **warm photo-led** (full-bleed kid photos, simple captions)

   Mark the option that best fits the topic and audience as "(Recommended)" so the user has a sensible default. The question tool allows a free-text answer; do not add an "Other" option.

2. **Page count** — rough length. Offer brackets: 3–5 (short), 6–10 (standard), 11–20 (deep dive). The auto-added "Other" covers custom counts.
3. **Text density per page** — how much copy lives on each page? Offer: minimal (one line / big number), light (heading + 2–3 bullets), standard (heading + 4–5 bullets or short paragraph), dense (multi-column / detailed). This directly drives type scale and layout.
4. **Motion** — does the user want CSS/React animations and transitions, or a fully static deck? Offer: static (no motion), subtle (fades / entrance only), rich (keyframes, staggered reveals, looping visuals). If animated, plan around the framework primitives first — `<Steps>`/`<Step>` for staged reveals, `SlideTransition` for page changes, morph for shared-element continuity (see `slide-authoring`) — plus CSS `@keyframes` / inline `style` + `useEffect` for in-page motion; no extra libraries.

After those four, ask follow-ups **only if still unclear**: brand colors, required assets. Don't pad the conversation with questions already answered.

## Step 3 — Pick a slide id

Use **kebab-case**, short, descriptive. Examples: `rust-intro`, `q2-roadmap`, `team-offsite-2026`. Check `slides/` to avoid collisions.

## Step 4 — Plan the structure

Sketch the slide as a list of page roles before writing code. Common page types:

| Role             | Purpose                                       |
| ---------------- | --------------------------------------------- |
| Cover            | Title + subtitle, strong visual               |
| Agenda           | What's coming (3–5 items)                     |
| Section divider  | Big label between chapters                    |
| Content          | Heading + 2–5 bullets OR heading + one visual |
| Big number       | One statistic the size of the canvas          |
| Quote            | Pull-quote with attribution                   |
| Comparison       | Two-column before/after or A vs B             |
| Closing          | CTA, thanks, contact                          |

**Rule of thumb**: one idea per page. If you're tempted to put two, split them.

If the deck topic naturally calls for specific real images the user must supply (product screenshots, team photos, customer dashboards), plan where those go and use `<ImagePlaceholder>` from `@open-slide/core` — see the **Image placeholders** section in `slide-authoring`. Default is **no placeholders**: only insert one when a real image is genuinely required.

## Step 5 — Commit to a visual direction

Pick one coherent palette / type scale / aesthetic and hold it across every page. The full set of constraints (palette structure, type scale, padding, aesthetic options) lives in `slide-authoring` — apply it.

**Default: declare a top-level `export const design: DesignSystem = { … }`** at the top of `index.tsx` (after imports) using the chosen palette / type scale, and reference the values via `var(--osd-X)` from inline styles. This keeps the slide tweakable from the Design panel after generation, which is what the user almost always wants. Only skip the `design` const for a one-off slide whose palette is intentionally locked and not meant to be re-themed — in that case, fall back to the local `palette` constants pattern. The "Design system" section of `slide-authoring` covers the format and available tokens.

If the `frontend-design` skill is available, consult it for deeper aesthetic guidance when the user wants something bold.

## Step 6 — Write `slides/<id>/index.tsx`

Read the **`slide-authoring`** skill before writing — it covers the file contract, canvas rules, type scale, spacing, and asset imports, and it includes a starter template you can copy. Don't duplicate that knowledge here; use it.

If the user asked for a speech script / speaker notes (in the initial request or at any point after), write it into the slide's `export const notes` array — the framework's built-in speaker-notes feature, shown in the presenter view. See **Speaker notes** in `slide-authoring` for the contract. Never deliver a script as a markdown or text file.

## Step 7 — Self-review

Run the checklist in `slide-authoring` ("Self-review before finishing"). It covers structural correctness, layout discipline, and asset existence.

## Step 8 — Hand off to the user

Tell the user:

- The slide id and file path you created.
- The full HTTPS `Preview:` URL from the slides launcher. Open the deck from that page; do not assume a localhost port.
- If you wrote speaker notes: that they live in the slide's `notes` export and show up in the viewer's notes drawer and the presenter view in present mode.
- If a preview is needed, start it with `pnpm --filter @workspace/slides dev` from the repository root and retain the session handle.

