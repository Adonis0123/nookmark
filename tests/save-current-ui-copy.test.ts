import { describe, expect, it } from 'vitest';
import { openResultCopy, saveResultCopy } from '@/lib/copy';

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
