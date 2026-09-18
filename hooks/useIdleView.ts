import { openRecordsItem, snapshotStateItem } from '@/lib/storage-items';
import { selectIdleView } from './idle-view';
import { useStorageItem } from './useStorageItem';

export { selectIdleView } from './idle-view';

export function useIdleView(folderId: string | null, now = Date.now()) {
  const state = useStorageItem(snapshotStateItem);
  const records = useStorageItem(openRecordsItem);
  return selectIdleView(state, records, folderId, now);
}
