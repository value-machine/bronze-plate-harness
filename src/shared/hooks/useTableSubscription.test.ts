import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type ChangeHandler = () => void;
type StatusHandler = (status: string) => void;

const state: { change?: ChangeHandler; status?: StatusHandler } = {};
const removeChannel = vi.fn(() => Promise.resolve("ok"));
const on = vi.fn((_event: string, _opts: unknown, handler: ChangeHandler) => {
  state.change = handler;
  return { subscribe };
});
const subscribe = vi.fn((handler: StatusHandler) => {
  state.status = handler;
  return {};
});

vi.mock("@/shared/services/supabaseService", () => ({
  getSupabase: () => ({ channel: () => ({ on }), removeChannel }),
}));

const { useTableSubscription } = await import("./useTableSubscription");

describe("useTableSubscription", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    on.mockClear();
    removeChannel.mockClear();
  });
  afterEach(() => vi.useRealTimers());

  it("should debounce change events into one callback", () => {
    const onChange = vi.fn();
    renderHook(() => useTableSubscription({ table: "app_feedback", enabled: true, onChange }));
    state.change?.();
    state.change?.();
    vi.advanceTimersByTime(500);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("should not subscribe when disabled", () => {
    renderHook(() => useTableSubscription({ table: "t", enabled: false, onChange: vi.fn() }));
    expect(on).not.toHaveBeenCalled();
  });

  it("should poll until the channel is subscribed and clean up on unmount", () => {
    const onChange = vi.fn();
    const { unmount } = renderHook(() =>
      useTableSubscription({ table: "t", enabled: true, onChange, pollMs: 1000 })
    );
    vi.advanceTimersByTime(2000);
    expect(onChange).toHaveBeenCalledTimes(2);
    state.status?.("SUBSCRIBED");
    vi.advanceTimersByTime(3000);
    expect(onChange).toHaveBeenCalledTimes(2);
    unmount();
    expect(removeChannel).toHaveBeenCalledTimes(1);
  });

  it("should refresh when the tab becomes visible", () => {
    const onChange = vi.fn();
    renderHook(() => useTableSubscription({ table: "t", enabled: true, onChange }));
    document.dispatchEvent(new Event("visibilitychange"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
