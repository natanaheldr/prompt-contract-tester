import { useAppContext } from '../context/AppContext.tsx';

export default function HistorySidebar() {
  const { state, dispatch } = useAppContext();

  return (
    <aside className="w-64 shrink-0 border-r border-gray-800 bg-gray-900/50 p-4 flex flex-col">
      <div className="mb-4 flex items-center gap-2">
        <svg
          className="h-5 w-5 text-indigo-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-sm font-semibold text-white uppercase tracking-wide">
          History
        </h2>
      </div>

      {state.testRuns.length === 0 && (
        <p className="text-xs text-gray-500 italic">
          No previous runs. Tests you run will appear here.
        </p>
      )}

      <ul className="space-y-1 overflow-y-auto flex-1">
        {state.testRuns.map((run) => (
          <li key={run.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'SET_PROMPT',
                  payload: run.prompt,
                });
                dispatch({
                  type: 'SET_SCHEMA',
                  payload: JSON.stringify(run.schema, null, 2),
                });
                dispatch({
                  type: 'SET_VALIDATION_RULES',
                  payload: run.validationRules,
                });
              }}
              className="w-full rounded-lg px-3 py-2 text-left text-xs transition-colors hover:bg-gray-800"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-300">
                  {new Date(run.timestamp).toLocaleDateString()}
                </span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                    run.results.every((r) => r.contractPassed)
                      ? 'bg-emerald-900/60 text-emerald-400'
                      : 'bg-yellow-900/60 text-yellow-400'
                  }`}
                >
                  {run.results.filter((r) => r.contractPassed).length}/
                  {run.results.length}
                </span>
              </div>
              <p className="mt-0.5 text-gray-500 truncate">
                {new Date(run.timestamp).toLocaleTimeString()}
              </p>
              <p className="mt-0.5 text-gray-500 text-[10px] truncate">
                {run.models.map((m) => m.displayName).join(', ')}
              </p>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t border-gray-800 pt-3">
        <p className="text-[10px] text-gray-600">
          Data stored in localStorage. Runs persist across sessions.
        </p>
      </div>
    </aside>
  );
}
