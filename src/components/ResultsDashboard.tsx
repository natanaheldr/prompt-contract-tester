import { useState } from 'react';
import type { TestRun, ModelResult } from '../types/index.ts';
import { useAppContext } from '../context/AppContext.tsx';

export default function ResultsDashboard() {
  const { state } = useAppContext();
  const latestRun = state.testRuns[0];

  if (!latestRun) {
    return (
      <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
        <h2 className="mb-3 text-lg font-semibold text-white">
          Results Dashboard
        </h2>
        <p className="py-8 text-center text-sm text-gray-500">
          No test runs yet. Configure models and run a test to see results here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Results Dashboard</h2>
        <span className="text-xs text-gray-500">
          {new Date(latestRun.timestamp).toLocaleString()}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-left text-xs uppercase tracking-wide text-gray-400">
              <th className="pb-2 pr-4 font-medium">Model</th>
              <th className="pb-2 pr-4 font-medium">Latency</th>
              <th className="pb-2 pr-4 font-medium">Contract</th>
              <th className="pb-2 pr-4 font-medium">Tokens</th>
              <th className="pb-2 pr-4 font-medium">Cost</th>
              <th className="pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {latestRun.results.map((result) => (
              <ResultRow
                key={result.modelId}
                result={result}
                run={latestRun}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ResultRow({ result, run }: { result: ModelResult; run: TestRun }) {
  const [expanded, setExpanded] = useState(false);
  const model = run.models.find((m) => m.id === result.modelId);

  return (
    <>
      <tr
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
      >
        <td className="py-2.5 pr-4 font-medium text-white">
          {model?.displayName ?? 'Unknown'}
        </td>
        <td className="py-2.5 pr-4 text-gray-400">{result.latencyMs}ms</td>
        <td className="py-2.5 pr-4">
          {result.status === 'success' ? (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                result.contractPassed
                  ? 'bg-emerald-900/60 text-emerald-400'
                  : 'bg-red-900/60 text-red-400'
              }`}
            >
              {result.contractPassed ? 'PASS' : 'FAIL'}
            </span>
          ) : (
            <span className="rounded-full bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-400">
              N/A
            </span>
          )}
        </td>
        <td className="py-2.5 pr-4 text-gray-400">
          {result.tokenCount.prompt + result.tokenCount.completion}
        </td>
        <td className="py-2.5 pr-4 text-gray-400 font-mono">
          ${result.costEstimate.toFixed(6)}
        </td>
        <td className="py-2.5">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              result.status === 'success'
                ? 'bg-emerald-900/60 text-emerald-400'
                : result.status === 'error'
                  ? 'bg-red-900/60 text-red-400'
                  : 'bg-gray-700 text-gray-400'
            }`}
          >
            {result.status}
          </span>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={6} className="bg-gray-800/30 p-4">
            <div className="space-y-3">
              <div>
                <h4 className="mb-1 text-xs font-medium text-gray-400 uppercase">
                  Raw Response
                </h4>
                <pre className="max-h-48 overflow-auto rounded border border-gray-700 bg-gray-900 p-3 text-xs text-gray-300 font-mono whitespace-pre-wrap">
                  {result.rawResponse || '(empty)'}
                </pre>
              </div>
              {result.parsedJson && (
                <div>
                  <h4 className="mb-1 text-xs font-medium text-gray-400 uppercase">
                    Parsed JSON
                  </h4>
                  <pre className="max-h-48 overflow-auto rounded border border-gray-700 bg-gray-900 p-3 text-xs text-gray-300 font-mono whitespace-pre-wrap">
                    {JSON.stringify(result.parsedJson, null, 2)}
                  </pre>
                </div>
              )}
              {result.validationErrors.length > 0 && (
                <div>
                  <h4 className="mb-1 text-xs font-medium text-red-400 uppercase">
                    Validation Errors
                  </h4>
                  <ul className="space-y-0.5">
                    {result.validationErrors.map((err, i) => (
                      <li key={i} className="text-xs text-red-400 font-mono">
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.error && (
                <div>
                  <h4 className="mb-1 text-xs font-medium text-red-400 uppercase">
                    Error
                  </h4>
                  <p className="text-xs text-red-400 font-mono">
                    {result.error}
                  </p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
