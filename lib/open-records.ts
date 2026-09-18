import type { BookmarkNode, OpenRecord } from './bookmarks/types';

const OPEN_RECORD_CAP = 200;

export function bumpOpenRecord(
  records: OpenRecord[],
  bookmarkId: string,
  now: number,
): OpenRecord[] {
  const existing = records.find((record) => record.bookmarkId === bookmarkId);
  const next: OpenRecord = existing
    ? {
        bookmarkId,
        openedAt: now,
        openCount: existing.openCount + 1,
      }
    : { bookmarkId, openedAt: now, openCount: 1 };
  return [next, ...records.filter((record) => record.bookmarkId !== bookmarkId)]
    .sort((a, b) => b.openedAt - a.openedAt)
    .slice(0, OPEN_RECORD_CAP);
}

export function clearOpenRecords(): OpenRecord[] {
  return [];
}

export function recentIds(records: OpenRecord[], limit = 3): string[] {
  return [...records]
    .sort((a, b) => b.openedAt - a.openedAt)
    .slice(0, limit)
    .map((record) => record.bookmarkId);
}

export function seedFromDateLastUsed(
  nodes: BookmarkNode[],
  _now: number,
): OpenRecord[] {
  const records: OpenRecord[] = [];
  for (const node of nodes) {
    if (node.isFolder || node.url == null) continue;
    if (node.dateLastUsed != null) {
      records.push({
        bookmarkId: node.id,
        openedAt: node.dateLastUsed,
        openCount: 1,
      });
      continue;
    }
    if (node.dateAdded != null) {
      records.push({
        bookmarkId: node.id,
        openedAt: node.dateAdded,
        openCount: 0,
      });
    }
  }
  return records
    .sort((a, b) => b.openedAt - a.openedAt)
    .slice(0, OPEN_RECORD_CAP);
}
