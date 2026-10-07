#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { restoreSource } = require('./restore-source.cjs');
const { chromium } = require(process.env.VERIFY_SLIDES_PLAYWRIGHT || 'playwright');

const [baseUrl, evidencePath] = process.argv.slice(2);
if (!baseUrl || !evidencePath) {
  throw new Error('Usage: verify-native-editability.cjs <owned-preview-url> <new-evidence-directory>');
}
const sourcePath = path.resolve('apps/slides/slides/ridership/index.tsx');
const currentPath = path.resolve('apps/slides/node_modules/.open-slide/current.json');
const evidence = path.resolve(evidencePath);
const hash = (value) => createHash('sha256').update(value).digest('hex');
const originalText = 'A bus can run and still leave people behind.';
const temporaryText = 'Editable verification heading';
const expectedSourceText = `{"${originalText}"}`;
const headingPattern = /(<h1\b[^>]*>)[\s\S]*?<\/h1>/;
const withoutHeadingContent = (source) => source.replace(headingPattern, '$1</h1>');

async function poll(check) {
  const deadline = Date.now() + 15000;
  let lastError;
  while (Date.now() < deadline) {
    try { return await check(); } catch (error) { lastError = error; }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw lastError;
}

async function run() {
  await fs.mkdir(evidence, { recursive: false });
  const original = await fs.readFile(sourcePath, 'utf8');
  assert.equal(original.split(expectedSourceText).length, 2, 'Expected one editable heading literal');
  const isOwnedSave = (source) => {
    const block = source.match(headingPattern)?.[0];
    return block?.includes(`{'${temporaryText}'}`) &&
      withoutHeadingContent(source) === withoutHeadingContent(original);
  };
  await fs.writeFile(path.join(evidence, 'before.tsx'), original);
  const actions = [];
  const record = async (action, result) => {
    actions.push({ at: new Date().toISOString(), action, result });
    await fs.writeFile(path.join(evidence, 'actions.json'), JSON.stringify(actions, null, 2));
  };
  let browser;
  let context;
  let page;
  let savedSource;
  let failure;
  const pageUrl = new URL('s/ridership?p=1', baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`).href;
  try {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
    page = await context.newPage();
    const snapshot = async (name) => {
      await fs.writeFile(path.join(evidence, `${name}.aria.txt`), await page.locator('body').ariaSnapshot());
      await page.screenshot({ path: path.join(evidence, `${name}.png`), fullPage: true });
    };
    await page.goto(baseUrl);
    await page.getByRole('link', { name: 'Ridership', exact: true }).click();
    await page.locator('[data-inspector-root] h1').waitFor();
    await record('Open Ridership from gallery', { url: page.url() });
    await page.goto(pageUrl);
    const heading = page.locator('[data-inspector-root] h1');
    await heading.waitFor();
    assert.equal(await heading.innerText(), originalText);
    await snapshot('before');
    await record('Open Ridership page 1 directly', { url: page.url(), heading: originalText, sourceHash: hash(original) });
    await page.getByRole('button', { name: 'Edit', exact: true }).click();
    await heading.click();
    await page.getByRole('button', { name: 'Edit on slide', exact: true }).click();
    await page.locator('[contenteditable="true"]').fill(temporaryText);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await poll(async () => {
      const value = await fs.readFile(sourcePath, 'utf8');
      assert.ok(isOwnedSave(value), 'Native Save must change only the selected heading content');
      savedSource = value;
    });
    await fs.writeFile(path.join(evidence, 'saved.tsx'), savedSource);
    await page.reload();
    await poll(async () => assert.equal(await heading.innerText(), temporaryText));
    await snapshot('saved-reloaded');
    await record('Edit on slide, Save, and reload', { heading: temporaryText, sourceHash: hash(savedSource), sourceChange: 'Only the selected heading literal changed' });
    await heading.dblclick();
    await page.locator('[contenteditable="true"]').fill('Unsaved verification heading');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Discard', exact: true }).click();
    await poll(async () => assert.equal(await heading.innerText(), temporaryText));
    assert.equal(await fs.readFile(sourcePath, 'utf8'), savedSource);
    await record('Double-click text and Discard a second edit', 'Saved heading and source remain unchanged');
    await page.getByRole('button', { name: 'Go to page 3', exact: true }).click();
    const label = page.locator('[data-inspector-root] figure p').filter({ hasText: /^39$/ });
    await label.click();
    const labelState = await poll(async () => {
      const state = JSON.parse(await fs.readFile(currentPath, 'utf8'));
      assert.equal(state.pageIndex, 2);
      assert.equal(state.selection?.text, '39');
      return state;
    });
    await snapshot('label-selected');
    await page.locator('[data-inspector-root] figure div.bg-destructive').first().click();
    const shapeState = await poll(async () => {
      const state = JSON.parse(await fs.readFile(currentPath, 'utf8'));
      assert.equal(state.selection?.tagName, 'div');
      assert.notEqual(state.selection?.line, labelState.selection.line);
      return state;
    });
    await snapshot('shape-selected');
    await fs.writeFile(path.join(evidence, 'selections.json'), JSON.stringify({ labelState, shapeState }, null, 2));
    await record('Select chart label and bar independently', { labelLine: labelState.selection.line, shapeLine: shapeState.selection.line });
  } catch (error) {
    failure = error;
    await record('Verification failed', String(error));
    if (page) await page.screenshot({ path: path.join(evidence, 'failure.png') }).catch(() => {});
  } finally {
    if (context) {
      await context.tracing.stop({ path: path.join(evidence, 'trace.zip') })
        .catch((error) => record('Trace capture failed', String(error)));
    }
    if (browser) await browser.close();
    try {
      const result = await restoreSource({ sourcePath, original, savedSource });
      assert.equal(hash(await fs.readFile(sourcePath)), hash(original));
      await record('Cleanup', { result, restoredHash: hash(original) });
    } catch (error) {
      await fs.writeFile(path.join(evidence, 'preserved.tsx'), await fs.readFile(sourcePath));
      await record('Cleanup preserved changed source', { error: String(error), backup: path.join(evidence, 'before.tsx') });
      throw error;
    }
  }
  if (failure) throw failure;
  const checkBrowser = await chromium.launch({ headless: true });
  try {
    const restoredPage = await checkBrowser.newPage();
    await restoredPage.goto(pageUrl);
    await poll(async () => assert.equal(await restoredPage.locator('[data-inspector-root] h1').innerText(), originalText));
    await restoredPage.screenshot({ path: path.join(evidence, 'restored.png') });
    await record('Fresh browser after source restoration', { heading: originalText, sourceHash: hash(original) });
  } finally { await checkBrowser.close(); }
  console.log(`Native editability passed. Evidence: ${evidence}`);
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
