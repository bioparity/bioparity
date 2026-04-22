'use client';

import { formatValue } from '../lib/format.js';

const BUCKET_STYLES = {
  'robot-lead': {
    label: 'ROBOT LEAD',
    badgeClass:
      'bg-accent-verified/10 text-accent-verified border-accent-verified/40',
    rowClass:
      'border-l-2 border-accent-verified/60 bg-accent-verified/[0.04] pl-3 md:pl-4',
  },
  'near-parity': {
    label: 'NEAR PARITY',
    badgeClass:
      'bg-accent-experimental/10 text-accent-experimental border-accent-experimental/40',
    rowClass: 'pl-3 md:pl-4',
  },
  'human-lead': {
    label: 'HUMAN LEAD',
    badgeClass: 'bg-edge text-dim border-rule',
    rowClass: 'pl-3 md:pl-4',
  },
  'no-data': {
    label: 'NO DATA',
    badgeClass: 'bg-edge text-faint border-rule',
    rowClass: 'pl-3 md:pl-4 opacity-55',
  },
};

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
  return (
    <section aria-label="Closest to parity leaderboard">
      <div className="text-micro uppercase text-dim mb-4">
        Closest to Parity
      </div>
      <ol className="flex flex-col gap-2">
        {rows.map((row, idx) => {
          const style = BUCKET_STYLES[row.bucket] || BUCKET_STYLES['human-lead'];
          return (
            <li
              key={row.event_id}
              className={
                'rounded-md border border-rule bg-panel py-3 pr-3 md:pr-4 ' +
                'flex flex-col md:flex-row md:items-center md:gap-4 gap-2 ' +
                style.rowClass
              }
            >
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
            </li>
          );
        })}
      </ol>
    </section>
  );
}
