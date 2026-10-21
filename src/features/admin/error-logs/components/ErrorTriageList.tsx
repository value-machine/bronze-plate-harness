import { useState } from "react";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { PageLoadingState } from "@/components/common/PageLoadingState";
import { StatusAlert } from "@/components/common/StatusAlert";
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard";
import { useErrorTriage } from "@/features/admin/error-logs/hooks/useErrorTriage";
import type { ErrorLogStatus } from "@/shared/types/errorLog.types";
import { ErrorTriageRow } from "./ErrorTriageRow";

/** Admin error triage: open and agent-reviewed clusters first, live. */
export const ErrorTriageList = () => {
  const triage = useErrorTriage();
  const { copy, copied } = useCopyToClipboard();
  const [pendingMute, setPendingMute] = useState<string | null>(null);

  if (triage.isLoading) {
    return <PageLoadingState />;
  }

  const applyStatus = (id: string, next: ErrorLogStatus) => {
    if (next === "muted" && pendingMute !== id) {
      setPendingMute(id);
      return;
    }
    setPendingMute(null);
    void triage.setStatus(id, next).catch(() => undefined);
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => triage.setIncludeClosed(!triage.includeClosed)}
        >
          {triage.includeClosed ? "Hide muted and resolved" : "Show muted and resolved"}
        </Button>
      </div>
      {triage.error && <Alert variant="destructive">{triage.error}</Alert>}
      {triage.rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No errors to triage.</p>
      ) : (
        <ul className="flex flex-col gap-2" aria-label="Errors">
          {triage.rows.map((row) => (
            <ErrorTriageRow
              key={row.id}
              row={row}
              isSaving={triage.isSaving}
              onStatus={(next) => applyStatus(row.id, next)}
              onCopy={() => void copy(triage.agentPacket(row))}
            />
          ))}
        </ul>
      )}
      <ConfirmDialog
        open={pendingMute !== null}
        title="Mute this error?"
        description="Muted errors stay hidden even when they happen again."
        confirmLabel="Mute"
        onConfirm={() => pendingMute && applyStatus(pendingMute, "muted")}
        onCancel={() => setPendingMute(null)}
      />
      <StatusAlert message={copied ? "Copied. Paste it into your agent chat." : null} />
    </div>
  );
};
