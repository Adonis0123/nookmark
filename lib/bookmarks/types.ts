export type BookmarkNode = {
  id: string;
  parentId: string | null;
  title: string;
  url?: string;
  isFolder: boolean;
  dateAdded?: number;
  dateLastUsed?: number;
  folderType?: 'bookmarks-bar' | 'other' | 'mobile' | 'managed';
  unmodifiable?: 'managed';
  syncing?: boolean;
  path: string[];
  ancestorIds: string[];
};

export type SearchIndexEntry = {
  id: string;
  title: { raw: string; full: string; initials: string };
  domain: { raw: string; full: string; initials: string };
  path: { raw: string; full: string; initials: string };
  url: string;
  ancestorIds: string[];
  isFolder: boolean;
  unmodifiable?: 'managed';
  openCount: number;
  lastOpenedAt: number | null;
  dateAdded: number;
};

export type OpenRecord = {
  bookmarkId: string;
  openedAt: number;
  openCount: number;
};

export type BookmarkSnapshot = {
  version: 1;
  builtAt: number;
  nodes: BookmarkNode[];
  index: SearchIndexEntry[];
};

export type SnapshotState =
  | { status: 'loading'; snapshot: null }
  | { status: 'ok'; snapshot: BookmarkSnapshot }
  | { status: 'permission'; snapshot: null }
  | { status: 'error'; snapshot: null };
