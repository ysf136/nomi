import { describe, it, expect } from "vitest";
import { sanitizeMultiline, sanitizeText } from "./sanitizers";

describe("sanitizers", () => {
  it("sanitizes control characters", () => {
    const value = "Test\u0001 Text";
    expect(sanitizeText(value)).toBe("Test Text");
  });

  it("normalizes multiline content", () => {
    const value = "Line1\r\nLine2";
    expect(sanitizeMultiline(value)).toBe("Line1\nLine2");
  });
});
