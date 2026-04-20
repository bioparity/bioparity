export function formatTime(seconds) {
  if (seconds === null || seconds === undefined) return '—';
  const s = Number(seconds);
  if (!Number.isFinite(s)) return '—';
  if (s < 60) return s.toFixed(2) + 's';
  if (s < 3600) {
    const m = Math.floor(s / 60);
    const rem = s - m * 60;
    return m + ':' + rem.toFixed(2).padStart(5, '0');
  }
  const h = Math.floor(s / 3600);
  const m = Math.floor((s - h * 3600) / 60);
  const rem = s - h * 3600 - m * 60;
  return h + ':' + String(m).padStart(2, '0') + ':' + rem.toFixed(2).padStart(5, '0');
}

export function formatDistance(meters) {
  if (meters === null || meters === undefined) return '—';
  const m = Number(meters);
  if (!Number.isFinite(m)) return '—';
  return m.toFixed(2) + ' m';
}

export function formatScore(points) {
  if (points === null || points === undefined) return '—';
  const p = Number(points);
  if (!Number.isFinite(p)) return '—';
  return p.toFixed(2);
}

export function formatValue(value, metric_type) {
  if (value === null || value === undefined) return '—';
  if (metric_type === 'time_sprint' || metric_type === 'time_endurance') return formatTime(value);
  if (metric_type === 'distance') return formatDistance(value);
  if (metric_type === 'score') return formatScore(value);
  return String(value);
}

export function formatDelta(delta, metric_type) {
  if (delta === null || delta === undefined) return '—';
  const sign = delta >= 0 ? '+' : '−';
  const abs = Math.abs(delta);
  if (metric_type === 'time_sprint' || metric_type === 'time_endurance') {
    return sign + abs.toFixed(2) + 's';
  }
  if (metric_type === 'distance') return sign + abs.toFixed(2) + ' m';
  if (metric_type === 'score') return sign + abs.toFixed(2);
  return sign + String(abs);
}

export function formatPercent(pct) {
  if (pct === null || pct === undefined) return '—';
  const p = Number(pct);
  if (!Number.isFinite(p)) return '—';
  const sign = p >= 0 ? '+' : '−';
  return sign + Math.abs(p).toFixed(2) + '%';
}

export function formatDate(iso) {
  if (!iso) return '—';
  return String(iso).slice(0, 10);
}

export function formatYear(year) {
  if (year === null || year === undefined) return '—';
  const y = Number(year);
  if (!Number.isFinite(y)) return '—';
  return String(Math.round(y));
}
