import { useAppContext } from '../context/AppContext.tsx';
import { useMemo, useState } from 'react';
import { detectPlaceholders, fillPlaceholders } from '../utils/placeholderParser.ts';

export default function PromptEditor() {
  const { state, dispatch } = useAppContext();
  const placeholders = useMemo(() => detectPlaceholders(state.prompt), [state.prompt]);
  const [values, setValues] = useState<Record<string, string>>({});

  const loadExample = () => {
    dispatch({
      type: 'SET_PROMPT',
      payload:
        'Answer the following question about {{topic}} in {{language}}.\n\nQuestion: What are the key concepts of {{topic}}?\n\nRespond with valid JSON only.',
    });
    setValues({});
  };

  const renderedPrompt = useMemo(
    () => fillPlaceholders(state.prompt, values),
    [state.prompt, values],
  );

  return (
    <section className="animate-fade-in rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10">
            <svg className="h-3.5 w-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">
            Prompt
          </h2>
        </div>
        <button
          onClick={loadExample}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400 transition-all hover:bg-indigo-500/20 hover:text-indigo-300"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Example
        </button>
      </div>

      <textarea
        value={state.prompt}
        onChange={(e) => dispatch({ type: 'SET_PROMPT', payload: e.target.value })}
        rows={5}
        className="w-full resize-y rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 text-[13px] leading-relaxed text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] font-mono transition-all focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
        placeholder="Write your prompt here — use {{placeholders}} for dynamic values..."
        spellCheck={false}
      />

      {placeholders.length > 0 && (
        <div className="mt-4 border-t border-[var(--color-border)] pt-4">
          <div className="mb-2.5 flex items-center gap-2">
            <svg className="h-3 w-3 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
              Values
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {placeholders.map((key) => (
              <label key={key} className="group block">
                <span className="mb-1.5 block text-[11px] font-medium text-[var(--color-text-muted)]">
                  {`{{${key}}}`}
                </span>
                <input
                  type="text"
                  value={values[key] ?? ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-[13px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                  placeholder={key}
                />
              </label>
            ))}
          </div>

          {Object.keys(values).length > 0 && (
            <details className="mt-3 group">
              <summary className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-text-secondary)]">
                <svg className="h-3 w-3 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                Preview rendered output
              </summary>
              <pre className="mt-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[12px] leading-relaxed text-[var(--color-text-secondary)] font-mono whitespace-pre-wrap">
                {renderedPrompt}
              </pre>
            </details>
          )}
        </div>
      )}
    </section>
  );
}
