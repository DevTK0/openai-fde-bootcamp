import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import Page from "@/app/page"

describe("Page", () => {
  it("renders the heading and a shadcn button", () => {
    render(<Page />)

    expect(
      screen.getByRole("heading", { name: /project ready/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Button" })).toBeInTheDocument()
  })
})
