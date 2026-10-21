/**
 * Central runtime error logging (Bug Triage). Contract: documentation/DOC_ERROR_LOGGING_CONTRACT.md
 *
 * - Writes go through the `upsert_error_log` RPC; the database computes the cluster hash.
 * - Silent no-op when Supabase is not configured or nobody is signed in.
 * - Never throws and never logs its own failures to the sink (no recursion).
 * - Client throttle: one send per error group per 10s, at most 50 sends per page session.
 */
import { detectEnvironment, getAppVersion } from "@/shared/utils/appEnvironment";
import { getErrorDetail } from "@/shared/utils/errorUtils";
import { getSupabase, isSupabaseConfigured } from "@/shared/services/supabaseService";

export type ErrorLogType =
  | "react_boundary"
  | "window_error"
  | "unhandled_rejection"
  | "log_error"
  | "service_error";

export interface LogAppErrorOptions {
  /** Extra stack text appended to the error stack (e.g. React componentStack). */
  extraStack?: string;
}

export interface ErrorLogPayload {
  message: string;
  stack: string | null;
  context: string;
  type: ErrorLogType;
  route: string;
  browserInfo: { userAgent: string; language: string };
  appVersion: string;
  environment: string;
}

/** Destination for error payloads. Swap the implementation to send errors elsewhere. */
export interface ErrorSink {
  isAvailable(): Promise<boolean>;
  send(payload: ErrorLogPayload): Promise<void>;
}

const MAX_MESSAGE = 10000;
const MAX_STACK = 20000;
const MAX_CONTEXT = 500;
const THROTTLE_MS = 10_000;
const MAX_SENDS_PER_SESSION = 50;

const supabaseSink: ErrorSink = {
  async isAvailable() {
    if (!isSupabaseConfigured()) {
      return false;
    }
    const { data } = await getSupabase().auth.getSession();
    return Boolean(data.session);
  },
  async send(payload) {
    await getSupabase().rpc("upsert_error_log", {
      p_message: payload.message,
      p_stack: payload.stack,
      p_context: payload.context,
      p_type: payload.type,
      p_route: payload.route,
      p_browser_info: payload.browserInfo,
      p_app_version: payload.appVersion,
      p_environment: payload.environment,
    });
  },
};

const sink: ErrorSink = supabaseSink;
const lastSentByGroup = new Map<string, number>();
let sendsThisSession = 0;

// Second copy: supabase/functions/_shared/errorLogging.ts (Deno cannot import this file). Keep in sync.
const SCRUBBERS: Array<[RegExp, string]> = [
  [/\beyJ[\w-]+\.[\w-]+\.[\w-]+/g, ":token"],
  [/\bbearer\s+[\w.~+/-]+=*/gi, "Bearer :token"],
  [/[^\s@"'<>]+@[^\s@"'<>]+\.[a-z]{2,}/gi, ":email"],
  [/(https?:\/\/[^\s?#"']+)[?#][^\s"']*/gi, "$1"],
  [/\b[0-9a-f]{32,}\b/gi, ":hex"],
];

/** Remove tokens, emails, query strings and long keys before anything leaves the browser. */
export function scrubErrorText(text: string): string {
  return SCRUBBERS.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), text);
}

function errorGroupKey(type: ErrorLogType, message: string, context: string): string {
  return `${type}|${context}|${message.toLowerCase().replace(/\d+/g, "#")}`;
}

function shouldSend(groupKey: string, now: number): boolean {
  if (sendsThisSession >= MAX_SENDS_PER_SESSION) {
    return false;
  }
  const last = lastSentByGroup.get(groupKey);
  if (last !== undefined && now - last < THROTTLE_MS) {
    return false;
  }
  lastSentByGroup.set(groupKey, now);
  sendsThisSession += 1;
  return true;
}

function readStack(error: unknown, extraStack?: string): string | null {
  const base = error instanceof Error && error.stack ? scrubErrorText(error.stack) : "";
  const extra = extraStack ? `\n\nComponent stack:${scrubErrorText(extraStack)}` : "";
  // Truncate the error stack first so the component stack survives long errors.
  const combined = base.slice(0, Math.max(MAX_STACK - extra.length, 0)) + extra;
  return combined ? combined.slice(0, MAX_STACK) : null;
}

export function buildErrorLogPayload(
  error: unknown,
  context: string,
  type: ErrorLogType,
  options: LogAppErrorOptions = {}
): ErrorLogPayload {
  return {
    message: scrubErrorText(getErrorDetail(error)).slice(0, MAX_MESSAGE),
    stack: readStack(error, options.extraStack),
    context: scrubErrorText(context).slice(0, MAX_CONTEXT),
    type,
    route: globalThis.location?.pathname ?? "",
    browserInfo: {
      userAgent: globalThis.navigator?.userAgent ?? "",
      language: globalThis.navigator?.language ?? "",
    },
    appVersion: getAppVersion(),
    environment: detectEnvironment(),
  };
}

/**
 * Send a runtime error to the central error log. Fire-and-forget: callers `void` the promise.
 * `context` should be stable (e.g. `FeatureService.method`) so repeats group together.
 */
export async function logAppError(
  error: unknown,
  context: string,
  type: ErrorLogType = "log_error",
  options: LogAppErrorOptions = {}
): Promise<void> {
  try {
    const payload = buildErrorLogPayload(error, context, type, options);
    if (!shouldSend(errorGroupKey(type, payload.message, payload.context), Date.now())) {
      return;
    }
    if (!(await sink.isAvailable())) {
      return;
    }
    await sink.send(payload);
  } catch {
    // Logging must never break the app or log itself.
  }
}

/** Console + central log in one call, for catch blocks in app code. */
export function logError(context: string, error: unknown): void {
  console.error(`[${context}]`, error);
  void logAppError(error, context, "log_error");
}

let globalHandlersRegistered = false;

/** Capture uncaught errors and unhandled promise rejections. Call once before rendering. */
export function registerGlobalErrorHandler(): void {
  if (globalHandlersRegistered || typeof window === "undefined") {
    return;
  }
  globalHandlersRegistered = true;
  window.addEventListener("error", (event: ErrorEvent) => {
    void logAppError(event.error ?? new Error(event.message), "window.error", "window_error");
  });
  window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    void logAppError(event.reason, "unhandledrejection", "unhandled_rejection");
  });
}

/** Test-only: reset throttle state between tests. */
export function resetErrorLogThrottleForTests(): void {
  lastSentByGroup.clear();
  sendsThisSession = 0;
}
