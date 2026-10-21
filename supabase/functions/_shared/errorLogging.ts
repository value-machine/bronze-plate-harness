/**
 * Error logging for Supabase Edge Functions (Deno). Contract: documentation/DOC_ERROR_LOGGING_CONTRACT.md
 *
 * - `logEdgeError`: a request with a signed-in caller. Forwards the caller's JWT so the row records
 *   the user. Without an Authorization header it is a silent no-op (anon cannot write error_logs).
 * - `logServiceError`: webhooks, cron and workers with no user. Uses the service role key.
 * Both call the same `upsert_error_log` RPC as the web client; the database computes the hash.
 * Neither throws: failures go to console.error only.
 *
 * Env: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (provided by Supabase),
 * optional ERROR_LOG_ENVIRONMENT (preview | staging | production) and APP_VERSION.
 */
import { createClient } from "npm:@supabase/supabase-js@2.106.2";

export interface EdgeErrorInput {
  error: unknown;
  /** Stable context, e.g. "send-email:deliver". Repeats with the same context group together. */
  context: string;
  route?: string;
  /** Short, non-sensitive facts (function name, step). Never tokens, bodies or PII. */
  extra?: Record<string, string | number | boolean>;
}

const MAX_MESSAGE = 10000;
const MAX_STACK = 20000;
const MAX_CONTEXT = 500;

const SCRUBBERS: Array<[RegExp, string]> = [
  [/\beyJ[\w-]+\.[\w-]+\.[\w-]+/g, ":token"],
  [/\bbearer\s+[\w.~+/-]+=*/gi, "Bearer :token"],
  [/[^\s@"'<>]+@[^\s@"'<>]+\.[a-z]{2,}/gi, ":email"],
  [/(https?:\/\/[^\s?#"']+)[?#][^\s"']*/gi, "$1"],
  [/\b[0-9a-f]{32,}\b/gi, ":hex"],
];

// Same patterns as scrubErrorText in src/shared/services/errorLoggingService.ts (Deno cannot import it).
function scrub(text: string): string {
  return SCRUBBERS.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), text);
}

function readMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (
    error &&
    typeof error === "object" &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "Unknown error";
}

function buildArgs(input: EdgeErrorInput, runtime: string) {
  const stack = input.error instanceof Error && input.error.stack ? scrub(input.error.stack) : null;
  return {
    p_message: scrub(readMessage(input.error)).slice(0, MAX_MESSAGE) || "Unknown error",
    p_stack: stack ? stack.slice(0, MAX_STACK) : null,
    p_context: scrub(input.context).slice(0, MAX_CONTEXT),
    p_type: "service_error",
    p_route: input.route ? input.route.split("?")[0].slice(0, 500) : null,
    p_browser_info: { runtime, ...(input.extra ?? {}) },
    p_app_version: Deno.env.get("APP_VERSION") ?? "edge",
    p_environment: Deno.env.get("ERROR_LOG_ENVIRONMENT") ?? "unknown",
  };
}

async function callUpsert(
  key: string,
  headers: Record<string, string>,
  args: object
): Promise<void> {
  const url = Deno.env.get("SUPABASE_URL");
  if (!url || !key) return;
  const client = createClient(url, key, {
    global: { headers },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await client.rpc("upsert_error_log", args);
  if (error) console.error("[errorLogging] upsert_error_log failed:", error.message);
}

/** Log a failure for a request made by a signed-in user (forwards their JWT). */
export async function logEdgeError(
  authHeader: string | null,
  input: EdgeErrorInput
): Promise<void> {
  console.error(`[${input.context}]`, input.error);
  if (!authHeader) return;
  try {
    await callUpsert(
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { Authorization: authHeader },
      buildArgs(input, "supabase-edge")
    );
  } catch (loggingError) {
    console.error("[errorLogging] failed:", loggingError);
  }
}

/** Log a failure with no user (webhook, cron, worker) using the service role. */
export async function logServiceError(input: EdgeErrorInput): Promise<void> {
  console.error(`[${input.context}]`, input.error);
  try {
    await callUpsert(
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {},
      buildArgs(input, "supabase-edge-service")
    );
  } catch (loggingError) {
    console.error("[errorLogging] failed:", loggingError);
  }
}
