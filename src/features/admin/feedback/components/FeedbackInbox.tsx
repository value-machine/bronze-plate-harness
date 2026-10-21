import { useState } from "react";
import { Alert } from "@/components/common/Alert";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { PageLoadingState } from "@/components/common/PageLoadingState";
import { StatusAlert } from "@/components/common/StatusAlert";
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard";
import { useFeedbackInbox } from "@/features/admin/feedback/hooks/useFeedbackInbox";
import type { AdminFeedbackStatus } from "@/shared/types/feedback.types";
import { FeedbackInboxDetail } from "./FeedbackInboxDetail";
import { FeedbackInboxList } from "./FeedbackInboxList";

/** Admin feedback inbox: open and agent-reviewed feedback, live. */
export const FeedbackInbox = () => {
  const inbox = useFeedbackInbox();
  const { copy, copied } = useCopyToClipboard();
  const [confirmDismiss, setConfirmDismiss] = useState(false);

  if (inbox.isLoading) {
    return <PageLoadingState />;
  }

  const applyStatus = (next: AdminFeedbackStatus) => {
    if (!inbox.selected) return;
    if (next === "dismissed" && !confirmDismiss) {
      setConfirmDismiss(true);
      return;
    }
    setConfirmDismiss(false);
    void inbox.setStatus(inbox.selected.id, next).catch(() => undefined);
  };

  return (
    <div className="grid w-full gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      {inbox.error && (
        <Alert variant="destructive" className="md:col-span-2">
          {inbox.error}
        </Alert>
      )}
      {inbox.rows.length === 0 ? (
        <p className="text-sm text-muted-foreground md:col-span-2">No open feedback.</p>
      ) : (
        <>
          <FeedbackInboxList
            rows={inbox.rows}
            selectedId={inbox.selected?.id ?? null}
            onSelect={inbox.select}
          />
          {inbox.selected ? (
            <FeedbackInboxDetail
              row={inbox.selected}
              isSaving={inbox.isSaving}
              onStatus={applyStatus}
              onCopy={() => void copy(inbox.agentPacket)}
            />
          ) : (
            <p className="text-sm text-muted-foreground">Select feedback to read it.</p>
          )}
        </>
      )}
      <ConfirmDialog
        open={confirmDismiss}
        title="Dismiss this feedback?"
        description="It leaves the inbox and the submitter is not notified."
        confirmLabel="Dismiss"
        destructive
        onConfirm={() => applyStatus("dismissed")}
        onCancel={() => setConfirmDismiss(false)}
      />
      <StatusAlert message={copied ? "Copied. Paste it into your agent chat." : null} />
    </div>
  );
};
