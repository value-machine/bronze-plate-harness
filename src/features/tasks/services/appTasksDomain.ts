import type { ActiveTaskStatus, AppTask, TaskLink } from "@/features/tasks/types/appTask.types";

const TASK_KEYS = new Set(["title", "description", "status", "links"]);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function hasOnlyKeys(record: Record<string, unknown>, keys: string[]): boolean {
  return Object.keys(record).every((key) => keys.includes(key));
}

/** One validator per link kind; a new signal kind is one entry here. */
const LINK_VALIDATORS: Record<TaskLink["kind"], (record: Record<string, unknown>) => boolean> = {
  error: (record) => hasOnlyKeys(record, ["kind", "hash"]) && isNonEmptyString(record.hash),
  feedback: (record) =>
    hasOnlyKeys(record, ["kind", "env", "id"]) &&
    (record.env === "staging" || record.env === "production") &&
    isNonEmptyString(record.id),
};

function readTaskLink(value: unknown, taskIndex: number): TaskLink {
  const record = (typeof value === "object" && value !== null ? value : {}) as Record<
    string,
    unknown
  >;
  const validate = LINK_VALIDATORS[record.kind as TaskLink["kind"]];
  if (!validate || !validate(record)) {
    throw new Error(`Invalid link at task index ${taskIndex}`);
  }
  return { ...record } as TaskLink;
}

function readTaskLinks(value: unknown, index: number): TaskLink[] | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    throw new Error(`Invalid links at index ${index}`);
  }
  return value.length > 0 ? value.map((link) => readTaskLink(link, index)) : undefined;
}

/** Copy a task with a new status; keeps links (archive and restore move the whole row). */
function withStatus(task: AppTask, status: AppTask["status"]): AppTask {
  const next: AppTask = { title: task.title, description: task.description, status };
  if (task.links && task.links.length > 0) {
    next.links = task.links;
  }
  return next;
}

function assertPlainTask(value: unknown, index: number): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Invalid task at index ${index}`);
  }
  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (!TASK_KEYS.has(key)) {
      throw new Error(`Unknown key "${key}" at index ${index}`);
    }
  }
  return record;
}

function readTaskFields(record: Record<string, unknown>, index: number): AppTask {
  const { title, description, status } = record;
  if (typeof title !== "string" || typeof description !== "string" || typeof status !== "string") {
    throw new Error(`Invalid task fields at index ${index}`);
  }
  const task: AppTask = { title, description, status: status as AppTask["status"] };
  const links = readTaskLinks(record.links, index);
  if (links) {
    task.links = links;
  }
  return task;
}

export function parseActiveTasks(data: unknown): AppTask[] {
  if (!Array.isArray(data)) {
    throw new Error("Active tasks must be an array");
  }
  return data.map((item, index) => {
    const record = assertPlainTask(item, index);
    const task = readTaskFields(record, index);
    if (task.status !== "to-do" && task.status !== "in-progress") {
      throw new Error(
        `Active task at index ${index} must be to-do or in-progress, got ${task.status}`
      );
    }
    return task;
  });
}

export function parseArchiveTasks(data: unknown): AppTask[] {
  if (!Array.isArray(data)) {
    throw new Error("Archive tasks must be an array");
  }
  return data.map((item, index) => {
    const record = assertPlainTask(item, index);
    const task = readTaskFields(record, index);
    if (task.status !== "done") {
      throw new Error(`Archive task at index ${index} must have status done`);
    }
    return task;
  });
}

/** Append order = completion timeline (oldest → newest on disk). */
export function orderArchiveNewestFirst(archive: AppTask[]): AppTask[] {
  return [...archive].reverse();
}

export function displayIndexToArchiveIndex(displayIndex: number, archiveLength: number): number {
  return archiveLength - 1 - displayIndex;
}

export function completeActiveTaskAtIndex(
  active: AppTask[],
  archive: AppTask[],
  index: number
): { active: AppTask[]; archive: AppTask[] } {
  if (index < 0 || index >= active.length) {
    throw new Error("Active index out of range");
  }
  const task = active[index];
  const nextActive = active.filter((_, i) => i !== index);
  return { active: nextActive, archive: [...archive, withStatus(task, "done")] };
}

export function restoreFromArchiveDisplayIndex(
  active: AppTask[],
  archive: AppTask[],
  displayIndex: number,
  status: ActiveTaskStatus
): { active: AppTask[]; archive: AppTask[] } {
  if (displayIndex < 0 || displayIndex >= archive.length) {
    throw new Error("Archive display index out of range");
  }
  const archiveIndex = displayIndexToArchiveIndex(displayIndex, archive.length);
  const task = archive[archiveIndex];
  const nextArchive = archive.filter((_, i) => i !== archiveIndex);
  return { active: [withStatus(task, status), ...active], archive: nextArchive };
}

export function serializeTasksBaseline(tasks: AppTask[]): string {
  return JSON.stringify(tasks);
}

/** Apply pending row edits before an immediate flush (text-save flush rule). */
export function applyPendingRowEdit(
  tasks: AppTask[],
  rowIndex: number,
  patch: Partial<Pick<AppTask, "title" | "description">>
): AppTask[] {
  return tasks.map((task, index) => (index === rowIndex ? { ...task, ...patch } : task));
}

export function tasksMatchBaseline(diskTasks: AppTask[], baseline: string): boolean {
  return serializeTasksBaseline(diskTasks) === baseline;
}
