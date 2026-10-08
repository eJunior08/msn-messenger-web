import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
const ignored = new Set(['.git', 'node_modules', 'dist', 'coverage', 'test-results', 'playwright-report']);
const failures = [];
async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await visit(path);
    else if (/\.(tsx?|jsx?|mjs|cjs|css|md|json|html|ya?ml|svg)$/.test(path) && entry.name !== 'package-lock.json') {
      const content = await readFile(path, 'utf8');
      const count = content.trimEnd().split('\n').length;
      if (count > 150) failures.push(`${path}: ${count} lines`);
    }
  }
}
await visit('.');
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log('All authored files are within the 150-line limit.');
