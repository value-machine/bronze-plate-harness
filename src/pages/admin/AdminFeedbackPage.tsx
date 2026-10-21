import { FeedbackInbox } from "@/features/admin/feedback/components/FeedbackInbox";
import { appScrollContentClassName } from "@/shared/theme/appViewLayout";

export const AdminFeedbackPage = () => (
  <div className={appScrollContentClassName}>
    <div className="flex w-full max-w-5xl flex-col gap-4">
      <h1 className="font-heading text-2xl font-bold">Feedback</h1>
      <FeedbackInbox />
    </div>
  </div>
);
