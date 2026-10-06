import { describe, expect, it, vi } from "vitest"

const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT")
  }),
}))
vi.mock("next/navigation", () => ({ redirect }))

import Page from "@/app/page"

describe("Home page", () => {
  it("redirects to the dashboard", () => {
    expect(() => Page()).toThrow("NEXT_REDIRECT")
    expect(redirect).toHaveBeenCalledWith("/dashboard")
  })
})
