import { describe, expect, it } from 'vitest';
import {
  bookmarksBarUrls,
  descendantsOf,
  flattenTree,
  folderFilterChips,
  idleChips,
  otherBookmarksFolder,
} from '@/lib/bookmarks/tree';

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
              { id: '101', title: 'Figma', url: 'https://figma.com' },
            ],
          },
          { id: '11', title: 'MDN', url: 'https://developer.mozilla.org' },
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

describe('flattenTree', () => {
  it('walks folders and URL nodes with path and ancestorIds', () => {
    const nodes = flattenTree(tree);
    const figma = nodes.find((n) => n.id === '101');
    expect(figma).toMatchObject({
      id: '101',
      parentId: '10',
      title: 'Figma',
      url: 'https://figma.com',
      isFolder: false,
      path: ['Bookmarks Bar', '设计'],
      ancestorIds: ['1', '10'],
    });

    const design = nodes.find((n) => n.id === '10');
    expect(design).toMatchObject({
      isFolder: true,
      parentId: '1',
      path: ['Bookmarks Bar'],
      ancestorIds: ['1'],
    });

    const bar = nodes.find((n) => n.id === '1');
    expect(bar).toMatchObject({
      isFolder: true,
      folderType: 'bookmarks-bar',
      parentId: '0',
      path: [],
      ancestorIds: [],
    });
  });

  it('copies optional chrome fields when present', () => {
    const nodes = flattenTree([
      {
        id: '0',
        title: '',
        children: [
          {
            id: '9',
            title: 'Managed',
            folderType: 'managed',
            unmodifiable: 'managed',
            syncing: true,
            dateAdded: 10,
            dateLastUsed: 20,
            children: [],
          },
        ],
      },
    ]);
    expect(nodes.find((n) => n.id === '9')).toMatchObject({
      folderType: 'managed',
      unmodifiable: 'managed',
      syncing: true,
      dateAdded: 10,
      dateLastUsed: 20,
      isFolder: true,
    });
  });
});

describe('folderFilterChips', () => {
  it('lists 设计 as a chip and not Bookmarks Bar', () => {
    const nodes = flattenTree(tree);
    const chips = folderFilterChips(nodes);
    expect(chips.map((n) => n.title)).toEqual(['设计']);
  });

  it('includes immediate folders of other and mobile, not the special roots', () => {
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
          {
            id: '2',
            title: 'Other Bookmarks',
            folderType: 'other',
            children: [{ id: '20', title: '归档', children: [] }],
          },
          {
            id: '3',
            title: 'Mobile Bookmarks',
            folderType: 'mobile',
            children: [{ id: '30', title: '路上', children: [] }],
          },
        ],
      },
    ]);
    expect(folderFilterChips(nodes).map((n) => n.title)).toEqual([
      '设计',
      '归档',
      '路上',
    ]);
  });
});

describe('idleChips', () => {
  it('prepends 全部 only when user folders exist', () => {
    const nodes = flattenTree(tree);
    expect(idleChips(nodes).map((c) => c.title)).toEqual(['全部', '设计']);
    expect(idleChips([]).length).toBe(0);
  });

  it('hides the row when the tree has special roots but no user folders', () => {
    const nodes = flattenTree([
      {
        id: '0',
        title: '',
        children: [
          {
            id: '1',
            title: 'Bookmarks Bar',
            folderType: 'bookmarks-bar',
            children: [{ id: '11', title: 'MDN', url: 'https://developer.mozilla.org' }],
          },
          { id: '2', title: 'Other Bookmarks', folderType: 'other', children: [] },
        ],
      },
    ]);
    expect(idleChips(nodes)).toEqual([]);
  });
});

describe('otherBookmarksFolder', () => {
  it('finds Other Bookmarks by folderType, not id', () => {
    const nodes = flattenTree(tree);
    expect(otherBookmarksFolder(nodes)?.folderType).toBe('other');
  });

  it('does not treat id 2 as Other Bookmarks without folderType', () => {
    const nodes = flattenTree([
      {
        id: '0',
        title: '',
        children: [
          { id: '2', title: 'Looks like other', children: [] },
          {
            id: '99',
            title: 'Real Other',
            folderType: 'other',
            children: [],
          },
        ],
      },
    ]);
    const folder = otherBookmarksFolder(nodes);
    expect(folder?.id).toBe('99');
    expect(folder?.title).toBe('Real Other');
  });
});

describe('descendantsOf', () => {
  it('descendant list of 设计 includes Figma and not MDN', () => {
    const nodes = flattenTree(tree);
    const rows = descendantsOf(nodes, '10');
    expect(rows.map((n) => n.id)).toEqual(['101']);
  });
});

describe('bookmarksBarUrls', () => {
  it('returns direct URL children of the bar in tree order, max 8', () => {
    const children = [
      { id: '10', title: '设计', children: [{ id: '101', title: 'Figma', url: 'https://figma.com' }] },
      { id: '11', title: 'One', url: 'https://one.example' },
      { id: '12', title: 'Two', url: 'https://two.example' },
      { id: '13', title: 'Three', url: 'https://three.example' },
      { id: '14', title: 'Four', url: 'https://four.example' },
      { id: '15', title: 'Five', url: 'https://five.example' },
      { id: '16', title: 'Six', url: 'https://six.example' },
      { id: '17', title: 'Seven', url: 'https://seven.example' },
      { id: '18', title: 'Eight', url: 'https://eight.example' },
      { id: '19', title: 'Nine', url: 'https://nine.example' },
    ];
    const nodes = flattenTree([
      {
        id: '0',
        title: '',
        children: [
          {
            id: '1',
            title: 'Bookmarks Bar',
            folderType: 'bookmarks-bar',
            children,
          },
        ],
      },
    ]);
    expect(bookmarksBarUrls(nodes).map((n) => n.id)).toEqual([
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
    ]);
  });
});
