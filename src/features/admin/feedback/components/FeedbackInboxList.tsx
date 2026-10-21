import { Badge } from "@/components/common/Badge";
import type { FeedbackRow } from "@/shared/types/feedback.types";
import { cn } from "@/shared/utils/cn";

interface FeedbackInboxListProps {
  rows: FeedbackRow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const excerpt = (body: string) => (body.length > 90 ? `${body.slice(0, 90)}…` : body);

export const FeedbackInboxList = ({ rows, selectedId, onSelect }: FeedbackInboxListProps) => (
  <ul className="flex flex-col gap-1" aria-label="Feedback">
    {rows.map((row) => (
      <li key={row.id}>
        <button
          type="button"
          onClick={() => onSelect(row.id)}
          aria-current={row.id === selectedId}
          className={cn(
            "flex w-full flex-col gap-1 rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
            row.id === selectedId && "border-primary bg-accent"
          )}
        >
          <span className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>{new Date(row.created_at).toLocaleString()}</span>
            <Badge variant={row.status === "review" ? "success" : "outline"}>{row.status}</Badge>
          </span>
          <span>{excerpt(row.body)}</span>
        </button>
      </li>
    ))}
  </ul>
);
