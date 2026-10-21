import { describe, expect, it } from "vitest";
import { detectEnvironment } from "./appEnvironment";

describe("detectEnvironment", () => {
  it("should return local_dev when the hostname is local", () => {
    expect(detectEnvironment("localhost", "production")).toBe("local_dev");
    expect(detectEnvironment("127.0.0.1", undefined)).toBe("local_dev");
  });

  it("should return the configured deploy environment when it is known", () => {
    expect(detectEnvironment("app.example.com", "staging")).toBe("staging");
    expect(detectEnvironment("app.example.com", "preview")).toBe("preview");
  });

  it("should return unknown when nothing valid is configured", () => {
    expect(detectEnvironment("app.example.com", undefined)).toBe("unknown");
    expect(detectEnvironment("app.example.com", "qa")).toBe("unknown");
  });
});
