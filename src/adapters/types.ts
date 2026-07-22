import type { ModelConfig } from '../types/index.ts';

export interface AdapterResponse {
  text: string;
  rawJson?: object;
  usage: { promptTokens: number; completionTokens: number };
  model: string;
}

export interface Adapter {
  readonly name: string;
  send(prompt: string, config: ModelConfig): Promise<AdapterResponse>;
}
