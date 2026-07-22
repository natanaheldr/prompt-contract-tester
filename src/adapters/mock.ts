import type { ModelConfig } from '../types/index.ts';
import type { Adapter, AdapterResponse } from './types.ts';

const MOCK_RESPONSE = {
  result: 'success',
  data: {
    answer: 'This is a deterministic mock response for testing purposes.',
    confidence: 0.95,
  },
};

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export const mockAdapter: Adapter = {
  name: 'mock',

  async send(prompt: string, config: ModelConfig): Promise<AdapterResponse> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const text = JSON.stringify(MOCK_RESPONSE, null, 2);

    return {
      text,
      rawJson: MOCK_RESPONSE,
      usage: {
        promptTokens: estimateTokens(prompt),
        completionTokens: estimateTokens(text),
      },
      model: config.modelId,
    };
  },
};
