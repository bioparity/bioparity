import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLedger } from '../lib/engine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEDGER_PATH = path.join(__dirname, '..', 'data', 'ledger.json');

const NEW_EVENT_IDS = [
  'mens-5000m',
  'womens-5000m',
  'mens-10000m',
  'womens-10000m',
  'mens-3000m-steeplechase',
  'womens-3000m-steeplechase',
];

test('26. ledger has exactly 25 events after the Commit 9 scope reframe', () => {
  const ledger = loadLedger(LEDGER_PATH);
  assert.equal(ledger.events.length, 25, 'expected 25 events, got ' + ledger.events.length);
});

test('26. every track and field event human_record is verified_by World Athletics', () => {
  // Archery is the one seeded non-track-and-field exception (bow biomechanics,
  // not locomotion). Its governing body is World Archery. All other ledger
  // events must anchor on World Athletics after the Commit 9 reframe.
  const ledger = loadLedger(LEDGER_PATH);
  for (const ev of ledger.events) {
    if (ev.sport_category === 'archery' || /archery/.test(ev.event_id)) continue;
    assert.equal(
      ev.human_record && ev.human_record.verified_by,
      'World Athletics',
      'event ' + ev.event_id + ' has non-World-Athletics verified_by: ' + (ev.human_record && ev.human_record.verified_by)
    );
  }
});

test('26. no event_id references "olympic"', () => {
  const ledger = loadLedger(LEDGER_PATH);
  for (const ev of ledger.events) {
    assert.ok(
      !/olympic/i.test(ev.event_id),
      'event_id contains "olympic": ' + ev.event_id
    );
  }
});

test('26. all six Commit 9 event_ids are present in the ledger', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const ids = new Set(ledger.events.map((e) => e.event_id));
  for (const id of NEW_EVENT_IDS) {
    assert.ok(ids.has(id), 'expected new event ' + id + ' in ledger');
  }
});
