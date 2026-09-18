import { useEffect, useRef, useState } from 'react';
import { openRecordsItem, snapshotStateItem } from '@/lib/storage-items';
import { searchIndex, type SearchHit } from '@/lib/search/match';
import { createSearchSession } from '@/lib/search/session';
import { useStorageItem } from './useStorageItem';

const SEARCH_DEBOUNCE_MS = 100;

export function useBookmarkSearch(
  query: string,
  folderId: string | null,
  composing = false,
): { hits: SearchHit[]; pending: boolean } {
  const state = useStorageItem(snapshotStateItem);
  const records = useStorageItem(openRecordsItem);
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [pending, setPending] = useState(false);
  const sessionRef = useRef(createSearchSession());

  useEffect(() => {
    const session = sessionRef.current;
    if (composing) {
      session.onCompositionStart();
      return;
    }
    session.onCompositionEnd();
    if (!session.shouldSearch()) return;

    const queryId = session.nextQueryId();
    if (queryId == null) return;

    if (query.trim().length === 0) {
      setHits([]);
      setPending(false);
      return;
    }

    setPending(true);
    const timer = window.setTimeout(() => {
      const entries = state.status === 'ok' ? state.snapshot.index : [];
      const result = searchIndex(entries, query, {
        folderId,
        queryId,
        records,
      });
      const accepted = session.accept(result);
      if (accepted) {
        setHits(accepted.hits);
        setPending(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [query, folderId, composing, state, records]);

  return { hits, pending };
}
