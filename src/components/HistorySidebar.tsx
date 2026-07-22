import { useAppContext } from '../context/AppContext.tsx';

export default function HistorySidebar() {
  const { state, dispatch } = useAppContext();

  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface-elevated)]/60">
      <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] px-5 py-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/20">
          PC
        </div>
        <span className="text-[13px] font-semibold tracking-tight text-[var(--color-text-primary)]">
          History
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {state.testRuns.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <svg className="h-6 w-6 text-[var(--color-text-muted)]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[11px] leading-relaxed text-[var(--color-text-muted)]">
              No runs yet
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {state.testRuns.map((run) => {
              const passed = run.results.filter((r) => r.contractPassed).length;
              const allPassed = passed === run.results.length;

              return (
                <button
                  key={run.id}
                  onClick={() => {
                    dispatch({ type: 'SET_PROMPT', payload: run.prompt });
                    dispatch({ type: 'SET_SCHEMA', payload: JSON.stringify(run.schema, null, 2) });
                    dispatch({ type: 'SET_VALIDATION_RULES', payload: run.validationRules });
                  }}
                  className="w-full rounded-xl px-3 py-2.5 text-left transition-all hover:bg-[var(--color-surface)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-[var(--color-text-primary)]">
                      {new Date(run.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      allPassed ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                    }`}>
                      {passed}/{run.results.length}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
                    {new Date(run.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="mt-1 text-[10px] text-[var(--color-text-muted)]/70 truncate">
                    {run.models.map((m) => m.displayName).join(', ')}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
