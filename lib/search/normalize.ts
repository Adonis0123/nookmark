const COMBINING_MARKS = /[\u0300-\u036F]/g;
const WHITESPACE = /\s+/g;

export function normalizeQuery(input: string): string {
  const nfkc = input.normalize('NFKC');
  const stripped = nfkc.normalize('NFD').replace(COMBINING_MARKS, '');
  return stripped.toLowerCase().trim().replace(WHITESPACE, ' ');
}

export function compactQuery(input: string): string {
  return input.replace(WHITESPACE, '');
}
