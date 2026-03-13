export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "AUTH_REQUIRED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "SERVER_ERROR"
  | "UNKNOWN_ERROR"
  | "AVV_PARSE_ERROR"
  | "AVV_POLICY_VIOLATION"
  | "HUMAN_REVIEW_REQUIRED";

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly statusCode?: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: AppErrorCode = "UNKNOWN_ERROR",
    statusCode?: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}
