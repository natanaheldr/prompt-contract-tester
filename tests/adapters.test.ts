import { describe, it, expect, vi } from 'vitest';
import { mockAdapter } from '../src/adapters/mock.ts';
import type { ModelConfig } from '../src/types/index.ts';

const mockConfig: ModelConfig = {
  id: 'test-mock',
  name: 'mock',
  displayName: 'Mock Local',
  apiKey: '',
  modelId: 'mock-model',
  temperature: 0,
  maxTokens: 256,
  enabled: true,
};

describe('Mock Adapter', () => {
  it('should return a deterministic response with correct shape', async () => {
    const response = await mockAdapter.send('test prompt', mockConfig);

    expect(response.text).toBeDefined();
    expect(response.text).toContain('result');
    expect(response.rawJson).toBeDefined();
  });

  it('should return the expected object schema', async () => {
    const response = await mockAdapter.send('hello', mockConfig);

    expect(response.rawJson).toMatchObject({
      result: 'success',
      data: {
        answer: expect.any(String),
        confidence: expect.any(Number),
      },
    });
  });

  it('should return usage stats', async () => {
    const response = await mockAdapter.send('test', mockConfig);

    expect(response.usage.promptTokens).toBeGreaterThan(0);
    expect(response.usage.completionTokens).toBeGreaterThan(0);
    expect(response.model).toBe('mock-model');
  });

  it('should take approximately 200ms', async () => {
    const start = performance.now();
    await mockAdapter.send('test', mockConfig);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(150);
    expect(elapsed).toBeLessThan(500);
  });
});
