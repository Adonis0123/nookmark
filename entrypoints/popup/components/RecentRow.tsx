import { Bookmark, Lock } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export type RecentRowProps = {
  title: string;
  domain: string;
  faviconSrc?: string;
  relativeTime?: string;
  pinyinHint?: string;
  locked?: boolean;
  onClick?: () => void;
};

export function RecentRow({
  title,
  domain,
  faviconSrc,
  relativeTime,
  pinyinHint,
  locked = false,
  onClick,
}: RecentRowProps) {
  const trailing = pinyinHint ?? relativeTime;

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="flex h-12 w-full cursor-pointer items-center gap-2.5 rounded-row border border-glass-edge-soft bg-glass-element px-[11px] text-left backdrop-blur-[20px]"
    >
      <RowFavicon src={faviconSrc} />
      <span className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="flex min-w-0 items-center gap-1">
          <span className="truncate text-[12.5px] leading-none text-ink">
            {title}
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
