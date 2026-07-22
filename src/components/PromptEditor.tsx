import { useAppContext } from '../context/AppContext.tsx';
import { useMemo, useState } from 'react';
import { detectPlaceholders, fillPlaceholders } from '../utils/placeholderParser.ts';

export default function PromptEditor() {
  const { state, dispatch } = useAppContext();
  const placeholders = useMemo(
    () => detectPlaceholders(state.prompt),
    [state.prompt],
  );
  const [values, setValues] = useState<Record<string, string>>({});

  const loadExample = () => {
    dispatch({
      type: 'SET_PROMPT',
      payload:
        'Answer the following question about {{topic}} in {{language}}.\n\nQuestion: What are the key concepts of {{topic}}?\n\nRespond with valid JSON only.',
    });
    setValues({});
  };

  const handlePlaceholderChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const renderedPrompt = useMemo(
    () => fillPlaceholders(state.prompt, values),
    [state.prompt, values],
  );

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Prompt Editor</h2>
        <button
          onClick={loadExample}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
        >
          Load Example
        </button>
      </div>

      <textarea
        value={state.prompt}
        onChange={(e) => dispatch({ type: 'SET_PROMPT', payload: e.target.value })}
        rows={6}
        className="w-full rounded-lg border border-gray-600 bg-gray-800 p-3 text-sm text-gray-100 font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
        placeholder="Write your prompt with {{placeholders}}..."
        spellCheck={false}
      />

      {placeholders.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Placeholder Values
          </p>
          <div className="grid grid-cols-2 gap-3">
            {placeholders.map((key) => (
              <div key={key}>
                <label className="mb-1 block text-xs text-gray-400">
                  {`{{${key}}}`}
                </label>
                <input
                  type="text"
                  value={values[key] ?? ''}
                  onChange={(e) => handlePlaceholderChange(key, e.target.value)}
                  className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-1.5 text-sm text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder={`Value for ${key}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {values && Object.keys(values).length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300">
            Preview rendered prompt
          </summary>
          <pre className="mt-2 rounded-lg border border-gray-600 bg-gray-800 p-3 text-xs text-gray-300 font-mono whitespace-pre-wrap">
            {renderedPrompt}
          </pre>
        </details>
      )}
    </div>
  );
}
