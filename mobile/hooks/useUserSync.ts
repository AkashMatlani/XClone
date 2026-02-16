import { useEffect,useRef  } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { useApiClient, userApi } from "@/utils/api";
import { useUser } from '@clerk/clerk-expo'

export const useUserSync = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const api = useApiClient();

  // Track last synced user id
  const lastSyncedUserId = useRef<string | null>(null);

  const syncUserMutation = useMutation({
    mutationFn: () => userApi.syncUser(api),
    onSuccess: (response: any) => {
      console.log("User synced:", response.data.user);
      lastSyncedUserId.current = user?.id || null; // update last synced user
    },
    onError: (error) => {
      console.error("User Sync failed:", error);
    },
  });

  useEffect(() => {
    // Do not sync until Clerk fully loaded
    if (!isLoaded) return;

    // Only sync if signed in
    if (!isSignedIn) return;

    // Only sync if user exists
    if (!user?.id) return;

    // Avoid syncing same user twice
    if (lastSyncedUserId.current === user.id) return;

    console.log("Syncing user:", user.id);
    syncUserMutation.mutate();
  }, [user?.id, isSignedIn, isLoaded]);

  return null;
};

