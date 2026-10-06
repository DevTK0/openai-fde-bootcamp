# LionLink stakeholder slides

Three decks grouped by business function, with one full slide per caveat, using [Open Slide](https://github.com/open-slide/open-slide),
pinned to `@open-slide/core` 2.0.1. The runtime provides the deck browser, slide
navigation, presentation mode, speaker notes and its built-in download menu.
Authored slides use editable text, shapes, vector icons and the shared
`@workspace/ui` Tailwind theme. No third-party presentation service or model credentials are needed.

## Run and refresh

From the monorepo root:

```bash
pnpm --filter @workspace/slides dev     # 127.0.0.1:3001/slides/
pnpm --filter @workspace/slides build   # apps/slides/dist
pnpm --filter @workspace/slides start   # native authoring server on port 3001
pnpm check
```

The normal `pnpm dev` and `pnpm build` include this app. Evidence is generated
before dev/build from `apps/web/lib/fleet-data.json` and the compressed operations
summary, plus the selected departure’s complete ten-date boarding history. After refreshing the web imports, regenerate the evidence and review the corresponding authored slides.
A running dev session needs `pnpm --filter @workspace/slides generate` after a
source refresh. Original editorial conclusions and planning assumptions remain in
`content/decks.ts`; the editable deck files do not automatically adapt to changed evidence.

`content/evidence.json` is a small reproducible report extract with SHA-256 source
fingerprints. Tests reject stale evidence and check source reconciliation. Turbo
build/test inputs include all three source snapshots so changes invalidate the cache.

## Deck routes

All paths start with `/slides/s/`:

| Deck | Route | Pages | Covers |
| --- | --- | --- | --- |
| Scheduling | `scheduling` | 25 | Late journeys, workshop booking clashes, festival connections and disruption response |
| Maintenance | `maintenance` | 24 | Maintenance costs, repairs, safety approvals and cooling faults |
| Ridership | `ridership` | 14 | Crowding, spare capacity, boardings and customer growth |

The decks contain 63 pages. Scheduling brings together the evidence about when
buses run and whether the proposed plans have enough capacity. Maintenance covers
bus condition, repair work and its costs. Ridership covers passenger demand and
what the boarding records can tell us about growth. Each deck has one Caveats
section after its problem evidence. Repeated separators and the duplicate request
for more boarding history are removed.
The maintenance deck ends with one combined monetary impact page. The repair
increase is part of the total maintenance increase and must not be added again.

Old deck URLs redirect to their new deck and matching retained or combined page.
`content/deck-groups.json` records page provenance.
`content/legacy-deck-pages.json` maps old links, including pages from decks that
were split between business functions. The eleven
original problem statements remain in `content/decks.ts` as the evidence reference;
they are not eleven separate decks in the browser.

To reproduce the page moves from the previous six-deck commit without overwriting
browser edits, run `node apps/slides/scripts/regroup-decks.mjs /tmp/regrouped-slides`
from the repository root. The script writes to a separate directory for review.
It is a historical migration, not part of the app build.

Each starts with a plain-language introduction to bus operations, then shows the
problem, supporting observations, business significance and evidence limits. Every page has a visual and a
readable data-source citation. After the problem pages, each limitation and its corresponding existing-record request
gets a separate full slide explaining the conclusion that the extract cannot support.
Diagrams show the limitation itself: limited time coverage, selected samples, proposed
versus completed work, missing cost breakdowns, or provisional capacity. Only the combined maintenance deck retains an impact page, showing the recorded
dollar increase. The other decks omit impact because the supplied data cannot
establish a dollar or ridership change.
Requests focus on more history and routine operating, workshop and accounting records;
no new passenger tracking or customer research is requested. Detailed caveats also
appear in speaker notes. There are no small evidence-limit strips.
Presenter caveats live in `content/review.ts`; limitation narratives and diagram data
live in `content/limitations.ts`; monetary impacts live in `content/impact.ts`. Slides and notes exclude internal vehicle identifiers and code paths.
Use **Present** for slideshow mode; `?p=2` links directly to a page.

## Native browser editing

`/slides/` runs Open Slide's authoring server. Open a deck, select the pencil
(**Edit**) in the top toolbar, then click an element to select it. Double-click
text (or use **Edit on slide**) to type directly. **Format** controls text,
colours, size and position; the canvas supports moving and resizing elements.
Use Open Slide's **Save** button to persist pending changes. Notes use its built-in
notes editor. **Preview** and **Present** hide editing controls.

All 63 pages contain literal JSX in their own `slides/<id>/index.tsx`. Chart labels
are HTML text and bars are individual shapes, so the native inspector can select
them. Icons remain vector graphics inside selectable groups. Chart bars and their
numeric labels are separate objects; update both when changing figures. Page
numbers follow Open Slide's page order automatically.

Native saves modify the deck source files directly and survive restarts and builds.
Back up or commit those files before replacing a checkout. The `content/` files
retain the original evidence and editorial reference; generating evidence does not
overwrite browser edits. Refresh report-based figures in the authored deck files
when evidence changes. There is no separate custom editor or saved-edits API.

## nginx deployment

Nginx proxies `/slides/` to the loopback Open Slide server on port 3001, including
its WebSocket connection. Open Slide's root-relative authoring APIs are routed to
the same server. The existing `/` route continues to serve Next.js. The site's
existing access controls also cover authoring: anyone with site access can edit.

```bash
pnpm install --frozen-lockfile
sudo install -m 644 deploy/systemd/openai-fde-slides.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now openai-fde-slides
sudo install -m 644 deploy/nginx/slides.conf /etc/nginx/snippets/openai-fde-slides.conf
```

Include this inside the nginx application server block:

```nginx
include /etc/nginx/snippets/openai-fde-slides.conf;
```

Then validate and reload:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Adjust the systemd working directory/user and `scripts/dev.mjs` allowed host for
other deployments. Back up `apps/slides/slides/` and Open Slide workspace metadata.
When upgrading from the custom editor service, disable
`openai-fde-slides-editor.service`; its old data directory can remain as a backup.

`pnpm --filter @workspace/slides build` still produces a read-only static export in
`dist`; `pnpm --filter @workspace/slides preview` serves it on port 3004. Static
exports do not include Open Slide's native editing tools. Do not replace the live
authoring route with that static output if browser editing is required.

## Evidence limits

All reports are fictional exercise fixtures. The historical ledger describes
eight selected buses, not the entire operating fleet. Future-dated October
observations and planning assumptions are labelled as fixture periods, not live
results. Quotes are separate from incurred spend. Proposed benefits are not
claimed as causal effects or guaranteed savings. The conflicting workshop requests, festival timetable and incident queue arithmetic
are explicitly conditional planning evidence, not observed outcomes. No solutions,
pilots, purchasing decisions or approval requests are presented. Customer acquisition,
retention and revenue effects are explicitly unknown where the supplied data is silent.
