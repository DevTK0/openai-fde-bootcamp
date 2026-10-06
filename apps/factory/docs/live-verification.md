# Live UI verification

## Owner evidence

- `pnpm --filter factory test` passed seven tests. Protocol tests use supplied events, not a paid provider. Resource tests use fake browser audio resources because no microphone or API key is available in the owner environment.
- `pnpm --filter factory lint` passed.
- `GET /` returned HTTP 200 from the development server on port 3004.
- An authenticated `POST /api/transcription` returned HTTP 503 with a clear typed-transcript fallback because `OPENAI_API_KEY` is absent.
- The first full `pnpm check` found parent-layer type errors in the runner environment and command narrowing. A final check follows the parent rebase.
- T3 preview status and open both explicitly reported no automation host. The root owner used the allowed browser fallback against this instance. Final independent browser evidence belongs to the stack verification record.

## Review dispositions

Failed clarification answers now remain in the form. Typed transcript retries reuse their command ID. Disconnect is disabled while listening or while finalized speech is unsaved. Navigation warns when speech may be lost. Room selection updates the intended room before a poll can start. Only failed requests offer retry, matching the server state machine. Structured server errors display their message.

The shared textarea came from `pnpm dlx shadcn@latest add textarea -c apps/web`. The review claim that it was hand-written is incorrect.

Provider audio still requires a live verification run with an OpenAI key, explicit microphone permission and consenting speakers. Tests do not establish recognition accuracy or real provider connectivity.
