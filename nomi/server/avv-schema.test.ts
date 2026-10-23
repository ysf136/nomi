// @vitest-environment node
import { describe, it, expect } from "vitest";
import { ART28_CHECKLIST, avvReportSchema, quoteExists } from "./avv-schema.js";

describe("avv schema", () => {
  it("validates a report", () => {
    const r = avvReportSchema.parse({
      summary: "s",
      conformity_score: 80,
      traffic_light: "gelb",
      confidence: 0.7,
      findings: [{ id: ART28_CHECKLIST[0].id, status: "teilweise", risk: "mittel" }],
    });
    expect(r.schemaVersion).toBe("1.0.0");
  });
  it("rejects unknown checklist ids", () => {
    expect(() =>
      avvReportSchema.parse({
        summary: "s", conformity_score: 1, traffic_light: "rot", confidence: 1,
        findings: [{ id: "x", status: "fehlt", risk: "hoch" }],
      }),
    ).toThrow();
  });
  it("verifies quotes", () => {
    expect(quoteExists("Der  Auftragnehmer\nhandelt weisungsgebunden.", "auftragnehmer handelt")).toBe(true);
    expect(quoteExists("abc", "xyz")).toBe(false);
  });
});
