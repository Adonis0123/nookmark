import { storage } from '#imports';
import type { BookmarkSnapshot, OpenRecord } from './bookmarks/types';

export const snapshotItem = storage.defineItem<BookmarkSnapshot | null>(
  'local:bookmarkSnapshot',
  { fallback: null },
);

export const openRecordsItem = storage.defineItem<OpenRecord[]>(
  'local:openRecords',
  { fallback: [] },
);
