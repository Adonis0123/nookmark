import type {
  BookmarkNode,
  OpenRecord,
  SnapshotState,
} from '@/lib/bookmarks/types';
import { descendantsOf, idleChips } from '@/lib/bookmarks/tree';
import { frequentIds } from '@/lib/frequent';
import { recentIds } from '@/lib/open-records';

export type IdleChip = { id: string | null; title: string };

export type IdleBookmark = {
  id: string;
  title: string;
  url: string;
  unmodifiable?: 'managed';
};

export type IdleRecent = IdleBookmark & { openedAt: number };

export type IdleView = {
  status: 'loading' | 'empty' | 'ready' | 'permission' | 'error';
  bookmarkCount: number;
  chips: IdleChip[];
  frequent: IdleBookmark[];
  recent: IdleRecent[];
  folderRows: IdleBookmark[] | null;
  syncingAll: boolean | null;
};

const EMPTY_LISTS = {
  bookmarkCount: 0,
  chips: [] as IdleChip[],
  frequent: [] as IdleBookmark[],
  recent: [] as IdleRecent[],
  folderRows: null as IdleBookmark[] | null,
  syncingAll: null as boolean | null,
};

export function lockupBookmarkCount(
  status: IdleView['status'],
  bookmarkCount: number,
): number | undefined {
  if (status === 'ready' || status === 'empty') return bookmarkCount;
  return undefined;
}

export function selectIdleView(
  state: SnapshotState,
  records: OpenRecord[],
  folderId: string | null,
  now: number,
): IdleView {
  if (state.status === 'loading') return { status: 'loading', ...EMPTY_LISTS };
  if (state.status === 'permission') {
    return { status: 'permission', ...EMPTY_LISTS };
  }
  if (state.status === 'error') return { status: 'error', ...EMPTY_LISTS };

  const nodes = state.snapshot.nodes;
  const urlNodes = nodes.filter(isUrlNode);
  const chips = idleChips(nodes);
  const bookmarkCount = urlNodes.length;
  const syncingAll =
    bookmarkCount > 0 && urlNodes.every((node) => node.syncing === true)
      ? true
      : null;

  if (bookmarkCount === 0) {
    return {
      status: 'empty',
      bookmarkCount: 0,
      chips,
      frequent: [],
      recent: [],
      folderRows: folderId == null ? null : [],
      syncingAll: null,
    };
  }

  if (folderId != null) {
    return {
      status: 'ready',
      bookmarkCount,
      chips,
      frequent: [],
      recent: [],
      folderRows: descendantsOf(nodes, folderId).flatMap(toIdleBookmark),
      syncingAll,
    };
  }

  const byId = new Map(urlNodes.map((node) => [node.id, node]));
  return {
    status: 'ready',
    bookmarkCount,
    chips,
    frequent: frequentIds(records, nodes, now).flatMap((id) => {
      const node = byId.get(id);
      return node ? toIdleBookmark(node) : [];
    }),
    recent: recentIds(records, 3).flatMap((id) => {
      const node = byId.get(id);
      const record = records.find((item) => item.bookmarkId === id);
      if (node == null || record == null) return [];
      return [{ ...toIdleBookmark(node)[0]!, openedAt: record.openedAt }];
    }),
    folderRows: null,
    syncingAll,
  };
}

function isUrlNode(node: BookmarkNode): boolean {
  return !node.isFolder && node.url != null && node.url.length > 0;
}

function toIdleBookmark(node: BookmarkNode): IdleBookmark[] {
  if (!isUrlNode(node) || node.url == null) return [];
  const item: IdleBookmark = {
    id: node.id,
    title: node.title,
    url: node.url,
  };
  if (node.unmodifiable === 'managed') item.unmodifiable = 'managed';
  return [item];
}
