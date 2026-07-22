import axios from 'axios';
import type { ModelConfig } from '../types/index.ts';
import type { Adapter, AdapterResponse } from './types.ts';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function tryParseJson(text: string): object | undefined {
  try {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      return JSON.parse(match[1].trim());
    }
    return JSON.parse(text.trim());
  } catch {
    return undefined;
  }
}

export const anthropicAdapter: Adapter = {
  name: 'anthropic',

  async send(prompt: string, config: ModelConfig): Promise<AdapterResponse> {
    try {
      const response = await axios.post(
        ANTHROPIC_URL,
        {
          model: config.modelId,
          max_tokens: config.maxTokens,
          messages: [{ role: 'user', content: prompt }],
          temperature: config.temperature,
        },
        {
          headers: {
            'x-api-key': config.apiKey,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01',
          },
        },
      );

      const content = response.data.content?.[0]?.text ?? '';
      const rawJson = tryParseJson(content);

      return {
        text: content,
        rawJson,
        usage: {
          promptTokens:
            response.data.usage?.input_tokens ?? estimateTokens(prompt),
          completionTokens:
            response.data.usage?.output_tokens ?? estimateTokens(content),
        },
        model: response.data.model ?? config.modelId,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 401) throw new Error('Invalid API key (401)');
        if (status === 429) throw new Error('Rate limited (429). Try again later.');
        if (status >= 500) throw new Error(`Server error (${status})`);
      }
      throw new Error(
        error instanceof Error ? error.message : 'Unknown error calling Anthropic',
      );
    }
  },
};
