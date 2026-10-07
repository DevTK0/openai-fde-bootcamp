---
title: Capture a presentation with Fieldnotes
description: Capture presented features, correct their descriptions, and download a feature specification.
---

Use Fieldnotes to turn a spoken product presentation into `product-spec.md`. The document describes the features you present. You do not need to give the agent an opening task prompt.

The specification documents each presented feature, its purpose, and demonstrated behavior. Written corrections update the relevant feature directly. It does not add separate clarification or open-question sections.

Have the presentation ready before starting a Fieldnotes session.

## Before you start

Open `/fieldnotes` on the web app's preview origin. Use HTTPS or localhost, and allow microphone access when your browser asks. Fieldnotes captures microphone audio. It does not capture your screen or audio from another browser tab.

The app server needs an `OPENAI_API_KEY` with access to `gpt-live-1` and the specification model. For a local worktree, put the key in that worktree's `apps/web/.env.local`. Never commit the file.

Audio and written notes are sent to OpenAI. Let the presenter know before starting. The app saves transcripts and specifications in a local SQLite database, but does not save raw audio. Your browser's cookie identifies your saved chats. Use the same browser and preview origin to return to them.

The screenshots below show the implemented app with the shared web app components. The example uses prerecorded speech to exercise the live audio connection.

## 1. Start a presentation session

1. Click **New chat** in the left chat list.
2. Read the agent's message confirming that it is ready for the presentation.
3. Choose the microphone you use for the presentation from the input selector.
4. Click **Play** and allow microphone access.
5. Speak a short test sentence. Confirm that the equalizer moves and your words appear in the captured notes before the presentation begins.

Chats use numbered names such as **Presentation 1** and **Presentation 2**. To rename one, right-click its name and choose **Rename**, enter a name, and click **Save**.

The equalizer sits between **Play** and **Mute** and shows recent microphone levels. **Play** changes to **Stop** while capture is active. A moving equalizer confirms detected sound, but only transcript text confirms captured words. Look for **Transcribing your presentation**.

GPT-Live transcribes the presentation. Fieldnotes updates the **Specification** panel in batches as notes arrive.

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

> Only project managers can create projects.

Type the clarification in the message box and send it. Unresolved details are omitted rather than invented.

The app saves your clarification and refines the specification. Wait for **Draft saved**, then review the updated feature description in the document preview. You can also send written details before starting audio.

![The project creation feature incorporates the correction that only project managers can create projects.](/docs/fieldnotes/tutorial-assets/03-clarifications.png)

## 4. Review and download the specification

1. Read the formatted Markdown preview in the **Specification** panel on the right.
2. Compare the documented features with the presentation.
3. Send any corrections in the message box.
4. Click **Download** at the top of the panel to save the Markdown source as `product-spec.md`.

If the panel is hidden, click **Specification** in the top bar. On narrow screens, scroll below the conversation to see it. Check that each description matches what was presented.

The document has a heading for each presented feature, followed by its purpose, workflow, and demonstrated behavior. Stated inputs, outputs, constraints, and release scope belong with that feature. It omits unresolved details and separate planning sections.

If an update fails, your previous draft and saved notes remain available. **Updates pending** means the downloadable draft does not yet include every saved note.

### Regenerate an existing specification

To apply the current feature-focused format to a saved session:

1. Finish any active conversation, then open the saved session.
2. Click **Update specification**, the circular-arrow button beside **Download**.
3. Wait for **Draft saved**.
4. Review the feature descriptions and download the new document.

Regeneration uses the saved notes and replaces the previous draft. It works for ended sessions with saved input. You do not need to record the presentation again.

## 5. Stop and end the conversation

Finish your clarifications and download the specification before ending the conversation.

1. Click **Stop** to the left of the equalizer.
2. Read the **End this conversation?** confirmation. Stopping ends the entire conversation, and you cannot resume it or send more messages.
3. Click **End conversation** to confirm. To keep the conversation open, click **Cancel** instead.

![A confirmation asks whether to end the entire conversation, with Cancel and End conversation buttons.](/docs/fieldnotes/tutorial-assets/04-stop-confirmation.png)

Fieldnotes stops sending microphone audio, waits for final transcript events, and saves the notes before ending the conversation. After confirmation, the message box and voice controls are disabled. Your specification remains available to preview and download. If generation failed, **Update specification** can still retry from the saved notes. Start a new chat for another presentation.

## Delete a session

Deletion permanently removes the session, transcript, specification, and capture diagnostics. Download the specification first if you want to keep it.

1. Finish live capture and wait for pending saves and updates to finish.
2. Right-click the session name.
3. Choose **Delete session**.
4. Check the name in the confirmation.
5. Choose **Delete session** to remove it, or **Cancel** to keep it.

Renaming or deleting another session leaves your selected session and unsent message in place.

## Recover from a connection problem

If **No microphone signal detected** appears, check the microphone mute switch and select the intended input. This message means that Fieldnotes has not detected a recent signal; it does not mean the device is missing.

If **Audio detected · waiting for transcript** appears, sound is reaching the browser but no speech transcript has arrived yet. Speak a short sentence and check the captured notes before continuing. A microphone that works in another app may use a different input there.

If **Connected · waiting for transcript** appears, the browser may not expose input levels. Check for transcript text instead of relying on the equalizer.

If microphone permission is denied, allow it in your browser settings and click **Play** again. Written clarifications remain available.

If the connection drops, review the last captured words before pressing **Play** to reconnect. Audio during the gap is not captured. Leaving the page closes the audio connection. Open the saved chat when you return.

If the app cannot confirm the final session event, it reports that final usage is unconfirmed and releases the microphone. Saved notes remain available.
