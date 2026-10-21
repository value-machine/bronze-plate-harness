import { describe, expect, it } from "vitest";
import { getErrorDetail, getErrorMessage } from "./errorUtils";

describe("errorUtils", () => {
  it("should return the message when given an Error", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
    expect(getErrorDetail(new Error("boom"))).toBe("boom");
  });

  it("should include PostgREST code, details and hint when given a PostgREST error", () => {
    const error = { message: "duplicate key", code: "23505", details: "Key (id)=(1)", hint: "" };
    expect(getErrorMessage(error)).toBe("duplicate key");
    expect(getErrorDetail(error)).toBe("[23505] duplicate key Details: Key (id)=(1)");
  });

  it("should fall back to Unknown error when nothing readable is present", () => {
    expect(getErrorDetail({})).toBe("Unknown error");
    expect(getErrorDetail(null)).toBe("Unknown error");
  });
});
