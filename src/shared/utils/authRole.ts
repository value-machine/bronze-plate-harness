import type { User } from "@/features/auth/types/auth.types";

const ADMIN_ROLES: ReadonlySet<string> = new Set(["admin", "super-admin"]);

/**
 * Admin per JWT `app_metadata.role` — the same rule as the database's `is_admin_user()`.
 * UI gating only; the database enforces access.
 */
export function isAdminRole(user: Pick<User, "appRole"> | null | undefined): boolean {
  return Boolean(user?.appRole && ADMIN_ROLES.has(user.appRole));
}
