import { describe, it, expect } from 'vitest';
import {
  validateSchemaSyntax,
  validateData,
} from '../src/utils/validateSchema.ts';

const VALID_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' },
  },
  required: ['name', 'age'],
};

const VALID_SCHEMA_STRING = JSON.stringify(VALID_SCHEMA);

describe('validateSchemaSyntax', () => {
  it('should accept a valid JSON Schema', () => {
    const result = validateSchemaSyntax(VALID_SCHEMA_STRING);
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
    expect(result.parsed).toBeDefined();
  });

  it('should reject invalid JSON', () => {
    const result = validateSchemaSyntax('not json');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid JSON');
  });

  it('should reject invalid JSON Schema', () => {
    const result = validateSchemaSyntax('{ "type": "nonexistent" }');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('validateData', () => {
  it('should pass when data matches schema', () => {
    const result = validateData(VALID_SCHEMA, { name: 'Alice', age: 30 }, [
      'required',
      'type',
    ]);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should fail when required field is missing', () => {
    const result = validateData(VALID_SCHEMA, { name: 'Alice' }, [
      'required',
      'type',
    ]);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some((e) => e.includes('age'))).toBe(true);
  });

  it('should fail on type mismatch', () => {
    const result = validateData(
      VALID_SCHEMA,
      { name: 'Alice', age: 'not-a-number' },
      ['required', 'type'],
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('number'))).toBe(true);
  });

  it('should handle null/undefined data', () => {
    const result = validateData(VALID_SCHEMA, null, ['required', 'type']);
    expect(result.valid).toBe(false);
  });

  it('should pass when no rules are active', () => {
    const result = validateData(VALID_SCHEMA, { name: 'Bob' }, []);
    expect(result.valid).toBe(true);
  });
});
