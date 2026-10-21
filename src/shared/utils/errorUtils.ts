/**
 * Shared error message extraction for catch blocks and service layers.
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") {
      return message;
    }
  }
  return "";
};

function readStringField(error: object, key: string): string | undefined {
  const value = (error as Record<string, unknown>)[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

/**
 * Log-oriented error text: the message plus PostgREST `code`, `details` and `hint` when present.
 * User-facing copy keeps using `getErrorMessage`.
 */
export const getErrorDetail = (error: unknown): string => {
  const message = getErrorMessage(error) || "Unknown error";
  if (!error || typeof error !== "object" || error instanceof Error) {
    return message;
  }
  const code = readStringField(error, "code");
  const details = readStringField(error, "details");
  const hint = readStringField(error, "hint");
  return [
    code ? `[${code}] ${message}` : message,
    details ? `Details: ${details}` : "",
    hint ? `Hint: ${hint}` : "",
  ]
    .filter(Boolean)
    .join(" ");
};
