import { storage } from '#imports';
import type { OpenRecord, SnapshotState } from './bookmarks/types';

export const snapshotStateItem = storage.defineItem<SnapshotState>(
  'local:snapshotState',
  { fallback: { status: 'loading', snapshot: null } },
);

export const openRecordsItem = storage.defineItem<OpenRecord[]>(
  'local:openRecords',
  { fallback: [] },
);
