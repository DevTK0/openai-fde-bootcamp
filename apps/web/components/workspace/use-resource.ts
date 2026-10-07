"use client"
import { useEffect, useState } from "react"

export type Resource<T> =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; data: T }
export async function requestJson<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(url, { cache: "no-store", ...init })
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null)
    const message =
      body && typeof body === "object" && "error" in body
        ? String(body.error)
        : `Request failed (${response.status})`
    const issues =
      body &&
      typeof body === "object" &&
      "issues" in body &&
      Array.isArray(body.issues)
        ? body.issues.join(". ")
        : ""
    throw new Error([message, issues].filter(Boolean).join(". "))
  }
  return response.json()
}
export function useResource<T>(url: string, attempt = 0): Resource<T> {
  const [result, setResult] = useState<{
    url: string
    attempt: number
    state: Resource<T>
  } | null>(null)
  useEffect(() => {
    if (!url) return
    const controller = new AbortController()
    let active = true
    requestJson<T>(url, { signal: controller.signal }).then(
      (data) => {
        if (active) setResult({ url, attempt, state: { status: "ready", data } })
      },
      (error: unknown) => {
        if (active)
          setResult({
            url,
            attempt,
            state: {
              status: "error",
              error: error instanceof Error ? error.message : "Request failed",
            },
          })
      }
    )
    return () => {
      active = false
      controller.abort()
    }
  }, [url, attempt])
  return result?.url === url && result.attempt === attempt
    ? result.state
    : { status: "loading" }
}
