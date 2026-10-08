# Delivery record

The requested sequence was Decisions tuning, a paired Astra benchmark after the Decisions gate, then feature implementation. All three stages have completed their verification gates.

## Feature checklist

1. Ground the affected subsystem with how. Complete. The SQLite source and existing dashboard routes own data access and navigation.
2. Explore the design with architect. Complete. A shared Python engine preserves evaluated behavior behind typed Next routes. A raw database prompt cannot reliably separate future observations from planning facts. A separate TypeScript engine would duplicate the evaluated semantics.
3. Record the throughput checkpoint. Complete. Evaluation gates precede UI delivery. Work stays sequential under one owner. SQLite remains read-only, and every run has a separate audit directory. There are no delegated workers.
4. Implement the chosen design. Complete. The engine, streaming API, and shadcn UI share request and report contracts.
5. Verify on the matching surface. Complete on current main. The full frozen replay, live browser flows, sidebar navigation, and repository checks pass. The web suite has 193 passing tests.
6. Organize small, ordered commits. Engine and evaluation evidence precede UI integration.
7. Resolve contested design claims. Physical exclusions are candidate construction, not model accuracy. The final corpus is finite and was used during tuning. Zero observed errors is not a universal correctness guarantee.
8. Run Opening a PR. Current-main integration checks passed. Publish the verified branch. No merge is authorized.

## Review decisions

- Preserve full touched-resource calendars and capacity baselines. The earlier prototype omitted facts needed to reject unsafe alternatives.
- Keep physical exclusions visible. The earlier raw classifier had unsafe approvals; reporting exclusions as AI successes would conceal that failure.
- Keep expected outcomes in the eval corpus only. Production calls receive source facts and written policies.
- Skip singleton comparisons structurally. Both the engine test and report schema enforce this.
- Correct takeover preparation for retained duties after a changed bus assignment. A regression test checks the later duty's actual preparation time.
- Use the native preview first. It returned an explicit unavailable-host error, so headless Playwright verified the live application.
- Fix mobile tab height and native button semantics after browser inspection. Browser verification now reports no page errors and no horizontal page overflow at 390 pixels.

The Prove It Works principle changed verification from compilation alone to actual API-backed browser flows and request-hash replay. Sequence Work into Verifiable Units keeps the engine evidence separate from the UI integration commit.

## Coordinated recovery update

The old UI offered several cases with one feasible plan and onboarding cases with interchangeable buses. The default UI now offers three terminal-wide recovery exercises on 5 October 2026 at 09:25 Singapore time.

| Exercise | Withdrawal | Routes | Complete plans | Distinct crew allocations | Distinct bus allocations |
| --- | --- | --- | --- | --- | --- |
| Toa Payoh bus withdrawal | NW-V001 after its current trip | 231, 232, 235, 238 | 36 | 26 | 35 |
| Ang Mo Kio bus withdrawal | NW-V031 after its current trip | 261, 262, 269 | 36 | 27 | 36 |
| Toa Payoh relief crew sickness | NW-C062 before relief duty | 231, 232, 235, 238 | 36 | 32 | 29 |

Each proposal assigns the remaining trips across routes, buses and qualified crews. The search considers all 172 buses and 327 crew profiles for the selected day. It protects earlier and outside-service commitments. These are hypothetical withdrawals using real exercise records, with no added spare resources. A bus already underway finishes its current trip before withdrawal. This is not an unsupported roadside rescue.

The bounded search uses 36 complete plans, not 36 resource clones. It does not enumerate every possible allocation. The default objective minimizes changed crew assignments, then changed bus assignments. The best sampled scores were 0 crew changes and 2 bus changes for both vehicle exercises, and 3 crew changes and 0 bus changes for sickness.

```mermaid
flowchart LR
  A[All listed day resources and commitments] --> B[36 complete allocations]
  B --> C[Requirement-specific Decisions checks]
  C --> D[Groups of 3; advance 1]
  D --> E[12 survivors]
  E --> F[Groups of 3; advance 1]
  F --> G[4 finalists, ordered by Decisions]
```

All three scenarios admitted 36 plans and made 19 tournament calls in both tested orders, seeds 43 and 71. Every comparison matched the declared priority order. All recommendations passed the independent schedule oracle. These six runs screened 216 complete plans and made 114 tournament calls. Policy assessment and comparison took 13.9 to 16.7 seconds per run, excluding candidate generation and UI startup. API latency varies.

Large roster packets and broad eligibility questions produced false rejections. Adding more violation categories also admitted deliberately invalid controls. Those experiments were rejected. The final checks assess each written requirement separately. Release, qualification, capacity and availability are checked per resource. Arithmetic uses complete effective calendars, and a crew's duty is paired with its own limit. Identical policy inputs reuse the same verdict within a run. Cached checks are reported separately from model calls.

Eight live controls include a valid plan, a held bus, capacity loss, missing qualification, overlapping tasks, a protected-break violation, an individual duty-limit violation and a new two-wheelchair-space policy. All eight passed. These controls deliberately bypass candidate filtering to test the policy classifier too. The historical failed experiments remain in `evals/coordinated-tuning.json`; passing a finite tuned corpus does not establish universal accuracy. Astra was not rerun on these new scenarios. Earlier Astra results concern the older corpus.

`evals/coordinated-trials.json.gz` preserves the final inputs and answers. `evals/coordinated-summary.json` records counts, diversity, timings, controls and the source database hash. Reproduce without API calls:

```bash
python apps/web/planner/evals/replay_coordinated.py
```

Run new paid trials into a new directory:

```bash
OPENAI_ENV_FILE=/path/to/local.env python apps/web/planner/evals/coordinated_trials.py --live --seed 71 --output /tmp/new-coordinated-trial
OPENAI_ENV_FILE=/path/to/local.env python apps/web/planner/evals/coordinated_controls.py --output /tmp/new-coordinated-controls
```

The question and input roles follow the [Decisions API guide](https://developers.openai.com/api/docs/guides/decisions). Numerical summaries are source-derived facts, not oracle labels. Additional operator requirements receive the complete supporting calendars and original assignments. A custom ranking objective receives the full comparison evidence. The default objective uses compact allocation tables and change counts.

Model the Domain changed the candidate from one replacement resource to a complete allocation. Attack the Premise changed one large classifier call into focused policy and resource checks. Prove It Works required live trials and negative controls. Explain the Number required counting distinct tournament entrants separately from repeated or cached policy checks.

## Operator access and runtime

Set `OPS_PLANNING_ACCESS_KEY` on the server and enter it in the planner for the first run in a browser. This is a separate operator capability, not the OpenAI API key. The browser receives an eight-hour HttpOnly, Secure, SameSite=Strict cookie. It grants this demo's single operator access to runs and audit downloads. It is not a multi-tenant identity or ownership system. Missing or incorrect credentials fail closed. Cross-origin planning POSTs are rejected.

The Python CLI uses a nonblocking operating-system file lock under `OPS_PLANNING_RUNS_DIR`, so only one web-triggered planning worker runs at a time. The kernel releases it on process exit or a VM restart. The server terminates a worker after ten minutes and supports cancellation. Production needs Python 3 on a Unix-compatible runtime, plus a writable run directory. The Next.js traces include the planner Python/JSON files and SQLite database for both planner routes.

The current trail was self-reviewed. Independent agent review is unavailable under the sequential workflow. Review remains finite, the candidate search remains bounded, and arbitrary new policies need their own evaluation cases.

### Final verification of coordinated recovery

`pnpm check --concurrency=1` passed, including 195 web tests. An earlier run timed out in the planner test while other verification processes competed for CPU. The Python suite then passed alone in 13.5 seconds, and the full check passed on the next run. The production web build passed. Both planner route traces contained the 52 planner and database assets needed by the worker. The catalog loaded from an isolated directory populated only with those traced assets.

All three presets also completed through the live browser, each showing 36 entrants and 19 comparisons. End-to-end times were 23.1, 19.1 and 18.6 seconds in preset order. Audit downloads returned 200. Anonymous planning requests and audit downloads returned 401; authenticated cross-origin planning requests returned 403. A concurrent worker was refused, and cancellation released the lock so the next worker could start. The 390-pixel viewport had no horizontal page overflow or page errors.

### Review follow-up

Automated review identified two session defects and stale UI guidance. The session now contains a random nonce, expiry and HMAC signature instead of the operator key. The server checks the signature and expiry. A regression test first failed because a semicolon-containing key leaked into the cookie. It now verifies cookie-only POST and audit GET, tamper rejection, expiry and rejection of a session token used as a bearer key. Raw-key cookies are rejected.

The README and checked-in `evals/verify-live.mjs` now describe and exercise the three coordinated presets. The verifier passed all three with 36 entrants and 19 comparisons, including cookie-only reuse, audit access, cancellation and mobile layout. Its report is `evals/coordinated-ui-verification.json`. Final repository checks passed with 196 web tests, and the production build passed again. Model inputs were unchanged by this follow-up.
