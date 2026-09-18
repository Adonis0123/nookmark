import { describe, expect, it } from 'vitest';
import type { BookmarkNode, OpenRecord } from '@/lib/bookmarks/types';
import {
  bumpOpenRecord,
  clearOpenRecords,
  recentIds,
  seedFromDateLastUsed,
} from '@/lib/open-records';

function urlNode(
  overrides: Partial<BookmarkNode> & Pick<BookmarkNode, 'id' | 'title'>,
): BookmarkNode {
  return {
    parentId: '1',
    isFolder: false,
    path: [],
    ancestorIds: ['1'],
    url: `https://example.com/${overrides.id}`,
    ...overrides,
  };
}

describe('bumpOpenRecord', () => {
  it('moves a bumped bookmark to the front and increments openCount', () => {
    const records: OpenRecord[] = [
      { bookmarkId: 'a', openedAt: 10, openCount: 1 },
      { bookmarkId: 'b', openedAt: 20, openCount: 2 },
    ];
    const next = bumpOpenRecord(records, 'a', 30);
    expect(next.map((r) => r.bookmarkId)).toEqual(['a', 'b']);
    expect(next[0]).toEqual({ bookmarkId: 'a', openedAt: 30, openCount: 2 });
    expect(records[0]?.openedAt).toBe(10);
  });

  it('inserts a new record with openCount 1', () => {
    const next = bumpOpenRecord([], 'x', 5);
    expect(next).toEqual([{ bookmarkId: 'x', openedAt: 5, openCount: 1 }]);
  });

  it('caps at 200 records, dropping the oldest', () => {
    const records: OpenRecord[] = Array.from({ length: 200 }, (_, i) => ({
      bookmarkId: `id-${i}`,
      openedAt: i,
      openCount: 1,
    }));
    const next = bumpOpenRecord(records, 'fresh', 1000);
    expect(next).toHaveLength(200);
    expect(next[0]?.bookmarkId).toBe('fresh');
    expect(next.some((r) => r.bookmarkId === 'id-0')).toBe(false);
    expect(next.some((r) => r.bookmarkId === 'id-1')).toBe(true);
  });
});

describe('clearOpenRecords', () => {
  it('returns an empty list', () => {
    expect(clearOpenRecords()).toEqual([]);
  });
});

describe('recentIds', () => {
  it('returns the 3 most recently opened ids', () => {
    const records: OpenRecord[] = [
      { bookmarkId: 'a', openedAt: 1, openCount: 1 },
      { bookmarkId: 'c', openedAt: 3, openCount: 1 },
      { bookmarkId: 'b', openedAt: 2, openCount: 1 },
      { bookmarkId: 'd', openedAt: 4, openCount: 1 },
    ];
    expect(recentIds(records)).toEqual(['d', 'c', 'b']);
    expect(recentIds(records, 1)).toEqual(['d']);
  });
});

describe('seedFromDateLastUsed', () => {
  const now = 1_000_000;

  it('maps URL nodes with dateLastUsed to openCount 1', () => {
    const nodes = [
      urlNode({ id: 'a', title: 'A', dateLastUsed: 80, dateAdded: 10 }),
      urlNode({ id: 'b', title: 'B', dateLastUsed: 40, dateAdded: 20 }),
    ];
    expect(seedFromDateLastUsed(nodes, now)).toEqual([
      { bookmarkId: 'a', openedAt: 80, openCount: 1 },
      { bookmarkId: 'b', openedAt: 40, openCount: 1 },
    ]);
  });

  it('falls back to dateAdded with openCount 0 when dateLastUsed is missing', () => {
    const nodes = [
      urlNode({ id: 'a', title: 'A', dateAdded: 50 }),
      urlNode({ id: 'b', title: 'B', dateAdded: 90 }),
      {
        id: 'folder',
        parentId: '0',
        title: 'F',
        isFolder: true,
        path: [],
        ancestorIds: [],
        dateAdded: 999,
      },
    ];
    expect(seedFromDateLastUsed(nodes, now)).toEqual([
      { bookmarkId: 'b', openedAt: 90, openCount: 0 },
      { bookmarkId: 'a', openedAt: 50, openCount: 0 },
    ]);
  });

  it('mixes dateLastUsed and dateAdded per node and caps at 200', () => {
    const nodes = Array.from({ length: 210 }, (_, i) =>
      urlNode({
        id: `id-${i}`,
        title: `T${i}`,
        dateAdded: i,
        ...(i >= 200 ? { dateLastUsed: 1000 + i } : {}),
      }),
    );
    const seeded = seedFromDateLastUsed(nodes, now);
    expect(seeded).toHaveLength(200);
    expect(seeded[0]).toEqual({
      bookmarkId: 'id-209',
      openedAt: 1209,
      openCount: 1,
    });
    expect(seeded.every((r) => r.openCount === 1 || r.openCount === 0)).toBe(
      true,
    );
  });
});
