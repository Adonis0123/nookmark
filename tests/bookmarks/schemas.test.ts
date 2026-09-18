import { describe, expect, it } from 'vitest';
import { bookmarkSnapshotSchema } from '@/lib/bookmarks/schemas';

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
