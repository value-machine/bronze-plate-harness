import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/shared/context/AuthContext";
import { isAdminRole } from "@/shared/utils/authRole";
import { PageLoadingState } from "@/components/common/PageLoadingState";

/** Renders children for admins; everyone else goes home. The database enforces the same rule. */
export const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuthContext();
  if (loading) {
    return <PageLoadingState />;
  }
  if (!isAdminRole(user)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
