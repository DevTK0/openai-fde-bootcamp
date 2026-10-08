import { parseArgs } from "node:util"
import assert from "node:assert/strict"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

const { values } = parseArgs({
  options: {
    playwright: { type: "string", default: "playwright" },
    url: { type: "string", default: "http://127.0.0.1:4290" },
    output: { type: "string", default: ".audit/repair-browser" },
    live: { type: "boolean", default: false },
  },
})
const { chromium } = await import(values.playwright)
const origin = values.url
const output = values.output
const live = values.live
await mkdir(output, { recursive: true })
const browser = await chromium.launch({
  headless: true,
  args: [
    "--no-sandbox",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--disable-gpu-compositing",
  ],
})
const errors = []
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  })
  page.setDefaultTimeout(30_000)
  page.on("pageerror", (error) => errors.push(error.message))
  let requests = 0
  page.on("request", (request) => {
    if (request.url().endsWith("/api/repairs/analyze")) requests++
  })
  if (!live)
    await page.route("**/api/repairs/analyze", async (route) => {
      const request = route.request().postDataJSON()
      await route.fulfill({
        json: {
          request,
          generatedAt: "2026-10-08T00:00:00Z",
          model: "browser-test-fixture",
          analysis: {
            summary:
              "The reported door symptom needs an engineering inspection.",
            hypotheses: [
              {
                cause: "Possible door mechanism fault",
                rationale:
                  "The operator report supports checking the mechanism but does not confirm a cause.",
                evidenceIds: ["report"],
              },
            ],
            checks: [
              {
                action: "Ask engineering to inspect the door mechanism",
                reason:
                  "Distinguish obstruction, adjustment, and actuator faults.",
              },
            ],
            questions: ["What warning appears when the door fails?"],
            areas: [
              {
                id: "centre_door",
                reason: "The report identifies the centre door.",
                evidenceIds: ["report"],
              },
            ],
          },
          evidence: [
            {
              id: "report",
              kind: "report",
              title: "Operator report, unverified",
              detail: request.report,
            },
          ],
          trips: [],
        },
      })
    })
  await page.goto(`${origin}/dashboard?view=vehicles`)
  await page.getByRole("combobox", { name: "Vehicle planning date" }).click()
  await page.getByRole("option", { name: "2026-10-07", exact: true }).click()
  await page.getByRole("textbox", { name: "Search vehicle" }).fill("NW-W001")
  await page
    .getByRole("button", { name: "Inspect vehicle NW-W001", exact: true })
    .click()
  await page.getByRole("button", { name: "Analyze a reported fault" }).click()
  const dialog = page.getByRole("dialog", {
    name: "Repair investigation · NW-W001",
  })
  await dialog
    .getByRole("textbox", { name: "Your fault report" })
    .fill(
      "The centre door intermittently fails to close. No diagnostic checks have been performed yet."
    )
  assert.equal(
    requests,
    0,
    "Opening the panel and editing must not trigger analysis"
  )
  const responsePromise = page.waitForResponse(
    (r) => r.url().endsWith("/api/repairs/analyze"),
    { timeout: 100_000 }
  )
  await dialog
    .getByRole("button", { name: "Analyze fault", exact: true })
    .click()
  const response = await responsePromise
  const result = await response.json()
  await writeFile(
    path.join(output, "analysis.json"),
    JSON.stringify(result, null, 2)
  )
  assert.equal(response.status(), 200, JSON.stringify(result))
  assert.equal(result.request.vehicle, "NW-W001")
  assert.equal(result.request.date, "2026-10-07")
  assert.ok(
    result.analysis.hypotheses.length > 0,
    "Door report must get a useful investigation"
  )
  const ids = new Set(result.evidence.map((e) => e.id))
  for (const item of [...result.analysis.hypotheses, ...result.analysis.areas])
    assert.ok(
      item.evidenceIds.every((id) => ids.has(id)),
      "Citations must resolve"
    )
  assert.ok(
    result.analysis.areas.some((a) => ["centre_door", "doors"].includes(a.id)),
    "Door report must identify a relevant area"
  )
  await dialog
    .getByRole("heading", { name: "Possible causes and next checks" })
    .waitFor()
    .catch(async (error) => {
      await writeFile(
        path.join(output, "failure.txt"),
        (await page.locator("body").innerText()) + "\n" + errors.join("\n")
      )
      throw error
    })
  await dialog.locator("canvas").waitFor()
  await page.waitForFunction(
    () => !document.body.innerText.includes("Loading bus model")
  )
  assert.equal(await dialog.getByText(/3D view unavailable/).count(), 0)
  await dialog
    .getByRole("region", { name: "Possible causes" })
    .getByRole("link")
    .first()
    .click()
  assert.ok(
    await page.locator("[id^='repair-evidence-']:focus").count(),
    "Citations focus the original evidence"
  )
  await dialog.evaluate((element) => {
    element.scrollTop = 0
  })
  await page.screenshot({ path: path.join(output, "desktop.png") })
  await writeFile(
    path.join(output, "analysis.json"),
    JSON.stringify(result, null, 2)
  )
  await page.setViewportSize({ width: 390, height: 844 })
  await dialog.evaluate((element) => {
    element.scrollTop = 0
  })
  assert.ok(
    await dialog.evaluate(
      (element) => element.scrollWidth <= element.clientWidth + 1
    ),
    "Repair dialog fits mobile without horizontal overflow"
  )
  await page.screenshot({ path: path.join(output, "mobile.png") })
  await dialog
    .getByRole("textbox")
    .fill("The front door now has a different symptom.")
  assert.equal(
    await dialog
      .getByRole("heading", { name: "Possible causes and next checks" })
      .count(),
    0,
    "Editing discards stale conclusions"
  )
  assert.equal(requests, 1, "Editing must not rerun analysis")
  await dialog.getByRole("button", { name: "Close", exact: true }).click()
  await page.getByRole("button", { name: "Analyze a reported fault" }).click()
  assert.equal(
    await dialog.getByRole("textbox").inputValue(),
    "",
    "Reopening starts a fresh report"
  )
  assert.deepEqual(errors, [], "No browser runtime errors")
  console.log(
    JSON.stringify({
      result: "PASS",
      mode: live ? "live-provider" : "fixture-provider",
      requests,
      output,
    })
  )
} finally {
  await browser.close()
}
