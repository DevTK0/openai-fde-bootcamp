# Run and verify Fieldnotes

Fieldnotes is served by `apps/web` at `/fieldnotes`. It uses the same shadcn sidebar, header arrangement, theme tokens, and providers as the fleet dashboard.

## Run the app

1. Install the Node and pnpm versions in the root `package.json`, then run `pnpm install`.
2. Create `apps/web/.env.local` in the worktree you are running:

   ```dotenv
   OPENAI_API_KEY=your-project-key
   ```

3. Start `pnpm --filter web dev`. Open `/fieldnotes` on the printed HTTPS preview origin.
4. Click **New chat**, then **Play**, and grant microphone permission.

The API key needs access to `gpt-live-1` and `gpt-5.6-terra`. Set `FIELDNOTES_SPEC_MODEL` to change the Responses model used for specification generation. The key remains on the server. Restart the server after changing environment variables if the development server does not reload them.

The default database is `apps/web/.fieldnotes/notes.sqlite` when launched through the workspace script. Set `FIELDNOTES_DATABASE_PATH` to an absolute path for another writable location. Back up that database with SQLite tooling. The database and `.env.local` are ignored by Git.

Run this app behind the VM's private access boundary. The browser cookie separates saved workspaces; it is not an account login or a public-service access control. Public deployment needs authentication and per-user usage limits before enabling paid API requests. Clearing the cookie or changing origins loses browser access to the old workspace. There is no cross-device account recovery.

## Verify changes

Run `pnpm check`. The Fieldnotes tests cover persistence across database reopen, ownership, retry deduplication, stale generation, ended-state enforcement, API failures, media cleanup, mute, and final transcript draining. Tests mock the external OpenAI transport, but use real SQLite databases and route handlers.

Use the [tutorial](../../apps/docs/src/content/docs/fieldnotes-tutorial.md) to verify the actual UI. Check these outcomes:

1. Create and rename a chat. Reload and open it from the sidebar.
2. Play a presentation. Confirm transcript text and a generated specification appear.
3. Mute and unmute. Confirm the microphone track changes and the connection stays open.
4. Send a scope correction. Confirm the saved specification includes it.
5. Download `product-spec.md`. Compare its contents with the saved draft.
6. Cancel the stop confirmation, then confirm it. Check that capture ends, the final notes remain, and further messages are disabled.
7. Check a narrow viewport and dark mode. Verify that the sidebar and specification are reachable without horizontal overflow.
8. Deny microphone permission and test an API failure. Confirm a useful error and retained notes.

If the verification browser cannot access a microphone, use a known audio fixture as a `MediaStream` input to the real WebRTC connection and report that substitution. This proves transport and transcription, but not the physical microphone permission path. Do not claim a mock provider is a live API test.

## Architecture and tradeoffs

The browser owns WebRTC and microphone tracks. The Next.js API exchanges its SDP offer with `POST /v1/live/sessions`. Transcript fragments retain event IDs, speaker identity, and session-relative timing. The browser saves batches every four seconds and requests a specification update after new input, with at least twelve seconds between completed automatic generations. Written clarifications request an immediate update.

SQLite owns the chat lifecycle and draft revisions. Input events have stable IDs so retrying a failed save cannot duplicate text. Generated drafts carry the input revision they describe; a late response cannot overwrite a newer draft. The previous draft survives generation failures. Ending a chat rejects further input on the server, while draft generation can still be retried.

A browser-only IndexedDB design with hosted delegation would move persistence and tool-result coordination into the UI. Server-owned SQLite keeps those rules testable in one place and makes state survive application restarts. The tradeoff is a single-node deployment with a writable filesystem. It does not support ephemeral serverless instances or multiple independent database copies.

The Live session handles speech. A separate Responses request writes the Markdown from saved evidence, so a draft update does not depend on a spoken model turn. There is no raw-audio storage or screen capture. Transcription and generated acceptance criteria require human review.

The implementation follows the official [GPT-Live WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc) and [session lifecycle](https://developers.openai.com/api/docs/guides/live-conversations) documentation. Keep event names and shutdown behavior aligned with those contracts.

Microphone capture exposes measured WebRTC input levels and device selection. The equalizer displays recent input levels; it does not synthesize activity from connection state. Confirm speech in the transcript before presenting. Session rows use the shared shadcn context menu for rename and permanent deletion. Deletion is owner-scoped and requires a confirmation in the UI. Per-owner counters preserve session numbering after deletion.

For capture troubleshooting, each session keeps its latest WebRTC diagnostic sample in SQLite. Samples contain microphone level and peak, device label, audio format, sent packet/byte counts, packet loss, received event counts, and service errors. They contain no raw audio. Compare these counters with saved user transcript events to distinguish quiet input, transport problems, and missing transcription. Deleting a session removes its diagnostics with its notes.

Specifications contain a heading and description for each presented feature. Written corrections update that feature directly; unresolved details and separate clarification/open-question sections are omitted. Manual Update specification regenerates from saved notes even when the input revision has not changed, so existing sessions can adopt the current format. Automatic generation still skips unchanged input.
