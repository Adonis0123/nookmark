import { Bookmark, Lock } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export type RecentRowProps = {
  title: string;
  domain: string;
  faviconSrc?: string;
  relativeTime?: string;
  pinyinHint?: string;
  titleHighlight?: { start: number; end: number };
  selected?: boolean;
  locked?: boolean;
  onClick?: () => void;
};

export function RecentRow({
  title,
  domain,
  faviconSrc,
  relativeTime,
  pinyinHint,
  titleHighlight,
  selected = false,
  locked = false,
  onClick,
}: RecentRowProps) {
  const trailing = pinyinHint ?? relativeTime;

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'flex h-12 w-full cursor-pointer items-center gap-2.5 rounded-row border px-[11px] text-left backdrop-blur-[20px]',
        selected
          ? 'border-accent bg-accent-soft'
          : 'border-glass-edge-soft bg-glass-element',
      )}
    >
      <RowFavicon src={faviconSrc} />
      <span className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="flex min-w-0 items-center gap-1">
          <span className="truncate text-[12.5px] leading-none text-ink">
            <HighlightedTitle title={title} highlight={titleHighlight} />
          </span>
          {locked ? (
            <Lock
              className="size-3 shrink-0 text-ink-tertiary"
              strokeWidth={1.5}
              aria-label="受管书签"
            />
          ) : null}
        </span>
        <span className="mt-0.5 truncate font-['Inter',ui-monospace,sans-serif] text-[10.5px] leading-none text-ink-muted">
          {domain}
        </span>
      </span>
      {trailing ? (
        <span
          className={cn(
            'shrink-0 text-[10.5px] leading-none',
            pinyinHint ? 'text-ink-muted' : 'text-ink-tertiary',
          )}
        >
          {trailing}
        </span>
      ) : null}
    </button>
  );
}

function HighlightedTitle({
  title,
  highlight,
}: {
  title: string;
  highlight?: { start: number; end: number };
}) {
  if (highlight == null) return title;
  const start = Math.max(0, Math.min(title.length, highlight.start));
  const end = Math.max(start, Math.min(title.length, highlight.end));
  if (end <= start) return title;
  return (
    <>
      {title.slice(0, start)}
      <span className="text-accent">{title.slice(start, end)}</span>
      {title.slice(end)}
    </>
  );
}

function RowFavicon({ src }: { src?: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showFallback = !src || failedSrc === src;

  return (
    <div
      className={cn(
        'flex size-[26px] shrink-0 items-center justify-center overflow-hidden rounded-[9px]',
        showFallback && 'bg-inset-8',
      )}
    >
      {showFallback ? (
        <Bookmark className="size-3 text-ink-muted" strokeWidth={1.5} />
      ) : (
        <img
          src={src}
          alt=""
          draggable={false}
          className="size-full object-contain"
          onError={() => setFailedSrc(src)}
        />
      )}
    </div>
  );
}
