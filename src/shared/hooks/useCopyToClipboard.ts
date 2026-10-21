import { useCallback, useState } from "react";

/** Copy text and expose a short-lived "copied" flag for a confirmation message. */
export function useCopyToClipboard(resetMs = 2500) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(
    async (text: string) => {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetMs);
    },
    [resetMs]
  );
  return { copy, copied };
}
