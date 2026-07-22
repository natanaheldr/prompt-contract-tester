import type { ReactNode } from 'react';
import HistorySidebar from './HistorySidebar.tsx';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface)]">
      <HistorySidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]/80 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-8 py-3.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/20">
              PC
            </div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-[15px] font-semibold tracking-tight text-[var(--color-text-primary)]">
                Prompt Contract Tester
              </h1>
              <span className="text-[11px] text-[var(--color-text-muted)]">
                Same prompt, every model, one contract
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="mx-auto max-w-5xl space-y-5">{children}</div>
        </main>
      </div>
    </div>
  );
}
