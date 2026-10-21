import { describe, expect, it, vi } from "vitest";
import type { FeedbackRow } from "@/shared/types/feedback.types";

const query = {
  select: vi.fn(() => query),
  in: vi.fn(() => query),
  order: vi.fn(() => query),
  limit: vi.fn(() => Promise.resolve({ data: [{ id: "f1" }], error: null })),
  update: vi.fn(() => ({ eq: vi.fn(() => Promise.resolve({ error: null })) })),
};
vi.mock("@/shared/services/supabaseService", () => ({
  getSupabase: () => ({ from: () => query }),
}));

const { formatFeedbackAgentPacket, listFeedbackInbox, updateFeedbackStatus } =
  await import("./adminFeedbackService");

const row: FeedbackRow = {
  id: "f1",
  created_at: "2026-10-21T10:00:00Z",
  updated_at: "2026-10-21T10:00:00Z",
  user_id: "u1",
  user_name: "Alice",
  user_email: "alice@example.com",
  body: "The save button does nothing.",
  status: "open",
  context: { route: "/tasks", appVersion: "0.41.0" },
  environment: "production",
  submitter_resolution: {},
  app_id: "app",
};

describe("adminFeedbackService", () => {
  it("should list open and review rows with projected columns", async () => {
    await expect(listFeedbackInbox()).resolves.toEqual([{ id: "f1" }]);
    expect(query.in).toHaveBeenCalledWith("status", ["open", "review"]);
    expect(query.select).toHaveBeenCalledWith(expect.not.stringContaining("*"));
  });

  it("should update the status", async () => {
    await updateFeedbackStatus("f1", "handled");
    expect(query.update).toHaveBeenCalledWith({ status: "handled" });
  });

  it("should format an agent packet without the submitter's identity", () => {
    const packet = formatFeedbackAgentPacket(row);
    expect(packet.startsWith("## app_feedback")).toBe(true);
    expect(packet).toContain("- route: /tasks");
    expect(packet).toContain("The save button does nothing.");
    expect(packet).not.toContain("alice@example.com");
  });
});
