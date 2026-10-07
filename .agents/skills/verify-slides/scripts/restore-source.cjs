const fs = require('node:fs/promises');

async function restoreSource({ sourcePath, original, savedSource }) {
  const current = await fs.readFile(sourcePath, 'utf8');
  if (current === original) return 'unchanged';
  if (current === savedSource) {
    await fs.writeFile(sourcePath, original);
    return 'restored';
  }
  throw new Error('Source changed after the recorded save; preserve it and reconcile with the backup manually');
}
module.exports = { restoreSource };
