import { describe, expect, it } from 'vitest';
import { faviconUrl } from '@/lib/favicon';

describe('faviconUrl', () => {
  it('builds the extension _favicon endpoint with encoded pageUrl', () => {
    expect(faviconUrl('https://figma.com/file?x=1', 'abc123')).toBe(
      'chrome-extension://abc123/_favicon/?pageUrl=https%3A%2F%2Ffigma.com%2Ffile%3Fx%3D1&size=32',
    );
  });

  it('accepts a custom size', () => {
    expect(faviconUrl('https://a.com', 'id', 16)).toBe(
      'chrome-extension://id/_favicon/?pageUrl=https%3A%2F%2Fa.com&size=16',
    );
  });
});
