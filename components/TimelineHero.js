'use client';

import { useState, useMemo } from 'react';

// Autonomy → stroke/fill color. Uses 8a accent tokens.
const AUTONOMY_COLOR = {
  autonomous: '#22c55e',   // accent-verified
  assisted: '#f59e0b',     // accent-experimental
  teleoperated: '#3b82f6', // accent-data
  unknown: '#8b8a85',      // ink-muted
};

// Compose the robot display label for the timeline tooltip.
// Rule: prefix manufacturer when present. If the combined string exceeds
// MAX_COMBINED, truncate the manufacturer portion at MAX_MFR with an ellipsis,
// preferring a word boundary. Falls back to robot_model alone when
// manufacturer is absent or empty.
const MAX_COMBINED = 36;
const MAX_MFR = 24;
function truncateManufacturer(mfr) {
  if (mfr.length <= MAX_MFR) return mfr;
  const hard = mfr.slice(0, MAX_MFR);
  const lastSpace = hard.lastIndexOf(' ');
  const base = lastSpace > 0 ? hard.slice(0, lastSpace) : hard;
  return base + '…';
}
function displayRobotName(manufacturer, model) {
  if (!manufacturer) return model;
  const combined = manufacturer + ' ' + model;
  if (combined.length <= MAX_COMBINED) return combined;
  return truncateManufacturer(manufacturer) + ' ' + model;
}

function fractionalYear(iso) {
  const d = new Date(iso);
  const y = d.getUTCFullYear();
  const start = Date.UTC(y, 0, 1);
  const end = Date.UTC(y + 1, 0, 1);
  return y + (d.getTime() - start) / (end - start);
}

// Deterministic vertical jitter: group dots whose percent-x positions are
// within JITTER_PX of each other, then stagger their y around the baseline.
// We compute on a fixed reference width so SSR and first client paint match.
const REFERENCE_WIDTH = 800;
const JITTER_PX = 20;
const BAND = 40;

function assignYOffsets(entries, domainStart, domainEnd) {
  const axisW = REFERENCE_WIDTH * 0.9; // 5% padding each side
  const pxFor = (year) => axisW * (year - domainStart) / (domainEnd - domainStart);
  const withX = entries.map((e, i) => ({
    i,
    px: pxFor(fractionalYear(e.date)),
  }));
  withX.sort((a, b) => a.px - b.px);
  const groups = [];
  let current = [];
  for (const p of withX) {
    if (current.length === 0) {
      current = [p];
      continue;
    }
    const last = current[current.length - 1];
    if (Math.abs(p.px - last.px) < JITTER_PX) {
      current.push(p);
    } else {
      groups.push(current);
      current = [p];
    }
  }
  if (current.length) groups.push(current);

  const offsets = new Array(entries.length).fill(0);
  for (const g of groups) {
    if (g.length === 1) {
      offsets[g[0].i] = 0;
      continue;
    }
    // Stagger within ±BAND/2: -BAND/2, -BAND/2 + step, …, +BAND/2
    const step = BAND / (g.length - 1);
    g.forEach((p, idx) => {
      offsets[p.i] = -BAND / 2 + step * idx;
    });
  }
  return offsets;
}

export default function TimelineHero({ entries }) {
  const [active, setActive] = useState(null);

  const { domainStart, domainEnd, years, yOffsets } = useMemo(() => {
    if (!entries.length) {
      const currentYear = new Date().getUTCFullYear();
      return {
        domainStart: currentYear - 1,
        domainEnd: currentYear + 1,
        years: [currentYear - 1, currentYear, currentYear + 1],
        yOffsets: [],
      };
    }
    const fracYears = entries.map((e) => fractionalYear(e.date));
    const minYear = Math.floor(Math.min(...fracYears));
    const maxYear = Math.ceil(Math.max(...fracYears));
    const currentYear = new Date().getUTCFullYear();
    const ds = minYear;
    const de = Math.max(maxYear + 1, currentYear + 1);
    const span = de - ds;
    const step = span > 8 ? 2 : 1;
    const years = [];
    for (let y = ds; y <= de; y += step) years.push(y);
    if (years[years.length - 1] !== de) years.push(de);
    const yOffsets = assignYOffsets(entries, ds, de);
    return { domainStart: ds, domainEnd: de, years, yOffsets };
  }, [entries]);

  const xPct = (frac) => 5 + 90 * (frac - domainStart) / (domainEnd - domainStart);

  return (
    <section aria-label="Ledger timeline" className="relative">
      <div className="text-micro uppercase text-dim mb-4">Timeline of Recorded Performances</div>
      <div className="overflow-x-auto">
        <div className="relative min-w-[560px]" style={{ height: '140px' }}>
          <svg
            width="100%"
            height="140"
            viewBox="0 0 800 140"
            preserveAspectRatio="none"
            role="img"
            aria-label="Chronological plot of all recorded robot performances"
          >
            <line
              x1="40" y1="90" x2="760" y2="90"
              stroke="#2a2a3e" strokeWidth="1"
            />
            {years.map((y) => {
              const px = 40 + (720 * (y - domainStart)) / (domainEnd - domainStart);
              return (
                <g key={y}>
                  <line x1={px} y1="86" x2={px} y2="94" stroke="#2a2a3e" strokeWidth="1" />
                </g>
              );
            })}
          </svg>
          <div className="absolute inset-0 pointer-events-none">
            {years.map((y) => {
              const leftPct = 5 + 90 * (y - domainStart) / (domainEnd - domainStart);
              return (
                <div
                  key={y}
                  className="absolute text-micro text-dim tabular-nums -translate-x-1/2"
                  style={{ left: leftPct + '%', top: '102px' }}
                >
                  {y}
                </div>
              );
            })}
          </div>
          <div className="absolute inset-0">
            {entries.map((e, i) => {
              const frac = fractionalYear(e.date);
              const leftPct = xPct(frac);
              const yOff = yOffsets[i] || 0;
              const color = AUTONOMY_COLOR[e.autonomy] || AUTONOMY_COLOR.unknown;
              const filled = e.eligibility === 'eligible';
              const key = e.event_id + '-' + i;
              const isActive = active === key;
              const displayName = displayRobotName(e.manufacturer, e.robot_name);
              return (
                <button
                  key={key}
                  type="button"
                  onMouseEnter={() => setActive(key)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(key)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(isActive ? null : key)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                  style={{ left: leftPct + '%', top: (60 + yOff) + 'px' }}
                  aria-label={
                    displayName + ' · ' + e.event_name + ' · ' + e.display_value +
                    ' · ' + e.autonomy + ' · ' + e.eligibility
                  }
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="w-4 h-4 md:w-5 md:h-5"
                    aria-hidden="true"
                  >
                    <circle
                      cx="10" cy="10"
                      r={filled ? 10 : 9}
                      fill={filled ? color : 'transparent'}
                      stroke={color}
                      strokeWidth={filled ? 0 : 2}
                    />
                  </svg>
                  {isActive && (
                    <div
                      role="tooltip"
                      className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+6px)] z-10 whitespace-nowrap text-small px-3 py-1.5 rounded border border-rule bg-bg text-paper shadow-lg"
                    >
                      {displayName} · {e.event_name} · {e.display_value} · {e.autonomy} · {e.eligibility}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-micro text-dim mt-3">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent-verified" />
          autonomous
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent-experimental" />
          assisted
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent-data" />
          teleoperated
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full border-2 border-accent-verified"
          />
          hollow = ineligible
        </span>
      </div>
    </section>
  );
}
