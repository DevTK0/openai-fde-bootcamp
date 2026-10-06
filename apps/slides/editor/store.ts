import { useEffect, useSyncExternalStore } from "react"
import type { Slide } from "../content/decks"
export type SavedDeck = {
  revision: number
  slides: Slide[]
  baselines: string[]
  stale: number[]
  updatedAt: string | null
}
type State = { data?: SavedDeck; error?: string; loading: boolean }
const states = new Map<string, State>()
const listeners = new Set<() => void>()
const empty: State = { loading: true }
export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
function notify() {
  listeners.forEach((listener) => listener())
}
export function snapshot(id: string) {
  return states.get(id) ?? empty
}
export async function load(id: string, force = false) {
  if (states.has(id) && !force) return
  states.set(id, { ...states.get(id), loading: true })
  notify()
  try {
    const response = await fetch(
      `/slides/api/decks/${encodeURIComponent(id)}`,
      { cache: "no-store" }
    )
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    states.set(id, { data, loading: false })
  } catch (error) {
    states.set(id, {
      ...states.get(id),
      loading: false,
      error:
        error instanceof Error ? error.message : "Could not load saved slides",
    })
  }
  notify()
}
export function useSavedDeck(id: string) {
  const state = useSyncExternalStore(
    subscribe,
    () => snapshot(id),
    () => empty
  )
  useEffect(() => {
    void load(id)
  }, [id])
  return state
}
export async function save(
  id: string,
  revision: number,
  updates: { index: number; baseline: string; slide: Slide | null }[]
) {
  const response = await fetch(`/slides/api/decks/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ revision, updates }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error)
  states.set(id, { data, loading: false })
  notify()
  return data as SavedDeck
}
if (typeof window !== "undefined")
  window.addEventListener("focus", () => {
    for (const id of states.keys()) void load(id, true)
  })
