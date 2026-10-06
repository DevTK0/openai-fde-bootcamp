# Live conversation design

The browser owns microphone permission, connection lifetime and partial text. The server owns durable finalized segments and request transitions. `startTranscription` accepts a cancellation signal and callbacks. It returns a stop operation which flushes speech before closing the connection. Committed item order determines transcript order, even when final events arrive out of order.

We compared browser SpeechRecognition with OpenAI WebRTC transcription. Browser recognition needs less server code, but browser support and provider behavior vary. WebRTC gives this app an explicit provider protocol and keeps the project key on the server. Typed conversation remains available without an audio provider.

We compared a chat-only view with a conversation and request split view. Chat-only makes request state and clarifications hard to find among conversation turns. The split view keeps the transcript on the left and durable requests on the right. On narrow screens these sections stack. Empty screens explain how to start instead of inventing requests.

The chosen structure has three parts. A transport owns audio resources. An ordered transcript buffer owns event reconciliation. The room component owns interaction and uses the core API schemas. No partial transcript may trigger implementation. A stopped microphone releases every media track. Closing the room also aborts pending setup.

OpenAI's October 2026 [transcription documentation](https://developers.openai.com/api/docs/guides/realtime-transcription) recommends `gpt-live-transcribe`, client voice detection and explicit commits. Its [WebRTC documentation](https://developers.openai.com/api/docs/guides/voice-webrtc) documents server-side SDP exchange through `/v1/realtime/calls`. Live paid-provider verification requires a configured key and microphone. Protocol tests are not evidence of a completed provider call.
