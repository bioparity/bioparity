export default function ParityMeter({ summary }) {
  const primary = Math.round(summary.primary_pct);
  const secondary = Math.round(summary.secondary_pct);
  return (
    <div className="border border-rule rounded-lg p-6 md:p-8 bg-panel">
      <div className="text-xs uppercase tracking-widest text-dim mb-4">
        Biological Parity Gap
      </div>
      <div className="flex flex-col md:flex-row md:items-end md:gap-12 gap-6">
        <div>
          <div className="text-7xl md:text-8xl font-bold text-robot leading-none tabular-nums">
            {primary}%
          </div>
          <div className="text-sm text-muted mt-3 max-w-xs">
            Among the {summary.events_with_attempts} events robots have attempted, this share
            is at <span className="text-paper">Parity</span> or{' '}
            <span className="text-paper">Robot Lead</span>.
          </div>
        </div>
        <div className="md:border-l md:border-rule md:pl-12">
          <div className="text-3xl font-semibold text-paper tabular-nums">
            {secondary}%
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
