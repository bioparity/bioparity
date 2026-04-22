'use client';

import { useEffect, useState } from 'react';
import { formatValue } from '../lib/format.js';
import { BAR_MAX_RATIO, computeBarWidth, parityLinePercent } from '../lib/parity-bar.js';

const BUCKET_STYLES = {
  'robot-lead': {
    label: 'ROBOT LEAD',
    badgeClass:
      'bg-accent-verified/10 text-accent-verified border-accent-verified/40',
    rowClass:
      'border-l-2 border-accent-verified/60 bg-accent-verified/[0.04] pl-3 md:pl-4',
    barClass: 'bg-accent-verified',
  },
  'near-parity': {
    label: 'NEAR PARITY',
    badgeClass:
      'bg-accent-experimental/10 text-accent-experimental border-accent-experimental/40',
    rowClass: 'pl-3 md:pl-4',
    barClass: 'bg-accent-experimental',
  },
  'human-lead': {
    label: 'HUMAN LEAD',
    badgeClass: 'bg-edge text-dim border-rule',
    rowClass: 'pl-3 md:pl-4',
    barClass: 'bg-dim/50',
  },
  'no-data': {
    label: 'NO DATA',
    badgeClass: 'bg-edge text-faint border-rule',
    rowClass: 'pl-3 md:pl-4 opacity-55',
    barClass: '',
  },
};

const ANIMATION_DURATION_MS = 800;
const ANIMATION_STAGGER_MS = 100;

function formatPercent(ratio) {
  if (ratio === null || ratio === undefined) return '—';
  return (ratio * 100).toFixed(1) + '%';
}

function gapSummary(row) {
  if (row.ratio === null || row.delta === null || row.delta === undefined) {
    return 'No robot record';
  }
  if (row.status === 'Parity') return 'At parity';
  const abs = formatValue(Math.abs(row.delta), row.metric_type);
  if (row.delta < 0) return 'Robot ahead by ' + abs;
  return 'Robot behind by ' + abs;
}

export default function ParityLeaderboard({ rows }) {
  const finalWidths = (rows || []).map(r => computeBarWidth(r.ratio, BAR_MAX_RATIO));
  const [widths, setWidths] = useState(() => (rows || []).map(() => 0));

  useEffect(() => {
    if (!rows || rows.length === 0) return;
    const reduceMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setWidths(rows.map(r => computeBarWidth(r.ratio, BAR_MAX_RATIO)));
      return;
    }
    const timers = rows.map((r, i) =>
      window.setTimeout(() => {
        setWidths(prev => {
          const next = prev.slice();
          next[i] = computeBarWidth(r.ratio, BAR_MAX_RATIO);
          return next;
        });
      }, i * ANIMATION_STAGGER_MS)
    );
    return () => timers.forEach(clearTimeout);
  }, [rows]);

  if (!rows || rows.length === 0) {
    return (
      <section aria-label="Closest to parity leaderboard">
        <div className="text-micro uppercase text-dim mb-4">
          Closest to Parity
        </div>
        <div className="border border-dashed border-rule rounded-lg p-8 text-center text-dim">
          No events to rank.
        </div>
      </section>
    );
  }

  const parityPct = parityLinePercent(BAR_MAX_RATIO);

  return (
    <section aria-label="Closest to parity leaderboard">
      <div className="text-micro uppercase text-dim mb-4">
        Closest to Parity
      </div>
      <div className="relative h-4 mb-2 mx-3 md:mx-4" aria-hidden="true">
        <span
          className="absolute bottom-0 text-[10px] tracking-[0.12em] text-faint leading-none -translate-x-1/2"
          style={{ left: parityPct + '%' }}
        >
          PARITY
        </span>
      </div>
      <ol className="flex flex-col gap-2">
        {rows.map((row, idx) => {
          const style = BUCKET_STYLES[row.bucket] || BUCKET_STYLES['human-lead'];
          const hasBar = row.ratio !== null && row.ratio !== undefined;
          const liveWidth = widths[idx] ?? 0;
          const finalWidth = finalWidths[idx] ?? 0;
          return (
            <li
              key={row.event_id}
              className={
                'rounded-md border border-rule bg-panel py-3 pr-3 md:pr-4 ' +
                'flex flex-col gap-3 ' +
                style.rowClass
              }
            >
              <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
                <div className="flex items-center gap-3 md:w-56 md:flex-none">
                  <span className="text-micro text-faint tabular-nums w-6 text-right">
                    {idx + 1}
                  </span>
                  <span className="text-small md:text-base text-paper font-medium">
                    {row.event_name}
                  </span>
                </div>
                <div className="flex items-center gap-2 md:flex-none">
                  <span
                    className={
                      'text-micro tracking-wide px-2 py-0.5 rounded border ' +
                      style.badgeClass
                    }
                  >
                    {style.label}
                  </span>
                </div>
                <div className="md:flex-1 md:text-right text-small text-dim tabular-nums">
                  {gapSummary(row)}
                </div>
                <div className="md:w-20 md:text-right text-small font-semibold text-paper tabular-nums">
                  {formatPercent(row.ratio)}
                </div>
              </div>
              {hasBar && (
                <div
                  className="relative h-2 rounded-full bg-edge/40 overflow-hidden"
                  role="img"
                  aria-label={
                    'Parity ratio ' + formatPercent(row.ratio) +
                    ' of human record (parity line at 100%)'
                  }
                >
                  <div
                    className={'absolute top-0 left-0 h-full rounded-full ease-out ' + style.barClass}
                    style={{
                      width: liveWidth + '%',
                      transitionProperty: 'width',
                      transitionDuration: ANIMATION_DURATION_MS + 'ms',
                    }}
                    data-final-width={finalWidth}
                  />
                  <div
                    className="absolute top-0 h-full w-px bg-paper/40"
                    style={{ left: parityPct + '%' }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
