import { parseArgs } from "node:util"
const { values } = parseArgs({
  options: {
    playwright: { type: "string", default: "playwright" },
    url: { type: "string", default: "http://127.0.0.1:3000" },
    output: { type: "string", default: "/tmp/planning-ui-verification.json" },
  },
})
const { chromium } = await import(values.playwright)
const base = values.url
import assert from "node:assert/strict"
import fs from "node:fs/promises"
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
})
const page = await browser.newPage({ viewport: { width: 1365, height: 918 } })
let errors = []
page.on("pageerror", (e) => errors.push(e.message))
const reports = []
async function pick(label, option) {
  await page.getByRole("combobox", { name: label, exact: true }).click()
  await page.getByRole("option", { name: option, exact: true }).click()
}
async function run(name, verify) {
  await page.getByRole("button", { name: "Compare plans", exact: true }).click()
  await page
    .getByRole("region", { name: "Planning results" })
    .waitFor({ timeout: 180000 })
  const href = await page
    .locator('a[href^="/api/planning?run="]')
    .getAttribute("href")
  const audit = await (await page.request.get(base + href)).json()
  const report = audit.files.find((f) => f.path === "report.json").data
  verify(report)
  reports.push({
    name,
    runId: report.runId,
    recommendations: report.recommendations.length,
    assessments: report.assessments.length,
    comparisons: report.rounds.length,
  })
  console.log(reports.at(-1))
}
await page.goto(base + "/ops-planning")
await pick("Situation", "Faulty bus in depot")
await pick("Operating date", "2026-10-05")
await pick("Route direction", "132 · B132_1")
await run("depot no cover", (r) => assert.equal(r.recommendations.length, 0))
await pick("Situation", "Faulty bus during service")
await pick("Route direction", "235 · B235_1")
await run("service rescue unknown", (r) => {
  assert.equal(r.recommendations.length, 0)
  assert(r.message.includes("transfer duration"))
})
await pick("Situation", "New bus")
await page
  .getByLabel("New bus IDs", { exact: true })
  .fill("TEST-1,TEST-2,TEST-3,TEST-4,TEST-5,TEST-6,TEST-7,TEST-8")
await pick("Resource status", "Confirmed in scenario")
await page
  .getByLabel("Additional requirements", { exact: true })
  .fill("Every affected trip must have at least two wheelchair spaces.")
await page
  .getByLabel("Ranking objective", { exact: true })
  .fill(
    "Prioritize wheelchair capacity, then prefer fewer changed crew assignments."
  )
await run("eight confirmed buses with accessibility policy", (r) => {
  assert(r.recommendations.length > 0)
  assert(r.rounds.some((x) => x.phase === "Round 1"))
  assert(r.rounds.every((x) => x.inputIds.length >= 2))
  assert(
    r.recommendations.every((p) =>
      p.assignments.every((a) => a.bus.startsWith("TEST-"))
    )
  )
})
await pick("Resource status", "Pending checks")
await run("pending buses cannot satisfy accessibility policy", (r) =>
  assert.equal(r.recommendations.length, 0)
)
await page.getByLabel("Additional requirements", { exact: true }).fill("")
await page.getByLabel("Ranking objective", { exact: true }).fill("")
await pick("Situation", "New crew")
await pick("Resource status", "Confirmed in scenario")
await page.getByLabel("New crew IDs", { exact: true }).fill("CREW-TEST")
await run("confirmed new crew", (r) => assert(r.recommendations.length > 0))
for (const name of [
  "Maintenance Cover",
  "Festival Allocation",
  "Evening Hold",
  "Engineering History Review",
]) {
  await pick("Situation", name)
  await run(name, (r) => {
    assert(r.recommendations.length > 0)
    assert(
      r.recommendations.every((p) =>
        ["conditional", "eligible"].includes(p.status)
      )
    )
  })
}
await pick("Situation", "New bus")
await pick("Resource status", "Confirmed in scenario")
await page.getByRole("button", { name: "Compare plans", exact: true }).click()
await page.getByRole("button", { name: "Cancel run", exact: true }).click()
await page.getByText(/cancelled/i).waitFor()
assert.equal(
  await page.getByRole("region", { name: "Planning results" }).count(),
  0
)
await page.setViewportSize({ width: 390, height: 844 })
const dimensions = await page.evaluate(() => ({
  width: innerWidth,
  scroll: document.documentElement.scrollWidth,
}))
assert(dimensions.scroll <= dimensions.width)
assert.deepEqual(errors, [])
await fs.writeFile(
  values.output,
  JSON.stringify(
    { reports, cancelled: true, mobile: dimensions, pageErrors: errors },
    null,
    2
  )
)
await browser.close()
