import { LogIn, LogOut } from "lucide-react";
import { ProfileInfo } from "./ProfileInfo";
import { SignInMenuItems } from "./SignInMenuItems";
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
}

export const ProfileMenuContent = ({
  isLoggedIn,
  authBackendConfigured,
  user,
  profile,
  profileLoading,
  onSignInWithGoogle,
  onGoToLogin,
  onSignOut,
}: ProfileMenuContentProps) => {
  if (isLoggedIn) {
    return (
      <>
        <ProfileInfo user={user} profile={profile} profileLoading={profileLoading} />
        <DropdownMenuSeparator />
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
