# Fieldnotes technical reference

Fieldnotes runs at `/fieldnotes` in `apps/web`. It uses React, Next.js, Tailwind, and local shadcn components from `@workspace/ui`. The session list uses the shared context menu for Rename and Delete session.

For setup and manual checks, see [Run and verify Fieldnotes](fieldnotes.md). The [user tutorial](../../apps/docs/src/content/docs/fieldnotes-tutorial.md) covers capture, corrections, and document download.

## Configuration

| Setting                    | Purpose                                                                  | Default                                                         |
| -------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------- |
| `OPENAI_API_KEY`           | Server-side project key with access to the live and specification models | Required for AI requests                                        |
| `FIELDNOTES_SPEC_MODEL`    | Responses model for specification generation                             | `gpt-5.6-terra`                                                 |
| `FIELDNOTES_DATABASE_PATH` | Writable SQLite database path                                            | `.fieldnotes/notes.sqlite` under the server's working directory |

The workspace launch script runs the server in `apps/web`, so its default database is `apps/web/.fieldnotes/notes.sqlite`. The live model is `gpt-live-1`. Environment overrides belong in the active worktree's `apps/web/.env.local`. The key and database are ignored by Git.

## Prompts and document format

[openai.ts](../../apps/web/lib/fieldnotes/openai.ts) owns two application instructions:

- `createLiveSession` configures a quiet presentation listener. The listener avoids interruptions, answers briefly when asked, and does not invent features or claim that it saved a specification. The current draft is supplied as context.
- `generateSpecification` configures a separate writer. The writer receives the saved transcript and written notes. Assistant speech provides context, not evidence of requirements.

The specification starts with `# Feature specification`, followed by a descriptive heading for each presented feature. Each description covers its purpose, workflow, and demonstrated behavior. Inputs, outputs, constraints, and release scope appear only when stated.

Written corrections override earlier spoken claims and update the relevant feature directly. The writer omits unresolved details, empty sections, and separate Overview, Clarifications, Open questions, Assumptions, Recommendations, Next steps, and Acceptance criteria sections. These are model instructions, not a deterministic output schema. The document still requires review.

The exact prompt strings remain in the source file above so this reference does not maintain a second copy.

## Capture and generation

The browser owns WebRTC and microphone tracks. The Next.js API exchanges the SDP offer with `POST /v1/live/sessions`. Transcript fragments retain event IDs, speaker identity, and session-relative timing.

The browser saves pending notes in batches every four seconds. Automatic generation follows changed input, with at least twelve seconds between completed automatic generations. Written corrections request an immediate update. Manual **Update specification** regenerates from saved notes even when the input revision has not changed.

The equalizer displays recent measured microphone levels. Its motion indicates detected sound, not confirmed transcription. Input selection replaces the transmitted microphone track and releases the previous track. Mute disables the track without ending the conversation.

The live session handles speech. A separate Responses request writes Markdown, so specification generation does not depend on a spoken model turn. Fieldnotes captures microphone input, not system audio or the screen. It does not store raw audio.

## Saved sessions

SQLite stores each browser-owned session, its input events, specification, and latest capture diagnostics. A cookie identifies the owner. It is not an account login. Changing origins or clearing the cookie removes browser access to the previous workspace; there is no cross-device account recovery.

Stable input event IDs prevent duplicate notes when saves are retried. Drafts carry the input revision they describe. A result for an older input revision cannot overwrite a draft for a newer revision. Manual regeneration can replace a draft for the same input revision. The previous draft survives generation failures.

Ending a conversation rejects further input but preserves its notes and allows specification regeneration. Deletion removes the session record, including its transcript, specification, and diagnostics. Per-owner counters prevent automatic presentation numbers from being reused after deletion.

The database requires a single-node deployment with a writable filesystem. Independent database copies and ephemeral serverless instances are not supported. Private access is assumed; the owner cookie does not provide public-service authentication or usage limits.

## Capture diagnostics

The browser sends a diagnostic sample about every five seconds while capture runs. The latest sample is stored as `captureDiagnostics` on the session. Samples contain no raw audio.

| Fields                                    | Meaning                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------ |
| `sessionId`, `capturedAt`                 | Live session identifier and sample time                                  |
| `connection`, `channel`                   | WebRTC connection and data-channel states                                |
| `device`, `level`, `peak`                 | Selected input label, measured level, and peak since the previous sample |
| `bytesSent`, `packetsSent`, `packetsLost` | Audio transport counters when the browser exposes them                   |
| `codec`, `sampleRate`, `channelCount`     | Negotiated codec and microphone settings                                 |
| `events`                                  | Counts of received server event types                                    |
| `parseErrors`, `lastError`                | Rejected input-transcript payload count and latest service error         |

A null metric means it was unavailable. A nonzero level proves input activity, while increasing sent counters prove transmission activity. Neither proves that speech reached the captured notes. Received input-transcript events and saved user fragments provide that evidence.

The implementation follows the official [GPT-Live WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc) and [session lifecycle](https://developers.openai.com/api/docs/guides/live-conversations) contracts.
