/**
 * In-app feedback rows (`public.app_feedback`). Shared by the submit/ack feature and the admin inbox.
 * Lifecycle: open → (agent) review → (admin) handled | dismissed | open;
 *            handled → (submitter) completed | open (reopened). Stale handled rows auto-complete.
 */
export type FeedbackStatus = "open" | "review" | "handled" | "dismissed" | "completed";

/** Statuses an admin may set from the inbox. */
export type AdminFeedbackStatus = Extract<FeedbackStatus, "open" | "handled" | "dismissed">;

/** Submitter's answer to a handled row: confirmed, or not fixed yet. */
export type FeedbackAckOutcome = "completed" | "reopened";

export interface FeedbackContext {
  route?: string;
  appVersion?: string;
}

export interface FeedbackRow {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  /** Self-reported name (JWT user_metadata); user_email is verified. */
  user_name: string;
  user_email: string;
  body: string;
  status: FeedbackStatus;
  context: FeedbackContext;
  environment: string | null;
  submitter_resolution: { action?: string; at?: string };
  app_id: string;
}

export const FEEDBACK_BODY_MAX = 10000;
