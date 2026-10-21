import { describe, expect, it, vi } from "vitest";
import type { ErrorLogRow } from "@/shared/types/errorLog.types";

const rpc = vi.fn(() => Promise.resolve({ error: null }));
const query = {
  select: vi.fn(() => query),
  in: vi.fn(() => query),
  order: vi.fn(() => query),
  limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
};
vi.mock("@/shared/services/supabaseService", () => ({
  getSupabase: () => ({ from: () => query, rpc }),
}));

const { formatErrorLogAgentPacket, listErrorLogs, updateErrorLogStatus } =
  await import("./errorLogsAdminService");

describe("errorLogsAdminService", () => {
  it("should list only open and review clusters unless closed ones are requested", async () => {
    await listErrorLogs(false);
    expect(query.in).toHaveBeenLastCalledWith("status", ["open", "review"]);
    await listErrorLogs(true);
    expect(query.in).toHaveBeenLastCalledWith("status", ["open", "review", "muted", "resolved"]);
  });

  it("should change status through the admin RPC", async () => {
    await updateErrorLogStatus("e1", "resolved");
    expect(rpc).toHaveBeenCalledWith("admin_update_error_log_status", {
      p_error_log_id: "e1",
      p_status: "resolved",
    });
  });

  it("should format an agent packet with the hash and stack", () => {
    const row = {
      hash: "abc",
      status: "open",
      type: "react_boundary",
      context: "react_boundary",
      count: 3,
      first_seen_at: "a",
      last_seen_at: "b",
      environment: "production",
      app_version: "0.41.0",
      route: "/tasks",
      message: "Cannot read properties of undefined",
      stack: "at Widget",
    } as ErrorLogRow;
    const packet = formatErrorLogAgentPacket(row);
    expect(packet.startsWith("## error_logs")).toBe(true);
    expect(packet).toContain("- hash: abc");
    expect(packet).toContain("at Widget");
  });
});
