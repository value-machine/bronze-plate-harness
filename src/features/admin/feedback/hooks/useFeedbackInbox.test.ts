import { act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderHookWithProviders } from "tests/test-utils";

const rows = [
  { id: "f1", status: "open", body: "one", context: {}, created_at: "" },
  { id: "f2", status: "review", body: "two", context: {}, created_at: "" },
];
const updateFeedbackStatus = vi.fn<(id: string, next: string) => Promise<void>>(() =>
  Promise.resolve()
);
vi.mock("@/features/admin/feedback/services/adminFeedbackService", () => ({
  listFeedbackInbox: () => Promise.resolve(rows),
  updateFeedbackStatus: (id: string, next: string) => updateFeedbackStatus(id, next),
  formatFeedbackAgentPacket: (row: { id: string }) => `packet ${row.id}`,
}));
vi.mock("@/shared/hooks/useTableSubscription", () => ({ useTableSubscription: vi.fn() }));

const { useFeedbackInbox } = await import("./useFeedbackInbox");

describe("useFeedbackInbox", () => {
  it("should drop a row from the inbox once it is handled", async () => {
    const { result } = renderHookWithProviders(() => useFeedbackInbox());
    await waitFor(() => expect(result.current.rows).toHaveLength(2));
    act(() => result.current.select("f1"));
    expect(result.current.agentPacket).toBe("packet f1");
    await act(() => result.current.setStatus("f1", "handled"));
    expect(updateFeedbackStatus).toHaveBeenCalledWith("f1", "handled");
    await waitFor(() => expect(result.current.rows.map((row) => row.id)).toEqual(["f2"]));
  });

  it("should keep a reviewed row when it is reopened", async () => {
    const { result } = renderHookWithProviders(() => useFeedbackInbox());
    await waitFor(() => expect(result.current.rows).toHaveLength(2));
    await act(() => result.current.setStatus("f2", "open"));
    await waitFor(() =>
      expect(result.current.rows.find((row) => row.id === "f2")?.status).toBe("open")
    );
  });
});
