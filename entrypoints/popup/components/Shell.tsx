import type { ReactNode } from 'react';
import { Atmosphere } from './Atmosphere.tsx';

type ShellProps = {
  children: ReactNode;
};

export function Shell({ children }: ShellProps) {
  return (
    <div className="relative h-[680px] w-[420px] overflow-hidden rounded-shell bg-[linear-gradient(180deg,var(--color-canvas-top)_0%,var(--color-canvas-mid)_45%,var(--color-canvas-bottom)_100%)] font-['Noto_Sans_SC',system-ui,sans-serif] text-ink antialiased">
      <Atmosphere />
      <div className="relative z-10 flex h-full flex-col gap-4 px-5 py-5">
        {children}
      </div>
    </div>
  );
}
