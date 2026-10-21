import { Alert, type AlertProps } from "@/components/common/Alert";

export interface StatusAlertProps {
  message: string | null;
  variant?: AlertProps["variant"];
  onDismiss?: () => void;
}

/** Floating top-center alert for the outcome of an async action (saved, failed, sent). */
export const StatusAlert = ({ message, variant = "success", onDismiss }: StatusAlertProps) => {
  if (!message) {
    return null;
  }
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6">
      <Alert
        variant={variant}
        onClose={onDismiss}
        className="pointer-events-auto max-w-[480px] bg-popover elevation-lg"
      >
        {message}
      </Alert>
    </div>
  );
};
