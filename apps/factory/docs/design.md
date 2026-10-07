# Factory intake and implementation

This document records the throwaway prototype. It is not a production design or
release acceptance record. The [feature proposal](../../docs/src/content/docs/software-factory.md)
and its linked requirements define the current documentation-first work.

## Existing system

The root workspace discovers `apps/*`. Turbo runs each package's checks. `apps/web` is a Next app, and `packages/ui` owns UI components. There is no conversation storage or job runner to reuse. The factory is a separate Next app and an explicit local worker process. It leaves fleet data and web routes alone.

## Usage

An authenticated employee creates a conversation, submits finalized transcript segments, then reads a snapshot. A segment that completes "I think we can get the software factory to do this" queues a request with its preceding context. The worker implements that request or asks a question. Answering the question queues another attempt. A reviewer receives the actual diff and check output.

```ts
await fetch('/api/factory', {method: 'POST', headers, body: JSON.stringify({kind: 'create', id: crypto.randomUUID(), title: 'Dispatch feedback'})})
await fetch('/api/factory', {method: 'POST', headers, body: JSON.stringify({kind: 'segment', id: crypto.randomUUID(), conversationId, speaker: 'Employee', text})})
await fetch('/api/factory?conversationId=' + conversationId, {headers})
```

## Candidate A. Request process owns everything

`submit(segment): Promise<RequestResult>` appends a JSON transcript and starts Codex inside the HTTP request. One module owns intake and execution. Its interface is short, but callers must keep the request alive and recover partial file writes. Duplicate submits need coordination with running processes. Next restarts interrupt work and leave ambiguous results. This candidate fails the crash and idempotency requirements.

## Candidate B. Durable queue and explicit worker

`Store.apply(command): Snapshot` owns a SQLite transaction for each intake or lifecycle action. `worker.runOnce(config, store): Promise<boolean>` claims one queued request and produces an isolated attempt. `RequestState` is a discriminated union. The API parses input, checks authentication, and calls the store. The worker owns process execution and records observed results. Clients do not know worktree paths or executable configuration.

SQLite WAL serializes queue claims. A local worker ownership record prevents two worker loops on the same database. Each attempt uses a new worktree. Recovery marks interrupted work failed and requires an explicit retry, preserving the old worktree as evidence. A worker never interprets conversation text as a shell command.

## Synthesis decision

Use candidate B. Retain candidate A's single command API, but move execution out of the HTTP lifetime. Model the Domain makes lifecycle states explicit. Boundary Discipline places validation at HTTP, database, environment, and agent-output boundaries. Make Operations Idempotent gives finalized segment IDs a unique key and checks duplicate content. Prove It Works requires a real git diff and actual check process status before review readiness.

The public API hides persistence and queue transitions. Configuration remains server-owned. The design red-flag review found one intentional shared writer boundary, the SQLite store. Both API and worker use that owner instead of updating JSON or SQL independently.

## Tradeoffs accepted

- One local machine and one worker exchange horizontal scale for inspectable recovery and no queue infrastructure.
- A shared access token exchanges employee identity attribution for a small deployment boundary. Speaker labels are descriptive, not authenticated identities.
- A configured repository and sandboxed Codex process exchange arbitrary repository selection for controlled execution.
- Interrupted work requires a retry, preserving evidence instead of repeating uncertain side effects automatically.

## Open risks

Does the deployment need enterprise identity before wider employee access? Which repository and validation command should the operator configure? These choices do not block local implementation. Missing configuration blocks worker execution visibly.

## Implementation order

Build schemas and transactional storage, then the API and worker, then verify a temporary git repository with a controlled agent fixture. A later PR adds the live conversation UI and microphone input.
