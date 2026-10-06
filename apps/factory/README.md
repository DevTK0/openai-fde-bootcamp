# LionLink software factory

The factory runs separately from `apps/web` on port 3002. It stores conversations and queued requests in SQLite, then runs an explicit worker to implement triggered requests in isolated git worktrees. The worker never automatically merges or deploys changes.

## Run locally

Use Node 22.12 or newer and pnpm 12.9.1. Run `pnpm install` from the repository root.

Set the same absolute `FACTORY_DATA_DIR` in both processes. Generate an access token of at least 24 characters and set `FACTORY_ACCESS_TOKEN` in the app process. This shared token grants access to all conversations and controls the worker queue. Use a private deployment for trusted employees. Speaker labels are not verified identities.

```bash
export FACTORY_DATA_DIR=/absolute/private/factory-data
export FACTORY_ACCESS_TOKEN=your-random-secret-with-at-least-24-characters
pnpm --filter factory dev
```

In a second terminal, configure the worker. Use a dedicated VM or container with a trusted repository. Dependency preparation and repository validation execute repository code. A git worktree prevents accidental source overlap; it is not a security boundary for hostile code. The worker's Codex process uses the workspace-write sandbox and cannot request approval to escape it.

```bash
export FACTORY_DATA_DIR=/absolute/private/factory-data
export FACTORY_REPO=/absolute/path/to/trusted/repository
export FACTORY_CODEX_ENABLED=1
codex login
pnpm --filter factory worker
```

The worker checks Codex authentication before claiming work. Missing credentials or configuration appear as blocked in the API. An absent or stale worker appears offline. Do not run multiple hosts against the same database. The worker ownership check uses local process IDs.

By default, each fresh worktree runs `pnpm install --frozen-lockfile --prod=false`, then Codex, then `pnpm check`. Server operators can change these commands through `FACTORY_PREPARE_COMMAND` and `FACTORY_CHECK_COMMAND`. Values are JSON objects with `command` and `args` fields, never shell strings. Set `FACTORY_PREPARE_COMMAND=null` for repositories without a preparation step. `FACTORY_CODEX_BIN` selects the installed executable. `FACTORY_TIMEOUT_MS` sets the per-process deadline, default 20 minutes. Commands and repository paths cannot be supplied through the API.

The worker uses documented `codex exec` flags from CLI version 0.159.0. It ignores user config, uses the default model, and reads auth from the worker's Codex environment. Each execution can incur model charges. Verification below uses a controlled executable fixture and incurs no model charges.

## Intake API

Send `Authorization: Bearer <FACTORY_ACCESS_TOKEN>` to `/api/factory`. `GET` returns the latest conversation and its requests. Supply `?conversationId=<uuid>` to select another conversation. `POST` accepts commands defined by `lib/contracts.ts` and returns the updated snapshot.

- `create` accepts `id` and `title`.
- `segment` accepts `id`, `conversationId`, `speaker`, and `text`. Submit finalized segments only. Reuse the same ID when retrying delivery. A conflicting body returns 409.
- `answer` accepts `requestId` and `answer` for a clarification.
- `retry` accepts `requestId` for failed work.
- `cancel` accepts `requestId` and stops an active subprocess.

The trigger is "I think we can get the software factory to do this". Matching ignores case and punctuation and handles adjacent finalized segments. Each new matching segment creates one request with up to 20 preceding segments. Interim transcription never enters the queue. Context is a snapshot at trigger time. Employees can add missing details through clarification.

## Review and recovery

The `ready` state includes the actual diff, check output, branch, and worktree path. Readiness requires nonempty changes and a zero check exit code. The diff includes agent-created commits by comparing against the captured base commit. Review output over 500000 characters fails explicitly.

Attempts remain under `FACTORY_DATA_DIR/attempts/<request-id>/<attempt>/`. Each has its own worktree, base commit, agent output, and validation logs. A failed attempt remains available for inspection. Retry creates a fresh attempt from the configured repository's current HEAD. Clarification answers follow the same rule. There is no automatic retention or deletion policy; operators must manage disk space and transcript retention.

A graceful stop kills the current process group. On restart, a stale worker's recorded child group is killed and any running request becomes failed. It does not automatically repeat uncertain work. Inspect the attempt, then retry. Local PID reuse and the small spawn-to-record crash interval remain limitations of this single-host process supervisor; use an OS service/container manager to kill the complete worker process group on host failures.

## Verify

```bash
pnpm --filter factory verify
pnpm check
pnpm --filter factory build
```

The verification driver creates a real temporary Git repository and launches a controlled agent executable. It checks persisted intake, duplicate and split triggers, real worktree isolation, code and diff output, clarification, failed validation, retry, cancellation, and interrupted-worker recovery. This proves process and persistence behavior; it does not prove the quality of a real model implementation.
