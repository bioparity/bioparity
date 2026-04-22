import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLedger } from '../lib/engine.js';
import { SANCTIONING_BODIES } from '../lib/sanctioning-bodies.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..');
const CAL_PATH = path.join(REPO_ROOT, 'data', 'sanctioned-events.json');
const LEDGER_PATH = path.join(REPO_ROOT, 'data', 'ledger.json');

const ALLOWED_STATUSES = new Set(['upcoming', 'completed', 'canceled']);
const URL_RE = /^https?:\/\/[^\s]+$/;

function loadCalendar() {
  return JSON.parse(fs.readFileSync(CAL_PATH, 'utf8'));
}

test('23. sanctioned-events.json is valid JSON and an array', () => {
  const entries = loadCalendar();
  assert.ok(Array.isArray(entries), 'sanctioned-events.json must be an array');
});

test('23. every calendar entry matches the schema', () => {
  const entries = loadCalendar();
  for (const e of entries) {
    assert.ok(typeof e.id === 'string' && e.id.length > 0, 'id required');
    assert.ok(typeof e.name === 'string' && e.name.length > 0, 'name required');
    assert.ok(typeof e.sanctioning_body === 'string', 'sanctioning_body required');
    assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(e.start_date), 'start_date YYYY-MM-DD');
    assert.ok(e.end_date === null || /^\d{4}-\d{2}-\d{2}$/.test(e.end_date), 'end_date YYYY-MM-DD or null');
    assert.ok(Array.isArray(e.event_types), 'event_types must be an array');
    assert.ok(ALLOWED_STATUSES.has(e.status), 'status must be in the allowed set');
    if (e.rules_url !== null) {
      assert.ok(URL_RE.test(e.rules_url), 'rules_url must be a URL or null');
    }
    if (e.results_url !== null) {
      assert.ok(URL_RE.test(e.results_url), 'results_url must be a URL or null');
    }
  }
});

test('23. every sanctioning_body is a recognized body', () => {
  const entries = loadCalendar();
  const codes = new Set(SANCTIONING_BODIES.map((b) => b.code));
  for (const e of entries) {
    assert.ok(codes.has(e.sanctioning_body), 'sanctioning_body "' + e.sanctioning_body + '" not in SANCTIONING_BODIES');
  }
});

test('23. every calendar event_types entry is a real ledger event id', () => {
  const entries = loadCalendar();
  const ledger = loadLedger(LEDGER_PATH);
  const ids = new Set(ledger.events.map((e) => e.event_id));
  for (const e of entries) {
    for (const t of e.event_types) {
      assert.ok(ids.has(t), 'calendar event_types contains non-ledger id ' + t);
    }
  }
});
