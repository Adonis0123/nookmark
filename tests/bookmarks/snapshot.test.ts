import { describe, expect, it } from 'vitest';
import {
  buildSnapshot,
  rebuild,
  type SnapshotIo,
} from '@/lib/bookmarks/snapshot';
import type { BookmarkTreeNodeInput } from '@/lib/bookmarks/tree';
import type { OpenRecord, SnapshotState } from '@/lib/bookmarks/types';
import { haystackForTitle } from '@/lib/search/pinyin';

const tree: BookmarkTreeNodeInput[] = [
  {
    id: '0',
    title: '',
    children: [
      {
        id: '1',
        title: 'Bookmarks Bar',
        folderType: 'bookmarks-bar',
        children: [
          {
            id: '10',
            title: '设计',
            children: [
              {
                id: '101',
                title: '设计灵感',
                url: 'https://www.figma.com/file/x',
                dateAdded: 50,
                dateLastUsed: 80,
              },
              {
                id: '102',
                title: 'Nested',
                children: [
                  {
                    id: '1021',
                    title: 'Deep',
                    url: 'https://deep.example/path',
                    dateAdded: 60,
                  },
                ],
              },
            ],
          },
          {
            id: '11',
            title: 'MDN',
            url: 'https://developer.mozilla.org',
            dateAdded: 40,
          },
        ],
      },
      {
        id: '2',
        title: 'Other Bookmarks',
        folderType: 'other',
        children: [],
      },
    ],
  },
];

describe('buildSnapshot', () => {
  it('indexes URL nodes with pinyin haystacks, not folders', () => {
    const snapshot = buildSnapshot(tree, [], 1000);
    expect(snapshot.version).toBe(1);
    expect(snapshot.builtAt).toBe(1000);
    expect(snapshot.index.map((entry) => entry.id).sort()).toEqual([
      '101',
      '1021',
      '11',
    ]);
    expect(snapshot.index.some((entry) => entry.id === '10')).toBe(false);

    const inspiration = snapshot.index.find((entry) => entry.id === '101');
    expect(inspiration).toMatchObject({
      title: haystackForTitle('设计灵感'),
      domain: haystackForTitle('www.figma.com'),
      path: haystackForTitle('Bookmarks Bar/设计'),
      url: 'https://www.figma.com/file/x',
      ancestorIds: ['1', '10'],
      isFolder: false,
      openCount: 0,
      lastOpenedAt: null,
      dateAdded: 50,
    });
    expect(inspiration?.title).toEqual({
      raw: '设计灵感',
      full: 'shejilinggan',
      initials: 'sjlg',
    });
  });

  it('overlays OpenRecord openCount and lastOpenedAt onto index entries', () => {
    const records: OpenRecord[] = [
      { bookmarkId: '101', openedAt: 900, openCount: 4 },
    ];
    const snapshot = buildSnapshot(tree, records, 1000);
    expect(snapshot.index.find((entry) => entry.id === '101')).toMatchObject({
      openCount: 4,
      lastOpenedAt: 900,
    });
    expect(snapshot.index.find((entry) => entry.id === '11')).toMatchObject({
      openCount: 0,
      lastOpenedAt: null,
    });
  });
});

describe('rebuild', () => {
  function io(overrides: Partial<SnapshotIo> & Pick<SnapshotIo, 'getSnapshotState'>): {
    io: SnapshotIo;
    states: SnapshotState[];
    recordWrites: OpenRecord[][];
  } {
    const states: SnapshotState[] = [];
    const recordWrites: OpenRecord[][] = [];
    return {
      states,
      recordWrites,
      io: {
        getTree: async () => tree,
        setSnapshotState: async (state) => {
          states.push(state);
        },
        getOpenRecords: async () => [],
        setOpenRecords: async (records) => {
          recordWrites.push(records);
        },
        now: () => 1000,
        ...overrides,
      },
    };
  }

  it('sets loading on first run when no ok snapshot exists', async () => {
    const { io: deps, states } = io({
      getSnapshotState: async () => ({ status: 'error', snapshot: null }),
    });
    await rebuild(deps);
    expect(states[0]).toEqual({ status: 'loading', snapshot: null });
    const last = states[states.length - 1];
    expect(last?.status).toBe('ok');
    if (last?.status !== 'ok') return;
    expect(last.snapshot.builtAt).toBe(1000);
  });

  it('does not flash loading when an ok snapshot already exists', async () => {
    const existing = buildSnapshot(tree, [], 1);
    const { io: deps, states } = io({
      getSnapshotState: async () => ({ status: 'ok', snapshot: existing }),
    });
    await rebuild(deps);
    expect(states.some((state) => state.status === 'loading')).toBe(false);
    expect(states.at(-1)?.status).toBe('ok');
  });

  it('maps getTree permission failures to permission state', async () => {
    const { io: deps, states } = io({
      getSnapshotState: async () => ({ status: 'loading', snapshot: null }),
      getTree: async () => {
        throw new Error('You do not have permission to use bookmarks.getTree');
      },
    });
    await rebuild(deps);
    expect(states.at(-1)).toEqual({ status: 'permission', snapshot: null });
  });

  it('maps other getTree failures to error state', async () => {
    const { io: deps, states } = io({
      getSnapshotState: async () => ({ status: 'loading', snapshot: null }),
      getTree: async () => {
        throw new Error('getTree failed');
      },
    });
    await rebuild(deps);
    expect(states.at(-1)).toEqual({ status: 'error', snapshot: null });
  });

  it('seeds OpenRecord when local records are empty', async () => {
    const { io: deps, recordWrites, states } = io({
      getSnapshotState: async () => ({ status: 'loading', snapshot: null }),
    });
    await rebuild(deps);
    expect(recordWrites).toHaveLength(1);
    expect(recordWrites[0]?.some((record) => record.bookmarkId === '101')).toBe(
      true,
    );
    const last = states[states.length - 1];
    const snapshot = last?.status === 'ok' ? last.snapshot : null;
    expect(snapshot?.index.find((entry) => entry.id === '101')).toMatchObject({
      openCount: 1,
      lastOpenedAt: 80,
    });
  });

  it('never overwrites non-empty local OpenRecord with seed', async () => {
    const records: OpenRecord[] = [
      { bookmarkId: '11', openedAt: 12, openCount: 9 },
    ];
    const { io: deps, recordWrites, states } = io({
      getSnapshotState: async () => ({ status: 'loading', snapshot: null }),
      getOpenRecords: async () => records,
    });
    await rebuild(deps);
    expect(recordWrites).toEqual([]);
    const last = states[states.length - 1];
    const snapshot = last?.status === 'ok' ? last.snapshot : null;
    expect(snapshot?.index.find((entry) => entry.id === '11')).toMatchObject({
      openCount: 9,
      lastOpenedAt: 12,
    });
    expect(snapshot?.index.find((entry) => entry.id === '101')).toMatchObject({
      openCount: 0,
      lastOpenedAt: null,
    });
  });

  it('does not write OpenRecord when the seed is empty', async () => {
    const emptyTree: BookmarkTreeNodeInput[] = [
      { id: '0', title: '', children: [] },
    ];
    const { io: deps, recordWrites } = io({
      getSnapshotState: async () => ({ status: 'loading', snapshot: null }),
      getTree: async () => emptyTree,
    });
    await rebuild(deps);
    expect(recordWrites).toEqual([]);
  });
});
