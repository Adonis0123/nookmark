import { cn } from '@/lib/utils';

export type FilterChip = {
  id: string | null;
  title: string;
};

type FilterChipsProps = {
  chips: FilterChip[];
  selectedChipId: string | null;
  onSelectChip?: (id: string | null) => void;
};

export function FilterChips({
  chips,
  selectedChipId,
  onSelectChip,
}: FilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {chips.map((chip) => {
        const selected = chip.id === selectedChipId;
        return (
          <button
            key={chip.id ?? 'all'}
            type="button"
            onClick={() => onSelectChip?.(chip.id)}
            className={cn(
              'h-8 shrink-0 cursor-pointer rounded-full border px-4 text-[12.5px] leading-[1.4] whitespace-nowrap',
              selected
                ? 'border-transparent bg-accent font-medium text-on-accent'
                : 'border-glass-edge-soft bg-glass-element font-normal text-ink-muted backdrop-blur-[20px]',
            )}
          >
            {chip.title}
          </button>
        );
      })}
    </div>
  );
}
