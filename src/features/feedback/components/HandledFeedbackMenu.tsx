import { Bell, Check, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/common/DropdownMenu";
import { Button } from "@/components/common/Button";
import { Tooltip } from "@/components/common/Tooltip";
import { useHandledFeedback } from "@/features/feedback/hooks/useHandledFeedback";

const excerpt = (body: string) => (body.length > 140 ? `${body.slice(0, 140)}…` : body);

/**
 * Topbar tray for feedback an admin marked handled. The submitter confirms (✓) or reopens (✗).
 * Renders nothing while there is nothing to acknowledge.
 */
export const HandledFeedbackMenu = () => {
  const { handled, acknowledge, ackingId, error } = useHandledFeedback();
  if (handled.length === 0) {
    return null;
  }
  const label = `${handled.length} feedback ${handled.length === 1 ? "update" : "updates"}`;

  return (
    <DropdownMenu>
      <Tooltip title={label}>
        <DropdownMenuTrigger
          aria-label={label}
          className="relative rounded-full p-2 transition-colors outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring"
        >
          <Bell className="size-5" />
          <span className="absolute top-1 right-1 size-2 rounded-full bg-primary" />
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-[320px]">
        <p className="px-2 py-1.5 text-sm font-semibold">Your feedback was handled</p>
        <p className="px-2 pb-2 text-xs text-muted-foreground">Is it fixed for you?</p>
        {error && <p className="px-2 pb-2 text-xs text-destructive">{error}</p>}
        <ul className="flex flex-col gap-1">
          {handled.map((row) => (
            <li key={row.id} className="flex items-start gap-2 rounded-md px-2 py-1.5">
              <span className="min-w-0 flex-1 text-sm break-words">{excerpt(row.body)}</span>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Yes, it is fixed"
                disabled={ackingId === row.id}
                onClick={() => acknowledge(row.id, "completed")}
              >
                <Check />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="No, reopen it"
                disabled={ackingId === row.id}
                onClick={() => acknowledge(row.id, "reopened")}
              >
                <X />
              </Button>
            </li>
          ))}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
