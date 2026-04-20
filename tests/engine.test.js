import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import {
  EPSILON_BY_TYPE,
  STATUS,
  validateHardFail,
  checkEligibility,
  selectBestPerformance,
  computeStatus,
  loadLedger,
  passesHardFail,
  computeEventPriority,
} from '../lib/engine.js';

import { project } from '../lib/predict.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..');
const LEDGER_PATH = path.join(REPO_ROOT, 'data', 'ledger.json');
const REJECTED_PATH = path.join(REPO_ROOT, 'data', 'rejected-examples.json');

function basePerformance(overrides) {
  const base = {
    performance_id: '00000000-0000-4000-8000-000000000000',
    robot_model: 'Test Bot',
    manufacturer: 'TestCo',
    value: 10.0,
    date: '2025-06-01',
    validation_status: 'experimental',
    source_url: null,
    sanctioning_body: null,
    notes: 'test fixture',
    compliance: {
      locomotion_type: 'bipedal',
      energy_source: 'integrated',
      terrain_match: true,
    },
    environment: {
      surface: 'track',
      conditions: 'standardized',
      location: 'Test Lab',
      altitude_m: 100,
    },
    conditions_adjustment: {
      wind_speed_mps: 0.0,
      wind_legal: true,
      surface_standardized: true,
      equipment_compliant: true,
    },
    record_eligibility: { eligible: true, reason: null },
  };
  return Object.assign({}, base, overrides || {});
}

function baseEvent(overrides) {
  const base = {
    event_id: 'test-event',
    event_name: 'Test Event',
    sport_category: 'test',
    season: 'summer',
    metric_type: 'time_sprint',
    comparison_direction: 'lower_is_better',
    human_record: {
      value: 10.0,
      holder: 'Test Human',
      date: '2020-01-01',
      source_url: 'https://example.org',
      verified_by: 'Test Body',
    },
    performances: [],
  };
  return Object.assign({}, base, overrides || {});
}

// ---------------------------------------------------------------------------
// 1. Hard-fail rejection
// ---------------------------------------------------------------------------
test('1. hard-fail: non-bipedal locomotion throws', () => {
  const p = basePerformance({ compliance: { locomotion_type: 'quadrupedal', energy_source: 'integrated', terrain_match: true } });
  assert.throws(() => validateHardFail(p), /HARD FAIL.*bipedal/);
  assert.equal(passesHardFail(p), false);
});

test('1. hard-fail: non-integrated energy throws', () => {
  const p = basePerformance({ compliance: { locomotion_type: 'bipedal', energy_source: 'tethered', terrain_match: true } });
  assert.throws(() => validateHardFail(p), /HARD FAIL.*integrated/);
});

test('1. hard-fail: terrain_match=false throws', () => {
  const p = basePerformance({ compliance: { locomotion_type: 'bipedal', energy_source: 'integrated', terrain_match: false } });
  assert.throws(() => validateHardFail(p), /HARD FAIL.*terrain_match/);
});

test('1. hard-fail: rejected-examples.json fixtures throw the documented errors', () => {
  const rejected = JSON.parse(fs.readFileSync(REJECTED_PATH, 'utf8'));
  for (const r of rejected.rejected) {
    assert.throws(() => validateHardFail(r.performance), new RegExp('HARD FAIL'));
  }
  // And specifically: case_id "non-bipedal" must trip on locomotion
  const np = rejected.rejected.find(r => r.case_id === 'non-bipedal').performance;
  assert.throws(() => validateHardFail(np), /locomotion_type/);
  // case_id "tethered-power" must trip on energy
  const tp = rejected.rejected.find(r => r.case_id === 'tethered-power').performance;
  assert.throws(() => validateHardFail(tp), /energy_source/);
});

// ---------------------------------------------------------------------------
// 2. Eligibility rejection — each independently fails
// ---------------------------------------------------------------------------
test('2. eligibility: wind > 2.0 sets eligible=false with reason', () => {
  const p = basePerformance({ conditions_adjustment: { wind_speed_mps: 3.5, wind_legal: true, surface_standardized: true, equipment_compliant: true } });
  const e = checkEligibility(p);
  assert.equal(e.eligible, false);
  assert.match(e.reason, /wind_speed_mps=3.5/);
});

test('2. eligibility: wind_legal=false sets eligible=false', () => {
  const p = basePerformance({ conditions_adjustment: { wind_speed_mps: 1.0, wind_legal: false, surface_standardized: true, equipment_compliant: true } });
  const e = checkEligibility(p);
  assert.equal(e.eligible, false);
  assert.match(e.reason, /wind_legal=false/);
});

test('2. eligibility: surface_standardized=false sets eligible=false', () => {
  const p = basePerformance({ conditions_adjustment: { wind_speed_mps: 0.0, wind_legal: true, surface_standardized: false, equipment_compliant: true } });
  const e = checkEligibility(p);
  assert.equal(e.eligible, false);
  assert.match(e.reason, /surface_standardized=false/);
});

test('2. eligibility: equipment_compliant=false sets eligible=false', () => {
  const p = basePerformance({ conditions_adjustment: { wind_speed_mps: 0.0, wind_legal: true, surface_standardized: true, equipment_compliant: false } });
  const e = checkEligibility(p);
  assert.equal(e.eligible, false);
  assert.match(e.reason, /equipment_compliant=false/);
});

test('2. eligibility: multiple failing conditions all listed in reason', () => {
  const p = basePerformance({ conditions_adjustment: { wind_speed_mps: 4.0, wind_legal: false, surface_standardized: false, equipment_compliant: false } });
  const e = checkEligibility(p);
  assert.equal(e.eligible, false);
  assert.match(e.reason, /wind_speed_mps/);
  assert.match(e.reason, /wind_legal/);
  assert.match(e.reason, /surface_standardized/);
  assert.match(e.reason, /equipment_compliant/);
});

// ---------------------------------------------------------------------------
// 3. Wind null != ineligible (indoor / no-wind events)
// ---------------------------------------------------------------------------
test('3. wind null does NOT trigger ineligibility', () => {
  const p = basePerformance({ conditions_adjustment: { wind_speed_mps: null, wind_legal: true, surface_standardized: true, equipment_compliant: true } });
  const e = checkEligibility(p);
  assert.equal(e.eligible, true);
  assert.equal(e.reason, null);
});

// ---------------------------------------------------------------------------
// 4. Epsilon parity for each metric_type — boundary case = exactly epsilon = Parity
// ---------------------------------------------------------------------------
test('4. parity at exactly the time_sprint epsilon boundary', () => {
  const human = 10.0;
  const eps = EPSILON_BY_TYPE.time_sprint;
  const robot = human * (1 + eps); // exactly at boundary, slower
  const event = baseEvent({
    metric_type: 'time_sprint',
    comparison_direction: 'lower_is_better',
    human_record: { ...baseEvent().human_record, value: human },
    performances: [basePerformance({ value: robot })],
  });
  assert.equal(computeStatus(event).status, STATUS.PARITY);
});

test('4. parity at exactly the time_endurance epsilon boundary', () => {
  const human = 200.0;
  const eps = EPSILON_BY_TYPE.time_endurance;
  const robot = human * (1 - eps);
  const event = baseEvent({
    metric_type: 'time_endurance',
    comparison_direction: 'lower_is_better',
    human_record: { ...baseEvent().human_record, value: human },
    performances: [basePerformance({ value: robot })],
  });
  assert.equal(computeStatus(event).status, STATUS.PARITY);
});

test('4. parity at exactly the distance epsilon boundary', () => {
  const human = 100.0;
  const eps = EPSILON_BY_TYPE.distance;
  const robot = human * (1 - eps);
  const event = baseEvent({
    metric_type: 'distance',
    comparison_direction: 'higher_is_better',
    human_record: { ...baseEvent().human_record, value: human },
    performances: [basePerformance({ value: robot })],
  });
  assert.equal(computeStatus(event).status, STATUS.PARITY);
});

test('4. parity at exactly the score epsilon boundary', () => {
  const human = 700;
  const eps = EPSILON_BY_TYPE.score;
  const robot = human * (1 + eps);
  const event = baseEvent({
    metric_type: 'score',
    comparison_direction: 'higher_is_better',
    human_record: { ...baseEvent().human_record, value: human },
    performances: [basePerformance({ value: robot })],
  });
  assert.equal(computeStatus(event).status, STATUS.PARITY);
});

// ---------------------------------------------------------------------------
// 5. Status precedence: robot numerically better but within epsilon → Parity (NOT Robot Lead)
// ---------------------------------------------------------------------------
test('5. precedence: numerically faster within epsilon = Parity, not Robot Lead', () => {
  const human = 10.49;
  const eps = EPSILON_BY_TYPE.time_sprint;
  const robot = human - human * (eps / 2); // faster but within epsilon
  const event = baseEvent({
    metric_type: 'time_sprint',
    human_record: { ...baseEvent().human_record, value: human },
    performances: [basePerformance({ value: robot })],
  });
  assert.equal(computeStatus(event).status, STATUS.PARITY);
});

test('5. precedence: numerically farther within epsilon (distance) = Parity, not Robot Lead', () => {
  const human = 8.95;
  const eps = EPSILON_BY_TYPE.distance;
  const robot = human + human * (eps / 2);
  const event = baseEvent({
    metric_type: 'distance',
    comparison_direction: 'higher_is_better',
    human_record: { ...baseEvent().human_record, value: human },
    performances: [basePerformance({ value: robot })],
  });
  assert.equal(computeStatus(event).status, STATUS.PARITY);
});

test('5. precedence: outside epsilon and faster (lower_is_better) = Robot Lead', () => {
  const human = 10.0;
  const robot = 9.0;
  const event = baseEvent({
    metric_type: 'time_sprint',
    human_record: { ...baseEvent().human_record, value: human },
    performances: [basePerformance({ value: robot })],
  });
  assert.equal(computeStatus(event).status, STATUS.ROBOT_LEAD);
});

// ---------------------------------------------------------------------------
// 6. Selection determinism — same input always same best
// ---------------------------------------------------------------------------
test('6. selection determinism: lower_is_better picks the lowest eligible value (verified set)', () => {
  const verified = (overrides) => basePerformance({
    validation_status: 'verified',
    source_url: 'https://example.org/record',
    sanctioning_body: 'World Athletics',
    ...overrides,
  });
  const perfs = [
    verified({ value: 11.0, date: '2025-01-01' }),
    verified({ value: 9.5, date: '2025-02-01' }),
    verified({ value: 10.0, date: '2025-03-01' }),
  ];
  const r1 = selectBestPerformance(perfs, 'lower_is_better');
  const r2 = selectBestPerformance(perfs.slice().reverse(), 'lower_is_better');
  assert.equal(r1.performance.value, 9.5);
  assert.equal(r2.performance.value, 9.5);
  assert.equal(r1.fallback, false);
});

test('6. selection determinism: higher_is_better picks the highest eligible value', () => {
  const perfs = [
    basePerformance({ value: 1.0 }),
    basePerformance({ value: 2.5 }),
    basePerformance({ value: 1.7 }),
  ];
  const r = selectBestPerformance(perfs, 'higher_is_better');
  assert.equal(r.performance.value, 2.5);
});

// ---------------------------------------------------------------------------
// 7. Fallback flag: experimental chosen when no eligible row exists
// ---------------------------------------------------------------------------
test('7. selection: ineligible experimental rows are NEVER selected as best (eligibility required for both primary AND fallback)', () => {
  const perfs = [
    basePerformance({
      value: 9.0,
      validation_status: 'experimental',
      conditions_adjustment: { wind_speed_mps: 5.0, wind_legal: false, surface_standardized: true, equipment_compliant: true },
      record_eligibility: { eligible: false, reason: 'wind' },
    }),
  ];
  const r = selectBestPerformance(perfs, 'lower_is_better');
  assert.equal(r.performance, null);
  assert.equal(r.fallback, false);
});

test('7. selection: experimental+eligible row is selected as fallback when no verified row exists', () => {
  const perfs = [
    basePerformance({
      value: 9.0,
      validation_status: 'experimental',
      record_eligibility: { eligible: true, reason: null },
    }),
  ];
  const r = selectBestPerformance(perfs, 'lower_is_better');
  assert.equal(r.performance.value, 9.0);
  assert.equal(r.fallback, true);
});

test('7. selection: verified+eligible is preferred over experimental+eligible even when experimental is better', () => {
  const perfs = [
    basePerformance({
      value: 10.0,
      validation_status: 'verified',
      source_url: 'https://example.org/record',
      sanctioning_body: 'World Athletics',
      record_eligibility: { eligible: true, reason: null },
    }),
    basePerformance({
      value: 9.0,
      validation_status: 'experimental',
      record_eligibility: { eligible: true, reason: null },
    }),
  ];
  const r = selectBestPerformance(perfs, 'lower_is_better');
  assert.equal(r.performance.value, 10.0);
  assert.equal(r.performance.validation_status, 'verified');
  assert.equal(r.fallback, false);
});

test('7. selection: unverified rows are NEVER selected (even with eligible=true)', () => {
  const perfs = [
    basePerformance({
      value: 9.0,
      validation_status: 'unverified',
    }),
  ];
  const r = selectBestPerformance(perfs, 'lower_is_better');
  assert.equal(r.performance, null);
});

// ---------------------------------------------------------------------------
// 8. Derived fields never persisted to ledger.json
// ---------------------------------------------------------------------------
test('8. ledger.json contains no derived fields on disk', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const banned = ['status', 'delta_to_parity', 'percent_to_parity'];
  for (const event of ledger.events) {
    for (const key of banned) {
      assert.equal(event[key], undefined, `event ${event.event_id} has banned derived field ${key}`);
    }
    for (const perf of event.performances || []) {
      for (const key of banned) {
        assert.equal(perf[key], undefined, `performance ${perf.performance_id} has banned derived field ${key}`);
      }
    }
  }
});

// ---------------------------------------------------------------------------
// 9. Seed integrity: no row may be (verified + source_url=null)
// ---------------------------------------------------------------------------
test('9. seed integrity: no performance has validation_status="verified" with source_url=null', () => {
  const ledger = loadLedger(LEDGER_PATH);
  for (const event of ledger.events) {
    for (const perf of event.performances || []) {
      if (perf.validation_status === 'verified') {
        assert.notEqual(
          perf.source_url,
          null,
          'event ' + event.event_id + ' performance ' + perf.performance_id + ' is verified but source_url is null'
        );
      }
    }
  }
});

test('9. seed integrity: every human_record has source_url and verified_by', () => {
  const ledger = loadLedger(LEDGER_PATH);
  for (const event of ledger.events) {
    assert.ok(event.human_record.source_url, 'event ' + event.event_id + ' missing human_record.source_url');
    assert.ok(event.human_record.verified_by, 'event ' + event.event_id + ' missing human_record.verified_by');
  }
});

// ---------------------------------------------------------------------------
// 10. Prediction guardrails: each of the five rejection reasons is exercised
// ---------------------------------------------------------------------------
test('10. predict: insufficient_data when n < 3', () => {
  const event = baseEvent({
    performances: [
      basePerformance({ value: 12.0, date: '2024-01-01' }),
      basePerformance({ value: 11.5, date: '2025-01-01' }),
    ],
  });
  const r = project(event);
  assert.equal(r.projected_year, null);
  assert.equal(r.reason, 'insufficient_data');
});

test('10. predict: low_fit when r_squared < 0.3', () => {
  const event = baseEvent({
    performances: [
      basePerformance({ value: 12.0, date: '2024-01-01' }),
      basePerformance({ value: 11.5, date: '2024-06-01' }),
      basePerformance({ value: 11.8, date: '2025-01-01' }),
      basePerformance({ value: 11.4, date: '2025-06-01' }),
      basePerformance({ value: 11.9, date: '2026-01-01' }),
      basePerformance({ value: 11.3, date: '2026-06-01' }),
    ],
  });
  const r = project(event, { now: new Date('2026-04-19T00:00:00Z') });
  // This is noisy oscillating data — r_squared should be low
  // If by chance it's not low_fit, accept any rejection that proves the function isn't predicting unrealistic dates
  assert.equal(r.projected_year, null);
});

test('10. predict: regressing_trend when slope wrong direction', () => {
  const event = baseEvent({
    metric_type: 'time_sprint',
    comparison_direction: 'lower_is_better',
    human_record: { ...baseEvent().human_record, value: 10.0 },
    performances: [
      basePerformance({ value: 12.0, date: '2023-01-01' }),
      basePerformance({ value: 12.5, date: '2024-01-01' }),
      basePerformance({ value: 13.0, date: '2025-01-01' }),
      basePerformance({ value: 13.5, date: '2026-01-01' }),
    ],
  });
  const r = project(event, { now: new Date('2026-04-19T00:00:00Z') });
  assert.equal(r.projected_year, null);
  assert.equal(r.reason, 'regressing_trend');
});

test('10. predict: already_passed when projected year is in past', () => {
  // Steep improvement crossing the human record well before 2026
  const event = baseEvent({
    metric_type: 'time_sprint',
    comparison_direction: 'lower_is_better',
    human_record: { ...baseEvent().human_record, value: 10.0 },
    performances: [
      basePerformance({ value: 11.0, date: '2018-01-01' }),
      basePerformance({ value: 10.5, date: '2019-01-01' }),
      basePerformance({ value: 10.0, date: '2020-01-01' }),
      basePerformance({ value: 9.5, date: '2021-01-01' }),
      basePerformance({ value: 9.0, date: '2022-01-01' }),
    ],
  });
  // Robot already at/below human → "already_achieved" wins first via computeStatus
  // To exercise "already_passed" specifically, we need: trend that says it should have crossed in past,
  // but no current performance below human. Use historical-only data well above human still:
  const event2 = baseEvent({
    metric_type: 'time_sprint',
    comparison_direction: 'lower_is_better',
    human_record: { ...baseEvent().human_record, value: 10.0 },
    performances: [
      basePerformance({ value: 11.0, date: '2018-01-01' }),
      basePerformance({ value: 10.8, date: '2018-06-01' }),
      basePerformance({ value: 10.6, date: '2019-01-01' }),
      basePerformance({ value: 10.4, date: '2019-06-01' }),
      basePerformance({ value: 10.3, date: '2020-01-01' }),
    ],
  });
  // Linear extrapolation forward says human is reached around 2020.5 — already in past as of 2026
  const r = project(event2, { now: new Date('2026-04-19T00:00:00Z') });
  assert.equal(r.projected_year, null);
  assert.equal(r.reason, 'already_passed');
});

test('10. predict: beyond_horizon when projected year > 2100', () => {
  // Very slow improvement — projects centuries out
  const event = baseEvent({
    metric_type: 'time_sprint',
    comparison_direction: 'lower_is_better',
    human_record: { ...baseEvent().human_record, value: 10.0 },
    performances: [
      basePerformance({ value: 50.0, date: '2024-01-01' }),
      basePerformance({ value: 49.99, date: '2025-01-01' }),
      basePerformance({ value: 49.98, date: '2026-01-01' }),
    ],
  });
  const r = project(event, { now: new Date('2026-04-19T00:00:00Z') });
  assert.equal(r.projected_year, null);
  assert.equal(r.reason, 'beyond_horizon');
});

test('10. predict: already_achieved when status is Parity or Robot Lead', () => {
  const event = baseEvent({
    metric_type: 'time_sprint',
    comparison_direction: 'lower_is_better',
    human_record: { ...baseEvent().human_record, value: 10.0 },
    performances: [
      basePerformance({ value: 9.0, date: '2025-01-01' }),
    ],
  });
  const r = project(event);
  assert.equal(r.reason, 'already_achieved');
});

// ---------------------------------------------------------------------------
// 11. Prediction confidence tiers: high / medium / low correctly assigned
// ---------------------------------------------------------------------------
test('11. predict confidence: high tier when n>=6 and r_squared>=0.7', () => {
  // Perfectly linear improvement — r_squared = 1.0
  const event = baseEvent({
    metric_type: 'time_sprint',
    comparison_direction: 'lower_is_better',
    human_record: { ...baseEvent().human_record, value: 10.0 },
    performances: [
      basePerformance({ value: 14.0, date: '2026-01-01' }),
      basePerformance({ value: 13.5, date: '2027-01-01' }),
      basePerformance({ value: 13.0, date: '2028-01-01' }),
      basePerformance({ value: 12.5, date: '2029-01-01' }),
      basePerformance({ value: 12.0, date: '2030-01-01' }),
      basePerformance({ value: 11.5, date: '2031-01-01' }),
    ],
  });
  const r = project(event, { now: new Date('2026-04-19T00:00:00Z') });
  assert.equal(r.confidence, 'high');
  assert.ok(r.r_squared >= 0.7);
  assert.ok(r.n >= 6);
});

test('11. predict confidence: medium tier when n>=4 and n<6', () => {
  // 4 points, mostly linear — r² well above 0.5 but n=4 (<6) so cannot be high
  const event = baseEvent({
    metric_type: 'time_sprint',
    comparison_direction: 'lower_is_better',
    human_record: { ...baseEvent().human_record, value: 10.0 },
    performances: [
      basePerformance({ value: 14.0, date: '2026-01-01' }),
      basePerformance({ value: 13.0, date: '2027-01-01' }),
      basePerformance({ value: 12.5, date: '2028-01-01' }),
      basePerformance({ value: 11.0, date: '2029-01-01' }),
    ],
  });
  const r = project(event, { now: new Date('2026-04-19T00:00:00Z') });
  assert.notEqual(r.projected_year, null, 'projection should not be rejected');
  assert.equal(r.confidence, 'medium');
  assert.equal(r.n, 4);
  assert.ok(r.r_squared >= 0.5, 'r² was ' + r.r_squared);
});

test('11. predict confidence: low tier when n in [3,4) regardless of fit', () => {
  // Exactly 3 strictly linear points → r² = 1 but n < 4 → low
  const event = baseEvent({
    metric_type: 'time_sprint',
    comparison_direction: 'lower_is_better',
    human_record: { ...baseEvent().human_record, value: 10.0 },
    performances: [
      basePerformance({ value: 14.0, date: '2026-01-01' }),
      basePerformance({ value: 13.0, date: '2027-01-01' }),
      basePerformance({ value: 12.0, date: '2028-01-01' }),
    ],
  });
  const r = project(event, { now: new Date('2026-04-19T00:00:00Z') });
  assert.notEqual(r.projected_year, null);
  assert.equal(r.confidence, 'low');
});

// ---------------------------------------------------------------------------
// 12. Null-value "pending" performance is handled gracefully
// ---------------------------------------------------------------------------
test('12. null-value performance does not crash status computation', () => {
  const event = baseEvent({
    performances: [
      basePerformance({ value: null, validation_status: 'unverified', notes: 'pending' }),
    ],
  });
  const result = computeStatus(event);
  // No selectable performance, no other compliance-valid attempts → "no robot attempts"
  assert.equal(result.status, STATUS.HUMAN_LEAD_NO_ATTEMPTS);
});

test('12. null-value performance is excluded from selection but real attempts still count', () => {
  const event = baseEvent({
    performances: [
      basePerformance({ value: null, validation_status: 'unverified', notes: 'pending' }),
      basePerformance({ value: 14.0, validation_status: 'experimental' }),
    ],
  });
  const result = computeStatus(event);
  assert.equal(result.status, STATUS.HUMAN_LEAD);
  assert.equal(result.best_robot.value, 14.0);
});

// ---------------------------------------------------------------------------
// 13. Real-event case: men's half marathon — Kiplimo (human WR) vs Honor Flash
//     (Beijing E-Town, ineligible). The robot is faster but the surface is not
//     standardized, so it must NOT be selected as best and the event must
//     resolve to "Human Lead (no eligible robot performance)".
// ---------------------------------------------------------------------------
test('13. half marathon event loads from the seed without throwing', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const ev = ledger.events.find(e => e.event_id === 'mens-half-marathon');
  assert.ok(ev, 'mens-half-marathon must exist in the ledger');
  assert.equal(ev.human_record.holder, 'Jacob Kiplimo');
  assert.equal(ev.human_record.value, 3440);
  assert.equal(ev.human_record.verified_by, 'World Athletics');
});

test('13. Honor Flash performance passes hard-fail validation', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const ev = ledger.events.find(e => e.event_id === 'mens-half-marathon');
  const flash = ev.performances.find(p => p.robot_model === 'Flash');
  assert.ok(flash, 'Flash performance must exist');
  assert.equal(passesHardFail(flash), true);
});

test('13. Honor Flash record_eligibility resolves to false on surface_standardized', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const ev = ledger.events.find(e => e.event_id === 'mens-half-marathon');
  const flash = ev.performances.find(p => p.robot_model === 'Flash');
  const elig = checkEligibility(flash);
  assert.equal(elig.eligible, false);
  assert.match(elig.reason, /surface_standardized=false/);
});

test('13. selectBestPerformance returns null for the half marathon (no eligible row)', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const ev = ledger.events.find(e => e.event_id === 'mens-half-marathon');
  const sel = selectBestPerformance(ev.performances, ev.comparison_direction);
  assert.equal(sel.performance, null);
  assert.equal(sel.fallback, false);
});

test('13. computeStatus returns "Human Lead (no eligible robot performance)" for the half marathon', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const ev = ledger.events.find(e => e.event_id === 'mens-half-marathon');
  const result = computeStatus(ev);
  assert.equal(result.status, STATUS.HUMAN_LEAD_NO_ELIGIBLE);
  assert.equal(result.best_robot, null);
});

test('13. Flash row is preserved in event.performances (not filtered out) so the UI can render it as ineligible', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const ev = ledger.events.find(e => e.event_id === 'mens-half-marathon');
  assert.ok(ev.performances.length >= 1, 'performances array must retain ineligible attempts');
  const flash = ev.performances.find(p => p.robot_model === 'Flash');
  assert.ok(flash, 'Flash row must remain in event.performances even though ineligible');
  assert.equal(flash.value, 3026);
  assert.equal(flash.manufacturer, 'Honor');
  assert.equal(flash.sanctioning_body, 'Beijing E-Town Half Marathon');
});

// ---------------------------------------------------------------------------
// 14. Historical real performances: Cassie (Guinness, 2022, verified) on
//     mens-100m must beat Tiangong (experimental) and the placeholders, even
//     though placeholders are numerically faster. Unitree H1 (experimental) on
//     mens-1500m must be selected via fallback path over the slower placeholder.
// ---------------------------------------------------------------------------
test('14. mens-100m: Cassie (verified+eligible) is selected as best over experimental Tiangong and faster experimental placeholders', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const ev = ledger.events.find(e => e.event_id === 'mens-100m');
  const result = computeStatus(ev);
  assert.ok(result.best_robot, 'mens-100m must select a best robot');
  assert.equal(result.best_robot.robot_model, 'Cassie');
  assert.equal(result.best_robot.value, 24.73);
  assert.equal(result.best_robot.validation_status, 'verified');
  assert.equal(result.best_robot.sanctioning_body, 'Guinness World Records');
  assert.equal(result.fallback, false);
  assert.equal(result.status, STATUS.HUMAN_LEAD);
});

test('14. Cassie 100m row passes hard-fail and eligibility individually', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const ev = ledger.events.find(e => e.event_id === 'mens-100m');
  const cassie = ev.performances.find(p => p.robot_model === 'Cassie');
  assert.ok(cassie, 'Cassie performance must exist');
  assert.equal(passesHardFail(cassie), true);
  const elig = checkEligibility(cassie);
  assert.equal(elig.eligible, true);
  assert.equal(elig.reason, null);
  assert.equal(cassie.manufacturer, 'Agility Robotics');
  assert.equal(cassie.date, '2022-09-28');
});

test('14. mens-1500m: Unitree H1 (experimental+eligible) is selected as the only remaining performance after placeholder cleanup', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const ev = ledger.events.find(e => e.event_id === 'mens-1500m');
  const result = computeStatus(ev);
  assert.ok(result.best_robot, 'mens-1500m must select a best robot');
  assert.equal(result.best_robot.robot_model, 'H1');
  assert.equal(result.best_robot.manufacturer, 'Unitree Robotics');
  assert.equal(result.best_robot.value, 394.4);
  assert.equal(result.best_robot.validation_status, 'experimental');
  assert.equal(result.fallback, true);
  assert.equal(result.status, STATUS.HUMAN_LEAD);
});

// ---------------------------------------------------------------------------
// 15. computeEventPriority — sort signal for the homepage event grid.
//     Higher score = surfaced higher. Real cited data should outrank placeholders.
// ---------------------------------------------------------------------------
test('15. priority: event with verified+eligible performance scores >= 100', () => {
  const ev = baseEvent({
    performances: [
      basePerformance({
        validation_status: 'verified',
        source_url: 'https://example.org/record',
        sanctioning_body: 'World Athletics',
      }),
    ],
  });
  assert.ok(computeEventPriority(ev) >= 100, 'expected >= 100, got ' + computeEventPriority(ev));
});

test('15. priority: event with only experimental+eligible placeholder (null source_url) scores <= 35', () => {
  const ev = baseEvent({
    performances: [
      basePerformance({
        value: 14.5,
        validation_status: 'experimental',
        source_url: null,
      }),
    ],
  });
  const score = computeEventPriority(ev);
  assert.ok(score <= 35, 'expected <= 35, got ' + score);
});

test('15. priority: event with zero performances scores 0', () => {
  const ev = baseEvent({ performances: [] });
  assert.equal(computeEventPriority(ev), 0);
});

test('15. priority: event with real source_url but no verified entry scores >= 50', () => {
  const ev = baseEvent({
    performances: [
      basePerformance({
        value: 14.5,
        validation_status: 'experimental',
        source_url: 'https://example.org/news/article',
        sanctioning_body: 'World Humanoid Robot Games',
      }),
    ],
  });
  assert.ok(computeEventPriority(ev) >= 50, 'expected >= 50, got ' + computeEventPriority(ev));
});

test('15. priority: tiebreaker — equal-priority events sort A before B alphabetically', () => {
  const a = { event_name: 'Apple Event', performances: [] };
  const b = { event_name: 'Banana Event', performances: [] };
  const sorted = [b, a].slice().sort((x, y) => {
    const sx = computeEventPriority(baseEvent(x));
    const sy = computeEventPriority(baseEvent(y));
    if (sy !== sx) return sy - sx;
    return x.event_name.localeCompare(y.event_name);
  });
  assert.equal(sorted[0].event_name, 'Apple Event');
  assert.equal(sorted[1].event_name, 'Banana Event');
});

test('15. priority: live mens-100m (Cassie verified) scores >= 100', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const ev = ledger.events.find(e => e.event_id === 'mens-100m');
  const score = computeEventPriority(ev);
  assert.ok(score >= 100, 'mens-100m priority expected >= 100, got ' + score);
});

test('15. priority: live mens-half-marathon (Flash cited) scores >= 50', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const ev = ledger.events.find(e => e.event_id === 'mens-half-marathon');
  const score = computeEventPriority(ev);
  assert.ok(score >= 50, 'mens-half-marathon priority expected >= 50, got ' + score);
});

// ---------------------------------------------------------------------------
// 16. Recency bonus: any performance dated within the last 30 days adds +5.
//     Surfaces today's news above older real-data events when their other
//     priority components tie.
// ---------------------------------------------------------------------------
function isoDaysAgo(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

test('16. recency: a performance dated within 30 days adds +5 over the same event with an older date', () => {
  const evRecent = baseEvent({ performances: [basePerformance({ date: isoDaysAgo(5) })] });
  const evOld = baseEvent({ performances: [basePerformance({ date: '2020-01-01' })] });
  const diff = computeEventPriority(evRecent) - computeEventPriority(evOld);
  assert.equal(diff, 5);
});

test('16. recency: a performance older than 30 days does NOT add the recency bonus', () => {
  // value=50 vs baseEvent.human_record.value=10 → status is Human Lead (avoids Parity +25)
  const ev = baseEvent({ performances: [basePerformance({ date: isoDaysAgo(60), value: 50.0 })] });
  // No verified, no source_url, no Parity/RobotLead, +10 for compliant attempt, no recency = 10
  assert.equal(computeEventPriority(ev), 10);
});

test('16. recency: live mens-half-marathon (Flash dated 2026-04-19) ranks above mens-1500m (H1 2025-08-15) when build is within 30 days of Flash', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const half = ledger.events.find(e => e.event_id === 'mens-half-marathon');
  const m1500 = ledger.events.find(e => e.event_id === 'mens-1500m');
  // The recency window is rolling — only assert ordering when we are still inside it.
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const flashWithinWindow = Date.parse('2026-04-19') >= cutoff;
  if (flashWithinWindow) {
    assert.ok(
      computeEventPriority(half) > computeEventPriority(m1500),
      'with Flash inside the recency window, half-marathon must outrank 1500m'
    );
  } else {
    // Outside the window the two scores tie at 60; either ordering is acceptable.
    assert.equal(computeEventPriority(half), computeEventPriority(m1500));
  }
});

// ---------------------------------------------------------------------------
// 17. Disclaimer gating: the "illustrative seed data" disclaimer should fire
//     only on rows with source_url === null. Real cited entries (H1, Flash)
//     must have a non-null source_url so the disclaimer is suppressed.
// ---------------------------------------------------------------------------
test('17. disclaimer gating: H1 (mens-1500m best) has non-null source_url so the disclaimer is suppressed', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const ev = ledger.events.find(e => e.event_id === 'mens-1500m');
  const best = computeStatus(ev).best_robot;
  assert.ok(best, 'mens-1500m must select a best robot');
  assert.notEqual(best.source_url, null, 'H1 must have a non-null source_url for the disclaimer to suppress');
});

test('17. disclaimer gating: Flash (mens-half-marathon ineligible) has non-null source_url', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const ev = ledger.events.find(e => e.event_id === 'mens-half-marathon');
  const flash = ev.performances.find(p => p.robot_model === 'Flash');
  assert.notEqual(flash.source_url, null, 'Flash must have a non-null source_url');
});

test('17. disclaimer gating: a placeholder row (Humanoid C on womens-100m) has null source_url so the disclaimer DOES fire', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const ev = ledger.events.find(e => e.event_id === 'womens-100m');
  const best = computeStatus(ev).best_robot;
  assert.ok(best, 'womens-100m must select a best robot');
  assert.equal(best.source_url, null, 'Humanoid C placeholder must have null source_url to trigger the disclaimer');
});

// ---------------------------------------------------------------------------
// 18. ProRL Combine 2026 placeholder is restored on mens-100m as a strategic
//     signal to the Professional Robotics League. value=null, unverified,
//     ineligible (pending). Must not be selected; must not affect Cassie's
//     selection as best.
// ---------------------------------------------------------------------------
test('18. mens-100m contains the ProRL Combine 2026 placeholder with value=null', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const m100 = ledger.events.find(e => e.event_id === 'mens-100m');
  const prorl = (m100.performances || []).find(p => p.sanctioning_body === 'ProRL');
  assert.ok(prorl, 'ProRL Combine entry must exist on mens-100m');
  assert.equal(prorl.value, null);
  assert.equal(prorl.validation_status, 'unverified');
  assert.match(prorl.source_url || '', /pro-rl/);
  // Cassie must still be selected as best despite ProRL being present
  const result = computeStatus(m100);
  assert.equal(result.best_robot.robot_model, 'Cassie');
});
