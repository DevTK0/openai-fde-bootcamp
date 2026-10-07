# Live UI verification

## Owner evidence

The owner checked code revision `17a39d7c30c6a6f7f7fb9588ce4050990c3d3f44` on October 7, 2026.

- `pnpm check` passed all 14 workspace tasks, including 19 factory tests.
- `pnpm --filter factory build` passed and generated the conversation page and both API routes.
- `pnpm build` completed the factory, docs, and slides builds. The owner stopped the remaining web build at the stack supervisor's request. This is not a successful full-workspace build receipt.
- Lifecycle tests cover quiet speech committed on silence and on stop, late deltas before and after commit acknowledgement, missing provider configuration, and cancellation during microphone permission or audio activation.
- Protocol tests use supplied events. Resource tests use fake browser audio resources because no microphone or API key is available in the owner environment.
- Earlier owner checks returned HTTP 200 for `GET /` and HTTP 503 with the typed-transcript fallback for an authenticated `POST /api/transcription` without `OPENAI_API_KEY`.
- T3 preview previously reported no automation host. Independent browser verification uses the installed Playwright fallback and is recorded separately by the stack supervisor at the final stack revision.

## Review dispositions

Failed clarification answers remain in the form. Typed transcript retries and unchanged conversation creation retries reuse their command IDs. Disconnect is disabled while listening or while finalized speech is unsaved. Navigation warns when speech may be lost. Room selection updates the intended room before a poll can start. Only failed requests offer retry, matching the server state machine. Structured server errors display their message.

Quiet speech recognized by the provider counts as activity even below the local volume threshold. Committed item IDs prevent trailing transcript deltas from causing another commit. This follows the [OpenAI realtime transcription protocol](https://developers.openai.com/api/docs/guides/realtime-transcription), which allows live transcript deltas before the client commits the turn.

The shared textarea came from `pnpm dlx shadcn@latest add textarea -c apps/web`. The review claim that it was hand-written is incorrect.

Provider audio still requires a live verification run with an OpenAI key, explicit microphone permission, and consenting speakers. Tests do not establish recognition accuracy or real provider connectivity. That review thread remains open.
