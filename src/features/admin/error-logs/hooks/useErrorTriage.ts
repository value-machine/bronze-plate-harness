import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTableSubscription } from "@/shared/hooks/useTableSubscription";
import { errorLogKeys } from "@/features/admin/error-logs/api/keys";
import {
  formatErrorLogAgentPacket,
  listErrorLogs,
  updateErrorLogStatus,
} from "@/features/admin/error-logs/services/errorLogsAdminService";
import type { ErrorLogRow, ErrorLogStatus } from "@/shared/types/errorLog.types";

/** Admin error triage: live cluster list (debounced), status changes, agent packet. */
export function useErrorTriage() {
  const queryClient = useQueryClient();
  const [includeClosed, setIncludeClosed] = useState(false);
  const key = errorLogKeys.list(includeClosed);

  const query = useQuery({ queryKey: key, queryFn: () => listErrorLogs(includeClosed) });
  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: errorLogKeys.all });
  }, [queryClient]);
  // Error storms fire many row updates; a longer debounce keeps the list calm.
  useTableSubscription({ table: "error_logs", enabled: true, onChange: refresh, debounceMs: 3000 });

  const status = useMutation({
    mutationFn: ({ id, next }: { id: string; next: ErrorLogStatus }) =>
      updateErrorLogStatus(id, next),
    onSuccess: (_data, { id, next }) => {
      queryClient.setQueryData<ErrorLogRow[]>(key, (rows) =>
        (rows ?? [])
          .map((row) => (row.id === id ? { ...row, status: next } : row))
          .filter((row) => includeClosed || row.status === "open" || row.status === "review")
      );
    },
  });

  return {
    rows: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? status.error?.message ?? null,
    includeClosed,
    setIncludeClosed,
    setStatus: (id: string, next: ErrorLogStatus) => status.mutateAsync({ id, next }),
    isSaving: status.isPending,
    agentPacket: formatErrorLogAgentPacket,
  };
}
