import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLedger } from '../lib/engine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..');
const PIPELINE_PATH = path.join(REPO_ROOT, 'data', 'pipeline.json');
const LEDGER_PATH = path.join(REPO_ROOT, 'data', 'ledger.json');

// Commit 10 adds 'press coverage' as a source_type distinct from 'press
// release' — press coverage is reporting by a third-party outlet (e.g. a
// Global Times article), while press release is a first-party company
// announcement. Both are allowed; readers can tell them apart on the card.
const ALLOWED_SOURCE_TYPES = new Set(['paper', 'press release', 'press coverage', 'demo', 'interview']);
const ALLOWED_STATUSES = new Set(['announced', 'in progress', 'achieved', 'silent', 'abandoned']);
const URL_RE = /^https?:\/\/[^\s]+$/;

function loadPipeline() {
  return JSON.parse(fs.readFileSync(PIPELINE_PATH, 'utf8'));
}

test('22. pipeline.json is valid JSON and an array', () => {
  const entries = loadPipeline();
  assert.ok(Array.isArray(entries), 'pipeline.json must be an array');
});

test('22. every pipeline entry matches the schema', () => {
  const entries = loadPipeline();
  for (const e of entries) {
    assert.ok(typeof e.id === 'string' && e.id.length > 0, 'id required');
    assert.ok(typeof e.lab === 'string' && e.lab.length > 0, 'lab required');
    assert.ok(typeof e.target_event_id === 'string', 'target_event_id required');
    assert.ok(typeof e.target_metric === 'string' && e.target_metric.length > 0, 'target_metric required');
    assert.ok(typeof e.declared_timeline === 'string', 'declared_timeline required');
    assert.ok(ALLOWED_SOURCE_TYPES.has(e.source_type), 'source_type must be paper|press release|demo|interview');
    assert.ok(URL_RE.test(e.source_url), 'source_url must be a URL');
    assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(e.source_date), 'source_date YYYY-MM-DD');
    assert.ok(ALLOWED_STATUSES.has(e.last_verified_status), 'last_verified_status must be in the allowed set');
    assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(e.last_verified_date), 'last_verified_date YYYY-MM-DD');
  }
});

test('22. every pipeline target_event_id is a real ledger event', () => {
  const entries = loadPipeline();
  const ledger = loadLedger(LEDGER_PATH);
  const ids = new Set(ledger.events.map((e) => e.event_id));
  for (const e of entries) {
    assert.ok(ids.has(e.target_event_id), 'target_event_id ' + e.target_event_id + ' not in ledger');
  }
});
