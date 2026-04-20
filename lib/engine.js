import fs from 'node:fs';

export const EPSILON_BY_TYPE = {
  time_sprint: 0.0001,
  time_endurance: 0.001,
  distance: 0.001,
  score: 0.01,
};

export const STATUS = {
  PARITY: 'Parity',
  ROBOT_LEAD: 'Robot Lead',
  HUMAN_LEAD: 'Human Lead',
  HUMAN_LEAD_NO_ELIGIBLE: 'Human Lead (no eligible robot performance)',
  HUMAN_LEAD_NO_ATTEMPTS: 'Human Lead (no robot attempts)',
};

export function validateHardFail(perf) {
  const c = perf && perf.compliance;
  if (!c) {
    throw new Error('HARD FAIL: missing compliance block');
  }
  if (c.locomotion_type !== 'bipedal') {
    throw new Error('HARD FAIL: locomotion_type must be bipedal, got ' + c.locomotion_type);
  }
  if (c.energy_source !== 'integrated') {
    throw new Error('HARD FAIL: energy_source must be integrated, got ' + c.energy_source);
  }
  if (c.terrain_match !== true) {
    throw new Error('HARD FAIL: terrain_match must be true');
  }
  return true;
}

export function passesHardFail(perf) {
  try {
    validateHardFail(perf);
    return true;
  } catch (_err) {
    return false;
  }
}

export function checkEligibility(perf) {
  const reasons = [];
  const ca = (perf && perf.conditions_adjustment) || {};
  if (ca.wind_speed_mps !== null && ca.wind_speed_mps !== undefined && Number(ca.wind_speed_mps) > 2.0) {
    reasons.push('wind_speed_mps=' + ca.wind_speed_mps + ' exceeds 2.0');
  }
  if (ca.wind_legal === false) {
    reasons.push('wind_legal=false');
  }
  if (ca.surface_standardized === false) {
    reasons.push('surface_standardized=false');
  }
  if (ca.equipment_compliant === false) {
    reasons.push('equipment_compliant=false');
  }
  return {
    eligible: reasons.length === 0,
    reason: reasons.length === 0 ? null : reasons.join('; '),
  };
}

function isBetter(a, b, direction) {
  if (direction === 'lower_is_better') return a.value < b.value;
  return a.value > b.value;
}

function reduceBest(arr, direction) {
  let best = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (isBetter(arr[i], best, direction)) best = arr[i];
  }
  return best;
}

export function selectBestPerformance(performances, comparison_direction) {
  const arr = Array.isArray(performances) ? performances : [];

  const withValue = arr.filter(p => p && p.value !== null && p.value !== undefined);
  const compliant = withValue.filter(p => passesHardFail(p));
  const eligible = compliant.filter(p => checkEligibility(p).eligible === true);

  const verified = eligible.filter(p => p.validation_status === 'verified');
  if (verified.length > 0) {
    return {
      performance: reduceBest(verified, comparison_direction),
      fallback: false,
    };
  }

  const experimental = eligible.filter(p => p.validation_status === 'experimental');
  if (experimental.length > 0) {
    return {
      performance: reduceBest(experimental, comparison_direction),
      fallback: true,
    };
  }

  return { performance: null, fallback: false };
}

export function computeStatus(event) {
  const human = event.human_record.value;
  const epsilon = EPSILON_BY_TYPE[event.metric_type];
  if (epsilon === undefined) {
    throw new Error('unknown metric_type: ' + event.metric_type);
  }
  const direction = event.comparison_direction;

  const sel = selectBestPerformance(event.performances || [], direction);

  if (!sel.performance) {
    const anyAttempts = (event.performances || []).filter(p => {
      return p && p.value !== null && p.value !== undefined && passesHardFail(p);
    }).length > 0;
    return {
      status: anyAttempts ? STATUS.HUMAN_LEAD_NO_ELIGIBLE : STATUS.HUMAN_LEAD_NO_ATTEMPTS,
      best_robot: null,
      delta_to_parity: null,
      percent_to_parity: null,
      fallback: false,
    };
  }

  const robot = sel.performance.value;
  const ratio = Math.abs(robot - human) / human;

  let status;
  if (ratio <= epsilon) {
    status = STATUS.PARITY;
  } else if (
    (direction === 'lower_is_better' && robot < human) ||
    (direction === 'higher_is_better' && robot > human)
  ) {
    status = STATUS.ROBOT_LEAD;
  } else {
    status = STATUS.HUMAN_LEAD;
  }

  const delta = direction === 'lower_is_better' ? robot - human : human - robot;
  const percent = (delta / human) * 100;

  return {
    status,
    best_robot: sel.performance,
    delta_to_parity: delta,
    percent_to_parity: percent,
    fallback: sel.fallback,
  };
}

export function loadLedger(filepath) {
  const raw = fs.readFileSync(filepath, 'utf8');
  return JSON.parse(raw);
}

export function computeEventPriority(event) {
  let score = 0;
  const performances = (event && event.performances) || [];

  const hasVerifiedEligible = performances.some(p =>
    p &&
    p.validation_status === 'verified' &&
    p.record_eligibility &&
    p.record_eligibility.eligible === true
  );
  if (hasVerifiedEligible) score += 100;

  const hasCitation = performances.some(p => p && p.source_url);
  if (hasCitation) score += 50;

  const status = computeStatus(event).status;
  if (status === STATUS.PARITY || status === STATUS.ROBOT_LEAD) score += 25;

  const hasCompliantAttempt = performances.length > 0 && performances.some(p => passesHardFail(p));
  if (hasCompliantAttempt) score += 10;

  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const hasRecent = performances.some(p => {
    if (!p || !p.date) return false;
    const t = Date.parse(p.date);
    return Number.isFinite(t) && t >= cutoff;
  });
  if (hasRecent) score += 5;

  return score;
}

export function summarizeLedger(ledger) {
  let withAttempts = 0;
  let parityOrBetter = 0;
  for (const event of ledger.events) {
    const compValid = (event.performances || []).filter(p => {
      return p && p.value !== null && p.value !== undefined && passesHardFail(p);
    });
    if (compValid.length > 0) withAttempts++;
    const { status } = computeStatus(event);
    if (status === STATUS.PARITY || status === STATUS.ROBOT_LEAD) parityOrBetter++;
  }
  const total = ledger.events.length;
  return {
    total_events: total,
    events_with_attempts: withAttempts,
    parity_or_better: parityOrBetter,
    primary_pct: withAttempts > 0 ? (parityOrBetter / withAttempts) * 100 : 0,
    secondary_pct: total > 0 ? (parityOrBetter / total) * 100 : 0,
  };
}
