import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLedger } from '../lib/engine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEDGER_PATH = path.join(__dirname, '..', 'data', 'ledger.json');

const URL_RE = /^https?:\/\/[^\s]+$/;

// Commit 10 ingested verified humanoid performances from WHRG 2025 and Beijing
// E-Town 2026. These tests lock the shape of the new entries without
// re-asserting exact values (those live on the individual event detail pages).

test('28. mens-400m has at least one performance entry', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const ev = ledger.events.find((e) => e.event_id === 'mens-400m');
  assert.ok(ev, 'mens-400m event missing');
  assert.ok(ev.performances && ev.performances.length >= 1, 'mens-400m has zero performances');
});

test('28. womens-100m-hurdles has at least one performance entry', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const ev = ledger.events.find((e) => e.event_id === 'womens-100m-hurdles');
  assert.ok(ev, 'womens-100m-hurdles event missing');
  assert.ok(ev.performances && ev.performances.length >= 1, 'womens-100m-hurdles has zero performances');
});

test('28. mens-half-marathon has at least 5 performance entries', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const ev = ledger.events.find((e) => e.event_id === 'mens-half-marathon');
  assert.ok(ev, 'mens-half-marathon event missing');
  assert.ok(
    ev.performances && ev.performances.length >= 5,
    'mens-half-marathon has fewer than 5 performances; got ' + (ev.performances || []).length
  );
});

test('28. every performance has a syntactically valid source_url', () => {
  const ledger = loadLedger(LEDGER_PATH);
  for (const ev of ledger.events) {
    for (const p of ev.performances || []) {
      assert.ok(
        typeof p.source_url === 'string' && URL_RE.test(p.source_url),
        'event ' + ev.event_id + ' performance ' + p.performance_id + ' has bad source_url: ' + p.source_url
      );
    }
  }
});

test('28. every teleoperated performance is ineligible with a teleoperation reason', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const teleops = ledger.events
    .flatMap((ev) => (ev.performances || []).map((p) => ({ ev, p })))
    .filter(({ p }) => p.autonomy === 'teleoperated');
  assert.ok(teleops.length >= 1, 'expected at least one teleoperated performance post-Commit 10');
  for (const { ev, p } of teleops) {
    assert.equal(
      p.record_eligibility && p.record_eligibility.eligible,
      false,
      'teleop performance on ' + ev.event_id + ' is not marked ineligible'
    );
    const reason = (p.record_eligibility && p.record_eligibility.reason) || '';
    assert.ok(
      /teleoperat/i.test(reason),
      'teleop performance on ' + ev.event_id + ' eligibility reason does not mention teleoperation'
    );
  }
});
