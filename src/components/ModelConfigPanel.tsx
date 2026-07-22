import { useState } from 'react';
import type { ModelConfig } from '../types/index.ts';
import { generateId, useAppContext } from '../context/AppContext.tsx';

const ADAPTERS = [
  { name: 'openai' as const, displayName: 'OpenAI', defaultModel: 'gpt-4o' },
  {
    name: 'anthropic' as const,
    displayName: 'Anthropic',
    defaultModel: 'claude-3-5-sonnet-20241022',
  },
  { name: 'mock' as const, displayName: 'Mock', defaultModel: 'mock-model' },
] as const;

export default function ModelConfigPanel() {
  const { state, dispatch } = useAppContext();

  const addModel = (adapter: (typeof ADAPTERS)[number]) => {
    const newModel: ModelConfig = {
      id: generateId(),
      name: adapter.name,
      displayName: adapter.displayName,
      apiKey: '',
      modelId: adapter.defaultModel,
      temperature: 0.7,
      maxTokens: 1024,
      enabled: true,
    };
    dispatch({ type: 'ADD_MODEL', payload: newModel });
  };

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Model Configuration</h2>
        <div className="flex gap-2">
          {ADAPTERS.map((adapter) => (
            <button
              key={adapter.name}
              onClick={() => addModel(adapter)}
              className="rounded-lg border border-gray-600 bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-gray-300 hover:border-gray-500 hover:text-white transition-colors"
            >
              + {adapter.displayName}
            </button>
          ))}
        </div>
      </div>

      {state.models.length === 0 && (
        <p className="py-6 text-center text-sm text-gray-500">
          No models configured. Add one using the buttons above.
        </p>
      )}

      <div className="space-y-3">
        {state.models.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  );
}

function ModelCard({ model }: { model: ModelConfig }) {
  const { dispatch } = useAppContext();
  const [showKey, setShowKey] = useState(false);

  const update = (updates: Partial<ModelConfig>) => {
    dispatch({ type: 'UPDATE_MODEL', payload: { ...model, ...updates } });
  };

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={model.enabled}
              onChange={(e) => update({ enabled: e.target.checked })}
              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-white">
              {model.displayName}
            </span>
          </label>
          <span className="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-400 font-mono">
            {model.name}
          </span>
        </div>
        <button
          onClick={() => dispatch({ type: 'REMOVE_MODEL', payload: model.id })}
          className="rounded p-1 text-gray-500 hover:text-red-400 hover:bg-gray-700 transition-colors"
          title="Remove model"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-gray-400">Model ID</label>
          <input
            type="text"
            value={model.modelId}
            onChange={(e) => update({ modelId: e.target.value })}
            className="w-full rounded-md border border-gray-600 bg-gray-700 px-2 py-1.5 text-sm text-gray-100 font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-400">Display Name</label>
          <input
            type="text"
            value={model.displayName}
            onChange={(e) => update({ displayName: e.target.value })}
            className="w-full rounded-md border border-gray-600 bg-gray-700 px-2 py-1.5 text-sm text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="col-span-2">
          <label className="mb-1 flex items-center justify-between text-xs text-gray-400">
            <span>API Key</span>
            <button
              onClick={() => setShowKey(!showKey)}
              className="text-indigo-400 hover:text-indigo-300"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </label>
          <input
            type={showKey ? 'text' : 'password'}
            value={model.apiKey}
            onChange={(e) => update({ apiKey: e.target.value })}
            className="w-full rounded-md border border-gray-600 bg-gray-700 px-2 py-1.5 text-sm text-gray-100 font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="sk-..."
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-400">
            Temperature: {model.temperature}
          </label>
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={model.temperature}
            onChange={(e) => update({ temperature: parseFloat(e.target.value) })}
            className="w-full accent-indigo-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-400">Max Tokens</label>
          <input
            type="number"
            min={1}
            max={4096}
            value={model.maxTokens}
            onChange={(e) => update({ maxTokens: parseInt(e.target.value) || 256 })}
            className="w-full rounded-md border border-gray-600 bg-gray-700 px-2 py-1.5 text-sm text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
