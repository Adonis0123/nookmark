const BLOCKED_SCHEMES = new Set(['javascript', 'data', 'file']);

export function isBlockedUrl(url: string): boolean {
  const scheme = url.trim().match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/)?.[1];
  if (scheme == null) return false;
  return BLOCKED_SCHEMES.has(scheme.toLowerCase());
}

export type OpenBookmarkDeps = {
  createTab: (opts: { url: string; active: true }) => Promise<unknown>;
};

export async function openBookmark(
  url: string,
  deps: OpenBookmarkDeps,
): Promise<{ ok: true } | { ok: false; reason: 'blocked' }> {
  if (isBlockedUrl(url)) return { ok: false, reason: 'blocked' };
  await deps.createTab({ url, active: true });
  return { ok: true };
}
