import { computeStatus, passesHardFail, STATUS } from './engine.js';

export function buildCoverageSeries(ledger) {
  const perfDates = new Set();
  for (const ev of (ledger && ledger.events) || []) {
    for (const p of ev.performances || []) {
      if (!p || !p.date) continue;
      if (p.value === null || p.value === undefined) continue;
      if (!passesHardFail(p)) continue;
      perfDates.add(p.date);
    }
  }
  const dates = Array.from(perfDates).sort();
  const series = [];
  for (const cutoff of dates) {
    let attempted = 0;
    let parityOrBetter = 0;
    for (const ev of ledger.events || []) {
      const eligible = (ev.performances || []).filter(p => {
        if (!p || !p.date) return false;
        if (p.value === null || p.value === undefined) return false;
        if (!passesHardFail(p)) return false;
        return p.date <= cutoff;
      });
      if (eligible.length === 0) continue;
      attempted += 1;
      const shadow = Object.assign({}, ev, { performances: eligible });
      const { status } = computeStatus(shadow);
      if (status === STATUS.PARITY || status === STATUS.ROBOT_LEAD) parityOrBetter += 1;
    }
    series.push({
      date: cutoff,
      attempted,
      parity_or_better: parityOrBetter,
      pct: attempted > 0 ? (parityOrBetter / attempted) * 100 : 0,
    });
  }
  return series;
}
