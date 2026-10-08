import { parseArgs } from "node:util"
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import process from "node:process"

const { values } = parseArgs({
  options: {
    playwright: { type: "string", default: "playwright" },
    url: { type: "string", default: "http://127.0.0.1:3000" },
    "env-file": { type: "string" },
    output: { type: "string", default: "/tmp/planning-ui-verification.json" },
  },
})
// eslint-disable-next-line turbo/no-undeclared-env-vars -- This paid live check runs outside cached Turbo tasks.
let key = process.env.OPS_PLANNING_ACCESS_KEY
if (!key && values["env-file"]) {
  const line = (await fs.readFile(values["env-file"], "utf8"))
    .split("\n")
    .find((line) => line.startsWith("OPS_PLANNING_ACCESS_KEY="))
  key = line
    ?.slice("OPS_PLANNING_ACCESS_KEY=".length)
    .trim()
    .replace(/^['"]|['"]$/g, "")
}
assert(key, "Set OPS_PLANNING_ACCESS_KEY or supply --env-file with its path")
const { chromium } = await import(values.playwright)
const base = new URL(values.url).origin
const browser = await chromium.launch({ headless: true })
try {
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1365, height: 918 },
  })
  const page = await context.newPage()
  page.setDefaultTimeout(30000)
  const errors = []
  page.on("pageerror", (error) => errors.push(error.message))
  const reports = []
  await page.goto(base + "/ops-planning")
  await page.waitForFunction(() =>
    Object.keys(document.querySelector("form") ?? {}).some((key) =>
      key.startsWith("__reactProps")
    )
  )
  await page.getByLabel("Planner access key", { exact: true }).fill(key)
  for (const name of [
    "Toa Payoh bus withdrawal",
    "Ang Mo Kio bus withdrawal",
    "Toa Payoh relief crew sickness",
  ]) {
    await page.getByRole("combobox", { name: "Situation", exact: true }).click()
    await page.getByRole("option", { name, exact: true }).click()
    const start = Date.now()
    const runResponse = page.waitForResponse(
      (response) =>
        response.url() === base + "/api/planning" &&
        response.request().method() === "POST"
    )
    await page
      .getByRole("button", { name: "Compare plans", exact: true })
      .click()
    await page
      .getByRole("region", { name: "Planning results" })
      .waitFor({ timeout: 180000 })
    const events = (await (await runResponse).text())
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line))
    const report = events.find((event) => event.type === "result")?.report
    assert(report, "The stream must finish with a report")
    assert.equal(
      await page
        .getByRole("region", { name: "Coordinated plan timeline", exact: true })
        .count(),
      4
    )
    assert.equal(
      await page
        .getByRole("tab", { name: "Comparison rounds", exact: true })
        .count(),
      0
    )
    const response = await context.request.get(
      base + "/api/planning?run=" + report.runId
    )
    assert.equal(response.status(), 200)
    const entrants = report.assessments.filter((a) => a.status === "eligible")
    assert.equal(entrants.length, 36)
    assert.equal(report.rounds.length, 19)
    const compared = new Set(report.rounds.flatMap((round) => round.inputIds))
    assert(entrants.every((entry) => compared.has(entry.id)))
    assert(report.rounds.every((round) => new Set(round.inputIds).size >= 2))
    assert.equal(report.recommendations.length, 4)
    reports.push({
      name,
      runId: report.runId,
      entrants: entrants.length,
      comparisons: report.rounds.length,
      seconds: (Date.now() - start) / 1000,
    })
    console.log(reports.at(-1))
    await page.getByLabel("Planner access key", { exact: true }).fill("")
  }
  await page.getByRole("button", { name: "Compare plans", exact: true }).click()
  await page.getByRole("button", { name: "Cancel run", exact: true }).click()
  await page.getByText(/cancelled/i).waitFor()
  assert.equal(
    await page.getByRole("region", { name: "Planning results" }).count(),
    0
  )
  await page.setViewportSize({ width: 390, height: 844 })
  const mobile = await page.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
  }))
  assert(mobile.scroll <= mobile.width)
  assert.deepEqual(errors, [])
  const anonymous = await browser.newContext({ ignoreHTTPSErrors: true })
  assert.equal(
    (
      await anonymous.request.post(base + "/api/planning", { data: {} })
    ).status(),
    401
  )
  assert.equal(
    (
      await anonymous.request.get(
        base + "/api/planning?run=" + reports[0].runId
      )
    ).status(),
    401
  )
  assert.equal(
    (
      await anonymous.request.post(base + "/api/planning", {
        headers: {
          Authorization: "Bearer " + key,
          Origin: "https://different.example",
        },
        data: {},
      })
    ).status(),
    403
  )
  await fs.writeFile(
    values.output,
    JSON.stringify(
      {
        reports,
        cancelled: true,
        mobile,
        pageErrors: errors,
        accessChecksPassed: true,
      },
      null,
      2
    )
  )
} finally {
  await browser.close()
}
