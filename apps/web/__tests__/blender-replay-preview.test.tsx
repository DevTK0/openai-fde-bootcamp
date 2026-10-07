import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterAll, beforeAll, expect, it, vi } from "vitest"
import { BlenderReplayPreview } from "@/components/blender-replay-preview"

beforeAll(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
    new DOMRect(0, 0, 1024, 400)
  )
})
afterAll(() => vi.restoreAllMocks())

it("offers the selected service's fixed video without claiming database synchronization", () => {
  render(<BlenderReplayPreview service="159" date="2026-10-07" />)
  const video = screen.getByLabelText(
    "Blender 3D example for service 159 on 7 October 2026"
  )
  expect(video.querySelector("source")).toHaveAttribute(
    "src",
    "/replay-examples/service-159-2026-10-07.mp4"
  )
  expect(video).toHaveAttribute("preload", "none")
  expect(
    screen.getByText(/Video playback is separate from the database replay/)
  ).toBeInTheDocument()
  fireEvent.error(video)
  expect(screen.getByRole("alert")).toHaveTextContent(
    "The video could not be loaded"
  )
  expect(screen.getByRole("link", { name: "Open video" })).toHaveAttribute(
    "href",
    "/replay-examples/service-159-2026-10-07.mp4"
  )
})

it("identifies a mismatched date or service and allows switching the prototype example", async () => {
  const user = userEvent.setup()
  render(<BlenderReplayPreview service="265" date="2026-10-08" />)
  expect(
    screen.getByText(/not the selected service 265 on 2026-10-08/)
  ).toHaveTextContent("service 132 on 7 October")
  await user.click(screen.getByRole("combobox", { name: "Blender example" }))
  await user.click(screen.getByRole("option", { name: "Service 159" }))
  expect(
    screen
      .getByLabelText("Blender 3D example for service 159 on 7 October 2026")
      .querySelector("source")
  ).toHaveAttribute("src", "/replay-examples/service-159-2026-10-07.mp4")
  expect(
    screen.getByText(/not the selected service 265 on 2026-10-08/)
  ).toHaveTextContent("service 159 on 7 October")
})
