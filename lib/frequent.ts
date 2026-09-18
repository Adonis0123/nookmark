import type { BookmarkNode, OpenRecord } from './bookmarks/types';
import { bookmarksBarUrls } from './bookmarks/tree';

const FREQUENT_LIMIT = 8;
const RECENCY_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export function frequentIds(
  records: OpenRecord[],
  nodes: BookmarkNode[],
  now: number,
): string[] {
  const urlIds = new Set(
    nodes.filter((node) => !node.isFolder && node.url != null).map((node) => node.id),
  );
  if (urlIds.size === 0) return [];
  if (records.length === 0) {
    return bookmarksBarUrls(nodes).map((node) => node.id);
  }

  return records
    .filter((record) => urlIds.has(record.bookmarkId))
    .map((record) => ({
      id: record.bookmarkId,
      score: record.openCount * recencyDecay(record.openedAt, now),
      openCount: record.openCount,
      openedAt: record.openedAt,
    }))
    .sort(
      (a, b) =>
        b.score - a.score || b.openCount - a.openCount || b.openedAt - a.openedAt,
    )
    .slice(0, FREQUENT_LIMIT)
    .map((entry) => entry.id);
}

function recencyDecay(openedAt: number, now: number): number {
  const age = Math.max(0, now - openedAt);
  return Math.exp(-age / RECENCY_WINDOW_MS);
}
