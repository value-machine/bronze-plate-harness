/**
 * In-repo dev backlog SSOT (coding agents + /tasks UI):
 * - Active: src/config/app-tasks.json (to-do | in-progress only)
 * - Archive: src/config/app-tasks-archive.json (status done only)
 */

export type ActiveTaskStatus = "to-do" | "in-progress";
export type TaskStatus = ActiveTaskStatus | "done";

/** Supabase project a row-level signal id belongs to (single-project forks use "production"). */
export type SignalEnv = "staging" | "production";

/**
 * Link from a task to a runtime signal (see backlog-management skill).
 * Error links use the cluster hash: the same value in every environment.
 */
export type TaskLink =
  | { kind: "error"; hash: string }
  | { kind: "feedback"; env: SignalEnv; id: string };

export interface AppTask {
  title: string;
  description: string;
  status: TaskStatus;
  /** Omitted when empty. */
  links?: TaskLink[];
}

export type SaveFeedback = "idle" | "saving" | "saved" | "archived" | "restored" | "error";

/** Background text autosave — subtle UI only (not the main snackbar). */
export type TextAutosaveStatus = "idle" | "pending" | "saved";
