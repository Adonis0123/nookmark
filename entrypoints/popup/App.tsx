import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useIdleView } from '@/hooks/useIdleView';
import { displayDomain, formatRelativeTime } from '@/lib/display';
import { faviconUrl } from '@/lib/favicon';
import { openRecordsItem } from '@/lib/storage-items';
import { BrandLockup } from './components/BrandLockup.tsx';
import { FilterChips } from './components/FilterChips.tsx';
import { FrequentGrid } from './components/FrequentGrid.tsx';
import { FullPanelMessage } from './components/FullPanelMessage.tsx';
import { RecentList } from './components/RecentList.tsx';
import { RecentRow } from './components/RecentRow.tsx';
import { SearchBar } from './components/SearchBar.tsx';
import { Shell } from './components/Shell.tsx';
import { Toast } from './components/Toast.tsx';

const LOADING_COPY = '正在索引书签…';
const EMPTY_COPY = '还没有书签。点右上角 ＋ 收藏当前页面。';

export function App() {
  const [query, setQuery] = useState('');
  const [selectedChipId, setSelectedChipId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const now = Date.now();
  const idle = useIdleView(selectedChipId, now);
  const extensionId = browser.runtime.id;

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);

  return (
    <Shell>
      <header className="flex items-start justify-between gap-3">
        <BrandLockup
          bookmarkCount={
            idle.status === 'loading' ? undefined : idle.bookmarkCount
          }
          syncingAll={idle.syncingAll}
        />
        <CreateButton />
      </header>
      <SearchBar
        value={query}
        onSearchChange={setQuery}
        onSubmitSearch={() => {}}
        onCompositionStart={() => {}}
        onCompositionEnd={() => {}}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto [scrollbar-width:thin]">
        <IdleBody
          idle={idle}
          selectedChipId={selectedChipId}
          onSelectChip={setSelectedChipId}
          extensionId={extensionId}
          now={now}
        />
      </div>
      <Toast message={toast} />
    </Shell>
  );
}

type IdleBodyProps = {
  idle: ReturnType<typeof useIdleView>;
  selectedChipId: string | null;
  onSelectChip: (id: string | null) => void;
  extensionId: string;
  now: number;
};

function IdleBody({
  idle,
  selectedChipId,
  onSelectChip,
  extensionId,
  now,
}: IdleBodyProps) {
  if (idle.status === 'loading') {
    return <p className="text-[11px] leading-[1.4] text-ink-muted">{LOADING_COPY}</p>;
  }
  if (idle.status === 'permission') {
    return (
      <FullPanelMessage
        title="需要书签访问权限"
        body="Nookmark 需要书签权限才能读取浏览器里的书签。书签仍在浏览器中，并未被删除。"
      />
    );
  }
  if (idle.status === 'error') {
    return (
      <FullPanelMessage
        title="无法读取书签"
        body="暂时无法读取浏览器书签。书签仍在浏览器中，并未被删除。"
      />
    );
  }

  return (
    <>
      <FilterChips
        chips={idle.chips}
        selectedChipId={selectedChipId}
        onSelectChip={onSelectChip}
      />
      {idle.status === 'empty' ? (
        <p className="text-[11px] leading-[1.4] text-ink-muted">{EMPTY_COPY}</p>
      ) : idle.folderRows != null ? (
        <BookmarkRows
          items={idle.folderRows}
          extensionId={extensionId}
        />
      ) : (
        <>
          <FrequentGrid
            items={idle.frequent.map((item) => ({
              id: item.id,
              title: item.title,
              faviconSrc: faviconUrl(item.url, extensionId),
            }))}
          />
          <RecentList
            items={idle.recent.map((item) => ({
              id: item.id,
              title: item.title,
              domain: displayDomain(item.url),
              faviconSrc: faviconUrl(item.url, extensionId),
              relativeTime: formatRelativeTime(item.openedAt, now),
              locked: item.unmodifiable === 'managed',
            }))}
            onClear={() => {
              void openRecordsItem.setValue([]);
            }}
          />
        </>
      )}
    </>
  );
}

function BookmarkRows({
  items,
  extensionId,
}: {
  items: { id: string; title: string; url: string; unmodifiable?: 'managed' }[];
  extensionId: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <RecentRow
          key={item.id}
          title={item.title}
          domain={displayDomain(item.url)}
          faviconSrc={faviconUrl(item.url, extensionId)}
          locked={item.unmodifiable === 'managed'}
        />
      ))}
    </div>
  );
}

function CreateButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label="收藏当前页面"
      onClick={onClick}
      className="flex size-[30px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent text-on-accent shadow-[0_6px_16px_var(--color-shadow-accent)] active:bg-accent-press active:shadow-none"
    >
      <Plus className="size-2.5" strokeWidth={1.6} />
    </button>
  );
}
