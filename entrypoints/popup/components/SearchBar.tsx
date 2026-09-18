import { Search } from 'lucide-react';
import type { CompositionEvent, FormEvent, Ref } from 'react';
import { cn } from '@/lib/utils';

type SearchBarProps = {
  value: string;
  onSearchChange: (value: string) => void;
  onSubmitSearch?: () => void;
  onCompositionStart?: (event: CompositionEvent<HTMLInputElement>) => void;
  onCompositionEnd?: (event: CompositionEvent<HTMLInputElement>) => void;
  inputRef?: Ref<HTMLInputElement>;
  placeholder?: string;
  className?: string;
};

export function SearchBar({
  value,
  onSearchChange,
  onSubmitSearch,
  onCompositionStart,
  onCompositionEnd,
  inputRef,
  placeholder = '搜索书签、网址或拼音',
  className,
}: SearchBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmitSearch?.();
  }

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      <label className="flex h-[46px] w-full items-center gap-2.5 rounded-full border border-glass-edge-strong bg-glass-panel-flat px-[13px] shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.9)] backdrop-blur-[30px]">
        <Search
          className="size-4 shrink-0 text-ink-tertiary"
          strokeWidth={1.5}
          aria-hidden
        />
        <input
          ref={inputRef}
          type="search"
          name="q"
          value={value}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={placeholder}
          aria-label={placeholder}
          onChange={(event) => onSearchChange(event.target.value)}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          className="min-w-0 flex-1 appearance-none bg-transparent text-[14px] leading-[1.4] text-ink outline-none placeholder:text-ink-tertiary [&::-webkit-search-cancel-button]:hidden"
        />
        <kbd className="flex h-6 w-10 shrink-0 items-center justify-center rounded-[8px] bg-inset-6 font-['Inter',ui-monospace,sans-serif] text-[11px] leading-[1.4] font-medium text-ink-muted">
          ⌘K
        </kbd>
      </label>
    </form>
  );
}
