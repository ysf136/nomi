export type RetryOptions = {
  retries: number;
  baseDelayMs: number;
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= options.retries; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt >= options.retries) break;
      const delay = options.baseDelayMs * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

export type CircuitBreakerOptions = {
  failureThreshold: number;
  successThreshold: number;
  timeoutMs: number;
};

export class CircuitBreaker {
  private failureCount = 0;
  private successCount = 0;
  private state: "closed" | "open" | "half-open" = "closed";
  private nextAttempt = 0;

  constructor(private options: CircuitBreakerOptions) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();

    if (this.state === "open") {
      if (now < this.nextAttempt) {
        throw new Error("Circuit breaker open");
      }
      this.state = "half-open";
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    if (this.state === "half-open") {
      this.successCount += 1;
      if (this.successCount >= this.options.successThreshold) {
        this.reset();
      }
      return;
    }

    this.failureCount = 0;
  }

  private onFailure() {
    this.failureCount += 1;
    if (this.failureCount >= this.options.failureThreshold) {
      this.state = "open";
      this.nextAttempt = Date.now() + this.options.timeoutMs;
    }
  }

  private reset() {
    this.failureCount = 0;
    this.successCount = 0;
    this.state = "closed";
    this.nextAttempt = 0;
  }
}
