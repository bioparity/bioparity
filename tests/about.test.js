import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ABOUT_PATH = path.join(__dirname, '..', 'app', 'about', 'page.js');

// Replaces the earlier scaffold-guard test. Now that the /about copy is
// final, these anchors lock two facts that must not silently change.
test('25. about page contains final copy anchors', () => {
  const src = fs.readFileSync(ABOUT_PATH, 'utf8');
  const fallujahMatches = src.match(/Fallujah/g) || [];
  // The final copy references the city and then "the Second Battle of Fallujah"
  // in the same sentence, so the intended anchor count is 2, not 1.
  assert.equal(
    fallujahMatches.length,
    2,
    'expected exactly two "Fallujah" mentions (city + "Second Battle of Fallujah") in app/about/page.js; got ' + fallujahMatches.length
  );
  assert.ok(
    src.includes('hello@bioparity.io'),
    'expected contact email hello@bioparity.io in app/about/page.js'
  );
  // Commit 9 scope reframe: /about must not reference "Olympic" anywhere.
  assert.ok(
    !/olympic/i.test(src),
    'found "Olympic" in app/about/page.js — reframe to World Athletics or track and field'
  );
});
