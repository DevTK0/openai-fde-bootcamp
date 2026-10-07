import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"
import { requestJson, useResource } from "@/components/workspace/use-resource"

afterEach(() => vi.unstubAllGlobals())

it("keeps the latest scope when an earlier request completes last", async () => {
  let finishOld: (response: Response) => void = () => {}
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) =>
      url === "/old"
        ? new Promise<Response>((resolve) => {
            finishOld = resolve
          })
        : Promise.resolve(Response.json({ revision: "new", value: 500 }))
    )
  )
  const { result, rerender } = renderHook(
    ({ url }) => useResource<{ revision: string; value: number }>(url),
    { initialProps: { url: "/old" } }
  )
  rerender({ url: "/new" })
  expect(result.current.status).toBe("loading")
  await waitFor(() =>
    expect(result.current).toEqual({
      status: "ready",
      data: { revision: "new", value: 500 },
    })
  )
  await act(async () => {
    finishOld(Response.json({ revision: "old", value: 99 }))
  })
  expect(result.current).toEqual({
    status: "ready",
    data: { revision: "new", value: 500 },
  })
})

it("shows the HTTP status for a non-JSON proxy failure", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(
        new Response("<html>Gateway down</html>", { status: 502 })
      )
  )
  await expect(requestJson("/failed")).rejects.toThrow("Request failed (502)")
})
