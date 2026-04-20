export const SANCTIONING_BODIES = [
  { code: 'World Athletics', name: 'World Athletics', domain: 'track-and-field', tier: 'governing' },
  { code: 'FINA', name: 'World Aquatics (FINA)', domain: 'swimming-diving', tier: 'governing' },
  { code: 'ISU', name: 'International Skating Union', domain: 'speed-skating-short-track', tier: 'governing' },
  { code: 'IWF', name: 'International Weightlifting Federation', domain: 'weightlifting', tier: 'governing' },
  { code: 'UCI', name: 'Union Cycliste Internationale', domain: 'cycling', tier: 'governing' },
  { code: 'World Archery', name: 'World Archery Federation', domain: 'archery', tier: 'governing' },
  { code: 'ISSF', name: 'International Shooting Sport Federation', domain: 'shooting', tier: 'governing' },
  { code: 'FIS', name: 'International Ski and Snowboard Federation', domain: 'skiing-snowboarding', tier: 'governing' },
  { code: 'IBU', name: 'International Biathlon Union', domain: 'biathlon', tier: 'governing' },
  { code: 'IBSF', name: 'International Bobsleigh and Skeleton Federation', domain: 'bobsled-skeleton', tier: 'governing' },
  { code: 'FIG', name: 'International Gymnastics Federation', domain: 'gymnastics', tier: 'governing' },
  { code: 'World Rowing', name: 'World Rowing Federation', domain: 'rowing', tier: 'governing' },
  { code: 'ProRL', name: 'Professional Robotics League', domain: 'humanoid-robotics', tier: 'league' },
  // Event-organizer citations: not governing bodies, but used when the event itself is the citation source.
  // Submissions sourced from these may still be ineligible if conditions did not match a governing body's regulations.
  { code: 'Beijing E-Town Half Marathon', name: 'Beijing E-Town Humanoid Half Marathon', domain: 'humanoid-robotics', tier: 'event-organizer' },
];

const CODES = new Set(SANCTIONING_BODIES.map(b => b.code));

export function isRecognizedBody(code) {
  if (code === null || code === undefined) return false;
  return CODES.has(code);
}
