import type { SaveFeedback } from "@/features/tasks/types/appTask.types";
import type { AlertProps } from "@/components/common/Alert";
import { StatusAlert } from "@/components/common/StatusAlert";

const FEEDBACK_LABEL: Record<Exclude<SaveFeedback, "idle">, string> = {
  saving: "Saving…",
  saved: "Saved",
  archived: "Archived",
  restored: "Restored",
  error: "Error",
};

interface TasksFeedbackProps {
  feedback: SaveFeedback;
  errorMessage: string | null;
  onDismiss?: () => void;
}

export const TasksFeedback = ({ feedback, errorMessage, onDismiss }: TasksFeedbackProps) => {
  const open = feedback !== "idle" || Boolean(errorMessage);
  if (!open) {
    return null;
  }

  const variant: AlertProps["variant"] =
    feedback === "error" ? "destructive" : feedback === "saving" ? "info" : "success";
  const message =
    feedback === "error" && errorMessage
      ? errorMessage
      : feedback !== "idle"
        ? FEEDBACK_LABEL[feedback]
        : errorMessage;

  return <StatusAlert message={message} variant={variant} onDismiss={onDismiss} />;
};
