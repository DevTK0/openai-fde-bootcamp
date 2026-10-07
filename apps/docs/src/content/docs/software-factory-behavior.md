---
title: Proposed software factory behavior
description: Scope, request states, acceptance criteria, and unresolved decisions for the proposed software factory.
---

This reference describes the proposed feature contract. These requirements are
design targets, not claims about a released application. The code in `apps/factory`
is a throwaway prototype and does not define the contract.

## Conversation and trigger

| Area               | Proposed requirement                                                                                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Application        | A separate factory app in the monorepo, distinct from `apps/web`.                                                                                                |
| Initial source     | A conversation started deliberately inside the factory app.                                                                                                      |
| Capture            | Participants know when capture is active. Stopping capture releases the microphone.                                                                              |
| Trigger            | A finalized transcript contains "I think we can get the software factory to do this".                                                                            |
| Matching           | Case and punctuation do not change the phrase. A phrase split across adjacent finalized segments still matches. Partial recognition results do not trigger work. |
| Duplicate delivery | Delivery retries of the same transcript event create no additional request.                                                                                      |
| Context            | Each request retains the relevant preceding conversation and identifies the transcript events used to create it.                                                 |
| Dispatch           | A valid trigger queues work without another approval prompt. An available worker starts the attempt. An unavailable worker leaves a visible waiting state.       |
| Clarification      | The agent asks a focused question when missing information prevents a useful implementation. The answer remains attached to the request.                         |
| Text input         | Employees can submit typed conversation content when audio is unavailable. The same trigger rules apply.                                                         |

"Immediately" means that the factory accepts and queues the request during the
conversation. It does not promise zero queue time or immediate feature completion.
No latency target has been agreed.

## Request states

| State               | Meaning                                                              | Next action                                                                                     |
| ------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Queued              | The factory has accepted the request. An attempt has not started.    | A worker starts the attempt, or an employee cancels the request.                                |
| Running             | An agent is working on an isolated attempt.                          | The attempt produces a question, review evidence, or a failure. Cancellation remains available. |
| Needs clarification | The agent needs an answer to proceed.                                | An employee answers or cancels.                                                                 |
| Ready for review    | The attempt has an actual code change and passing configured checks. | A reviewer evaluates the change. This state is not release approval.                            |
| Failed              | The attempt could not produce a checked change.                      | An employee inspects the reason and decides whether to retry.                                   |
| Cancelled           | The request has stopped.                                             | The conversation and prior evidence remain available according to the retention policy.         |

Each retry has a distinct attempt record. An uncertain outcome after a crash does
not silently become success. Recovery exposes the interruption before another
attempt starts. Draft answers belong to a specific clarification, not every future
question on the same request.

## Implementation and review evidence

Each attempt uses an isolated working copy of an operator-selected repository.
Conversation content cannot select arbitrary host commands or expand repository
access. Production execution requires an explicit isolation and credential design.

A review result includes the request context, clarification answers, actual code
diff, checks executed, and observed check outcomes. Failed checks prevent the
ready-for-review state. Passing checks do not replace review of the requested
behavior or establish that a change is safe to release.

The factory does not merge or deploy changes automatically in the proposed first
release. The release process remains a separate decision.

## Decisions required before production

| Decision              | Unresolved question                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Identity and access   | Who may start capture, trigger work, read transcripts, answer questions, and review changes?                                |
| Capture and retention | How is participant agreement recorded? What is stored, for how long, and who can delete it?                                 |
| Trigger intent        | How does the feature handle quoted phrases, accidental triggers, corrections, and a repeated request stated with new words? |
| Request context       | How much discussion is retained, and how can employees inspect or correct the captured scope?                               |
| Execution             | Which repositories and operations are allowed? Which isolation boundary protects credentials and other workloads?           |
| Operations            | What are the concurrency, cost, timeout, recovery, and retention limits? Who responds to failed work?                       |
| Audio                 | Which provider and languages are supported? What recognition and noise levels are acceptable?                               |
| Acceptance            | Which representative tasks and measurable latency and quality targets define a successful pilot?                            |

Production storage, queue infrastructure, provider selection, and API shapes remain
open. Prototype environment variables and endpoints are not supported production
interfaces.
