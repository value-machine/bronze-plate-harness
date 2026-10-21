import { act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHookWithProviders } from "tests/test-utils";

const listHandledFeedbackForMe = vi.fn();
const ackFeedback = vi.fn();
vi.mock("@/features/feedback/services/feedbackService", () => ({
  listHandledFeedbackForMe: (id: string) => listHandledFeedbackForMe(id),
  ackFeedback: (id: string, outcome: string) => ackFeedback(id, outcome),
}));
vi.mock("@/shared/hooks/useTableSubscription", () => ({ useTableSubscription: vi.fn() }));
vi.mock("@/shared/context/AuthContext", () => ({
  useAuthContext: () => ({ user: { id: "u1", email: "a@b.c" } }),
}));

const { useHandledFeedback } = await import("./useHandledFeedback");

describe("useHandledFeedback", () => {
  beforeEach(() => {
    listHandledFeedbackForMe.mockResolvedValue([
      { id: "f1", created_at: "", body: "one", status: "handled" },
      { id: "f2", created_at: "", body: "two", status: "handled" },
    ]);
    ackFeedback.mockReset();
  });

  it("should remove an acknowledged row right away", async () => {
    ackFeedback.mockResolvedValue(undefined);
    const { result } = renderHookWithProviders(() => useHandledFeedback());
    await waitFor(() => expect(result.current.handled).toHaveLength(2));
    act(() => result.current.acknowledge("f1", "completed"));
    await waitFor(() => expect(result.current.handled.map((r) => r.id)).toEqual(["f2"]));
    expect(ackFeedback).toHaveBeenCalledWith("f1", "completed");
  });

  it("should restore the row and expose the error when the ack fails", async () => {
    ackFeedback.mockRejectedValue(new Error("Please sign in again to send feedback."));
    const { result } = renderHookWithProviders(() => useHandledFeedback());
    await waitFor(() => expect(result.current.handled).toHaveLength(2));
    act(() => result.current.acknowledge("f2", "reopened"));
    await waitFor(() => expect(result.current.error).toMatch(/sign in/));
    expect(result.current.handled).toHaveLength(2);
  });
});
