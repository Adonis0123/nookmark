import type { OpenRecord, SearchIndexEntry } from '@/lib/bookmarks/types';
import { compactQuery, normalizeQuery } from './normalize';
import {
  CHANNEL_WEIGHT,
  EXACT_INITIALS_BONUS,
  MATCH_TYPE_WEIGHT,
  behaviorBoost,
  lengthPenalty,
  positionBonus,
} from './weights';

export type SearchHit = {
  entry: SearchIndexEntry;
  score: number;
  match: 'raw' | 'pinyin-full' | 'pinyin-initials' | 'latin' | 'domain';
  rawHighlight?: { start: number; end: number };
  pinyinHint?: string;
};

export type SearchIndexOptions = {
  folderId: string | null;
  queryId: number;
  records?: OpenRecord[];
  now?: number;
};

const HAN = /\p{Script=Han}/u;

export function acceptSearchResult<T extends { queryId: number }>(
  latestQueryId: number,
  result: T,
): T | null {
  return result.queryId === latestQueryId ? result : null;
}

export function searchIndex(
  entries: SearchIndexEntry[],
  query: string,
  opts: SearchIndexOptions,
): { queryId: number; hits: SearchHit[] } {
  const q = normalizeQuery(query);
  if (q.length === 0) {
    return { queryId: opts.queryId, hits: [] };
  }

  const now = opts.now ?? Date.now();
  const needles = queryNeedles(q);
  const overlaid = overlayRecords(entries, opts.records);
  const hits: SearchHit[] = [];

  for (const entry of overlaid) {
    if (entry.isFolder || entry.url.length === 0) continue;
    if (opts.folderId != null && !entry.ancestorIds.includes(opts.folderId)) {
      continue;
    }

    const hit = scoreEntry(entry, q, needles, now);
    if (hit) hits.push(hit);
  }

  hits.sort(compareHits);
  return { queryId: opts.queryId, hits };
}

function overlayRecords(
  entries: SearchIndexEntry[],
  records: OpenRecord[] | undefined,
): SearchIndexEntry[] {
  if (!records || records.length === 0) return entries;
  const byId = new Map(records.map((record) => [record.bookmarkId, record]));
  return entries.map((entry) => {
    const record = byId.get(entry.id);
    if (!record) return entry;
    return {
      ...entry,
      openCount: record.openCount,
      lastOpenedAt: record.openedAt,
    };
  });
}

function queryNeedles(q: string): string[] {
  const compact = compactQuery(q);
  if (compact.length === 0 || compact === q) return [q];
  return [q, compact];
}

function scoreEntry(
  entry: SearchIndexEntry,
  q: string,
  needles: string[],
  now: number,
): SearchHit | null {
  const titleNorm = normalizeQuery(entry.title.raw);
  const titleCompact = compactQuery(titleNorm);
  let channelScore = 0;
  let match: SearchHit['match'] | null = null;

  const rawNeedle =
    firstLiteralHit(titleNorm, needles) ??
    firstLiteralHit(titleCompact, needles);

  if (rawNeedle) {
    channelScore +=
      CHANNEL_WEIGHT.title *
      MATCH_TYPE_WEIGHT.raw *
      positionBonus(titleNorm.includes(rawNeedle) ? titleNorm : titleCompact, rawNeedle);
    match = hasHan(q) ? 'raw' : 'latin';
  } else if (orderIndependentHan(titleNorm, q)) {
    channelScore += CHANNEL_WEIGHT.title * MATCH_TYPE_WEIGHT.raw;
    match = 'raw';
  }

  if (shouldScorePinyin(entry.title.raw, entry.title.full, titleCompact)) {
    const fullHit = firstVariantHit(entry.title.full, needles);
    if (fullHit) {
      channelScore +=
        CHANNEL_WEIGHT.title *
        MATCH_TYPE_WEIGHT.pinyinFull *
        positionBonus(fullHit.haystack, fullHit.needle);
      match ??= 'pinyin-full';
    }
  }

  if (shouldScorePinyin(entry.title.raw, entry.title.initials, titleCompact)) {
    const initialsHit = firstVariantHit(entry.title.initials, needles);
    if (initialsHit) {
      const exact = initialsHit.haystack === initialsHit.needle;
      channelScore +=
        CHANNEL_WEIGHT.title *
        MATCH_TYPE_WEIGHT.pinyinInitials *
        positionBonus(initialsHit.haystack, initialsHit.needle) *
        (exact ? EXACT_INITIALS_BONUS : 1);
      match ??= 'pinyin-initials';
    }
  }

  const domainHit = scoreDomain(entry, needles);
  if (domainHit > 0) {
    channelScore += domainHit;
    match ??= 'domain';
  }

  if (match == null || channelScore <= 0) return null;

  const score =
    channelScore *
    behaviorBoost(entry.openCount, entry.lastOpenedAt, now) *
    lengthPenalty(entry.title.raw.length, q.length);

  const hit: SearchHit = { entry, score, match };
  if (match === 'raw' || match === 'latin') {
    const highlight = rawHighlight(entry.title.raw, needles);
    if (highlight) hit.rawHighlight = highlight;
  }
  if (match === 'pinyin-full' || match === 'pinyin-initials') {
    hit.pinyinHint = `${compactQuery(q) || q} → ${entry.title.raw}`;
  }
  return hit;
}

function scoreDomain(entry: SearchIndexEntry, needles: string[]): number {
  const domainNorm = normalizeQuery(entry.domain.raw);
  const domainCompact = compactQuery(domainNorm);
  const rawNeedle =
    firstLiteralHit(domainNorm, needles) ??
    firstLiteralHit(domainCompact, needles);
  if (rawNeedle) {
    const haystack = domainNorm.includes(rawNeedle) ? domainNorm : domainCompact;
    return (
      CHANNEL_WEIGHT.domain *
      MATCH_TYPE_WEIGHT.raw *
      positionBonus(haystack, rawNeedle)
    );
  }

  const fullHit = firstVariantHit(entry.domain.full, needles);
  if (fullHit) {
    return (
      CHANNEL_WEIGHT.domain *
      MATCH_TYPE_WEIGHT.pinyinFull *
      positionBonus(fullHit.haystack, fullHit.needle)
    );
  }

  const initialsHit = firstVariantHit(entry.domain.initials, needles);
  if (initialsHit) {
    return (
      CHANNEL_WEIGHT.domain *
      MATCH_TYPE_WEIGHT.pinyinInitials *
      positionBonus(initialsHit.haystack, initialsHit.needle)
    );
  }

  return 0;
}

function shouldScorePinyin(
  raw: string,
  haystack: string,
  titleCompact: string,
): boolean {
  if (haystack.length === 0) return false;
  return hasHan(raw) || haystack !== titleCompact;
}

function orderIndependentHan(titleNorm: string, q: string): boolean {
  if (!hasHan(q)) return false;
  for (const ch of q) {
    if (ch === ' ') continue;
    if (!titleNorm.includes(ch)) return false;
  }
  return true;
}

function firstLiteralHit(haystack: string, needles: string[]): string | null {
  for (const needle of needles) {
    if (needle.length > 0 && haystack.includes(needle)) return needle;
  }
  return null;
}

function firstVariantHit(
  field: string,
  needles: string[],
): { haystack: string; needle: string } | null {
  for (const variant of field.split('|')) {
    if (variant.length === 0) continue;
    const needle = firstLiteralHit(variant, needles);
    if (needle) return { haystack: variant, needle };
  }
  return null;
}

function rawHighlight(
  titleRaw: string,
  needles: string[],
): { start: number; end: number } | undefined {
  const lower = titleRaw.toLowerCase();
  for (const needle of needles) {
    if (needle.length === 0) continue;
    const index = lower.indexOf(needle);
    if (index >= 0) return { start: index, end: index + needle.length };
  }
  return undefined;
}

function hasHan(value: string): boolean {
  return HAN.test(value);
}

function compareHits(a: SearchHit, b: SearchHit): number {
  if (b.score !== a.score) return b.score - a.score;
  if (b.entry.openCount !== a.entry.openCount) {
    return b.entry.openCount - a.entry.openCount;
  }
  return b.entry.dateAdded - a.entry.dateAdded;
}
