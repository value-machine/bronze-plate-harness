import { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { Textarea } from "@/components/common/Textarea";
import { Button } from "@/components/common/Button";
import { Alert } from "@/components/common/Alert";
import { useSendFeedback } from "@/features/feedback/hooks/useSendFeedback";

interface FeedbackDialogProps {
  open: boolean;
  onClose: () => void;
  /** Called after the feedback was stored (e.g. to show a confirmation). */
  onSent: () => void;
}

/** Free-text feedback form. The page path and app version are attached automatically. */
export const FeedbackDialog = ({ open, onClose, onSent }: FeedbackDialogProps) => {
  const [body, setBody] = useState("");
  const { send, isSending, error, reset } = useSendFeedback();

  const close = () => {
    reset();
    onClose();
  };

  const submit = async () => {
    try {
      await send(body);
      setBody("");
      reset();
      onSent();
    } catch {
      // The hook exposes the user-facing message.
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Send feedback"
      description="Tell us what works, what breaks, or what you miss. We attach the page you are on."
      actions={
        <>
          <Button variant="outline" onClick={close} disabled={isSending}>
            Cancel
          </Button>
          <Button onClick={() => void submit()} disabled={isSending || !body.trim()}>
            {isSending ? "Sending…" : "Send"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Textarea
          aria-label="Feedback"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={5}
          maxLength={10000}
          placeholder="Your feedback"
          autoFocus
        />
        {error && <Alert variant="destructive">{error}</Alert>}
      </div>
    </Modal>
  );
};
