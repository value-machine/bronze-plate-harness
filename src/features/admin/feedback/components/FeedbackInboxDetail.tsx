import { Button } from "@/components/common/Button";
import type { AdminFeedbackStatus, FeedbackRow } from "@/shared/types/feedback.types";

interface FeedbackInboxDetailProps {
  row: FeedbackRow;
  isSaving: boolean;
  onStatus: (next: AdminFeedbackStatus) => void;
  onCopy: () => void;
}

/** One feedback row. `review` means an agent shipped a fix that waits for your check. */
export const FeedbackInboxDetail = ({
  row,
  isSaving,
  onStatus,
  onCopy,
}: FeedbackInboxDetailProps) => (
  <article className="flex flex-col gap-3 text-sm">
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <dt>From</dt>
      <dd>
        {row.user_email} <span title="Self-reported name">({row.user_name})</span>
      </dd>
      <dt>Page</dt>
      <dd>{row.context.route || "—"}</dd>
      <dt>Version</dt>
      <dd>
        {row.context.appVersion || "—"} · {row.environment ?? "unknown"}
      </dd>
      <dt>Status</dt>
      <dd>{row.status}</dd>
    </dl>
    <p className="whitespace-pre-wrap">{row.body}</p>
    <div className="flex flex-wrap gap-2">
      <Button size="sm" disabled={isSaving} onClick={() => onStatus("handled")}>
        Mark handled
      </Button>
      <Button size="sm" variant="outline" disabled={isSaving} onClick={() => onStatus("dismissed")}>
        Dismiss
      </Button>
      {row.status === "review" && (
        <Button size="sm" variant="outline" disabled={isSaving} onClick={() => onStatus("open")}>
          Not fixed — reopen
        </Button>
      )}
      <Button size="sm" variant="ghost" onClick={onCopy}>
        Copy for agent
      </Button>
    </div>
  </article>
);
