import { describe, expect, it } from "vitest"
import { isSameOrigin } from "@/lib/server/http"

describe("planning mutation origin checks", () => {
  it("accepts the browser host even when Next reconstructs request.url with localhost", () => {
    const request = new Request("http://localhost:3005/api/planning/review", {
      method: "POST",
      headers: { Host: "127.0.0.1:3005", Origin: "http://127.0.0.1:3005" },
    })
    expect(isSameOrigin(request)).toBe(true)
  })

  it("rejects a different origin host and a missing origin", () => {
    expect(isSameOrigin(new Request("http://localhost:3005/api/planning/review", {
      method: "POST", headers: { Host: "127.0.0.1:3005", Origin: "http://evil.example" },
    }))).toBe(false)
    expect(isSameOrigin(new Request("http://localhost:3005/api/planning/review", { method: "POST" }))).toBe(false)
  })
})
