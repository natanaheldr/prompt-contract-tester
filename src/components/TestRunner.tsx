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
      dispatch({
        type: 'SET_SCHEMA_ERROR',
        payload: schemaResult.error ?? 'Invalid schema',
      });
      return;
    }

    const enabledModels = state.models.filter((m) => m.enabled);
    if (enabledModels.length === 0) return;

    setIsRunning(true);

    const finalPrompt = state.prompt;
    const parsedSchema = schemaResult.parsed;

    const initialResults: ModelResult[] = enabledModels.map((m) => ({
      modelId: m.id,
      status: 'running',
      latencyMs: 0,
      rawResponse: '',
      parsedJson: null,
      contractPassed: false,
      validationErrors: [],
      tokenCount: { prompt: 0, completion: 0 },
      costEstimate: 0,
    }));

    setResults(initialResults);

    const runSingle = async (
      model: (typeof enabledModels)[number],
      index: number,
    ) => {
      const startTime = performance.now();
      try {
        const adapter = ADAPTER_MAP[model.name];
        if (!adapter) throw new Error(`No adapter for ${model.name}`);

        const response = await adapter.send(finalPrompt, model);
        const latencyMs = Math.round(performance.now() - startTime);

        const validation = validateData(
          parsedSchema,
          response.rawJson,
          state.validationRules,
        );

        const cost = calculateCost(
          response.model,
          response.usage.promptTokens,
          response.usage.completionTokens,
        );

        const result: ModelResult = {
          modelId: model.id,
          status: 'success',
          latencyMs,
          rawResponse: response.text,
          parsedJson: response.rawJson ?? null,
          contractPassed: validation.valid,
          validationErrors: validation.errors,
          tokenCount: {
            prompt: response.usage.promptTokens,
            completion: response.usage.completionTokens,
          },
          costEstimate: cost,
        };

        setResults((prev) =>
          prev.map((r, i) => (i === index ? result : r)),
        );
      } catch (error: unknown) {
        const latencyMs = Math.round(performance.now() - startTime);
        const errorResult: ModelResult = {
          modelId: model.id,
          status: 'error',
          latencyMs,
          rawResponse: '',
          parsedJson: null,
          contractPassed: false,
          validationErrors: [],
          tokenCount: { prompt: 0, completion: 0 },
          costEstimate: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
        setResults((prev) =>
          prev.map((r, i) => (i === index ? errorResult : r)),
        );
      }
    };

    await Promise.all(
      enabledModels.map((model, i) => runSingle(model, i)),
    );

    setIsRunning(false);

    const finalResults = results;
    const testRun: TestRun = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      prompt: finalPrompt,
      schema: parsedSchema,
      validationRules: state.validationRules,
      models: enabledModels,
      results: finalResults,
    };

    dispatch({ type: 'ADD_TEST_RUN', payload: testRun });
  }, [state, dispatch, results]);

  const exportResults = () => {
    if (results.length === 0) return;
    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contract-test-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const enabledCount = state.models.filter((m) => m.enabled).length;

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Test Runner</h2>
        <div className="flex gap-2">
          {results.length > 0 && !isRunning && (
            <button
              onClick={exportResults}
              className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-300 hover:border-gray-500 hover:text-white transition-colors"
            >
              Export JSON
            </button>
          )}
          <button
            onClick={runAll}
            disabled={isRunning || enabledCount === 0}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? 'Running...' : `Run All (${enabledCount})`}
          </button>
        </div>
      </div>

      {results.length === 0 && !isRunning && (
        <p className="py-6 text-center text-sm text-gray-500">
          Configure models and click "Run All" to test your prompt.
        </p>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((result) => {
            const model = state.models.find((m) => m.id === result.modelId);
            return (
              <ProgressCard
                key={result.modelId}
                result={result}
                modelName={model?.displayName ?? 'Unknown'}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProgressCard({
  result,
  modelName,
}: {
  result: ModelResult;
  modelName: string;
}) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{modelName}</span>
          <StatusBadge status={result.status} />
        </div>
        {result.status === 'success' && (
          <span className="text-xs text-gray-400">{result.latencyMs}ms</span>
        )}
      </div>

      {result.status === 'running' && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-indigo-500" />
        </div>
      )}

      {result.status === 'success' && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                result.contractPassed
                  ? 'bg-emerald-900/60 text-emerald-400'
                  : 'bg-red-900/60 text-red-400'
              }`}
            >
              {result.contractPassed ? 'Contract Passed' : 'Contract Failed'}
            </span>
            <span className="text-xs text-gray-500">
              {result.tokenCount.prompt + result.tokenCount.completion} tokens
              {' · '}${result.costEstimate.toFixed(6)}
            </span>
          </div>
          {result.validationErrors.length > 0 && (
            <details>
              <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-300">
                {result.validationErrors.length} validation error(s)
              </summary>
              <ul className="mt-1 space-y-0.5 pl-4">
                {result.validationErrors.map((err, i) => (
                  <li key={i} className="text-xs text-red-400 font-mono">
                    {err}
                  </li>
                ))}
              </ul>
            </details>
          )}
          <details>
            <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-300">
              View raw response
            </summary>
            <pre className="mt-1 max-h-40 overflow-auto rounded border border-gray-600 bg-gray-900 p-2 text-xs text-gray-300 font-mono whitespace-pre-wrap">
              {result.rawResponse}
            </pre>
          </details>
        </div>
      )}

      {result.status === 'error' && (
        <p className="text-xs text-red-400">{result.error}</p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ModelResult['status'] }) {
  const styles: Record<string, string> = {
    idle: 'bg-gray-700 text-gray-400',
    running: 'bg-yellow-900/60 text-yellow-400',
    success: 'bg-emerald-900/60 text-emerald-400',
    error: 'bg-red-900/60 text-red-400',
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
