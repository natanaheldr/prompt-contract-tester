import { useAppContext } from '../context/AppContext.tsx';
import { validateSchemaSyntax } from '../utils/validateSchema.ts';
import type { ValidationRule } from '../types/index.ts';
import { VALIDATION_RULES } from '../types/index.ts';

export default function ContractEditor() {
  const { state, dispatch } = useAppContext();

  const handleValidate = () => {
    const result = validateSchemaSyntax(state.schema);
    dispatch({ type: 'SET_SCHEMA_ERROR', payload: result.valid ? null : result.error });
  };

  const toggleRule = (rule: ValidationRule) => {
    const newRules = state.validationRules.includes(rule)
      ? state.validationRules.filter((r) => r !== rule)
      : [...state.validationRules, rule];
    dispatch({ type: 'SET_VALIDATION_RULES', payload: newRules });
  };

  const handleSchemaChange = (value: string) => {
    dispatch({ type: 'SET_SCHEMA', payload: value });
    if (state.schemaError) dispatch({ type: 'SET_SCHEMA_ERROR', payload: null });
  };

  const valid = !state.schemaError && state.schema.trim().length > 0;

  return (
    <section className="animate-fade-in rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
            <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">
            Contract
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {valid && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Valid
            </span>
          )}
          {state.schemaError && (
            <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-medium text-red-400">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3l9.66 16.5H2.34L12 3z" />
              </svg>
              Invalid
            </span>
          )}
          <button
            onClick={handleValidate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-all hover:bg-emerald-500/20 hover:text-emerald-300"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Check
          </button>
        </div>
      </div>

      <textarea
        value={state.schema}
        onChange={(e) => handleSchemaChange(e.target.value)}
        rows={8}
        className={`w-full resize-y rounded-xl border bg-[var(--color-surface-elevated)] px-4 py-3 text-[13px] leading-relaxed font-mono transition-all focus:outline-none focus:ring-2 placeholder:text-[var(--color-text-muted)] ${
          state.schemaError
            ? 'border-red-500/40 text-red-300 focus:border-red-500/50 focus:ring-red-500/10'
            : valid
              ? 'border-emerald-500/30 text-[var(--color-text-primary)] focus:border-emerald-500/40 focus:ring-emerald-500/10'
              : 'border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-indigo-500/30 focus:ring-indigo-500/10'
        }`}
        placeholder='{
  "type": "object",
  "properties": { ... },
  "required": [ ... ]
}'
        spellCheck={false}
      />

      {state.schemaError && (
        <div className="mt-3 rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-3">
          <p className="text-[12px] leading-relaxed text-red-400/90 font-mono">{state.schemaError}</p>
        </div>
      )}

      <div className="mt-4 border-t border-[var(--color-border)] pt-4">
        <div className="mb-2.5 flex items-center gap-2">
          <svg className="h-3 w-3 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Rules
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {VALIDATION_RULES.map((rule) => {
            const active = state.validationRules.includes(rule);
            return (
              <button
                key={rule}
                onClick={() => toggleRule(rule)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-all ${
                  active
                    ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400'
                    : 'border-transparent bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                {active && (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {rule}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
