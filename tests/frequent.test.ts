import { describe, expect, it } from 'vitest';
import type { BookmarkNode, OpenRecord } from '@/lib/bookmarks/types';
import { frequentIds } from '@/lib/frequent';

const DAY = 24 * 60 * 60 * 1000;
const now = 30 * DAY;

function urlNode(
  id: string,
  extra: Partial<BookmarkNode> = {},
): BookmarkNode {
  return {
    id,
    parentId: extra.parentId ?? '1',
    title: extra.title ?? id,
    url: extra.url ?? `https://example.com/${id}`,
    isFolder: false,
    path: extra.path ?? ['Bookmarks Bar'],
    ancestorIds: extra.ancestorIds ?? ['1'],
    ...extra,
  };
}

const bar: BookmarkNode = {
  id: '1',
  parentId: '0',
  title: 'Bookmarks Bar',
  isFolder: true,
  folderType: 'bookmarks-bar',
  path: [],
  ancestorIds: [],
};

describe('frequentIds', () => {
  it('ranks higher openCount first when recency is similar', () => {
    const records: OpenRecord[] = [
      { bookmarkId: 'a', openedAt: now - DAY, openCount: 8 },
      { bookmarkId: 'b', openedAt: now - DAY, openCount: 2 },
    ];
    const nodes = [bar, urlNode('a'), urlNode('b')];
    expect(frequentIds(records, nodes, now)).toEqual(['a', 'b']);
  });

  it('returns bookmarks-bar URLs when records are empty', () => {
    const nodes = [
      bar,
      urlNode('nested', {
        parentId: '10',
        ancestorIds: ['1', '10'],
        path: ['Bookmarks Bar', '设计'],
      }),
      urlNode('one'),
      urlNode('two'),
    ];
    expect(frequentIds([], nodes, now)).toEqual(['one', 'two']);
  });

  it('returns an empty list when there are no URL nodes', () => {
    expect(frequentIds([], [bar], now)).toEqual([]);
    expect(
      frequentIds(
        [{ bookmarkId: 'gone', openedAt: now, openCount: 4 }],
        [bar],
        now,
      ),
    ).toEqual([]);
  });

  it('drops records whose bookmark no longer exists and keeps top 8', () => {
    const records: OpenRecord[] = Array.from({ length: 10 }, (_, i) => ({
      bookmarkId: `id-${i}`,
      openedAt: now - i * DAY,
      openCount: 10 - i,
    }));
    records.push({ bookmarkId: 'missing', openedAt: now, openCount: 99 });
    const nodes = [
      bar,
      ...Array.from({ length: 10 }, (_, i) => urlNode(`id-${i}`)),
    ];
    expect(frequentIds(records, nodes, now)).toEqual(
      Array.from({ length: 8 }, (_, i) => `id-${i}`),
    );
  });
});
