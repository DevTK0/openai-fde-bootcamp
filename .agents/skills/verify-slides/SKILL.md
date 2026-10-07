---
name: verify-slides
description: Verify the editable Open Slide app in apps/slides through its native browser UI. Use after deck, notes, inspector, theme, navigation, or animation changes. Check source persistence and editable elements, not just screenshots.
---

# Verify slides

Verify `apps/slides`, which uses `@open-slide/core` 2.0.1. Read the
[feature map](features/README.md) and select the entries affected by the change.
This skill verifies content authored with [slide-authoring](../slide-authoring/SKILL.md).
Use [create-slide](../create-slide/SKILL.md), [create-theme](../create-theme/SKILL.md),
[apply-comments](../apply-comments/SKILL.md), and
[current-slide](../current-slide/SKILL.md) for their respective authoring tasks.

## Launch

Run commands from the repository root. Read [the preview guide](../../../docs/development/previews.md).
Record `git status --short` and `git rev-parse HEAD` before starting.
Create `.audit/verify-slides/<run-id>/` for evidence, using a unique timestamp as
`<run-id>`. Never reuse another run's backups.

Run `pnpm --filter @workspace/slides dev` in a retained terminal session.
Wait for both the launcher `Preview:` URL and the Vite ready message. Keep the
complete HTTPS URL, including `/slides/`, and the session handle in the run log.
The launcher assigns a port; never assume the README's old fixed port is this
worktree's preview. If this app directory is already served, use an isolated
worktree with its own installed dependencies. Do not replace another launch.

The dev command regenerates `content/evidence.json` from the report snapshots.
Record any resulting diff and preserve pre-existing user changes. Use the native
authoring server for edit verification. A static build or `preview` server cannot
prove native editing.

## Doctor

Before interaction, confirm the retained session is alive and run
`pnpm --filter @workspace/slides list @open-slide/core --depth 0`.
Use `preview_status`, then `preview_open` if no automation-capable tab exists.
Retain the returned tab id for every browser call.
Navigate to the recorded preview URL and take `preview_snapshot`.
Require the Open Slide gallery with Scheduling, Maintenance, and Ridership,
not a login screen or a different worktree's app.

If the browser cannot reach the tailnet, try the same running server with
`preview_navigate` and its environment port. The documented exe.dev alternate-port
URL is `https://<vm>.exe.xyz:<port>/slides/`. It may require the user's existing
VM login. Do not change sharing permissions to bypass authentication. Report the
attempted URL and error if access remains unavailable. A local HTTP 200 proves
server readiness only; it does not prove browser behavior.

## Drive

Use the T3 collaborative browser tools and current snapshot locators.
`preview_click`, `preview_type`, and `preview_press` perform user actions.
Use `preview_evaluate` only for read-only DOM observations, not internal React
state changes, synthetic saves, or private API calls. Pass `tabId` on every call.
When the user requests local testing, run the local Playwright helper below
against the loopback URL printed by the owned launch. It uses a fresh browser
profile and the same native UI. Otherwise prefer T3 tools as above.
English labels below come from the installed framework; re-inspect for the
active locale and record changed selectors.

For each affected feature, follow its entry points and expected outcomes.
Record unexercised paths as unverified. For a newly generated skill, execute at
least one complete mapped feature through cleanup before claiming it is proven.

Editable content is a required outcome. Titles, body copy, chart labels, and
shapes must remain separate selectable elements backed by JSX. A screenshot of
a slide, a full-page image, canvas rendering, or an SVG with outlined text does
not satisfy this requirement. Legitimate photos and vector icons are allowed.
Test a native text edit and a separate shape selection on a representative
changed page, then Save, reload, and inspect the source diff. Repeat on pages
whose content structure differs. Do not claim every page is editable from one
sample; record the pages exercised.

Apply the authoring checklist to changed content. Verify the 1920 by 1080 canvas,
readable type, unclipped layout, dynamic page numbers, and notes aligned with
page order. Keep repeated editable objects as explicit JSX instances and chart
labels as HTML text. Follow repository shadcn/ui and Tailwind rules. New decks
normally export a literal `design` object and consume its tokens, per the
[design reference](../slide-authoring/references/design-system.md). Existing
Tailwind decks without that export need not be rewritten to run this skill;
report Design-panel coverage separately. Read the relevant authoring references
before testing assets, steps, transitions, or morph behavior.

Run `pnpm check` before handing off changes. Existing native-deck tests supplement
browser evidence; they do not replace the save-and-reload check.

## Evidence

Before any temporary mutation, copy the affected file into the run's evidence
directory and record its SHA-256 hash. Include theme files and notes if affected.
Keep screenshots, semantic snapshots, a source diff, and an action/result log in
that directory. `preview_snapshot` with `save: true` returns a screenshot path;
copy it into the evidence directory. Store returned snapshot text alongside it.
A recording from `preview_recording_start` and `preview_recording_stop` can show
motion or an editing sequence. Keep the returned recording file.

Record the commit, pre-existing dirty files, app version, preview URL, tab id,
feature IDs, deck and page, actions, observed outcomes, and artifact paths.
Distinguish source inspection, test results, live passes, skipped paths, and
access blockers. Mutation proof requires both the saved file diff and the value
after a fresh navigation or restart. A success toast alone is insufficient.

## Cleanup

Discard pending browser drafts before restoring temporary edits. Compare the
current file with the saved post-test version first. Restore only the bytes
changed by this run; never use a broad `git reset` or `git checkout`. If someone
else edited the file meanwhile, preserve their changes and report the conflict.
Reload the page to confirm the original value and compare the restored hash with
the pre-test hash. Remove only scratch decks or themes created by this run.

Stop the preview through its retained terminal session using Ctrl+C. Confirm
that session exited. Do not kill by process name or stop shared proxies.
Run cleanup after failed attempts too. Keep `.audit/verify-slides/<run-id>/` and
confirm its evidence files still exist after the server stops.

## Helpers

The executable `scripts/verify-native-editability.cjs` exercises Ridership's
heading and chart objects through local Playwright. It saves before/after source,
ARIA snapshots, screenshots, a browser trace, selection state, and an action log.
It restores the source only when changes remain limited to its selected heading,
then confirms the original heading in a fresh browser. Native Save may reformat
that heading; the rest of the file must remain unchanged. Unexpected edits cause
a failure and leave the backup available for manual reconciliation.

Use this path when local browser testing is requested or the session's browser
rules permit it. Use an existing Playwright installation if available. Otherwise
install the pinned tool outside the repository:

```bash
verify_tools=$(mktemp -d /tmp/verify-slides-tools.XXXXXX)
npm install --prefix "$verify_tools" --no-save --ignore-scripts playwright@1.63.0
"$verify_tools/node_modules/.bin/playwright" install chromium
export VERIFY_SLIDES_PLAYWRIGHT="$verify_tools/node_modules/playwright"
```

Set `VERIFY_SLIDES_PLAYWRIGHT` to the absolute module directory when reusing an
installation. From the repository root, pass the actual owned local preview URL
and a new evidence directory. Its parent must already exist:

```bash
mkdir -p .audit/verify-slides
node .agents/skills/verify-slides/scripts/verify-native-editability.cjs \
  "$VERIFY_SLIDES_URL" \
  ".audit/verify-slides/native-$(date -u +%Y%m%dT%H%M%SZ)"
```

Set `VERIFY_SLIDES_URL` to the launcher backend URL, including `/slides/`, before
running. The helper expects the baseline Ridership heading and page-three chart.
If those intentionally change, update the fixture expectations or drive the
feature recipe manually. Do not rewrite the deck to satisfy stale expectations.
The helper does not launch or stop the app; perform the Launch and Cleanup steps.

Use existing checks from the repository root:

```bash
pnpm --filter @workspace/slides test
pnpm check
```

These cover native JSX structure, notes alignment, figures, report evidence, and
legacy routes. Browser recipes and proof boundaries live in the feature map.
Use `/maintain-verification-skill` to audit this skill and map as the app changes.
