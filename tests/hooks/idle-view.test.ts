import { describe, expect, it } from 'vitest';
import type { BookmarkNode, OpenRecord, SnapshotState } from '@/lib/bookmarks/types';
import { flattenTree } from '@/lib/bookmarks/tree';
import { selectIdleView } from '@/hooks/idle-view';

const tree = [
  {
    id: '0',
    title: '',
    children: [
      {
        id: '1',
        title: 'Bookmarks Bar',
        folderType: 'bookmarks-bar' as const,
        children: [
          {
            id: '10',
            title: '设计',
            children: [
              { id: '101', title: 'Figma', url: 'https://figma.com', dateAdded: 10 },
            ],
          },
          { id: '11', title: 'MDN', url: 'https://developer.mozilla.org', dateAdded: 11 },
        ],
      },
      {
        id: '2',
        title: 'Other Bookmarks',
        folderType: 'other' as const,
        children: [],
      },
    ],
  },
];

const now = 1_000_000;

function ok(nodes: BookmarkNode[]): SnapshotState {
  return {
    status: 'ok',
    snapshot: { version: 1, builtAt: 0, nodes, index: [] },
  };
}

describe('selectIdleView', () => {
  it('maps loading / permission / error without spinning as empty', () => {
    expect(
      selectIdleView({ status: 'loading', snapshot: null }, [], null, now).status,
    ).toBe('loading');
    expect(
      selectIdleView({ status: 'permission', snapshot: null }, [], null, now)
        .status,
    ).toBe('permission');
    expect(
      selectIdleView({ status: 'error', snapshot: null }, [], null, now).status,
    ).toBe('error');
  });

  it('is empty when the snapshot has no URL nodes', () => {
    const nodes = flattenTree([
      {
        id: '0',
        title: '',
        children: [
          {
            id: '1',
            title: 'Bookmarks Bar',
            folderType: 'bookmarks-bar',
            children: [{ id: '10', title: '设计', children: [] }],
          },
        ],
      },
    ]);
    const view = selectIdleView(ok(nodes), [], null, now);
    expect(view.status).toBe('empty');
    expect(view.bookmarkCount).toBe(0);
    expect(view.frequent).toEqual([]);
    expect(view.recent).toEqual([]);
    expect(view.folderRows).toBeNull();
    expect(view.chips.map((c) => c.title)).toEqual(['全部', '设计']);
  });

  it('hides chips when there are no user folders', () => {
    const nodes = flattenTree([
      {
        id: '0',
        title: '',
        children: [
          {
            id: '1',
            title: 'Bookmarks Bar',
            folderType: 'bookmarks-bar',
            children: [
              { id: '11', title: 'MDN', url: 'https://developer.mozilla.org' },
            ],
          },
        ],
      },
    ]);
    expect(selectIdleView(ok(nodes), [], null, now).chips).toEqual([]);
  });

  it('prepends 全部 when user folders exist and lists bar fallback as 常用', () => {
    const nodes = flattenTree(tree);
    const view = selectIdleView(ok(nodes), [], null, now);
    expect(view.status).toBe('ready');
    expect(view.bookmarkCount).toBe(2);
    expect(view.chips.map((c) => c.title)).toEqual(['全部', '设计']);
    expect(view.frequent.map((item) => item.id)).toEqual(['11']);
    expect(view.recent).toEqual([]);
    expect(view.folderRows).toBeNull();
  });

  it('builds 常用 and 最近 from OpenRecord when folderId is null', () => {
    const nodes = flattenTree(tree);
    const records: OpenRecord[] = [
      { bookmarkId: '101', openedAt: now - 10, openCount: 4 },
      { bookmarkId: '11', openedAt: now - 50, openCount: 1 },
    ];
    const view = selectIdleView(ok(nodes), records, null, now);
    expect(view.frequent.map((item) => item.id)).toEqual(['101', '11']);
    expect(view.recent).toEqual([
      {
        id: '101',
        title: 'Figma',
        url: 'https://figma.com',
        openedAt: now - 10,
      },
      {
        id: '11',
        title: 'MDN',
        url: 'https://developer.mozilla.org',
        openedAt: now - 50,
      },
    ]);
  });

  it('replaces 常用/最近 with descendant rows when a Folder chip is selected', () => {
    const nodes = flattenTree(tree);
    const records: OpenRecord[] = [
      { bookmarkId: '11', openedAt: now, openCount: 9 },
    ];
    const view = selectIdleView(ok(nodes), records, '10', now);
    expect(view.frequent).toEqual([]);
    expect(view.recent).toEqual([]);
    expect(view.folderRows?.map((row) => row.id)).toEqual(['101']);
    expect(view.chips[0]?.id).toBeNull();
  });

  it('drops recent ids whose Bookmark no longer exists', () => {
    const nodes = flattenTree(tree);
    const records: OpenRecord[] = [
      { bookmarkId: 'gone', openedAt: now, openCount: 3 },
      { bookmarkId: '101', openedAt: now - 1, openCount: 1 },
    ];
    const view = selectIdleView(ok(nodes), records, null, now);
    expect(view.recent.map((row) => row.id)).toEqual(['101']);
  });

  it('marks managed URL nodes so the UI can show a lock cue', () => {
    const nodes = flattenTree(tree).map((node) =>
      node.id === '101' ? { ...node, unmodifiable: 'managed' as const } : node,
    );
    const view = selectIdleView(
      ok(nodes),
      [{ bookmarkId: '101', openedAt: now, openCount: 1 }],
      '10',
      now,
    );
    expect(view.folderRows?.[0]?.unmodifiable).toBe('managed');
  });

  it('sets syncingAll only when every URL node is syncing', () => {
    const nodes = flattenTree(tree).map((node) =>
      node.isFolder ? node : { ...node, syncing: true },
    );
    expect(selectIdleView(ok(nodes), [], null, now).syncingAll).toBe(true);
    const mixed = flattenTree(tree).map((node) =>
      node.id === '101' ? { ...node, syncing: true } : node,
    );
    expect(selectIdleView(ok(mixed), [], null, now).syncingAll).toBeNull();
  });
});
