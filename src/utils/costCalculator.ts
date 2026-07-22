const COST_PER_1K: Record<string, { prompt: number; completion: number }> = {
  'gpt-4o': { prompt: 0.0025, completion: 0.01 },
  'gpt-4o-mini': { prompt: 0.00015, completion: 0.0006 },
  'gpt-4-turbo': { prompt: 0.01, completion: 0.03 },
  'gpt-3.5-turbo': { prompt: 0.0005, completion: 0.0015 },
  'claude-3-5-sonnet-20241022': { prompt: 0.003, completion: 0.015 },
  'claude-3-opus-20240229': { prompt: 0.015, completion: 0.075 },
  'claude-3-sonnet-20240229': { prompt: 0.003, completion: 0.015 },
  'claude-3-haiku-20240307': { prompt: 0.00025, completion: 0.00125 },
  'mock-model': { prompt: 0, completion: 0 },
};

export function calculateCost(
  modelId: string,
  promptTokens: number,
  completionTokens: number,
): number {
  const rates = COST_PER_1K[modelId] ?? COST_PER_1K['gpt-4o'];
  if (!rates) return 0;
  return (
    (promptTokens / 1000) * rates.prompt +
    (completionTokens / 1000) * rates.completion
  );
}
