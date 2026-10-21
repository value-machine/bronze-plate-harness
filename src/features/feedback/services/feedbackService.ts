import { detectEnvironment, getAppVersion } from "@/shared/utils/appEnvironment";
import { getSupabase } from "@/shared/services/supabaseService";
import type { FeedbackAckOutcome, FeedbackRow } from "@/shared/types/feedback.types";
import { FEEDBACK_BODY_MAX } from "@/shared/types/feedback.types";

export type HandledFeedbackRow = Pick<FeedbackRow, "id" | "created_at" | "body" | "status">;

const HANDLED_SELECT = "id,created_at,body,status";

interface PostgrestLikeError {
  code?: string;
  message?: string;
}

/** Trimmed body, or an error message the dialog can show. */
export function validateFeedbackBody(
  body: string
): { ok: true; body: string } | { ok: false; error: string } {
  const trimmed = body.trim();
  if (!trimmed) {
    return { ok: false, error: "Please write your feedback first." };
  }
  if (trimmed.length > FEEDBACK_BODY_MAX) {
    return { ok: false, error: `Feedback is limited to ${FEEDBACK_BODY_MAX} characters.` };
  }
  return { ok: true, body: trimmed };
}

/** User-facing copy for a failed insert or ack. */
export function feedbackErrorMessage(error: PostgrestLikeError): string {
  if (error.code === "P0001") {
    return "You have sent a lot of feedback today. Please try again tomorrow.";
  }
  if (error.code === "42501" || /jwt|row-level security/i.test(error.message ?? "")) {
    return "Please sign in again to send feedback.";
  }
  return "Feedback could not be sent. Please try again.";
}

/** Insert one feedback row. Identity and status are set by the database. */
export async function sendFeedback(rawBody: string): Promise<void> {
  const validated = validateFeedbackBody(rawBody);
  if (!validated.ok) {
    throw new Error(validated.error);
  }
  const { error } = await getSupabase()
    .from("app_feedback")
    .insert({
      body: validated.body,
      context: { route: globalThis.location?.pathname ?? "", appVersion: getAppVersion() },
      environment: detectEnvironment(),
      app_id: import.meta.env.VITE_APP_ID || "app",
    });
  if (error) {
    throw new Error(feedbackErrorMessage(error));
  }
}

/** The signed-in user's feedback that an admin marked handled and that awaits ✓ / ✗. */
export async function listHandledFeedbackForMe(userId: string): Promise<HandledFeedbackRow[]> {
  const { data, error } = await getSupabase()
    .from("app_feedback")
    .select(HANDLED_SELECT)
    .eq("user_id", userId)
    .eq("status", "handled")
    .order("updated_at", { ascending: false })
    .limit(20);
  if (error) {
    throw new Error(feedbackErrorMessage(error));
  }
  return (data ?? []) as HandledFeedbackRow[];
}

/** Submitter's answer: completed (fixed) or reopened (status back to open). */
export async function ackFeedback(id: string, outcome: FeedbackAckOutcome): Promise<void> {
  const { error } = await getSupabase()
    .from("app_feedback")
    .update({ status: outcome === "completed" ? "completed" : "open" })
    .eq("id", id);
  if (error) {
    throw new Error(feedbackErrorMessage(error));
  }
}
