import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type Dispatch,
  type ReactNode,
} from 'react';
import type {
  AppState,
  AppAction,
  ModelConfig,
  TestRun,
  ValidationRule,
} from '../types/index.ts';
import { saveState, loadState, restoreApiKeys } from '../utils/storage.ts';

function generateId(): string {
  return crypto.randomUUID();
}

export const DEFAULT_MODELS: ModelConfig[] = [
  {
    id: generateId(),
    name: 'openai',
    displayName: 'GPT-4o',
    apiKey: '',
    modelId: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 1024,
    enabled: true,
  },
  {
    id: generateId(),
    name: 'anthropic',
    displayName: 'Claude 3.5 Sonnet',
    apiKey: '',
    modelId: 'claude-3-5-sonnet-20241022',
    temperature: 0.7,
    maxTokens: 1024,
    enabled: true,
  },
  {
    id: generateId(),
    name: 'mock',
    displayName: 'Mock Local',
    apiKey: '',
    modelId: 'mock-model',
    temperature: 0,
    maxTokens: 256,
    enabled: true,
  },
];

const DEFAULT_SCHEMA = JSON.stringify(
  {
    type: 'object',
    properties: {
      result: { type: 'string' },
      data: {
        type: 'object',
        properties: {
          answer: { type: 'string' },
          confidence: { type: 'number' },
        },
        required: ['answer', 'confidence'],
      },
    },
    required: ['result', 'data'],
  },
  null,
  2,
);

const DEFAULT_PROMPT =
  'Answer the following question about {{topic}} in {{language}}.\n\nQuestion: What are the key concepts of {{topic}}?\n\nRespond with valid JSON only.';

const initialState: AppState = {
  prompt: DEFAULT_PROMPT,
  schema: DEFAULT_SCHEMA,
  schemaError: null,
  validationRules: ['required', 'type'],
  models: DEFAULT_MODELS,
  testRuns: [],
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PROMPT':
      return { ...state, prompt: action.payload };
    case 'SET_SCHEMA':
      return { ...state, schema: action.payload };
    case 'SET_SCHEMA_ERROR':
      return { ...state, schemaError: action.payload };
    case 'ADD_MODEL':
      return { ...state, models: [...state.models, action.payload] };
    case 'UPDATE_MODEL':
      return {
        ...state,
        models: state.models.map((m) =>
          m.id === action.payload.id ? action.payload : m,
        ),
      };
    case 'REMOVE_MODEL':
      return {
        ...state,
        models: state.models.filter((m) => m.id !== action.payload),
      };
    case 'ADD_TEST_RUN':
      return {
        ...state,
        testRuns: [action.payload, ...state.testRuns].slice(0, 50),
      };
    case 'SET_VALIDATION_RULES':
      return { ...state, validationRules: action.payload };
    case 'LOAD_STATE':
      return { ...action.payload };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      const restoredModels = restoreApiKeys(saved, state.models);
      dispatch({
        type: 'LOAD_STATE',
        payload: {
          ...initialState,
          ...saved,
          models: restoredModels,
        } as AppState,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistDispatch = useCallback(
    (action: AppAction) => {
      dispatch(action);
    },
    [],
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch: persistDispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

export type { AppState, AppAction, TestRun, ModelConfig, ValidationRule };
export { generateId };
