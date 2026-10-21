import { lazy, Suspense } from "react";
import type { ErrorInfo } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryProvider } from "@/shared/context/QueryProvider";
import { AuthProvider } from "@/shared/context/AuthContext";
import { ColorModeProvider } from "@/shared/context/ColorModeContext";
import { Topbar } from "@/layouts/Topbar";
import { DevTasksFab } from "@/features/tasks/components/DevTasksFab/DevTasksFab";
import { QueryDevtoolsGate } from "@/components/common/QueryDevtoolsGate";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { PageLoadingState } from "@/components/common/PageLoadingState";
import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary";
import { logAppError } from "@/shared/services/errorLoggingService";
import { RequireAdmin } from "@/routes/guards/RequireAdmin";

const HomePage = lazy(() => import("@/pages/HomePage").then((m) => ({ default: m.HomePage })));
const TasksPage = lazy(() =>
  import("@/pages/tasks/TasksPage").then((m) => ({ default: m.TasksPage }))
);
const LoginPage = lazy(() => import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const ResetPasswordPage = lazy(() =>
  import("@/pages/ResetPasswordPage").then((m) => ({ default: m.ResetPasswordPage }))
);
const AdminFeedbackPage = lazy(() =>
  import("@/pages/admin/AdminFeedbackPage").then((m) => ({ default: m.AdminFeedbackPage }))
);
const AdminErrorsPage = lazy(() =>
  import("@/pages/admin/AdminErrorsPage").then((m) => ({ default: m.AdminErrorsPage }))
);
const AuthCallbackPage = lazy(() =>
  import("@/pages/AuthCallbackPage").then((m) => ({ default: m.AuthCallbackPage }))
);

function logBoundaryError(error: Error, info: ErrorInfo): void {
  void logAppError(error, "react_boundary", "react_boundary", {
    extraStack: info.componentStack ?? undefined,
  });
}

function AppContent() {
  const location = useLocation();
  const isTasksRoute = location.pathname === "/tasks";

  return (
    <>
      {!isTasksRoute && <Topbar />}
      <div className={isTasksRoute ? undefined : "pt-toolbar"}>
        <QueryErrorBoundary onError={logBoundaryError}>
          <Suspense fallback={<PageLoadingState />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/admin/feedback"
                  element={
                    <RequireAdmin>
                      <AdminFeedbackPage />
                    </RequireAdmin>
                  }
                />
                <Route
                  path="/admin/errors"
                  element={
                    <RequireAdmin>
                      <AdminErrorsPage />
                    </RequireAdmin>
                  }
                />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </QueryErrorBoundary>
      </div>
      <DevTasksFab />
      <QueryDevtoolsGate />
    </>
  );
}

function App() {
  return (
    <ColorModeProvider>
      <QueryProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </QueryProvider>
    </ColorModeProvider>
  );
}

export default App;
