import {
  applyChanged,
  applyCreated,
  applyMoved,
  applyRemoved,
} from '@/lib/bookmarks/events';
import { rebuild, type SnapshotIo } from '@/lib/bookmarks/snapshot';
import type { BookmarkSnapshot, OpenRecord } from '@/lib/bookmarks/types';
import { openRecordsItem, snapshotStateItem } from '@/lib/storage-items';

const io: SnapshotIo = {
  getTree: () => browser.bookmarks.getTree(),
  getSnapshotState: () => snapshotStateItem.getValue(),
  setSnapshotState: (state) => snapshotStateItem.setValue(state),
  getOpenRecords: () => openRecordsItem.getValue(),
  setOpenRecords: (records) => openRecordsItem.setValue(records),
  now: () => Date.now(),
};

export default defineBackground(() => {
  let importing = false;
  let ready = false;

  async function patch(
    apply: (snapshot: BookmarkSnapshot, records: OpenRecord[]) => BookmarkSnapshot,
  ): Promise<void> {
    if (importing || !ready) return;
    const state = await snapshotStateItem.getValue();
    if (state.status !== 'ok') {
      await rebuild(io);
      return;
    }
    const records = await openRecordsItem.getValue();
    await snapshotStateItem.setValue({
      status: 'ok',
      snapshot: apply(state.snapshot, records),
    });
  }

  browser.bookmarks.onCreated.addListener((_id, node) => {
    void patch((snapshot, records) => applyCreated(snapshot, node, records));
  });
  browser.bookmarks.onChanged.addListener((id, change) => {
    void patch((snapshot, records) => applyChanged(snapshot, id, change, records));
  });
  browser.bookmarks.onMoved.addListener((id, move) => {
    void patch((snapshot) => applyMoved(snapshot, id, move));
  });
  browser.bookmarks.onRemoved.addListener((id) => {
    void patch((snapshot) => applyRemoved(snapshot, id));
  });
  browser.bookmarks.onChildrenReordered.addListener(() => {
    if (importing || !ready) return;
    void rebuild(io);
  });
  browser.bookmarks.onImportBegan.addListener(() => {
    importing = true;
  });
  browser.bookmarks.onImportEnded.addListener(() => {
    importing = false;
    void rebuild(io);
  });

  browser.runtime.onInstalled.addListener(() => {
    void rebuild(io);
  });
  browser.runtime.onStartup.addListener(() => {
    void rebuild(io);
  });

  void rebuild(io).finally(() => {
    ready = true;
  });
});
