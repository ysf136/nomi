const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

export function sanitizeText(value: string): string {
  return value.replace(CONTROL_CHARS, "").trim();
}

export function sanitizeMultiline(value: string): string {
  return value.replace(CONTROL_CHARS, "").replace(/\r\n/g, "\n").trim();
}

export function sanitizeStringArray(values: string[]): string[] {
  return values.map((value) => sanitizeText(value)).filter(Boolean);
}
