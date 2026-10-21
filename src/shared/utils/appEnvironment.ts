/**
 * Which deployment this browser session runs in. Used to tag error logs and feedback.
 * Order: local hostnames, then VITE_APP_ENVIRONMENT (set per deploy), else "unknown".
 */
export type AppEnvironment = "local_dev" | "preview" | "staging" | "production" | "unknown";

const DEPLOY_ENVIRONMENTS: ReadonlySet<string> = new Set(["preview", "staging", "production"]);
const LOCAL_HOSTNAMES: ReadonlySet<string> = new Set(["localhost", "127.0.0.1", "[::1]"]);

export function detectEnvironment(
  hostname: string = globalThis.location?.hostname ?? "",
  configured: string | undefined = import.meta.env.VITE_APP_ENVIRONMENT
): AppEnvironment {
  if (LOCAL_HOSTNAMES.has(hostname)) {
    return "local_dev";
  }
  if (configured && DEPLOY_ENVIRONMENTS.has(configured)) {
    return configured as AppEnvironment;
  }
  return "unknown";
}

/** App version baked in at build time (package.json unless VITE_APP_VERSION overrides it). */
export function getAppVersion(): string {
  return import.meta.env.VITE_APP_VERSION || "unknown";
}
