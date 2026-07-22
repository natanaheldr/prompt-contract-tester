export const VALIDATION_RULES = ['required', 'type', 'pattern', 'additionalProperties'] as const;
export type ValidationRule = (typeof VALIDATION_RULES)[number];

export interface ModelConfig {
  id: string;
  name: string;
  displayName: string;
  apiKey: string;
  modelId: string;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
}

export interface ModelResult {
  modelId: string;
  status: 'idle' | 'running' | 'success' | 'error';
  latencyMs: number;
  rawResponse: string;
  parsedJson: object | null;
  contractPassed: boolean;
  validationErrors: string[];
  tokenCount: { prompt: number; completion: number };
  costEstimate: number;
  error?: string;
}

export interface TestRun {
  id: string;
  timestamp: number;
  prompt: string;
  schema: object;
  validationRules: ValidationRule[];
  models: ModelConfig[];
  results: ModelResult[];
}

export interface AppState {
  prompt: string;
  schema: string;
  schemaError: string | null;
  validationRules: ValidationRule[];
  models: ModelConfig[];
  testRuns: TestRun[];
}

export type AppAction =
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'SET_SCHEMA'; payload: string }
  | { type: 'SET_SCHEMA_ERROR'; payload: string | null }
  | { type: 'ADD_MODEL'; payload: ModelConfig }
  | { type: 'UPDATE_MODEL'; payload: ModelConfig }
  | { type: 'REMOVE_MODEL'; payload: string }
  | { type: 'ADD_TEST_RUN'; payload: TestRun }
  | { type: 'SET_VALIDATION_RULES'; payload: ValidationRule[] }
  | { type: 'LOAD_STATE'; payload: AppState };
