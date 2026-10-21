import { act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderHookWithProviders } from "tests/test-utils";

const listErrorLogs = vi.fn((includeClosed: boolean) =>
  Promise.resolve(
    includeClosed
      ? [
          { id: "e1", status: "open" },
          { id: "e2", status: "muted" },
        ]
      : [{ id: "e1", status: "open" }]
  )
);
const updateErrorLogStatus = vi.fn<(id: string, next: string) => Promise<void>>(() =>
  Promise.resolve()
);
vi.mock("@/features/admin/error-logs/services/errorLogsAdminService", () => ({
  listErrorLogs: (includeClosed: boolean) => listErrorLogs(includeClosed),
  updateErrorLogStatus: (id: string, next: string) => updateErrorLogStatus(id, next),
  formatErrorLogAgentPacket: () => "packet",
}));
vi.mock("@/shared/hooks/useTableSubscription", () => ({ useTableSubscription: vi.fn() }));

const { useErrorTriage } = await import("./useErrorTriage");

describe("useErrorTriage", () => {
  it("should hide a resolved cluster from the default list", async () => {
    const { result } = renderHookWithProviders(() => useErrorTriage());
    await waitFor(() => expect(result.current.rows).toHaveLength(1));
    await act(() => result.current.setStatus("e1", "resolved"));
    expect(updateErrorLogStatus).toHaveBeenCalledWith("e1", "resolved");
    await waitFor(() => expect(result.current.rows).toHaveLength(0));
  });

  it("should load muted and resolved clusters when asked", async () => {
    const { result } = renderHookWithProviders(() => useErrorTriage());
    act(() => result.current.setIncludeClosed(true));
    await waitFor(() => expect(result.current.rows).toHaveLength(2));
    expect(listErrorLogs).toHaveBeenCalledWith(true);
  });
});
