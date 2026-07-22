import { useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { openaiAdapter } from '../adapters/openai.ts';
import { anthropicAdapter } from '../adapters/anthropic.ts';
import { mockAdapter } from '../adapters/mock.ts';
import type { Adapter } from '../adapters/types.ts';
import { validateData, validateSchemaSyntax } from '../utils/validateSchema.ts';
import { calculateCost } from '../utils/costCalculator.ts';
import type { ModelResult, TestRun } from '../types/index.ts';

const ADAPTER_MAP: Record<string, Adapter> = {
  openai: openaiAdapter,
  anthropic: anthropicAdapter,
  mock: mockAdapter,
};

export default function TestRunner() {
  const { state, dispatch } = useAppContext();
  const [results, setResults] = useState<ModelResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runAll = useCallback(async () => {
    const schemaResult = validateSchemaSyntax(state.schema);
    if (!schemaResult.valid || !schemaResult.parsed) {
      dispatch({ type: 'SET_SCHEMA_ERROR', payload: schemaResult.error ?? 'Invalid schema' });
      return;
    }

    const enabledModels = state.models.filter((m) => m.enabled);
    if (enabledModels.length === 0) return;

    setIsRunning(true);
    const parsedSchema = schemaResult.parsed;
    const finalPrompt = state.prompt;

    const initialResults: ModelResult[] = enabledModels.map((m) => ({
      modelId: m.id, status: 'running', latencyMs: 0, rawResponse: '',
      parsedJson: null, contractPassed: false, validationErrors: [],
      tokenCount: { prompt: 0, completion: 0 }, costEstimate: 0,
    }));
    setResults(initialResults);

    const collected: ModelResult[] = [];

    const runSingle = async (model: (typeof enabledModels)[number], index: number) => {
      const startTime = performance.now();
      try {
        const adapter = ADAPTER_MAP[model.name];
        if (!adapter) throw new Error(`No adapter for ${model.name}`);
        const response = await adapter.send(finalPrompt, model);
        const latencyMs = Math.round(performance.now() - startTime);
        const validation = validateData(parsedSchema, response.rawJson, state.validationRules);
        const cost = calculateCost(response.model, response.usage.promptTokens, response.usage.completionTokens);

        const result: ModelResult = {
          modelId: model.id, status: 'success', latencyMs,
          rawResponse: response.text, parsedJson: response.rawJson ?? null,
          contractPassed: validation.valid, validationErrors: validation.errors,
          tokenCount: { prompt: response.usage.promptTokens, completion: response.usage.completionTokens },
          costEstimate: cost,
        };
        collected[index] = result;
        setResults([...collected]);
      } catch (error: unknown) {
        const latencyMs = Math.round(performance.now() - startTime);
        const errorResult: ModelResult = {
          modelId: model.id, status: 'error', latencyMs, rawResponse: '',
          parsedJson: null, contractPassed: false, validationErrors: [],
          tokenCount: { prompt: 0, completion: 0 }, costEstimate: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
        collected[index] = errorResult;
        setResults([...collected]);
      }
    };

    await Promise.all(enabledModels.map((m, i) => runSingle(m, i)));
    setIsRunning(false);

    const testRun: TestRun = {
      id: crypto.randomUUID(), timestamp: Date.now(),
      prompt: finalPrompt, schema: parsedSchema,
      validationRules: state.validationRules, models: enabledModels,
      results: collected.filter(Boolean),
    };
    dispatch({ type: 'ADD_TEST_RUN', payload: testRun });
  }, [state, dispatch]);

  const exportResults = () => {
    if (results.length === 0) return;
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const enabledCount = state.models.filter((m) => m.enabled).length;
  const hasResults = results.some((r) => r.status !== 'running');

  return (
    <section className="animate-fade-in rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10">
            <svg className="h-3.5 w-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">
            Runner
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {hasResults && !isRunning && (
            <button
              onClick={exportResults}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          )}
          <button
            onClick={runAll}
            disabled={isRunning || enabledCount === 0}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold transition-all ${
              isRunning || enabledCount === 0
                ? 'cursor-not-allowed bg-[var(--color-border)] text-[var(--color-text-muted)]'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isRunning ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Running...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Run {enabledCount > 0 && `(${enabledCount})`}
              </>
            )}
          </button>
        </div>
      </div>

      {results.length === 0 && !isRunning && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <svg className="h-8 w-8 text-[var(--color-text-muted)]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[13px] text-[var(--color-text-muted)]">
            Hit Run to test your prompt against all enabled models
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((result) => {
            const model = state.models.find((m) => m.id === result.modelId);
            return (
              <ProgressCard key={result.modelId} result={result} modelName={model?.displayName ?? 'Unknown'} />
            );
          })}
        </div>
      )}
    </section>
  );
}

function ProgressCard({ result, modelName }: { result: ModelResult; modelName: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/50 transition-all hover:border-[var(--color-border-hover)]">
      <button
        onClick={() => result.status !== 'running' && setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-medium text-[var(--color-text-primary)]">{modelName}</span>
          <StatusPill status={result.status} />
        </div>
        <div className="flex items-center gap-3">
          {result.status === 'success' && (
            <>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                result.contractPassed
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-red-500/15 text-red-400'
              }`}>
                {result.contractPassed ? 'Pass' : 'Fail'}
              </span>
              <span className="text-[11px] tabular-nums text-[var(--color-text-muted)]">{result.latencyMs}ms</span>
            </>
          )}
          {result.status !== 'running' && (
            <svg className={`h-3.5 w-3.5 text-[var(--color-text-muted)] transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </button>

      {result.status === 'running' && (
        <div className="px-4 pb-3">
          <div className="h-1 overflow-hidden rounded-full bg-[var(--color-border)]">
            <div className="shimmer h-full w-full rounded-full" />
          </div>
        </div>
      )}

      {expanded && result.status === 'success' && (
        <div className="border-t border-[var(--color-border)] px-4 py-3 space-y-3">
          <div className="flex items-center gap-4 text-[11px] text-[var(--color-text-muted)]">
            <span>{result.tokenCount.prompt + result.tokenCount.completion} tokens</span>
            <span>${result.costEstimate.toFixed(6)}</span>
          </div>
          {result.validationErrors.length > 0 && (
            <div>
              <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-red-400/80">
                Validation errors
              </p>
              <ul className="space-y-1">
                {result.validationErrors.map((err, i) => (
                  <li key={i} className="text-[11px] text-red-400/80 font-mono">{err}</li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
              Raw response
            </p>
            <pre className="max-h-32 overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-[11px] leading-relaxed text-[var(--color-text-secondary)] font-mono whitespace-pre-wrap">
              {result.rawResponse || '(empty)'}
            </pre>
          </div>
        </div>
      )}

      {expanded && result.status === 'error' && (
        <div className="border-t border-[var(--color-border)] px-4 py-3">
          <p className="text-[11px] text-red-400/80 font-mono">{result.error}</p>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: ModelResult['status'] }) {
  const map: Record<string, string> = {
    idle: 'bg-[var(--color-border)] text-[var(--color-text-muted)]',
    running: 'bg-amber-500/15 text-amber-400',
    success: 'bg-emerald-500/15 text-emerald-400',
    error: 'bg-red-500/15 text-red-400',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${map[status]}`}>
      {status === 'running' && (
        <svg className="h-2.5 w-2.5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {status}
    </span>
  );
}
