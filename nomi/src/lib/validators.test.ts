import { describe, it, expect } from "vitest";
import { incidentSchema } from "./validation-schemas";
import { validateSchema } from "./validators";

describe("validateSchema", () => {
  it("returns success for valid incident", () => {
    const payload = {
      description: "Vorfallbeschreibung mit Details",
      incidentType: "datenleck",
      affectedPeople: "12",
      actionsTaken: "Passwort reset",
      date: "2025-01-01",
      time: "12:30",
      severity: "medium",
    };

    const result = validateSchema(incidentSchema, payload);
    expect(result.success).toBe(true);
  });

  it("returns errors for invalid incident", () => {
    const payload = {
      description: "zu kurz",
      incidentType: "a",
      affectedPeople: "",
      date: "",
      time: "",
    };

    const result = validateSchema(incidentSchema, payload);
    expect(result.success).toBe(false);
  });
});
