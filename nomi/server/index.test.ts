// @vitest-environment node
import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";

vi.mock("@anthropic-ai/sdk", () => {
  return {
    Anthropic: class {
      messages = {
        create: async () => ({
          content: [
            {
              type: "text",
              text: JSON.stringify({ summary: "ok" }),
            },
          ],
        }),
      };
    },
  };
});

import { app } from "./index.js";

beforeAll(() => {
  process.env.ANTHROPIC_API_KEY = "test";
});

describe("AI server", () => {
  it("returns ok for incident assistant", async () => {
    const response = await request(app)
      .post("/api/incident-assistant")
      .send({
        provider: "claude",
        incident: {
          description: "Vorfallbeschreibung mit Details",
          incidentType: "datenleck",
          affectedPeople: "3",
          actionsTaken: "",
          date: "2025-01-01",
          time: "10:00",
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.summary).toBe("ok");
  });

  it("returns ok for avv assistant", async () => {
    const response = await request(app)
      .post("/api/avv-assistant")
      .send({
        provider: "claude",
        avv: {
          documentText:
            "Auftragsverarbeitung gemaess Art. 28 DSGVO. TOMs sind beschrieben, Unterauftragsverarbeiter nur nach Freigabe.",
          fileName: "test-avv.pdf",
          fileSizeKB: 64,
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.summary).toBe("ok");
  });
});
