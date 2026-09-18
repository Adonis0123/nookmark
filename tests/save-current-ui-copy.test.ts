import { describe, expect, it } from 'vitest';
import {
  LOADING_COPY,
  SAVE_WRITE_FAILURE_COPY,
  gateSaveOnSnapshot,
  openResultCopy,
  saveResultCopy,
} from '@/lib/copy';

describe('saveResultCopy', () => {
  it('maps save outcomes to popup toast copy', () => {
    expect(saveResultCopy({ ok: true, id: '1' })).toBe('已收藏当前页面');
    expect(saveResultCopy({ ok: false, reason: 'already-saved' })).toBe(
      '当前页面已在书签中',
    );
    expect(saveResultCopy({ ok: false, reason: 'blocked' })).toBe(
      '该链接类型已被安全策略阻止',
    );
    expect(saveResultCopy({ ok: false, reason: 'invalid-url' })).toBe(
      '该链接类型已被安全策略阻止',
    );
    expect(saveResultCopy({ ok: false, reason: 'no-other-folder' })).toBe(
      '无法找到「其他书签」文件夹',
    );
  });
});

describe('openResultCopy', () => {
  it('returns blocked copy and nothing on success', () => {
    expect(openResultCopy({ ok: true })).toBeNull();
    expect(openResultCopy({ ok: false, reason: 'blocked' })).toBe(
      '该链接类型已被安全策略阻止',
    );
  });
});

describe('gateSaveOnSnapshot', () => {
  it('saves only against an ok snapshot', () => {
    expect(gateSaveOnSnapshot('ok')).toEqual({ save: true });
  });

  it('toasts indexing copy while loading and does not claim Other Bookmarks is missing', () => {
    const gated = gateSaveOnSnapshot('loading');
    expect(gated).toEqual({
      save: false,
      toast: LOADING_COPY,
    });
    expect(LOADING_COPY).not.toMatch(/其他书签/);
  });

  it('does not toast a missing-folder reason on permission or read error', () => {
    expect(gateSaveOnSnapshot('permission')).toEqual({
      save: false,
      toast: null,
    });
    expect(gateSaveOnSnapshot('error')).toEqual({ save: false, toast: null });
  });
});

describe('SAVE_WRITE_FAILURE_COPY', () => {
  it('is readable and not a raw exception string', () => {
    expect(SAVE_WRITE_FAILURE_COPY).toBe('无法收藏当前页面');
    expect(SAVE_WRITE_FAILURE_COPY).not.toMatch(/Error|TypeError|stack/i);
  });
});
