import { getSupabase } from "@/shared/services/supabaseService";
import type { AdminFeedbackStatus, FeedbackRow } from "@/shared/types/feedback.types";

/** Columns the inbox shows; no select("*"). */
const INBOX_SELECT =
  "id,created_at,updated_at,user_id,user_name,user_email,body,status,context,environment,submitter_resolution,app_id";

/** Open and agent-reviewed feedback, newest first (cap 200). */
export async function listFeedbackInbox(): Promise<FeedbackRow[]> {
  const { data, error } = await getSupabase()
    .from("app_feedback")
    .select(INBOX_SELECT)
    .in("status", ["open", "review"])
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []) as FeedbackRow[];
}

export async function updateFeedbackStatus(id: string, status: AdminFeedbackStatus): Promise<void> {
  const { error } = await getSupabase().from("app_feedback").update({ status }).eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Markdown packet an admin pastes into an agent chat (read by the `debug` skill).
 * Second copy of the "copy for agent" packet: formatErrorLogAgentPacket in
 * src/features/admin/error-logs/services/errorLogsAdminService.ts. Keep the shapes aligned.
 */
export function formatFeedbackAgentPacket(row: FeedbackRow): string {
  return [
    "## app_feedback",
    `- id: ${row.id}`,
    `- status: ${row.status}`,
    `- created_at: ${row.created_at}`,
    `- environment: ${row.environment ?? "unknown"}`,
    `- route: ${row.context.route ?? ""}`,
    `- app_version: ${row.context.appVersion ?? ""}`,
    "",
    row.body,
  ].join("\n");
}
