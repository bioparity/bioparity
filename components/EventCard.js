import { formatValue, formatDelta, formatPercent, formatDate } from '../lib/format.js';
import ValidationBadge from './ValidationBadge.js';

const STATUS_STYLES = {
  'Robot Lead': 'bg-robot/15 text-robot border-robot/40',
  'Parity': 'bg-parity/15 text-parity border-parity/40',
  'Human Lead': 'bg-human/15 text-human border-human/40',
  'Human Lead (no eligible robot performance)': 'bg-rule text-dim border-rule',
  'Human Lead (no robot attempts)': 'bg-rule text-faint border-rule',
};

const SEASON_DOT = {
  summer: 'bg-warn',
  winter: 'bg-parity',
};

export default function EventCard({ event }) {
  const { computed } = event;
  const { status, best_robot, delta_to_parity, percent_to_parity, fallback } = computed;
  const styleKey = status in STATUS_STYLES ? status : 'Human Lead';
  const badgeClass = STATUS_STYLES[styleKey];
  const shortStatus = status.startsWith('Human Lead (no')
    ? (status.includes('eligible') ? 'No eligible attempt' : 'No attempts')
    : status;

  return (
    <a
      href={'/event/' + event.event_id}
      className="block border border-rule rounded-lg p-5 bg-panel hover:border-edge transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-dim mb-1">
            <span
              className={'inline-block w-2 h-2 rounded-full ' + (SEASON_DOT[event.season] || 'bg-dim')}
              aria-label={event.season}
            />
            <span className="uppercase tracking-wider">{event.sport_category}</span>
          </div>
          <h3 className="text-base font-semibold text-paper truncate">{event.event_name}</h3>
        </div>
        <span className={'text-[10px] uppercase tracking-wider px-2 py-1 rounded border whitespace-nowrap ' + badgeClass}>
          {shortStatus}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-faint mb-1">Human</div>
          <div className="font-mono text-paper tabular-nums">
            {formatValue(event.human_record.value, event.metric_type)}
          </div>
          <div className="text-xs text-dim truncate">{event.human_record.holder}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-faint mb-1">Best robot</div>
          {best_robot ? (
            <>
              <div className="font-mono text-paper tabular-nums">
                {formatValue(best_robot.value, event.metric_type)}
              </div>
              <div className="text-xs text-dim truncate">{best_robot.robot_model}</div>
              {best_robot.validation_status !== 'verified' && (
                <div className="mt-1.5">
                  <ValidationBadge status={best_robot.validation_status} size="sm" />
                </div>
              )}
            </>
          ) : (
            <div className="text-xs text-faint italic">No selectable performance</div>
          )}
        </div>
      </div>

      {best_robot && (
        <div className="mt-4 pt-3 border-t border-rule flex items-center justify-between text-xs">
          <span className="text-dim">
            Δ {formatDelta(delta_to_parity, event.metric_type)} · {formatPercent(percent_to_parity)}
          </span>
          <span className="text-faint">{formatDate(best_robot.date)}</span>
        </div>
      )}

      {fallback && (
        <div className="mt-3 text-[10px] uppercase tracking-wider text-warn">
          Fallback: experimental
        </div>
      )}
    </a>
  );
}
