# Live UI verification

This document records the throwaway prototype. It is not a production design or
release acceptance record. The [feature proposal](../../docs/src/content/docs/software-factory.md)
and its linked requirements define the current documentation-first work.

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

Failed clarification answers remain in the form. Typed transcript retries and unchanged conversation creation retries reuse their command IDs. Disconnect is disabled while listening or while finalized speech is unsaved. Navigation warns when speech may be lost. Room selection pauses polling and capture until its snapshot loads. A failed selection keeps the previously loaded room active. Only failed requests offer retry, matching the server state machine. Structured server errors display their message.

The [official transcription guide](https://developers.openai.com/api/docs/guides/realtime-transcription) requires client-side voice activity detection for `gpt-live-transcribe`. The client now uses measured audio alone to decide when to commit. Transcript deltas only update the displayed partial text. The local RMS threshold is 0.005; lower levels remain below that detector threshold. Microphone calibration and recognition quality require real audio verification.

The shared textarea came from `pnpm dlx shadcn@latest add textarea -c apps/web`. The review claim that it was hand-written is incorrect.

Provider audio still requires a live verification run with an OpenAI key, explicit microphone permission, and consenting speakers. Tests do not establish recognition accuracy or real provider connectivity. That review thread remains open.

## UI race regression checks

The follow-up owner reproduced three failures in `LiveRoom` component tests before changing production code. A completed transcript save erased a newer draft, a completed create request erased a newer conversation name, and room selection left microphone capture enabled against the old room.

The fixes retain newer drafts by checking the submitted command identity. Room selection uses the existing busy state so polling, capture, and mutations wait for navigation. Clarification saves also preserve newer edits.

`pnpm check` passes with 25 factory tests. Six component tests exercise pending-save edits, unchanged submitted text, successful room selection, failed room selection, and clarification edits through the rendered controls. `pnpm --filter factory build` passes. The component checks mock the network and transcription adapter; live browser and provider verification remain separate gates.

## Audio commit regression checks

Before the follow-up fix, analyser samples with RMS 0.008 produced no commit on stop or after silence. Samples with RMS 0.03 committed once, but a subsequent delta before acknowledgement triggered a duplicate commit. All three checks failed for those reasons before the production change.

The fixed tests provide audio samples before committing and transcript events afterward. They cover delayed acknowledgements, a new utterance while an earlier commit remains outstanding, ordered final delivery, and resource cleanup. `pnpm check` passes with 27 factory tests, and `pnpm --filter factory build` passes. These checks use fake audio resources and supplied protocol events, not a live provider connection.

## Session ownership regression checks

The reviewer and owner reproduced a late automatic-login failure deleting a newer token, and request selection erasing an unsent clarification. Manual login now advances the existing session generation. Restore completion can only update the generation that started it. Clarification drafts belong to request IDs in the parent component and clear on successful unchanged submission or disconnect.

Four additional component cases cover stale restore success and failure, authenticated commands retaining the new token, unsent and failed clarification saves across request selection, and cleared drafts after disconnect and reconnect. `pnpm check` passes with 31 factory tests. `pnpm --filter factory build` passes.
