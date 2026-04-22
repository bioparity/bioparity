import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadLedger } from '../lib/engine.js';
import {
  buildLeaderboard,
  computeParityRatio,
  bucketFor,
  BUCKET,
  NEAR_PARITY_THRESHOLD,
  BAR_MAX_RATIO,
  computeBarWidth,
  parityLinePercent,
} from '../lib/leaderboard.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEDGER_PATH = path.join(__dirname, '..', 'data', 'ledger.json');

test('21. buildLeaderboard returns one row per event (25 total after Commit 9 scope reframe)', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const rows = buildLeaderboard(ledger);
  assert.equal(rows.length, ledger.events.length, 'leaderboard must have one row per ledger event');
  assert.equal(rows.length, 25, 'expected 25 rows, got ' + rows.length);
});

test('21. buildLeaderboard ranks Men\'s Half Marathon #1 with Robot Lead bucket and ratio > 1', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const rows = buildLeaderboard(ledger);
  const top = rows[0];
  assert.equal(top.event_id, 'mens-half-marathon', 'expected mens-half-marathon at rank 1, got ' + top.event_id);
  assert.equal(top.bucket, BUCKET.ROBOT_LEAD, 'expected robot-lead bucket at rank 1');
  assert.ok(top.ratio > 1.0, 'expected ratio > 1 for Robot Lead, got ' + top.ratio);
});

test('21. buildLeaderboard places no-data events at the bottom, alphabetized', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const rows = buildLeaderboard(ledger);
  const withData = rows.filter(r => r.ratio !== null);
  const noData = rows.filter(r => r.ratio === null);
  const tail = rows.slice(withData.length);
  assert.deepEqual(tail.map(r => r.event_id), noData.map(r => r.event_id), 'no-data rows must trail');
  for (let i = 1; i < noData.length; i++) {
    assert.ok(
      noData[i - 1].event_name.localeCompare(noData[i].event_name) <= 0,
      'no-data rows not alphabetized: ' + noData[i - 1].event_name + ' vs ' + noData[i].event_name
    );
  }
});

test('21. buildLeaderboard rows with data are sorted by ratio descending', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const rows = buildLeaderboard(ledger).filter(r => r.ratio !== null);
  for (let i = 1; i < rows.length; i++) {
    assert.ok(
      rows[i - 1].ratio >= rows[i].ratio,
      'ratios not descending: ' + rows[i - 1].ratio + ' < ' + rows[i].ratio
    );
  }
});

test('21. computeParityRatio: lower_is_better inverts human/robot correctly', () => {
  const event = {
    human_record: { value: 57 * 60 + 20 }, // 57:20 = 3440s
    comparison_direction: 'lower_is_better',
    metric_type: 'time_endurance',
    performances: [{
      value: 50 * 60 + 26,
      date: '2026-04-19',
      validation_status: 'experimental',
      autonomy: 'autonomous',
      compliance: { locomotion_type: 'bipedal', energy_source: 'integrated', terrain_match: true },
      conditions_adjustment: {},
      record_eligibility: { eligible: true },
    }],
  };
  const { ratio } = computeParityRatio(event);
  assert.ok(ratio > 1.13 && ratio < 1.14, 'expected ratio ~1.136 for half marathon, got ' + ratio);
});

test('21. computeBarWidth: null/zero/negative → 0; clamped at BAR_MAX_RATIO=1.5', () => {
  assert.equal(computeBarWidth(null), 0);
  assert.equal(computeBarWidth(undefined), 0);
  assert.equal(computeBarWidth(0), 0);
  assert.equal(computeBarWidth(-0.2), 0);
  assert.equal(BAR_MAX_RATIO, 1.5);
  // ratio = 0.5 → 0.5 / 1.5 = 33.333...%
  assert.ok(Math.abs(computeBarWidth(0.5) - (100 / 3)) < 1e-9);
  // ratio at parity (1.0) → 1.0 / 1.5 = 66.666...% and matches parityLinePercent
  assert.ok(Math.abs(computeBarWidth(1.0) - parityLinePercent()) < 1e-9);
  // ratio past max → clamped to 100%
  assert.equal(computeBarWidth(1.5), 100);
  assert.equal(computeBarWidth(2.0), 100);
  // Men's Half Marathon ratio ~1.1367 → 75.78%
  const halfMarathonPct = computeBarWidth(1.1367);
  assert.ok(halfMarathonPct > 70 && halfMarathonPct < 80, 'expected ~76%, got ' + halfMarathonPct);
});

test('21. bucketFor: thresholds', () => {
  assert.equal(bucketFor(null, 'Human Lead'), BUCKET.NO_DATA);
  assert.equal(bucketFor(1.5, 'Robot Lead'), BUCKET.ROBOT_LEAD);
  assert.equal(bucketFor(1.0, 'Parity'), BUCKET.ROBOT_LEAD);
  assert.equal(bucketFor(NEAR_PARITY_THRESHOLD, 'Human Lead'), BUCKET.NEAR_PARITY);
  assert.equal(bucketFor(0.79, 'Human Lead'), BUCKET.HUMAN_LEAD);
  assert.equal(bucketFor(0.35, 'Human Lead'), BUCKET.HUMAN_LEAD);
});
