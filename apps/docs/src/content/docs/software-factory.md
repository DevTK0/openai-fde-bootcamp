---
title: From employee feedback to a proposed change
description: Why LionLink is exploring a software factory that acts on an explicit request during a conversation.
---

The software factory is a proposed way for LionLink employees to turn a pain point
into a reviewable software change while they discuss it. The first intended source
is a live conversation in a separate factory application.

This feature is in documentation-first design. The code in `apps/factory` is a
throwaway prototype. Its structure, dependencies, and interface are experiments,
not a production design or a compatibility commitment.

## An explicit request within a conversation

An employee can explain a problem more clearly in conversation than in a short
ticket. The surrounding discussion can establish who has the problem, when it
occurs, and what a useful change would accomplish.

Continuous conversation alone is a poor signal to begin implementation. People
also speculate, compare alternatives, and describe work they do not want built.
The proposed signal is an explicit phrase:

> I think we can get the software factory to do this

For example, an employee describes the time spent assembling a shift handover.
After discussing which information is missing, the employee says the phrase.
The factory captures that context and starts an implementation request. If the
discussion does not identify the required information, the agent asks a question.

The phrase authorizes an implementation attempt within the configured scope.
It does not authorize a production release. A person reviews the resulting change
and the evidence from its checks before any separate release decision.

## Progress that survives the conversation

Implementation may take longer than the conversation. The request therefore needs
its own durable record, including its context, questions, attempts, and outcome.
Closing the conversation must not erase accepted work.

Employees need to distinguish a request that is waiting from one that is running
or needs an answer. A failed attempt also needs an explanation. Presenting a draft
as complete because an agent says it succeeded would hide the work still required.

## What the prototype taught us

The prototype explored finalized transcript input, duplicate delivery, clarification,
isolated code changes, and visible check results. Local tests exposed practical
problems with lost responses, draft ownership, and interrupted processes.
Those findings inform the [proposed behavior](/docs/software-factory-behavior/).

The prototype's controlled-agent tests exercise process and persistence behavior.
They do not establish the quality of changes produced by a real model. Live
microphone accuracy, provider connectivity, and background-noise handling also
remain unverified.

SQLite, a single local worker, a shared access token, and the current transcription
provider are prototype choices. Production design still needs decisions about
identity, access, retention, execution isolation, operating cost, and recovery.
Preserving prototype code is not a reason to retain those choices.

## The first release boundary

The proposed first release covers deliberate conversations inside the factory app,
optional clarification, and changes prepared for human review. Listening in other
meeting tools, continuous background capture, and automatic production release are
outside that scope.

The next step is to [evaluate the proposal](/docs/evaluate-software-factory/) against
representative employee conversations before selecting a production implementation.
