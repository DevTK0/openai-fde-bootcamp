import {
  bridgeContextChanges,
  claimLiveEvent,
  completeLiveRun,
  monitorSettings,
  reserveModelBudget,
  saveRunTrace,
} from "./store"
import { assessWithAgent } from "./agent"
import type { TraceStep } from "./contracts"

export async function processLiveEvent(owner: string): Promise<boolean> {
  // Disabled agents leave records queued. Rate control delays work; it never fabricates a fallback recommendation.
  bridgeContextChanges()
  const state = monitorSettings()
  if (
    state.paused ||
    !state.llm_enabled ||
    (state.last_model_at && Date.now() - Date.parse(state.last_model_at) < 5000)
  )
    return false
  const job = claimLiveEvent(owner)
  if (!job) return false
  if (!reserveModelBudget(5000)) {
    completeLiveRun(
      job.event,
      owner,
      null,
      [],
      "The agent was disabled before its assessment started. Request a fresh assessment after enabling it."
    )
    return true
  }
  let trace: TraceStep[] = []
  try {
    const decision = await assessWithAgent(job.event, (steps) => {
      trace = steps
      saveRunTrace(job.event.seq, owner, steps)
    })
    completeLiveRun(job.event, owner, decision, decision.trace)
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Agent could not complete the assessment."
    trace.push({
      phase: "agent",
      title: "Agent assessment unavailable",
      summary: message,
      outcome: "blocked",
      at: new Date().toISOString(),
    })
    completeLiveRun(job.event, owner, null, trace, message)
  }
  return true
}
