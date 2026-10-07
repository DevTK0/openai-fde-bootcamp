---
title: Capture a presentation with Fieldnotes
description: Start a presentation session, clarify details, and download a feature specification for implementation.
---

Fieldnotes listens to the current presentation and creates a real-time feature specification of the product being shown. Its system instructions already define that task. You do not need to tell the agent what to do before each presentation.

Have the presentation ready before starting a Fieldnotes session.

## 1. Start a presentation session

1. Click **New chat** in the left chat list.
2. Read the agent's message confirming that it is ready for the presentation.
3. Click **Play** when the presenter begins.

Chats use numbered names such as **Presentation 1** and **Presentation 2**. To rename one, right-click its name, choose **Rename**, enter a name, and click **Save**.

The player changes to **Stop**. The agent listens to the presentation and updates `product-spec.md` in the **Specification** panel as features are explained. No opening task prompt is needed.

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

Type the clarification in the message box and send it. If a detail is unknown, tell the agent to omit it rather than assume an answer.

The agent uses these clarifications to refine the specification. Review the updated feature description in the document preview.

![The conversation records a scope instruction, with the clarification visible in the document preview.](/docs/fieldnotes/tutorial-assets/03-clarifications.png)

## 4. Review and download the specification

1. Read the formatted Markdown preview in the **Specification** panel on the right.
2. Compare the captured features and clarifications with the presentation.
3. Send any corrections in the message box.
4. Click **Download** at the top of the panel to save the Markdown source as `product-spec.md`.

If the panel is hidden, click **Specification** in the top bar. Review unresolved decisions before requesting implementation.

## 5. Stop and end the conversation

Finish your clarifications and download the specification before ending the conversation.

1. Click **Stop** to the left of the equalizer.
2. Read the **End this conversation?** confirmation. Stopping ends the entire conversation, and you cannot resume it or send more messages.
3. Click **End conversation** to confirm. To keep the conversation open, click **Cancel** instead.

![A confirmation asks whether to end the entire conversation, with Cancel and End conversation buttons.](/docs/fieldnotes/tutorial-assets/04-stop-confirmation.png)

After confirmation, the message box and voice controls are disabled. Your specification remains available to preview and download. Start a new chat for another presentation.
