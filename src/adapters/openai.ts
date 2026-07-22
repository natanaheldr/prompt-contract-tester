import axios from 'axios';
import type { ModelConfig } from '../types/index.ts';
import type { Adapter, AdapterResponse } from './types.ts';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

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

export const openaiAdapter: Adapter = {
  name: 'openai',

  async send(prompt: string, config: ModelConfig): Promise<AdapterResponse> {
    try {
      const response = await axios.post(
        OPENAI_URL,
        {
          model: config.modelId,
          messages: [{ role: 'user', content: prompt }],
          temperature: config.temperature,
          max_tokens: config.maxTokens,
        },
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const content = response.data.choices[0]?.message?.content ?? '';
      const rawJson = tryParseJson(content);

      return {
        text: content,
        rawJson,
        usage: {
          promptTokens:
            response.data.usage?.prompt_tokens ?? estimateTokens(prompt),
          completionTokens:
            response.data.usage?.completion_tokens ?? estimateTokens(content),
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
        error instanceof Error ? error.message : 'Unknown error calling OpenAI',
      );
    }
  },
};
