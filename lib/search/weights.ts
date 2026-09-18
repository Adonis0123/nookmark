export const CHANNEL_WEIGHT = {
  title: 1,
  domain: 0.7,
  path: 0.45,
  url: 0.3,
} as const;

export const MATCH_TYPE_WEIGHT = {
  raw: 1,
  pinyinFull: 0.75,
  pinyinInitials: 0.6,
} as const;

export const POSITION_PREFIX = 1.3;
export const POSITION_WORD_START = 1.15;
export const POSITION_MIDDLE = 1;
export const EXACT_INITIALS_BONUS = 1.2;

export const BEHAVIOR_OPEN_COUNT_FACTOR = 0.15;
export const BEHAVIOR_BOOST_CAP = 1.6;
export const RECENCY_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
export const RECENCY_WEIGHT = 0.2;

export const LENGTH_PENALTY_RATIO = 6;
export const LENGTH_PENALTY_FACTOR = 0.9;

const WORD_START_CHARS = new Set([' ', '-', '.', '/', '_', ':']);

export function positionBonus(haystack: string, query: string): number {
  const index = haystack.indexOf(query);
  if (index < 0) return POSITION_MIDDLE;
  if (index === 0) return POSITION_PREFIX;
  const prev = haystack.charAt(index - 1);
  if (WORD_START_CHARS.has(prev)) return POSITION_WORD_START;
  return POSITION_MIDDLE;
}

export function behaviorBoost(
  openCount: number,
  lastOpenedAt: number | null,
  now: number,
): number {
  const recency =
    lastOpenedAt == null
      ? 0
      : Math.max(0, 1 - (now - lastOpenedAt) / RECENCY_WINDOW_MS) *
        RECENCY_WEIGHT;
  const boost =
    1 +
    Math.log10(1 + Math.max(0, openCount)) * BEHAVIOR_OPEN_COUNT_FACTOR +
    recency;
  return Math.min(BEHAVIOR_BOOST_CAP, boost);
}

export function lengthPenalty(titleLength: number, queryLength: number): number {
  if (queryLength <= 0) return 1;
  return titleLength > queryLength * LENGTH_PENALTY_RATIO
    ? LENGTH_PENALTY_FACTOR
    : 1;
}
