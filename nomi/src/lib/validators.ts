import { ZodSchema, ZodError } from "zod";

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

export function validateSchema<T>(schema: ZodSchema<T>, payload: unknown): ValidationResult<T> {
  try {
    const data = schema.parse(payload);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, errors: error.issues.map((issue) => issue.message) };
    }
    return { success: false, errors: ["Validation failed"] };
  }
}
