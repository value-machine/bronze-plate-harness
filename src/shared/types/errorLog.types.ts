/** Runtime error clusters (`public.error_logs`), one row per fingerprint hash. Admin-readable only. */
export type ErrorLogStatus = "open" | "muted" | "review" | "resolved";

export interface ErrorLogRow {
  id: string;
  hash: string;
  message: string;
  stack: string | null;
  context: string | null;
  type: string;
  route: string | null;
  count: number;
  first_seen_at: string;
  last_seen_at: string;
  app_version: string;
  status_version: string | null;
  status: ErrorLogStatus;
  environment: string;
}
