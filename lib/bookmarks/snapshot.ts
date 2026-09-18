import { seedFromDateLastUsed } from '../open-records';
import { haystackForTitle } from '../search/pinyin';
import { flattenTree, type BookmarkTreeNodeInput } from './tree';
import type {
  BookmarkNode,
  BookmarkSnapshot,
  OpenRecord,
  SearchIndexEntry,
  SnapshotState,
} from './types';

export type SnapshotIo = {
  getTree: () => Promise<BookmarkTreeNodeInput[]>;
  getSnapshotState: () => Promise<SnapshotState>;
  setSnapshotState: (state: SnapshotState) => Promise<void>;
  getOpenRecords: () => Promise<OpenRecord[]>;
  setOpenRecords: (records: OpenRecord[]) => Promise<void>;
  now: () => number;
};

export function buildSnapshot(
  tree: BookmarkTreeNodeInput[],
  records: OpenRecord[],
  builtAt: number,
): BookmarkSnapshot {
  return snapshotWithNodes(
    { version: 1, builtAt, nodes: [], index: [] },
    flattenTree(tree),
    records,
  );
}

export function snapshotWithNodes(
  snapshot: BookmarkSnapshot,
  nodes: BookmarkNode[],
  records?: OpenRecord[],
): BookmarkSnapshot {
  return {
    version: 1,
    builtAt: snapshot.builtAt,
    nodes,
    index: indexFromNodes(nodes, records, snapshot.index),
  };
}

export function flattenCreatedNode(
  node: BookmarkTreeNodeInput,
  parent: BookmarkNode | null,
): BookmarkNode[] {
  const flattened = flattenTree([node]);
  const basePath =
    parent == null || parent.id === '0' ? [] : [...parent.path, parent.title];
  const baseAncestors =
    parent == null || parent.id === '0' ? [] : [...parent.ancestorIds, parent.id];
  const rootParentId = parent?.id ?? node.parentId ?? null;
  return flattened.map((item) => ({
    ...item,
    parentId: item.parentId == null ? rootParentId : item.parentId,
    path: [...basePath, ...item.path],
    ancestorIds: [...baseAncestors, ...item.ancestorIds],
  }));
}

export function placementFromParent(parent: BookmarkNode): {
  path: string[];
  ancestorIds: string[];
} {
  if (parent.id === '0') return { path: [], ancestorIds: [] };
  return {
    path: [...parent.path, parent.title],
    ancestorIds: [...parent.ancestorIds, parent.id],
  };
}

export async function rebuild(io: SnapshotIo): Promise<void> {
  const current = await io.getSnapshotState();
  if (current.status !== 'ok') {
    await io.setSnapshotState({ status: 'loading', snapshot: null });
  }

  let tree: BookmarkTreeNodeInput[];
  try {
    tree = await io.getTree();
  } catch (error) {
    const status = isPermissionError(error) ? 'permission' : 'error';
    await io.setSnapshotState({ status, snapshot: null });
    return;
  }

  let records = await io.getOpenRecords();
  if (records.length === 0) {
    const seeded = seedFromDateLastUsed(flattenTree(tree), io.now());
    if (seeded.length > 0) {
      await io.setOpenRecords(seeded);
      records = seeded;
    }
  }

  await io.setSnapshotState({
    status: 'ok',
    snapshot: buildSnapshot(tree, records, io.now()),
  });
}

function isPermissionError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : '';
  return /permission/i.test(message);
}

function indexFromNodes(
  nodes: BookmarkNode[],
  records: OpenRecord[] | undefined,
  previous: SearchIndexEntry[],
): SearchIndexEntry[] {
  const recordById = new Map(
    (records ?? []).map((record) => [record.bookmarkId, record]),
  );
  const previousById = new Map(previous.map((entry) => [entry.id, entry]));
  const entries: SearchIndexEntry[] = [];
  for (const node of nodes) {
    if (node.isFolder || node.url == null) continue;
    const record = recordById.get(node.id);
    const fallback = previousById.get(node.id);
    const entry: SearchIndexEntry = {
      id: node.id,
      title: haystackForTitle(node.title),
      domain: haystackForTitle(hostnameOf(node.url)),
      path: haystackForTitle(node.path.join('/')),
      url: node.url,
      ancestorIds: node.ancestorIds,
      isFolder: false,
      openCount: record?.openCount ?? fallback?.openCount ?? 0,
      lastOpenedAt: record?.openedAt ?? fallback?.lastOpenedAt ?? null,
      dateAdded: node.dateAdded ?? fallback?.dateAdded ?? 0,
    };
    if (node.unmodifiable != null) entry.unmodifiable = node.unmodifiable;
    entries.push(entry);
  }
  return entries;
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}
