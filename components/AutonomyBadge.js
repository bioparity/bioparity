const STYLES = {
  autonomous: {
    label: 'Autonomous',
    classes: 'bg-parity/15 text-parity border-parity/40',
  },
  assisted: {
    label: 'Assisted',
    classes: 'bg-warn/15 text-warn border-warn/40',
  },
  teleoperated: {
    label: 'Teleoperated',
    classes: 'bg-red-500/15 text-red-400 border-red-500/40',
  },
  unknown: {
    label: 'Autonomy Unknown',
    classes: 'bg-rule text-dim border-rule',
  },
};

export default function AutonomyBadge({ autonomy, size }) {
  const key = autonomy && STYLES[autonomy] ? autonomy : 'unknown';
  const cfg = STYLES[key];
  const sizeClass = size === 'sm'
    ? 'text-[9px] px-1.5 py-0.5'
    : 'text-[10px] px-2 py-0.5';
  return (
    <span
      className={
        'inline-block uppercase tracking-wider rounded border whitespace-nowrap ' +
        sizeClass + ' ' + cfg.classes
      }
    >
      {cfg.label}
    </span>
  );
}
