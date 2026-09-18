import { Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useBookmarkSearch } from '@/hooks/useBookmarkSearch';
import { useCurrentTab } from '@/hooks/useCurrentTab';
import { useIdleView } from '@/hooks/useIdleView';
import { useStorageItem } from '@/hooks/useStorageItem';
import {
  EMPTY_COPY,
  LOADING_COPY,
  openResultCopy,
  permissionPanel,
  permissionSettingsUrl,
  readErrorPanel,
  saveResultCopy,
} from '@/lib/copy';
import { displayDomain, formatRelativeTime } from '@/lib/display';
import { faviconUrl } from '@/lib/favicon';
import { bumpOpenRecord } from '@/lib/open-records';
import { openBookmark } from '@/lib/open-bookmark';
import { saveCurrentPage } from '@/lib/save-current';
import type { SearchHit } from '@/lib/search/match';
import { openRecordsItem, snapshotStateItem } from '@/lib/storage-items';
import { BrandLockup } from './components/BrandLockup.tsx';
import { FilterChips } from './components/FilterChips.tsx';
import { FrequentGrid } from './components/FrequentGrid.tsx';
import { FullPanelMessage } from './components/FullPanelMessage.tsx';
import { RecentList } from './components/RecentList.tsx';
import { RecentRow } from './components/RecentRow.tsx';
import { SearchBar } from './components/SearchBar.tsx';
import { Shell } from './components/Shell.tsx';
import { Toast } from './components/Toast.tsx';

const NO_RESULTS_TITLE = '没有匹配的书签';
const PINYIN_TIP = '可输入拼音或首字母，如 sjlg';

export function App() {
  const [query, setQuery] = useState('');
  const [selectedChipId, setSelectedChipId] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);
  const [selectedHit, setSelectedHit] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const savingRef = useRef(false);
  const now = Date.now();
  const idle = useIdleView(selectedChipId, now);
  const { hits, pending } = useBookmarkSearch(query, selectedChipId, composing);
  const records = useStorageItem(openRecordsItem);
  const snapshotState = useStorageItem(snapshotStateItem);
  const tab = useCurrentTab();
  const extensionId = browser.runtime.id;
  const showSearch = !composing && query.trim().length > 0;

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    setSelectedHit(0);
  }, [hits]);

  async function handleOpen(id: string, url: string) {
    const result = await openBookmark(url, {
      createTab: (opts) => browser.tabs.create(opts),
    });
    const blocked = openResultCopy(result);
    if (blocked) {
      setToast(blocked);
      return;
    }
    await openRecordsItem.setValue(bumpOpenRecord(records, id, Date.now()));
  }

  async function handleSave() {
    if (savingRef.current) return;
    savingRef.current = true;
    try {
      const nodes =
        snapshotState.status === 'ok' ? snapshotState.snapshot.nodes : [];
      const result = await saveCurrentPage({
        url: tab?.url ?? '',
        title: tab?.title || tab?.url || '',
        nodes,
        create: async (opts) => {
          const created = await browser.bookmarks.create(opts);
          return { id: created.id };
        },
      });
      setToast(saveResultCopy(result));
    } finally {
      savingRef.current = false;
    }
  }

  function openSelectedHit() {
    const hit = hits[selectedHit] ?? hits[0];
    if (hit == null) return;
    void handleOpen(hit.entry.id, hit.entry.url);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (event.key === 'Escape' && query.length > 0) {
        event.preventDefault();
        setQuery('');
        return;
      }
      if (!showSearch || hits.length === 0) return;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedHit((index) => Math.min(hits.length - 1, index + 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedHit((index) => Math.max(0, index - 1));
      } else if (event.key === 'Enter' && event.target !== searchRef.current) {
        event.preventDefault();
        openSelectedHit();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [query, showSearch, hits, selectedHit, records]);

  return (
    <Shell>
      <header className="flex items-start justify-between gap-3">
        <BrandLockup
          bookmarkCount={
            idle.status === 'loading' ? undefined : idle.bookmarkCount
          }
          syncingAll={idle.syncingAll}
        />
        <CreateButton onClick={() => void handleSave()} />
      </header>
      <SearchBar
        value={query}
        inputRef={searchRef}
        onSearchChange={setQuery}
        onSubmitSearch={openSelectedHit}
        onCompositionStart={() => setComposing(true)}
        onCompositionEnd={(event) => {
          setComposing(false);
          setQuery(event.currentTarget.value);
        }}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto [scrollbar-width:thin]">
        {showSearch &&
        idle.status !== 'permission' &&
        idle.status !== 'error' &&
        idle.status !== 'loading' ? (
          <>
            <FilterChips
              chips={idle.chips}
              selectedChipId={selectedChipId}
              onSelectChip={setSelectedChipId}
            />
            <SearchBody
              query={query.trim()}
              hits={hits}
              pending={pending}
              selectedHit={selectedHit}
              extensionId={extensionId}
              onOpen={handleOpen}
            />
          </>
        ) : (
          <IdleBody
            idle={idle}
            selectedChipId={selectedChipId}
            onSelectChip={setSelectedChipId}
            extensionId={extensionId}
            now={now}
            onOpen={handleOpen}
          />
        )}
      </div>
      <Toast message={toast} />
    </Shell>
  );
}

function SearchBody({
  query,
  hits,
  pending,
  selectedHit,
  extensionId,
  onOpen,
}: {
  query: string;
  hits: SearchHit[];
  pending: boolean;
  selectedHit: number;
  extensionId: string;
  onOpen: (id: string, url: string) => void;
}) {
  if (hits.length === 0 && pending) return null;
  if (hits.length === 0) {
    return (
      <FullPanelMessage
        title={NO_RESULTS_TITLE}
        actionLabel={`在网上搜索『${query}』`}
        onAction={() => {
          void browser.tabs.create({
            url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            active: true,
          });
        }}
        hint={PINYIN_TIP}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {hits.map((hit, index) => (
        <RecentRow
          key={hit.entry.id}
          title={hit.entry.title.raw}
          domain={displayDomain(hit.entry.url)}
          faviconSrc={faviconUrl(hit.entry.url, extensionId)}
          pinyinHint={hit.pinyinHint}
          titleHighlight={hit.rawHighlight}
          selected={index === selectedHit}
          locked={hit.entry.unmodifiable === 'managed'}
          onClick={() => onOpen(hit.entry.id, hit.entry.url)}
        />
      ))}
    </div>
  );
}

type IdleBodyProps = {
  idle: ReturnType<typeof useIdleView>;
  selectedChipId: string | null;
  onSelectChip: (id: string | null) => void;
  extensionId: string;
  now: number;
  onOpen: (id: string, url: string) => void;
};

function IdleBody({
  idle,
  selectedChipId,
  onSelectChip,
  extensionId,
  now,
  onOpen,
}: IdleBodyProps) {
  if (idle.status === 'loading') {
    return <p className="text-[11px] leading-[1.4] text-ink-muted">{LOADING_COPY}</p>;
  }
  if (idle.status === 'permission') {
    return (
      <FullPanelMessage
        title={permissionPanel.title}
        body={permissionPanel.body}
        actionLabel={permissionPanel.actionLabel}
        onAction={() => {
          void browser.tabs.create({
            url: permissionSettingsUrl(extensionId),
            active: true,
          });
        }}
      />
    );
  }
  if (idle.status === 'error') {
    return (
      <FullPanelMessage
        title={readErrorPanel.title}
        body={readErrorPanel.body}
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
          onOpen={onOpen}
        />
      ) : (
        <>
          <FrequentGrid
            items={idle.frequent.map((item) => ({
              id: item.id,
              title: item.title,
              faviconSrc: faviconUrl(item.url, extensionId),
              locked: item.unmodifiable === 'managed',
            }))}
            onOpen={(id) => {
              const item = idle.frequent.find((row) => row.id === id);
              if (item) onOpen(item.id, item.url);
            }}
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
            onOpen={(id) => {
              const item = idle.recent.find((row) => row.id === id);
              if (item) onOpen(item.id, item.url);
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
  onOpen,
}: {
  items: { id: string; title: string; url: string; unmodifiable?: 'managed' }[];
  extensionId: string;
  onOpen: (id: string, url: string) => void;
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
          onClick={() => onOpen(item.id, item.url)}
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
