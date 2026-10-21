import { beforeEach, describe, expect, it, vi } from "vitest";

const rpc = vi.fn(() => Promise.resolve({ data: null, error: null }));
const getSession = vi.fn(() => Promise.resolve({ data: { session: { user: { id: "u1" } } } }));
const configured = vi.fn(() => true);

vi.mock("@/shared/services/supabaseService", () => ({
  isSupabaseConfigured: () => configured(),
  getSupabase: () => ({ rpc, auth: { getSession } }),
}));

const {
  buildErrorLogPayload,
  logAppError,
  logError,
  registerGlobalErrorHandler,
  resetErrorLogThrottleForTests,
  scrubErrorText,
} = await import("./errorLoggingService");

describe("errorLoggingService", () => {
  beforeEach(() => {
    rpc.mockClear();
    getSession.mockClear();
    configured.mockReturnValue(true);
    resetErrorLogThrottleForTests();
  });

  it("should send one RPC with the scrubbed payload when signed in", async () => {
    await logAppError(new Error("boom for a@b.com"), "TasksService.load");
    expect(rpc).toHaveBeenCalledTimes(1);
    expect(rpc).toHaveBeenCalledWith(
      "upsert_error_log",
      expect.objectContaining({
        p_message: "boom for :email",
        p_context: "TasksService.load",
        p_type: "log_error",
        p_route: "/",
      })
    );
  });

  it("should do nothing when Supabase is not configured", async () => {
    configured.mockReturnValue(false);
    await logAppError(new Error("boom"), "ctx");
    expect(rpc).not.toHaveBeenCalled();
  });

  it("should do nothing when nobody is signed in", async () => {
    getSession.mockResolvedValueOnce({ data: { session: null } } as never);
    await logAppError(new Error("boom"), "ctx");
    expect(rpc).not.toHaveBeenCalled();
  });

  it("should throttle repeats of the same error group within the window", async () => {
    await logAppError(new Error("render failed 1"), "ctx");
    await logAppError(new Error("render failed 2"), "ctx");
    await logAppError(new Error("other"), "ctx");
    expect(rpc).toHaveBeenCalledTimes(2);
  });

  it("should stop sending after 50 sends in one page session", async () => {
    for (let i = 0; i < 60; i += 1) {
      await logAppError(
        new Error(
          `distinct ${String.fromCharCode(65 + (i % 26))}${i > 25 ? "x" : ""}${i > 51 ? "y" : ""}`
        ),
        "ctx"
      );
    }
    expect(rpc).toHaveBeenCalledTimes(50);
  });

  it("should never throw when the sink fails", async () => {
    rpc.mockRejectedValueOnce(new Error("network"));
    await expect(logAppError(new Error("boom"), "ctx")).resolves.toBeUndefined();
  });

  it("should scrub tokens, emails, query strings and long keys", () => {
    const text =
      "Bearer abc.def eyJhbGciOi.eyJzdWIi.sig https://x.io/cb?code=secret#t user@site.org " +
      "a".repeat(40);
    expect(scrubErrorText(text)).toBe("Bearer :token :token https://x.io/cb :email :hex");
  });

  it("should append the component stack and truncate long fields", () => {
    const error = new Error("m".repeat(20000));
    const payload = buildErrorLogPayload(error, "react_boundary", "react_boundary", {
      extraStack: "\n    at Widget",
    });
    expect(payload.message).toHaveLength(10000);
    expect(payload.stack?.length).toBeLessThanOrEqual(20000);
    expect(payload.stack?.endsWith("Component stack:\n    at Widget")).toBe(true);
    expect(payload.browserInfo).toEqual({
      userAgent: expect.any(String),
      language: expect.any(String),
    });
  });

  it("should console.error and log centrally when logError is called", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    logError("Feature.action", new Error("bad"));
    await vi.waitFor(() => expect(rpc).toHaveBeenCalledTimes(1));
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should log window errors and unhandled rejections once registered", async () => {
    registerGlobalErrorHandler();
    registerGlobalErrorHandler();
    window.dispatchEvent(new ErrorEvent("error", { error: new Error("uncaught"), message: "x" }));
    const rejection = new Event("unhandledrejection") as PromiseRejectionEvent;
    Object.defineProperty(rejection, "reason", { value: new Error("rejected") });
    window.dispatchEvent(rejection);
    await vi.waitFor(() => expect(rpc).toHaveBeenCalledTimes(2));
    expect(rpc).toHaveBeenCalledWith(
      "upsert_error_log",
      expect.objectContaining({ p_type: "window_error", p_context: "window.error" })
    );
  });
});
