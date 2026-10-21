import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTableSubscription } from "@/shared/hooks/useTableSubscription";
import { adminFeedbackKeys } from "@/features/admin/feedback/api/keys";
import {
  formatFeedbackAgentPacket,
  listFeedbackInbox,
  updateFeedbackStatus,
} from "@/features/admin/feedback/services/adminFeedbackService";
import type { AdminFeedbackStatus, FeedbackRow } from "@/shared/types/feedback.types";

/** Admin inbox: live list, selection, status changes and the agent packet. */
export function useFeedbackInbox() {
  const queryClient = useQueryClient();
  const key = adminFeedbackKeys.inbox();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const query = useQuery({ queryKey: key, queryFn: listFeedbackInbox });
  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: key });
  }, [queryClient, key]);
  useTableSubscription({ table: "app_feedback", enabled: true, onChange: refresh });

  const status = useMutation({
    mutationFn: ({ id, next }: { id: string; next: AdminFeedbackStatus }) =>
      updateFeedbackStatus(id, next),
    onSuccess: (_data, { id, next }) => {
      // The inbox lists open/review only: drop the row unless it went back to open.
      queryClient.setQueryData<FeedbackRow[]>(key, (rows) =>
        (rows ?? [])
          .map((row) => (row.id === id ? { ...row, status: next } : row))
          .filter((row) => row.status === "open" || row.status === "review")
      );
    },
  });

  const rows = useMemo(() => query.data ?? [], [query.data]);
  const selected = rows.find((row) => row.id === selectedId) ?? null;

  return {
    rows,
    isLoading: query.isLoading,
    error: query.error?.message ?? status.error?.message ?? null,
    selected,
    select: setSelectedId,
    setStatus: (id: string, next: AdminFeedbackStatus) => status.mutateAsync({ id, next }),
    isSaving: status.isPending,
    agentPacket: selected ? formatFeedbackAgentPacket(selected) : "",
  };
}
