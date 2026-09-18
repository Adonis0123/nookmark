export function displayDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function formatRelativeTime(openedAt: number, now: number): string {
  const delta = Math.max(0, now - openedAt);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (delta < minute) return '刚刚';
  if (delta < hour) return `${Math.floor(delta / minute)} 分钟前`;
  if (delta < day) return `${Math.floor(delta / hour)} 小时前`;
  if (delta < 2 * day) return '昨天';
  if (delta < 7 * day) return `${Math.floor(delta / day)} 天前`;
  const date = new Date(openedAt);
  return `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}
