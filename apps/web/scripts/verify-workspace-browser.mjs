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
  await page.goto(`${base}/workspace`)
  await page.getByRole("heading", { name: "Decision workspace" }).waitFor()
  const seedName = await page
    .getByRole("combobox", { name: "Data revision", exact: true })
    .innerText()
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
  await page.screenshot({ path: `${output}/desktop.png`, fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth
    ),
    false,
    "mobile document has no horizontal overflow"
  )
  await page.screenshot({ path: `${output}/mobile.png`, fullPage: true })
  assert.deepEqual(errors, [])
  console.log(
    "PASS: upload, literal metrics, revision restoration, charts, citations, scoped export, missing evidence, filters, invalid/duplicate imports, mobile"
  )
} finally {
  await browser.close()
}
