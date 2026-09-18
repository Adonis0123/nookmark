import { describe, expect, it } from 'vitest';
import {
  bookmarkSnapshotSchema,
  snapshotStateSchema,
} from '@/lib/bookmarks/schemas';

describe('bookmarkSnapshotSchema', () => {
  it('accepts version 1 snapshot with empty lists', () => {
    const parsed = bookmarkSnapshotSchema.parse({
      version: 1,
      builtAt: 0,
      nodes: [],
      index: [],
    });
    expect(parsed.version).toBe(1);
  });

  it('rejects missing version', () => {
    expect(() =>
      bookmarkSnapshotSchema.parse({ builtAt: 0, nodes: [], index: [] }),
    ).toThrow();
  });
});

describe('snapshotStateSchema', () => {
  it('accepts permission state with snapshot null', () => {
    const parsed = snapshotStateSchema.parse({
      status: 'permission',
      snapshot: null,
    });
    expect(parsed.status).toBe('permission');
    expect(parsed.snapshot).toBeNull();
  });

  it('requires a version-1 snapshot for ok', () => {
    const parsed = snapshotStateSchema.parse({
      status: 'ok',
      snapshot: { version: 1, builtAt: 0, nodes: [], index: [] },
    });
    expect(parsed.status).toBe('ok');
    if (parsed.status !== 'ok') return;
    expect(parsed.snapshot.version).toBe(1);
  });

  it('rejects ok without a version-1 snapshot', () => {
    expect(() =>
      snapshotStateSchema.parse({ status: 'ok', snapshot: null }),
    ).toThrow();
  });
});
