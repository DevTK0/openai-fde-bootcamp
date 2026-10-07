import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  TimePicker,
  TimePickerInput,
  TimePickerInputGroup,
  TimePickerSeparator,
} from "@workspace/ui/components/time-picker"

beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  )
})
afterEach(() => vi.unstubAllGlobals())

const segments = (
  <TimePickerInputGroup>
    <TimePickerInput segment="hour" aria-label="Hours" />
    <TimePickerSeparator />
    <TimePickerInput segment="minute" aria-label="Minutes" />
  </TimePickerInputGroup>
)

describe("TimePicker", () => {
  it("submits the initial value and subsequent edits through its named form control", () => {
    render(
      <form aria-label="Assumptions">
        <TimePicker name="start" defaultValue="06:00" locale="en-GB">
          {segments}
        </TimePicker>
      </form>
    )
    const form = screen.getByRole("form", { name: "Assumptions" })
    if (!(form instanceof HTMLFormElement)) throw new Error("Expected form")
    expect(new FormData(form).get("start")).toBe("06:00")
    fireEvent.change(screen.getByRole("textbox", { name: "Minutes" }), {
      target: { value: "15" },
    })
    expect(new FormData(form).get("start")).toBe("06:15")
  })

  it("displays controlled playback changes without reporting a user edit", () => {
    const onValueChange = vi.fn()
    const { rerender } = render(
      <TimePicker value="06:00" locale="en-GB" onValueChange={onValueChange}>
        {segments}
      </TimePicker>
    )
    rerender(
      <TimePicker value="06:02" locale="en-GB" onValueChange={onValueChange}>
        {segments}
      </TimePicker>
    )
    expect(screen.getByRole("textbox", { name: "Minutes" })).toHaveValue("02")
    expect(onValueChange).not.toHaveBeenCalled()
    fireEvent.change(screen.getByRole("textbox", { name: "Minutes" }), {
      target: { value: "03" },
    })
    expect(onValueChange).toHaveBeenCalledWith("06:03")
  })
})
