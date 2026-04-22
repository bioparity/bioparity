import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..');

const PAGES = [
  ['homepage', path.join(REPO_ROOT, 'app', 'page.js')],
  ['methodology', path.join(REPO_ROOT, 'app', 'methodology', 'page.js')],
  ['about', path.join(REPO_ROOT, 'app', 'about', 'page.js')],
];

// Case-insensitive check: no "Olympic" anywhere in the source of the three
// reframed public pages after Commit 9.
test('27. "Olympic" does not appear in homepage, methodology, or about source', () => {
  for (const [label, file] of PAGES) {
    const src = fs.readFileSync(file, 'utf8');
    assert.ok(
      !/olympic/i.test(src),
      'found "Olympic" in ' + label + ' page source (' + file + ')'
    );
  }
});

test('27. methodology page mentions "World Athletics" at least twice', () => {
  const src = fs.readFileSync(path.join(REPO_ROOT, 'app', 'methodology', 'page.js'), 'utf8');
  const matches = src.match(/World Athletics/g) || [];
  assert.ok(
    matches.length >= 2,
    'expected >= 2 "World Athletics" mentions in methodology page; got ' + matches.length
  );
});
