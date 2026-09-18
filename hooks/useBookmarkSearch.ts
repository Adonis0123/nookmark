import { useEffect, useRef, useState } from 'react';
import { openRecordsItem, snapshotStateItem } from '@/lib/storage-items';
import {
  acceptSearchResult,
  searchIndex,
  type SearchHit,
} from '@/lib/search/match';
import { useStorageItem } from './useStorageItem';

const SEARCH_DEBOUNCE_MS = 100;

export function useBookmarkSearch(
  query: string,
  folderId: string | null,
  composing = false,
): { hits: SearchHit[] } {
  const state = useStorageItem(snapshotStateItem);
  const records = useStorageItem(openRecordsItem);
  const [hits, setHits] = useState<SearchHit[]>([]);
  const queryIdRef = useRef(0);

  useEffect(() => {
    if (composing) return;
    const queryId = ++queryIdRef.current;
    const timer = window.setTimeout(() => {
      const entries = state.status === 'ok' ? state.snapshot.index : [];
      const result = searchIndex(entries, query, {
        folderId,
        queryId,
        records,
      });
      if (acceptSearchResult(queryIdRef.current, result) == null) return;
      setHits(result.hits);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [query, folderId, composing, state, records]);

  return { hits };
}
