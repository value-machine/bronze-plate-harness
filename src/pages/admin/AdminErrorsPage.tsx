import { ErrorTriageList } from "@/features/admin/error-logs/components/ErrorTriageList";
import { appScrollContentClassName } from "@/shared/theme/appViewLayout";

export const AdminErrorsPage = () => (
  <div className={appScrollContentClassName}>
    <div className="flex w-full max-w-5xl flex-col gap-4">
      <h1 className="font-heading text-2xl font-bold">Errors</h1>
      <ErrorTriageList />
    </div>
  </div>
);
