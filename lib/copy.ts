const SAVE_COPY = {
  ok: '已收藏当前页面',
  'already-saved': '当前页面已在书签中',
  blocked: '该链接类型已被安全策略阻止',
  'invalid-url': '该链接类型已被安全策略阻止',
  'no-other-folder': '无法找到「其他书签」文件夹',
} as const;

const OPEN_BLOCKED_COPY = '该链接类型已被安全策略阻止';

export const LOADING_COPY = '正在索引书签…';
export const EMPTY_COPY = '还没有书签。点右上角 ＋ 收藏当前页面。';
export const SAVE_WRITE_FAILURE_COPY = '无法收藏当前页面';

export function gateSaveOnSnapshot(
  status: 'loading' | 'ok' | 'permission' | 'error',
): { save: true } | { save: false; toast: string | null } {
  if (status === 'ok') return { save: true };
  if (status === 'loading') return { save: false, toast: LOADING_COPY };
  return { save: false, toast: null };
}

export const permissionPanel = {
  title: '需要书签访问权限',
  body: 'Nookmark 需要书签权限才能读取浏览器里的书签。书签仍在浏览器中，并未被删除。',
  actionLabel: '打开扩展设置',
};

export const readErrorPanel = {
  title: '无法读取书签',
  body: '暂时无法读取浏览器书签。书签仍在浏览器中，并未被删除。',
};

export function permissionSettingsUrl(extensionId: string): string {
  return `chrome://extensions/?id=${extensionId}`;
}

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
