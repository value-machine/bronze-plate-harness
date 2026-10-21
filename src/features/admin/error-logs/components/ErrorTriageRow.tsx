import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import type { ErrorLogRow, ErrorLogStatus } from "@/shared/types/errorLog.types";

interface ErrorTriageRowProps {
  row: ErrorLogRow;
  isSaving: boolean;
  onStatus: (next: ErrorLogStatus) => void;
  onCopy: () => void;
}

/** One error cluster. `review` = an agent shipped a fix; resolve after you checked it. */
export const ErrorTriageRow = ({ row, isSaving, onStatus, onCopy }: ErrorTriageRowProps) => (
  <li className="flex flex-col gap-2 rounded-md border px-3 py-2 text-sm">
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <Badge variant={row.status === "open" ? "default" : "outline"}>{row.status}</Badge>
      <span>×{row.count}</span>
      <span>{row.type}</span>
      <span>{row.context}</span>
      <span>
        {row.environment} · v{row.app_version}
      </span>
      <span>last {new Date(row.last_seen_at).toLocaleString()}</span>
    </div>
    <p className="break-words">{row.message}</p>
    <div className="flex flex-wrap gap-2">
      {row.status !== "resolved" && (
        <Button size="sm" disabled={isSaving} onClick={() => onStatus("resolved")}>
          Resolve
        </Button>
      )}
      {row.status !== "muted" && (
        <Button size="sm" variant="outline" disabled={isSaving} onClick={() => onStatus("muted")}>
          Mute
        </Button>
      )}
      {row.status !== "open" && (
        <Button size="sm" variant="outline" disabled={isSaving} onClick={() => onStatus("open")}>
          Reopen
        </Button>
      )}
      <Button size="sm" variant="ghost" onClick={onCopy}>
        Copy for agent
      </Button>
    </div>
  </li>
);
