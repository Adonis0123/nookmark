import { describe, expect, it } from 'vitest';
import {
  applyChanged,
  applyCreated,
  applyMoved,
  applyRemoved,
} from '@/lib/bookmarks/events';
import { buildSnapshot } from '@/lib/bookmarks/snapshot';
import type { BookmarkTreeNodeInput } from '@/lib/bookmarks/tree';
import type { OpenRecord } from '@/lib/bookmarks/types';
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
                title: 'Figma',
                url: 'https://figma.com',
                dateAdded: 50,
              },
              {
                id: '102',
                title: 'Nested',
                children: [
                  {
                    id: '1021',
                    title: 'Deep',
                    url: 'https://deep.example',
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

const records: OpenRecord[] = [
  { bookmarkId: '101', openedAt: 900, openCount: 3 },
];

function snapshot() {
  return buildSnapshot(tree, records, 1000);
}

describe('applyRemoved', () => {
  it('drops a folder and every descendant Chrome does not notify', () => {
    const next = applyRemoved(snapshot(), '10');
    expect(next.nodes.map((node) => node.id)).toEqual(['0', '1', '11', '2']);
    expect(next.index.map((entry) => entry.id).sort()).toEqual(['11']);
    expect(snapshot().nodes.some((node) => node.id === '10')).toBe(true);
  });

  it('drops only the URL node when a bookmark is removed', () => {
    const next = applyRemoved(snapshot(), '101');
    expect(next.nodes.some((node) => node.id === '101')).toBe(false);
    expect(next.nodes.some((node) => node.id === '1021')).toBe(true);
    expect(next.index.map((entry) => entry.id).sort()).toEqual(['1021', '11']);
  });
});

describe('applyCreated', () => {
  it('inserts a URL under its parent with path, ancestorIds, and pinyin fields', () => {
    const created: BookmarkTreeNodeInput = {
      id: '201',
      parentId: '2',
      title: '设计文档',
      url: 'https://notes.example/doc',
      dateAdded: 70,
    };
    const next = applyCreated(snapshot(), created, records);
    const node = next.nodes.find((item) => item.id === '201');
    expect(node).toMatchObject({
      parentId: '2',
      path: ['Other Bookmarks'],
      ancestorIds: ['2'],
      url: 'https://notes.example/doc',
      isFolder: false,
    });
    expect(next.index.find((entry) => entry.id === '201')).toMatchObject({
      title: haystackForTitle('设计文档'),
      domain: haystackForTitle('notes.example'),
      path: haystackForTitle('Other Bookmarks'),
      ancestorIds: ['2'],
    });
  });

  it('is idempotent when the id already exists', () => {
    const before = snapshot();
    const next = applyCreated(
      before,
      { id: '101', parentId: '10', title: 'Figma', url: 'https://figma.com' },
      records,
    );
    expect(next.nodes.filter((node) => node.id === '101')).toHaveLength(1);
  });
});

describe('applyChanged', () => {
  it('rebuilds title haystacks when a bookmark title changes', () => {
    const next = applyChanged(
      snapshot(),
      '101',
      { title: '设计灵感' },
      records,
    );
    expect(next.nodes.find((node) => node.id === '101')?.title).toBe('设计灵感');
    expect(next.index.find((entry) => entry.id === '101')).toMatchObject({
      title: { raw: '设计灵感', full: 'shejilinggan', initials: 'sjlg' },
      openCount: 3,
      lastOpenedAt: 900,
    });
  });

  it('cascades folder title into descendant path haystacks', () => {
    const next = applyChanged(snapshot(), '10', { title: '设计系统' }, records);
    expect(next.nodes.find((node) => node.id === '101')?.path).toEqual([
      'Bookmarks Bar',
      '设计系统',
    ]);
    expect(next.index.find((entry) => entry.id === '1021')?.path.raw).toBe(
      'Bookmarks Bar/设计系统/Nested',
    );
  });
});

describe('applyMoved', () => {
  it('patches a URL move without touching siblings', () => {
    const next = applyMoved(snapshot(), '101', { parentId: '2' });
    expect(next.nodes.find((node) => node.id === '101')).toMatchObject({
      parentId: '2',
      path: ['Other Bookmarks'],
      ancestorIds: ['2'],
    });
    expect(next.nodes.find((node) => node.id === '1021')?.parentId).toBe('102');
    expect(next.index.find((entry) => entry.id === '101')).toMatchObject({
      ancestorIds: ['2'],
      path: haystackForTitle('Other Bookmarks'),
      openCount: 3,
      lastOpenedAt: 900,
    });
  });

  it('cascades ancestorIds and path for every descendant of a moved folder', () => {
    const next = applyMoved(snapshot(), '10', { parentId: '2' });
    expect(next.nodes.find((node) => node.id === '10')).toMatchObject({
      parentId: '2',
      path: ['Other Bookmarks'],
      ancestorIds: ['2'],
    });
    expect(next.nodes.find((node) => node.id === '101')).toMatchObject({
      parentId: '10',
      path: ['Other Bookmarks', '设计'],
      ancestorIds: ['2', '10'],
    });
    expect(next.nodes.find((node) => node.id === '102')).toMatchObject({
      parentId: '10',
      path: ['Other Bookmarks', '设计'],
      ancestorIds: ['2', '10'],
    });
    expect(next.nodes.find((node) => node.id === '1021')).toMatchObject({
      parentId: '102',
      path: ['Other Bookmarks', '设计', 'Nested'],
      ancestorIds: ['2', '10', '102'],
    });
    expect(next.index.find((entry) => entry.id === '1021')).toMatchObject({
      ancestorIds: ['2', '10', '102'],
      path: haystackForTitle('Other Bookmarks/设计/Nested'),
    });
    expect(next.nodes.find((node) => node.id === '11')).toMatchObject({
      parentId: '1',
      ancestorIds: ['1'],
    });
  });
});
