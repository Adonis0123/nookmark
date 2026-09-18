import {
  applyChanged,
  applyCreated,
  applyMoved,
  applyRemoved,
} from '@/lib/bookmarks/events';
import { createBookmarkJobQueue } from '@/lib/bookmarks/job-queue';
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

const jobs = createBookmarkJobQueue();

export default defineBackground(() => {
  let importing = false;

  async function patch(
    apply: (snapshot: BookmarkSnapshot, records: OpenRecord[]) => BookmarkSnapshot,
  ): Promise<void> {
    if (importing) return;
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
    jobs.enqueue(() =>
      patch((snapshot, records) => applyCreated(snapshot, node, records)),
    );
  });
  browser.bookmarks.onChanged.addListener((id, change) => {
    jobs.enqueue(() =>
      patch((snapshot, records) => applyChanged(snapshot, id, change, records)),
    );
  });
  browser.bookmarks.onMoved.addListener((id, move) => {
    jobs.enqueue(() => patch((snapshot) => applyMoved(snapshot, id, move)));
  });
  browser.bookmarks.onRemoved.addListener((id) => {
    jobs.enqueue(() => patch((snapshot) => applyRemoved(snapshot, id)));
  });
  browser.bookmarks.onChildrenReordered.addListener(() => {
    jobs.enqueue(async () => {
      if (importing) return;
      await rebuild(io);
    });
  });
  browser.bookmarks.onImportBegan.addListener(() => {
    importing = true;
  });
  browser.bookmarks.onImportEnded.addListener(() => {
    jobs.enqueue(async () => {
      await rebuild(io);
      importing = false;
    });
  });

  jobs.enqueue(() => rebuild(io));
});
