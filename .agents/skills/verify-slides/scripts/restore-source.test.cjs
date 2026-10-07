const assert = require('node:assert/strict');
const { test } = require('node:test');
const { mkdtemp, readFile, writeFile, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { restoreSource } = require('./restore-source.cjs');

const original = '<h1 className="large">Original heading</h1>\n<p>Body</p>\n';
const savedSource = '<h1 className="large">{\'Editable verification heading\'}</h1>\n<p>Body</p>\n';

async function fixture(t, content) {
  const directory = await mkdtemp(join(tmpdir(), 'slide-restore-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const sourcePath = join(directory, 'index.tsx');
  await writeFile(sourcePath, content);
  return sourcePath;
}

test('restores an exact saved version to its original source', async (t) => {
  const sourcePath = await fixture(t, savedSource);
  assert.equal(await restoreSource({ sourcePath, original, savedSource }), 'restored');
  assert.equal(await readFile(sourcePath, 'utf8'), original);
});

test('leaves an already restored source unchanged', async (t) => {
  const sourcePath = await fixture(t, original);
  assert.equal(await restoreSource({ sourcePath, original, savedSource }), 'unchanged');
  assert.equal(await readFile(sourcePath, 'utf8'), original);
});

for (const current of [
  '<h1 className="large">{\'Editable verification heading\'}<span>Keep my edit</span></h1>\n<p>Body</p>\n',
  '<h1 className="small">{\'Editable verification heading\'}</h1>\n<p>Body</p>\n',
  '<h1 className="large">{\'Editable verification heading\'}</h1>\n<p>Changed body</p>\n',
]) {
  test(`preserves a later edit: ${current.trim()}`, async (t) => {
    const sourcePath = await fixture(t, current);
    await assert.rejects(restoreSource({ sourcePath, original, savedSource }), /Source changed/);
    assert.equal(await readFile(sourcePath, 'utf8'), current);
  });
}

test('preserves a changed file when no saved version was captured', async (t) => {
  const sourcePath = await fixture(t, savedSource);
  await assert.rejects(restoreSource({ sourcePath, original }), /Source changed/);
  assert.equal(await readFile(sourcePath, 'utf8'), savedSource);
});
