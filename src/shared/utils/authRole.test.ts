import { describe, expect, it } from "vitest";
import { isAdminRole } from "./authRole";

describe("isAdminRole", () => {
  it("should accept admin and super-admin roles", () => {
    expect(isAdminRole({ appRole: "admin" })).toBe(true);
    expect(isAdminRole({ appRole: "super-admin" })).toBe(true);
  });

  it("should reject other roles, missing roles and no user", () => {
    expect(isAdminRole({ appRole: "premium" })).toBe(false);
    expect(isAdminRole({})).toBe(false);
    expect(isAdminRole(null)).toBe(false);
  });
});
