import type { BookmarkNode } from './types';

const SPECIAL_CHIP_PARENTS = new Set(['bookmarks-bar', 'other', 'mobile']);

/** Structural subset of chrome.bookmarks.BookmarkTreeNode. */
export type BookmarkTreeNodeInput = {
  id: string;
  parentId?: string;
  title: string;
  url?: string;
  dateAdded?: number;
  dateLastUsed?: number;
  folderType?: BookmarkNode['folderType'];
  unmodifiable?: BookmarkNode['unmodifiable'];
  syncing?: boolean;
  children?: BookmarkTreeNodeInput[];
};

export function flattenTree(tree: BookmarkTreeNodeInput[]): BookmarkNode[] {
  const nodes: BookmarkNode[] = [];
  walk(tree, null, [], [], nodes);
  return nodes;
}

function walk(
  tree: BookmarkTreeNodeInput[],
  parentId: string | null,
  path: string[],
  ancestorIds: string[],
  out: BookmarkNode[],
): void {
  for (const node of tree) {
    const isFolder = node.url == null;
    const flattened: BookmarkNode = {
      id: node.id,
      parentId,
      title: node.title,
      isFolder,
      path,
      ancestorIds,
    };
    if (node.url != null) flattened.url = node.url;
    if (node.dateAdded != null) flattened.dateAdded = node.dateAdded;
    if (node.dateLastUsed != null) flattened.dateLastUsed = node.dateLastUsed;
    if (node.folderType != null) flattened.folderType = node.folderType;
    if (node.unmodifiable != null) flattened.unmodifiable = node.unmodifiable;
    if (node.syncing != null) flattened.syncing = node.syncing;
    out.push(flattened);

    if (node.children == null) continue;
    const nextPath = node.id === '0' ? path : [...path, node.title];
    const nextAncestorIds =
      node.id === '0' || !isFolder ? ancestorIds : [...ancestorIds, node.id];
    walk(node.children, node.id, nextPath, nextAncestorIds, out);
  }
}

export function folderFilterChips(nodes: BookmarkNode[]): BookmarkNode[] {
  const specialIds = new Set(
    nodes
      .filter(
        (node) =>
          node.folderType != null && SPECIAL_CHIP_PARENTS.has(node.folderType),
      )
      .map((node) => node.id),
  );
  return nodes.filter(
    (node) =>
      node.isFolder && node.parentId != null && specialIds.has(node.parentId),
  );
}

export function idleChips(
  nodes: BookmarkNode[],
): { id: string | null; title: string }[] {
  const folders = folderFilterChips(nodes);
  if (folders.length === 0) return [];
  return [
    { id: null, title: '全部' },
    ...folders.map((folder) => ({ id: folder.id, title: folder.title })),
  ];
}

export function otherBookmarksFolder(nodes: BookmarkNode[]): BookmarkNode | null {
  return nodes.find((node) => node.folderType === 'other') ?? null;
}

export function descendantsOf(
  nodes: BookmarkNode[],
  folderId: string,
): BookmarkNode[] {
  return nodes.filter(
    (node) => !node.isFolder && node.ancestorIds.includes(folderId),
  );
}

export function bookmarksBarUrls(nodes: BookmarkNode[]): BookmarkNode[] {
  const bar = nodes.find((node) => node.folderType === 'bookmarks-bar');
  if (bar == null) return [];
  return nodes
    .filter((node) => !node.isFolder && node.parentId === bar.id)
    .slice(0, 8);
}
