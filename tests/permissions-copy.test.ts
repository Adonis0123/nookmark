import { describe, expect, it } from 'vitest';
import {
  LOADING_COPY,
  permissionSettingsUrl,
  readErrorPanel,
  permissionPanel,
} from '@/lib/copy';

const DELETION_CLAIM = /书签被删除|书签已删除|已经删除了?书签/;

describe('permission and read-failure copy', () => {
  it('uses a full-panel title and does not claim bookmarks were deleted', () => {
    expect(permissionPanel.title).toBe('需要书签访问权限');
    expect(permissionPanel.body).not.toMatch(DELETION_CLAIM);
    expect(permissionPanel.body).toMatch(/并未被删除|不会删除/);
    expect(permissionPanel.actionLabel).toBe('打开扩展设置');
  });

  it('treats read failure as a panel, not a toast, without data-loss copy', () => {
    expect(readErrorPanel.title).toBe('无法读取书签');
    expect(readErrorPanel.body).not.toMatch(DELETION_CLAIM);
    expect(readErrorPanel.body).toMatch(/并未被删除|不会删除/);
  });

  it('points the action at this extension’s settings page', () => {
    expect(permissionSettingsUrl('abcd')).toBe(
      'chrome://extensions/?id=abcd',
    );
  });

  it('keeps loading chrome copy in the content column', () => {
    expect(LOADING_COPY).toBe('正在索引书签…');
  });
});
