export function faviconUrl(
  pageUrl: string,
  extensionId: string,
  size = 32,
): string {
  return `chrome-extension://${extensionId}/_favicon/?pageUrl=${encodeURIComponent(pageUrl)}&size=${size}`;
}
