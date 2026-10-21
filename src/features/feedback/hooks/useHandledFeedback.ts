import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/shared/context/AuthContext";
import { useTableSubscription } from "@/shared/hooks/useTableSubscription";
import { feedbackKeys } from "@/features/feedback/api/keys";
import {
  ackFeedback,
  listHandledFeedbackForMe,
  type HandledFeedbackRow,
} from "@/features/feedback/services/feedbackService";
import type { FeedbackAckOutcome } from "@/shared/types/feedback.types";

const DISABLED_USER = "_signed_out_";

/**
 * The signed-in user's handled feedback, kept live, plus ✓ / ✗ acknowledgement.
 * Ack removes the row optimistically and restores it if the update fails.
 */
export function useHandledFeedback() {
  const { user } = useAuthContext();
  const userId = user?.id ?? null;
  const queryClient = useQueryClient();
  const key = feedbackKeys.handledForMe(userId ?? DISABLED_USER);

  const query = useQuery({
    queryKey: key,
    queryFn: () => listHandledFeedbackForMe(userId!),
    enabled: Boolean(userId),
  });

  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: key });
  }, [queryClient, key]);

  useTableSubscription({
    table: "app_feedback",
    filter: userId ? `user_id=eq.${userId}` : undefined,
    enabled: Boolean(userId),
    onChange: refresh,
    pollMs: 60_000,
  });

  const ack = useMutation({
    mutationFn: ({ id, outcome }: { id: string; outcome: FeedbackAckOutcome }) =>
      ackFeedback(id, outcome),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<HandledFeedbackRow[]>(key);
      queryClient.setQueryData<HandledFeedbackRow[]>(key, (rows) =>
        (rows ?? []).filter((row) => row.id !== id)
      );
      return { previous };
    },
    onError: (_error, _vars, context) => {
      queryClient.setQueryData(key, context?.previous);
    },
  });

  return {
    handled: query.data ?? [],
    error: query.error?.message ?? ack.error?.message ?? null,
    acknowledge: (id: string, outcome: FeedbackAckOutcome) => ack.mutate({ id, outcome }),
    ackingId: ack.isPending ? (ack.variables?.id ?? null) : null,
  };
}
