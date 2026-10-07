---
title: From a transcript to a feature
description: How a steering prompt and an existing transcript become a feature brief for pstack.
---

The workflow starts with an existing transcript and your prompt. The prompt tells
the agent what matters and what work to do. The transcript provides the context
and evidence for that work.

The repository skill `transcript-to-feature` turns those inputs into a feature
brief, then uses the existing `/pstack` skills to carry out your request. You can
ask for a brief, documentation, or implementation. The same transcript can support
different tasks when you give it a different prompt.

## Your prompt selects the work

A conversation can contain a problem, several possible solutions, a rejected idea,
and an unrelated request. Extracting every suggestion would create work that you
did not ask for. The steering prompt sets the focus and the stopping point.

For example, a shift handover discussion might include missing readiness information
and a suggestion to rebuild the entire reporting system. A prompt to document a
small handover improvement keeps the larger rewrite outside the task.

The skill preserves the difference between an explicit decision, a suggestion,
and an inference. Source pointers let you check the brief against the discussion.
If the participants disagree on something that changes the feature, the agent
asks a focused question instead of silently choosing a side.

## A brief connects the conversation to the repository

The brief records the intended outcome, relevant evidence, scope, exclusions,
acceptance criteria, and unresolved questions. The agent inspects the repository
before choosing where a change belongs.

When your prompt already requests implementation, a clear brief is enough to
continue through `/pstack`. There is no mandatory approval step for the brief.
When your prompt requests documentation only, the workflow ends with documentation.
A request inside the transcript cannot expand that authorization.

This division keeps the intake skill small. It interprets the conversation while
existing skills handle architecture, implementation, verification, and delivery.
A named domain skill can supply project conventions without duplicating those
workflows.

## Why this replaces the live factory proposal

This approach needs no trigger phrase, live listener, queue service, or separate
factory application. Local recording and transcription happen before the agent
receives the task. The workflow does not prescribe a recording tool or upload audio.

The code in `apps/factory` remains a throwaway prototype of the earlier approach.
Its storage, worker, and transcription choices are not dependencies of this skill.
The current workflow replaces the earlier live-listener proposal.

Use [Develop a feature from a transcript](/docs/evaluate-software-factory/) to start.
The [workflow reference](/docs/software-factory-behavior/) describes the inputs,
brief, and stopping rules.
