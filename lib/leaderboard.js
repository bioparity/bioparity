import { computeStatus, STATUS } from './engine.js';

export const NEAR_PARITY_THRESHOLD = 0.8;

export const BUCKET = {
  ROBOT_LEAD: 'robot-lead',
  NEAR_PARITY: 'near-parity',
  HUMAN_LEAD: 'human-lead',
  NO_DATA: 'no-data',
};

export function computeParityRatio(event) {
  const human = event && event.human_record && event.human_record.value;
  const computed = computeStatus(event);
  const best = computed.best_robot;
  if (!best || !human || human <= 0 || best.value === null || best.value === undefined) {
    return { ratio: null, robot_value: null, computed };
  }
  const ratio = event.comparison_direction === 'lower_is_better'
    ? human / best.value
    : best.value / human;
  return { ratio, robot_value: best.value, computed };
}

export function bucketFor(ratio, status) {
  if (ratio === null || ratio === undefined) return BUCKET.NO_DATA;
  if (status === STATUS.PARITY || status === STATUS.ROBOT_LEAD) return BUCKET.ROBOT_LEAD;
  if (ratio >= NEAR_PARITY_THRESHOLD) return BUCKET.NEAR_PARITY;
  return BUCKET.HUMAN_LEAD;
}

export function buildLeaderboard(ledger) {
  const rows = (ledger.events || []).map(ev => {
    const { ratio, robot_value, computed } = computeParityRatio(ev);
    return {
      event_id: ev.event_id,
      event_name: ev.event_name,
      metric_type: ev.metric_type,
      comparison_direction: ev.comparison_direction,
      human_value: ev.human_record && ev.human_record.value,
      human_holder: ev.human_record && ev.human_record.holder,
      robot_value,
      robot_model: computed.best_robot && computed.best_robot.robot_model,
      ratio,
      status: computed.status,
      delta: computed.delta_to_parity,
      bucket: bucketFor(ratio, computed.status),
    };
  });
  const withData = rows.filter(r => r.ratio !== null);
  const noData = rows.filter(r => r.ratio === null)
    .sort((a, b) => a.event_name.localeCompare(b.event_name));
  withData.sort((a, b) => {
    if (b.ratio !== a.ratio) return b.ratio - a.ratio;
    return a.event_name.localeCompare(b.event_name);
  });
  return [...withData, ...noData];
}
