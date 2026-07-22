import Ajv, { type ErrorObject } from 'ajv';

const ajv = new Ajv({ allErrors: true, strict: false });

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateSchemaSyntax(schemaString: string): {
  valid: boolean;
  error: string | null;
  parsed: object | null;
} {
  try {
    const parsed = JSON.parse(schemaString);
    try {
      ajv.compile(parsed);
      return { valid: true, error: null, parsed };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON Schema';
      return { valid: false, error: msg, parsed: null };
    }
  } catch {
    return { valid: false, error: 'Invalid JSON syntax', parsed: null };
  }
}

function formatErrors(errors: ErrorObject[] | null | undefined): string[] {
  if (!errors) return [];
  return errors.map((e) => {
    const path = e.instancePath || '/';
    return `${path}: ${e.message ?? 'validation failed'}`;
  });
}

export function validateData(
  schema: object,
  data: unknown,
  rules: string[],
): ValidationResult {
  if (rules.length === 0) {
    return { valid: true, errors: [] };
  }

  try {
    const validate = ajv.compile(schema);

    if (rules.includes('additionalProperties')) {
      Object.assign(schema, { additionalProperties: false });
    }

    const valid = validate(data) as boolean;
    const errors = valid ? [] : formatErrors(validate.errors);

    return { valid, errors };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Validation error';
    return { valid: false, errors: [msg] };
  }
}
