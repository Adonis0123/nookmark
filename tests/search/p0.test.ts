import { describe, expect, it } from 'vitest';
import type { OpenRecord, SearchIndexEntry } from '@/lib/bookmarks/types';
import { haystackForTitle } from '@/lib/search/pinyin';
import {
  acceptSearchResult,
  searchIndex,
} from '@/lib/search/match';

function entry(input: {
  id: string;
  title: string;
  url: string;
  ancestorIds?: string[];
  isFolder?: boolean;
  openCount?: number;
  lastOpenedAt?: number | null;
  dateAdded?: number;
  path?: string;
}): SearchIndexEntry {
  const hostname = (() => {
    try {
      return new URL(input.url).hostname;
    } catch {
      return '';
    }
  })();

  return {
    id: input.id,
    title: haystackForTitle(input.title),
    domain: haystackForTitle(hostname),
    path: haystackForTitle(input.path ?? ''),
    url: input.url,
    ancestorIds: input.ancestorIds ?? [],
    isFolder: input.isFolder ?? false,
    openCount: input.openCount ?? 0,
    lastOpenedAt: input.lastOpenedAt ?? null,
    dateAdded: input.dateAdded ?? 0,
  };
}

const fixture: SearchIndexEntry[] = [
  entry({
    id: 'design',
    title: '设计灵感',
    url: 'https://example.com/x',
    ancestorIds: ['10'],
    dateAdded: 1,
  }),
  entry({
    id: 'figma',
    title: 'Figma',
    url: 'https://www.figma.com',
    ancestorIds: ['1'],
    dateAdded: 2,
  }),
  entry({
    id: 'dribbble-a',
    title: 'Shot A',
    url: 'https://dribbble.com/shots/a',
    dateAdded: 3,
  }),
  entry({
    id: 'dribbble-b',
    title: 'Shot B',
    url: 'https://dribbble.com/shots/b',
    dateAdded: 4,
  }),
  entry({
    id: 'dribbble-c',
    title: 'Shot C',
    url: 'https://dribbble.com/shots/c',
    dateAdded: 5,
  }),
  entry({
    id: 'coincidental-initials',
    title: '设计栏杆工艺',
    url: 'https://example.com/rail',
    dateAdded: 6,
  }),
  entry({
    id: 'sheji-docs',
    title: 'Sheji Docs',
    url: 'https://example.com/sheji',
    dateAdded: 7,
  }),
  entry({
    id: 'folder',
    title: '设计',
    url: '',
    isFolder: true,
    dateAdded: 8,
  }),
];

const opts = { folderId: null, queryId: 1 };

describe('P0 seven channels', () => {
  it.each([
    ['设计', '设计灵感'],
    ['灵感', '设计灵感'],
    ['灵感设计', '设计灵感'],
    ['sheji', '设计灵感'],
    ['shejilinggan', '设计灵感'],
    ['sj', '设计灵感'],
    ['sjlg', '设计灵感'],
    ['figma', 'Figma'],
    ['FIGMA', 'Figma'],
    ['FigMa', 'Figma'],
    ['Ｆｉｇｍａ', 'Figma'],
    ['figma ', 'Figma'],
    ['fig ma', 'Figma'],
  ])('P0 %s hits %s', (q, title) => {
    const hits = searchIndex(fixture, q, opts);
    expect(hits.queryId).toBe(1);
    expect(hits.hits.some((h) => h.entry.title.raw === title)).toBe(true);
  });

  it('domain dribbble hits all three (T-09)', () => {
    const hits = searchIndex(fixture, 'dribbble', opts);
    const ids = hits.hits.map((h) => h.entry.id);
    expect(ids).toEqual(
      expect.arrayContaining(['dribbble-a', 'dribbble-b', 'dribbble-c']),
    );
    expect(hits.hits.filter((h) => h.entry.id.startsWith('dribbble-'))).toHaveLength(
      3,
    );
  });

  it('does not throw on regex metacharacters, emoji, or a long string (T-20)', () => {
    const queries = [
      '"',
      '\\',
      '.*+?^${}()[]|',
      '🚀',
      'a'.repeat(500),
    ];
    for (const q of queries) {
      expect(() => searchIndex(fixture, q, opts)).not.toThrow();
      const hits = searchIndex(fixture, q, opts);
      expect(Array.isArray(hits.hits)).toBe(true);
    }
  });

  it('treats regex metacharacters as literals', () => {
    const hits = searchIndex(fixture, 'fig.a', opts);
    expect(hits.hits.some((h) => h.entry.title.raw === 'Figma')).toBe(false);
  });

  it('T-07 sjlg ranks exact-initials above coincidental pinyin', () => {
    const hits = searchIndex(fixture, 'sjlg', opts);
    const titles = hits.hits.map((h) => h.entry.title.raw);
    const exact = titles.indexOf('设计灵感');
    const coincidental = titles.indexOf('设计栏杆工艺');
    expect(exact).toBeGreaterThanOrEqual(0);
    expect(coincidental).toBeGreaterThanOrEqual(0);
    expect(exact).toBeLessThan(coincidental);
    expect(hits.hits[exact]?.match).toBe('pinyin-initials');
  });

  it('raw match outranks pinyin-only on the same query', () => {
    const hits = searchIndex(fixture, 'sheji', opts);
    const titles = hits.hits.map((h) => h.entry.title.raw);
    const raw = titles.indexOf('Sheji Docs');
    const pinyinOnly = titles.indexOf('设计灵感');
    expect(raw).toBeGreaterThanOrEqual(0);
    expect(pinyinOnly).toBeGreaterThanOrEqual(0);
    expect(raw).toBeLessThan(pinyinOnly);
    expect(hits.hits[raw]?.match === 'raw' || hits.hits[raw]?.match === 'latin').toBe(
      true,
    );
    expect(hits.hits[pinyinOnly]?.match).toBe('pinyin-full');
  });

  it('returns no hits for an empty query', () => {
    expect(searchIndex(fixture, '   ', opts).hits).toEqual([]);
  });

  it('skips folder entries', () => {
    const hits = searchIndex(fixture, '设计', opts);
    expect(hits.hits.some((h) => h.entry.id === 'folder')).toBe(false);
  });

  it('ANDs a Folder chip via ancestorIds', () => {
    const hits = searchIndex(fixture, '设计', { folderId: '10', queryId: 1 });
    expect(hits.hits.map((h) => h.entry.id)).toEqual(['design']);
  });

  it('overlays live OpenRecord onto scoring', () => {
    const twins: SearchIndexEntry[] = [
      entry({
        id: 'a',
        title: '设计灵感',
        url: 'https://example.com/a',
        dateAdded: 1,
      }),
      entry({
        id: 'b',
        title: '设计灵感',
        url: 'https://example.com/b',
        dateAdded: 99,
      }),
    ];
    const records: OpenRecord[] = [
      { bookmarkId: 'a', openedAt: 1_000, openCount: 40 },
    ];
    const hits = searchIndex(twins, '设计', {
      folderId: null,
      queryId: 7,
      records,
    });
    expect(hits.hits[0]?.entry.id).toBe('a');
    expect(hits.hits[0]?.entry.openCount).toBe(40);
    expect(hits.hits[0]?.entry.lastOpenedAt).toBe(1_000);
  });

  it('does not map traditional Han in P0 (T-16 is P1)', () => {
    const hits = searchIndex(fixture, '設計', opts);
    expect(hits.hits.some((h) => h.entry.title.raw === '设计灵感')).toBe(false);
  });
});

describe('acceptSearchResult (T-22 helper)', () => {
  it('keeps the result when queryId matches the latest', () => {
    const result = { queryId: 2, hits: [] };
    expect(acceptSearchResult(2, result)).toBe(result);
  });

  it('drops a stale result when queryId does not match', () => {
    expect(acceptSearchResult(2, { queryId: 1, hits: ['old'] })).toBeNull();
  });
});

describe('haystackForTitle', () => {
  it('builds no-tone full pinyin and initials', () => {
    expect(haystackForTitle('设计灵感')).toMatchObject({
      raw: '设计灵感',
      full: 'shejilinggan',
      initials: 'sjlg',
    });
  });
});
