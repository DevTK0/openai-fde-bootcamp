import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Button } from "@workspace/ui/components/button"

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
  })

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)

    await userEvent.click(screen.getByRole("button", { name: "Save" }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>
    )

    await userEvent.click(screen.getByRole("button", { name: "Save" }))

    expect(onClick).not.toHaveBeenCalled()
  })

  it("applies the variant class", () => {
    render(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole("button", { name: "Outline" })).toHaveClass(
      "border-border"
    )
  })
})
