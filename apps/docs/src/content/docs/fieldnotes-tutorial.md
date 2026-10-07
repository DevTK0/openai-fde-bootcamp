---
title: Capture a presentation with Fieldnotes
description: Start a presentation session, clarify details, and download a feature specification for implementation.
---

Fieldnotes listens to the current presentation and creates a real-time feature specification of the product being shown. Its system instructions already define that task. You do not need to tell the agent what to do before each presentation.

Have the presentation ready before starting a Fieldnotes session.

## Before you start

Open `/fieldnotes` on the web app's preview origin. Use HTTPS or localhost, and allow microphone access when your browser asks. Fieldnotes captures microphone audio. It does not capture your screen or audio from another browser tab.

The app server needs an `OPENAI_API_KEY` with access to `gpt-live-1` and the specification model. For a local worktree, put the key in that worktree's `apps/web/.env.local`. Never commit the file.

Audio and written notes are sent to OpenAI. Let the presenter know before starting. The app saves transcripts and specifications in a local SQLite database, but does not save raw audio. Your browser's cookie identifies your saved chats. Use the same browser and preview origin to return to them.

The screenshots below show the implemented app with the shared web app components. The example uses prerecorded speech to exercise the live audio connection.

## 1. Start a presentation session

1. Click **New chat** in the left chat list.
2. Read the agent's message confirming that it is ready for the presentation.
3. Click **Play** when the presenter begins.

Chats use numbered names such as **Presentation 1** and **Presentation 2**. To rename one, right-click its name and choose **Rename**, enter a name, and click **Save**.

Choose your microphone below the equalizer. Speak and check that the bars move, then wait for **Transcribing your presentation** and your words in the notes. A connected session alone does not confirm that speech is being captured. The player changes to **Stop**. GPT-Live transcribes the presentation, and the app updates `product-spec.md` in the **Specification** panel in batches. No opening task prompt is needed.

While audio capture is active, finish the conversation before switching chats. If you only want to pause your microphone, use **Mute**. On a narrow screen, use **Toggle Sidebar** to open the chat list.

![A presentation session with the agent ready to capture features and a specification draft in the right panel.](/docs/fieldnotes/tutorial-assets/01-new-chat.png)

## 2. Use the voice controls

1. Click **Mute** when you need to stop sharing microphone audio.
2. Look for the crossed-out microphone icon.
3. Click **Unmute** to resume sharing audio.

Muting keeps the conversation open. Use the message box for clarifications while your microphone is muted.

![The voice controls with Stop available and the microphone muted.](/docs/fieldnotes/tutorial-assets/02-player-muted.png)

## 3. Clarify what the presenter means

Let the presentation supply the main description. Use chat to correct a detail, answer an agent question, or add context that was not spoken aloud. For example:

> That feature is planned for a later release, not the first version.

Type the clarification in the message box and send it. If a detail is unknown, tell the agent to leave it as an open question rather than assume an answer.

The app saves your clarification and refines the specification. Wait for **Draft saved**, then review the **Clarifications** section in the document preview. You can also send written details before starting audio.

![The conversation records a scope instruction, with the clarification visible in the document preview.](/docs/fieldnotes/tutorial-assets/03-clarifications.png)

## 4. Review and download the specification

1. Read the formatted Markdown preview in the **Specification** panel on the right.
2. Compare the captured features and clarifications with the presentation.
3. Send any corrections in the message box.
4. Click **Download** at the top of the panel to save the Markdown source as `product-spec.md`.

If the panel is hidden, click **Specification** in the top bar. On narrow screens, scroll below the conversation to see it. Review unresolved decisions before requesting implementation.

If an update fails, your previous draft and saved notes remain available. Click **Update specification** to retry. **Updates pending** means the downloadable draft does not yet include every saved note.

## 5. Stop and end the conversation

Finish your clarifications and download the specification before ending the conversation.

1. Click **Stop** below the equalizer.
2. Read the **End this conversation?** confirmation. Stopping ends the entire conversation, and you cannot resume it or send more messages.
3. Click **End conversation** to confirm. To keep the conversation open, click **Cancel** instead.

![A confirmation asks whether to end the entire conversation, with Cancel and End conversation buttons.](/docs/fieldnotes/tutorial-assets/04-stop-confirmation.png)

Fieldnotes stops sending microphone audio, waits for final transcript events, and saves the notes before ending the conversation. After confirmation, the message box and voice controls are disabled. Your specification remains available to preview and download. If generation failed, **Update specification** can still retry from the saved notes. Start a new chat for another presentation.

## Delete a session

Right-click a session name and choose **Delete session**. The confirmation names the session and explains that its transcript and specification will be permanently deleted. Choose **Cancel** to keep it. Finish live capture before deleting a session.

## Recover from a connection problem

If the equalizer stays flat and **No microphone signal detected** appears, check the microphone mute switch and select a different input. If audio is detected but no words appear, review your connection before continuing.

If microphone permission is denied, allow it in your browser settings and click **Play** again. Written clarifications remain available.

If the connection drops, review the last captured words before pressing **Play** to reconnect. Audio during the gap is not captured. Leaving the page closes the audio connection. Open the saved chat when you return.

If the app cannot confirm the final session event, it reports that final usage is unconfirmed and releases the microphone. Saved notes remain available.
