import { describe, expect, it, vi } from 'vitest';
import type { BookmarkNode } from '@/lib/bookmarks/types';
import { flattenTree } from '@/lib/bookmarks/tree';
import { saveCurrentPage } from '@/lib/save-current';

const tree = [
  {
    id: '0',
    title: '',
    children: [
      {
        id: '1',
        title: 'Bookmarks Bar',
        folderType: 'bookmarks-bar' as const,
        children: [],
      },
      {
        id: '99',
        title: 'Other Bookmarks',
        folderType: 'other' as const,
        children: [],
      },
    ],
  },
];

function savedNode(url: string): BookmarkNode {
  return {
    id: 'x',
    parentId: '99',
    title: 'A',
    url,
    isFolder: false,
    path: ['Other Bookmarks'],
    ancestorIds: ['99'],
  };
}

describe('saveCurrentPage', () => {
  it('refuses duplicate URL', async () => {
    const nodes: BookmarkNode[] = [savedNode('https://a.com')];
    const result = await saveCurrentPage({
      url: 'https://a.com',
      title: 'A',
      nodes,
      create: async () => ({ id: 'nope' }),
    });
    expect(result).toEqual({ ok: false, reason: 'already-saved' });
  });

  it('creates under Other Bookmarks looked up by folderType, not id 2', async () => {
    const create = vi.fn(async () => ({ id: 'new-1' }));
    const result = await saveCurrentPage({
      url: 'https://figma.com',
      title: 'Figma',
      nodes: flattenTree(tree),
      create,
    });
    expect(result).toEqual({ ok: true, id: 'new-1' });
    expect(create).toHaveBeenCalledWith({
      parentId: '99',
      title: 'Figma',
      url: 'https://figma.com',
    });
  });

  it('returns no-other-folder when folderType other is missing', async () => {
    const create = vi.fn(async () => ({ id: 'nope' }));
    const result = await saveCurrentPage({
      url: 'https://a.com',
      title: 'A',
      nodes: flattenTree([
        {
          id: '0',
          title: '',
          children: [{ id: '2', title: 'Looks like other', children: [] }],
        },
      ]),
      create,
    });
    expect(result).toEqual({ ok: false, reason: 'no-other-folder' });
    expect(create).not.toHaveBeenCalled();
  });

  it('blocks javascript: and rejects empty URLs', async () => {
    const nodes = flattenTree(tree);
    const create = vi.fn(async () => ({ id: 'nope' }));
    expect(
      await saveCurrentPage({
        url: 'javascript:alert(1)',
        title: 'x',
        nodes,
        create,
      }),
    ).toEqual({ ok: false, reason: 'blocked' });
    expect(
      await saveCurrentPage({ url: '   ', title: 'x', nodes, create }),
    ).toEqual({ ok: false, reason: 'invalid-url' });
    expect(create).not.toHaveBeenCalled();
  });
});
