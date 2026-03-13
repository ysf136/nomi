import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiClient } from "./api.client";

describe("ApiClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("adds auth header when token is provided", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ ok: true }),
    });
    globalThis.fetch = fetchMock as any;

    const client = new ApiClient({
      baseUrl: "http://localhost",
      getAuthToken: async () => "token123",
    });

    await client.get("/test");
    const [, request] = fetchMock.mock.calls[0];
    const headers = request.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer token123");
  });

  it("throws on non-ok responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => JSON.stringify({ message: "fail" }),
    });
    globalThis.fetch = fetchMock as any;

    const client = new ApiClient({ baseUrl: "http://localhost" });

    await expect(client.get("/test")).rejects.toThrow("fail");
  });
});
