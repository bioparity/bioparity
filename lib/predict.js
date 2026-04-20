import { passesHardFail, checkEligibility, computeStatus, STATUS } from './engine.js';

function fractionalYear(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const y = d.getUTCFullYear();
  const start = Date.UTC(y, 0, 1);
  const end = Date.UTC(y + 1, 0, 1);
  return y + (d.getTime() - start) / (end - start);
}

function rejection(reason, extras) {
  const out = { projected_year: null, confidence: 'low', reason: reason, r_squared: null, n: 0 };
  if (extras) Object.assign(out, extras);
  return out;
}

export function project(event, opts) {
  const now = (opts && opts.now) || new Date();
  const human = event.human_record.value;
  const direction = event.comparison_direction;

  const status = computeStatus(event).status;
  if (status === STATUS.PARITY || status === STATUS.ROBOT_LEAD) {
    return rejection('already_achieved');
  }

  const valid = (event.performances || [])
    .filter(p => p && p.value !== null && p.value !== undefined)
    .filter(p => passesHardFail(p))
    .filter(p => checkEligibility(p).eligible === true);

  const n = valid.length;
  if (n < 3) {
    return rejection('insufficient_data', { n });
  }

  const points = [];
  for (const p of valid) {
    const x = fractionalYear(p.date);
    if (x === null) continue;
    points.push({ x, y: Number(p.value) });
  }

  const m = points.length;
  if (m < 3) {
    return rejection('insufficient_data', { n: m });
  }

  let sumX = 0, sumY = 0;
  for (const p of points) { sumX += p.x; sumY += p.y; }
  const meanX = sumX / m;
  const meanY = sumY / m;

  let numer = 0, denomX = 0, ssTot = 0;
  for (const p of points) {
    numer += (p.x - meanX) * (p.y - meanY);
    denomX += (p.x - meanX) ** 2;
    ssTot += (p.y - meanY) ** 2;
  }

  if (denomX === 0) {
    return rejection('insufficient_data', { n: m });
  }

  const slope = numer / denomX;
  const intercept = meanY - slope * meanX;

  let ssRes = 0;
  for (const p of points) {
    const yhat = slope * p.x + intercept;
    ssRes += (p.y - yhat) ** 2;
  }
  const r_squared = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

  if (r_squared < 0.3) {
    return rejection('low_fit', { r_squared, n: m });
  }

  if (direction === 'lower_is_better' && slope >= 0) {
    return rejection('regressing_trend', { r_squared, n: m, slope });
  }
  if (direction === 'higher_is_better' && slope <= 0) {
    return rejection('regressing_trend', { r_squared, n: m, slope });
  }

  if (slope === 0) {
    return rejection('regressing_trend', { r_squared, n: m, slope });
  }

  const projectedYear = (human - intercept) / slope;
  const currentYear = now.getUTCFullYear();

  if (projectedYear < currentYear) {
    return rejection('already_passed', { r_squared, n: m, projected_raw: projectedYear });
  }
  if (projectedYear > 2100) {
    return rejection('beyond_horizon', { r_squared, n: m, projected_raw: projectedYear });
  }

  let confidence;
  if (m >= 6 && r_squared >= 0.7) confidence = 'high';
  else if (m >= 4 && r_squared >= 0.5) confidence = 'medium';
  else confidence = 'low';

  return {
    projected_year: projectedYear,
    confidence,
    reason: null,
    r_squared,
    n: m,
    slope,
    intercept,
  };
}
