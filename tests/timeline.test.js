import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadLedger } from '../lib/engine.js';
import { buildTimeline } from '../lib/timeline.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEDGER_PATH = path.join(__dirname, '..', 'data', 'ledger.json');

test('21. buildTimeline returns 9 entries — one per dated+valued performance (skips null-value Unitree hurdles)', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const entries = buildTimeline(ledger);
  // 10 total performances, one (Unitree H1 women's 100m hurdles) has value=null
  // and is filtered out by buildTimeline.
  assert.equal(entries.length, 9, 'expected 9 valued performances in the timeline; got ' + entries.length);
  const robots = entries.map((e) => e.robot_name).sort();
  assert.deepEqual(
    robots,
    ['Cassie', 'Flash', 'H1', 'H1', 'K1', 'Lightning', 'Lightning', 'Lightning', 'Tiangong Ultra']
  );
});

test('21. buildTimeline output is sorted by date ascending', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const entries = buildTimeline(ledger);
  for (let i = 1; i < entries.length; i++) {
    assert.ok(
      entries[i - 1].date <= entries[i].date,
      'timeline not sorted: ' + entries[i - 1].date + ' > ' + entries[i].date
    );
  }
});
