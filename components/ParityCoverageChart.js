'use client';

import { useEffect, useRef, useState } from 'react';

const VIEW_W = 800;
const VIEW_H = 200;
const M_LEFT = 48;
const M_RIGHT = 32;
const M_TOP = 16;
const M_BOTTOM = 32;
const PLOT_W = VIEW_W - M_LEFT - M_RIGHT;
const PLOT_H = VIEW_H - M_TOP - M_BOTTOM;
const GRID_PCTS = [0, 25, 50, 75, 100];
const DRAW_DURATION_MS = 1100;

function yFor(pct) {
  return M_TOP + PLOT_H * (1 - pct / 100);
}

function pctLeft(x) {
  return (x / VIEW_W) * 100;
}

function pctTop(y) {
  return (y / VIEW_H) * 100;
}

function msFromISO(iso) {
  return Date.parse(iso + 'T00:00:00Z');
}

function formatShortDate(iso) {
  const [y, m] = String(iso).split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const mi = Math.max(0, Math.min(11, Number(m) - 1));
  return months[mi] + ' ' + y;
}

function stepPath(points) {
  if (points.length === 0) return '';
  let d = 'M ' + points[0].x.toFixed(2) + ' ' + points[0].y.toFixed(2);
  let prevY = points[0].y;
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    d += ' L ' + p.x.toFixed(2) + ' ' + prevY.toFixed(2);
    d += ' L ' + p.x.toFixed(2) + ' ' + p.y.toFixed(2);
    prevY = p.y;
  }
  return d;
}

export default function ParityCoverageChart({ series, summary, categoryCount }) {
  const pathRef = useRef(null);
  const [pathLen, setPathLen] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    setPathLen(len);
    const reduceMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setAnimate(true);
      return;
    }
    const id = window.requestAnimationFrame(() => setAnimate(true));
    return () => window.cancelAnimationFrame(id);
  }, [series]);

  if (!series || series.length === 0) {
    return (
      <section aria-label="Cumulative parity coverage">
        <div className="text-micro uppercase text-dim mb-4">
          Parity Coverage Over Time
        </div>
        <div className="border border-dashed border-rule rounded-lg p-8 text-center text-dim">
          No compliance-valid robot performances recorded yet.
        </div>
      </section>
    );
  }

  const minMs = msFromISO(series[0].date);
  const maxMs = msFromISO(series[series.length - 1].date);
  const span = Math.max(1, maxMs - minMs);
  const xFor = (iso) => M_LEFT + PLOT_W * ((msFromISO(iso) - minMs) / span);

  const points = series.map(s => ({ x: xFor(s.date), y: yFor(s.pct), ...s }));
  const last = points[points.length - 1];
  const rightEdge = M_LEFT + PLOT_W;
  const pathD = stepPath(points) + ' L ' + rightEdge.toFixed(2) + ' ' + last.y.toFixed(2);

  const current = series[series.length - 1];
  const context =
    'Tracking ' + summary.total_events + ' events across ' +
    categoryCount + ' categor' + (categoryCount === 1 ? 'y' : 'ies') + '. ' +
    summary.events_with_attempts + ' ' +
    (summary.events_with_attempts === 1 ? 'has' : 'have') +
    ' robot records.';

  const strokeDasharray = pathLen !== null ? pathLen : undefined;
  const strokeDashoffset = pathLen === null ? undefined : animate ? 0 : pathLen;

  return (
    <section aria-label="Cumulative parity coverage">
      <div className="text-micro uppercase text-dim mb-4">
        Parity Coverage Over Time
      </div>
      <div className="border border-rule rounded-lg bg-panel p-4 md:p-5">
        <div className="relative w-full h-[180px] md:h-[200px]">
          <svg
            role="img"
            aria-label={
              'Cumulative share of attempted events at Parity or Robot Lead, ' +
              'currently ' + Math.round(current.pct) + ' percent, ' +
              current.parity_or_better + ' of ' + current.attempted + ' attempted events.'
            }
            viewBox={'0 0 ' + VIEW_W + ' ' + VIEW_H}
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
          >
            {GRID_PCTS.map(pct => (
              <line
                key={pct}
                x1={M_LEFT}
                x2={M_LEFT + PLOT_W}
                y1={yFor(pct)}
                y2={yFor(pct)}
                stroke="#2a2a3e"
                strokeWidth="1"
                strokeDasharray={pct === 100 ? '4 3' : undefined}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <line
              x1={M_LEFT}
              x2={M_LEFT}
              y1={M_TOP}
              y2={M_TOP + PLOT_H}
              stroke="#2a2a3e"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <path
              ref={pathRef}
              d={pathD}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{
                strokeDasharray,
                strokeDashoffset,
                transitionProperty: 'stroke-dashoffset',
                transitionDuration: DRAW_DURATION_MS + 'ms',
                transitionTimingFunction: 'ease-out',
              }}
            />
            {points.map((p, i) => (
              <circle
                key={p.date + '-' + i}
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill="#22c55e"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          {GRID_PCTS.map(pct => (
            <span
              key={'yl-' + pct}
              className="absolute text-[10px] text-dim tabular-nums font-mono leading-none -translate-y-1/2"
              style={{ left: 0, top: pctTop(yFor(pct)) + '%' }}
            >
              {pct}%
            </span>
          ))}

          <span
            className="absolute text-[10px] tracking-[0.1em] text-faint font-mono leading-none whitespace-nowrap"
            style={{
              left: pctLeft(M_LEFT + PLOT_W) + '%',
              top: pctTop(yFor(100) - 4) + '%',
              transform: 'translate(-100%, -100%)',
            }}
          >
            FULL PARITY
          </span>

          {points.map((p, i) => {
            if (i !== 0 && i !== points.length - 1) return null;
            return (
              <span
                key={'xl-' + i}
                className="absolute text-[10px] text-dim tabular-nums font-mono leading-none whitespace-nowrap"
                style={{
                  left: pctLeft(p.x) + '%',
                  top: pctTop(M_TOP + PLOT_H + 12) + '%',
                  transform: i === 0 ? 'translate(0, 0)' : 'translate(-100%, 0)',
                }}
              >
                {formatShortDate(p.date)}
              </span>
            );
          })}

          <span
            className="absolute text-[11px] text-accent-verified font-semibold font-mono tabular-nums leading-none whitespace-nowrap"
            style={{
              left: pctLeft(last.x) + '%',
              top: pctTop(last.y) + '%',
              transform: 'translate(-100%, calc(-100% - 8px))',
            }}
          >
            {Math.round(current.pct) + '% (' + current.parity_or_better + ' of ' + current.attempted + ')'}
          </span>
        </div>
        <div className="text-xs text-dim mt-3">
          {context}
        </div>
      </div>
    </section>
  );
}
