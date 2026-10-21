import { Bug, Inbox, LogIn, LogOut, MessageSquarePlus } from "lucide-react";
import { ProfileInfo } from "./ProfileInfo";
import { SignInMenuItems } from "./SignInMenuItems";
import { ColorModeToggle } from "./ColorModeToggle";
import type { User } from "@/features/auth/types/auth.types";
import type { UserProfile } from "@/features/auth/types/auth.types";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/common/DropdownMenu";

interface ProfileMenuContentProps {
  isLoggedIn: boolean;
  authBackendConfigured: boolean;
  user: User | null;
  profile: UserProfile | null;
  profileLoading: boolean;
  onSignInWithGoogle: () => void;
  onGoToLogin: () => void;
  onSignOut: () => void;
  onSendFeedback: () => void;
  /** Shown only for admins (JWT app_metadata.role). */
  onOpenAdmin?: (path: "/admin/feedback" | "/admin/errors") => void;
}

/** Account section for the current auth state (signed in, signed out, or auth not configured). */
const AccountMenuItems = ({
  isLoggedIn,
  authBackendConfigured,
  user,
  profile,
  profileLoading,
  onSignInWithGoogle,
  onGoToLogin,
  onSignOut,
  onSendFeedback,
  onOpenAdmin,
}: ProfileMenuContentProps) => {
  if (isLoggedIn) {
    return (
      <>
        <ProfileInfo user={user} profile={profile} profileLoading={profileLoading} />
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onSendFeedback}>
          <MessageSquarePlus />
          Send feedback
        </DropdownMenuItem>
        {onOpenAdmin && (
          <>
            <DropdownMenuItem onSelect={() => onOpenAdmin("/admin/feedback")}>
              <Inbox />
              Feedback inbox
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onOpenAdmin("/admin/errors")}>
              <Bug />
              Errors
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onSelect={onSignOut}>
          <LogOut />
          Sign Out
        </DropdownMenuItem>
      </>
    );
  }

  if (authBackendConfigured) {
    return <SignInMenuItems onSignInWithGoogle={onSignInWithGoogle} onGoToLogin={onGoToLogin} />;
  }

  return (
    <DropdownMenuItem disabled>
      <LogIn />
      Supabase not configured
    </DropdownMenuItem>
  );
};

/** Account items, then a footer with the color mode toggle in the bottom-right corner. */
export const ProfileMenuContent = (props: ProfileMenuContentProps) => (
  <>
    <AccountMenuItems {...props} />
    <DropdownMenuSeparator />
    <div className="flex justify-end">
      <ColorModeToggle />
    </div>
  </>
);
