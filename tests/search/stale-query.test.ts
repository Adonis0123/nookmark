import { describe, expect, it } from 'vitest';
import { acceptSearchResult } from '@/lib/search/match';
import { createSearchSession } from '@/lib/search/session';

describe('acceptSearchResult (T-22)', () => {
  it('keeps queryId 2 and drops queryId 1 when 1 resolves later', () => {
    const latestQueryId = 2;
    expect(
      acceptSearchResult(latestQueryId, { queryId: 1, hits: ['old'] }),
    ).toBeNull();
    const fresh = { queryId: 2, hits: ['new'] };
    expect(acceptSearchResult(latestQueryId, fresh)).toBe(fresh);
  });
});

describe('createSearchSession IME', () => {
  it('does not search while composing', () => {
    const session = createSearchSession();
    expect(session.shouldSearch()).toBe(true);
    session.onCompositionStart();
    expect(session.shouldSearch()).toBe(false);
    session.onCompositionEnd();
    expect(session.shouldSearch()).toBe(true);
  });

  it('drops a stale queryId 1 result after queryId 2', () => {
    const session = createSearchSession();
    const first = session.nextQueryId();
    const second = session.nextQueryId();
    expect(first).toBe(1);
    expect(second).toBe(2);
    expect(session.accept({ queryId: 1, hits: ['old'] })).toBeNull();
    expect(session.accept({ queryId: 2, hits: ['new'] })).toEqual({
      queryId: 2,
      hits: ['new'],
    });
  });

  it('does not advance queryId while composing', () => {
    const session = createSearchSession();
    session.onCompositionStart();
    expect(session.nextQueryId()).toBeNull();
    session.onCompositionEnd();
    expect(session.nextQueryId()).toBe(1);
  });
});
