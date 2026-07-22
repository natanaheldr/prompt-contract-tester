import { useState } from 'react';
import type { ModelConfig } from '../types/index.ts';
import { generateId, useAppContext } from '../context/AppContext.tsx';

const ADAPTERS = [
  { name: 'openai' as const, label: 'OpenAI', model: 'gpt-4o', color: 'emerald' },
  { name: 'anthropic' as const, label: 'Anthropic', model: 'claude-3-5-sonnet-20241022', color: 'amber' },
  { name: 'mock' as const, label: 'Mock', model: 'mock-model', color: 'indigo' },
] as const;

const colorMap: Record<string, string> = {
  emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20',
  amber: 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20',
  indigo: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20',
};

export default function ModelConfigPanel() {
  const { state, dispatch } = useAppContext();

  const addModel = (adapter: (typeof ADAPTERS)[number]) => {
    dispatch({
      type: 'ADD_MODEL',
      payload: {
        id: generateId(),
        name: adapter.name,
        displayName: adapter.label,
        apiKey: '',
        modelId: adapter.model,
        temperature: 0.7,
        maxTokens: 1024,
        enabled: true,
      },
    });
  };

  return (
    <section className="animate-fade-in rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10">
            <svg className="h-3.5 w-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">
            Models
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          {ADAPTERS.map((a) => (
            <button
              key={a.name}
              onClick={() => addModel(a)}
              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-all ${colorMap[a.color]}`}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {state.models.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <svg className="h-8 w-8 text-[var(--color-text-muted)]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-[13px] text-[var(--color-text-muted)]">
            Add a model to get started
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {state.models.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      )}
    </section>
  );
}

function ModelCard({ model }: { model: ModelConfig }) {
  const { dispatch } = useAppContext();
  const [showKey, setShowKey] = useState(false);

  const update = (updates: Partial<ModelConfig>) => {
    dispatch({ type: 'UPDATE_MODEL', payload: { ...model, ...updates } });
  };

  return (
    <div className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/50 p-4 transition-all hover:border-[var(--color-border-hover)]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => update({ enabled: !model.enabled })}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
              model.enabled ? 'bg-indigo-500' : 'bg-[var(--color-border)]'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
                model.enabled ? 'translate-x-[18px]' : 'translate-x-[3px]'
              }`}
            />
          </button>
          <div>
            <span className="text-[12px] font-medium text-[var(--color-text-primary)]">
              {model.displayName}
            </span>
            <span className="ml-2 rounded-md bg-[var(--color-surface)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-muted)] font-mono">
              {model.name}
            </span>
          </div>
        </div>
        <button
          onClick={() => dispatch({ type: 'REMOVE_MODEL', payload: model.id })}
          className="rounded-lg p-1 text-[var(--color-text-muted)] opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        <div className="col-span-2">
          <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Model ID
          </label>
          <input
            type="text"
            value={model.modelId}
            onChange={(e) => update({ modelId: e.target.value })}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[12px] text-[var(--color-text-primary)] font-mono transition-all focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>
        <div className="col-span-2">
          <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Name
          </label>
          <input
            type="text"
            value={model.displayName}
            onChange={(e) => update({ displayName: e.target.value })}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[12px] text-[var(--color-text-primary)] transition-all focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>

        <div className="col-span-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
              API Key
            </span>
            <button
              onClick={() => setShowKey(!showKey)}
              className="text-[10px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-secondary)]"
            >
              {showKey ? 'hide' : 'show'}
            </button>
          </div>
          <input
            type={showKey ? 'text' : 'password'}
            value={model.apiKey}
            onChange={(e) => update({ apiKey: e.target.value })}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[12px] text-[var(--color-text-primary)] font-mono transition-all focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            placeholder="sk-..."
          />
        </div>

        <div className="col-span-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
              Temp
            </span>
            <span className="text-[10px] tabular-nums text-[var(--color-text-secondary)] font-mono">
              {model.temperature.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={model.temperature}
            onChange={(e) => update({ temperature: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
        <div className="col-span-2">
          <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Max tokens
          </label>
          <input
            type="number"
            min={1}
            max={4096}
            value={model.maxTokens}
            onChange={(e) => update({ maxTokens: parseInt(e.target.value) || 256 })}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[12px] text-[var(--color-text-primary)] tabular-nums transition-all focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>
      </div>
    </div>
  );
}
