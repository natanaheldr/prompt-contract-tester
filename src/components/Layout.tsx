import type { ReactNode } from 'react';
import HistorySidebar from './HistorySidebar.tsx';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <HistorySidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="border-b border-gray-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              PC
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">
                Prompt Contract Tester
              </h1>
              <p className="text-xs text-gray-500">
                Test prompts across models · Validate against JSON Schema
              </p>
            </div>
          </div>
        </header>
        <div className="space-y-4 p-6">{children}</div>
      </main>
    </div>
  );
}
