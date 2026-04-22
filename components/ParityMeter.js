'use client';

import { useEffect, useState, useRef } from 'react';

const DURATION_MS = 1200;
const SECONDARY_DELAY_MS = 200;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(targetValue, { delayMs = 0 } = {}) {
  const [display, setDisplay] = useState(0);
  const [done, setDone] = useState(false);
  const rafRef = useRef(0);
  const timerRef = useRef(0);
  useEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setDisplay(targetValue);
      setDone(true);
      return;
    }
    let startTs = 0;
    const tick = (ts) => {
      if (!startTs) startTs = ts;
      const t = Math.min(1, (ts - startTs) / DURATION_MS);
      const eased = easeOutCubic(t);
      setDisplay(targetValue * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(targetValue);
        setDone(true);
      }
    };
    timerRef.current = window.setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick);
    }, delayMs);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [targetValue, delayMs]);
  return { display, done };
}

export default function ParityMeter({ summary }) {
  const primaryTarget = Math.round(summary.primary_pct);
  const secondaryTarget = Math.round(summary.secondary_pct);
  const primary = useCountUp(primaryTarget, { delayMs: 0 });
  const secondary = useCountUp(secondaryTarget, { delayMs: SECONDARY_DELAY_MS });

  const primaryShown = Math.round(primary.display);
  const secondaryShown = Math.round(secondary.display);

  const isComplete = primaryTarget >= 100;
  const primaryColor = isComplete ? 'text-accent-verified' : 'text-ink';
  // Underline is the "gap" signal — only render once animation completes so
  // the line doesn't flash during the count-up.
  let underline = '';
  if (primary.done && !isComplete) {
    underline = primaryTarget === 0
      ? 'border-b-2 border-accent-ineligible'
      : 'border-b-2 border-accent-experimental';
  }

  return (
    <div className="border border-rule rounded-lg p-6 md:p-8 bg-panel">
      <div className="text-micro uppercase text-dim mb-4">
        Biological Parity Gap
      </div>
      <div className="flex flex-col md:flex-row md:items-end md:gap-12 gap-6">
        <div>
          <span
            className={
              'inline-block text-7xl md:text-8xl font-bold leading-none tabular-nums pb-1 ' +
              primaryColor + ' ' + underline
            }
          >
            {primaryShown}%
          </span>
          <div className="text-sm text-muted mt-3 max-w-xs">
            Among the {summary.events_with_attempts} events robots have attempted, this share
            is at <span className="text-paper">Parity</span> or{' '}
            <span className="text-paper">Robot Lead</span>.
          </div>
        </div>
        <div className="md:border-l md:border-rule md:pl-12">
          <div className="text-3xl font-semibold text-paper tabular-nums">
            {secondaryShown}%
          </div>
          <div className="text-sm text-muted mt-2 max-w-xs">
            Across all {summary.total_events} tracked events.
          </div>
        </div>
      </div>
      <div className="text-xs text-faint mt-6">
        {summary.parity_or_better} of {summary.total_events} events ·{' '}
        {summary.events_with_attempts} have at least one compliance-valid robot attempt.
      </div>
    </div>
  );
}
