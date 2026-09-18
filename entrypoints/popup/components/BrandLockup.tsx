import { Bookmark } from 'lucide-react';

type BrandLockupProps = {
  bookmarkCount?: number;
  syncingAll?: boolean | null;
};

export function BrandLockup({ bookmarkCount, syncingAll }: BrandLockupProps) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <div className="flex size-[30px] shrink-0 items-center justify-center rounded-[11px] bg-accent">
        <Bookmark className="size-4 text-on-accent" strokeWidth={1.6} />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-[17px] leading-[1.4] font-semibold text-ink">Nookmark</p>
        {bookmarkCount != null ? (
          <p className="truncate text-[11px] leading-[1.4] text-ink-muted">
            {formatSubtitle(bookmarkCount, syncingAll)}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function formatSubtitle(count: number, syncingAll?: boolean | null) {
  const base = `${count} 个书签`;
  if (syncingAll === true) return `${base} · 已同步`;
  return base;
}
