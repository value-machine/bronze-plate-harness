export const errorLogKeys = {
  all: ["admin", "error-logs"] as const,
  list: (includeClosed: boolean) => [...errorLogKeys.all, "list", { includeClosed }] as const,
} as const;
