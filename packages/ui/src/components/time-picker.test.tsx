import { fireEvent, render, screen, within } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  TimePicker,
  TimePickerInput,
  TimePickerInputGroup,
  TimePickerSeparator,
  TimePickerLabel,
  TimePickerTrigger,
  TimePickerContent,
  TimePickerHour,
  TimePickerMinute,
} from "@workspace/ui/components/time-picker"

beforeEach(() => {
  HTMLElement.prototype.scrollIntoView = vi.fn()
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

it("keeps rejected controlled edits tied to the supplied value", () => {
  render(
    <TimePicker value="12:00" locale="en-GB" onValueChange={() => {}}>
      {segments}
    </TimePicker>
  )
  const minutes = screen.getByRole("textbox", { name: "Minutes" })
  fireEvent.focus(minutes)
  fireEvent.change(minutes, { target: { value: "30" } })
  fireEvent.blur(minutes)
  expect(minutes).toHaveValue("00")
})

it("keeps cleared segments incomplete instead of using the local clock", async () => {
  render(
    <form aria-label="Assumptions">
      <TimePicker name="start" defaultValue="06:00" locale="en-GB">
        {segments}
      </TimePicker>
    </form>
  )
  const hours = screen.getByRole("textbox", { name: "Hours" })
  fireEvent.focus(hours)
  if (!(hours instanceof HTMLInputElement)) throw new Error("Expected input")
  hours.select()
  fireEvent.keyDown(hours, { key: "Backspace" })
  const minutes = screen.getByRole("textbox", { name: "Minutes" })
  fireEvent.change(minutes, { target: { value: "15" } })
  fireEvent.blur(minutes)
  await Promise.resolve()
  const form = screen.getByRole("form")
  if (!(form instanceof HTMLFormElement)) throw new Error("Expected form")
  expect(new FormData(form).get("start")).toBe("--:15")
})

it("cancels a pending digit with Escape", () => {
  render(
    <TimePicker defaultValue="06:00" locale="en-GB">
      {segments}
    </TimePicker>
  )
  const hours = screen.getByRole("textbox", { name: "Hours" })
  hours.focus()
  fireEvent.change(hours, { target: { value: "1" } })
  fireEvent.keyDown(hours, { key: "Escape" })
  expect(hours).toHaveValue("06")
})

it("names the input group and focuses its first segment from the label", () => {
  render(
    <TimePicker defaultValue="06:00" locale="en-GB">
      <TimePickerLabel>Window start</TimePickerLabel>
      {segments}
    </TimePicker>
  )
  expect(
    screen.getByRole("group", { name: "Window start" })
  ).toBeInTheDocument()
  fireEvent.click(screen.getByText("Window start"))
  expect(screen.getByRole("textbox", { name: "Hours" })).toHaveFocus()
})

it("restores its default value on form reset", () => {
  render(
    <form aria-label="Assumptions">
      <TimePicker name="start" defaultValue="06:00" locale="en-GB">
        {segments}
      </TimePicker>
    </form>
  )
  fireEvent.change(screen.getByRole("textbox", { name: "Minutes" }), {
    target: { value: "15" },
  })
  fireEvent.reset(screen.getByRole("form"))
  expect(screen.getByRole("textbox", { name: "Minutes" })).toHaveValue("00")
})

it("selects popup options and leaves Tab to the browser", async () => {
  render(
    <TimePicker defaultValue="06:00" locale="en-GB">
      {segments}
      <TimePickerTrigger aria-label="Choose time" />
      <TimePickerContent>
        <TimePickerHour />
        <TimePickerMinute aria-label="Minute options" />
      </TimePickerContent>
    </TimePicker>
  )
  fireEvent.click(screen.getByRole("button", { name: "Choose time" }))
  const minutes = await screen.findByLabelText("Minute options")
  const option = within(minutes).getByRole("button", { name: "15" })
  fireEvent.click(option)
  expect(screen.getByRole("textbox", { name: "Minutes" })).toHaveValue("15")
  expect(fireEvent.keyDown(option, { key: "Tab" })).toBe(true)
  expect(fireEvent.keyDown(option, { key: "Tab", shiftKey: true })).toBe(true)
})

it("cancels a focused pending edit when the form resets", () => {
  render(
    <form aria-label="Assumptions">
      <TimePicker name="start" defaultValue="06:00" locale="en-GB">
        {segments}
      </TimePicker>
    </form>
  )
  const minutes = screen.getByRole("textbox", { name: "Minutes" })
  fireEvent.focus(minutes)
  fireEvent.change(minutes, { target: { value: "15" } })
  fireEvent.reset(screen.getByRole("form"))
  fireEvent.blur(minutes)
  expect(minutes).toHaveValue("00")
  const form = screen.getByRole("form")
  if (!(form instanceof HTMLFormElement)) throw new Error("Expected form")
  expect(new FormData(form).get("start")).toBe("06:00")
})
