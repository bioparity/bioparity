import { formatValue } from './format.js';

// Build a chronologically-sorted array of real, dated performances across the
// whole ledger. Used by the homepage TimelineHero.
//
// Eligibility is read from `performance.record_eligibility.eligible` — the
// only eligibility field the current schema exposes on each performance.
// A performance is skipped only when it has no explicit value (null) — those
// are pending placeholders (e.g., the ProRL Combine entry).
export function buildTimeline(ledger) {
  const out = [];
  for (const ev of ledger.events || []) {
    for (const p of ev.performances || []) {
      if (p.value === null || p.value === undefined) continue;
      if (!p.date) continue;
      const eligible = p.record_eligibility && p.record_eligibility.eligible === true;
      out.push({
        date: p.date,
        event_id: ev.event_id,
        event_name: ev.event_name,
        robot_name: p.robot_model,
        manufacturer: p.manufacturer || null,
        value: p.value,
        display_value: formatValue(p.value, ev.metric_type),
        autonomy: p.autonomy || 'unknown',
        eligibility: eligible ? 'eligible' : 'ineligible',
        tier: p.validation_status || 'unverified',
      });
    }
  }
  out.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    if (a.event_id !== b.event_id) return a.event_id < b.event_id ? -1 : 1;
    return a.robot_name.localeCompare(b.robot_name);
  });
  return out;
}
