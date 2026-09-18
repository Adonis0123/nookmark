const SAVE_COPY = {
  ok: '已收藏当前页面',
  'already-saved': '当前页面已在书签中',
  blocked: '该链接类型已被安全策略阻止',
  'invalid-url': '该链接类型已被安全策略阻止',
  'no-other-folder': '无法找到「其他书签」文件夹',
} as const;

const OPEN_BLOCKED_COPY = '该链接类型已被安全策略阻止';

export function saveResultCopy(
  result:
    | { ok: true; id: string }
    | {
        ok: false;
        reason: 'already-saved' | 'no-other-folder' | 'invalid-url' | 'blocked';
      },
): string {
  if (result.ok) return SAVE_COPY.ok;
  return SAVE_COPY[result.reason];
}

export function openResultCopy(
  result: { ok: true } | { ok: false; reason: 'blocked' },
): string | null {
  if (result.ok) return null;
  return OPEN_BLOCKED_COPY;
}
