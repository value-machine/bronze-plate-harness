export const adminFeedbackKeys = {
  all: ["admin", "feedback"] as const,
  inbox: () => [...adminFeedbackKeys.all, "inbox"] as const,
} as const;
