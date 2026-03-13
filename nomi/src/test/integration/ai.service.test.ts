import { describe, it, expect, vi } from "vitest";

vi.mock("../../services/ai.provider", () => {
  return {
    createDefaultAiProvider: () => ({
      name: "mock",
      analyzeIncident: vi.fn().mockRejectedValue(new Error("down")),
      assessCompliance: vi.fn().mockRejectedValue(new Error("down")),
    }),
  };
});

vi.mock("../../services/audit.service", () => {
  return { logAuditEvent: vi.fn() };
});

import { analyzeIncident } from "../../services/ai.service";

describe("ai.service fallback", () => {
  it("returns fallback analysis when provider fails", async () => {
    const result = await analyzeIncident({
      description: "Test",
      incident: {
        description: "Beschreibung mit Details",
        incidentType: "datenleck",
        affectedPeople: "5",
        actionsTaken: "",
        date: "2025-01-01",
        time: "10:00",
        severity: "medium",
      },
    });

    expect(result.summary).toContain("Fallback");
  });
});
