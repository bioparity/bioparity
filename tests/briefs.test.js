import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAllBriefs } from '../lib/briefs.js';
import { loadLedger } from '../lib/engine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..');
const LEDGER_PATH = path.join(REPO_ROOT, 'data', 'ledger.json');

const ALLOWED_STATUSES = new Set(['published', 'draft']);
const URL_RE = /^https?:\/\/[^\s]+$/;

// getAllBriefs() reads from process.cwd()/content/briefs. The test runner is
// invoked at the repo root, so this lines up — but guard explicitly.
process.chdir(REPO_ROOT);

test('24. every brief file parses with the required frontmatter', () => {
  const briefs = getAllBriefs();
  assert.ok(briefs.length >= 1, 'expected at least 1 brief in content/briefs');
  for (const b of briefs) {
    assert.ok(typeof b.slug === 'string' && b.slug.length > 0, 'slug required');
    assert.ok(typeof b.title === 'string' && b.title.length > 0, 'title required');
    assert.ok(typeof b.author === 'string' && b.author.length > 0, 'author required');
    assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(b.date), 'date YYYY-MM-DD');
    assert.ok(Array.isArray(b.event_tags), 'event_tags must be an array');
    assert.ok(ALLOWED_STATUSES.has(b.status), 'status must be published|draft');
    if (b.author_url) {
      assert.ok(URL_RE.test(b.author_url), 'author_url must be a URL if present');
    }
  }
});

test('24. every brief event_tag is a real ledger event id', () => {
  const briefs = getAllBriefs();
  const ledger = loadLedger(LEDGER_PATH);
  const ids = new Set(ledger.events.map((e) => e.event_id));
  for (const b of briefs) {
    for (const t of b.event_tags) {
      assert.ok(ids.has(t), 'brief "' + b.slug + '" has event_tag ' + t + ' not in ledger');
    }
  }
});
