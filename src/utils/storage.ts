import type { AppState } from '../types/index.ts';

const STORAGE_KEY = 'prompt-contract-tester-state';

export function saveState(state: AppState): void {
  try {
    const toSave = {
      ...state,
      models: state.models.map((m) => ({ ...m, apiKey: '' })),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // localStorage may be full or unavailable
  }
}

export function loadState(): Partial<AppState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<AppState>;
  } catch {
    return null;
  }
}

export function restoreApiKeys(
  state: Partial<AppState>,
  currentModels: AppState['models'],
): AppState['models'] {
  if (!state.models) return currentModels;
  return state.models.map((saved) => {
    const current = currentModels.find((m) => m.id === saved.id);
    if (current?.apiKey) {
      return { ...saved, apiKey: current.apiKey };
    }
    return saved;
  });
}
