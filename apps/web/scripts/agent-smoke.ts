import { randomUUID } from "node:crypto"
import {
  heartbeat,
  releaseMonitor,
  updateMonitorSettings,
  requestAgentAssessment,
  liveSnapshot,
} from "../lib/live/store"
import { processLiveEvent } from "../lib/live/worker"
const owner = randomUUID()
if (!heartbeat(owner))
  throw new Error("Stop the monitor before this smoke test; its lease is held.")
const beat = setInterval(() => heartbeat(owner), 2000)
try {
  updateMonitorSettings({ llmEnabled: true, paused: false })
  const event = requestAgentAssessment("238")
  console.log(`Enabled OpenAI agent; assessing database request #${event.seq}.`)
  await processLiveEvent(owner)
  const state = liveSnapshot(),
    decision = state.decisions.find((row) => row.eventSeq === event.seq),
    run = state.runs.find((row) => row.eventSeq === event.seq)
  console.log(
    JSON.stringify(
      {
        run: run?.status,
        error: run?.error,
        origin: decision?.origin,
        model: decision?.model.name,
        title: decision?.title,
        insights: decision?.agent?.insights,
        recommendations: decision?.agent?.recommendations,
        allocations: decision?.agent?.proposals,
        usage: decision?.agent?.usage,
        trace: run?.trace.map((step) => ({
          phase: step.phase,
          title: step.title,
          outcome: step.outcome,
        })),
      },
      null,
      2
    )
  )
  if (!decision || decision.origin !== "agent" || run?.status !== "completed")
    process.exitCode = 1
} finally {
  clearInterval(beat)
  releaseMonitor(owner)
}
