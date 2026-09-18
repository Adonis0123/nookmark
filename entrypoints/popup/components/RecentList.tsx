import { RecentRow } from './RecentRow.tsx';

export type RecentItem = {
  id: string;
  title: string;
  domain: string;
  faviconSrc?: string;
  relativeTime?: string;
  pinyinHint?: string;
  locked?: boolean;
};

type RecentListProps = {
  items: RecentItem[];
  onClear?: () => void;
  onOpen?: (id: string) => void;
};

export function RecentList({ items, onClear, onOpen }: RecentListProps) {
  if (items.length === 0) return null;

  const showClear = onClear != null;

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-[7px]">
          <h2 className="text-[15px] leading-[1.4] font-semibold text-ink">
            最近打开
          </h2>
          <CountBadge>{items.length}</CountBadge>
        </div>
        {showClear ? (
          <button
            type="button"
            onClick={onClear}
            className="cursor-pointer text-[12.5px] leading-[1.4] text-ink-muted"
          >
            清空记录
          </button>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <RecentRow
            key={item.id}
            title={item.title}
            domain={item.domain}
            faviconSrc={item.faviconSrc}
            relativeTime={item.relativeTime}
            pinyinHint={item.pinyinHint}
            locked={item.locked}
            onClick={() => onOpen?.(item.id)}
          />
        ))}
      </div>
    </section>
  );
}

function CountBadge({ children }: { children: number }) {
  return (
    <span className="inline-flex h-[17px] items-center rounded-[9px] bg-inset-8 px-2 font-['Inter',ui-monospace,sans-serif] text-[10px] leading-[1.4] font-medium text-ink-muted">
      {children}
    </span>
  );
}
