import { useEffect, useRef } from "react";
import { getSupabase } from "@/shared/services/supabaseService";

export interface TableSubscriptionOptions {
  /** Table in the public schema, e.g. "app_feedback". */
  table: string;
  /** Postgres-changes filter, e.g. "user_id=eq.<uuid>". */
  filter?: string;
  /** Subscribe only when true (signed in, Supabase configured, page visible to the right role). */
  enabled: boolean;
  /** Called after a change, when the tab becomes visible again, and on each poll. */
  onChange: () => void;
  /** Collapse bursts of changes into one call. Default 500 ms. */
  debounceMs?: number;
  /** Poll interval used while the realtime channel is not subscribed. Off when omitted. */
  pollMs?: number;
}

/**
 * Live updates for one table: Supabase realtime `postgres_changes` (RLS applies per subscriber),
 * a refresh when the tab becomes visible, and an optional poll while realtime is unavailable.
 */
export function useTableSubscription({
  table,
  filter,
  enabled,
  onChange,
  debounceMs = 500,
  pollMs,
}: TableSubscriptionOptions): void {
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    let debounceTimer: ReturnType<typeof setTimeout> | undefined;
    let pollTimer: ReturnType<typeof setInterval> | undefined;
    const notify = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => onChangeRef.current(), debounceMs);
    };
    const stopPolling = () => {
      clearInterval(pollTimer);
      pollTimer = undefined;
    };
    const startPolling = () => {
      if (pollMs && !pollTimer) {
        pollTimer = setInterval(() => onChangeRef.current(), pollMs);
      }
    };
    const supabase = getSupabase();
    const channel = supabase
      .channel(`table:${table}:${filter ?? "all"}:${crypto.randomUUID()}`)
      .on("postgres_changes", { event: "*", schema: "public", table, filter }, notify)
      .subscribe((status) => (status === "SUBSCRIBED" ? stopPolling() : startPolling()));
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        onChangeRef.current();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    startPolling();
    return () => {
      clearTimeout(debounceTimer);
      stopPolling();
      document.removeEventListener("visibilitychange", onVisible);
      void supabase.removeChannel(channel);
    };
  }, [table, filter, enabled, debounceMs, pollMs]);
}
