import { acceptSearchResult } from './match';

export function createSearchSession() {
  let composing = false;
  let queryId = 0;

  return {
    get composing() {
      return composing;
    },
    get queryId() {
      return queryId;
    },
    onCompositionStart() {
      composing = true;
    },
    onCompositionEnd() {
      composing = false;
    },
    shouldSearch() {
      return !composing;
    },
    nextQueryId() {
      if (composing) return null;
      queryId += 1;
      return queryId;
    },
    accept<T extends { queryId: number }>(result: T): T | null {
      return acceptSearchResult(queryId, result);
    },
  };
}
