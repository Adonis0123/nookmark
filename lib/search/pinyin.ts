import { pinyin } from 'pinyin-pro';
import { compactQuery, normalizeQuery } from './normalize';

function compactHaystack(value: string): string {
  return compactQuery(normalizeQuery(value));
}

export function haystackForTitle(raw: string): {
  raw: string;
  full: string;
  initials: string;
} {
  const full = pinyin(raw, {
    toneType: 'none',
    separator: '',
    nonZh: 'consecutive',
  });
  const initials = pinyin(raw, {
    pattern: 'first',
    toneType: 'none',
    separator: '',
    nonZh: 'consecutive',
  });
  return {
    raw,
    full: compactHaystack(full),
    initials: compactHaystack(initials),
  };
}
