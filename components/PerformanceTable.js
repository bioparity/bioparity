import { formatValue, formatDate } from '../lib/format.js';

const STATUS_LABELS = {
  verified: { label: 'Verified', cls: 'text-robot border-robot/50' },
  experimental: { label: 'Experimental', cls: 'text-warn border-warn/50' },
  unverified: { label: 'Unverified', cls: 'text-dim border-rule' },
};

export default function PerformanceTable({ event }) {
  const performances = event.performances || [];
  if (performances.length === 0) {
    return (
      <div className="border border-dashed border-rule rounded-lg p-8 text-center text-dim text-sm">
        No robot performances recorded for this event yet.
        <div className="mt-2 text-xs">
          <a href="/submit" className="underline hover:text-paper">
            Submit a verified performance →
          </a>
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto border border-rule rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-panel text-xs uppercase tracking-wider text-dim">
          <tr>
            <th className="text-left px-4 py-3">Robot</th>
            <th className="text-right px-4 py-3">Value</th>
            <th className="text-left px-4 py-3">Date</th>
            <th className="text-left px-4 py-3">Status</th>
            <th className="text-left px-4 py-3">Eligibility</th>
            <th className="text-left px-4 py-3">Source</th>
          </tr>
        </thead>
        <tbody>
          {performances.map(p => {
            const s = STATUS_LABELS[p.validation_status] || STATUS_LABELS.unverified;
            return (
              <tr key={p.performance_id} className="border-t border-rule align-top">
                <td className="px-4 py-3">
                  <div className="font-medium text-paper">{p.robot_model}</div>
                  <div className="text-xs text-dim">{p.manufacturer}</div>
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">
                  {p.value === null ? (
                    <span className="text-faint italic">pending</span>
                  ) : (
                    formatValue(p.value, event.metric_type)
                  )}
                </td>
                <td className="px-4 py-3 text-dim whitespace-nowrap">{formatDate(p.date)}</td>
                <td className="px-4 py-3">
                  <span className={'text-[10px] uppercase tracking-wider px-2 py-0.5 border rounded ' + s.cls}>
                    {s.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">
                  {p.record_eligibility.eligible ? (
                    <span className="text-robot">Eligible</span>
                  ) : (
                    <span className="text-warn" title={p.record_eligibility.reason || ''}>
                      Ineligible
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs">
                  {p.source_url ? (
                    <a
                      href={p.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-paper text-dim truncate block max-w-[14rem]"
                    >
                      {p.sanctioning_body || p.source_url}
                    </a>
                  ) : (
                    <span className="text-faint italic">no citation</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
