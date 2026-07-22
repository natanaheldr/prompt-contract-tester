import { useAppContext } from '../context/AppContext.tsx';
import { validateSchemaSyntax } from '../utils/validateSchema.ts';
import type { ValidationRule } from '../types/index.ts';
import { VALIDATION_RULES } from '../types/index.ts';

export default function ContractEditor() {
  const { state, dispatch } = useAppContext();

  const handleValidate = () => {
    const result = validateSchemaSyntax(state.schema);
    if (!result.valid) {
      dispatch({ type: 'SET_SCHEMA_ERROR', payload: result.error });
    } else {
      dispatch({ type: 'SET_SCHEMA_ERROR', payload: null });
    }
  };

  const toggleRule = (rule: ValidationRule) => {
    const newRules = state.validationRules.includes(rule)
      ? state.validationRules.filter((r) => r !== rule)
      : [...state.validationRules, rule];
    dispatch({ type: 'SET_VALIDATION_RULES', payload: newRules });
  };

  const handleSchemaChange = (value: string) => {
    dispatch({ type: 'SET_SCHEMA', payload: value });
    if (state.schemaError) {
      dispatch({ type: 'SET_SCHEMA_ERROR', payload: null });
    }
  };

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Contract Editor</h2>
        <button
          onClick={handleValidate}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
        >
          Validate Schema
        </button>
      </div>

      <textarea
        value={state.schema}
        onChange={(e) => handleSchemaChange(e.target.value)}
        rows={10}
        className={`w-full rounded-lg border p-3 text-sm font-mono bg-gray-800 focus:outline-none focus:ring-1 resize-y ${
          state.schemaError
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-600 focus:border-emerald-500 focus:ring-emerald-500'
        } text-gray-100`}
        placeholder='{"type": "object", "properties": {...}}'
        spellCheck={false}
      />

      {state.schemaError && (
        <div className="mt-2 rounded-lg border border-red-800 bg-red-900/30 p-3">
          <p className="text-sm text-red-400">{state.schemaError}</p>
        </div>
      )}

      {!state.schemaError && state.schema.trim() && (
        <div className="mt-2 rounded-lg border border-emerald-800 bg-emerald-900/30 p-3">
          <p className="text-sm text-emerald-400">Schema is valid</p>
        </div>
      )}

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
          Validation Rules
        </p>
        <div className="flex flex-wrap gap-2">
          {VALIDATION_RULES.map((rule) => (
            <label
              key={rule}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                state.validationRules.includes(rule)
                  ? 'border-indigo-500 bg-indigo-900/40 text-indigo-300'
                  : 'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500'
              }`}
            >
              <input
                type="checkbox"
                checked={state.validationRules.includes(rule)}
                onChange={() => toggleRule(rule)}
                className="sr-only"
              />
              {rule}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
