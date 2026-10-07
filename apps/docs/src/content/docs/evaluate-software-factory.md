---
title: Evaluate the software factory proposal
description: Review the proposed workflow with representative conversations before choosing a production implementation.
---

Use this procedure to decide whether the proposed workflow fits an employee task.
You need a representative pain point, consenting participants, and a reviewer who
can judge the resulting software behavior. A scripted walkthrough is sufficient
for an initial review. Use the throwaway prototype only when an executable example
helps answer a specific question.

## Define a useful outcome

1. Write down the employee task and the point where work becomes difficult.
2. Describe the smallest change that would improve that task.
3. Define the observable result that would show the change works.
4. Record the information that the agent needs from the conversation.

## Walk through the conversation

1. Explain what capture would store and where the content would be sent.
2. Confirm participant agreement before any actual capture.
3. Discuss the pain point without saying the trigger phrase.
4. Verify that ordinary discussion creates no implementation request.
5. Say "I think we can get the software factory to do this" after describing the change.
6. Inspect the proposed request and its captured context.
7. If necessary information is missing, answer the agent's clarification.
8. Compare the proposed change with the observable result defined earlier.

Record any mismatch between the employee's intent and the captured request. Keep
the conversation example with the finding so a later implementation can reproduce it.

## Exercise ambiguous and interrupted cases

Use a separate example for each case below. Record the expected outcome before
the walkthrough, then record the observed outcome.

- The speaker quotes the trigger phrase while explaining how the feature works.
- Background noise or a recognition correction changes the transcript.
- A connection retry delivers the same finalized text twice.
- The phrase spans two finalized transcript segments.
- The worker is unavailable when the employee requests a change.
- The employee closes the conversation after the factory accepts a request.
- The employee cancels an active attempt.
- Another employee answers a question while a draft answer is still open.
- A worker restarts during an attempt.
- The generated change fails a configured check.

If the expected outcome is disputed, record the case as an unresolved requirement.
Do not use the prototype's current behavior to settle a product decision.

## Record the decision

1. Classify each finding as an agreed requirement, an open decision, or a rejected behavior.
2. Attach the conversation example and any observed output to the finding.
3. Separate scripted or simulated results from live microphone and provider results.
4. Assign an owner to each open production decision in the [behavior reference](/docs/software-factory-behavior/#decisions-required-before-production).
5. Agree on pilot acceptance criteria before selecting production technology.

If live audio has not been tested, leave audio acceptance unresolved. If a
controlled executable supplied the code change, leave real model quality unresolved.
