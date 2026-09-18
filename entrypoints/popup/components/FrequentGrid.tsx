import { BookmarkTile } from './BookmarkTile.tsx';

export type FrequentItem = {
  id: string;
  title: string;
  faviconSrc?: string;
  locked?: boolean;
};

type FrequentGridProps = {
  items: FrequentItem[];
  onOpen?: (id: string) => void;
};

export function FrequentGrid({ items, onOpen }: FrequentGridProps) {
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center gap-[7px]">
        <h2 className="text-[15px] leading-[1.4] font-semibold text-ink">常用</h2>
        <CountBadge>{items.length}</CountBadge>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {items.map((item) => (
          <BookmarkTile
            key={item.id}
            title={item.title}
            faviconSrc={item.faviconSrc}
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
