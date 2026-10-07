# Run and verify Fieldnotes

Fieldnotes is served by `apps/web` at `/fieldnotes`. It uses the same shadcn sidebar, header arrangement, theme tokens, and providers as the fleet dashboard.

## Run the app

1. Install the Node and pnpm versions in the root `package.json`, then run `pnpm install`.
2. Create `apps/web/.env.local` in the worktree you are running:

   ```dotenv
   OPENAI_API_KEY=your-project-key
   ```

3. Start `pnpm --filter web dev`. Open `/fieldnotes` on the printed HTTPS preview origin.
4. Click **New chat** and choose the intended microphone.
5. Click **Play**, grant microphone permission, and speak a test sentence. Confirm that your words appear before presenting.

The API key needs access to `gpt-live-1` and `gpt-5.6-terra`. Set `FIELDNOTES_SPEC_MODEL` to change the Responses model used for specification generation. The key remains on the server. Restart the server after changing environment variables if the development server does not reload them.

The default database is `apps/web/.fieldnotes/notes.sqlite` when launched through the workspace script. Set `FIELDNOTES_DATABASE_PATH` to an absolute path for another writable location. Back up that database with SQLite tooling. The database and `.env.local` are ignored by Git.

Run this app behind the VM's private access boundary. The browser cookie separates saved workspaces; it is not an account login or a public-service access control. Public deployment needs authentication and per-user usage limits before enabling paid API requests. Clearing the cookie or changing origins loses browser access to the old workspace. There is no cross-device account recovery.

## Verify changes

Run `pnpm check`. The Fieldnotes tests cover persistence, ownership, deletion, session numbering, retry deduplication, stale generation, forced regeneration, API failures, and microphone lifecycle. Tests mock the external OpenAI transport, but use real SQLite databases and route handlers.

Use the [tutorial](../../apps/docs/src/content/docs/fieldnotes-tutorial.md) to verify the actual UI. Check these outcomes:

1. Create a chat. Right-click its name, choose **Rename**, save the name, and verify it after reload.
2. Press **Play**. Confirm that the equalizer sits between **Stop** and **Mute**, responds to sound, and stays flat for silent input.
3. Confirm that speech appears in the notes. A connected session and detected sound alone do not prove transcription.
4. Mute and unmute. Confirm that the microphone track changes and the connection stays open. Switch inputs and verify that the old track stops.
5. Present two features and send a correction to one. Confirm that the document describes those features, integrates the correction, and omits separate Clarifications, Open questions, and Acceptance criteria sections.
6. Click **Update specification** without adding input. Confirm that a new draft is saved from the existing notes. Repeat with an ended session.
7. Download `product-spec.md` and compare its contents with the saved draft.
8. Cancel the stop confirmation, then confirm it. Check that capture ends, final notes remain, and further messages are disabled.
9. Create a disposable session. Cancel its delete confirmation and confirm that it remains. Delete it, reload, and confirm that it is gone.
10. Keep an unsent message in one session while renaming or deleting a different disposable session. Confirm that the selected session and message remain unchanged.
11. Check a narrow viewport and dark mode. Verify that the session list and specification remain reachable without horizontal overflow.
12. Deny microphone permission and test an API failure. Confirm a useful error and retained notes.

If the verification browser cannot access a microphone, use a known audio fixture as a `MediaStream` input to the real WebRTC connection and report that substitution. This proves transport and transcription, but not the physical microphone permission path. Do not claim a mock provider is a live API test.

## Investigate missing speech

1. Confirm the selected microphone and the browser's microphone permission.
2. Ask for a short test sentence. Compare the input indicator with the captured transcript.
3. Inspect the session's latest `captureDiagnostics` in the local database. Compare successive samples to see whether sent packet and byte counts increase.
4. Check received event counts, transcript parse errors, and service errors. Do not treat transmitted bytes as proof that words were transcribed.
5. After a disconnection, reconnect with **Play** and verify new transcript text before continuing.

See the [Fieldnotes technical reference](fieldnotes-reference.md) for diagnostic fields, model configuration, prompt ownership, and persistence behavior.
