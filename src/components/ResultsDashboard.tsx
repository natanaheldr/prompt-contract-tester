import { useState } from 'react';
import type { TestRun, ModelResult } from '../types/index.ts';
import { useAppContext } from '../context/AppContext.tsx';

export default function ResultsDashboard() {
  const { state } = useAppContext();
  const latestRun = state.testRuns[0];

  if (!latestRun) {
    return (
      <section className="animate-fade-in rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10">
            <svg className="h-3.5 w-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">
            Results
          </h2>
        </div>
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-[13px] text-[var(--color-text-muted)]">
            Results will appear here after your first test run
          </p>
        </div>
      </section>
    );
  }

  const allPassed = latestRun.results.every((r) => r.contractPassed);
  const successCount = latestRun.results.filter((r) => r.status === 'success').length;

  return (
    <section className="animate-fade-in rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10">
            <svg className="h-3.5 w-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">
            Results
          </h2>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            allPassed ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
          }`}>
            {successCount}/{latestRun.results.length} passed
          </span>
        </div>
        <span className="text-[11px] text-[var(--color-text-muted)]">
          {new Date(latestRun.timestamp).toLocaleString()}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]/50">
              {['Model', 'Latency', 'Contract', 'Tokens', 'Cost', ''].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {latestRun.results.map((result) => (
              <ResultRow key={result.modelId} result={result} run={latestRun} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ResultRow({ result, run }: { result: ModelResult; run: TestRun }) {
  const [expanded, setExpanded] = useState(false);
  const model = run.models.find((m) => m.id === result.modelId);

  return (
    <>
      <tr
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-surface-elevated)]/30"
      >
        <td className="px-4 py-3 text-[12px] font-medium text-[var(--color-text-primary)]">
          {model?.displayName ?? 'Unknown'}
        </td>
        <td className="px-4 py-3 text-[12px] tabular-nums text-[var(--color-text-secondary)]">
          {result.latencyMs}ms
        </td>
        <td className="px-4 py-3">
          {result.status === 'success' ? (
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              result.contractPassed
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-red-500/15 text-red-400'
            }`}>
              {result.contractPassed ? 'Pass' : 'Fail'}
            </span>
          ) : (
            <span className="rounded-full bg-[var(--color-border)] px-2 py-0.5 text-[10px] text-[var(--color-text-muted)]">—</span>
          )}
        </td>
        <td className="px-4 py-3 text-[12px] tabular-nums text-[var(--color-text-secondary)]">
          {result.tokenCount.prompt + result.tokenCount.completion}
        </td>
        <td className="px-4 py-3 text-[12px] tabular-nums text-[var(--color-text-secondary)] font-mono">
          ${result.costEstimate.toFixed(6)}
        </td>
        <td className="px-4 py-3 text-right">
          <svg className={`inline-block h-3.5 w-3.5 text-[var(--color-text-muted)] transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]/20">
          <td colSpan={6} className="px-6 py-4">
            <div className="space-y-3">
              {result.rawResponse && (
                <div>
                  <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Response</p>
                  <pre className="max-h-40 overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-[11px] leading-relaxed text-[var(--color-text-secondary)] font-mono whitespace-pre-wrap">
                    {result.rawResponse}
                  </pre>
                </div>
              )}
              {result.parsedJson && (
                <div>
                  <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Parsed JSON</p>
                  <pre className="max-h-40 overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-[11px] leading-relaxed text-[var(--color-text-secondary)] font-mono whitespace-pre-wrap">
                    {JSON.stringify(result.parsedJson, null, 2)}
                  </pre>
                </div>
              )}
              {result.validationErrors.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-red-400/80">Errors</p>
                  <ul className="space-y-1">
                    {result.validationErrors.map((err, i) => (
                      <li key={i} className="text-[11px] text-red-400/80 font-mono">{err}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.error && (
                <p className="text-[11px] text-red-400/80 font-mono">{result.error}</p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
