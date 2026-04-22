export const BAR_MAX_RATIO = 1.5;

export function computeBarWidth(ratio, maxRatio = BAR_MAX_RATIO) {
  if (ratio === null || ratio === undefined || ratio <= 0) return 0;
  if (!(maxRatio > 0)) return 0;
  const clamped = Math.min(ratio, maxRatio);
  return (clamped / maxRatio) * 100;
}

export function parityLinePercent(maxRatio = BAR_MAX_RATIO) {
  if (!(maxRatio > 0)) return 0;
  return (1 / maxRatio) * 100;
}
