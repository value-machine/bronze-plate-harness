import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAdminRole } from "@/shared/utils/authRole";
import { useAuthContext } from "@/shared/context/AuthContext";
import { useAuthBackendConfigured } from "@/shared/hooks/useAuthBackendConfigured";
import { useUserProfileQuery } from "@/features/auth/hooks/useUserProfileQuery";
import { DropdownMenu, DropdownMenuContent } from "@/components/common/DropdownMenu";
import { ProfileMenuContent } from "./ProfileMenuContent";
import { ProfileMenuTrigger } from "./ProfileMenuTrigger";
import { useAccountMenuActions } from "@/shared/hooks/useAccountMenuActions";
import { FeedbackDialog } from "@/features/feedback/components/FeedbackDialog";
import { StatusAlert } from "@/components/common/StatusAlert";

/**
 * ProfileMenu component for displaying user account information and sign-in options.
 * Shows sign-in buttons when user is not logged in, and profile/logout when logged in.
 */
export const ProfileMenu = () => {
  const { user } = useAuthContext();
  const { data: profile, isLoading: profileLoading } = useUserProfileQuery(user?.id ?? null);
  const { isConfigured: authBackendConfigured } = useAuthBackendConfigured();
  const [open, setOpen] = useState(false);
  const handleClose = useCallback(() => setOpen(false), []);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const handleSendFeedback = useCallback(() => {
    setOpen(false);
    setFeedbackSent(false);
    setFeedbackOpen(true);
  }, []);
  const navigate = useNavigate();
  const handleOpenAdmin = useCallback(
    (path: string) => {
      setOpen(false);
      void navigate(path);
    },
    [navigate]
  );
  const handleFeedbackSent = useCallback(() => {
    setFeedbackOpen(false);
    setFeedbackSent(true);
  }, []);

  const { handleSignIn, handleGoToLogin, handleSignOut } = useAccountMenuActions({
    onClose: handleClose,
  });

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <ProfileMenuTrigger user={user} profile={profile ?? null} />
        <DropdownMenuContent id="account-menu" align="end" className="w-[240px] max-w-[280px]">
          <ProfileMenuContent
            isLoggedIn={user !== null}
            authBackendConfigured={authBackendConfigured}
            user={user}
            profile={profile ?? null}
            profileLoading={profileLoading}
            onSignInWithGoogle={handleSignIn}
            onGoToLogin={handleGoToLogin}
            onSignOut={handleSignOut}
            onSendFeedback={handleSendFeedback}
            onOpenAdmin={isAdminRole(user) ? handleOpenAdmin : undefined}
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <FeedbackDialog
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        onSent={handleFeedbackSent}
      />
      <StatusAlert
        message={feedbackSent ? "Thanks! Your feedback was sent." : null}
        onDismiss={() => setFeedbackSent(false)}
      />
    </>
  );
};
