import { Buffer } from "node:buffer"
import { setTimeout as delay } from "node:timers/promises"
import assert from "node:assert/strict"
import { readFile, mkdir } from "node:fs/promises"
import { createRequire } from "node:module"
import process from "node:process"

const [
  base = "http://localhost:3013",
  playwrightPath = "playwright",
  output = "/tmp/workspace-browser-proof",
] = process.argv.slice(2)
const { chromium } = createRequire(import.meta.url)(playwrightPath)
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
page.setDefaultTimeout(90000)
const errors = []
page.on("pageerror", (error) => errors.push(error.message))
await mkdir(output, { recursive: true })
const sample = await readFile(
  new URL("../public/evidence/example-bundle.json", import.meta.url),
  "utf8"
)
async function pick(label, option) {
  await page.getByRole("combobox", { name: label, exact: true }).click()
  await page.getByRole("option", { name: option, exact: true }).click()
}
async function metric(id, value) {
  await page
    .locator(`[data-metric="${id}"] [data-slot="card-title"]`)
    .filter({ hasText: new RegExp(`^${value}$`) })
    .waitFor()
}
async function upload(text) {
  await page
    .getByLabel("Upload evidence bundle", { exact: true })
    .setInputFiles({
      name: "evidence.json",
      mimeType: "application/json",
      buffer: Buffer.from(text),
    })
}
try {
  await page.goto(`${base}/workspace?revision=`)
  await page.getByRole("heading", { name: "Decision workspace" }).waitFor()
  const seedName = await page
    .getByRole("combobox", { name: "Data revision", exact: true })
    .innerText()
  await page
    .getByText(
      "Requested revision is unavailable. Showing the supplied fixture instead.",
      { exact: true }
    )
    .waitFor()
  await page
    .getByRole("button", {
      name: "Where might the festival plan have gaps?",
      exact: true,
    })
    .click()
  await page
    .getByRole("combobox", { name: "Evidence table", exact: true })
    .filter({ hasText: "Temporary event routes" })
    .waitFor()
  await page
    .getByRole("button", { name: "What is driving repair cost?", exact: true })
    .click()
  await page
    .getByRole("button", { name: "Inspect contributing records" })
    .first()
    .click()
  await page.getByText("Import new evidence", { exact: true }).click()
  await upload(sample)
  await metric("repair_cost", "500")
  await metric("repair_rate", "500")
  await metric("repair_hours", "10")
  await page.getByRole("cell", { name: "DEMO-V001", exact: true }).waitFor()
  assert.match(page.url(), /revision=[a-f0-9]{64}/)
  const uploadedUrl = page.url()
  await page.reload()
  await metric("repair_cost", "500")
  await page
    .getByRole("button", {
      name: "What affects service reliability?",
      exact: true,
    })
    .click()
  await metric("completion", "80")
  await metric("on_time", "75")
  await page
    .getByRole("button", {
      name: "Where is boarding capacity constrained?",
      exact: true,
    })
    .click()
  await metric("boardings", "200")
  await metric("queued_calls", "20")
  assert.deepEqual(
    await page.locator("[data-metric]").evaluateAll((cards) =>
      cards.map((card) => card.getAttribute("data-metric"))
    ),
    ["boardings", "queued_calls", "completion"]
  )
  await page.getByText("Passenger boardings over time", { exact: true }).waitFor()
  await page.getByText("Calls with a queue over time", { exact: true }).waitFor()
  await page
    .locator("[data-report-chart] svg.recharts-surface")
    .first()
    .waitFor()
  await page
    .getByRole("button", { name: "What is driving repair cost?", exact: true })
    .click()
  await page
    .getByLabel("Evidence question", { exact: true })
    .fill("DEMO-V001 repair cost")
  await page
    .getByRole("button", { name: "Search evidence", exact: true })
    .click()
  await page.getByRole("button", { name: "Export context", exact: true }).waitFor()
  let failNextSearch = true
  await page.route(/\/api\/workspace\//, async (route) => {
    if (new URL(route.request().url()).searchParams.get("view") === "context" && failNextSearch) {
      failNextSearch = false
      return route.fulfill({ status: 502, contentType: "text/html", body: "Gateway down" })
    }
    return route.continue()
  })
  await page.getByRole("button", { name: "Search evidence", exact: true }).click()
  await page.getByRole("alert").filter({ hasText: "Request failed (502)" }).waitFor()
  await page.getByRole("button", { name: "Search evidence", exact: true }).click()
  await page.getByRole("button", { name: "Export context", exact: true }).waitFor()
  assert.equal(await page.getByRole("alert").count(), 0)
  await page.unrouteAll({ behavior: "wait" })
  await page
    .getByRole("button", { name: /Open citation.*maintenance.*row-1/ })
    .click()
  await page.getByText("Complete cited record", { exact: true }).waitFor()
  const downloadEvent = page.waitForEvent("download")
  await page
    .getByRole("button", { name: "Export context", exact: true })
    .click()
  const download = await downloadEvent
  const context = JSON.parse(await readFile(await download.path(), "utf8"))
  assert.equal(context.filters.vehicle, "DEMO-V001")
  assert.ok((await readFile(await download.path(), "utf8")).length <= 32000)
  assert.equal(
    context.revision,
    new URL(uploadedUrl).searchParams.get("revision")
  )
  await page
    .getByLabel("Evidence question", { exact: true })
    .fill("unrecorded-spacecraft-fuel")
  await page
    .getByRole("button", { name: "Search evidence", exact: true })
    .click()
  await page.getByText(/No matching row evidence supports/).waitFor()
  await pick("Vehicle filter", "DEMO-V001")
  await metric("repair_cost", "500")
  await page
    .getByRole("button", {
      name: "What affects service reliability?",
      exact: true,
    })
    .click()
  await metric("completion", "Unavailable")
  await page.getByRole("button", { name: "Reset filters", exact: true }).click()
  await metric("completion", "80")
  await page.getByText("Import new evidence", { exact: true }).click()
  await upload("{invalid-json")
  await page
    .getByRole("status")
    .filter({ hasText: /Invalid|JSON|Unexpected/ })
    .waitFor()
  await metric("completion", "80")
  await upload(sample)
  await page.getByText(/Already imported/).waitFor()
  await pick("Data revision", seedName)
  await page
    .getByRole("combobox", { name: "Evidence table", exact: true })
    .waitFor()
  await pick("Data revision", "Fresh service review example")
  await metric("completion", "80")
  const extended = JSON.parse(sample)
  extended.name = "Long evidence and pagination example"
  extended.tables.push({
    id: "work-orders",
    title: "Work order notes",
    sourceId: "demo",
    kind: "evidence",
    columns: ["notes", "tail", "amount"],
    caveats: ["Quotes are not realised costs."],
    rows: Array.from({ length: 26 }, (_, index) => ({
      id: `record-${index + 1}`,
      values: {
        notes: "cooling ".repeat(300),
        tail: `Complete record tail ${index + 1}`,
        amount: index + 1,
      },
    })),
  })
  await upload(JSON.stringify(extended))
  await page
    .getByRole("combobox", { name: "Data revision", exact: true })
    .filter({ hasText: extended.name })
    .waitFor()
  await pick("Evidence table", "Work order notes (26)")
  await page.getByRole("button", { name: "Next records", exact: true }).click()
  await page.getByRole("cell", { name: "record-26", exact: true }).waitFor()
  await page
    .getByLabel("Search records", { exact: true })
    .fill("Complete record tail 26")
  await page
    .getByText("1 matching records · Page 1 of 1", { exact: true })
    .waitFor()
  await page.getByLabel("Evidence question", { exact: true }).fill("cooling")
  await page
    .getByRole("button", { name: "Search evidence", exact: true })
    .click()
  await page
    .getByRole("button", { name: /Open citation.*work-orders.*record-1$/ })
    .click()
  await page
    .locator("dd")
    .filter({ hasText: /^Complete record tail 1$/ })
    .waitFor()
  await page
    .getByRole("button", {
      name: "Open citation · demo / paragraph 1",
      exact: true,
    })
    .click()
  await page
    .locator("div.bg-muted")
    .filter({ hasText: "Revision" })
    .filter({ hasText: "example fixture, September and October 2026" })
    .waitFor()
  await pick("Data revision", "Fresh service review example")
  await metric("completion", "80")
  let releaseOld
  let started
  const oldStarted = new Promise((resolve) => {
    started = resolve
  })
  const oldRelease = new Promise((resolve) => {
    releaseOld = resolve
  })
  await page.route(/\/api\/workspace\//, async (route) => {
    if (
      new URL(route.request().url()).searchParams.get("from") !== "2030-01-01"
    )
      return route.continue()
    const response = await route.fetch()
    started()
    await oldRelease
    await route.fulfill({ response }).catch(() => {})
  })
  await page.getByLabel("From", { exact: true }).fill("2030-01-01")
  await oldStarted
  await page.getByRole("button", { name: "Reset filters", exact: true }).click()
  await metric("completion", "80")
  releaseOld()
  await delay(300)
  await metric("completion", "80")
  await page.unrouteAll({ behavior: "wait" })
  await delay(2000)
  assert.ok(
    (await page.locator(".recharts-bar-rectangle path").count()) >= 3,
    "Single-period metrics and raw records render visible bars"
  )
  await page.screenshot({ path: `${output}/desktop.png`, fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth
    ),
    false,
    "mobile document has no horizontal overflow"
  )
  await pick(
    "Decision question",
    "Ridership · Where is boarding capacity constrained?"
  )
  await metric("boardings", "200")
  await delay(2000)
  await page.screenshot({ path: `${output}/mobile.png`, fullPage: true })
  assert.deepEqual(errors, [])
  console.log(
    "PASS: upload, literal metrics, revision restoration, charts, same-query retry recovery, citations, scoped export, missing evidence, filters, invalid/duplicate imports, mobile"
  )
} catch (error) {
  await page
    .screenshot({ path: `${output}/failure.png`, fullPage: true })
    .catch(() => {})
  console.error((await page.locator("body").innerText()).slice(-6000))
  throw error
} finally {
  await browser.close()
}
