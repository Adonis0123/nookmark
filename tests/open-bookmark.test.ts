import { describe, expect, it, vi } from 'vitest';
import { isBlockedUrl, openBookmark, prepareOpen } from '@/lib/open-bookmark';

describe('isBlockedUrl', () => {
  it.each([
    ['javascript:alert(1)', true],
    ['JAVASCRIPT:alert(1)', true],
    ['data:text/html,hi', true],
    ['file:///etc/passwd', true],
    ['https://example.com', false],
    ['http://example.com', false],
    ['chrome://extensions', false],
  ])('%s → %s', (url, blocked) => {
    expect(isBlockedUrl(url)).toBe(blocked);
  });
});

describe('openBookmark', () => {
  it('blocks javascript: URLs', async () => {
    const createTab = async () => {
      throw new Error('should not create');
    };
    const result = await openBookmark('javascript:alert(1)', { createTab });
    expect(result).toEqual({ ok: false, reason: 'blocked' });
  });

  it('blocks data: and file: URLs without creating a tab', async () => {
    const createTab = vi.fn(async () => {
      throw new Error('should not create');
    });
    expect(await openBookmark('data:text/html,hi', { createTab })).toEqual({
      ok: false,
      reason: 'blocked',
    });
    expect(await openBookmark('file:///tmp/x', { createTab })).toEqual({
      ok: false,
      reason: 'blocked',
    });
    expect(createTab).not.toHaveBeenCalled();
  });

  it('opens http(s) in a foreground tab', async () => {
    const createTab = vi.fn(async () => ({ id: 1 }));
    const result = await openBookmark('https://figma.com', { createTab });
    expect(result).toEqual({ ok: true });
    expect(createTab).toHaveBeenCalledWith({
      url: 'https://figma.com',
      active: true,
    });
  });
});

describe('prepareOpen', () => {
  it('blocks javascript/data/file before any persist or tab create', () => {
    expect(prepareOpen('javascript:alert(1)')).toEqual({ kind: 'blocked' });
    expect(prepareOpen('data:text/html,hi')).toEqual({ kind: 'blocked' });
    expect(prepareOpen('file:///tmp/x')).toEqual({ kind: 'blocked' });
  });

  it('asks the popup to persist OpenRecord then create the tab', () => {
    expect(prepareOpen('https://figma.com')).toEqual({
      kind: 'persistThenCreate',
    });
    expect(prepareOpen('http://example.com')).toEqual({
      kind: 'persistThenCreate',
    });
  });
});
