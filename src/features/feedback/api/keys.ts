export const feedbackKeys = {
  all: ["feedback"] as const,
  handledForMe: (userId: string) => [...feedbackKeys.all, "handled", userId] as const,
} as const;
