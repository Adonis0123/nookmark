import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BrandLockup } from './components/BrandLockup.tsx';
import { FilterChips } from './components/FilterChips.tsx';
import { FrequentGrid } from './components/FrequentGrid.tsx';
import { RecentList } from './components/RecentList.tsx';
import { SearchBar } from './components/SearchBar.tsx';
import { Shell } from './components/Shell.tsx';
import { Toast } from './components/Toast.tsx';

const PREVIEW_CHIPS = [
  { id: null, title: '全部' },
  { id: '10', title: '设计' },
  { id: '11', title: '开发' },
];

const PREVIEW_FREQUENT = [
  { id: '1', title: 'Figma' },
  { id: '2', title: 'MDN' },
  { id: '3', title: 'GitHub' },
  { id: '4', title: 'Dribbble' },
  { id: '5', title: 'Notion' },
  { id: '6', title: 'Linear' },
  { id: '7', title: 'Vite' },
  { id: '8', title: 'React' },
];

const PREVIEW_RECENT = [
  {
    id: 'r1',
    title: 'Figma',
    domain: 'figma.com',
    relativeTime: '12 分钟前',
  },
  {
    id: 'r2',
    title: 'MDN Web Docs',
    domain: 'developer.mozilla.org',
    relativeTime: '1 小时前',
  },
  {
    id: 'r3',
    title: 'GitHub',
    domain: 'github.com',
    relativeTime: '昨天',
  },
];

export function App() {
  const [query, setQuery] = useState('');
  const [selectedChipId, setSelectedChipId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);

  return (
    <Shell>
      <header className="flex items-start justify-between gap-3">
        <BrandLockup bookmarkCount={11} syncingAll={null} />
        <CreateButton
          onClick={() => {
            setToast('已收藏当前页面');
          }}
        />
      </header>
      <SearchBar
        value={query}
        onSearchChange={setQuery}
        onSubmitSearch={() => {}}
        onCompositionStart={() => {}}
        onCompositionEnd={() => {}}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto [scrollbar-width:thin]">
        <FilterChips
          chips={PREVIEW_CHIPS}
          selectedChipId={selectedChipId}
          onSelectChip={setSelectedChipId}
        />
        <FrequentGrid items={PREVIEW_FREQUENT} />
        <RecentList items={PREVIEW_RECENT} onClear={() => {}} />
      </div>
      <Toast message={toast} />
    </Shell>
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
