export function detectPlaceholders(prompt: string): string[] {
  const regex = /\{\{(\w+)\}\}/g;
  const placeholders = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = regex.exec(prompt)) !== null) {
    placeholders.add(match[1]);
  }
  return Array.from(placeholders);
}

export function fillPlaceholders(
  prompt: string,
  values: Record<string, string>,
): string {
  return prompt.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    return values[key] ?? `{{${key}}}`;
  });
}
