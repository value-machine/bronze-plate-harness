import { getSupabase } from "@/shared/services/supabaseService";
import type { ErrorLogRow, ErrorLogStatus } from "@/shared/types/errorLog.types";

const LIST_SELECT =
  "id,hash,message,stack,context,type,route,count,first_seen_at,last_seen_at,app_version,status_version,status,environment";

/** Clusters by most recent occurrence (cap 200). Without closed: open + review only. */
export async function listErrorLogs(includeClosed: boolean): Promise<ErrorLogRow[]> {
  const statuses: ErrorLogStatus[] = includeClosed
    ? ["open", "review", "muted", "resolved"]
    : ["open", "review"];
  const { data, error } = await getSupabase()
    .from("error_logs")
    .select(LIST_SELECT)
    .in("status", statuses)
    .order("last_seen_at", { ascending: false })
    .limit(200);
  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []) as ErrorLogRow[];
}

/** Admin-only RPC; the database rejects everyone else. */
export async function updateErrorLogStatus(id: string, status: ErrorLogStatus): Promise<void> {
  const { error } = await getSupabase().rpc("admin_update_error_log_status", {
    p_error_log_id: id,
    p_status: status,
  });
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Markdown packet an admin pastes into an agent chat (read by the `debug` skill).
 * Second copy of the "copy for agent" packet: formatFeedbackAgentPacket in
 * src/features/admin/feedback/services/adminFeedbackService.ts. Keep the shapes aligned.
 */
export function formatErrorLogAgentPacket(row: ErrorLogRow): string {
  return [
    "## error_logs",
    `- hash: ${row.hash}`,
    `- status: ${row.status}`,
    `- type: ${row.type}`,
    `- context: ${row.context ?? ""}`,
    `- count: ${row.count} (first ${row.first_seen_at}, last ${row.last_seen_at})`,
    `- environment: ${row.environment}`,
    `- app_version: ${row.app_version}`,
    `- route: ${row.route ?? ""}`,
    "",
    row.message,
    "",
    "```",
    row.stack ?? "(no stack)",
    "```",
  ].join("\n");
}
