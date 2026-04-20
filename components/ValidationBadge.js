const STYLES = {
  experimental: {
    label: 'Experimental',
    classes: 'bg-warn/15 text-warn border-warn/40',
  },
  unverified: {
    label: 'Unverified · Seed Data',
    classes: 'bg-orange-500/15 text-orange-500 border-orange-500/40',
  },
};

export default function ValidationBadge({ status, size }) {
  if (!status || status === 'verified') return null;
  const cfg = STYLES[status] || STYLES.unverified;
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
