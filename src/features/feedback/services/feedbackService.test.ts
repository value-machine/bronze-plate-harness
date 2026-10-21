import { beforeEach, describe, expect, it, vi } from "vitest";

const insert = vi.fn();
const chain = {
  select: vi.fn(() => chain),
  eq: vi.fn(() => chain),
  order: vi.fn(() => chain),
  limit: vi.fn(() => Promise.resolve({ data: [{ id: "1" }], error: null })),
  update: vi.fn(() => chain),
};
vi.mock("@/shared/services/supabaseService", () => ({
  getSupabase: () => ({ from: () => ({ ...chain, insert }) }),
}));

const {
  ackFeedback,
  feedbackErrorMessage,
  listHandledFeedbackForMe,
  sendFeedback,
  validateFeedbackBody,
} = await import("./feedbackService");

describe("feedbackService", () => {
  beforeEach(() => {
    insert.mockReset();
    vi.clearAllMocks();
  });

  it("should reject empty and oversized bodies", () => {
    expect(validateFeedbackBody("   ")).toEqual({
      ok: false,
      error: "Please write your feedback first.",
    });
    expect(validateFeedbackBody("x".repeat(10001)).ok).toBe(false);
    expect(validateFeedbackBody("  great  ")).toEqual({ ok: true, body: "great" });
  });

  it("should map the daily cap and auth errors to friendly copy", () => {
    expect(feedbackErrorMessage({ code: "P0001" })).toMatch(/try again tomorrow/);
    expect(feedbackErrorMessage({ code: "42501" })).toMatch(/sign in/);
    expect(feedbackErrorMessage({ message: "JWT expired" })).toMatch(/sign in/);
    expect(feedbackErrorMessage({ code: "500" })).toMatch(/could not be sent/);
  });

  it("should insert only the submitter-writable columns", async () => {
    insert.mockResolvedValue({ error: null });
    await sendFeedback("  Love it  ");
    expect(insert).toHaveBeenCalledWith({
      body: "Love it",
      context: { route: "/", appVersion: expect.any(String) },
      environment: "local_dev",
      app_id: "app",
    });
  });

  it("should throw the mapped message when the insert fails", async () => {
    insert.mockResolvedValue({ error: { code: "P0001", message: "limit" } });
    await expect(sendFeedback("hi")).rejects.toThrow(/try again tomorrow/);
  });

  it("should list handled rows for the user and ack with the right status", async () => {
    await expect(listHandledFeedbackForMe("u1")).resolves.toEqual([{ id: "1" }]);
    expect(chain.eq).toHaveBeenCalledWith("status", "handled");
    chain.eq.mockImplementationOnce(() => chain).mockImplementationOnce(() => chain);
    (chain.update as ReturnType<typeof vi.fn>).mockImplementationOnce(() => ({
      eq: () => Promise.resolve({ error: null }),
    }));
    await ackFeedback("f1", "reopened");
    expect(chain.update).toHaveBeenCalledWith({ status: "open" });
  });
});
