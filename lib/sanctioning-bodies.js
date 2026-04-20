export const SANCTIONING_BODIES = [
  { code: 'World Athletics', name: 'World Athletics', domain: 'track-and-field' },
  { code: 'FINA', name: 'World Aquatics (FINA)', domain: 'swimming-diving' },
  { code: 'ISU', name: 'International Skating Union', domain: 'speed-skating-short-track' },
  { code: 'IWF', name: 'International Weightlifting Federation', domain: 'weightlifting' },
  { code: 'UCI', name: 'Union Cycliste Internationale', domain: 'cycling' },
  { code: 'World Archery', name: 'World Archery Federation', domain: 'archery' },
  { code: 'ISSF', name: 'International Shooting Sport Federation', domain: 'shooting' },
  { code: 'FIS', name: 'International Ski and Snowboard Federation', domain: 'skiing-snowboarding' },
  { code: 'IBU', name: 'International Biathlon Union', domain: 'biathlon' },
  { code: 'IBSF', name: 'International Bobsleigh and Skeleton Federation', domain: 'bobsled-skeleton' },
  { code: 'FIG', name: 'International Gymnastics Federation', domain: 'gymnastics' },
  { code: 'World Rowing', name: 'World Rowing Federation', domain: 'rowing' },
  { code: 'ProRL', name: 'Professional Robotics League', domain: 'humanoid-robotics' },
];

const CODES = new Set(SANCTIONING_BODIES.map(b => b.code));

export function isRecognizedBody(code) {
  if (code === null || code === undefined) return false;
  return CODES.has(code);
}
