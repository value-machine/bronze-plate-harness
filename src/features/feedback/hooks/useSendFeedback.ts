import { useMutation } from "@tanstack/react-query";
import { sendFeedback } from "@/features/feedback/services/feedbackService";

/** Submit feedback; errors carry user-facing copy. */
export function useSendFeedback() {
  const mutation = useMutation({ mutationFn: (body: string) => sendFeedback(body) });
  return {
    send: mutation.mutateAsync,
    isSending: mutation.isPending,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}
