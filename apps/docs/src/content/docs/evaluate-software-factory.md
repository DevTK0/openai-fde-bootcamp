---
title: Develop a feature from a transcript
description: Give pstack an existing transcript and a steering prompt, then guide the result to the right stopping point.
---

Use this procedure when you have a transcript or meeting notes and want a feature
brief, documentation, or an implementation. You need the source text and a checkout
with this repository's skills.

## Prepare the source

1. Save the transcript to a local file, or paste the text with your request.
2. Retain speaker labels and timestamps when available.
3. Remove details that are unnecessary for the task before giving the transcript to the agent.

If the transcript remains outside the repository, supply its absolute path. The
workflow does not require copying or committing it into the checkout.

## State the outcome and stopping point

Give the source location, the topic to focus on, and the work you want completed.
Name exclusions when the conversation discusses a broader change.

For a documentation-first task, use a prompt like this:

```text
/pstack Use /absolute/path/to/handover-transcript.txt.
Focus on the dispatchers' difficulty finding train readiness during handover.
Use transcript-to-feature to write the feature docs with technical-writing.
Separate agreed needs from suggested solutions and cite the relevant passages.
Do not implement the feature, open a PR, or deploy anything.
```

Replace the example path with your actual transcript path. Expect a brief with
source pointers followed by the requested documentation.

For implementation, state that explicitly:

```text
/pstack Use /absolute/path/to/handover-transcript.txt to implement a small
readiness indicator in the existing handover view. Use transcript-to-feature.
Keep the broader reporting rewrite out of scope. Verify the requested behavior.
Leave the changes local. Do not commit, open a PR, or deploy.
```

If a domain skill applies, name it in your prompt. The intake skill uses that skill
for domain guidance and keeps pstack responsible for delivery.

If your client intercepts `/pstack`, ask the agent to read
`.agents/skills/transcript-to-feature/SKILL.md` and include the same task prompt.

## Resolve material ambiguity

1. Read any question that identifies conflicting or missing requirements.
2. Check the cited passage before answering.
3. State which interpretation to use, or narrow the requested outcome.

The agent can proceed with reversible assumptions that do not materially change
the feature. You do not need to approve a brief separately when your prompt already
asks for implementation.

## Inspect the result

1. Compare the brief's scope with your steering prompt.
2. Follow the source pointers for the requirements that matter most.
3. Check that suggestions and inferences are not presented as agreed decisions.
4. Compare the delivered work with the acceptance criteria.
5. Read the verification evidence and unresolved questions before choosing the next step.

If you asked only for a brief or documentation, expect no feature implementation.
For input and output details, use the [workflow reference](/docs/software-factory-behavior/).
