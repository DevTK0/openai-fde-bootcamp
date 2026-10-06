# LionLink stakeholder slides

Eleven five-page decks using [Open Slide](https://github.com/open-slide/open-slide),
pinned to `@open-slide/core` 2.0.1. The runtime provides the deck browser, slide
navigation, presentation mode, speaker notes and its built-in download menu.
Authored slides use explanatory SVG diagrams, Lucide icons and the shared
`@workspace/ui` Tailwind theme. No third-party presentation service or model credentials are needed.

## Run and refresh

From the monorepo root:

```bash
pnpm --filter @workspace/slides dev     # 127.0.0.1:3001/slides/
pnpm --filter @workspace/slides build   # apps/slides/dist
pnpm --filter @workspace/slides start   # preview the built app on port 3001
pnpm check
```

The normal `pnpm dev` and `pnpm build` include this app. Evidence is generated
before dev/build from `apps/web/lib/fleet-data.json` and the compressed operations
summary, plus the selected departure’s complete ten-date boarding history. After refreshing the web imports, rebuild the slides and republish dist.
A running dev session needs `pnpm --filter @workspace/slides generate` after a
source refresh. Editorial conclusions and planning assumptions are reviewed in
`content/decks.ts`; they do not automatically adapt to changed evidence.

`content/evidence.json` is a small reproducible report extract with SHA-256 source
fingerprints. Tests reject stale evidence and check source reconciliation. Turbo
build/test inputs include all three source snapshots so changes invalidate the cache.

## Deck routes

All paths start with `/slides/s/`:

| Deck | Route |
| --- | --- |
| Repair costs are rising faster than use | `repair-spend` |
| Recurring discomfort has a cost | `hvac-comfort` |
| A small number of delays can disrupt journeys | `service-reliability` |
| Some passengers cannot board the bus they need | `crowding` |
| The same bus is full on some days and mostly empty on others | `capacity-use` |
| Workshop bookings conflict with available resources | `workshop-scheduling` |
| Workshop estimates do not establish usable buses | `fleet-availability` |
| The festival plan has an end-to-end capacity gap | `festival-allocation` |
| The disruption plan cannot clear the assumed queue | `incident-relief` |
| Maintenance spending is broader than repair bills | `investment-options` |
| Boarding counts do not explain customer growth | `customer-growth` |

Each starts with a plain-language introduction to bus operations, then shows the
problem, supporting observations, business significance and evidence limits. Every page has a visual and a
readable data-source citation. Supporting explanation and limitations live in the
speaker notes. Slides and notes exclude internal vehicle identifiers and code paths.
Use **Present** for slideshow mode; `?p=2` links directly to a page. The dashboard header links to the deck browser.

## nginx deployment

The production app is static: nginx serves the generated app directly at `/slides/`.
No persistent Node process is required for slides. The existing `/` proxy continues
to serve Next.js. The dev authoring server stays local on port 3001.

```bash
pnpm --filter @workspace/slides build
sudo install -d /var/www/openai-fde/slides
sudo cp -a apps/slides/dist/. /var/www/openai-fde/slides/
sudo install -m 644 deploy/nginx/slides.conf /etc/nginx/snippets/openai-fde-slides.conf
```

Include this **inside the existing nginx application server block**, once:

```nginx
include /etc/nginx/snippets/openai-fde-slides.conf;
```

Then validate and reload:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

The checked-in snippet preserves query strings in the `/slides` redirect, serves
hashed assets with immutable caching, and falls back to the SPA for direct deck
and presenter links. Missing assets return 404. Copying a new build retains old
hashed assets for already-open browser sessions; prune them during maintenance.
The exe.dev HTTPS proxy and its visibility setting are unchanged.

Open Slide's source-editing endpoints are development-only. Version 2.0.1 may
probe `/__comments` and `/__design` in a static viewer and receive harmless 404s;
presentation and navigation continue to work. Edit authored decks in this repo.

## Evidence limits

All reports are fictional exercise fixtures. The historical ledger describes
eight selected buses, not the entire operating fleet. Future-dated October
observations and planning assumptions are labelled as fixture periods, not live
results. Quotes are separate from incurred spend. Proposed benefits are not
claimed as causal effects or guaranteed savings. The conflicting workshop requests, festival timetable and incident queue arithmetic
are explicitly conditional planning evidence, not observed outcomes. No solutions,
pilots, purchasing decisions or approval requests are presented. Customer acquisition,
retention and revenue effects are explicitly unknown where the supplied data is silent.
