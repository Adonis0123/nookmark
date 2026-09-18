import { Bookmark, Lock } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export type BookmarkTileProps = {
  title: string;
  faviconSrc?: string;
  locked?: boolean;
  onClick?: () => void;
};

export function BookmarkTile({
  title,
  faviconSrc,
  locked = false,
  onClick,
}: BookmarkTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="flex h-[84px] w-full cursor-pointer flex-col gap-2 rounded-tile border border-glass-edge-strong bg-glass-panel p-2.5 text-left shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.9),0_8px_24px_var(--color-shadow-card)] backdrop-blur-[30px]"
    >
      <span className="flex items-start justify-between gap-1">
        <TileFavicon src={faviconSrc} />
        {locked ? (
          <Lock
            className="size-3 shrink-0 text-ink-tertiary"
            strokeWidth={1.5}
            aria-label="受管书签"
          />
        ) : null}
      </span>
      <span className="line-clamp-2 text-[11px] leading-[1.35] font-medium text-ink">
        {title}
      </span>
    </button>
  );
}

function TileFavicon({ src }: { src?: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showFallback = !src || failedSrc === src;

  return (
    <div
      className={cn(
        'flex size-[30px] shrink-0 items-center justify-center overflow-hidden rounded-[10px]',
        showFallback && 'bg-inset-8',
      )}
    >
      {showFallback ? (
        <Bookmark className="size-3.5 text-ink-muted" strokeWidth={1.5} />
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
