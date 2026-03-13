import { AppError } from "../types/errors";

export type ApiClientOptions = {
  baseUrl?: string;
  timeoutMs?: number;
  getAuthToken?: () => Promise<string | null>;
};

export class ApiClient {
  private baseUrl: string;
  private timeoutMs: number;
  private getAuthToken?: () => Promise<string | null>;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? import.meta.env.VITE_API_BASE_URL ?? "";
    this.timeoutMs = options.timeoutMs ?? 15000;
    this.getAuthToken = options.getAuthToken;
  }

  async get<T>(path: string, init?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...init, method: "GET" });
  }

  async post<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...init,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...init,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...init,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(path: string, init?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...init, method: "DELETE" });
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const headers = await this.buildHeaders(init.headers);
      const response = await fetch(this.resolveUrl(path), {
        ...init,
        headers,
        signal: controller.signal,
      });

      if (!response.ok) {
        const details = await this.safeParseJson(response);
        throw new AppError(
          details?.message ?? `Request failed with status ${response.status}`,
          "SERVER_ERROR",
          response.status,
          details ?? undefined
        );
      }

      const data = await this.safeParseJson(response);
      return data as T;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new AppError("Request timed out", "SERVER_ERROR", 408);
      }
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Unexpected API error", "UNKNOWN_ERROR");
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private resolveUrl(path: string): string {
    if (path.startsWith("http")) {
      return path;
    }
    const normalizedBase = this.baseUrl.replace(/\/$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
  }

  private async buildHeaders(headers?: HeadersInit): Promise<HeadersInit> {
    const token = this.getAuthToken ? await this.getAuthToken() : null;
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    };
  }

  private async safeParseJson(response: Response): Promise<any> {
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return { message: text };
    }
  }
}
