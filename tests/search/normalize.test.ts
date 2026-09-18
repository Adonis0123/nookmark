import { describe, expect, it } from 'vitest';
import { normalizeQuery } from '@/lib/search/normalize';

describe('normalizeQuery', () => {
  it('NFKC-folds fullwidth latin (T-10)', () => {
    expect(normalizeQuery('Ｆｉｇｍａ')).toBe('figma');
  });

  it('strips combining marks after NFD', () => {
    expect(normalizeQuery('she\u0300ji')).toBe('sheji');
  });

  it('lowercases latin', () => {
    expect(normalizeQuery('FIGMA')).toBe('figma');
  });

  it('trims and collapses whitespace (T-11)', () => {
    expect(normalizeQuery('  figma  ')).toBe('figma');
    expect(normalizeQuery('fig  ma')).toBe('fig ma');
  });

  it('does not map traditional Han to simplified (R4 P1 deferred)', () => {
    expect(normalizeQuery('設計')).toBe('設計');
    expect(normalizeQuery('設計')).not.toBe('设计');
  });
});
